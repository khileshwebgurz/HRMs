<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Models\LeaveTypes;
use App\Models\Employees;
use App\Models\EmployeeLeaveLogs;
use App\Models\LeaveRules;
use App\Models\Roles;
use App\Models\Notifications;

class LeavesController extends Controller
{
    public function index()
    {
        $data = LeaveTypes::all();
        return response()->json(['status' => 200, 'data' => $data]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type_name' => 'required|unique:leave_types|max:50|regex:/^[a-zA-Z\s]+$/'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        LeaveTypes::create(['type_name' => $request->type_name]);

        return response()->json(['status' => 200, 'message' => 'Leave Type added successfully']);
    }

    public function update(Request $request, $id)
    {
        $leave = LeaveTypes::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'type_name' => 'required|max:50|regex:/^[a-zA-Z\s]+$/'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        $leave->update(['type_name' => $request->type_name]);

        return response()->json(['status' => 200, 'message' => 'Leave Type updated']);
    }

    public function logs(Request $request)
    {
        $user = auth('api')->user();
        $role = Roles::find($user->user_role);
        $data = collect();

        if ($role->view == 2) {
            $data = EmployeeLeaveLogs::where('employee_id', $user->id)->latest()->get();
        } elseif ($role->view == 3) {
            $empIds = Employees::where('manager_id', $user->id)->pluck('id');
            $data = EmployeeLeaveLogs::whereIn('employee_id', $empIds)->latest()->get();
        } elseif ($role->view == 4) {
            $empIds = Employees::where('manager_id', $user->id)->orWhere('id', $user->id)->pluck('id');
            $data = EmployeeLeaveLogs::whereIn('employee_id', $empIds)->latest()->get();
        } elseif ($role->view == 5) {
            $data = EmployeeLeaveLogs::latest()->get();
        }

        return response()->json([
            'status' => 200,
            'data' => $data->map(function ($row) {
                return [
                    'id' => $row->id,
                    'employee' => $row->employee->name ?? '',
                    'leave_type' => LeaveRules::find($row->leave_type)->rule_name ?? '',
                    'start_date' => $row->start_date,
                    'end_date' => $row->end_date,
                    'status_label' => $this->getStatusLabel($row->status),
                    'actions' => $this->getActions($row),
                ];
            })
        ]);
    }

    public function decline(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'notes' => 'required',
            'get_approval_id' => 'required|exists:employee_leave_logs,id'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        $log = EmployeeLeaveLogs::find($request->get_approval_id);

        $log->update([
            'status' => 3,
            'approved_by' => auth('api')->id(),
            'manager_reason' => $request->notes
        ]);

        $employee = Employees::find($log->employee_id);
        $approver = Employees::find(auth('api')->id());

        Mail::send('emails.leave-rejected-mail', [
            'to_name' => $employee->name,
            'employee' => $approver->name,
            'leave_type' => $log->leave_type,
            'start_date' => $log->start_date,
            'end_date' => $log->end_date,
            'total_applied_leaves' => $log->total_applied_leaves,
            'reason' => $log->manager_reason
        ], function ($message) use ($employee) {
            $message->to($employee->email)->subject('Leave Application Rejected');
        });

        Notifications::create([
            'type_id' => 'attendance_approval_request',
            'message' => $employee->name . "'s leave request has been rejected.",
            'page_id' => $log->id,
            'notify_to' => $log->employee_id
        ]);

        return response()->json(['status' => 200, 'message' => 'Leave declined and notification sent.']);
    }

    private function getStatusLabel($status)
    {
        return match ($status) {
            1 => 'Pending',
            2 => 'Approved',
            3 => 'Declined',
            4 => 'Deleted',
            default => 'Unknown',
        };
    }

    private function getActions($log)
    {
        if (in_array($log->status, [2, 3])) {
            return $this->getStatusLabel($log->status);
        }

        return [
            'can_approve' => true,
            'can_decline' => true,
            'log_id' => $log->id
        ];
    }
}
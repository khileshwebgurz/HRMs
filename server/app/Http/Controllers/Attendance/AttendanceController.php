<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;
use App\Models\EmployeeAttendance;
use App\Models\ObCandidates;
use App\Models\AttendanceRules;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
// use Yajra\DataTables\Facades\DataTables;

class AttendanceController extends Controller
{

    public function attendanceLog(Request $request)
    {
        // Permission check

        $permissions = Session::get('permission');
        Log::info('My permission data from attendance page is  >>>>', ['permission' => $permissions]);

        // if (!is_array($permissions) || !isset($permissions[0]) || !in_array('anomalies_requests', $permissions[0])) {
        //     Log::info('Inside');
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }


        // if (!in_array('anomalies_requests', Session::get('permission')[0])) {
        //     return response()->json(['message' => 'Unauthorized'], 403);
        // }

        // Fetch attendance records
        $data = EmployeeAttendance::with('employee')
            ->latest()
            ->get()
            ->where('emp_apply', 1)
            ->where('approve_status', 0);

        Log::info('My request data is >>>>', ['role' => $data]);

        // Process and transform each record
        $result = $data->map(function ($row) {
            $id = $row->employee_id;
            $obCandidate = ObCandidates::where('office_employee_id', $id)->first();

            if (!$obCandidate) return null;

            $attendance = AttendanceRules::where('id', $obCandidate->attendance_rule_id)->first();
            if (!$attendance) return null;

            $response = [
                'id' => $row->id,
                'emp_name' => $row->employee->name ?? 'N/A',
                'clock_in' => $row->clock_in,
                'clock_in_diff' => null,
                'clock_out' => $row->clock_out,
                'clock_out_diff' => null,
                'work_duration' => $row->work_duration,
                'work_duration_diff' => null,
                'total_breaks' => $row->total_breaks,
                'break_diff' => null,
                'reason' => $row->reason,
                'approve_status' => $row->approve_status,
                'action_buttons' => null // Simulating the previous Accept/Reject UI as flags
            ];

            // CLOCK IN logic
            if ($row->clock_in && $attendance->shift_in_time) {
                $shiftStart = Carbon::parse($attendance->shift_in_time);
                $actualIn = Carbon::parse($row->clock_in);
                if ($actualIn > $shiftStart) {
                    $response['clock_in_diff'] = $shiftStart->diff($actualIn)->format('%H:%I:%S');
                }
            }

            // CLOCK OUT logic
            if ($row->clock_out && $attendance->shift_out_time) {
                $shiftEnd = Carbon::parse($attendance->shift_out_time);
                $actualOut = Carbon::parse($row->clock_out);
                if ($actualOut < $shiftEnd) {
                    $response['clock_out_diff'] = $shiftEnd->diff($actualOut)->format('%H:%I:%S');
                }
            }

            // WORK DURATION logic
            if ($row->work_duration && $attendance->work_full_time_duration) {
                $expectedWork = Carbon::parse($attendance->work_full_time_duration);
                $actualWork = Carbon::parse($row->work_duration);
                if ($actualWork < $expectedWork) {
                    $response['work_duration_diff'] = $expectedWork->diff($actualWork)->format('%H:%I:%S');
                }
            }

            // BREAK TIME logic
            if (!is_null($row->total_breaks) && !is_null($attendance->max_break)) {
                $extraBreak = $row->total_breaks - $attendance->max_break;
                if ($extraBreak > 0) {
                    $response['break_diff'] = $extraBreak;
                }
            }

            // ACTION LOGIC (simulate buttons)
            if (in_array($row->approve_status, [1, 2])) {
                $response['action_buttons'] = $row->approve_status == 1 ? 'Approved' : 'Declined';
            } else {
                $response['action_buttons'] = [
                    'accept' => true,
                    'reject' => true,
                    'notes' => $row->reason,
                    'id' => $row->id,
                ];
            }

            return $response;
        })->filter()->values(); // filter out nulls, reindex

        // Return final JSON
        return response()->json([
            'status' => 200,
            'data' => $result
        ]);
    }
}

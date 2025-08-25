<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Roles;
use App\Models\Permissions;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Validator;
use App\Models\SalarySlip;
use App\Models\Employees;
use App\Models\EmployeeAttendance;
use App\Models\ObCandidates;
use App\Models\SalarySlipsDetail;
use App\Models\Salary_Slip_Request;
use App\Models\Notifications;
use Illuminate\Support\Facades\Log;

class SalaryslipController extends Controller
{
    // public function salaryslip(Request $request)
    // {
    //     if ($request->ajax()) {
    //         $data = Salary_Slip_Request::latest();

    //         return DataTables::of($data)
    //             ->addIndexColumn()
    //             ->editColumn('name', function ($row) {
    //                 $name = Employees::where('id', $row->employee_id)->first();
    //                 return $name['name'] ?? '';
    //             })
    //             ->editColumn('month', function ($row) {
    //                 $month = SalarySlip::where('relation_id', $row->slip_relation)->pluck('month')->toArray();
    //                 $monthdata = "";
    //                 foreach ($month as $key => $value) {
    //                     $monthdata .= date('F, ', strtotime(date('Y' . '-' . $value)));
    //                 }
    //                 $remove = rtrim($monthdata, " ,");
    //                 return $remove;
    //             })
    //             ->editColumn('status', function ($row) {
    //                 return $row->status == '1' ? 'Approved' : 'Pending';
    //             })
    //             ->editColumn('action', function ($row) {
    //                 return $row->status == '1'
    //                     ? 'Approved'
    //                     : 'Pending for Approval';
    //             })
    //             ->make(true);
    //     }

    //     return response()->json([
    //         'success' => true,
    //         'message' => 'Salary slip requests fetched successfully',
    //     ]);
    // }


    public function salaryslip(Request $request)
    {
        $data = Salary_Slip_Request::latest();

        Log::info('the data of all salary slip request ', ['$data is >'=> $data]);

        if ($request->ajax()) {
            return DataTables::of($data)
                ->addIndexColumn()
                ->editColumn('name', function ($row) {
                    $name = Employees::where('id', $row->employee_id)->first();
                    return $name['name'] ?? '';
                })
                ->editColumn('month', function ($row) {
                    $month = SalarySlip::where('relation_id', $row->slip_relation)->pluck('month')->toArray();
                    $monthdata = "";
                    foreach ($month as $key => $value) {
                        $monthdata .= date('F, ', strtotime(date('Y' . '-' . $value)));
                    }
                    $remove = rtrim($monthdata, " ,");
                    return $remove;
                })
                ->editColumn('status', function ($row) {
                    return $row->status == '1' ? 'Approved' : 'Pending';
                })
                ->editColumn('action', function ($row) {
                    return $row->status == '1'
                        ? 'Approved'
                        : 'Pending for Approval';
                })
                ->make(true);
        }

        // Non-AJAX request → return full JSON with data
        $salarySlips = $data->get()->map(function ($row) {
            $employee = Employees::where('id', $row->employee_id)->first();
            $months = SalarySlip::where('relation_id', $row->slip_relation)->pluck('month')->toArray();

            $monthdata = "";
            foreach ($months as $key => $value) {
                $monthdata .= date('F, ', strtotime(date('Y' . '-' . $value)));
            }
            $remove = rtrim($monthdata, " ,");

            return [
                'id' => $row->id,
                'name' => $employee['name'] ?? '',
                'month' => $remove,
                'status' => $row->status == '1' ? 'Approved' : 'Pending',
                'action' => $row->status == '1' ? 'Approved' : 'Pending for Approval',
            ];
        });

        return response()->json([
            'success' => true,
            'message' => 'Salary slip requests fetched successfully',
            'data' => $salarySlips
        ]);
    }


    public function salaryslipdetail($id)
    {
        $slips = Salary_Slip_Request::find($id);
        if (!$slips) {
            return response()->json(['success' => false, 'message' => 'Salary slip request not found'], 404);
        }

        $emp = Employees::where('id', $slips->employee_id)->first();
        $des = ObCandidates::where('office_employee_id', $emp->id)->first();
        $month = SalarySlip::where('relation_id', $slips->slip_relation)->pluck('month')->toArray();

        $responseData = [];

        foreach ($month as $key => $value) {
            $emolument_names = SalarySlipsDetail::$emolument;
            $currentDate = date('Y-m-d');
            $startDate = date('Y-m-d', strtotime(date('Y' . '-' . $value . '-26') . ' - 1 month'));

            if ($startDate > $currentDate) {
                $from = date('Y-m-d', strtotime(date('Y' . '-' . $value . '-26') . ' - 13 month'));
                $to = date('Y-m-d', strtotime(date('Y' . '-' . $value . '-25') . ' - 12 month'));
                $slipdate = date('F, Y', strtotime(date('Y' . '-' . $value) . ' - 12 month'));
            } else {
                $from = date('Y-m-d', strtotime(date('Y' . '-' . $value . '-26') . ' - 1 month'));
                $to = date('Y-m-d', strtotime(date('Y' . '-' . $value . '-25')));
                $slipdate = date('F, Y', strtotime(date('Y' . '-' . $value)));
            }

            $leave = EmployeeAttendance::where('employee_id', $emp->id)->whereBetween('clock_date', [$from, $to])->distinct()->where('status', 'L')->get()->unique('clock_date')->count();
            $absent = EmployeeAttendance::where('employee_id', $emp->id)->whereBetween('clock_date', [$from, $to])->distinct()->where('status', 'A')->get()->unique('clock_date')->count();
            $half_leave = EmployeeAttendance::where('employee_id', $emp->id)->whereBetween('clock_date', [$from, $to])->distinct()->where('status', 'HL')->get()->unique('clock_date')->count() / 2;
            $short_leave = EmployeeAttendance::where('employee_id', $emp->id)->whereBetween('clock_date', [$from, $to])->distinct()->where('status', 'SL')->get()->unique('clock_date')->count() / 4;

            $arr = $leave + $absent + $half_leave + $short_leave;
            $total = noofworkingdays() - $arr;
            $cal = $emp['salary'] / noofworkingdays();
            $final_salary = $total * $cal;
            $amount = round($final_salary, 2);
            $deduction = $emp->salary - $amount;
            $fundcheck = 100;
            $cashin = ($emp->salary - $deduction - $fundcheck);

            $emoluments = [];
            foreach ($emolument_names as $name_key => $name_value) {
                $percent = $name_value['percentage'] * $emp->salary / 100;
                $emoluments[] = [
                    'label' => $name_value['label'],
                    'amount' => $percent,
                ];
            }

            $responseData[] = [
                'slipdate' => $slipdate,
                'employee' => [
                    'id' => $emp->id,
                    'name' => $emp->name,
                    'designation' => $des->job_title ?? '',
                    'salary' => $emp->salary,
                ],
                'attendance' => [
                    'leave' => $leave,
                    'absent' => $absent,
                    'half_leave' => $half_leave,
                    'short_leave' => $short_leave,
                    'present_days' => $total,
                ],
                'deduction' => $deduction,
                'fund' => $fundcheck,
                'bonus' => 0,
                'cash_in_hand' => $cashin,
                'emoluments' => $emoluments,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $responseData,
        ]);
    }

    public function salaryslipdetailinsert(Request $request)
    {
        $slip_months = SalarySlip::where("relation_id", $request->relation)->pluck('id')->toArray();

        foreach ($slip_months as $keys => $value) {
            $slip_detail = SalarySlip::find($value);
            $slip_detail->gross_salary = $request['gross_salary' . $keys];
            $slip_detail->deductions = $request['deduction' . $keys];
            $slip_detail->fund = $request['fund' . $keys];
            $slip_detail->bonus = $request['bonus' . $keys];
            $slip_detail->cash_in_hand = $request['cash' . $keys];
            $slip_detail->status = '1';
            $slip_detail->update();

            $data = SalarySlipsDetail::$emolument;
            foreach ($data as $detail_key => $detail_value) {
                $salary = new SalarySlipsDetail;
                $salary->request_id = $value;
                $salary->present_days = $request['working' . $keys];
                $salary->key_name = $detail_value['label'];
                $salary->amount = $request->fields['salary_' . $keys]['subfields'][$detail_key]['field1'] ?? 0;
                $salary->deduction = $request->fields['salary_' . $keys]['subfields'][$detail_key]['field2'] ?? 0;
                $salary->salary = $request->fields['salary_' . $keys]['subfields'][$detail_key]['field3'] ?? 0;
                $salary->save();
            }
        }

        $slip_request = Salary_Slip_Request::find($request->id);
        $slip_request->status = '1';
        $slip_request->save();


        $find_emp = SalarySlip::where("relation_id", $request->relation)->first();
        $emp = Employees::where('id', $find_emp->emp_id)->first();

        $noti = new Notifications;
        $noti->type_id = 'slip_gernated';
        $noti->message = 'Your salary slip is gernated';
        $noti->page_id = $request->id;
        $noti->notify_to = $find_emp->emp_id;
        $noti->notify_from = Auth::user()->id;
        $noti->notify_type = $emp->is_manager == '1' ? '2' : '3';
        if ($emp->is_manager != '1') {
            $noti->notify_panel = '1';
        }
        $noti->save();

        $to_name = $emp->name;
        $to_email = $emp->email;
        $data = [
            'name' => $to_name,
            'msg' => 'Your salary slip is approved.'
        ];
        Mail::send('emails.salary-slip-gernate', $data, function ($message) use ($to_name, $to_email) {
            $message->to($to_email, $to_name)->subject('Salary Slip');
        });

        if (Mail::failures()) {
            return response()->json([
                'success' => false,
                'message' => 'Email is incorrect',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'Salary Slip Gernated'
        ]);
    }
}

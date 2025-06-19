<?php

namespace App\Http\Controllers\Leaves;

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
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use App\Models\EmployeeLeaveRules;
use App\Models\Holidays;
use Illuminate\Support\Facades\Log;

// use App\Models\CompanyData;
// use App\Models\Settings;
// use App\Models\ObCandidates;
// use App\Models\Candidates;
// use App\Models\CandidateQuestions;
// use App\Models\User;




class LeavesController extends Controller
{
    public function index()
    {
        $data = LeaveTypes::all();
        $permission_role =Roles::where('id',Auth::user()->user_role)->first();
        Log::info('my permission is :', ['datas' => $permission_role]);
        Log::info('my permission role  are :', ['datas' => $permission_role->view]);
       
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
        Log::info('my datas are :', ['datas' => $user]);
        $role = Roles::find($user->user_role);
    
        $data = collect();
        

        if ($role->view == '2') {
            $data = EmployeeLeaveLogs::where('employee_id', $user->id)->orderBy('created_at', 'desc')->get();
        } elseif ($role->view == '3') {
            $employeeIds = Employees::where('manager_id', $user->id)->pluck('id')->toArray();
            $data = EmployeeLeaveLogs::whereIn('employee_id', $employeeIds)->orderBy('created_at', 'desc')->get();
        } elseif ($role->view == '4') {
            $employeeIds = Employees::where('manager_id', $user->id)
                ->orWhere('id', $user->id)
                ->pluck('id')->toArray();
            $data = EmployeeLeaveLogs::whereIn('employee_id', $employeeIds)->orderBy('created_at', 'desc')->get();
        } elseif ($role->view == '5') {
            $data = EmployeeLeaveLogs::orderBy('created_at', 'desc')->get();
        }
    
        // Filter by date range if provided
        if (!empty($request->startdate) || !empty($request->enddate)) {
            $data = $data->filter(function ($item) use ($request) {
                return $item->created_at >= $request->startdate && $item->created_at <= $request->enddate;
            });
        }
    
        // Transform data
        $transformed = $data->map(function ($row) {
            $leave = LeaveRules::find($row->leave_type);
            $start_half = $row->start_half == 2 ? 'Second Half' : 'First Half';
            $end_half = $row->end_half == 2 ? 'Second Half' : 'First Half';
    
            if ($row->status == 2) {
                $status_label = 'Approved';
            } elseif ($row->status == 3) {
                $status_label = 'Declined';
            } elseif ($row->status == 4) {
                $status_label = 'Deleted';
            } else {
                $status_label = 'Pending';
            }
    
            $actions = 'view'; 
    
            return [
                'id' => $row->id,
                'employee_name' => $row->employee->name ?? '',
                'leave_type' => $leave->rule_name ?? '',
                'start_date' => [
                    'date' => date('d-m-Y', strtotime($row->start_date)),
                    'half' => $start_half
                ],
                'end_date' => [
                    'date' => date('d-m-Y', strtotime($row->end_date)),
                    'half' => $end_half
                ],
                'status' => $row->status,
                'status_label' => $status_label,
                'approve_status' => $row->approve_status,
                'reason' => $row->reason,
                'actions' => $actions
            ];
        });
    
        return response()->json([
            'status' => 200,
            'data' => $transformed
        ]);
    }



    public function decline(Request $request)
    {
        Log::info('My decline request is >>>>', ['role' => $request->get_approval_id]);
        $validator = Validator::make($request->all(), [
            'notes' => 'required',
            'get_approval_id' => 'required|exists:employee_leave_logs,id'
        ]);

        Log::info('My validator request is >>>>', ['validator' => $validator]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        $log = EmployeeLeaveLogs::find($request->get_approval_id);

        $log->update([
            'status' => 3,
            'approved_by' => auth('api')->id(),
            'manager_reason' => $request->notes
        ]);

        // $employee = Employees::find($log->employee_id);
        // $approver = Employees::find(auth('api')->id());

        // Mail::send('emails.leave-rejected-mail', [
        //     'to_name' => $employee->name,
        //     'employee' => $approver->name,
        //     'leave_type' => $log->leave_type,
        //     'start_date' => $log->start_date,
        //     'end_date' => $log->end_date,
        //     'total_applied_leaves' => $log->total_applied_leaves,
        //     'reason' => $log->manager_reason
        // ], function ($message) use ($employee) {
        //     $message->to($employee->email)->subject('Leave Application Rejected');
        // });

        // Notifications::create([
        //     'type_id' => 'attendance_approval_request',
        //     'message' => $employee->name . "'s leave request has been rejected.",
        //     'page_id' => $log->id,
        //     'notify_to' => $log->employee_id
        // ]);

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


    public function leavesDetailAllEmp(Request $request)
    {
        $loginUser = Auth::user();
        $user = Employees::findOrFail($loginUser->id);

        $teams = getTeamListByManagerId($loginUser->id);
        $userIds = $teams->pluck('id')->toArray();

        $teamLeaveLogs = EmployeeLeaveLogs::whereIn('employee_id', $userIds)->get();

        $userLeaveRuleIds = EmployeeLeaveRules::where('employee_id', $user->id)->pluck('leave_rule_id')->toArray();
        $leaveRules = LeaveRules::whereIn('id', $userLeaveRuleIds)->get();

        $year = now()->year;

        $monthlyLeaves = EmployeeLeaveLogs::selectRaw("TO_CHAR(created_at, 'MM') as month, SUM(total_applied_leaves) as total_leaves")
            ->where('employee_id', $user->id)
            ->whereYear('created_at', $year)
            ->groupBy('month')
            ->get()
            ->pluck('total_leaves', 'month')
            ->toArray();
        


        $approvedLeaves = EmployeeLeaveLogs::where('employee_id', $user->id)
            ->whereIn('status', ['1', '2'])
            ->whereYear('created_at', $year)
            ->pluck('total_applied_leaves')
            ->toArray();

        $restrictedHolidays = Holidays::where('status', '3')->pluck('date_of_event')->map(function ($date) {
            return Carbon::parse($date)->toDateString();
        })->toArray();



        return response()->json([
            'user' => $user,
            'loginuser' => $loginUser,
            'data' => $teamLeaveLogs,
            'byMonthLeaves' => $monthlyLeaves,
            'leave' => $leaveRules,
            'leave_type' => $userLeaveRuleIds,
            'restricted_holidays' => $restrictedHolidays,
            'a' => $restrictedHolidays, // optional duplicate
            'leave_data' => $approvedLeaves,
        ]);
    }


   // App\Http\Controllers\YourController.php

    public function employeeLogs(Request $request)
    {
        $loginUser = Auth::user();

        $leaveLogs = EmployeeLeaveLogs::where('employee_id', $loginUser->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($log) {
                $statusText = match ((int) $log->status) {
                    2 => 'Approved',
                    3 => 'Declined',
                    4 => 'Deleted',
                    default => 'Pending',
                };

                $leaveType = optional(LeaveRules::find($log->leave_type))->rule_name;

                $actionHtml = '-';
                if ((int)$log->status === 1) { // Pending
                    $actionHtml = '<div class="btn-group btn-group-sm">';
                    $actionHtml .= '<a class="btn btn-danger deleteLeave" title="delete leave" data-leaveid="' . $log->id . '" href="javascript:void(0)"><i class="fas fa-trash-alt"></i></a>';
                    $actionHtml .= '</div>';
                }

                return [
                    'id' => $log->id,
                    'leave_type' => $leaveType,
                    'start_date' => $log->start_date,
                    'end_date' => $log->end_date,
                    'total_applied_leaves' => $log->total_applied_leaves,
                    'created_at' => $log->created_at->format('Y-m-d'),
                    'status' => $statusText,
                    'action' => $actionHtml,
                ];
            });

        return response()->json([
            'data' => $leaveLogs,
        ]);
    }

    public function deleteLeave(Request $request)
    {
        $leave = EmployeeLeaveLogs::find($request->leave_id);

        if (!$leave) {
            return response()->json(['message' => 'Leave not found'], 404);
        }

        if ((int)$leave->status !== 1) {
            return response()->json(['message' => 'Only pending leaves can be deleted'], 403);
        }

        // ✅ Mark status as "Deleted"
        $leave->status = 4;
        $leave->save();

        return response()->json(['message' => 'Leave marked as deleted successfully']);
    }


    public function deleteLeavePost(Request $request)
    {
        $leave_id = $request->leave_id;
        $leave = EmployeeLeaveLogs::find($leave_id);

        if (!$leave) {
            return response()->json([
                'status' => 404,
                'message' => 'Leave not found.'
            ]);
        }

        if ((int)$leave->status !== 1) { 
            return response()->json([
                'status' => 403,
                'message' => 'Only pending leaves can be marked as deleted.'
            ]);
        }

        $leave->status = 4; // 4 = Deleted
        $leave->leave_delete_reason = $request->leave_delete_reason;

        if ($leave->save()) {
            // Notify HR and Manager via email
            $employee = Employees::find($leave->employee_id);
            $manager = Employees::find($leave->manager_id);

            if ($employee && $manager) {
                $to_emails = ['hr@webguruz.in', $manager->email];

                $data = [
                    'to_name' => $manager->name,
                    'employee' => $employee->name,
                    'leave_type' => $leave->leave_type,
                    'start_date' => $leave->start_date,
                    'end_date' => $leave->end_date,
                    'leave_delete_reason' => $request->leave_delete_reason,
                ];

                // Mail::send('attendance.leave-delete', $data, function ($message) use ($to_emails, $employee) {
                //     $message->from('noreply@webguruz.in', 'noreply')
                //             ->to($to_emails)
                //             ->subject('Leave Deletion Notice - ' . $employee->name);
                // });
            }

            return response()->json([
                'status' => 200,
                'message' => $employee->name . "'s leave has been marked as deleted."
            ]);
        }

        return response()->json([
            'status' => 500,
            'message' => 'Something went wrong. Try again.'
        ]);
    }


    public function applyLeave(Request $request)
    {
        // $ldate = date('m/d/Y', strtotime("-1 week"));
        // $todayDate = date('m/d/Y');
        // $lastdate = date('m/d/Y', strtotime("+1 week"));
        // $startyear  = '25';
        // $mdate = date('m/25/Y', strtotime("-1 month"));
        // $tDate = date('m/t/Y');

        // print_r($ldate); echo "<br>";  
        // print_r($todayDate); echo "<br>"; 
        // print_r($lastdate); echo "<br>"; 
        // print_r($mdate); echo "<br>"; 
        // print_r($tDate); die();

        $type = $request->get('leave_type');
       
        $leave_rule = LeaveRules::where('id', $type)->first();
        Log::info('my leave rule  array:', $leave_rule->toArray());
        if ($leave_rule->show_time == '1') {
            $loginuser = Auth::user();
            $user = Employees::where('id', $loginuser->id)->first();
            $todayDate = date('m/26/Y', strtotime("-1 month"));
            $validator = Validator::make($request->all(), [

                'start_date' => 'required|after_or_equal:' . $todayDate,
                'start_time' => 'required',
                'reason' => 'required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }

            $start_date = $request->get('start_date');
            $start_time = $request->get('start_time');
            $manager_id = $user->manager_id;
            $leaves = new EmployeeLeaveLogs();
            $leaves->employee_id = $user->id;
            $leaves->start_date = $request->get('start_date');
            $leaves->end_date = $request->get('start_date');
            $leaves->start_time =  $request->get('start_time');
            $leaves->total_applied_leaves = '0.25';
            $leaves->reason = $request->get('reason');

            $leaves->leave_type = $request->get('leave_type');
            $leaves->manager_id = $user->manager_id;
            $leaves->status = "1";
            if ($leaves->save()) {
                //sxdfsf
                $arr = [];
                $employee = Employees::where('id', $user->id)->first();
                $manager = Employees::where('id', $user->manager_id)->first();
                array_push($arr, $manager->email, 'hr@webguruz.in');

                if (!empty($manager->manager_id)) {
                    $first_level_manager = Employees::where('id', $manager->manager_id)->first();
                    if ($first_level_manager->id != '1') {
                        if ($first_level_manager->id != '2') {
                            array_push($arr, $first_level_manager->email);
                        }
                    }
                    // if(!empty($first_level_manager->manager_id))
                    // {
                    //     $second_level_manager =Employees::where('id',$first_level_manager->manager_id)->first();
                    //     array_push($arr,$second_level_manager->email);
                    //     // if(!empty($second_level_manager->manager_id))
                    //     // {
                    //     //     $third_level_manager =Employees::where('id',$second_level_manager->manager_id)->first();
                    //     //     array_push($arr,$third_level_manager->email);
                    //     // }
                    // }
                }

                $to_name = $manager->name;
                $to_emails = $arr;

                $data = array(
                    'to_name' => $to_name,
                    'employee' => $employee->name,
                    'leave_type' => $request->get('leave_type'),
                    'start_date' => $request->get('start_date'),
                    'start_time' => $request->get('start_time'),
                    'approve' => route('approveLeaveRequest', $leaves->id),
                    'reject' => route('rejectLeaveRequest', $leaves->id),
                    'view' => route('viewLeaveRequest', $leaves->id),
                    'reason' => $request->get('reason')
                );
                Mail::send('attendance.leave-request-short-leave', $data, function ($message) use ($to_name, $to_emails, $employee) {
                    $message->from('noreply@webguruz.in', 'noreply')
                        ->to($to_emails)
                        ->subject('Leave Application - ' . $employee->name);
                });

                $noti = new Notifications();
                $noti->type_id = 'attendacne_approval_request';
                $noti->message = $user->name . ' has been requested for leave';
                $noti->is_seen = 1;
                $noti->page_id = $leaves->id;
                $noti->notify_status = 1;
                $noti->notify_from = Auth::user()->id;
                $noti->notify_to = $user->manager_id;
                Log::info('Notifications array:', $noti->notify_to);
                $noti->notify_type = 2;
                $noti->save();

                return response()->json([
                    'status' => 200,
                    'message' => 'Leave request created',
                    'email' => $arr
                ]);
            }
        } else {
            $loginuser = Auth::user();
            $user = Employees::where('id', $loginuser->id)->first();
            $todayDate = date('m/26/Y', strtotime("-1 month"));
            $validator = Validator::make($request->all(), [
                'reason' => 'required',
                'start_date' => 'required|after_or_equal:' . $todayDate,
                'end_date' => 'required|after_or_equal:start_date'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 401,
                    'message' => $validator->errors()
                        ->first()
                ]);
            }

            $start_date = $request->get('start_date');
            $start_half = $request->get('start_half');
            $end_date = $request->get('end_date');
            $end_half = $request->get('end_half');
            $manager_id = $user->manager_id;
            if ($start_date == $end_date) {
                if ($start_half == '2' && $end_half == '1') {
                    return response()->json([
                        'status' => 401,
                        'message' => 'Please select the half proprerly.'
                    ]);
                }
            }

            try {
                // $type = $request->get('leave_type');
                // $allrules =LeaveRules::where('rule_name', $type)->first();

                $start_date_str = strtotime($start_date);
                $end_date_str = strtotime($end_date);
                $datediff = $end_date_str - $start_date_str;

                $totalLeavs = [];
                $totalLeavs[] = round($datediff / (60 * 60 * 24));

                if ($start_half == 1 && $end_half == 1) {
                    $totalLeavs[] = 0.5;
                }

                if ($start_half == 1 && $end_half == 2) {
                    $totalLeavs[] = 1;
                }

                if ($start_half == 2 && $end_half == 2) {
                    $totalLeavs[] = 0.5;
                }

                if ($start_half == 2 && $end_half == 1) {
                    $totalLeavs[] = 0;
                }

                $leaves = new EmployeeLeaveLogs();
                $leaves->employee_id = $user->id;
                $leaves->start_date = $request->get('start_date');
                $leaves->start_half = $request->get('start_half');
                $leaves->end_date = $request->get('end_date');
                $leaves->end_half = $request->get('end_half');
                $leaves->leave_type = $request->get('leave_type');
                $leaves->total_applied_leaves = array_sum($totalLeavs);
                $leaves->reason = $request->get('reason');
                $leaves->manager_id = $user->manager_id;
                $leaves->status = "1";
                if ($leaves->save()) {
                    //sxdfsf
                    $arr = [];
                    $employee = Employees::where('id', $user->id)->first();
                    
                    $manager = Employees::where('id', $user->manager_id)->first();
                    array_push($arr, $manager->email, 'hr@webguruz.in');

                    if (!empty($manager->manager_id)) {
                        $first_level_manager = Employees::where('id', $manager->manager_id)->first();
                        if ($first_level_manager->id != '1') {
                            if ($first_level_manager->id != '2') {
                                array_push($arr, $first_level_manager->email);
                            }
                        }

                        // if(!empty($first_level_manager->manager_id))
                        // {
                        //     $second_level_manager =Employees::where('id',$first_level_manager->manager_id)->first();
                        //     array_push($arr,$second_level_manager->email);
                        // // if(!empty($second_level_manager->manager_id))
                        // // {
                        // //     $third_level_manager =Employees::where('id',$second_level_manager->manager_id)->first();
                        // //     array_push($arr,$third_level_manager->email);
                        // // }
                        // }
                    }

                    $to_emails = $arr;

                    $to_name = $manager->name;
                    // $to_emails =['hr@webguruz.in','jp@webguruz.in',$manager->email,'careers@webguruz.in'];
                    $data = array(
                        'to_name' => $to_name,
                        'employee' => $employee->name,
                        'leave_type' => $request->get('leave_type'),
                        'start_date' => $request->get('start_date'),
                        'end_date' => $request->get('end_date'),
                        'total_applied_leaves' => array_sum($totalLeavs),
                        'approve' => route('approveLeaveRequest', $leaves->id),
                        'reject' => route('rejectLeaveRequest', $leaves->id),
                        'view' => route('viewLeaveRequest', $leaves->id),
                        'reason' => $request->get('reason')
                    );
                    // Mail::send('attendance.leave-request-alert', $data, function ($message) use ($to_name, $to_emails, $employee) {
                    //     $message->from('noreply@webguruz.in', 'noreply')
                    //         ->to($to_emails)
                    //         ->subject('Leave Application - ' . $employee->name);
                    // });



                    $noti = new Notifications();
                    $noti->type_id = 'attendacne_approval_request';
                    $noti->message = $user->name . ' has been requested for leave';
                    $noti->is_seen = 1;
                    $noti->page_id = $leaves->id;
                    $noti->notify_status = 1;
                    $noti->notify_from = Auth::user()->id;
                    
                    $noti->notify_to = $user->manager_id;
                   
                    $noti->notify_type = 2;
                   
                    $noti->save();
                   

                    return response()->json([
                        'status' => 200,
                        'message' => 'Leave request created',
                        'email' => $arr
                    ]);
                }
            } catch (\Exception $e) {
                return response()->json([
                    'status' => 401,
                    'message' => $e->getMessage()
                ]);
            }
        }
    }



    public function approveRequest(Request $request)
    {
        $loginuser = Auth::user();

        foreach ($request->rows_ids as $row_id) {
            $empdb = EmployeeLeaveLogs::where('id', $row_id)->first();
            $employee =Employees::where('id', $empdb->employee_id)->first();
            // $approved =Employees::where('id',$loginuser->id)->first();
            if ($empdb) {
                $empdb->status = 2;
                $empdb->approved_by = $loginuser->id;
                if ($empdb->save()) {
                    //   $to_name = $employee->name;
                        // $to_email =$employee->email;
                        // $data = array(
                        //     'to_name' =>$to_name,
                        //     'employee' =>$approved->name,
                        //     'leave_type' =>$empdb->leave_type,
                        //     'start_date' =>$empdb->start_date,
                        //     'end_date' =>$empdb->end_date,
                        //     'reason'=>$empdb->reason,
                        //     'total_applied_leaves' =>$empdb->total_applied_leaves
                        // );
                        // Mail::send('emails.leave-approved-mail', $data, function ($message) use ($to_name, $to_email) {
                        //     $message->from('noreply@webguruz.in','noreply')
                        //     ->to($to_email)
                        //     ->subject('Leave application status');
                        // });
                    // Notification for admin
                    $noti = new Notifications();
                    $noti->type_id = 'attendacne_approval_request';
                    $noti->message =  $employee->name."'s leave has been approved" ;
                    $noti->page_id = $empdb->id;
                    $noti->notify_to = $empdb->employee_id;
                    $noti->save();
                }
            }
        }

        return response()->json([
            'status' => 200,
            'message' => "Successfully updated."
        ]);
    }




    public function  approveleaveRequest(Request $request, $leave_id)
    {
        if (Auth::user()) {
            $loginuser = Auth::user()->id;
            $employee = Employees::where('id', $loginuser)->first();
            $manager = EmployeeLeaveLogs::where('id', $leave_id)->first();
            $employee_id = Employees::where('id', $manager->employee_id)->first();




            if ($manager->manager_id == $loginuser || $employee->user_role == '1') {
                if ($manager->status == '1') {
                    //notify to employee
                    $noti = new Notifications();
                    $noti->type_id = 'leave_request';
                    $noti->message = 'Your leave request has been accepted by' . $employee->name;
                    $noti->is_seen = 1;
                    $noti->page_id = $leave_id;
                    $noti->notify_status = 1;
                    $noti->notify_from = Auth::user()->id;
                    $noti->notify_to = $manager->employee_id;
                    $noti->notify_type = 3;
                    $noti->save();

                    //notify to admin
                    $noti = new Notifications();
                    $noti->type_id = 'attendacne_approval_request';
                    $noti->message = $employee_id->name . "'s leave has been accepted by " . $employee->name;
                    $noti->is_seen = 1;
                    $noti->page_id = $leave_id;
                    $noti->notify_status = 1;
                    $noti->notify_from = Auth::user()->id;
                    $noti->notify_to = $manager->manager_id;
                    $noti->notify_type = 2;
                    $noti->save();

                    $manager->status = '2';
                    $manager->approved_by = $loginuser;
                    if ($manager->save()) {

                        $to_name = $employee_id->name;
                        $to_email = $employee_id->email;
                        $data = array(
                            'to_name' => $to_name,
                            'employee' => $employee->name,
                            'leave_type' => $manager->leave_type,
                            'start_date' => $manager->start_date,
                            'end_date' => $manager->end_date,
                            'reason' => $manager->reason,
                            'total_applied_leaves' => $manager->total_applied_leaves
                        );
                        Mail::send('emails.leave-approved-mail', $data, function ($message) use ($to_name, $to_email) {
                            $message->from('noreply@webguruz.in', 'noreply')
                                ->to($to_email)
                                ->subject('Leave application status');
                        });

                        if ($employee->role_id == "1") {
                            if ($manager->manager_id == $loginuser) {
                                return redirect()->route('em-leaves')->with('success', "Already Accepted")->withInput(['tab' => 'teamleaves']);
                            } else {
                                return redirect()->route('leavelogs')->with('success', "Already Accepted");
                            }
                        } else {
                            return redirect()->route('em-leaves')->with('success', "Already Accepted")->withInput(['tab' => 'teamleaves']);
                        }
                    }
                } elseif ($manager->status == '2') {
                    if ($employee->role_id == "1") {
                        if ($manager->manager_id == $loginuser) {
                            return redirect()->route('em-leaves')->with('success', "Already Accepted")->withInput(['tab' => 'teamleaves']);
                        } else {
                            return redirect()->route('leavelogs')->with('success', "Already Accepted");
                        }
                    } else {
                        return redirect()->route('em-leaves')->with('success', "Already Accepted")->withInput(['tab' => 'teamleaves']);
                    }
                } else {
                    if ($employee->role_id == "1") {
                        if ($manager->manager_id == $loginuser) {
                            return redirect()->route('em-leaves')->with('success', "Already Rejected")->withInput(['tab' => 'teamleaves']);
                        } else {
                            return redirect()->route('leavelogs')->with('success', "Already Rejected");
                        }
                    } else {
                        return redirect()->route('em-leaves')->with('success', "Already Rejected")->withInput(['tab' => 'teamleaves']);
                    }
                }
            } else {
                return redirect()->back();
            }
        } else {
            return redirect()->back();
        }
    }

    public function rejectLeaveRequest(Request $request, $leave_id)
    {
      if (Auth::user()) {  
              $loginuser = Auth::user()->id;
              $employee =Employees::where('id',$loginuser)->first();
              $manager =EmployeeLeaveLogs::where('id', $leave_id)->first();
              $employee_id = Employees::where('id', $manager->employee_id)->first();

           

              if($manager->manager_id == $loginuser || $employee->user_role == '1')
              {
                if($manager->status == '1')
                {
                             //notify to employee
                    $noti = new Notifications();
                    $noti->type_id = 'leave_request';
                    $noti->message = 'Your leave request has been rejected by '. $employee->name;
                    $noti->is_seen = 1;
                    $noti->page_id = $leave_id;
                    $noti->notify_status = 1;
                    $noti->notify_from = Auth::user()->id;
                    $noti->notify_to = $manager->employee_id;
                    $noti->notify_type= 3;
                    $noti->save();

                    //notify to admin
                    $noti = new Notifications();
                    $noti->type_id = 'attendacne_approval_request';
                    $noti->message = $employee_id->name ."'s leave request has been rejected by ".$employee->name;
                    $noti->is_seen = 1;
                    $noti->page_id = $leave_id;
                    $noti->notify_status = 1;
                    $noti->notify_from = Auth::user()->id;
                    $noti->notify_to = $manager->manager_id;
                    $noti->notify_type= 2;
                    $noti->save();

                    $manager->status = '3';
                    $manager->approved_by = $loginuser;
                    if($manager->save())
                    {

                        $to_name = $employee_id->name;
                        $to_email =$employee_id->email;
                        $data = array(
                            'to_name' =>$to_name,
                            'employee' =>$employee->name,
                            'leave_type' =>$manager->leave_type,
                            'start_date' =>$manager->start_date,
                            'end_date' =>$manager->end_date,
                            'total_applied_leaves' =>$manager->total_applied_leaves,
                            'reason'  => $manager->manager_reason
                        );
                        Mail::send('emails.leave-rejected-mail', $data, function ($message) use ($to_name, $to_email) {
                            $message->from('noreply@webguruz.in','noreply')
                            ->to($to_email)
                            ->subject('Leave application status');
                        });
                          if($employee->role_id == "1")
                            {
                                if($manager->manager_id == $loginuser)
                                {
                                    return redirect()->route('em-leaves')->with('success', "You have rejected the leave request.")->withInput(['tab' => 'teamleaves']);
                                }
                                else
                                {
                                    return redirect()->route('leavelogs')->with('success', "You have rejected the leave request."); 
                                }
                             
                            }
                            else
                            {
                                return redirect()->route('em-leaves')->with('success', "You have rejected the leave request.")->withInput(['tab' => 'teamleaves']);
                            }
                    } 
                }
                elseif($manager->status == '2')
                {
                    if($employee->role_id == "1")
                    {
                        if($manager->manager_id == $loginuser)
                        {
                            return redirect()->route('em-leaves')->with('success', "Already Accepted")->withInput(['tab' => 'teamleaves']);
                        }
                        else
                        {
                            return redirect()->route('leavelogs')->with('success', "Already Accepted"); 
                        }
                     
                    }
                    else
                    {
                        return redirect()->route('em-leaves')->with('success', "Already Accepted")->withInput(['tab' => 'teamleaves']);
                    }
                }
                else
                {
                     if($employee->role_id == "1")
                    {
                        if($manager->manager_id == $loginuser)
                        {
                            return redirect()->route('em-leaves')->with('success', "Already Rejected")->withInput(['tab' => 'teamleaves']);
                        }
                        else
                        {
                            return redirect()->route('leavelogs')->with('success', "Already Rejected"); 
                        }
                     
                    }
                    else
                    {
                        return redirect()->route('em-leaves')->with('success', "Already Rejected")->withInput(['tab' => 'teamleaves']);
                    }
                }

                
              }
              else
              {
                return redirect()->back();
              }
                }
                else
              {
                return redirect()->back();
              } 
    }

    public function viewLeaveRequest($leave_id)
    {
        if (Auth::user())
        {  
            $loginuser = Auth::user()->id;
            $logged_id = Employees::where('id', $loginuser)->first();
            $leave_logs =EmployeeLeaveLogs::where('id', $leave_id)->first();
            $manager= Employees::where('id',$leave_logs->employee_id)->first();
                if($logged_id->role_id == "1")
                {
                    if($manager->manager_id == $loginuser)
                    {
                        return redirect()->route('em-leaves')->withInput(['tab' => 'teamleaves']);
                    }
                    else
                    {
                        return redirect()->route('leavelogs'); 
                    }
                 
                }
                else
                {
                    return redirect()->route('em-leaves')->withInput(['tab' => 'teamleaves']);
                }
               
            }

    }



}

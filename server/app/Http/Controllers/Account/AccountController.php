<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Employees;
use App\Models\ObCandidates;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Rules\MatchOldPassword;
use App\Models\EmployeeAttendance;
use App\Models\AttendanceRules;
use App\Models\AttendanceLog;


class AccountController extends Controller
{


    // public function calender()
    // {
    //     $todayMonth = date('m');
    //     $todayDay = date('d');

    //     $ab =Employees::where('status', '1')->pluck('id')->toArray();
    //     $employees = ObCandidates::whereIn('office_employee_id', $ab)->get();
    //     $employeesBirthday = ObCandidates::whereMonth('dob', $todayMonth)->whereDay('dob', $todayDay)->get();

    //     $employeesAnni = ObCandidates::whereMonth('date_of_joining', $todayMonth)->whereDay('date_of_joining', $todayDay)->get();

    //     return response()->json([
    //         'employees' => $employees,
    //         'birthdays' => $employeesBirthday,
    //         'anniversaries' => $employeesAnni,
    //     ]);
    // }

    public function calender()
    {
        $employeeIds = Employees::where('status', '1')->pluck('id')->toArray();
        $employees = ObCandidates::whereIn('office_employee_id', $employeeIds)->get();

        $events = [];

        foreach ($employees as $employee) {
            $year = date('Y');
            $birthday = date("$year-m-d", strtotime($employee->dob));
            $anniversary = date("$year-m-d", strtotime($employee->date_of_joining));

            $events[] = [
                'title' => 'Birthday',
                'description' => "{$employee->name}'s Birthday",
                'start' => $birthday,
                'end' => $birthday,
                'backgroundColor' => '#c981e0',
                'borderColor' => '#c981e0',
                'icon' => 'fa-birthday-cake',
            ];

            $events[] = [
                'title' => 'Work Anniversary',
                'description' => "{$employee->name}'s Work Anniversary",
                'start' => $anniversary,
                'end' => $anniversary,
                'backgroundColor' => '#f012be',
                'borderColor' => '#f012be',
                'icon' => 'fa-glass-cheers',
            ];
        }

        return response()->json($events);
    }


    // for changing the password of user
    public function editProfile(Request $request)
    {

        $loginuser = Auth::user();
        $user_id = $loginuser->id;
        $candidate = ObCandidates::where('office_employee_id', $user_id)->first();
        $user = Employees::where('id', $candidate->office_employee_id)->first();
        $validator = Validator::make($request->all(), [
            'current_password' => ['required', new MatchOldPassword],
            'password' => 'required|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $user->password = bcrypt($request->password);

        if ($user->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Password updated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }

    // public function attendanceQQ()
    // {
    //     $res = getWorkingHoursByDate('2021-01-15', 1);

    //     $loginuser = Auth::user();
    //     $currentDate = date('Y-m-d');

    //     $user_id = $loginuser->id;
    //     //Log::error('This is a debug message', ['userId' => $user_id]);
    //     // ->where('status', 'AN')
    //     $totalAnomalies = EmployeeAttendance::where('employee_id', $user_id)
    //         ->where('clock_date', '!=', $currentDate)
    //         ->count();
    //     // ->where('clock_date', $currentDate)
    //     // Today Attendance
    //     $todayAttendance = AttendanceLog::where('employee_id', $loginuser->id)
    //         ->orderBy('id', 'ASC')
    //         ->get();

    //     return response()->json([
    //         'totalAnomalies' => $totalAnomalies,
    //         'todayAttendance' => $todayAttendance
    //     ]);
    // }


    // public function attendance()
    // {
    //     $res = getWorkingHoursByDate('2021-01-15', 1);

    //     $loginuser = Auth::user();
    //     $currentDate = date('Y-m-d');
    //     $user_id = $loginuser->id;

    //     // Calculate total anomalies
    //     $totalAnomalies = EmployeeAttendance::where('employee_id', $user_id)
    //         // ->where('status', 'AN')
    //         ->where('clock_date', '!=', $currentDate)
    //         ->count();

    //     // Today Attendance
    //     $todayAttendance = AttendanceLog::where('employee_id', $loginuser->id)
    //         // ->where('clock_date', $currentDate)
    //         ->orderBy('id', 'ASC')
    //         ->get();

    //     // User details
    //     $userData = [
    //         'id' => $loginuser->id,
    //         'name' => $loginuser->name,
    //         'is_manager' => $loginuser->is_manager,
    //         'user_role' => $loginuser->user_role
    //     ];

    //     // Employee dropdown data based on user role
    //     $employeeOptions = [];

    //     if ($loginuser->is_manager == '1' && $loginuser->user_role != '1') {
    //         // Manager but not admin - show only their team
    //         $employees = Employees::where('manager_id', $loginuser->id)
    //             ->where('status', '1')
    //             ->get();

    //         // Add manager themselves as first option
    //         $employeeOptions[] = [
    //             'id' => $loginuser->id,
    //             'name' => $loginuser->name
    //         ];

    //         // Add team members
    //         foreach ($employees as $employee) {
    //             $employeeOptions[] = [
    //                 'id' => $employee->id,
    //                 'name' => $employee->name
    //             ];
    //         }
    //     } elseif ($loginuser->is_manager == '1' && $loginuser->user_role == '1') {
    //         // Admin - show all employees
    //         $allEmployees = Employees::where('status', '1')->get();

    //         // Add manager themselves as first option
    //         $employeeOptions[] = [
    //             'id' => $loginuser->id,
    //             'name' => $loginuser->name
    //         ];

    //         // Add all employees
    //         foreach ($allEmployees as $employee) {
    //             $employeeOptions[] = [
    //                 'id' => $employee->id,
    //                 'name' => $employee->name
    //             ];
    //         }
    //     } else {
    //         // Regular employee - only show themselves
    //         $employeeOptions[] = [
    //             'id' => $loginuser->id,
    //             'name' => $loginuser->name
    //         ];
    //     }

    //     // Attendance rules data
    //     // $attendanceRules = [
    //     //     'rule_name' => 'General rule',
    //     //     'description' => 'This is default system provided option for all users in case of low leave balance.',
    //     //     'effective_date' => '30-08-2020',
    //     //     'shift_timings' => [
    //     //         'in_time' => '09:30 AM',
    //     //         'out_time' => '07:15 PM'
    //     //     ],
    //     //     'settings' => [
    //     //         'enable_anomaly_deduction' => false,
    //     //         'auto_detection' => 0,
    //     //         'enable_anomaly_tracking' => false,
    //     //         'enable_overtime' => false,
    //     //         'enable_attendance_with_selfie' => false,
    //     //         'enable_geo_fencing' => false,
    //     //         'enable_penalty_rules_selfie' => false
    //     //     ],
    //     //     'anomaly_settings' => [
    //     //         'in_time' => [
    //     //             'enabled' => true,
    //     //             'grace_period' => '00:15'
    //     //         ],
    //     //         'out_time' => [
    //     //             'enabled' => true,
    //     //             'grace_period' => '00:15'
    //     //         ],
    //     //         'work_duration' => [
    //     //             'enabled' => true,
    //     //             'full_day' => '08:30',
    //     //             'half_day' => '04:30'
    //     //         ],
    //     //         'max_break_duration' => [
    //     //             'enabled' => true,
    //     //             'duration' => '01:00'
    //     //         ],
    //     //         'max_breaks' => [
    //     //             'enabled' => true,
    //     //             'count' => 2
    //     //         ],
    //     //         'auto_clock_out' => [
    //     //             'enabled' => false
    //     //         ]
    //     //     ]
    //     // ];

    //     // Format today's attendance data for table display
    //     // $formattedTodayAttendance = [];
    //     // if ($todayAttendance) {
    //     //     $sno = 1;
    //     //     foreach ($todayAttendance as $attendance) {
    //     //         $formattedTodayAttendance[] = [
    //     //             'sno' => $sno,
    //     //             'time' => date("H:i A", strtotime($currentDate . ' ' . $attendance->clock_time)),
    //     //             'type' => ($attendance->type == 1) ? "In" : "Out",
    //     //             'ip_address' => $attendance->ip_address ?: "-",
    //     //             'address' => $attendance->address ?: "-"
    //     //         ];
    //     //         $sno++;
    //     //     }
    //     // }

    //     return response()->json([
    //         'success' => true,
    //         'data' => [
    //             'user' => $userData,
    //             'totalAnomalies' => $totalAnomalies,
    //             'todayAttendance' => $todayAttendance,
    //             // 'formattedTodayAttendance' => $formattedTodayAttendance,
    //             'employeeOptions' => $employeeOptions,
    //             // 'attendanceRules' => $attendanceRules,
    //             'currentDate' => $currentDate
    //         ]
    //     ]);
    // }


    public function monthlyAttendance(Request $request)
    {
        $loginuser = Auth::user();
<<<<<<< HEAD
        $currentDate = date('Y-m-d');

        $user_id = $loginuser->id;
        //Log::error('This is a debug message', ['userId' => $user_id]);

        $totalAnomalies = EmployeeAttendance::where('employee_id', $user_id)->where('status', 'AN')
            ->where('clock_date', '!=', $currentDate)
            ->count();

        // Today Attendance
        $todayAttendance = AttendanceLog::where('employee_id', $loginuser->id)->where('clock_date', $currentDate)
            ->orderBy('id', 'ASC')
            ->get();

             return response()->json([
                'totalAnomalies' => $totalAnomalies,
                'todayAttendance' => $todayAttendance
            ]);
    }

    
public function attendance()
{
    $res = getWorkingHoursByDate('2021-01-15', 1);

    $loginuser = Auth::user();
    $currentDate = date('Y-m-d');
    $user_id = $loginuser->id;

    // Calculate total anomalies
    $totalAnomalies = EmployeeAttendance::where('employee_id', $user_id)
        ->where('status', 'AN')
        ->where('clock_date', '!=', $currentDate)
        ->count();

    // Today Attendance
    $todayAttendance = AttendanceLog::where('employee_id', $loginuser->id)
        ->where('clock_date', $currentDate)
        ->orderBy('id', 'ASC')
        ->get();

    // User details
    $userData = [
        'id' => $loginuser->id,
        'name' => $loginuser->name,
        'is_manager' => $loginuser->is_manager,
        'user_role' => $loginuser->user_role
    ];

    // Employee dropdown data based on user role
    $employeeOptions = [];
    
    if ($loginuser->is_manager == '1' && $loginuser->user_role != '1') {
        // Manager but not admin - show only their team
        $employees = App\Employees::where('manager_id', $loginuser->id)
            ->where('status', '1')
            ->get();
        
        // Add manager themselves as first option
        $employeeOptions[] = [
            'id' => $loginuser->id,
            'name' => $loginuser->name
        ];
        
        // Add team members
        foreach ($employees as $employee) {
            $employeeOptions[] = [
                'id' => $employee->id,
                'name' => $employee->name
            ];
        }
    } elseif ($loginuser->is_manager == '1' && $loginuser->user_role == '1') {
        // Admin - show all employees
        $allEmployees = App\Employees::where('status', '1')->get();
        
        // Add manager themselves as first option
        $employeeOptions[] = [
            'id' => $loginuser->id,
            'name' => $loginuser->name
        ];
        
        // Add all employees
        foreach ($allEmployees as $employee) {
            $employeeOptions[] = [
                'id' => $employee->id,
                'name' => $employee->name
            ];
        }
    } else {
        // Regular employee - only show themselves
        $employeeOptions[] = [
            'id' => $loginuser->id,
            'name' => $loginuser->name
        ];
    }

    // Attendance rules data
    $attendanceRules = [
        'rule_name' => 'General rule',
        'description' => 'This is default system provided option for all users in case of low leave balance.',
        'effective_date' => '30-08-2020',
        'shift_timings' => [
            'in_time' => '09:30 AM',
            'out_time' => '07:15 PM'
        ],
        'settings' => [
            'enable_anomaly_deduction' => false,
            'auto_detection' => 0,
            'enable_anomaly_tracking' => false,
            'enable_overtime' => false,
            'enable_attendance_with_selfie' => false,
            'enable_geo_fencing' => false,
            'enable_penalty_rules_selfie' => false
        ],
        'anomaly_settings' => [
            'in_time' => [
                'enabled' => true,
                'grace_period' => '00:15'
            ],
            'out_time' => [
                'enabled' => true,
                'grace_period' => '00:15'
            ],
            'work_duration' => [
                'enabled' => true,
                'full_day' => '08:30',
                'half_day' => '04:30'
            ],
            'max_break_duration' => [
                'enabled' => true,
                'duration' => '01:00'
            ],
            'max_breaks' => [
                'enabled' => true,
                'count' => 2
            ],
            'auto_clock_out' => [
                'enabled' => false
            ]
        ]
    ];

    // Format today's attendance data for table display
    $formattedTodayAttendance = [];
    if ($todayAttendance) {
        $sno = 1;
        foreach ($todayAttendance as $attendance) {
            $formattedTodayAttendance[] = [
                'sno' => $sno,
                'time' => date("H:i A", strtotime($currentDate . ' ' . $attendance->clock_time)),
                'type' => ($attendance->type == 1) ? "In" : "Out",
                'ip_address' => $attendance->ip_address ?: "-",
                'address' => $attendance->address ?: "-"
            ];
            $sno++;
        }
    }

    return response()->json([
        'success' => true,
        'data' => [
            'user' => $userData,
            'totalAnomalies' => $totalAnomalies,
            'todayAttendance' => $todayAttendance,
            'formattedTodayAttendance' => $formattedTodayAttendance,
            'employeeOptions' => $employeeOptions,
            'attendanceRules' => $attendanceRules,
            'currentDate' => $currentDate
        ]
    ]);
}
=======
      
        $user_id = $request->emp_id ?? $loginuser->id;
       
        $shift_type = $loginuser->shift_type;
       
        $shiftTime = $shift_type == 1
            ? explode("-", get_options('day_shift_timing'))
            : explode("-", get_options('night_shift_timing'));
        
       
        $shift_start = $shiftTime[0];
        $shift_end = $shiftTime[1];
    
        $data = EmployeeAttendance::where('employee_id', $user_id);
    
      
        if (!empty($request->startdate) && !empty($request->enddate)) {
            $data = $data->whereBetween('clock_date', [
                $request->startdate,
                $request->enddate
            ]);
        }
    
        $records = $data->get();
        // Log::info('This is records', ['records' => $records]);
        $transformed = $records->map(function ($row) {
            $today = date('Y-m-d');
           
            $user_id = $row->employee_id;
    
            $clock_in = $row->clock_in . ($row->late_reason ? "<br><span style='color:red;'>{$row->late_reason}</span>" : '');
            $after_shift_reason = "<span style='color:red;'>{$row->after_shift_clockin_reason}</span>";
    
            Log::info('This is clock_in', ['records' => $clock_in]);
            Log::info('This is after_shift_reason', ['records' => $after_shift_reason]);
            // Work Duration
            $work_duration = '-';
            if ($row->clock_date != $today && !empty($row->work_duration)) {
                Log::info('This is inside');
                $wd = explode(":", $row->work_duration);
                $work_duration = "{$wd[0]} Hours {$wd[1]} Mins";
            }
    
            // Break Duration
            $break_duration = $row->break_duration ?: "0 Hours 0 Mins";
            Log::info('This is break_duration', ['records' => $break_duration]);
            // Overtime
            $overtime = '-';
            if ($row->clock_date != $today && $row->overtime != '00:00') {
                Log::info('This is another inside');
                // $od = explode(":", $row->overtime);
                // $overtime = "{$od[0]} Hours {$od[1]} Mins";
            }
    
            return [
                'id' => $row->id,
                'clock_date' => $row->clock_date,
                'status' => $row->clock_date == $today ? '-' : $row->status,
                'clock_in' => $clock_in,
                'after_shift_clockin_reason' => $after_shift_reason,
                'work_duration' => $work_duration,
                'break_duration' => $break_duration,
                // 'overtime' => $overtime,
                'action' => ($row->late_reason || $row->after_shift_clockin_reason) ? true : false,
            ];
        });
    
        return response()->json($transformed);
    }
    
>>>>>>> 3dc9fee0fe11516eeeb7399483cd26bdf2f2ad54
}

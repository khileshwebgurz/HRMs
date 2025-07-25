<?php

namespace App\Http\Controllers\API;

use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Employees;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use App\Models\Roles;
use App\Models\Permissions;
use App\Models\AttendanceLog;
use App\Models\EmployeeAttendance;

class AuthController extends Controller
{
    public function loginOLD(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $employee = Employees::where('email', $request->email)->first();

        Log::info('My user emp  is >>>>', ['employee' => $employee]);

        if (!$employee || !Hash::check($request->password, $employee->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Check readiness_status
        if (!$employee->readiness_status) {
            return response()->json(['message' => 'User not ready. Complete readiness process first.'], 403);
        }

        // Get role and permissions
        $role = Roles::find($employee->user_role);

        $permissionIds = explode(',', trim($role->permissions, '[]'));
        $permissionSlugs = Permissions::whereIn('id', $permissionIds)->pluck('slug')->toArray();


        $token = $employee->createToken('AccessToken')->accessToken;




        $str =  str_replace(['[', ']'], "", $permissionIds);
        $arr = [];
        foreach ($str as $permission) {
            $all_permissions = Permissions::where('id', $permission)->first();
            $slug = $all_permissions->slug;
            $arr[] = $slug;
        }
        Session::push('permission', $arr);

        // Log::info('My permission data from login  is >>>>', ['permission' => Session::get('permission')]);

        // Send token in secure HttpOnly cookie and user data in response
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $employee->id,
                'email' => $employee->email,
                'name' => $employee->name,
                'role' => $role->name ?? null,
                'role_id' => $role->id ?? null,
                'user_role' => $employee->user_role,
                'permissions' => $permissionSlugs,
                'profile_pic' => $employee->profile_pic,
            ]
        ])->cookie(
            'access_token',
            $token,
            60 * 24,
            null,
            null,
            true, // Secure (set to false if not using HTTPS locally)
            true, // HttpOnly
            false,
            'Strict'
        );
    }


    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        $employee = Employees::where('email', $request->email)->first();

        if (!$employee || !Hash::check($request->password, $employee->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        Log::info('test', ['test' => $employee]);

    
        // Role + permissions
        $role = Roles::find($employee->user_role);
        $permissionIds = [];
        $permissionSlugs = [];

        if ($role && $role->permissions) {
            // assume stored like "[1,2,3]"
            $permissionIds = array_filter(explode(',', str_replace(['[', ']'], '', $role->permissions)));
            $permissionSlugs = Permissions::whereIn('id', $permissionIds)->pluck('slug')->toArray();
        }

        // Passport token
        $token = $employee->createToken('AccessToken')->accessToken;

        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id'          => $employee->id,
                'email'       => $employee->email,
                'name'        => $employee->name,
                'role'        => $role->name ?? null,
                'role_id'     => $role->id ?? null,
                'user_role'   => $employee->user_role,
                'permissions' => $permissionSlugs,
                'profile_pic' => $employee->profile_pic,
               'readiness_status'  => (int) $employee->readiness_status,
            ]
        ])->cookie(
            'access_token',
            $token,
            60 * 24,  // minutes (1 day)
            null,
            null,
            true,  // secure (false if local HTTP)
            true,  // HttpOnly
            false,
            'Strict'
        );
    }

    public function logout(Request $request)
    {

        $request->user()->token()->revoke();

        return response()->json(['message' => 'Logged out'])->cookie('access_token', '', -1);
    }


    public function clockIn(Request $request)
    {
        $response = [];
        // check user is registered or not
        $loginuser = Auth::user();
        $currentDate = date('Y-m-d');
        $now = date('Y-m-d\TH:i:s');
        $user_id = $loginuser->id;


        $alreadyLoggedIn = 'yes';
        $clockin = AttendanceLog::where('employee_id', $user_id)->where('clock_date', $currentDate)->latest('id')->first();
        if (!empty($clockin)) {
            if ($clockin->type == '2') {
                $clockin = new AttendanceLog();
                $clockin->employee_id = $loginuser->id;
                $clockin->clock_date = $currentDate;
                $clockin->clock_time = date('H:i:s');
                $clockin->type = 1;
                $clockin->ip_address = $request->ip;
                $clockin->latitude = $request->latitude;
                $clockin->longitude = $request->longitude;

                $clockin->save();
                $alreadyLoggedIn = 'no';
            }
        } else {

            $clockin = new AttendanceLog();
            $clockin->employee_id = $loginuser->id;
            $clockin->clock_date = $currentDate;
            $clockin->clock_time = date('H:i:s');
            $clockin->type = 1;
            $clockin->ip_address = $request->ip;
            $clockin->latitude = $request->latitude;
            $clockin->longitude = $request->longitude;

            $clockin->save();
            $alreadyLoggedIn = 'no';
        }



        $attendance = $this->getAttendanceLog();
        $attendance = $this->getAttendanceLog();
        $attendance['att_log_uu'] = $loginuser->id;
        $attendance['punch_details_uu'] = $clockin->id;
        $attendance['alreadyLoggedIn'] = $alreadyLoggedIn;

        // create current row data
        $empdb = EmployeeAttendance::where('employee_id', $user_id)->where('clock_date', $currentDate)->first();
        if (! $empdb) {
            $empdb = new EmployeeAttendance();
            $empdb->employee_id = $user_id;
            $empdb->clock_date = $currentDate;
            $empdb->clock_in = $clockin->clock_time;
            $empdb->save();
        }


        $empdb = EmployeeAttendance::where('employee_id', $loginuser->id)->where('clock_date', date("Y-m-d"))->first();
        $user_id = $empdb->employee_id;
        $date = $empdb->clock_date;
        $unixTimestamp = strtotime($date);
        $dayOfWeek = date("l", $unixTimestamp);

        $workinghours = getWorkingHoursByDate($date, $user_id, 'time');
        $breaks = getBreakByDate($date, $user_id);
        $clockout = getClockEndByDate($date, $user_id);

        if ($workinghours != '0:0:0') {
            $whs = explode(':', $workinghours);
            $wh = $whs[0];
            $wm = $whs[1];
            $ws = $whs[2];

            // Current date and time
            $datetime = date("Y-m-d H:i:s");
            // Convert datetime to Unix timestamp
            $timestamp = strtotime($datetime);
            // Subtract time from datetime
            $timehours = $timestamp - ($wh * 60 * 60);

            // Subtract time from datetime
            $timemin = $timehours - ($wm * 60);

            // Subtract time from datetime
            $finaltime = $timemin - $ws;

            // Date and time after subtraction
            $datetime = date("Y-m-d H:i:s", $finaltime);
        } else {
            $datetime = date("Y-m-d H:i:s");
        }
        //Employee::where('id',$loginuser->id)->update(['tracker_log_in'=>'1']);

        $attendance['a_final'] = $datetime;
        $attendance['a_wh'] = $workinghours;
        $attendance['a_br'] = $breaks;
        $attendance['a_co'] = $clockout;

        $todayWorkingHour = getWorkingHoursByDate(date('Y-m-d'), $loginuser->id, 'time');
        $weeklyWorkingHour = getWeeklyWorkDuration($loginuser->id, 'time');

        // create current row data
        $response['weeklyWorkingHour']  =  $weeklyWorkingHour;
        $response['today_working_hour']  =  $todayWorkingHour;
        $response['status'] = 200;
        $response['message'] = "Clock In enabled";
        $response['attendance'] = (object) $attendance;

        return response()->json(['status' => 200, 'message' => 'Clock In Successfully', 'data' => $response]);
    }

    public function getAttendanceLog()
    {
        $loginuser = Auth::user();
        $currentDate = date('Y-m-d');

        $emp_time_in_data = AttendanceLog::where('employee_id', $loginuser->id)->where('clock_date', $currentDate)
            ->where('type', 1)
            ->orderBy('id', 'ASC')
            ->first();
        $emp_time_in = '';
        if ($emp_time_in_data) {
            $emp_time_in = date('Y-m-d\T' . $emp_time_in_data->clock_time);
        }

        $emp_time_out_data = AttendanceLog::where('employee_id', $loginuser->id)->where('clock_date', $currentDate)
            ->orderBy('id', 'DESC')
            ->first();
        $emp_time_out = '';
        if ($emp_time_out_data) {
            if ($emp_time_out_data->type == 2) {
                $emp_time_out = date('Y-m-d\T' . $emp_time_out_data->clock_time);
            }
        }

        $last_punch_in_data = AttendanceLog::where('employee_id', $loginuser->id)->where('clock_date', $currentDate)
            ->where('type', 1)
            ->orderBy('id', 'DESC')
            ->first();

        $last_punch_out_data = AttendanceLog::where('employee_id', $loginuser->id)->where('clock_date', $currentDate)
            ->where('type', 2)
            ->orderBy('id', 'DESC')
            ->first();

        $last_punch_in = '';
        if ($last_punch_in_data) {
            $last_punch_in = date('Y-m-d\T' . $last_punch_in_data->clock_time);
        }

        $last_punch_out = '';
        if ($last_punch_out_data) {
            $last_punch_out = date('Y-m-d\T' . $last_punch_out_data->clock_time);
        }


        $finalArr = array();
        $finalArr['date'] = $currentDate;
        $finalArr['emp_time_in'] = $emp_time_in;
        $finalArr['emp_time_out'] = $emp_time_out;
        $finalArr['last_punch_in'] = $last_punch_in;
        $finalArr['last_punch_out'] = $last_punch_out;
        $finalArr['late_by'] = $currentDate;
        $finalArr['work_duration'] = $currentDate;
        $finalArr['excess_hours'] = $currentDate;
        $finalArr['excess_break_duration'] = $currentDate;
        $finalArr['early_out_by'] = $currentDate;
        $break = array();
        $finalArr['breaks'] = (object) $break;
        $finalArr['break_count'] = count($break);
        $finalArr['status'] = '-';
        $finalArr['prev_punch_count'] = 0;

        return $finalArr;
    }

     public function clockOut(Request $request)
    {
        // $validator = Validator::make($request->all(), [
        //     'type' => 'required',
        // ]);
        // if ($validator->fails()) {
        //     return response()->json(['status'=>'401' ,'request'=>$request->all(),'message'=> $validator->errors()->first(), 'data' => (object)[] ]);
        // }
        $loginuser = Auth::user();
        $currentDate = date('Y-m-d');
        $now = date('Y-m-d\TH:i:s');
        $attendance = AttendanceLog::where('employee_id', $loginuser->id)->where('clock_date', $currentDate)->latest('id')->first();
        $type= $attendance->type;
        $clockin = new AttendanceLog();
        $clockin->employee_id = $loginuser->id;
        $clockin->clock_date = $currentDate;
        $clockin->clock_time = date('H:i:s');
        $clockin->type = 2;
        $clockin->ip_address = $request->ip;
        $clockin->latitude = $request->latitude;
        $clockin->longitude = $request->longitude;
        $clockin->clock_out_status=$request->type;
         if($type == '1'){
                $clockin->save();

        }
        $attendance = $this->getAttendanceLog();
        $attendance['att_log_uu'] = $loginuser->id;
        $attendance['punch_details_uu'] = $clockin->id;

        $todayWorkingHour=getWorkingHoursByDate(date('Y-m-d'),$loginuser->id,'time');
        $weeklyWorkingHour=getWeeklyWorkDuration($loginuser->id,'time');

        // create current row data
        $response['weeklyWorkingHour']  =  $weeklyWorkingHour;
        $response['today_working_hour']  =  $todayWorkingHour;
        $response['status']=200;
        $response['message']="Clock Out";
        $response['attendance']=(object) $attendance;

        return response()->json([ 'status' => 200, 'message' => 'Clock Out Successfully', 'data' => $response ]);
    }


      public function clockApi()
    {
        $now = date('Y-m-d\TH:i:s');

        $finalLog = array();
        $attendance = $this->getAttendanceLog();
        $finalLog['attendance_log'] = array(
            '0' => (object) $attendance
        );

        $finalLog['prev_punch_count'] = 3;
        $finalLog['time'] = $now;

        $loginuser = Auth::user();
        $empdb = EmployeeAttendance::where('employee_id', $loginuser->id)->where('clock_date', date("Y-m-d"))->first();
        $user_id = $empdb->employee_id;
        $date = $empdb->clock_date;
        $unixTimestamp = strtotime($date);
        $dayOfWeek = date("l", $unixTimestamp);
        
        $workinghours = getWorkingHoursByDate($date, $user_id, 'time');

        $breaks = getBreakByDate($date, $user_id);
        $clockout = getClockEndByDate($date, $user_id);

        if($workinghours != '0:0:0'){
            $whs = explode(':', $workinghours);
            $wh = $whs[0];
            $wm = $whs[1];
             $ws = $whs[2];

            // Current date and time
            $datetime = date("Y-m-d H:i:s");
            // Convert datetime to Unix timestamp
            $timestamp = strtotime($datetime);
            // Subtract time from datetime
            $timehours = $timestamp - ($wh * 60 * 60);
            
            // Subtract time from datetime
            $timemin = $timehours - ($wm * 60);

            // Subtract time from datetime
            $finaltime = $timemin - $ws;

            // Date and time after subtraction
            $datetime = date("Y-m-d H:i:s", $finaltime);

        }else{
            $datetime = date("Y-m-d H:i:s");
        }

        $finalLog['a_final'] = $datetime;
        $finalLog['a_wh'] = $workinghours;
        $finalLog['a_br'] = $breaks;
        $finalLog['a_co'] = $clockout;





        if (isset($_GET['p'])) {
            echo '<pre>';

            print_r($finalLog);
            // print_r($data);

            exit();
        }
        return response()->json((object) $finalLog);
    }

}

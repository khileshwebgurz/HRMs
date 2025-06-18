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

     public function attendance()
    {
        $res = getWorkingHoursByDate('2021-01-15', 1);

        $loginuser = Auth::user();
        $currentDate = date('Y-m-d');

        $user_id = $loginuser->id;

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
}

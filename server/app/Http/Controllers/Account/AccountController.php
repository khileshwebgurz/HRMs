<?php

namespace App\Http\Controllers\Account;
use App\Http\Controllers\Controller;
use App\Models\Employees;
use App\Models\ObCandidates;
use Illuminate\Support\Facades\Log;

class AccountController extends Controller{
    public function calender()
    {
        $todayMonth = date('m');
        $todayDay = date('d');

        $ab =Employees::where('status', '1')->pluck('id')->toArray();
        $employees = ObCandidates::whereIn('office_employee_id', $ab)->get();
        $employeesBirthday = ObCandidates::whereMonth('dob', $todayMonth)->whereDay('dob', $todayDay)->get();
       
        $employeesAnni = ObCandidates::whereMonth('date_of_joining', $todayMonth)->whereDay('date_of_joining', $todayDay)->get();
      
        return response()->json([
            'employees' => $employees,
            'birthdays' => $employeesBirthday,
            'anniversaries' => $employeesAnni,
        ]);
    }
}
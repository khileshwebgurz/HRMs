<?php

namespace App\Http\Controllers\Account;
use App\Http\Controllers\Controller;
use App\Models\Employees;
use App\Models\ObCandidates;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class AccountController extends Controller{

    
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
}
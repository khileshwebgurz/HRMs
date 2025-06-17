<?php


use Illuminate\Support\Facades\Auth;
use App\Models\ObTabFieldOptions;
use App\Models\ObTabFieldData;
use App\Models\Employees;
use App\Models\AttendanceLog;
use Illuminate\Support\Facades\DB;
use App\Models\Settings;
// echo send_message();exit;
function getEmployeeProgress($id)
{
    $totalCount = ObTabFieldOptions::where('progress', 1)->count();

    $perfield = 100 / $totalCount;

    $optionsSingle = ObTabFieldOptions::selectRaw('id')->where('progress', 1)
        ->whereIn('type', [
            1,
            2,
            3,
            4
        ])
        ->get();

    $singleFields = array_column($optionsSingle->toArray(), 'id');

    $totalSingle = ObTabFieldData::whereIn('field_id', $singleFields)->where('ob_candidate_id', $id)
        ->whereNotNull('value')
        ->count();

    $optionsMultiple = ObTabFieldOptions::selectRaw('id')->where('progress', 1)
        ->whereIn('type', [
            5,
            7
        ])
        ->get();

    $multipleFields = array_column($optionsMultiple->toArray(), 'id');

    $totalMultiple = ObTabFieldData::whereIn('field_id', $multipleFields)->where('ob_candidate_id', $id)
        ->whereNotNull('value')
        ->get();

    $totalMultipleCount = array();
    foreach ($totalMultiple as $mk => $mv) {
        if (! empty($mv->value)) {
            $vals = json_decode($mv->value);

            if (count($vals) > 0) {
                $totalMultipleCount[] = 1;
            }
        }
    }
    $totalMultiple = count($totalMultipleCount);
    $totalFieldData = $totalSingle + $totalMultiple;

    $progress = $perfield * $totalFieldData;

    return round($progress);
}



function getTeamListByManagerId($manager_id)
{
    $employees = Employees::where('manager_id', $manager_id)->get();
    return $employees;
}



// this is just for testiing original is inside getLink().
function getReactLink($notification)
{
    $link = '';

    switch ($notification->type_id) {
        case 'test_complete':
            $link = '/candidate-test/' . $notification->page_id;
            break;

        case 'readiness_complete':
            $link = '/readiness-test/' . $notification->page_id;
            break;

        case 'Resignation':
            $link = '/employee/exit';
            break;

        case 'attendacne_approval_request':
            $link = '/leaves'; 
            break;

        case 'leave_request':
            $link = '/employee/leaves';
            break;

        case 'salary_slip':
            $link = ($notification->user_role == 1) ? '/admin/salary-slip' : '/employee/salary-slip';
            break;

        case 'slip_gernated':
            $link = '/employee/salary-slip';
            break;

        case 'ticket_created':
            if ($notification->user_role == 3 || $notification->user_id == 1) {
                $link = '/admin/tickets/' . $notification->page_id;
            } else {
                $link = '/employee/tickets/' . $notification->page_id;
            }
            break;

        case 'salary_approval_by_hr':
            $link = '/reports/attendance-employee';
            break;

        case 'salary_approval_by_admin':
            $link = '/reports/attendance';
            break;

        default:
            $link = '/';
    }

    return $link;
}

// for attendance
function getWorkingHoursByDate($date, $user_id, $format = 'string')
{
    $attData = AttendanceLog::select('clock_time')->where('employee_id', $user_id)
        ->where('clock_date', $date)
        ->orderBy('id', 'ASC')
        ->get()
        ->toArray();

    $attData = array_column($attData, 'clock_time');

    $attData = array_chunk($attData, 2);

    $total_time = array();
    $sum = strtotime('00:00:00');

    $totaltime = 0;
    foreach ($attData as $time) {
        $start_time = $time[0];
         $current_time = (isset($time[1])) ? $time[1] : date('H:i:s');
    
          $start_t = new DateTime($start_time);
          $current_t = new DateTime($current_time);
          $difference = $start_t->diff($current_t);
          $return_time = $difference->format('%H:%I:%s');

            // $diff = strtotime($to) - strtotime($from);
            //if (isset($time[1])) {
          $total_time[] = $return_time;
                // Converting the time into seconds
          $timeinsec = strtotime($return_time) - $sum;

                // Sum the time with previous value
          $totaltime = $totaltime + $timeinsec;
    
      
       // }
    }

    // Hours is obtained by dividing
    // totaltime with 3600
    $m = floor(($totaltime%3600)/60);
    $h = floor(($totaltime%86400)/3600);
    $s = $totaltime%60;

    // Remaining value is seconds

    // Printing the result
    // echo $h." Hours ".$m." Mins";

    // echo '<pre>';
    // print_r($total_time);
    // print_r($attData);
    // echo '</pre>';
    // exit();
    // $hours = $attData;
    // return $total_time;
    if ($format == 'time') {
        return date('H:i:s',strtotime('2021-01-01 '.$h . ":" . $m . ":" . $s));
    } else {
        return $h . " Hours " . $m . " Mins";
    }
}



// Get total breaks hours by date
function getBreakByDate($date, $user_id)
{
    $check = DB::table("attendance_logs")->select('type')
        ->whereRaw("clock_date = '" . $date . "' AND employee_id = '" . $user_id . "'")
        ->orderBy('id', 'DESC')
        ->first();
    $totalclockOut = 0;
    if ($check) {
        $totalclockOut = AttendanceLog::where('employee_id', $user_id)->where('clock_date', $date)
            ->where('type', 1)
            ->count();
        if ($check->type == 1) {
            $totalclockOut = ($totalclockOut) - 1;
        }else{
            if($totalclockOut){
                $totalclockOut=($totalclockOut) - 1;
            }
        }
    }
    return $totalclockOut;
}

function getBreakHoursByDate($date, $user_id, $format = 'string')
{
    $attData = AttendanceLog::select('clock_time')->where('employee_id', $user_id)
        ->where('clock_date', $date)
        ->orderBy('id', 'ASC')
        ->get()
        ->toArray();



    $attData = array_column($attData, 'clock_time');
    array_shift($attData);

    
    $attData = array_chunk($attData, 2);



    $total_time = array();
    $sum = strtotime('00:00:00');

    $totaltime =0;
    foreach ($attData as $time) {
        if(!empty($time[0]) && !empty($time[1])){
            $secs = strtotime($time[1]) - strtotime($time[0]);


        }else{
            $secs = 0;
        }

       
              
            // Sum the time with previous value
            $totaltime = $totaltime + $secs;
 
       // }
    }


    
    // Hours is obtained by dividing
    // totaltime with 3600
    $m = floor(($totaltime%3600)/60);
    $h = floor(($totaltime%86400)/3600);
    $s = $totaltime%60;

    // Remaining value is seconds

    // Printing the result
    // echo $h." Hours ".$m." Mins";

    // echo '<pre>';
    // print_r($total_time);
    // print_r($attData);
    // echo '</pre>';
    // exit();
    // $hours = $attData;
    // return $total_time;
    if ($format == 'time') {
        return date('H:i:s',strtotime('2021-01-01 '.$h . ":" . $m . ":" . $s));
    } else {
        return $h . " Hours " . $m . " Mins";
    }
}

// Get total breaks hours by date
function getClockEndByDate($date, $user_id)
{
    $check = DB::table("attendance_logs")->select('clock_time')
        ->whereRaw("clock_date = '" . $date . "' AND employee_id = '" . $user_id . "'")
        ->where('type', 2)
        ->orderBy('id', 'DESC')
        ->first();

    if ($check) {
        return $check->clock_time;
    }
    return '';
}


function get_options($key = null)
{
    if (! empty($key)) {
        $setting = Settings::select('value')->where('key', $key)->first();
        if ($setting) {
            return $setting->value;
        } else {
            return '';
        }
    }
    return Settings::get();
}

function loginUserRole()
{
    if(Auth::user()){
          return Auth::user()->user_role;
    }
    else{
        return "";
    }
  
}

function noofworkingdays()
{
    return '21';
}
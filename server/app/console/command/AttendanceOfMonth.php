<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\User;
use App\Models\Employees;
use App\Notifications;
use App\LeaveTypes;
use App\AttendanceLog;
use App\Models\AttendanceRules;
use App\Models\EmployeeAttendance;
use App\Models\EmployeeLeaveLogs;
use App\EmployeeRoles;
use App\Models\ObCandidates;
use Carbon\Carbon;

use App\Models\Holidays;



class AttendanceOfMonth extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mark:attendance_month';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'End of the day employee logout and mark his attendace accordingly.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        for($i = 30; $i > 0; $i--)
        {

            $current_date= date("Y-m-d", strtotime("-$i days"))."-------";
             $employees =Employees::where('status','1')->get();
        foreach ($employees as $employee) {
        $empdball = EmployeeAttendance::where('employee_id', $employee->id)->where('calculation_status', 1)
                    ->where('clock_date', $current_date)
                    ->get();
        $holiday =Holidays::where('date_of_event',$current_date)->where('status','1')->first();
        $leaves =EmployeeLeaveLogs::where('employee_id', $employee->id)->where('start_date',$current_date)->first();

        $date = $current_date;
        $unixTimestamp = strtotime($date);
        $dayOfWeek = date("l", $unixTimestamp);

        if (!empty($empdball->toArray())) {
          foreach ($empdball as $empdb) 
          {
            $user_id = $empdb->employee_id;
            
            $employee = Employees::where('id', $user_id)->where('status','1')->first();
            $shift_type = $employee->shift_type;

            $obcandidates  = ObCandidates::where('office_employee_id', $user_id)->first();
            $id = $obcandidates->attendance_rule_id;
            $attendance = AttendanceRules::where('id',$id)->first();
            $intime = $attendance->shift_in_time;
            $outtime = $attendance->shift_out_time;

            $anomaly_in_time = $attendance->anomaly_in_time;
            $anomaly_out_time = $attendance->anomaly_out_time;


            $workinghours = $attendance->per_day_working_hours;
            $maxbreaks = $attendance->max_break;
            $fulltime = $attendance->work_full_time_duration;
            $halftime = $attendance->work_half_time_duration;
            $shorttime = $attendance->work_short_leave_duration;
            
            $total_working_hours = getWorkingHoursByDate($date, $user_id, 'time');
            $breaks = getBreakByDate($date, $user_id);
            $clockout = getClockEndByDate($date, $user_id);
            $clock_in = $empdb->clock_in;  

            // P: Present, A: Absent, L: Leave, WO: Weekly off , H: Holiday, HL: Half day leave, AN: Anomaly, AC: Auto Clock-out, OR: Other Reason

           
            $temp_hours = '00:00:00';
            $pending_hours = '00:00:00';
            if($workinghours > $total_working_hours){
              $startTime  = Carbon::parse($workinghours);
              $finishTime = Carbon::parse($total_working_hours);

              $totalDuration = $finishTime->diffInSeconds($startTime);
              $pending_hours = gmdate('H:i:s', $totalDuration);
            }
            $attStatus = 'other';
            if($holiday){
              $attStatus = 'H';
            } 
            if($dayOfWeek == 'Saturday' || $dayOfWeek == 'Sunday' )
            { 
              $attStatus = 'WO';
            }
            if($dayOfWeek == 'Saturday' && !empty($clock_in) )
            { 
              if($clock_in <= $intime && $clockout >= $outtime && $breaks <= $maxbreaks && $total_working_hours >= $workinghours)
              {
                $attStatus = 'P';
              }
              else{


                  if($shorttime > $pending_hours && $pending_hours != $temp_hours)
                  {
                      $attStatus = 'SL';
                  }
                  elseif($pending_hours > $shorttime && $pending_hours < $halftime)
                  {
                      $attStatus = 'HL';
                  }
                  else if($halftime < $pending_hours)
                  {
                      $attStatus = 'L';
                  }else{
                    $attStatus = 'P';
                  }
                
              }
                /*if($shorttime < $pending_hours){

                
                if($shorttime < $pending_hours){
                  $attStatus = 'SL';
                }else if( $clock_in <= $intime && $clockout >= $outtime ){
                  $attStatus = 'SL';
                }else{
                  $attStatus = 'SL';
                }
                $attStatus = 'AN';


              }*/
            }
            if($dayOfWeek == 'Sunday' && !empty($clock_in) )
            { 
              if($clock_in <= $intime && $clockout >= $outtime && $breaks <= $maxbreaks && $total_working_hours >= $workinghours)
              {
                $attStatus = 'P';
              }
              else{
                //$attStatus = 'AN';
                if($shorttime > $pending_hours && $pending_hours != $temp_hours)
                  {
                      $attStatus = 'SL';
                  }
                  elseif($pending_hours > $shorttime && $pending_hours < $halftime)
                  {
                      $attStatus = 'HL';
                  }
                  else if($halftime < $pending_hours)
                  {
                      $attStatus = 'L';
                  }else{
                    $attStatus = 'P';
                  }

              }
            }

            if($attStatus == 'other'){
              if($clock_in <= $intime){

                if($clock_in <= $intime && $clockout >= $outtime && $breaks <= $maxbreaks && $total_working_hours >= $workinghours)
                {
                  $attStatus = 'P';
                }
                else{
                  //$attStatus = 'AN';
                  if($shorttime > $pending_hours && $pending_hours != $temp_hours)
                  {
                      $attStatus = 'SL';
                  }
                  elseif($pending_hours > $shorttime && $pending_hours < $halftime)
                  {
                      $attStatus = 'HL';
                  }
                  else if($halftime < $pending_hours)
                  {
                      $attStatus = 'L';
                  }else{
                    $attStatus = 'P';
                  }
                }

              }else{
                
                $intime  = strtotime("+".$anomaly_in_time." minutes", strtotime($intime));
                $outtime = strtotime("+".$anomaly_out_time." minutes", strtotime($outtime));

                if($clock_in <= $intime && $clockout >= $outtime && $breaks <= $maxbreaks && $total_working_hours >= $workinghours)
                {
                  $attStatus = 'P';
                }
                else{
                  // $attStatus = 'AN';
                  if($shorttime > $pending_hours && $pending_hours != $temp_hours)
                  {
                      $attStatus = 'SL';
                  }
                  elseif($pending_hours > $shorttime && $pending_hours < $halftime)
                  {
                      $attStatus = 'HL';
                  }
                  else if($halftime < $pending_hours)
                  {
                      $attStatus = 'L';
                  }else{
                    $attStatus = 'P';
                  }
                }  

              }
              
            }  
            
            $empdb->clock_out = $clockout;
            $empdb->status = $attStatus;
            $empdb->work_duration = $total_working_hours;
            $empdb->overtime = '00:00';
            $empdb->break_duration = getBreakHoursByDate($current_date,$employee->id,'time');
            if($clock_in>$intime){
              $empdb->is_late='1';
            }else{
              $empdb->is_late='0';
            }
            $empdb->total_breaks = $breaks;
           $empdb->calculation_status = 2;
            $empdb->save();

     

            
            echo $pending_hours."\n";
            echo $clock_in."\n";
            echo $dayOfWeek."\n";
            echo $attStatus."\n";

            echo '<pre>';
            print_r($empdb->toArray());
            echo '</pre>';


          }
        }else{

          if($holiday){
            $s= 'H';
          }
          else if($dayOfWeek == 'Saturday' || $dayOfWeek == 'Sunday' )
          { 
            $s = 'WO';
          }
          
          else if(!empty($leaves))
          {
            if($leaves->start_half == '1' && $leaves->end_half == '1' && $leaves->status == '2')
            {
              $s= 'HL';
            }
            elseif($leaves->start_half == '1' && $leaves->end_half == '2' && $leaves->status == '2')
            {
              $s= 'L';
            }
            elseif($leaves->start_half == '2' && $leaves->end_half == '1' && $leaves->status == '2')
            {
              $s= 'L';
            }
            elseif($leaves->start_half == '2' && $leaves->end_half == '2' && $leaves->status == '2')
            {
              $s= 'HL';
            }
            else
            {
              $s= 'L';
            }
          }
          else{
             $s= 'A';
          }

          //echo $clock_in;
          //echo $dayOfWeek;
          echo $s;

         
          $attendance = new EmployeeAttendance();
          $attendance->employee_id = $employee->id; 
          $attendance->clock_date = $current_date;//date("Y-m-d", strtotime("yesterday"));
          $attendance->status =$s;
          $attendance->clock_in = '-';
          $attendance->calculation_status = '2';
          $attendance->save();
        }
        }

        

        }
        return 0;
     //   $current_date = date('Y-m-d');
        // $current_date = '2021-07-26';
        //$employees =Employees::where('status','1')->where('id',534)->get();
       
    }
}

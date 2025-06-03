<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Http\Controllers;
use Illuminate\Support\Facades\Log;
class Notifications extends Model
{
    
   /*  public function saveNotification($notification)
    {
        $message = '';
        switch ($notification->type_id) {
            case "test_complete":
                $message = route('viewCandidateTest', $notification->page_id);
                break;
            case "blue":
                echo "Your favorite color is blue!";
                break;
            case "green":
                echo "Your favorite color is green!";
                break;
            default:
                echo "Your favorite color is neither red, blue, nor green!";
        }
        
        
        Notifications::create();
        
        
        return $link;
    } */

    public function getLink($notification)
    {
        $link = '';

        switch ($notification->type_id) {
            // case "test_complete":
            //     $link = route('viewCandidateTest', $notification->page_id);
            //     break;

            // case "readiness_complete":
            //     $link = route('viewReadinessTest', $notification->page_id);
            //     break;

            // case "Resignation":
            //     $link = route('em-exit');
            //     break;

            // case "attendacne_approval_request":
            //     if(app('Illuminate\Contracts\Auth\Guard')->user()->role_id==1 && app('Illuminate\Contracts\Auth\Guard')->user()->user_role==1 ) {
            //       $link = route('leavelogs');
            //         break;
            //     }
            //     else {
            //         $link = route('em-leaves');
            //         break;
            //     }

            case "leave_request":
                $link = route('em-leaves');
                break;
                
            // case "salary_slip":
            //     if(app('Illuminate\Contracts\Auth\Guard')->user()->role_id==1 && app('Illuminate\Contracts\Auth\Guard')->user()->user_role==1 ) {
            //         $link = route('salary-slip-admin');
            //         break;
            //     }
            //     else {
            //         $link = route('em-salary-slip');
            //         break;
            //     }
                
            // case "slip_gernated":
            //     $link = route('em-salary-slip');
            //     break;
                

            // case "ticket_created":
            //     if(app('Illuminate\Contracts\Auth\Guard')->user()->user_role==3 || app('Illuminate\Contracts\Auth\Guard')->user()->id==1) {
            //         $link = route('em-ticket-system-detail', $notification->page_id);
            //         break;
            //     }
            //     else {
            //         // $link = route('em-support-ticket', 'mytickets');
            //         $link = route('em-ticket-detail', $notification->page_id);
            //         break;
            //     }

            // case "salary_approval_by_hr":
            //     $link = route('attendance-whole-report-emp');
            //     break;

            // case "salary_approval_by_admin":
            //     $link = route('attendance-whole-report');
            //     break;

            default:
                $link = 'javascript:void(0);';
        }

        return $link;
    }
}

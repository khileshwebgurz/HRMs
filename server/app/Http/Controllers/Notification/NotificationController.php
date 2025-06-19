<?php

namespace App\Http\Controllers\Notification;
// use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\CandidateTest;
use App\Models\Employees;
use App\Models\ReadinessAnswer;
use Illuminate\Support\Facades\Auth;
use App\Models\Notifications;
use Illuminate\Support\Facades\Log;


// use Illuminate\Http\Request;
class NotificationController extends Controller
{
    public function viewCandidateTest($test_id)
    {
        $can_test = CandidateTest::where('id', $test_id)->where('status', '3')
            ->with('questions')
            ->first();
        if ($can_test) {
            return view('users.candidates.test.view', compact('can_test'));
        } else {
            abort(404);
        }
    }

    public function viewReadinessTest($test_id)
    {
        $last = ReadinessAnswer::where('employee_id', $test_id)->latest()->first();
        $employee = Employees::where('id', $test_id)->first();
        if ($last) {
            return view('users.candidates.readiness.view', compact('last', 'employee'));
        } else {
            abort(404);
        }
    }


    public function realTimeNotificationByCurrentUser()
    {
        //sdfs
        $loginuser = Auth::user();
        if ($loginuser) {

            $notifications = Notifications::where('notify_status', '1')->where('notify_to', $loginuser->id)
                 // ->where('notify_type','3') //, this is also commented by us to see the notification of leave to the manager.
                ->orderBy('id', 'DESC')
                ->get();

            if ($notifications) {
                $messages = [];
                foreach ($notifications as $notify) {
                    // Log::info('Notification:', ['notify' => $notify]);
                    // $notify->notify_status = 2;  this part was uncommented due to this when i refresh page the notification is vanished bcz it's changing the status of notification as seen/read.
                    $notify->save();
                   
                    $messages[] = [
                        'id' => $notify->id,
                        'message' => $notify->message,
                        'link' => getReactLink($notify), //we are passing links from this inside helper as like getLink()
                       
                    ];

                    // Log::info('Notification:', ['notify' => $notify]);
                    
                }

                return response()->json([
                    'status' => 200,
                    'data' => $messages
                ]);
            } else {
                return response()->json([
                    'status' => 400,
                    'message' => "Email send to selected users email address."
                ]);
            }
        } else {
            return response()->json([
                'status' => 419,
                'message' => "Page expired"
            ]);
        }
    }
}

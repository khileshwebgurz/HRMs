<?php

namespace App\Http\Controllers\Employee;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use App\Models\CandidateTest;
use App\Models\Employees;
use App\Models\ReadinessAnswer;
use Illuminate\Support\Facades\Auth;
use App\Models\Notifications;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
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
        $employee =Employees::where('id', $test_id)->first();
        if ($last) {
            return view('users.candidates.readiness.view', compact('last','employee'));
        } else {
            abort(404);
        }
    }


    public function realTimeNotificationByCurrentUser()
    {
        //sdfs
        $loginuser = Auth::user();
        if($loginuser)
        {
            
            $notifications = Notifications::where('notify_status', '1')->where('notify_to', $loginuser->id)
        //   ->where('notify_type','3')
            ->orderBy('id', 'DESC')
            ->get();
            Log::info('Notifications array:', $notifications->toArray());
            if ($notifications) {
                $messages = [];
                foreach ($notifications as $notify) {
                    $notify->notify_status = 2;
                    $notify->save();
                    $messages[] = $notify->message;
                }
                Log::info('Messages array:', $messages);
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
        }
        else
        {
            return response()->json([
                    'status' => 419,
                    'message' => "Page expired"
                ]);
        }
        
    }


    // public function notifications(Request $request)
    // {
    //     // Mark all unseen notifications as seen
    //     Notifications::where('notify_to', Auth::id())
    //         ->where('is_seen', '0')
    //         ->update(['is_seen' => '1']);
    
    //     // Fetch today's notifications for logged-in user
    //     $notifications = Notifications::where('notify_to', Auth::id())
    //         ->whereDate('created_at', Carbon::today())
    //         ->orderByDesc('created_at')
    //         ->get();
    
    //     // Add link to each notification using getLink() method
    //     $notifications = $notifications->map(function ($notification) {
    //         return [
    //             'id' => $notification->id,
    //             'message' => $notification->message,
    //             'created_at' => $notification->created_at->toDateTimeString(),
    //             'link' => $notification->getLink(),
    //         ];
    //     });
    
    //     return response()->json([
    //         'status' => 200,
    //         'notifications' => $notifications,
    //     ]);
    // }
  

}

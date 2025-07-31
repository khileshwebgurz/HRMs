<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Tickets;
use App\Models\Notifications;
use App\Models\Employees;
use Illuminate\Support\Facades\Log;
use App\Traits\PermissionTrait;
use Carbon\Carbon;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Facades\Mail;

class TicketController extends Controller
{
    use PermissionTrait;

    public function ticketViewByEmployee(Request $request)
    {
        // if (!$this->userHasPermission([12])) {
        //     return $this->permissionDeniedResponse();
        // }

        $id = Auth::id();



        $perPage = $request->input('per_page', 10); // Default 10 tickets per page
        $page = $request->input('page', 1);

        $ticketQuery = Tickets::where('employee_id', $id);

        if (!empty($request->datefilter)) {
            $dates = explode(" - ", $request->datefilter);
            $ticketQuery->whereBetween('created_at', [
                $dates[0] . ' 00:00:00',
                $dates[1] . ' 23:59:59'
            ]);
        }

        // this is commented bcz this is causing issue when sorting the tickets based on progress, open and closed.
        if (!empty($request->status)) {
            $statusMap = [
                'Open' => 1,
                'Closed' => 2,
                'In Progress' => 3,
            ];

            if (isset($statusMap[$request->status])) {
                $ticketQuery->where("status", $statusMap[$request->status]);
            }
        }

        $total = $ticketQuery->count();

        $tickets = $ticketQuery->latest()
            ->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get();



        $formattedTickets = $tickets->map(function ($ticket) {
            $employee = $ticket->employee;
            $profilePic = $employee && $employee->profile_pic
                ? asset('uploads/employees-photos/' . $employee->profile_pic)
                : asset('dist/img/employee_default_img.png');

            $issueTypeMap = [
                '1' => 'Hardware',
                '2' => 'Software',
                '3' => 'Server',
                '4' => 'Internet'
            ];

            $statusMap = [
                '1' => 'Open',
                '2' => 'Closed',
                '3' => 'In Progress'
            ];

            $issueType = $issueTypeMap[$ticket->issue_type] ?? '-';
            $status = $statusMap[$ticket->status] ?? '-';

            // Format created_at date
            $createdAt = $ticket->created_at;
            $formattedDate = $createdAt;

            return [
                'id' => $ticket->id,
                'ticket_id' => 'IMS-' . $ticket->id,
                'employee_name' => $employee->name ?? '-',
                'employee_image' => $profilePic,
                'issue_type' => $issueType,
                'description' => $ticket->description,
                'created_at' => $formattedDate,
                'status' => $status,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedTickets,
            'total' => $total,
            'page' => $page,
            'per_page' => $perPage,
        ]);
    }

    public function addTicket(Request $request)
    {
        $user = Auth::user();
        $userId = $user->id;

        $ticket = new Tickets;

        // Set employee_id
        if ($request->user_role == '3' && $request->filled('employee')) {
            $ticket->employee_id = $request->employee;
        } else {
            $ticket->employee_id = $userId;
        }


        // Map issue type
        $issueTypes = [
            'Hardware' => '1',
            'Software' => '2',
            'Server'   => '3',
            'Internet' => '4',
        ];
        $ticket->issue_type = $issueTypes[$request->issue] ?? null;


        // Map issue level
        $issueLevels = [
            'P1' => ['level' => '1', 'solved_in' => '30 to 60 minutes', 'label' => 'P1 - Service Unusable in Production'],
            'P2' => ['level' => '2', 'solved_in' => 'Up to 2 Hours', 'label' => 'P2 - Service Partially Not Working'],
            'P3' => ['level' => '3', 'solved_in' => 'Up to 8 Hours', 'label' => 'P3 - Service Partially Impaired'],
            'P4' => ['level' => '4', 'solved_in' => 'Up to 48 Hours', 'label' => 'P4 - Service Usable'],
        ];

        if (isset($issueLevels[$request->level])) {
            $ticket->issue_level = $issueLevels[$request->level]['level'];

            $ticket->solved_in = $issueLevels[$request->level]['solved_in'];

            $levelMail = $issueLevels[$request->level]['label'];
        } else {
            return response()->json([
                'status' => 422,
                'message' => 'Invalid issue level',
            ]);
        }

        $ticket->description = $request->description;
        Log::info('My >>>>', ['h1' => $ticket]);
        // $ticket->save();
        if (!$ticket->save()) {
            Log::info('My high >>>>');
            return response()->json([
                'status' => 500,
                'message' => 'Failed to create ticket.',
            ]);
        }

        // Notify managers and admins
        $employees = Employees::where('user_role', '3')->where('status', '1')->get();

        $mailEmails = [];
        $mailNames = [];

        foreach ($employees as $emp) {
            $mailEmails[] = $emp->email;
            $mailNames[] = $emp->name;

            $noti = new Notifications;
            $noti->type_id = 'ticket_created';
            $noti->message = $user->name . ' has posted a ticket';
            $noti->page_id = $ticket->id;
            $noti->notify_from = $user->id;
            $noti->notify_to = $emp->id;
            $noti->notify_type = $emp->is_manager ? '2' : '3';
            if (!$emp->is_manager) {
                $noti->notify_panel = '1';
            }
            $noti->save();
        }

        // Notify super admin (id=1)
        $admin = Employees::find(1);
        if ($admin) {
            $adminNoti = new Notifications;
            $adminNoti->type_id = 'ticket_created';
            $adminNoti->message = $user->name . ' has posted a ticket';
            $adminNoti->page_id = $ticket->id;
            $adminNoti->notify_from = $admin->id;
            $adminNoti->notify_to = $admin->id;
            $adminNoti->notify_type = '2';
            $adminNoti->save();
        }


        // Prepare email data


        $mailData = [
            'name' => 'IT Team',
            'type' => 'New ticket posted by ' . $user->name,
            'issue' => $request->issue . ' issue has been raised.',
            'level' => $levelMail,
            'description' => $request->description,
            'id' => $ticket->id,
        ];

        try {
            // Mail::send('emails.ticket', $mailData, function ($message) use ($mailEmails, $mailNames) {
            //     $message->to($mailEmails, $mailNames)->subject('New Ticket Notification');
            // });

            // Send to admin
            if ($admin) {
                $adminData = $mailData;
                $adminData['name'] = $admin->name;
                // Mail::send('emails.ticket', $adminData, function ($message) use ($admin) {
                //     $message->to($admin->email, $admin->name)->subject('New Ticket Notification');
                // });
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'message' => 'Ticket saved but email failed to send.',
                'error' => $e->getMessage(),
            ]);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Ticket successfully created.',
            'ticket_id' => $ticket->id,
        ]);
    }


    // this function is completely changed by me , if in any case this doesn't work we need to rollback to older 
    // function logic from old HRM code.
    public function ticketViewByITteam(Request $request, $tab)
    {
        // $id = Auth::user()->id;
        // $ticket = Tickets::latest();
        $filters = Tickets::$filterdata;
       
        $open_count = Tickets::where('status', '1')->count();
        $close_count = Tickets::where('status', '2')->count();

        // Build base query
        $ticketQuery = Tickets::latest();

        if (!empty($request->datefilter)) {
            Log::info('My  $request->datefilter) query are  >>>>', ['$request->datefilter)' => $request->datefilter]);
            $dates = explode(" - ", $request->datefilter);

            Log::info('My  dates query are  >>>>', ['dates' => $dates]);
            // Check if two dates were passed
            if (count($dates) === 2) {
                $start = $dates[0] . ' 00:00:00';
                $end = $dates[1] . ' 23:59:59';
            } else {
                // Only one date - treat as single day filter
                $start = $dates[0] . ' 00:00:00';
                $end = $dates[0] . ' 23:59:59';
            }

            $ticketQuery->whereBetween('created_at', [$start, $end]);
            Log::info('My  ticket query are  >>>>', ['ticketQuery' => $ticketQuery]);
        }

        if (!empty($request->status)) {
            $ticketQuery->where("status", $request->status);
        }

        // using pagination
        $perPage = $request->input('per_page', 5);
        $tickets = $ticketQuery->paginate($perPage);

        // $ticket = $ticket->get();

        // If it's an API request (e.g., from React), return JSON instead of Blade view

        $transformedTickets = $tickets->getCollection()->transform(function ($ticket) {
            $employee = \App\Models\Employees::find($ticket->employee_id);

            return [
                'id' => $ticket->id,
                'ticket_no' => '#IMS-' . $ticket->id,
                'issue_type' => match ($ticket->issue_type) {
                    '1' => 'Hardware',
                    '2' => 'Software',
                    '3' => 'Server',
                    '4' => 'Internet',
                    default => '-',
                },
                'issue_level' => match ($ticket->issue_level) {
                    '1' => 'P1',
                    '2' => 'P2',
                    '3' => 'P3',
                    '4' => 'P4',
                    default => '-',
                },
                'status' => match ($ticket->status) {
                    '1' => 'Open',
                    '2' => 'Closed',
                    '3' => 'In Progress',
                    default => '-',
                },
                'created_at' => $ticket->created_at->format('d/M/Y') === now()->format('d/M/Y')
                    ? $ticket->created_at->format('H:i A')
                    : $ticket->created_at->format('d M Y'),
                'description' => $ticket->description,
                'employee_name' => $employee->name ?? '-',
                'work_station' => $employee->work_station_number ?? '-',
            ];
        });

        // Return paginated data + open/close counts
        return response()->json([
            'tickets' => $transformedTickets,
            'pagination' => [
                'total' => $tickets->total(),
                'current_page' => $tickets->currentPage(),
                'per_page' => $tickets->perPage(),
                'last_page' => $tickets->lastPage(),
            ],
            'open_count' => $open_count,
            'close_count' => $close_count,
            'filterdata' => $filters,
        ]);
    }

    // this ticket controller is for it admin
//     public function addticket(Request $request)
//   {
//     $id = Auth::user()->id;
//     // print_r($id); die();
//     // $employee = Employees::where('id', $id)->first();
//     $ticket = new Tickets;
//     if($request->user_role == '3')
//     {
//       $ticket->employee_id = $request['employee'];
//     }
//     else
//     {
//       $ticket->employee_id = $id;
//     }

//     if($request['issue'] == 'Hardware')
//     {
//       $ticket->issue_type = '1';
//     }
//     if($request['issue'] == 'Software')
//     {
//       $ticket->issue_type = '2';
//     }
//     if($request['issue'] == 'Server')
//     {
//       $ticket->issue_type = '3';
//     }
//     if($request['issue'] == 'Internet')
//     {
//       $ticket->issue_type = '4';
//     }
//     // $ticket->issue_type = $request['issue'];

//     if($request['level'] == 'P1')
//     {
//       $ticket->issue_level = '1';
//       $ticket->solved_in = '30 to 60 minutes';
//       $level_mail = 'P1- Service Unuseable in Production';
//     }
//     if($request['level'] == 'P2')
//     {
//       $ticket->issue_level = '2';
//       $ticket->solved_in = 'Upto 2 Hours';
//       $level_mail = 'P2- Service Partially not working';
//     }
//     if($request['level'] == 'P3')
//     {
//       $ticket->issue_level = '3';
//       $ticket->solved_in = 'Upto 8 Hours';
//       $level_mail = 'P3- Service Partially Impaired';
//     }
//     if($request['level'] == 'P4')
//     {
//       $ticket->issue_level = '4';
//       $ticket->solved_in = 'Upto 48 Hours';
//       $level_mail = 'P4- Service Useable';
//     }
//     // $ticket->issue_level = $request['level'];
//     $ticket->description = $request['description'];
    
//     // $ticket->status = '1';
//     // $ticket->save();
//     // return ["msg"=>"Data Inserted","btn"=>"<a href='/hrm/employee/support-ticket' class='btn btn-success'>Contiune</a>",];
    

//     // $ticket->issue_to = $it_mail->id;

//     if($ticket->save())
//     {
//       $employee = Employees::where('user_role', '3')->where('status', '1')->get();
//       foreach ($employee as $key => $value)
//       {
//         $mail_email[] = $value->email;
//         $mail_name[] = $value->name;
//         // $mail_id[] = $value->id;

//         if($value->is_manager == '1')
//         {
//           $noti = new Notifications;
//           $noti->type_id = 'ticket_created';
//           $noti->message = Auth::user()->name . ' has post a ticket';
//           $noti->page_id = $ticket->id;
//           $noti->notify_from = Auth::user()->id;
//           $noti->notify_type = '2';
//           $noti->notify_to = $value->id;
//           $noti->save();
//         }
//         else
//         {
//           $noti = new Notifications;
//           $noti->type_id = 'ticket_created';
//           $noti->message = Auth::user()->name . ' has post a ticket';
//           $noti->page_id = $ticket->id;
//           $noti->notify_from = Auth::user()->id;
//           $noti->notify_to = $value->id;
//           $noti->notify_type = '3';
//           $noti->notify_panel = '1';
//           $noti->save();
//         }
//       }

//       $admin = Employees::where('id', '1')->first();
//       $noti = new Notifications;
//       $noti->type_id = 'ticket_created';
//       $noti->message = Auth::user()->name . ' has post a ticket';
//       $noti->page_id = $ticket->id;
//       // $noti->notify_status = '2';
//       $noti->notify_from = $admin->id;
//       $noti->notify_type = '2';
//       $noti->notify_to = $admin->id;
//       $noti->save();

//       // $to_name = $it_mail->name;
//       // $to_email = $it_mail->email;
//       $to_name = $mail_name;
//       $to_email = $mail_email;
//       $data = array(
//         // 'name' => $to_name,
//         'name' => 'IT Team',
//         'type' => 'New ticket post by '.Auth::user()->name.'',
//         'issue' => ''.$request['issue']. ' issue has been raised.',
//         'level' => $level_mail,
//         'description' => $request['description'],
//         'id'=> $ticket->id
//       );
//       Mail::send('emails.ticket', $data, function ($message) use ($to_name, $to_email) {
//         $message->to($to_email, $to_name)->subject('Welcome to ticket');
//       });
//       if(! Mail::failures())
//       {
//         $admin_detail = Employees::where('id', '1')->first();
//         $to_admin_name = $admin_detail->name;
//         $to_admin_email = $admin_detail->email;
//         $data = array(
//           'name' => $to_admin_name,
//           'type' => 'New ticket post by '.Auth::user()->name.'',
//           'issue' => $request['issue']. ' issue has been raised.',
//           'level' => $level_mail,
//           'description' => $request['description'],
//           'id'=> $ticket->id
//         );
//         Mail::send('emails.ticket', $data, function ($message) use ($to_admin_name, $to_admin_email) {
//           $message->to($to_admin_email, $to_admin_name)->subject('Welcome to ticket');
//         });

//         // return ["msg"=>"Data Inserted","btn"=>"<a href='/hrm/employee/support-ticket' class='btn btn-success'>Contiune</a>",];
//         $thankyou = asset('dist/img/thank-you-img.png');
//         $countinue = route('em-support-ticket', 'mytickets');
//         return ["msg"=>"
//           <div class='thank-you-wrapper text-center'>
//             <figure>
//               <img src='$thankyou' alt='' />
//             </figure>
//             <h3>Thanks for Submit your Ticket!</h3>
//             <p>Your Issue will resolve as soon as possible.</p>
//             <div class='btn-block'><a href='$countinue' class='btn site-main-btn'>Contiune</a></div>
//           </div>"];
//       }
//       else
//       {
//         return response()->json([
//           'status' => 401,
//           'message' => 'Something Wrong. Try Again.'
//         ]);
//       }
//     }
//     // else
//     // {
//     //   return response()->json([
//     //     'status' => 401,
//     //     'message' => 'Something Wrong. Try Again.'
//     //   ]);
//     // }
  
//   }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Tickets;
use App\Models\Notifications;
use App\Models\Employees;
use Illuminate\Support\Facades\Log;

class TicketController extends Controller
{
    public function ticketViewByEmployee(Request $request)
    {
        $id = Auth::id();
        $ticketQuery = Tickets::where('employee_id', $id);

        if (!empty($request->datefilter)) {
            $dates = explode(" - ", $request->datefilter);
            $ticketQuery = $ticketQuery->whereBetween('created_at', [
                $dates[0] . ' 00:00:00',
                $dates[1] . ' 23:59:59'
            ]);
        }

        if (!empty($request->status)) {
            $ticketQuery = $ticketQuery->where("status", $request->status);
        }

        $tickets = $ticketQuery->latest()->get();

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
            $formattedDate = $createdAt->isToday()
                ? $createdAt->format('h:i A')
                : $createdAt->format('d M Y');

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
            'data' => $formattedTickets
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
}

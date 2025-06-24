<?php

namespace App\Http\Controllers;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use DOMDocument;
use App\Models\User;
use App\Models\Candidates;
use App\Models\Notifications;
use App\Models\Tickets;
use App\Models\InventoryItems;
use App\Models\Employees;
use App\Models\Domain_and_renewal;
use App\Models\Ticketreply;
use App\Models\Roles;
use App\Models\EmployeeAttendance;
use Illuminate\Support\Facades\Log;
use App\Models\Permissions;
use App\Http\Middleware\RolePermissionMiddleware;


class TicketController extends Controller
{


  private function extractUserPermissionIds()
    {
        $user = Auth::guard('api')->user();
        if (!$user) return null;

        $role = Roles::find($user->user_role);
        if (!$role) return null;

        $permissionIds = json_decode($role->permissions ?? '[]', true);
        return is_array($permissionIds) ? $permissionIds : [];
    }

   private function checkUserPermissionById($permissionId)
    {
        $permissionIds = $this->extractUserPermissionIds();
        if (is_null($permissionIds)) return false;

        $permissionIds = array_map('intval', $permissionIds);

        if (is_array($permissionId)) {
            foreach ($permissionId as $id) {
                if (in_array((int)$id, $permissionIds)) {
                    return true; 
                }
            }
            return false;
        }

        return in_array((int)$permissionId, $permissionIds);
    }


    private function permissionDeniedResponse($message = 'Permission not granted for this user')
    {
        return response()->json([
            'status' => 403,
            'message' => $message,
            'error' => 'Access Denied'
        ], 403);
    }

    public function getUserPermissions(Request $request)
    {
        $permissionIds = $this->extractUserPermissionIds();

        if (is_null($permissionIds)) {
            return response()->json(['message' => 'Unauthenticated or Role not found'], 401);
        }

        $permissions = Permissions::whereIn('id', $permissionIds)->get();

        return response()->json([
            'status' => 200,
            'permission_ids' => $permissionIds,
            'permissions' => $permissions
        ]);
    }


    
    public function ticketViewByEmployee111(Request $request)
    {
    
        $permissionIds = $this->extractUserPermissionIds();

        Log::info('Checking permission for permissionIds', [
            'permissionIds' => $permissionIds
        ]);

    
        if (is_null($permissionIds)) {
            return response()->json(['message' => 'Unauthenticated or Role not found'], 401);
        }

        $permissionIdToCheck = [12];
        $hasPermission = $this->checkUserPermissionById($permissionIdToCheck);

        Log::info('Checking permission for ticketViewByEmployee', [
            'checked_id' => $permissionIdToCheck,
            'has_permission' => $hasPermission
        ]);

        if (!$hasPermission) {
            return $this->permissionDeniedResponse();
        }

        Log::debug('User permission IDs', [
            'ids' => $permissionIds
        ]);


        $user = auth('api')->user();
        $id = $user->id;


        $query = Tickets::where('employee_id', $id);

        if (!empty($request->datefilter)) {
            $dates = explode(" - ", $request->datefilter);
            $query->whereBetween('created_at', [
                $dates[0] . ' 00:00:00',
                $dates[1] . ' 23:59:59'
            ]);
        }


        if (!empty($request->status)) {
            $query->where('status', $request->status);
        }


        $tickets = $query->latest()->get();

        Log::info('Tickets Retrieved', [
            'count' => $tickets->count(),
            'data' => $tickets
        ]);

    
        $formatted = $tickets->map(function ($ticket) {
            $issueTypes = ['1' => 'Hardware', '2' => 'Software', '3' => 'Server', '4' => 'Internet'];
            $statusLabels = ['1' => 'Open', '2' => 'Closed', '3' => 'In Progress'];

            $employee = Employees::find($ticket->employee_id);

            return [
                'id' => $ticket->id,
                'issue_type' => $issueTypes[$ticket->issue_type] ?? '-',
                'status' => $statusLabels[$ticket->status] ?? '-',
                'description' => $ticket->description,
                'created_at' => $ticket->created_at->toDateTimeString(),
                'date_display' => $ticket->created_at->isToday()
                    ? $ticket->created_at->format('h:i A')
                    : $ticket->created_at->format('d M Y'),
                'employee_name' => $employee->name ?? '-',
                'employee_photo' => $employee && $employee->profile_pic
                    ? asset('uploads/employees-photos/' . $employee->profile_pic)
                    : asset('dist/img/employee_default_img.png'),
            ];
        });


        return response()->json([
            'status' => 200,
            'tickets' => $formatted
        ]);
    }
    
    public function ticketViewByEmployeeNEw(Request $request)
    {
       
        $permissionIds = $this->extractUserPermissionIds();
        Log::info('Checking permission for permissionIds', [
                        'permissionIds' => $permissionIds
                    ]);

        if (is_null($permissionIds)) {
            return response()->json(['message' => 'Unauthenticated or Role not found'], 401);
        }

        $permissions = Permissions::whereIn('id', $permissionIds)->get();

         $hasPermission = $this->checkUserPermissionById($permissionIds);
            Log::info('Checking permission for ticketViewByEmployee', [
                'has_permission' => $hasPermission
            ]);

        if (!$this->checkUserPermissionById(12)) {
            return $this->permissionDeniedResponse();
        }

        Log::debug('User permission IDs', [
                'ids' => $this->extractUserPermissionIds()
            ]);


        $user = auth('api')->user();
        $id = $user->id;

        $query = Tickets::where('employee_id', $id);

        if (!empty($request->datefilter)) {
            $dates = explode(" - ", $request->datefilter);
            $query->whereBetween('created_at', [
                $dates[0] . ' 00:00:00',
                $dates[1] . ' 23:59:59'
            ]);
        }

        if (!empty($request->status)) {
            $query->where('status', $request->status);
        }

        $tickets = $query->latest()->get();

        Log::info('Tickets Retrieved', [
            'count' => $tickets->count(),
            'data' => $tickets
        ]);

        $formatted = $tickets->map(function ($ticket) {
            $issueTypes = ['1' => 'Hardware', '2' => 'Software', '3' => 'Server', '4' => 'Internet'];
            $statusLabels = ['1' => 'Open', '2' => 'Closed', '3' => 'In Progress'];

            $employee = Employees::find($ticket->employee_id);

            return [
                'id' => $ticket->id,
                'issue_type' => $issueTypes[$ticket->issue_type] ?? '-',
                'status' => $statusLabels[$ticket->status] ?? '-',
                'description' => $ticket->description,
                'created_at' => $ticket->created_at->toDateTimeString(),
                'date_display' => $ticket->created_at->isToday()
                    ? $ticket->created_at->format('h:i A')
                    : $ticket->created_at->format('d M Y'),
                'employee_name' => $employee->name ?? '-',
                'employee_photo' => $employee && $employee->profile_pic
                    ? asset('uploads/employees-photos/' . $employee->profile_pic)
                    : asset('dist/img/employee_default_img.png'),
            ];
        });

        return response()->json([
            'status' => 200,
            'tickets' => $formatted
        ]);
    }


    public function ticketViewByEmployee(Request $request)
    {

        $permissionIds = $this->extractUserPermissionIds();

        Log::info('Checking permission for permissionIds', [
            'permissionIds' => $permissionIds
        ]);

    
        if (is_null($permissionIds)) {
            return response()->json(['message' => 'Unauthenticated or Role not found'], 401);
        }

        $permissionIdToCheck = [12];
        $hasPermission = $this->checkUserPermissionById($permissionIdToCheck);

        Log::info('Checking permission for ticketViewByEmployee', [
            'checked_id' => $permissionIdToCheck,
            'has_permission' => $hasPermission
        ]);

        if (!$hasPermission) {
            return $this->permissionDeniedResponse();
        }

        Log::debug('User permission IDs', [
            'ids' => $permissionIds
        ]);


        $user = auth('api')->user();
        $id = $user->id;
        $query = Tickets::where('employee_id', $id);
        // Log::info('My query request is >>>>', ['query' => $query]);
        // Filter by date range if provided
        if (!empty($request->datefilter)) {
            $dates = explode(" - ", $request->datefilter);
            $query->whereBetween('created_at', [
                $dates[0] . ' 00:00:00',
                $dates[1] . ' 23:59:59'
            ]);
        }

        // Filter by status if provided
        if (!empty($request->status)) {
            $query->where('status', $request->status);
        }

        $tickets = $query->latest()->get();

        // Format for React consumption
        $formatted = $tickets->map(function ($ticket) {
            $issueTypes = [
                '1' => 'Hardware',
                '2' => 'Software',
                '3' => 'Server',
                '4' => 'Internet',
            ];

            $statusLabels = [
                '1' => 'Open',
                '2' => 'Closed',
                '3' => 'In Progress',
            ];

            $employee = Employees::find($ticket->employee_id);

            return [
                'id' => $ticket->id,
                'issue_type' => $issueTypes[$ticket->issue_type] ?? '-',
                'status' => $statusLabels[$ticket->status] ?? '-',
                'description' => $ticket->description,
                'created_at' => $ticket->created_at->toDateTimeString(),
                'date_display' => $ticket->created_at->isToday()
                    ? $ticket->created_at->format('h:i A')
                    : $ticket->created_at->format('d M Y'),
                'employee_name' => $employee->name ?? '-',
                'employee_photo' => $employee && $employee->profile_pic
                    ? asset('uploads/employees-photos/' . $employee->profile_pic)
                    : asset('dist/img/employee_default_img.png'),
            ];
        });

        return response()->json([
            'status' => 200,
            'tickets' => $formatted,
        ]);
    }

    public function addticket(Request $request)
    {
        $user = auth('api')->user(); 
        $id = $user->id;

        $validator = Validator::make($request->all(), [
            'issue' => 'required|string',
            'level' => 'required|string',
            'description' => 'required|string',
            'user_role' => 'required|string',
            'employee' => 'sometimes|nullable|exists:employees,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 422,
                'errors' => $validator->errors(),
            ]);
        }

        $ticket = new Tickets;
        $ticket->employee_id = $request->user_role == '3' ? $request->employee : $id;

        $issueMap = [
            'Hardware' => '1',
            'Software' => '2',
            'Server' => '3',
            'Internet' => '4'
        ];

        $levelMap = [
            'P1' => ['1', '30 to 60 minutes', 'P1 - Service Unusable in Production'],
            'P2' => ['2', 'Up to 2 Hours', 'P2 - Service Partially Not Working'],
            'P3' => ['3', 'Up to 8 Hours', 'P3 - Service Partially Impaired'],
            'P4' => ['4', 'Up to 48 Hours', 'P4 - Service Useable'],
        ];

        $ticket->issue_type = $issueMap[$request->issue] ?? null;
        if (!$ticket->issue_type) {
            return response()->json(['status' => 400, 'message' => 'Invalid issue type']);
        }

        if (!isset($levelMap[$request->level])) {
            return response()->json(['status' => 400, 'message' => 'Invalid issue level']);
        }

        [$ticket->issue_level, $ticket->solved_in, $level_mail] = $levelMap[$request->level];
        $ticket->description = $request->description;

        if ($ticket->save()) {
            $managers = Employees::where('user_role', '3')->where('status', '1')->get();
            $mail_email = [];
            $mail_name = [];

            foreach ($managers as $manager) {
                $mail_email[] = $manager->email;
                $mail_name[] = $manager->name;

                $notification = new Notifications;
                $notification->type_id = 'ticket_created';
                $notification->message = $user->name . ' has posted a ticket';
                $notification->page_id = $ticket->id;
                $notification->notify_from = $user->id;
                $notification->notify_to = $manager->id;
                $notification->notify_type = $manager->is_manager ? '2' : '3';
                $notification->notify_panel = $manager->is_manager ? null : '1';
                $notification->save();
            }

            // Notify admin (assumed ID = 1)
            $admin = Employees::find(1);
            if ($admin) {
                $noti = new Notifications;
                $noti->type_id = 'ticket_created';
                $noti->message = $user->name . ' has posted a ticket';
                $noti->page_id = $ticket->id;
                $noti->notify_from = $admin->id;
                $noti->notify_to = $admin->id;
                $noti->notify_type = '2';
                $noti->save();
            }

            // Prepare email data
            $emailData = [
                'name' => 'IT Team',
                'type' => 'New ticket posted by ' . $user->name,
                'issue' => $request->issue . ' issue has been raised.',
                'level' => $level_mail,
                'description' => $request->description,
                'id' => $ticket->id,
            ];

            // Send mail to managers
            Mail::send('emails.ticket', $emailData, function ($message) use ($mail_email, $mail_name) {
                $message->to($mail_email, $mail_name)->subject('New Support Ticket');
            });

            // If mail succeeded, notify admin as well
            if (!Mail::failures() && $admin) {
                $adminData = array_merge($emailData, [
                    'name' => $admin->name,
                ]);
                Mail::send('emails.ticket', $adminData, function ($message) use ($admin) {
                    $message->to($admin->email, $admin->name)->subject('New Support Ticket');
                });
            }

            return response()->json([
                'status' => 200,
                'message' => 'Ticket submitted successfully',
                'ticket_id' => $ticket->id,
            ]);
        }

        return response()->json([
            'status' => 500,
            'message' => 'Ticket submission failed. Please try again.',
        ]);
    }


     public function datafilter(Request $request)
    {
        echo "error";
    }

    public function detail(Request $request, $id)
    {
        $employee_id = auth('api')->user()->id;

        $ticket = Tickets::find($id);
        if (!$ticket) {
            return response()->json([
                'status' => 404,
                'message' => 'Ticket not found',
            ], 404);
        }

        // Issue type conversion
        $issueTypes = [
            '1' => 'Hardware',
            '2' => 'Software',
            '3' => 'Server',
            '4' => 'Internet',
        ];
        $issue = $issueTypes[$ticket->issue_type] ?? '-';

        // Created at formatting
        $datecheck = date('d/M/Y', strtotime($ticket->created_at));
        $date = date('d/M/Y') === $datecheck
            ? date('H:i A', strtotime($ticket->created_at))
            : date('d M Y', strtotime($ticket->created_at));

        // Employee data
        $employee = Employees::find($employee_id);
        $emp_work = $employee->work_station_number ?? '-';
        $employee_pic = $employee->profile_pic ?? '-';
        $employee_name = $employee->name ?? '-';

        // Inventory items
        $hardwareTypes = [
            'desktop' => '1',
            'cpu' => '2',
            'keyboard' => '3',
            'mouse' => '4',
            'other' => '5'
        ];

        $inventory = [];
        foreach ($hardwareTypes as $key => $type) {
            $item = InventoryItems::where('employee_id', $employee_id)->where('hardware_type', $type)->first();
            $inventory[$key] = $item->name ?? '-';
        }

        return response()->json([
            'status' => 200,
            'ticket' => [
                'id' => $ticket->id,
                'issue' => $issue,
                'status' => $ticket->status,
                'description' => $ticket->description,
                'created_at' => $date,
            ],
            'employee' => [
                'name' => $employee_name,
                'profile_pic' => $employee_pic,
                'work_station' => $emp_work,
            ],
            'inventory' => $inventory,
        ]);
    }

}
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Candidates;
use App\Models\Questions;
use App\Models\Employees;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\View\View;
use Illuminate\Support\Facades\Log;
use App\Exports\SalaryCsvExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Models\Notifications;
use App\Models\Meetings;
use App\Models\MeetingRooms;
use App\Models\Buttons;
use App\Models\ObCandidates;
use App\Models\EmployeeAttendance;
use App\Models\EmployeeLeaveLogs;
use App\Models\CompanyData;
use App\Models\AttendanceLog;
use App\Models\StickyNotes;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Support\Str;
use App\Models\AttendanceRules;
use Validator;
use App\Models\Roles;
use Carbon\Carbon;
use Session;

class DashboardController extends Controller
{
    /**
     * Require authentication.
     */
    // public function __construct()
    // {
    //     $this->middleware('auth');
    // }

    public function dashboard()
    {
        $role = $this->loginUserRole();
        $loginUser = Auth::user();

        // Log::info('My >>>>', ['loginUser' => $loginUser]);

        $total_candidates = Candidates::count();

        // Log::info('My total_candidates >>>>', ['total_candidates' => $total_candidates]);

        $total_active_candidates = Candidates::whereIn('status', [2, 3, 4, 5, 7])->count();

        //  Log::info('My total_active_candidates >>>>', ['total_active_candidates' => $total_active_candidates]);
        $total_questions = Questions::where('status', '1')->count();

        //  Log::info('My total_questions >>>>', ['total_questions' => $total_questions]);
        $total_users = Employees::where('status', '1')->count();
        //   Log::info('My total_users >>>>', ['total_users' => $total_users]);

        return response()->json([
            'status' => 200,
            'data' => [
                'total_candidates' => $total_candidates,
                'total_active_candidates' => $total_active_candidates,
                'total_questions' => $total_questions,
                'total_users' => $total_users,
                'logged_in' => $loginUser
            ]
        ]);
    }


    private function loginUserRole()
    {
        return Auth::check() ? Auth::user()->user_role : '';
    }

    // public function attendanceWholeReportOLD(Request $request)
    // {
    //     $currentURL = url()->current();
    //     $urlsplit = explode('/', $currentURL);
    //     $findurl = end($urlsplit);

    //     $start = date('y-m-26');
    //     $begin = date('Y-m-d', strtotime($start . ' - 1 month'));
    //     $end   = date('y-m-25');

    //     $year = $request->year ?? date('Y');
    //     $month = $request->month ?? date('m');

    //     if (Auth::user()->id == 1) {
    //         $data = Employees::where('status', '1')->get();
    //     } else {
    //         if ($findurl == 'emp') {
    //             $data = Employees::where('status', '1')
    //                 ->where(function ($q) {
    //                     $q->where('manager_id', Auth::user()->id)
    //                     ->orWhere('id', Auth::user()->id);
    //                 })->get();
    //         } else {
    //             $data = Employees::where('status', '1')->get();
    //         }
    //     }

    //     // 🚀 Build same response as DataTables but in JSON
    //     $response = $data->map(function ($row) use ($year, $month) {
    //         $obCandidates = ObCandidates::where('office_employee_id', $row->id)->first();
    //         $dateOfJoining = ObCandidates::where('email', $row->email)->first();

    //         $from = date('Y-m-d', strtotime(date("{$year}-{$month}-26") . ' - 1 month'));
    //         $to   = date("{$year}-{$month}-25");

    //         $leave = EmployeeAttendance::where('employee_id', $row->id)->whereBetween('clock_date', [$from, $to])->where('status', 'L')->distinct('clock_date')->count();
    //         $absent = EmployeeAttendance::where('employee_id', $row->id)->whereBetween('clock_date', [$from, $to])->where('status', 'A')->distinct('clock_date')->count();
    //         $half_leave = EmployeeAttendance::where('employee_id', $row->id)->whereBetween('clock_date', [$from, $to])->where('status', 'HL')->distinct('clock_date')->count() / 2;
    //         $short_leave = EmployeeAttendance::where('employee_id', $row->id)->whereBetween('clock_date', [$from, $to])->where('status', 'SL')->distinct('clock_date')->count() / 4;

    //         $noOfDaysWorked = noofworkingdays() - ($leave + $absent + $half_leave + $short_leave);
    //         $appliedLeaves = $leave + $half_leave + $short_leave;
    //         $finalLeaveQuota = noofleaves() - ($leave + $half_leave + $short_leave);

    //         // Generate daily statuses (26 → 25)
    //         $daysData = [];
    //         for ($d = 26; $d <= 31; $d++) {
    //             $date = date('Y-m-d', strtotime(date("{$year}-{$month}-{$d}") . ' - 1 month'));
    //             $status = EmployeeAttendance::where('employee_id', $row->id)->where('clock_date', $date)->value('status');
    //             $daysData["date_{$d}"] = $status ?? '-';
    //         }
    //         for ($d = 1; $d <= 25; $d++) {
    //             $date = date("{$year}-{$month}-" . str_pad($d, 2, '0', STR_PAD_LEFT));
    //             $status = EmployeeAttendance::where('employee_id', $row->id)->where('clock_date', $date)->value('status');
    //             $daysData["date_{$d}"] = $status ?? '-';
    //         }

    //         return array_merge([
    //             'id' => $row->id,
    //             'name' => $row->name,
    //             'designation' => $obCandidates->job_title ?? '-',
    //             'date_of_joining' => $dateOfJoining->date_of_joining ?? '-',
    //             'total_working_days' => noofworkingdays(),
    //             'no_of_days_worked' => $noOfDaysWorked,
    //             'applied_leaves' => $appliedLeaves,
    //             'final_leave_quota' => $finalLeaveQuota,
    //         ], $daysData);
    //     });

    //     return response()->json([
    //         'success' => true,
    //         'data' => $response,
    //     ]);
    // }

    public function attendanceWholeReport(Request $request)
    {
        $year  = $request->year ?? date('Y');
        $month = $request->month ?? date('m');
        $search = $request->search ?? null;
        $perPage = $request->per_page ?? 10;
        $page    = $request->page ?? 1;

        $from = date('Y-m-d', strtotime("{$year}-{$month}-26 -1 month"));
        $to   = date("{$year}-{$month}-25");

        // ✅ Base query
        $query = Employees::where('status', 1);
        Log::info('my attendance query is ',['attendance'=> $query]);

        Log::info('my search before is ',['searchBF'=> $search]);

        // ✅ Search by name/email
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
            Log::info('my query after  is ',['query'=> $query]);
        }

        // ✅ Paginate employees
        $employees = $query->orderBy('id', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        $employeeIds = $employees->pluck('id');

        // ✅ Preload related data
        $obCandidates = ObCandidates::whereIn('office_employee_id', $employeeIds)->get()->keyBy('office_employee_id');
        $joiningData  = ObCandidates::whereIn('email', $employees->pluck('email'))->get()->keyBy('email');

        $attendanceRecords = EmployeeAttendance::whereBetween('clock_date', [$from, $to])
            ->whereIn('employee_id', $employeeIds)
            ->get()
            ->groupBy('employee_id');

        $attendanceSummary = EmployeeAttendance::selectRaw('employee_id, status, COUNT(DISTINCT clock_date) as total')
            ->whereBetween('clock_date', [$from, $to])
            ->whereIn('employee_id', $employeeIds)
            ->groupBy('employee_id', 'status')
            ->get()
            ->groupBy('employee_id');

        // ✅ Build response
        $responseData = $employees->map(function ($row) use ($year, $month, $attendanceRecords, $attendanceSummary, $obCandidates, $joiningData) {
            $obCandidate = $obCandidates[$row->id] ?? null;
            $joining     = $joiningData[$row->email] ?? null;

            $summary = $attendanceSummary[$row->id] ?? collect();
            $leave       = $summary->firstWhere('status', 'L')->total ?? 0;
            $absent      = $summary->firstWhere('status', 'A')->total ?? 0;
            $half_leave  = ($summary->firstWhere('status', 'HL')->total ?? 0) / 2;
            $short_leave = ($summary->firstWhere('status', 'SL')->total ?? 0) / 4;

            $noOfDaysWorked  = noofworkingdays() - ($leave + $absent + $half_leave + $short_leave);
            $appliedLeaves   = $leave + $half_leave + $short_leave;
            $finalLeaveQuota = noofleaves() - $appliedLeaves;

            $empAttendance = $attendanceRecords[$row->id] ?? collect();
            $empAttendanceMap = $empAttendance->keyBy('clock_date');

            $daysData = [];
            for ($d = 26; $d <= 31; $d++) {
                $date = date('Y-m-d', strtotime("{$year}-{$month}-{$d} -1 month"));
                $daysData["date_{$d}"] = $empAttendanceMap[$date]->status ?? '-';
            }
            for ($d = 1; $d <= 25; $d++) {
                $date = date("{$year}-{$month}-" . str_pad($d, 2, '0', STR_PAD_LEFT));
                $daysData["date_{$d}"] = $empAttendanceMap[$date]->status ?? '-';
            }

            return array_merge([
                'id'                => $row->id,
                'name'              => $row->name,
                'designation'       => $obCandidate->job_title ?? '-',
                'date_of_joining'   => $joining->date_of_joining ?? '-',
                'total_working_days' => noofworkingdays(),
                'no_of_days_worked' => $noOfDaysWorked,
                'applied_leaves'    => $appliedLeaves,
                'final_leave_quota' => $finalLeaveQuota,
            ], $daysData);
        });

        return response()->json([
            'success' => true,
            'data'    => $responseData,
            'meta'    => [
                'current_page' => $employees->currentPage(),
                'last_page'    => $employees->lastPage(),
                'per_page'     => $employees->perPage(),
                'total'        => $employees->total(),
            ]
        ]);
    }


    public function notifications(Request $request)
    {

        Notifications::where('is_seen', '0')->update([
            'is_seen' => '1'
        ]);

        $data = Notifications::where('notify_type', '!=', 3)
            ->whereDate('created_at', \Carbon\Carbon::today())
            ->latest()
            ->get();


        $formatted = $data->map(function ($row) {
            return [
                'id' => $row->id,
                'DT_not_icon' => asset("/dist/img/notifications.png"),
                'message' => [
                    'text' => $row->message,
                    'link' => $row->getLink($row),
                    'time' => date("h:ia", strtotime($row->created_at)),
                ],
                'DT_not_crossicon' => asset("/dist/img/cross.png"),
                'created_at' => $row->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formatted
        ]);
    }
}

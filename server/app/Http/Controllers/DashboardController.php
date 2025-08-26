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
use App\Models\Roles;
use Carbon\Carbon;
use Session;
use Illuminate\Support\Facades\Validator;

class DashboardController extends Controller
{
    /**
     * Require authentication.
     */
   
    public function dashboard()
    {
        $role = $this->loginUserRole();
        $loginUser = Auth::user();
        $total_candidates = Candidates::count();

        $total_active_candidates = Candidates::whereIn('status', [2, 3, 4, 5, 7])->count();
        $total_questions = Questions::where('status', '1')->count();
        $total_users = Employees::where('status', '1')->count();
       
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

  
    public function attendanceWholeReport(Request $request)
    {
        $year  = $request->year ?? date('Y');
        $month = $request->month ?? date('m');
        $search = $request->search ?? null;
        $perPage = $request->per_page ?? 10;
        $page    = $request->page ?? 1;

        $from = date('Y-m-d', strtotime("{$year}-{$month}-26 -1 month"));
        $to   = date("{$year}-{$month}-25");

      
        $query = Employees::where('status', 1);
        Log::info('my attendance query is ',['attendance'=> $query]);

        Log::info('my search before is ',['searchBF'=> $search]);

       
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
            Log::info('my query after  is ',['query'=> $query]);
        }

        
        $employees = $query->orderBy('id', 'asc')
            ->paginate($perPage, ['*'], 'page', $page);

        $employeeIds = $employees->pluck('id');

        
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

    public function editCompanyProfile(Request $request)
    {
        $company = CompanyData::where('id', 1)->first();

        if (!$company) {
            return response()->json([
                'status' => 404,
                'message' => 'Company profile not found'
            ], 404);
        }

        return response()->json([
            'status' => 200,
            'data' => $company
        ]);
    }

    

    public function editCompanyProfilePost(Request $request)
    {
        $company = CompanyData::where('id', 1)->first();

        if (!$company) {
            return response()->json([
                'status' => 404,
                'message' => 'Company profile not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'company_name' => 'regex:/^[a-zA-Z\s]+$/',
            'domain_name' => 'regex:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/|nullable',
            'facebook' => 'url|regex:/http(?:s):\/\/(?:www\.)facebook\.com\/.+/i|nullable',
            'instagram' => 'url|regex:/http(?:s):\/\/(?:www\.)instagram\.com\/.+/i|nullable',
            'linked_in' => 'url|regex:/http(?:s):\/\/(?:www\.)linkedin\.com\/.+/i|nullable',
            'twitter' => 'url|regex:/http(?:s):\/\/twitter\.com\/.+/i|nullable'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()->first()
            ]);
        }

        // update fields
        $company->company_name = $request->company_name;
        $company->brand_name = $request->brand_name;
        $company->website = $request->website;
        $company->domain_name = $request->domain_name;
        $company->linked_in = $request->linked_in;
        $company->facebook = $request->facebook;
        $company->twitter = $request->twitter;
        $company->description = $request->description;
        $company->registered_office_address = $request->registered_office_address;
        $company->corporate_office = $request->corporate_office;
        $company->phone_nos = $request->phone_nos;
        $company->emails = $request->emails;

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $path = public_path('dist/img/');
            $name = time() . '-' . $file->getClientOriginalName();

            if ($file->move($path, $name)) {
                if ($company->logo && file_exists($path . $company->logo)) {
                    unlink($path . $company->logo);
                }
                $company->logo = $name;
            }
        }

        if ($company->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Company Profile Updated",
                'data' => $company
            ]);
        }

        return response()->json([
            'status' => 401,
            'message' => 'Something Wrong. Try Again.'
        ]);
    }
}

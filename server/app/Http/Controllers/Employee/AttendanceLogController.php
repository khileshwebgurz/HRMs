<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use App\Models\ObCandidates;
use App\Models\AttendanceLog;
use App\Models\AttendanceRules;
use App\Models\EmployeeAttendance;
use App\Models\Notifications;
use Illuminate\Support\Facades\Log;

class AttendanceLogController extends Controller
{
    // public function __construct()
    // {
    //     $this->middleware('auth:api');
    // }

    public function getAddress($latitude, $longitude)
    {
        $response = Http::get("https://maps.google.com/maps/api/geocode/json", [
            'key' => config('services.google_maps.key'),
            'latlng' => "$latitude,$longitude"
        ]);

        $json = $response->json();
        return $json['results'][0]['formatted_address'] ?? '';
    }

    public function getAttendanceLog()
    {
        $loginuser = Auth::user();
        $currentDate = Carbon::now()->toDateString();

        $logs = AttendanceLog::where('employee_id', $loginuser->id)
            ->where('clock_date', $currentDate)
            ->orderBy('id', 'ASC')
            ->get();

        $timeIn = $logs->where('type', 1)->first();
        $timeOut = $logs->where('type', 2)->last();

        return [
            'date' => $currentDate,
            'emp_time_in' => optional($timeIn)->clock_time ? $currentDate . 'T' . $timeIn->clock_time : '',
            'emp_time_out' => optional($timeOut)->clock_time && $timeOut->type == 2 ? $currentDate . 'T' . $timeOut->clock_time : '',
            'last_punch_in' => optional($logs->where('type', 1)->last())->clock_time ? $currentDate . 'T' . $logs->where('type', 1)->last()->clock_time : '',
            'last_punch_out' => optional($logs->where('type', 2)->last())->clock_time ? $currentDate . 'T' . $logs->where('type', 2)->last()->clock_time : '',
            'late_by' => '',
            'work_duration' => '',
            'excess_hours' => '',
            'excess_break_duration' => '',
            'early_out_by' => '',
            'breaks' => [],
            'break_count' => 0,
            'status' => '-',
            'prev_punch_count' => $logs->count(),
        ];
    }

    public function clockIn(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::now()->toDateString();
        $now = Carbon::now()->format('H:i:s');


        Log::info('today', ['my today' => $today]);
        Log::info('now', ['my now' => $now]);
        $existingLog = AttendanceLog::where('employee_id', $user->id)
            // ->where('clock_date', $today)
            ->latest('id')
            ->first();

        Log::info('existingLog', ['my existingLog' => $existingLog]);
        $candidate = ObCandidates::where('office_employee_id', $user->id)->first();
        $rule = AttendanceRules::find($candidate->attendance_rule_id ?? null);

        $shiftIn = Carbon::createFromFormat('H:i:s', $rule->shift_in_time ?? '00:00:00');
        $shiftOut = Carbon::createFromFormat('H:i:s', $rule->shift_out_time ?? '23:59:59');
        $current = Carbon::createFromFormat('H:i:s', $now);

        $late = $current->greaterThan($shiftIn);
        $afterShift = $current->greaterThan($shiftOut);
        $alreadyLoggedIn = 'yes';

        if (!$existingLog || ($existingLog && $existingLog->type == 2)) {
            $log = new AttendanceLog([
                'employee_id' => $user->id,
                'clock_date' => $today,
                'clock_time' => $now,
                'type' => 1,
                'ip_address' => $request->ip(),
                'latitude' => $request->latitude,
                'longitude' => $request->longitude
            ]);
            $log->save();
            $alreadyLoggedIn = 'no';

            EmployeeAttendance::firstOrCreate([
                'employee_id' => $user->id,
                'clock_date' => $today
            ], [
                'clock_in' => $now
            ]);
        }

        $attendance = $this->getAttendanceLog();
        $attendance['alreadyLoggedIn'] = $alreadyLoggedIn;
        $attendance['late_time'] = $late ? 'delay' : 'ontime';
        $attendance['after_shift_clockin'] = $afterShift ? 'yesclockin' : 'notclockin';

        return response()->json($attendance);
    }

    public function clockOut(Request $request)
    {
        $user = Auth::user();
        $today = Carbon::now()->toDateString();

        $lastLog = AttendanceLog::where('employee_id', $user->id)
            ->where('clock_date', $today)
            ->latest('id')
            ->first();

        if ($lastLog && $lastLog->type == 1) {
            AttendanceLog::create([
                'employee_id' => $user->id,
                'clock_date' => $today,
                'clock_time' => Carbon::now()->format('H:i:s'),
                'type' => 2,
                'ip_address' => $request->ip(),
                'latitude' => $request->latitude,
                'longitude' => $request->longitude
            ]);
        }

        return response()->json($this->getAttendanceLog());
    }

    public function updateLocation(Request $request)
    {
        $log = AttendanceLog::find($request->uu);
        if (!$log) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $log->latitude = $request->clock_in_lat ?? $request->clock_out_lat;
        $log->longitude = $request->clock_in_long ?? $request->clock_out_long;
        $log->address = $this->getAddress($log->latitude, $log->longitude);
        $log->save();

        return response()->json(['response' => 'Location Updated']);
    }

    public function getApproval(Request $request)
    {
        $user = Auth::user();
        $attendance = EmployeeAttendance::find($request->get_approval_id);

        if (!$attendance) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $attendance->emp_apply = 1;
        $attendance->apply_reason = $request->notes;
        $attendance->save();

        Notifications::create([
            'type_id' => 'attendacne_approval_request',
            'message' => "Regularisation request from {$user->name} for date " . Carbon::parse($attendance->clock_date)->format('M d, Y'),
            'page_id' => $attendance->id,
            'notify_to' => $user->manager_id
        ]);

        return response()->json(['message' => 'Request sent to your manager.']);
    }

    public function getApprovalManager(Request $request)
    {
        $user = Auth::user();
        $attendance = EmployeeAttendance::find($request->get_approval_id_manager);

        if (!$attendance) {
            return response()->json(['message' => 'Not Found'], 404);
        }

        $attendance->approve_status = $request->approve_status;
        $attendance->approve_leave = $request->approve_status == 1 ? $request->approve_leave : null;
        $attendance->save();

        $status = $request->approve_status == 1 ? 'Approved' : 'Declined';

        Notifications::create([
            'type_id' => 'attendacne_approval_request',
            'message' => "{$status} regularisation request for " . Carbon::parse($attendance->clock_date)->format('M d, Y'),
            'page_id' => $attendance->id,
            'notify_to' => $attendance->employee_id
        ]);

        return response()->json(['message' => 'Successfully updated.']);
    }
}

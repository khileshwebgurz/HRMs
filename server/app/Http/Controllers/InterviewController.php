<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Candidates;
use App\Models\Employees;
use App\Models\CandidateInterviews;
use App\Models\CandidateInterviewRounds;
use App\Models\ObCandidates;
use App\Models\Roles;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Spatie\GoogleCalendar\Event;


use Illuminate\Support\Facades\Log;

class InterviewController extends Controller
{
    public function allInterviews(Request $request)
    {
        $user = Auth::user();
        $permission_role = Roles::find($user->user_role);



        $limit = $request->input('limit', 10); // default 10
        $search = $request->input('search', '');

        $query = CandidateInterviews::with('candidate');

        if ($permission_role) {
            switch ($permission_role->view) {
                case '2':
                    $query->where('created_by', $user->id);
                    break;
                case '3':
                    $employees = Employees::where('manager_id', $user->id)->pluck('id');
                    $query->whereIn('created_by', $employees);
                    break;
                case '4':
                    $employees = Employees::where('manager_id', $user->id)->orWhere('id', $user->id)->pluck('id');
                    $query->whereIn('created_by', $employees);
                    break;
                case '5':
                default:
                    // full access
                    break;
            }
        }

        Log::info('My status >>>>', ['status code' => $request->status]);

        // Search filter
        if (!empty($search)) {
            $query->whereHas('candidate', function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('mobile_number', 'like', "%{$search}%");
            });
        }

        if (!empty($request->status)) {
            $query->where("interview_status", $request->status);
        }


        // ✅ Date filter (based on created_at)
        if ($request->has('datefilter') && !empty($request->datefilter)) {
            $dates = explode(' - ', $request->datefilter);
            if (count($dates) === 2) {
                $startDate = \Carbon\Carbon::parse($dates[0])->startOfDay();
                $endDate   = \Carbon\Carbon::parse($dates[1])->endOfDay();
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }
        }
        // Paginate
        $paginated = $query->latest()->paginate($limit);



        $result = $paginated->getCollection()->map(function ($item) {
            $round = CandidateInterviewRounds::where('interview_id', $item->id)->latest()->first();

            return [
                'id' => $item->id,
                'candidate_name' => $item->candidate->full_name ?? '',
                'candidate_email' => $item->candidate->email ?? '',
                'candidate_phone' => $item->candidate->mobile_number ?? '',
                'interview_time' => $round ? date("d M,Y H:i A", strtotime($round->interview_time)) : null,
                'interview_status' => CandidateInterviews::$interviewStatus[$item->interview_status] ?? '',
            ];
        });

        return response()->json([
            'data' => $result,
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'total' => $paginated->total(),
            'per_page' => $paginated->perPage(),
        ]);
    }

    public function viewInterview($interview_id)
    {
        $interview = CandidateInterviews::with('rounds')->find($interview_id);

        if (!$interview) {
            return response()->json(['message' => 'Interview not found'], 404);
        }

        $candidate = Candidates::find($interview->candidate_id);
        $employees = Employees::orderBy('name')->get();
        $ob_candidates = ObCandidates::where('is_interviewer', '1')->get();

        return response()->json([
            'interview' => $interview,
            'candidate' => $candidate,
            'employees' => $employees,
            'ob_candidates' => $ob_candidates
        ]);
    }

    public function rescheduleInterview($id)
    {
        $round = CandidateInterviewRounds::find($id);

        if (!$round) {
            return response()->json(['message' => 'Round not found'], 404);
        }

        $round->hr_resecdule_status = '1';
        $round->save();

        $interview = CandidateInterviews::find($round->interview_id);

        $status = match ($round->round) {
            '1' => 3,
            '2' => 4,
            '3' => 5,
            '4' => 6,
            default => 3,
        };

        $interview->interview_status = $status;
        $interview->save();

        $candidate = Candidates::find($interview->candidate_id);
        $candidate->status = $status;
        $candidate->save();

        $startDateTime = Carbon::parse($round->employee_suggested_date);
        $endDateTime = $startDateTime->copy()->addHour();
        $location = 'C-205, 4th Floor, SM Heights, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160071';

        // Candidate Calendar Invite
        $event1 = new Event();
        $event1->name = 'Interview reschedule for Round ' . $round->round;
        $event1->startDateTime = $startDateTime;
        $event1->endDateTime = $endDateTime;
        $event1->location = $location;
        $event1->addAttendee(['email' => $interview->candidate->email]);
        $event1->save(null, ['sendUpdates' => 'all', 'sendNotifications' => true]);

        // Employee Calendar Invite
        $event2 = new Event();
        $event2->name = 'Interview reschedule';
        $event2->startDateTime = $startDateTime;
        $event2->endDateTime = $endDateTime;
        $event2->location = $location;
        $event2->addAttendee(['email' => $round->employee->email]);
        $event2->save(null, ['sendUpdates' => 'all', 'sendNotifications' => true]);

        return response()->json(['message' => 'Interview rescheduled and calendar invites sent.']);
    }

    public function scheduleInterviewOLD(Request $request)
    {
        Log::info('finlly inside the function.');
        $validator = Validator::make($request->all(), [
            'round' => 'required',
            'employee_id' => 'required|exists:employees,id',
            'interview_id' => 'required|exists:candidate_interviews,id',
            'interview_time' => 'required|date_format:Y-m-d H:i|after:' . now(),
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $interview = CandidateInterviews::find($request->interview_id);
        Log::info('my interview id is ', ['interview id' => $request->interview_id]);

        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $filename = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('uploads/cv/'), $filename);
            $interview->cv_file = $filename;
            $interview->save();
        }

        $employee = Employees::find($request->employee_id);

        $round = new CandidateInterviewRounds();
        $round->round = $request->round;
        $round->interview_time = $request->interview_time;
        $round->interview_id = $interview->id;
        $round->employee_id = $employee->id;
        $round->employee_name = $employee->name;
        $round->save();

        $status = match ($round->round) {
            '1' => 3,
            '2' => 4,
            '3' => 5,
            '4' => 6,
            default => 3,
        };

        $interview->interview_status = $status;
        $interview->save();

        $candidate = Candidates::find($interview->candidate_id);
        $candidate->status = $status;
        $candidate->save();

        $startDateTime = Carbon::parse($request->interview_time);
        $endDateTime = $startDateTime->copy()->addHour();
        $location = 'C-205, 4th Floor, SM Heights, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160071';

        // Candidate Calendar Invite
        $event1 = new Event();
        $event1->name = 'Interview schedule for Round ' . $round->round;
        $event1->startDateTime = $startDateTime;
        $event1->endDateTime = $endDateTime;
        $event1->description = $request->message_candidate ?? '';
        $event1->location = $location;
        $event1->addAttendee(['email' => $candidate->email]);
        $event1->save(null, ['sendUpdates' => 'all', 'sendNotifications' => true]);

        // Employee Calendar Invite
        $event2 = new Event();
        $event2->name = 'Interview schedule';
        $event2->startDateTime = $startDateTime;
        $event2->endDateTime = $endDateTime;
        $event2->location = $location;
        $event2->addAttendee(['email' => $employee->email]);
        $event2->save(null, ['sendUpdates' => 'all', 'sendNotifications' => true]);

        return response()->json(['message' => 'Interview scheduled and calendar invites sent.']);
    }


    public function scheduleInterview(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'round' => 'required',
            'employee_id' => 'required|exists:employees,id',
            'interview_id' => 'required|exists:candidate_interviews,id',
            'interview_time' => 'required|date_format:Y-m-d H:i|after:' . now(),
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()->first()], 422);
        }

        $interview = CandidateInterviews::find($request->interview_id);

        if ($request->hasFile('cv')) {
            $file = $request->file('cv');
            $filename = time() . '-' . $file->getClientOriginalName();
            $file->move(public_path('uploads/cv/'), $filename);
            $interview->cv_file = $filename;
            $interview->save();
        }

        $employee = Employees::find($request->employee_id);

        // Save round in DB
        $round = new CandidateInterviewRounds();
        $round->round = $request->round;
        $round->interview_time = $request->interview_time;
        $round->interview_id = $interview->id;
        $round->employee_id = $employee->id;
        $round->employee_name = $employee->name;
        $round->save();

        // Update statuses
        $status = match ($round->round) {
            '1' => 3,
            '2' => 4,
            '3' => 5,
            '4' => 6,
            default => 3,
        };

        $interview->interview_status = $status;
        $interview->save();

        $candidate = Candidates::find($interview->candidate_id);
        $candidate->status = $status;
        $candidate->save();

        // Prepare Calendar Invite Link
        $startDateTime = Carbon::parse($request->interview_time);
        $endDateTime = $startDateTime->copy()->addHour();

        $title = "Interview Round {$request->round} - " . $candidate->full_name;
        $details = $request->message_candidate ?? "Interview scheduled.";
        $location = "C-205, 4th Floor, SM Heights, Sector 74, Sahibzada Ajit Singh Nagar, Punjab 160071";

        // Format datetime for Google Calendar (YYYYMMDDTHHMMSS)
        $start = $startDateTime->format('Ymd\THis');
        $end   = $endDateTime->format('Ymd\THis');

        $calendarUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE" .
            "&text=" . urlencode($title) .
            "&details=" . urlencode($details) .
            "&location=" . urlencode($location) .
            "&dates={$start}/{$end}";

        return response()->json([
            'message' => 'Interview scheduled successfully!',
            'calendar_link' => $calendarUrl,
            'candidate_email' => $candidate->email,
            'employee_email' => $employee->email
        ]);
    }
}

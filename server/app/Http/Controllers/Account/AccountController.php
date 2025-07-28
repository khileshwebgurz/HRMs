<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Employees;
use App\Models\ObCandidates;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Rules\MatchOldPassword;
use App\Models\EmployeeAttendance;
use App\Models\AttendanceRules;
use App\Models\AttendanceLog;
use App\Models\Settings;
use App\Models\Questions;
use App\Models\ReadinessAnswer;
use App\Models\Notifications;
use App\Models\SalarySlip;
use App\Models\SalarySlipsDetail;
use App\Models\Salary_Slip_Request;
use Illuminate\Support\Facades\Mail;
use Yajra\DataTables\Facades\DataTables;
use Illuminate\Database\Eloquent\Model; 
use App\Models\Employee;
use App\Mail\ReadinessResultMail;



class AccountController extends Controller
{

    public function calender()
    {
        $employeeIds = Employees::where('status', '1')->pluck('id')->toArray();
        $employees = ObCandidates::whereIn('office_employee_id', $employeeIds)->get();

        $events = [];

        foreach ($employees as $employee) {
            $year = date('Y');
            $birthday = date("$year-m-d", strtotime($employee->dob));
            $anniversary = date("$year-m-d", strtotime($employee->date_of_joining));

            $events[] = [
                'title' => 'Birthday',
                'description' => "{$employee->name}'s Birthday",
                'start' => $birthday,
                'end' => $birthday,
                'backgroundColor' => '#c981e0',
                'borderColor' => '#c981e0',
                'icon' => 'fa-birthday-cake',
            ];

            $events[] = [
                'title' => 'Work Anniversary',
                'description' => "{$employee->name}'s Work Anniversary",
                'start' => $anniversary,
                'end' => $anniversary,
                'backgroundColor' => '#f012be',
                'borderColor' => '#f012be',
                'icon' => 'fa-glass-cheers',
            ];
        }

        return response()->json($events);
    }


    // for changing the password of user
    public function editProfile(Request $request)
    {

        $loginuser = Auth::user();
        $user_id = $loginuser->id;
        $candidate = ObCandidates::where('office_employee_id', $user_id)->first();
        $user = Employees::where('id', $candidate->office_employee_id)->first();
        $validator = Validator::make($request->all(), [
            'current_password' => ['required', new MatchOldPassword],
            'password' => 'required|min:6|confirmed'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 401,
                'message' => $validator->errors()
                    ->first()
            ]);
        }
        $user->password = bcrypt($request->password);

        if ($user->save()) {
            return response()->json([
                'status' => 200,
                'message' => "Password updated"
            ]);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Something Wrong. Try Again.'
            ]);
        }
    }


    public function monthlyAttendance(Request $request)
    {
        $loginuser = Auth::user();

        $user_id = $request->emp_id ?? $loginuser->id;

        $shift_type = $loginuser->shift_type;

        $shiftTime = $shift_type == 1
            ? explode("-", get_options('day_shift_timing'))
            : explode("-", get_options('night_shift_timing'));


        $shift_start = $shiftTime[0];
        $shift_end = $shiftTime[1];

        $data = EmployeeAttendance::where('employee_id', $user_id);


        if (!empty($request->startdate) && !empty($request->enddate)) {
            $data = $data->whereBetween('clock_date', [
                $request->startdate,
                $request->enddate
            ]);
        }

        $records = $data->get();
        // Log::info('This is records', ['records' => $records]);
        $transformed = $records->map(function ($row) {
            $today = date('Y-m-d');

            $user_id = $row->employee_id;

            $clock_in = $row->clock_in . ($row->late_reason ? "<br><span style='color:red;'>{$row->late_reason}</span>" : '');
            $after_shift_reason = "<span style='color:red;'>{$row->after_shift_clockin_reason}</span>";


            // Work Duration
            $work_duration = '-';
            if ($row->clock_date != $today && !empty($row->work_duration)) {

                $wd = explode(":", $row->work_duration);
                $work_duration = "{$wd[0]} Hours {$wd[1]} Mins";
            }

            // Break Duration
            $break_duration = $row->break_duration ?: "0 Hours 0 Mins";

            // Overtime
            $overtime = '-';
            if ($row->clock_date != $today && $row->overtime != '00:00') {

                // $od = explode(":", $row->overtime);
                // $overtime = "{$od[0]} Hours {$od[1]} Mins";
            }

            return [
                'id' => $row->id,
                'clock_date' => $row->clock_date,
                'status' => $row->clock_date == $today ? '-' : $row->status,
                'clock_in' => $clock_in,
                'after_shift_clockin_reason' => $after_shift_reason,
                'work_duration' => $work_duration,
                'break_duration' => $break_duration,
                // 'overtime' => $overtime,
                'action' => ($row->late_reason || $row->after_shift_clockin_reason) ? true : false,
            ];
        });

        return response()->json($transformed);
    }


    public function getCompanyPolicy()
    {
        $loginuser = Auth::user();

        if ($loginuser?->readiness_status) {
            return response()->json(['redirect' => 'dashboard'], 200);
        }

        $policies = [
            'hr' => Settings::where('key', 'Hr_Policy_content')->value('value'),
            'leave' => Settings::where('key', 'Leave_Policy_content')->value('value'),
            'travel' => Settings::where('key', 'Travel_Policy_content')->value('value'),
        ];

        return response()->json(['policies' => $policies], 200);
    }


    public function getReadinessQuiz()
    {
        $loginuser = Auth::user();
        Log::info('ytestt', ['testt' => $loginuser]);
        if ($loginuser->readiness_status) {
            return response()->json(['redirect' => 'dashboard'], 200);
        }

        if (empty($loginuser->readiness_quiz)) {
            $quizQuery = Questions::select('id')
                ->where('question_type', 2)
                ->where('status', 1)
                ->get();

            $totalAvailable = $quizQuery->count();
            $limit = min($totalAvailable, get_options('readiness_quiz_limit'));

            if ($limit == 0) {
                return response()->json(['message' => 'No readiness quiz questions available.'], 404);
            }

            $quiz = $quizQuery->random($limit);
            $readiness_quiz = array_column($quiz->toArray(), 'id');
            $loginuser->readiness_quiz = json_encode($readiness_quiz);
            $loginuser->save();
        }


        $quiz = Questions::select('id', 'question', 'answer')
            ->with(['options' => function ($q) {
                $q->select('id', 'question_id', 'option_name');
            }])
            ->where('question_type', 2)
            ->where('status', 1)
            ->whereIn('id', json_decode($loginuser->readiness_quiz))
            ->get();

        return response()->json([
            'quiz' => $quiz,
            'done' => count((array) json_decode($loginuser->readiness_answer)),
        ]);
    }

    public function saveReadinessQuizResult(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized'
            ], 401);
        }

        $submittedAnswers = (array) $request->quiz;

        if (empty($submittedAnswers)) {
            return response()->json([
                'status' => 400,
                'message' => 'No answers submitted'
            ], 400);
        }

        Log::info('SUBMITTED ANSWERS:', ['user_id' => $user->id, 'answers' => $submittedAnswers]);

        $questionIds = json_decode($user->readiness_quiz, true);
        if (empty($questionIds)) {
            return response()->json([
                'status' => 400,
                'message' => 'No quiz questions loaded'
            ], 400);
        }

        try {
            $correctAnswers = Questions::whereIn('id', $questionIds)
                ->pluck('answer', 'id')
                ->toArray();
            Log::info('CORRECT ANSWERS:', $correctAnswers);
        } catch (\Exception $e) {
            Log::error('Failed to fetch correct answers: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Failed to load correct answers'
            ], 500);
        }

        $score = 0;
        $answerDetails = [];

        foreach ($submittedAnswers as $qId => $submittedAns) {
            $questionId = (int) str_replace('q', '', $qId);

            if (!isset($correctAnswers[$questionId])) {
                Log::warning("Question {$questionId} not found in correct answers!");
                continue;
            }

            $isCorrect = (string)$correctAnswers[$questionId] === (string)$submittedAns;
            $answerDetails[] = [
                'question_id' => $questionId,
                'submitted' => $submittedAns,
                'correct' => $correctAnswers[$questionId],
                'is_correct' => $isCorrect
            ];

            if ($isCorrect) {
                $score++;
            }
        }

        $totalQuestions = count($questionIds);
        $percentage = $totalQuestions > 0 ? round(($score / $totalQuestions) * 100, 2) : 0;

        Log::info('SCORE CALCULATION:', [
            'user_id' => $user->id,
            'total_questions' => $totalQuestions,
            'correct' => $score,
            'percentage' => $percentage,
            'details' => $answerDetails
        ]);

        if ($request->finalsave == 1) {
            try {
                DB::table('employees')
                    ->where('id', $user->id)
                    ->update([
                        'readiness_answer' => json_encode($submittedAnswers),
                        'readiness_score' => $percentage,
                        'readiness_status' => $percentage >= 90 ? 1 : 0,
                        'readiness_date' => now(),
                    ]);

                ReadinessAnswer::create([
                    'employee_id' => $user->id,
                    'questions' => json_encode($questionIds),
                    'correct_answers' => json_encode($correctAnswers),
                    'candidate_answers' => json_encode($submittedAnswers),
                    'score' => $score,
                ]);

                Log::info('QUIZ RESULTS SAVED', [
                    'user_id' => $user->id,
                    'score' => $percentage,
                    'status' => $percentage >= 90 ? 'passed' : 'failed'
                ]);


                  Notifications::create([
                        'notify_type' => 'info',
                        'type_id' => 'readiness_complete',
                        'page_id' => $user->id,
                        'notify_to' => 1, // Admin or Manager user ID - change as needed
                        'message' => $user->name . ' has completed the readiness quiz.',
                        'notify_status' => 1,
                    ]);

                    Log::info('Notification created for readiness quiz completion.');
                    
                // Send Email
                Mail::to($user->email)->send(new ReadinessResultMail(
                    $user->name,
                    $percentage,
                    'You have completed the readiness quiz.'
                ));

                Log::info('Readiness quiz email sent to ' . $user->email);

            } catch (\Exception $e) {
                Log::error('Failed to save results or send mail: ' . $e->getMessage());
                return response()->json([
                    'status' => 500,
                    'message' => 'Failed to save results or send mail'
                ], 500);
            }
        }

        return response()->json([
            'status' => 200,
            'score' => $percentage,
            'passed' => $percentage >= 90,
            'message' => $request->finalsave ? 'Quiz submitted successfully!' : 'Progress saved.',
        ]);
    }

    
    public function saveReadinessQuizResult280725(Request $request)
    {
        // Get authenticated user
        $user = Auth::user();
        
        if (!$user) {
            return response()->json([
                'status' => 401,
                'message' => 'Unauthorized'
            ], 401);
        }

        // Validate input
        $submittedAnswers = (array) $request->quiz;
        if (empty($submittedAnswers)) {
            return response()->json([
                'status' => 400,
                'message' => 'No answers submitted'
            ], 400);
        }

        // Debug logging
        Log::info('SUBMITTED ANSWERS:', ['user_id' => $user->id, 'answers' => $submittedAnswers]);

        // Get question IDs from user's readiness_quiz
        $questionIds = json_decode($user->readiness_quiz, true);
        if (empty($questionIds)) {
            return response()->json([
                'status' => 400,
                'message' => 'No quiz questions loaded'
            ], 400);
        }

        // Get correct answers
        try {
            $correctAnswers = Questions::whereIn('id', $questionIds)
                ->pluck('answer', 'id')
                ->toArray();
                
            Log::info('CORRECT ANSWERS:', $correctAnswers);
        } catch (\Exception $e) {
            Log::error('Failed to fetch correct answers: ' . $e->getMessage());
            return response()->json([
                'status' => 500,
                'message' => 'Failed to load correct answers'
            ], 500);
        }

        // Calculate score
        $score = 0;
        $answerDetails = [];

        foreach ($submittedAnswers as $qId => $submittedAns) {
            $questionId = (int) str_replace('q', '', $qId);
            
            if (!isset($correctAnswers[$questionId])) {
                Log::warning("Question {$questionId} not found in correct answers!");
                continue;
            }

            $isCorrect = (string)$correctAnswers[$questionId] === (string)$submittedAns;
            $answerDetails[] = [
                'question_id' => $questionId,
                'submitted' => $submittedAns,
                'correct' => $correctAnswers[$questionId],
                'is_correct' => $isCorrect
            ];

            if ($isCorrect) $score++;
        }

        // Calculate percentage
        $totalQuestions = count($questionIds);
        $percentage = $totalQuestions > 0 ? round(($score / $totalQuestions) * 100, 2) : 0;

        Log::info('SCORE CALCULATION:', [
            'user_id' => $user->id,
            'total_questions' => $totalQuestions,
            'correct' => $score,
            'percentage' => $percentage,
            'details' => $answerDetails
        ]);

        // Save results
        if ($request->finalsave == 1) {
            try {
                // Update user record
                DB::table('employees')
                    ->where('id', $user->id)
                    ->update([
                        'readiness_answer' => json_encode($submittedAnswers),
                        'readiness_score' => $percentage,
                        'readiness_status' => $percentage >= 90 ? 1 : 0,
                        'readiness_date' => now(),
                    ]);

                // Create readiness answer record
                ReadinessAnswer::create([
                    'employee_id' => $user->id,
                    'questions' => json_encode($questionIds),
                    'correct_answers' => json_encode($correctAnswers),
                    'candidate_answers' => json_encode($submittedAnswers),
                    'score' => $score,
                ]);

                Log::info('QUIZ RESULTS SAVED', [
                    'user_id' => $user->id,
                    'score' => $percentage,
                    'status' => $percentage >= 90 ? 'passed' : 'failed'
                ]);

            } catch (\Exception $e) {
                Log::error('Failed to save results: ' . $e->getMessage());
                return response()->json([
                    'status' => 500,
                    'message' => 'Failed to save results'
                ], 500);
            }
        }

        return response()->json([
            'status' => 200,
            'score' => $percentage,
            'passed' => $percentage >= 90,
            'message' => $request->finalsave ? 'Quiz submitted successfully!' : 'Progress saved.',
        ]);
    }

    public function salaryslip(Request $request)
    {
        $loginuser = Auth::user();

        $data = Salary_Slip_Request::where("employee_id", $loginuser->id)->latest()->get();

        $result = [];

        foreach ($data as $row) {
            $status_type = $row->status;
            $status_text = $status_type == '0'
                ? 'Pending'
                : 'Approved';

            // Fetch months for this slip_relation
            $slips = SalarySlip::where('relation_id', $row->slip_relation)->get();

            $month_list = [];

            foreach ($slips as $slip) {
                $month_name = match ($slip->month) {
                    '01' => 'January',
                    '02' => 'February',
                    '03' => 'March',
                    '04' => 'April',
                    '05' => 'May',
                    '06' => 'June',
                    '07' => 'July',
                    '08' => 'August',
                    '09' => 'September',
                    '10' => 'October',
                    '11' => 'November',
                    '12' => 'December',
                    default => 'Unknown'
                };

                $month_list[] = [
                    'name' => $month_name,
                    'download_link' => $status_type == '1'
                        ? route('salarypdf', $slip->id)
                        : null
                ];
            }

            $result[] = [
                'id' => $row->id,
                'status' => $status_text,
                'months' => $month_list,
                'created_at' => $row->created_at->toDateTimeString(),
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }



    public function insertSalarySlip(Request $request)
    {
        try {
            $collection = $request->input('months'); // should be an array

            if (!is_array($collection)) {
                return response()->json(['error' => 'Invalid months format. Expecting array.'], 422);
            }

            $from = date('Y-m-d', strtotime(date('Y-m') . ' -12 month')) . ' 00:00:00';
            $to = date('Y-m-d') . ' 23:59:59';

            $check2 = SalarySlip::where('emp_id', Auth::id())
                ->whereIn('month', $collection)
                ->whereBetween('created_at', [$from, $to])
                ->get();

            if (!$check2->isEmpty()) {
                $months = $check2->map(function ($value) {
                    return date('F', strtotime(date('Y-' . $value->month)));
                })->implode(', ');

                return response()->json([
                    'error' => "You have already applied for salary slip for the following months: $months"
                ], 409);
            }

            $parent_id = 0;

            foreach ($collection as $key => $salary_month) {
                $salary_data = new SalarySlip();
                $salary_data->month = $salary_month;
                if ($key > 0) {
                    $salary_data->relation_id = $parent_id;
                }
                $salary_data->emp_id = Auth::id();
                $salary_data->date = now()->format('Y-m-d');
                $salary_data->save();

                if ($key == 0) {
                    $parent_id = $salary_data->id;
                    $salary_data->relation_id = $parent_id;
                    $salary_data->save();
                }
            }

            $salary_request_data = new Salary_Slip_Request();
            $salary_request_data->employee_id = Auth::id();
            $salary_request_data->date = now()->format('Y-m-d');
            $salary_request_data->slip_relation = $parent_id;
            $salary_request_data->save();

            // Notifications
            $HR_users = Employees::where([
                ['user_role', '1'],
                ['role_id', '1'],
                ['is_manager', '1'],
                ['status', '1'],
            ])->get();

            $noti = new Notifications();
            $noti->type_id = 'salary_slip';
            $noti->message = Auth::user()->name . ' has requested a Salary Slip';
            $noti->page_id = $salary_request_data->id;
            $noti->notify_type = '2';
            $noti->notify_from = Auth::id();
            $noti->save();

            foreach ($HR_users as $hr) {
                if ($hr->id != 1) {
                    $data = [
                        'name' => $hr->name,
                        'msg' => Auth::user()->name . ' has requested a Salary Slip',
                    ];

                    Mail::send('emails.email_salaryslip', $data, function ($message) use ($hr) {
                        $message->to($hr->email, $hr->name)->subject('Salary Slip');
                    });
                }
            }

            return response()->json(['message' => 'Applied for Salary Slip successfully.'], 200);
        } catch (\Throwable $e) {
            return response()->json(['error' => 'Server Error', 'details' => $e->getMessage()], 500);
        }
    }
}

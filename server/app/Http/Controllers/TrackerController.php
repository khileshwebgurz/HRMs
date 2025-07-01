<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Candidates;
use App\Models\Roles;
use App\Models\Employees;
use Illuminate\Support\Facades\Log;

class TrackerController extends Controller
{
    // GET all candidates (filtered by permission)
    public function allCandidates(Request $request)
    {
        $user = Auth::user();
        $permissionRole = Roles::find($user->user_role);
        $query = Candidates::query();

        switch ($permissionRole->view) {
            case '2':
                $query->where('created_by', $user->id);
                break;
            case '3':
                $empIds = Employees::where('manager_id', $user->id)->pluck('id');
                $query->whereIn('created_by', $empIds);
                break;
            case '4':
                $empIds = Employees::where('manager_id', $user->id)->pluck('id')->push($user->id);
                $query->whereIn('created_by', $empIds);
                break;
            case '5':
                // unrestricted
                break;
            default:
                return response()->json(['message' => 'Unauthorized'], 403);
        }

        $data = $query->with(['candidate_status', 'educations', 'employments'])->get()->map(function ($c) use ($user, $permissionRole) {
            return [
                'id' => 'HRM' . $c->id,
                'full_name' => $c->full_name,
                'linked_in' => $c->linked_in ?: '-',
                'status' => $c->candidate_status->status_name ?? '',
                'education' => $c->educations->first()->professional_qualification ?? '',
                'current_employer' => $c->employments->first()->company_name ?? '',
                'created_at' => optional($c->created_at)?->format('d M, Y'),
                'date_of_interview' => optional($c->date_of_interview)?->format('d M, Y'),
                'email' => $c->email,
                'mobile_number' => $c->mobile_number,
                'notice_period' => $c->notice_period,
                'current_location' => $c->current_location,
                'action' => [
                    'view_url' => "/profile/view/{$c->profile_id}",
                    'edit_allowed' => $permissionRole->edit == '5' || $c->created_by == $user->id,
                    'edit_url' => "/edit/{$c->id}",
                    'delete_allowed' => $permissionRole->delete == '5' || $c->created_by == $user->id,
                    'delete_url' => "/delete/{$c->id}",
                    'send_email_url' => "/send-email/{$c->id}"
                ]
            ];
        });

        return response()->json(['data' => $data]);
    }

    // POST /check
    public function checkCandidate(Request $request)
    {
        if ($request->has('email')) {
            $validator = Validator::make($request->all(), [
                'email' => 'regex:/(.+)@(.+)\.(.+)/i|unique:candidates,email'
            ]);
            if ($validator->fails()) {
                return response()->json(['status' => 401, 'message' => 'Email is invalid or already taken']);
            }
        }

        if ($request->has('mobile_number')) {
            $validator = Validator::make($request->all(), [
                'mobile_number' => 'digits:10|unique:candidates,mobile_number'
            ]);
            if ($validator->fails()) {
                return response()->json(['status' => 401, 'message' => 'Mobile number is invalid or already taken']);
            }
        }

        return response()->json(['status' => 200, 'message' => 'Valid']);
    }

    // POST /add
    public function addCandidatePost(Request $request)
    {
        $user = Auth::user();
        $role = Roles::find($user->user_role);

        $createdBy = $role->add == '2' ? $user->id : ($request->created_by ?? null);
        if (!$createdBy) {
            return response()->json(['status' => 401, 'message' => 'Please assign to someone']);
        }

        $validator = Validator::make($request->all(), [
            'full_name' => 'required|regex:/^[a-zA-Z\s]+$/',
            'email' => 'required|email|unique:candidates,email',
            'mobile_number' => 'required|digits:10|unique:candidates,mobile_number',
            'linked_in' => 'nullable|regex:/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        $candidate = new Candidates();
        $candidate->user_id = $user->id;
        $candidate->full_name = $request->full_name;
        $candidate->email = $request->email;
        $candidate->mobile_number = $request->mobile_number;
        $candidate->notice_period = $request->notice_period;
        $candidate->linked_in = $request->linked_in;
        $candidate->current_location = $request->current_location;
        $candidate->gender = $request->gender;
        $candidate->profile_id = Str::random(16);
        $candidate->profile_token = Str::random(32);
        $candidate->position = $request->position;
        $candidate->remarks = $request->remarks;
        $candidate->date_of_interview = $request->date_of_interview;
        $candidate->created_by = $createdBy;
        $candidate->status = 1;

        if ($request->hasFile('upload_cv')) {
            $name = time() . '-' . $request->file('upload_cv')->getClientOriginalName();
            $request->file('upload_cv')->move(public_path('uploads/cv/'), $name);
            $candidate->cv_file = $name;
        }

        $candidate->save();

        if ($request->input('submit') === 'send_mail') {
            $this->sendEmailCandidateProfile($candidate->id);
        }

        return response()->json(['status' => 200, 'message' => 'Candidate added']);
    }

    // PUT /edit/{candidate_id}
    public function editCandidatePost(Request $request, $candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);

        $validator = Validator::make($request->all(), [
            'position' => 'required',
            'department' => 'required',
            'full_name' => 'required',
            'email' => "required|email|regex:/(.+)@(.+)\.(.+)/i|unique:candidates,email,$candidate_id",
            'gender' => 'required',
            'status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 401, 'message' => $validator->errors()->first()]);
        }

        $candidate->fill($request->only([
            'full_name', 'email', 'gender', 'mobile_number', 'position', 'marital_status',
            'residence_address', 'passport_number', 'nationality', 'dob', 'age',
            'place_of_birth', 'hobbies', 'current_salary', 'expected_salary', 'remarks',
            'status', 'date_of_interview', 'interview_score', 'interviewed_by',
            'sourcing', 'department'
        ]));

        $candidate->save();

        // You can also trigger updating skills, education, employments, etc., from here if needed.

        return response()->json(['status' => 200, 'message' => 'Candidate updated']);
    }

    // DELETE /delete/{candidate_id}
    public function deleteCandidate($candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);
        $candidate->delete();

        return response()->json(['status' => 200, 'message' => 'Candidate deleted']);
    }

    // GET /send-email/{candidate_id}
    public function sendEmailCandidateProfile($candidate_id)
    {
        $candidate = Candidates::findOrFail($candidate_id);
        $candidate->profile_token = Str::random(32);
        $candidate->profile_token_date = now()->addHours(48);
        $candidate->save();

        $to_email = $candidate->email;
        $to_name = $candidate->full_name;

        $data = [
            'url' => route('candidateProfile', $candidate->profile_token),
            'candidate_view_url' => route('candidateProfileView', $candidate->profile_id),
            'name' => $to_name,
        ];

        Mail::send('emails.candidate-profile', $data, function ($msg) use ($to_email, $to_name) {
            $msg->to($to_email, $to_name)->subject('Thank you for applying the job.');
        });

        return response()->json(['status' => 200, 'message' => 'Email sent']);
    }

    // GET /mail-to-hr
    public function mailToHr(Request $request)
    {
        $loginuser = Auth::user();
        $date = now()->format('Y-m-d');

        $candidates = Candidates::where('link_status', '0')
            ->whereDate('profile_token_date', $date)
            ->get();

        $data = ['candidates' => $candidates];
        Mail::send('emails.hr-mail', $data, function ($msg) use ($loginuser) {
            $msg->to($loginuser->email, $loginuser->name)->subject('Candidates not updated the profile');
        });

        return response()->json(['status' => 200, 'message' => 'Email sent to HR']);
    }
}

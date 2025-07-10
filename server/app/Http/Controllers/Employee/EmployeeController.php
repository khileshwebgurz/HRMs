<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\Employees;
use Illuminate\Http\Request;
use App\Models\CompanyData;
use App\Models\Settings;
use App\Models\User;
use App\Models\ObCandidates;
use App\Models\Candidates;
use Illuminate\Support\Facades\Log; 
use App\Models\CandidateQuestions;


class EmployeeController extends Controller
{
    public function directory()
    {
        // You can filter by role if needed, or return all
        $employees = Employees::all();

        return response()->json($employees);
    }

    
    public function CompanyProfileView(Request $request)
    {
        $company = CompanyData::find(1);
        $hr_content = Settings::where('key', 'Hr_Policy_content')->value('value');
        $leave_content = Settings::where('key', 'Leave_Policy_content')->value('value');
        $travel_content = Settings::where('key', 'Travel_Policy_content')->value('value');

        return response()->json([
            'company' => $company,
            'hr_policy' => $hr_content,
            'leave_policy' => $leave_content,
            'travel_policy' => $travel_content,
        ]);
    }


    public function empProfile(Request $request, $tab)
    {
        $loginuser = $request->user();
        $user_id = $loginuser->id;
        $user_roles = User::$role;
        $genders = User::$gender;

        $user = Employees::where('id', $tab)->first();

        $candidate = ObCandidates::where('office_employee_id', $user->id)->first();
        if (!$candidate) {
            return response()->json(['error' => 'Candidate not found'], 404);
        }

        $candidate_id = $candidate->candidate_id;
        $candidateData = Candidates::where('id', $candidate_id)->first();
        $progress = getEmployeeProgress($candidate->id);

        $candidate_questions = CandidateQuestions::all();

        return response()->json([
            'tab' => $tab,
            'employee_id' => $user_id,
            'user' => $user,
            'user_roles' => $user_roles,
            'genders' => $genders,
            'progress' => $progress,
            'candidate' => $candidate,
            'candidateData' => $candidateData,
            'candidate_questions' => $candidate_questions,
            'candidate_id' => $candidate_id,
        ]);
    }


}
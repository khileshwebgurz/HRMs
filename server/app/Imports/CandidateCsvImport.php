<?php
namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Models\Candidates;
use App\Models\User;
use App\Models\CandidateAssessments;
use App\Models\CandidateAssessmentSections;
use App\Models\CandidateEducations;
use App\Models\CandidateEmployments;
use App\Models\CandidateFamilies;
use App\CandidateLanguages;
use App\CandidateOtherInformations;
use App\CandidateQuestions;
use App\CandidateSkills;
use App\CandidateStatus;
use App\CandidateTest;
use App\CandidateTestOptions;
use DataTables;
// use Validator;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UserCsvExport;
use App\Exports\CandidateCsvExport;
use Illuminate\Support\Facades\Mail;
use App\Questions;
use App\Notifications;
use Exception;

class CandidateCsvImport implements ToModel, WithHeadingRow
{

    private $total_rows = 0;

    private $success = 0;

    private $fail = 0;

    private $csvData = array();

    /**
     *
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        ++ $this->total_rows; /* Total rows increment */

        $validator = Validator::make($row, [
            'position_title' => 'required',
            'applicant_name' => 'required',
            // 'applicant_phone' => 'unique:candidates,mobile_number|required',
            // 'applicant_email' => 'unique:candidates,email|required',
            'applicant_phone' => 'unique:candidates,mobile_number|required|digits:10',
            'applicant_email' => 'unique:candidates,email|required|regex:/(.+)@(.+)\.(.+)/i',
            'gender' => 'required',
            'current_salary' => 'max:30',
            'expected_salary' => 'max:30'
        ]);

        // $this->csvData[] = $row;

        if (! $validator->fails()) {

            // $role = loginUserRole();
            // $loginuser = Auth::user();
            try {
                $data = $row;
                $gender = strtolower($data['gender']);
                switch ($gender) {
                    case "m":
                        $gender = 1;
                        break;
                    case "male":
                        $gender = 1;
                        break;
                    case "f":
                        $gender = 2;
                        break;
                    case "female":
                        $gender = 2;
                        break;
                    default:
                        $gender = 1;
                }

                $candidate = new Candidates();
                $candidate->full_name = $data['applicant_name'];
                $candidate->mobile_number = $data['applicant_phone'];
                $candidate->email = $data['applicant_email'];
                $candidate->gender = $gender;
                $candidate->position = $data['position_title'];
                $candidate->age = (! empty($data['age'])) ? $data['age'] : Null;
                $candidate->total_relevant_experience = $data['rel_experience_in_yrs'];
                $candidate->total_experience = $data['total_exp_till_date'];
                $candidate->sourcing = $data['sourcing'];
                $candidate->date_of_interview = (! empty($data['date_of_interview'])) ? date('Y-m-d H:i:s', strtotime($data['date_of_interview'])) : Null;
                $candidate->current_salary = $data['current_salary'];
                $candidate->expected_salary = $data['expected_salary'];
                $candidate->profile_id = Str::random(16);
                $candidate->user_id = 1;

                $candidate->remarks = $data['notes'];
                if ($data['date_applied']) {
                    // $candidate->created_at = (! empty($data['date_applied'])) ? date('Y-m-d H:i:s', strtotime($data['date_applied'])) : Null;
                }
                $candidate->interviewed_by = $data['interviewed'];
                $candidate->interview_score = $data['interview_score'];

                $candidate->department = (isset(Candidates::$departments_ids[ucwords($data['department'])])) ? Candidates::$departments_ids[ucwords($data['department'])] : 9;

                $candidate->status = 1;
                $candidate->save();

                // $this->csvData[] = $candidate;

                // $candidate->experience_required = $data['experience_required'];
                // $candidate->status = $data['status'];
                // $candidate->applicant_resume = $data['applicant_resume'];
                // $candidate->total_tenture_till_date = $data['total_tenture_till_date'];

                // Add Candidate Education
                $c_edu = new CandidateEducations();
                $c_edu->candidate_id = $candidate->id;
                $c_edu->institute_name = 'Unnamed';
                $c_edu->professional_qualification = $data['education'];
                $c_edu->save();

                $c_emp = new CandidateEmployments();
                $c_emp->candidate_id = $candidate->id;
                $c_emp->company_name = $data['current_employer'];
                $c_emp->position = $data['current_position'];
                $c_emp->save();

                ++ $this->success; /* Success rows increment */
                return $candidate;
            } // catch exception
            catch (Exception $e) {
                ++ $this->fail; /* Fail rows increment */
                // $this->csvData[] = 'Message: ' . $e->getMessage();
                // \Log::info('Error: ' . $e->getMessage() . "\n Data: " . json_encode($row));
            }
        } else {
            // \Log::info('Validate: ' . $validator->errors()->first() . "\n Data: " . json_encode($row));
            // $this->csvData[] = $validator->errors()->first();
            ++ $this->fail; /* Fail rows increment */
        }
    }

    public function getCSVData(): array
    {
        return $this->csvData;
    }

    public function getTotalRowCount(): int
    {
        return $this->total_rows;
    }

    public function getTotalSuccessCount(): int
    {
        return $this->success;
    }

    public function getRowFailCount(): int
    {
        return $this->fail;
    }
}

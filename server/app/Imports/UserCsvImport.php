<?php
namespace App\Imports;

use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Candidates;
use App\Models\User;
use App\CandidateAssessments;
use App\CandidateAssessmentSections;
use App\CandidateEducations;
use App\CandidateEmployments;
use App\CandidateFamilies;
use App\CandidateLanguages;
use App\CandidateOtherInformations;
use App\CandidateQuestions;
use App\CandidateSkills;
use App\CandidateStatus;
use App\CandidateTest;
use App\CandidateTestOptions;
use App\Models\Roles;
use DataTables;
// use Validator;
use Illuminate\Support\Facades\Validator;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\UserCsvExport;
use App\Exports\CandidateCsvExport;
use Illuminate\Support\Facades\Mail;
use App\Questions;
use App\Notifications;
use Illuminate\Support\Facades\Hash;

class UserCsvImport implements ToModel, WithHeadingRow
{

    private $rows = 0;

    private $fail = 0;

    private $success = 0;

    /**
     *
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        ++ $this->rows; /* Success rows increment */
        
        // print_r($row);exit;
        $validator = Validator::make($row, [
            'name' => 'required',
            'email' => 'unique:users,email|required',
            'password' => 'min:6|required',
            'user_role' => 'required'
        ]);

        if (! $validator->fails()) {

            ++ $this->success; /* Success rows increment */
            // if (! empty($row["name"]) || ! empty($row["email"]) || ! empty($row["gender"]) || ! empty($row["phone"]) || ! empty($row["user_role"])) {

            $role=Roles::where('role_name',$row["user_role"])->first();
            if($role)
            {
                $user_role= $role->id;
            }
            else{
                 $user_role= "1";
            }
            return new User([
                'name' => $row["name"],
                'email' => $row["email"],
                'password' => Hash::make($row['password']),
                // 'gender' => $row["gender"],
                'phone' => $row["phone"],
                'user_role' => $user_role,
                'profile_id' => Str::random(16)
            ]);
            // $this->rows++;
            // }
        } else {
            // \Log::info('User Validate: ' . $validator->errors()->first() . "\n Data: " . json_encode($row));
            // $this->csvData[] = $validator->errors()->first();
            ++ $this->fail; /* Fail rows increment */
        }
    }

    public function getRowCount()
    {
        return $this->rows;
    }

    public function getRowFailCount()
    {
        return $this->fail;
    }

    public function getTotalSuccessCount()
    {
        return $this->success;
    }
}

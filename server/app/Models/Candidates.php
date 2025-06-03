<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Candidates extends Model
{ 

    static $idproofs = [
        1 => 'Adhaar',
        2 => 'Passport',
        3 => 'Driving License',
        4 => 'Income Tax PAN Card'
    ];
    
    static $marital = [
        1 => 'Single',
        2 => 'Married'
    ];

    static $gender = [
        1 => 'Male',
        2 => 'Female'
    ];

    static $relationship = [
        1 => 'Father',
        2 => 'Mother',
        3 => 'Husband',
        4 => 'Wife',
        5 => 'Son',
        6 => 'Daughter',
        7 => 'Brother',
        8 => 'Sister'
    ];

    static $departments = [
        1 => 'Digital Marketing',
        2 => 'Business Development',
        3 => 'Mobile Development',
        4 => 'Web Designing',
        5 => 'HR',
        6 => 'Admin',
        7 => 'Quality',
        8 => 'Web Development',
        9 => 'Other'
    ];

    static $departmentsShort = [
        1 => 'DM',
        2 => 'BD',
        3 => 'MD',
        4 => 'WD',
        5 => 'HR',
        6 => 'Other',
        7 => 'QA',
        8 => 'WD',
        9 => 'Other'
    ];

    static $departments_ids = [
        'Digital Marketing' => 1,
        'Business Development' => 2,
        'Mobile Development' => 3,
        'Web Designing' => 4,
        'HR' => 5,
        'Admin' => 6,
        'Quality' => 7,
        'Web Development' => 8,
        'Other' => 9
    ];

    protected $fillable = [
        'full_name',
        'mobile_number',
        'email',
        'gender',
        'position',
        'marital_status',
        'passport_number',
        'nationality',
        'dob',
        'age',
        'place_of_birth',
        'hobbies',
        'current_salary',
        'expected_salary',
        'remarks',
        'profile_id',
        'status'
    ];

    public function candidate_status()
    {
        return $this->hasOne('App\Models\CandidateStatus', 'id', 'status');
    }

    public function getGenderNameAttribute($value)
    {
        return static::$gender[$value];
    }

    public function assessments()
    {
        return $this->hasMany('App\Models\CandidateAssessments', 'candidate_id');
    }

    public function assessment_section()
    {
        return $this->hasMany('App\Models\CandidateAssessmentSections', 'candidate_id');
    }

    public function educations()
    {
        return $this->hasMany('App\Models\CandidateEducations', 'candidate_id');
    }

    public function employments()
    {
        return $this->hasMany('App\Models\CandidateEmployments', 'candidate_id');
    }

    public function families()
    {
        return $this->hasMany('App\Models\CandidateFamilies', 'candidate_id');
    }

    public function languages()
    {
        return $this->hasMany('App\Models\CandidateLanguages', 'candidate_id');
    }

    public function other_informations()
    {
        return $this->hasMany('App\Models\CandidateOtherInformations', 'candidate_id');
    }

    public function skills_section()
    {
        return $this->hasMany('App\Models\CandidateSkills', 'candidate_id');
    }
}

<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateAssessments extends Model
{

    protected $fillable = [
        'candidate_id',
        'interviewer',
        'interviewer_name',
        'education',
        'experince',
        'attitude',
        'stability',
        'technical_skills',
        'appearance_personality',
        'skills'
    ];
}

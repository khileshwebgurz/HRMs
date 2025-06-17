<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateInterviews extends Model
{

    static $interviewStatus = [
        3 => 'Round 1',
        4 => 'Round 2',
        5 => 'Round 3',
        6 => 'Final',
        7 => 'Offered',
        8 => 'Rejected'
    ];

    static $interviewRounds = [
        1 => 'Round 1 (Aptitude)',
        2 => 'Round 2 (Theoretical)',
        3 => 'Round 3 (Practical)',
        4 => 'Round 4 (HR Final)'
    ];

    static $interviewAvg = [
        1 => 'Below Average',
        2 => 'Average',
        3 => 'Above Average'
    ];

    static $interviewRoundsStatus = [
        1 => 'Pending',
        2 => 'Yes',
        3 => 'No'
    ];

    static $interviewStatusRel = [
        1 => 3,
        2 => 4,
        3 => 5,
        4 => 6,
        4 => 7,
        4 => 8
    ];

    public function candidate()
    {
        return $this->hasOne('App\Models\Candidates', 'id', 'candidate_id');
    }

    public function rounds()
    {
        return $this->hasMany('App\Models\CandidateInterviewRounds', 'interview_id')->orderBy('id', 'desc');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateInterviewRounds extends Model
{
    public function interview()
    {
        return $this->hasOne('App\Models\CandidateInterviews', 'id', 'interview_id');
    }
    
    
    public function employee()
    {
        return $this->hasOne('App\Models\Employees', 'id', 'employee_id');
    }
    
    
    
}

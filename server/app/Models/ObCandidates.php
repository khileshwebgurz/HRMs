<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObCandidates extends Model
{
    public function candidate()
    {
        return $this->hasOne('App\Candidates', 'id', 'candidate_id');
    }
     public function attendanceRule()
    {
        return $this->hasOne('App\AttendanceRules', 'id', 'attendance_rule_id');
    }
      public function employees()
    {
        return $this->hasOne('App\Employees', 'office_employee_id', 'id');
    }
    
}

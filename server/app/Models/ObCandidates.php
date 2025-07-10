<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ObCandidates extends Model
{
    protected $fillable = ['name', 'email', 'office_employee_id', 'created_by'];

    public function candidate()
    {
        return $this->hasOne('App\Models\Candidates', 'id', 'candidate_id');
    }

    public function attendanceRule()
    {
        return $this->hasOne('App\Models\AttendanceRules', 'id', 'attendance_rule_id');
    }

    public function employees()
    {
        return $this->hasOne('App\Models\Employees', 'office_employee_id', 'id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeLeaveRules extends Model
{
    protected $table = 'employee_leave_rules';

  public function LeaveRules()
    {
        return $this->hasOne('App\Models\LeaveRules', 'leave_rule_id', 'id');
    }
}
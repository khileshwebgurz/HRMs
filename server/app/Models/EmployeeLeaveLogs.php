<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeLeaveLogs extends Model
{
    protected $table = 'employee_leave_logs';

    public function employee()
    {
        return $this->hasOne('App\Employees', 'id', 'employee_id');
    }
    
    
    public function getLeaveTypes()
    {
        $lt = array();
        $lt[1] = 'Loss of Pay';
        $lt[2] = 'Emergency Leave';
        $lt[3] = 'Sick Leave';
        
        return $lt;
    }
}


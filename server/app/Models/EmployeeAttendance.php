<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmployeeAttendance extends Model
{

    protected $table = 'employee_attendance';

    public function employee()
    {
        return $this->hasOne('App\Models\Employees', 'id', 'employee_id');
    }

       public function obCandidates()
    {
        return $this->hasOne('App\Models\ObCandidates', 'office_employee_id', 'employee_id');
    }

    
}

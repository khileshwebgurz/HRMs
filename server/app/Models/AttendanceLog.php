<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttendanceLog extends Model
{
    //
     public function employee()
    {
        return $this->hasOne('App\Models\Employees', 'id', 'employee_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ReadinessAnswer extends Model
{
    protected $fillable = [
        'employee_id',
        'questions',
        'correct_answers',
        'candidate_answers',
        'score',
        'readiness_status', 
    ];
}

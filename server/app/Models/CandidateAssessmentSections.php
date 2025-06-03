<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateAssessmentSections extends Model
{
    protected $fillable = [
        'candidate_id',
        'accessment_type',
        'accessment_by',
        'weight_age',
        'score'
    ];
}

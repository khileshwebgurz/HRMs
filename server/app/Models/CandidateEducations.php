<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateEducations extends Model
{
    protected $fillable = [
        'candidate_id',
        'institute_name',
        'from',
        'to',
        'professional_qualification'
    ];
}

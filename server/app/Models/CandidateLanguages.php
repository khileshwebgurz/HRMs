<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateLanguages extends Model
{
    protected $fillable = [
        'candidate_id',
        'language_id',
        'speak',
        'write',
        'understand'
    ];
}

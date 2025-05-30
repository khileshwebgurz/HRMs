<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CandidateQuestions extends Model
{
    use HasFactory;

    protected $table = 'candidate_questions';

    protected $fillable = [
        'candidate_id',
        'question_text',
        'answer_text',
        // Add more fields
    ];

    // Example relationship
    public function candidate()
    {
        return $this->belongsTo(Candidates::class, 'candidate_id');
    }
}
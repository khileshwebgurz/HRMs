<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CandidateTestOptions extends Model
{

    protected $fillable = [
    'candidate_test_id',
    'question_id',
    'correct_answer'
];
    public function question()
    {
        return $this->hasOne('App\Models\Questions', 'id', 'question_id');
    }

    public function options()
    {
        return $this->hasMany('App\Models\QuestionOptions', 'question_id', 'question_id');
    }
}

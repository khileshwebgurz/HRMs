<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Questions extends Model
{
	static $question_type = [
			1 => 'Aptitude Test',
			2 => 'Readiness Test',
			3 => 'Exit Test'
		];
	

    public function options()
    {
        return $this->hasMany('App\Models\QuestionOptions', 'question_id');
    }
}

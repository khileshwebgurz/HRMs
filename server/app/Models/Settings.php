<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Settings extends Model
{
    protected $table = 'settings';

    protected $fillable = [
        'key', 'value',
    ];

    public $timestamps = false; // if you don't use created_at and updated_at
}
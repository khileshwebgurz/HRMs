<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ticketreply extends Model
{
    protected $table = 'ticket_reply';
    protected $primaryKey = "id";
    protected $fillable = ['id','employee_id','ticket_id','reply_message'];

}

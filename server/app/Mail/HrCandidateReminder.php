<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class HrCandidateReminder extends Mailable
{
    use Queueable, SerializesModels;

    public $candidates;

    public function __construct($candidates)
    {
        $this->candidates = $candidates;
    }

    public function build()
    {
        return $this->subject('Candidates not updated the profile')
                    ->markdown('emails.hr-mail');
    }
}

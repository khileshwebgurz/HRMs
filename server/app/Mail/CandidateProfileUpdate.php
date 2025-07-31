<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class CandidateProfileUpdate extends Mailable
{
    use SerializesModels;

    public $data;

    // Constructor to pass the data
    public function __construct($data)
    {
        $this->data = $data;
    }

    // Build the message
    public function build()
    {
        return $this->subject('Thank you for applying for the job.')
                    ->view('emails.candidate-profile');
    }
}

<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestInviteMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */

        public function __construct(public $candidate, public $token) 
        {
            
        }

        public function build()
        {
            return $this->subject('HRM Aptitude Quiz')
                        ->markdown('emails.test-invite')
                        ->with([
                            'name'     => $this->candidate->full_name,
                            'test_url' => route('showTest', $this->token),
                        ]);
        }
}

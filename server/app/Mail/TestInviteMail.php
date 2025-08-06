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

    public $candidate;
    public $token;
    public $otp;

    /**
     * Create a new message instance.
     *
     * @param  $candidate
     * @param  $token
     * @param  $otp
     * @return void
     */
    public function __construct($candidate, $token, $otp) 
    {
        $this->candidate = $candidate;
        $this->token = $token;
        $this->otp = $otp; 
    }

    public function build()
    {
        return $this->subject('HRM Aptitude Quiz')
                    ->markdown('emails.test-invite')
                    ->with([
                        'name'     => $this->candidate->full_name,
                        'test_url' => route('showTest', $this->token),
                        'otp'      => $this->otp, 
                    ]);
    }
}

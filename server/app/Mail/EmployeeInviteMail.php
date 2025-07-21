<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class EmployeeInviteMail extends Mailable
{
    use Queueable, SerializesModels;

    public $name;
    public $acceptLink;
    public $declineLink;

    public function __construct($name, $token)
    {
        $this->name = $name;
        $this->acceptLink = route('setPasswordEmployee', ['accept', $token]);
        $this->declineLink = route('setPasswordEmployee', ['declined', $token]);
    }

    public function build()
    {
        return $this->subject('Welcome to HRM')
                    ->view('emails.employee-invite')
                    ->with([
                        'name' => $this->name,
                        'invite_link_accept' => $this->acceptLink,
                        'invite_link_declined' => $this->declineLink,
                    ]);
    }
}

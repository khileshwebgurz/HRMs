<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PasswordResetMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $email;
    public string $resetUrl;

    public function __construct(string $email, string $resetUrl)
    {
        $this->email = $email;
        $this->resetUrl = $resetUrl;
    }

    public function build()
    {
        return $this->subject('Reset Your Password')
            ->view('emails.forgot-password')
            ->with([
                'resetUrl' => $this->resetUrl,
                'email' => $this->email,
            ]);
    }
}

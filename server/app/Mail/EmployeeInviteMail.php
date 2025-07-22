<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
// use Illuminate\Contracts\Queue\ShouldQueue; // Uncomment + implement for queued mail

class EmployeeInviteMail extends Mailable /* implements ShouldQueue */
{
    use Queueable, SerializesModels;

    public string $name;
    public string $acceptUrl;
    public string $declineUrl;

    /**
     * @param  string  $name
     * @param  string  $acceptUrl   Full frontend link (React) e.g. https://.../set-password/accept/{token}
     * @param  string  $declineUrl  Full frontend link (React) e.g. https://.../set-password/declined/{token}
     */
    public function __construct(string $name, string $acceptUrl, string $declineUrl)
    {
        $this->name       = $name;
        $this->acceptUrl  = $acceptUrl;
        $this->declineUrl = $declineUrl;
    }

    public function build()
    {
        return $this->subject('Welcome to HRM')
            ->view('emails.employee-invite')
            ->with([
                'name'                 => $this->name,
                'invite_link_accept'   => $this->acceptUrl,
                'invite_link_declined' => $this->declineUrl,
            ]);
    }
}

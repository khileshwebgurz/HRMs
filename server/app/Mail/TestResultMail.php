<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TestResultMail extends Mailable
{
    use Queueable, SerializesModels;

    public $candidate;
    public $message;
    public $status;

    /**
     * Create a new message instance.
     */
    public function __construct($candidate, $message, $status)
    {
        $this->candidate = $candidate;
        $this->message = $message;
        $this->status = $status;
    }

    public function build()
    {
        return $this->view('emails.send-test-result')
                ->subject('Your Test Results')
                ->with([
                    'name' => $this->candidate->full_name,
                    'msg' => $this->message,
                    'status' => $this->status
                ]);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Test Result Mail',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.send-test-result',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
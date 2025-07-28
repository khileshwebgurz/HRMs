<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReadinessResultMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $name;
    public float $score;
    public string $msg;

    public function __construct(string $name, float $score, string $msg)
    {
        $this->name = $name;
        $this->score = $score;
        $this->msg = $msg;
    }

    public function build()
    {
        return $this->subject('Your Readiness Quiz Result')
            ->view('emails.send-readiness-result')
            ->with([
                'name' => $this->name,
                'total_score' => $this->score,
                'msg' => $this->msg,
            ]);
    }
}

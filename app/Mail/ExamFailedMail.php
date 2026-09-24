<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExamFailedMail extends Mailable
{
    use Queueable;
    use SerializesModels;


    public string $applicantName;


    public function __construct(
        string $applicantName
    ) {
        $this->applicantName =
            $applicantName;
    }


    public function envelope(): Envelope
    {
        return new Envelope(
            subject:
                'USeP School of Law Examination Result'
        );
    }


    public function content(): Content
    {
        return new Content(
            view:
                'emails.exam-failed'
        );
    }


    public function attachments(): array
    {
        return [];
    }
}
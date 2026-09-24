<?php

namespace App\Mail;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExamPassedMail extends Mailable
{
    use Queueable;
    use SerializesModels;


    public string $applicantName;

    public string $interviewDate;

    public string $interviewTime;

    public string $venue;

    public ?string $instructions;


    public function __construct(
        string $applicantName,
        string $interviewDate,
        string $interviewTime,
        string $venue,
        ?string $instructions = null
    ) {
        $this->applicantName =
            $applicantName;

        $this->interviewDate =
            Carbon::parse(
                $interviewDate
            )->format(
                'F j, Y'
            );

        $this->interviewTime =
            Carbon::parse(
                $interviewTime
            )->format(
                'g:i A'
            );

        $this->venue =
            $venue;

        $this->instructions =
            $instructions;
    }


    public function envelope(): Envelope
    {
        return new Envelope(
            subject:
                'USeP School of Law Examination Result - Passed'
        );
    }


    public function content(): Content
    {
        return new Content(
            view:
                'emails.exam-passed'
        );
    }


    public function attachments(): array
    {
        return [];
    }
}
<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InterviewFailedMail extends Mailable
{
    use Queueable, SerializesModels;

    /*
    |--------------------------------------------------------------------------
    | Interviewee
    |--------------------------------------------------------------------------
    |
    | This contains the applicant information passed from
    | IntervieweeController.
    |
    */

    public $interviewee;


    /*
    |--------------------------------------------------------------------------
    | Constructor
    |--------------------------------------------------------------------------
    */

    public function __construct(
        $interviewee
    ) {
        $this->interviewee =
            $interviewee;
    }


    /*
    |--------------------------------------------------------------------------
    | Email Envelope
    |--------------------------------------------------------------------------
    */

    public function envelope(): Envelope
    {
        return new Envelope(
            subject:
                'USeP School of Law - Admission Interview Result'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Email Content
    |--------------------------------------------------------------------------
    */

    public function content(): Content
    {
        return new Content(
            view:
                'emails.interview-failed'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Attachments
    |--------------------------------------------------------------------------
    */

    public function attachments(): array
    {
        return [];
    }
}

<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class EmailVerificationOtpNotification extends Notification
{
    use Queueable;

    public function __construct(public readonly string $code) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your USeP School of Law verification code')
            ->greeting('Hello '.$notifiable->name.',')
            ->line('Use the following one-time code to verify your email address:')
            ->line('**'.$this->code.'**')
            ->line('This code expires in 10 minutes and can be used only once.')
            ->line('If you did not create this account, you may ignore this email.');
    }
}

<?php

namespace App\Listeners;

use App\Models\User;
use App\Services\EmailOtpService;
use Illuminate\Auth\Events\Registered;

class SendEmailVerificationOtp
{
    public function __construct(private readonly EmailOtpService $otpService) {}

    public function handle(Registered $event): void
    {
        if ($event->user instanceof User) {
            $this->otpService->send($event->user);
        }
    }
}

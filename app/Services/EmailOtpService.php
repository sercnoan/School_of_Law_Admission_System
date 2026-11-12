<?php

namespace App\Services;

use App\Models\EmailVerificationOtp;
use App\Models\User;
use App\Notifications\EmailVerificationOtpNotification;
use Illuminate\Support\Facades\Hash;

class EmailOtpService
{
    public const EXPIRY_MINUTES = 10;

    public const RESEND_COOLDOWN_SECONDS = 60;

    public const MAX_ATTEMPTS = 5;

    public function send(User $user): void
    {
        if ($user->email_verified_at !== null) {
            return;
        }

        $code = (string) random_int(100000, 999999);

        EmailVerificationOtp::updateOrCreate(
            ['user_id' => $user->id],
            [
                'code_hash' => Hash::make($code),
                'attempts' => 0,
                'expires_at' => now()->addMinutes(self::EXPIRY_MINUTES),
                'last_sent_at' => now(),
            ]
        );

        $user->notify(new EmailVerificationOtpNotification($code));
    }
}

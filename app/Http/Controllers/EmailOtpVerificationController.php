<?php

namespace App\Http\Controllers;

use App\Models\EmailVerificationOtp;
use App\Services\EmailOtpService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class EmailOtpVerificationController extends Controller
{
    public function show(Request $request)
    {
        if ($request->user()->email_verified_at !== null) {
            return redirect()->route('dashboard');
        }

        $otp = EmailVerificationOtp::where('user_id', $request->user()->id)->first();

        return Inertia::render('auth/verify-otp', [
            'email' => $this->maskEmail($request->user()->email),
            'status' => $request->session()->get('status'),
            'retryAfter' => $otp
                ? max(0, $otp->last_sent_at->addSeconds(EmailOtpService::RESEND_COOLDOWN_SECONDS)->timestamp - now()->timestamp)
                : 0,
        ]);
    }

    public function verify(Request $request)
    {
        $validated = $request->validate([
            'otp' => ['required', 'digits:6'],
        ], [
            'otp.digits' => 'Enter the six-digit code from your email.',
        ]);

        $result = DB::transaction(function () use ($request, $validated) {
            $otp = EmailVerificationOtp::where('user_id', $request->user()->id)
                ->lockForUpdate()
                ->first();

            if (! $otp) {
                return ['error' => 'No verification code was found. Request a new code.'];
            }

            if ($otp->expires_at->isPast()) {
                return ['error' => 'This verification code has expired. Request a new code.'];
            }

            if ($otp->attempts >= EmailOtpService::MAX_ATTEMPTS) {
                return ['error' => 'Too many incorrect attempts. Request a new code.'];
            }

            if (! Hash::check($validated['otp'], $otp->code_hash)) {
                $attempts = $otp->attempts + 1;
                $otp->update(['attempts' => $attempts]);
                $remaining = EmailOtpService::MAX_ATTEMPTS - $attempts;

                return [
                    'error' => $remaining > 0
                        ? "Incorrect code. {$remaining} attempts remaining."
                        : 'Too many incorrect attempts. Request a new code.',
                ];
            }

            $request->user()->forceFill(['email_verified_at' => now()])->save();
            $otp->delete();

            return ['verified' => true];
        });

        if (isset($result['error'])) {
            throw ValidationException::withMessages(['otp' => $result['error']]);
        }

        return redirect()->route('dashboard')->with('success', 'Email verified successfully.');
    }

    public function resend(Request $request, EmailOtpService $otpService)
    {
        if ($request->user()->email_verified_at !== null) {
            return redirect()->route('dashboard');
        }

        $otp = EmailVerificationOtp::where('user_id', $request->user()->id)->first();

        if ($otp && $otp->last_sent_at->addSeconds(EmailOtpService::RESEND_COOLDOWN_SECONDS)->isFuture()) {
            $seconds = $otp->last_sent_at
                ->addSeconds(EmailOtpService::RESEND_COOLDOWN_SECONDS)
                ->timestamp - now()->timestamp;

            throw ValidationException::withMessages([
                'resend' => "Please wait {$seconds} seconds before requesting another code.",
            ]);
        }

        $otpService->send($request->user());

        return back()->with('status', 'A new verification code has been sent.');
    }

    private function maskEmail(string $email): string
    {
        [$local, $domain] = explode('@', $email, 2);
        $visible = mb_substr($local, 0, min(2, mb_strlen($local)));

        return $visible.str_repeat('•', max(1, mb_strlen($local) - mb_strlen($visible))).'@'.$domain;
    }
}

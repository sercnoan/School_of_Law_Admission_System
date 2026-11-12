<?php

use App\Models\EmailVerificationOtp;
use App\Models\User;
use App\Notifications\EmailVerificationOtpNotification;
use App\Services\EmailOtpService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

function issueTestOtp(User $user): string
{
    $code = '';

    app(EmailOtpService::class)->send($user);

    Notification::assertSentTo(
        $user,
        EmailVerificationOtpNotification::class,
        function (EmailVerificationOtpNotification $notification) use (&$code) {
            $code = $notification->code;

            return true;
        }
    );

    return $code;
}

beforeEach(function () {
    Notification::fake();
});

test('a correct otp verifies the account and unlocks the portal', function () {
    $user = User::factory()->unverified()->create(['role' => 'applicant']);
    $code = issueTestOtp($user);

    $this->actingAs($user)
        ->post(route('otp.verification.verify'), ['otp' => $code])
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('dashboard'));

    expect($user->fresh()->email_verified_at)->not->toBeNull();
    expect(EmailVerificationOtp::where('user_id', $user->id)->exists())->toBeFalse();

    $this->get(route('dashboard'))
        ->assertRedirect(route('applicant.dashboard'));
});

test('an incorrect otp is rejected and counts the attempt', function () {
    $user = User::factory()->unverified()->create(['role' => 'applicant']);
    issueTestOtp($user);

    $this->actingAs($user)
        ->post(route('otp.verification.verify'), ['otp' => '000000'])
        ->assertSessionHasErrors('otp');

    expect($user->fresh()->email_verified_at)->toBeNull();
    expect(EmailVerificationOtp::where('user_id', $user->id)->value('attempts'))->toBe(1);
});

test('an expired otp cannot verify the account', function () {
    $user = User::factory()->unverified()->create(['role' => 'applicant']);
    $code = issueTestOtp($user);

    EmailVerificationOtp::where('user_id', $user->id)->update([
        'expires_at' => now()->subMinute(),
    ]);

    $this->actingAs($user)
        ->post(route('otp.verification.verify'), ['otp' => $code])
        ->assertSessionHasErrors('otp');

    expect($user->fresh()->email_verified_at)->toBeNull();
});

test('otp resend is protected by a cooldown', function () {
    $user = User::factory()->unverified()->create(['role' => 'applicant']);
    issueTestOtp($user);

    $this->actingAs($user)
        ->post(route('otp.verification.resend'))
        ->assertSessionHasErrors('resend');

    Notification::assertSentToTimes($user, EmailVerificationOtpNotification::class, 1);
});

test('existing verified accounts remain accessible', function () {
    $user = User::factory()->create(['role' => 'applicant']);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertRedirect(route('applicant.dashboard'));
});

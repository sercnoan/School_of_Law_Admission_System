<?php

use App\Models\EmailVerificationOtp;
use App\Models\User;
use App\Notifications\EmailVerificationOtpNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Laravel\Fortify\Features;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::registration());
});

test('registration screen can be rendered', function () {
    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    Notification::fake();

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));

    $user = User::where('email', 'test@example.com')->firstOrFail();

    expect($user->email_verified_at)->toBeNull();
    expect(EmailVerificationOtp::where('user_id', $user->id)->exists())->toBeTrue();
    Notification::assertSentToTimes(
        $user,
        EmailVerificationOtpNotification::class,
        1
    );

    $this->get(route('dashboard'))
        ->assertRedirect(route('otp.verification.notice'));
});

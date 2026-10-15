<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->admin = User::factory()->create(['role' => 'admin']);
    $applicant = User::factory()->create();

    DB::table('applicant_profiles')->insert([
        'id' => 1,
        'user_id' => $applicant->id,
        'applicant_number' => 'WAIT-001',
        'full_name' => 'Wait List Applicant',
        'school_graduated' => 'Test University',
        'employment_status' => 'Not Currently Employed',
        'present_address' => 'Test Address',
        'age' => 25,
        'gender' => 'Other',
        'contact_number' => '09123456789',
        'religion' => 'Test',
        'civil_status' => 'Single',
    ]);

    DB::table('applications')->insert([
        'application_id' => 1,
        'applicant_profile_id' => 1,
        'program' => 'Juris Doctor [Thesis] (JD)',
        'application_status' => 'Approved',
        'academic_year' => '2026-2027',
    ]);

    DB::table('examination_results')->insert([
        'application_id' => 1,
        'result' => 'Passed',
        'notification_sent_at' => now(),
    ]);

    DB::table('interview_schedules')->insert([
        'interview_id' => 1,
        'application_id' => 1,
        'admin_id' => $this->admin->id,
        'interview_date' => now()->subDay()->toDateString(),
        'interview_time' => '09:00:00',
        'venue' => 'School of Law',
    ]);

    $this->actingAs($this->admin);
});

it('places an eligible interviewee on the waitlist', function () {
    $this->post('/admin/interviewees/1/waitlist')->assertSessionHasNoErrors();

    $this->assertDatabaseHas('interview_results', [
        'application_id' => 1,
        'interview_id' => 1,
        'result' => 'Waitlisted',
        'remarks' => null,
        'decided_by' => $this->admin->id,
    ]);

    $this->get('/admin/waitlisted')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Waitlisted')
            ->has('waitlisted', 1)
            ->where('waitlisted.0.full_name', 'Wait List Applicant')
        );
});

it('allows a waitlisted applicant to receive a final passed result', function () {
    $this->post('/admin/interviewees/1/waitlist')->assertSessionHasNoErrors();

    $this->post('/admin/interviewees/1/pass')
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('interview_results', [
        'application_id' => 1,
        'result' => 'Passed',
    ]);
});

it('keeps the waitlist decision private from the applicant', function () {
    $this->post('/admin/interviewees/1/waitlist')->assertSessionHasNoErrors();

    $applicant = User::findOrFail(
        DB::table('applicant_profiles')->where('id', 1)->value('user_id')
    );

    $this->actingAs($applicant)
        ->get('/applicant/status')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applicant/Status')
            ->where('interviewResult.result', 'Pending')
            ->where('interviewResult.remarks', null)
            ->where('interviewResult.decided_at', null)
        );
});

it('allows an administrator to correct a final interview decision', function () {
    Illuminate\Support\Facades\Mail::fake();

    $this->post('/admin/interviewees/1/pass')
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('interview_results', [
        'application_id' => 1,
        'result' => 'Passed',
    ]);

    $this->post('/admin/interviewees/1/fail')
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('interview_results', [
        'application_id' => 1,
        'result' => 'Failed',
    ]);
    Illuminate\Support\Facades\Mail::assertSent(App\Mail\InterviewFailedMail::class);

    $this->post('/admin/interviewees/1/waitlist')
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('interview_results', [
        'application_id' => 1,
        'result' => 'Waitlisted',
    ]);
});

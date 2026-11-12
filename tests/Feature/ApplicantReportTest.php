<?php

use App\Models\ApplicantProfile;
use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createReportApplicant(array $profileOverrides = [], array $applicationOverrides = []): User
{
    $user = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $profile = ApplicantProfile::create(array_merge([
        'user_id' => $user->id,
        'applicant_number' => 'APP-'.fake()->unique()->numerify('####-####'),
        'first_name' => 'Report',
        'middle_name' => null,
        'last_name' => 'Applicant',
        'full_name' => 'Applicant, Report',
        'school_graduated' => 'University of Southeastern Philippines',
        'employment_status' => 'Not Currently Employed',
        'present_address' => 'Davao City',
        'age' => 24,
        'gender' => 'Female',
        'contact_number' => '09171234567',
        'religion' => 'Roman Catholic',
        'civil_status' => 'Single',
        'individual_income' => 0,
        'individual_income_range' => 'Below Php 10,000.00',
        'family_income' => 0,
        'family_income_range' => 'Below Php 10,000.00',
        'ethnic_affiliation' => 'Bisaya/Cebuano',
        'is_indigenous' => false,
        'is_pwd' => false,
    ], $profileOverrides));

    Application::create(array_merge([
        'applicant_profile_id' => $profile->id,
        'program' => 'Juris Doctor [Thesis] (JD)',
        'application_status' => 'Under Review',
        'submitted_at' => now(),
    ], $applicationOverrides));

    return $user;
}

it('lets an administrator combine applicant report filters', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    createReportApplicant([
        'full_name' => 'Davao Catholic Applicant',
        'present_address' => 'Buhangin, Davao City',
        'religion' => 'Roman Catholic',
    ]);
    createReportApplicant([
        'full_name' => 'Tagum Muslim Applicant',
        'present_address' => 'Tagum City',
        'religion' => 'Islam',
    ]);

    $this->actingAs($admin)
        ->get('/admin/reports?city=Davao+City&religion=Roman+Catholic')
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Reports')
            ->where('filters.city', 'Davao City')
            ->where('filters.religion', 'Roman Catholic')
            ->has('applicants', 1)
            ->where('applicants.0.full_name', 'Davao Catholic Applicant'));
});

it('downloads the filtered applicant report as a pdf', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    createReportApplicant();

    $response = $this->actingAs($admin)
        ->get('/admin/reports/pdf?city=Davao+City');

    $response->assertOk();

    expect($response->headers->get('content-type'))->toBe('application/pdf')
        ->and($response->headers->get('content-disposition'))->toContain(
            'usep-sol-applicant-report-'
        )
        ->and($response->getContent())->toStartWith('%PDF');
});

it('prevents applicants from accessing applicant reports', function () {
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->get('/admin/reports')
        ->assertForbidden();

    $this->actingAs($applicant)
        ->get('/admin/reports/pdf')
        ->assertForbidden();
});

<?php

use App\Models\AdmissionProgram;
use App\Models\ApplicantProfile;
use App\Models\Application;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createProgramTestProfile(User $user): ApplicantProfile
{
    return ApplicantProfile::create([
        'user_id' => $user->id,
        'applicant_number' => 'APP-2026-9001',
        'first_name' => 'Program',
        'middle_name' => null,
        'last_name' => 'Tester',
        'full_name' => 'Tester, Program',
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
    ]);
}

it('lets an administrator add a program that applicants can select', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($admin)
        ->post('/admin/programs', [
            'name' => 'Doctor of Legal Studies (DLS)',
            'short_name' => 'DLS',
            'description' => 'An advanced legal studies program.',
            'qualification' => 'Applicants must hold an appropriate undergraduate degree.',
            'prospectus_url' => 'https://usep.edu.ph/sol/academic-programs-2/',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('admission_programs', [
        'name' => 'Doctor of Legal Studies (DLS)',
        'is_active' => true,
    ]);

    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);
    createProgramTestProfile($applicant);

    $this->actingAs($applicant)
        ->get('/applicant/program')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applicant/Program')
            ->where(
                'programs',
                fn ($programs) => collect($programs)
                    ->contains('name', 'Doctor of Legal Studies (DLS)')
            ));

    $this->actingAs($applicant)
        ->post('/applicant/program', [
            'program' => 'Doctor of Legal Studies (DLS)',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect('/applicant/requirements');

    $this->assertDatabaseHas('applications', [
        'program' => 'Doctor of Legal Studies (DLS)',
    ]);
});

it('updates existing applications and requirements when a program is renamed', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);
    $profile = createProgramTestProfile($applicant);
    $program = AdmissionProgram::where('short_name', 'JD')->firstOrFail();

    Application::create([
        'applicant_profile_id' => $profile->id,
        'program' => $program->name,
        'application_status' => 'Under Review',
        'submitted_at' => now(),
    ]);
    DB::table('requirements')->insert([
        'requirement_name' => 'Program Test Requirement',
        'program' => $program->name,
        'description' => 'Test requirement',
        'is_required' => true,
    ]);

    $this->actingAs($admin)
        ->put("/admin/programs/{$program->id}", [
            'name' => 'Updated Juris Doctor Program',
            'short_name' => 'JD',
            'description' => $program->description,
            'qualification' => $program->qualification,
            'prospectus_url' => $program->prospectus_url,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('applications', [
        'program' => 'Updated Juris Doctor Program',
    ]);
    $this->assertDatabaseHas('requirements', [
        'program' => 'Updated Juris Doctor Program',
    ]);
});

it('hides disabled programs from new applicants', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $program = AdmissionProgram::where('short_name', 'JD')->firstOrFail();

    $this->actingAs($admin)
        ->patch("/admin/programs/{$program->id}/toggle")
        ->assertSessionHasNoErrors();

    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);
    createProgramTestProfile($applicant);

    $this->actingAs($applicant)
        ->get('/applicant/program')
        ->assertInertia(fn (Assert $page) => $page
            ->where(
                'programs',
                fn ($programs) => collect($programs)
                    ->doesntContain('name', $program->name)
            ));
});

it('prevents applicants from managing admission programs', function () {
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->get('/admin/programs')
        ->assertForbidden();

    $this->actingAs($applicant)
        ->post('/admin/programs', [
            'name' => 'Unauthorized Program',
        ])
        ->assertForbidden();
});

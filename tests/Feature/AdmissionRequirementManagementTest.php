<?php

use App\Models\AdmissionProgram;
use App\Models\ApplicantProfile;
use App\Models\Application;
use App\Models\Requirement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function createRequirementTestApplication(User $user, string $program): Application
{
    $profile = ApplicantProfile::create([
        'user_id' => $user->id,
        'applicant_number' => 'APP-2026-9101',
        'first_name' => 'Requirement',
        'middle_name' => null,
        'last_name' => 'Tester',
        'full_name' => 'Tester, Requirement',
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

    return Application::create([
        'applicant_profile_id' => $profile->id,
        'program' => $program,
        'application_status' => 'Pending',
        'submitted_at' => null,
    ]);
}

it('lets an administrator add and edit a requirement for a program', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $program = AdmissionProgram::where('short_name', 'JD')->firstOrFail();

    $this->actingAs($admin)
        ->post('/admin/admission-requirements', [
            'program' => $program->name,
            'requirement_name' => 'PSA Birth Certificate',
            'description' => 'Upload a clear scanned copy.',
            'is_required' => true,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $requirement = Requirement::where('requirement_name', 'PSA Birth Certificate')
        ->firstOrFail();

    $this->actingAs($admin)
        ->put("/admin/admission-requirements/{$requirement->requirement_id}", [
            'program' => $program->name,
            'requirement_name' => 'PSA-issued Birth Certificate',
            'description' => 'Upload a clear PDF copy.',
            'is_required' => false,
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('requirements', [
        'requirement_id' => $requirement->requirement_id,
        'requirement_name' => 'PSA-issued Birth Certificate',
        'program' => $program->name,
        'is_required' => false,
        'is_active' => true,
    ]);
});

it('shows active requirements only to applicants in the selected program', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);
    $program = AdmissionProgram::where('short_name', 'JD')->firstOrFail();
    createRequirementTestApplication($applicant, $program->name);

    $this->actingAs($admin)->post('/admin/admission-requirements', [
        'program' => $program->name,
        'requirement_name' => 'Program-only Document',
        'description' => null,
        'is_required' => true,
    ]);

    $requirement = Requirement::where('requirement_name', 'Program-only Document')
        ->firstOrFail();

    $this->actingAs($applicant)
        ->get('/applicant/requirements')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applicant/Requirements')
            ->where(
                'requirements',
                fn ($requirements) => collect($requirements)
                    ->contains('requirement_name', 'Program-only Document')
            ));

    $this->actingAs($admin)
        ->patch("/admin/admission-requirements/{$requirement->requirement_id}/toggle")
        ->assertSessionHasNoErrors();

    $this->actingAs($applicant)
        ->get('/applicant/requirements')
        ->assertInertia(fn (Assert $page) => $page
            ->where(
                'requirements',
                fn ($requirements) => collect($requirements)
                    ->doesntContain('requirement_name', 'Program-only Document')
            ));
});

it('preserves a requirement that already has submitted files', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);
    $program = AdmissionProgram::where('short_name', 'JD')->firstOrFail();
    $application = createRequirementTestApplication($applicant, $program->name);
    $requirement = Requirement::create([
        'requirement_name' => 'Submitted Document',
        'program' => $program->name,
        'description' => null,
        'is_required' => true,
        'is_active' => true,
        'sort_order' => 10,
    ]);

    DB::table('requirement_submissions')->insert([
        'application_id' => $application->application_id,
        'requirement_id' => $requirement->requirement_id,
        'file_name' => 'document.pdf',
        'file_path' => 'requirements/document.pdf',
        'file_type' => 'application/pdf',
        'file_size' => 1000,
        'verification_status' => 'Pending',
    ]);

    $this->actingAs($admin)
        ->delete("/admin/admission-requirements/{$requirement->requirement_id}")
        ->assertSessionHasErrors('requirement');

    $this->assertDatabaseHas('requirements', [
        'requirement_id' => $requirement->requirement_id,
    ]);
});

it('prevents applicants from managing admission requirements', function () {
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->get('/admin/admission-requirements')
        ->assertForbidden();

    $this->actingAs($applicant)
        ->post('/admin/admission-requirements', [])
        ->assertForbidden();
});

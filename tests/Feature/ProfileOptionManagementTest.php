<?php

use App\Models\ApplicantProfile;
use App\Models\ProfileOption;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

it('lets an administrator add an option that appears in the applicant form', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($admin)
        ->post('/admin/form-options', [
            'field' => 'employment_status',
            'value' => 'Retired',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('profile_options', [
        'field' => 'employment_status',
        'value' => 'Retired',
        'is_active' => true,
    ]);

    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->get('/personal-details')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applicant/PersonalDetails')
            ->where(
                'formOptions.employment_status',
                fn ($values) => collect($values)->contains('Retired')
            ));
});

it('updates existing applicant records when an option is renamed', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    ApplicantProfile::create([
        'user_id' => $applicant->id,
        'applicant_number' => 'APP-2026-9999',
        'first_name' => 'Test',
        'middle_name' => null,
        'last_name' => 'Applicant',
        'full_name' => 'Applicant, Test',
        'school_graduated' => 'Test University',
        'employment_status' => 'Student',
        'present_address' => 'Davao City',
        'age' => 24,
        'gender' => 'Female',
        'contact_number' => '09000000000',
        'religion' => 'Not specified',
        'civil_status' => 'Single',
        'individual_income' => 0,
        'individual_income_range' => 'Below ₱10,000.00',
        'family_income' => 0,
        'family_income_range' => 'Below ₱10,000.00',
        'ethnic_affiliation' => 'Bisaya/Cebuano',
        'is_indigenous' => false,
        'is_pwd' => false,
    ]);

    $option = ProfileOption::where('field', 'employment_status')
        ->where('value', 'Student')
        ->firstOrFail();

    $this->actingAs($admin)
        ->put("/admin/form-options/{$option->id}", [
            'value' => 'Currently Studying',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseHas('applicant_profiles', [
        'user_id' => $applicant->id,
        'employment_status' => 'Currently Studying',
    ]);
});

it('lets an administrator delete an option without changing existing applicant records', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $option = ProfileOption::create([
        'field' => 'employment_status',
        'value' => 'Retired',
        'sort_order' => 100,
        'is_active' => true,
        'is_custom' => false,
    ]);

    ApplicantProfile::create([
        'user_id' => $applicant->id,
        'applicant_number' => 'APP-2026-9998',
        'first_name' => 'Test',
        'middle_name' => null,
        'last_name' => 'Applicant',
        'full_name' => 'Applicant, Test',
        'school_graduated' => 'Test University',
        'employment_status' => 'Retired',
        'present_address' => 'Davao City',
        'age' => 24,
        'gender' => 'Female',
        'contact_number' => '09000000000',
        'religion' => 'Not specified',
        'civil_status' => 'Single',
        'individual_income' => 0,
        'individual_income_range' => 'Below ₱10,000.00',
        'family_income' => 0,
        'family_income_range' => 'Below ₱10,000.00',
        'ethnic_affiliation' => 'Bisaya/Cebuano',
        'is_indigenous' => false,
        'is_pwd' => false,
    ]);

    $this->actingAs($admin)
        ->delete("/admin/form-options/{$option->id}")
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseMissing('profile_options', [
        'id' => $option->id,
    ]);
    $this->assertDatabaseHas('applicant_profiles', [
        'user_id' => $applicant->id,
        'employment_status' => 'Retired',
    ]);
});

it('protects custom-entry options from deletion', function () {
    $admin = User::factory()->create([
        'role' => 'admin',
        'email_verified_at' => now(),
    ]);
    $customOption = ProfileOption::where('field', 'gender')
        ->where('is_custom', true)
        ->firstOrFail();

    $this->actingAs($admin)
        ->delete("/admin/form-options/{$customOption->id}")
        ->assertStatus(422);

    $this->assertDatabaseHas('profile_options', [
        'id' => $customOption->id,
    ]);
});

it('provides the expanded gender choices in the applicant form', function () {
    expect(ProfileOption::activeValues('gender'))->toBe([
        'Male',
        'Female',
        'Non-binary',
        'Genderqueer',
        'Gender-fluid',
        'Agender',
        'Prefer not to say',
        'Other',
    ]);
});

it('provides the standard religion choices in the applicant form', function () {
    expect(ProfileOption::activeValues('religion'))->toContain(
        'Roman Catholic',
        'Islam',
        'Iglesia ni Cristo',
        'Seventh-day Adventist',
        'Buddhism',
        'No religious affiliation',
        'Prefer not to say',
        'Other',
    );
});

it('prevents applicants from managing form options', function () {
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->get('/admin/form-options')
        ->assertForbidden();
});

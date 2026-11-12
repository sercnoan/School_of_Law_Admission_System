<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

function schoolDirectoryPayload(array $overrides = []): array
{
    return array_merge([
        'first_name' => 'Applicant',
        'middle_name' => null,
        'last_name' => 'Example',
        'school_graduated' => 'University of Southeastern Philippines',
        'employment_status' => 'Student',
        'present_address' => 'Davao City',
        'age' => 24,
        'gender' => 'Female',
        'contact_number' => '09171234567',
        'religion' => 'Prefer not to say',
        'religion_other' => null,
        'civil_status' => 'Single',
        'individual_income' => 0,
        'individual_income_range' => 'Below ₱10,000.00',
        'family_income' => 0,
        'family_income_range' => 'Below ₱10,000.00',
        'ethnic_affiliation' => 'Bisaya/Cebuano',
        'is_indigenous' => false,
        'is_pwd' => false,
    ], $overrides);
}

it('provides the searchable CHED school directory to applicants', function () {
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->get('/personal-details')
        ->assertInertia(fn (Assert $page) => $page
            ->component('Applicant/PersonalDetails')
            ->has('schools', 2602)
            ->where(
                'schools',
                fn ($schools) => collect($schools)->contains(
                    fn ($school) => $school['name'] === 'University of Southeastern Philippines'
                        && $school['region'] === 'Region XI (Davao Region)'
                )
            ));
});

it('rejects a school name that was not selected from the directory', function () {
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->post('/personal-details', schoolDirectoryPayload([
            'school_graduated' => 'A school that is not in the directory',
        ]))
        ->assertSessionHasErrors('school_graduated');
});

it('allows an applicant to enter a school that is not listed', function () {
    Storage::fake('public');

    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->post('/personal-details', schoolDirectoryPayload([
            'school_graduated' => '__other__',
            'school_graduated_other' => 'International Example University',
            'photo' => UploadedFile::fake()->image('applicant.jpg'),
        ]))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('applicant_profiles', [
        'user_id' => $applicant->id,
        'school_graduated' => 'International Example University',
    ]);
});

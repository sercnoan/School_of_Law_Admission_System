<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

function personalInformationPayload(array $overrides = []): array
{
    return array_merge([
        'full_name' => 'Applicant Example',
        'school_graduated' => 'University of Southeastern Philippines',
        'employment_status' => 'Student',
        'present_address' => 'Davao City',
        'age' => 24,
        'gender' => 'Female',
        'gender_other' => null,
        'contact_number' => '09171234567',
        'religion' => 'Not specified',
        'civil_status' => 'Single',
        'individual_income' => 0,
        'individual_income_range' => 'Below ₱10,000.00',
        'family_income' => 300000,
        'family_income_range' => '₱50,001.00 – ₱100,000.00',
        'ethnic_affiliation' => 'Bisaya/Cebuano',
        'ethnic_affiliation_other' => null,
        'is_indigenous' => false,
        'indigenous_community' => null,
        'is_pwd' => false,
        'pwd_type' => null,
    ], $overrides);
}

it('creates personal information after applicant confirmation', function () {
    Storage::fake('public');

    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->post('/personal-details', personalInformationPayload([
            'photo' => UploadedFile::fake()->image('applicant.jpg'),
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect('/personal-details');

    $this->assertDatabaseHas('applicant_profiles', [
        'user_id' => $applicant->id,
        'full_name' => 'Applicant Example',
        'present_address' => 'Davao City',
    ]);

    $photoPath = DB::table('applicant_profiles')
        ->where('user_id', $applicant->id)
        ->value('photo_path');

    expect($photoPath)->not->toBeNull();
    Storage::disk('public')->assertExists($photoPath);
});

it('lets an applicant update only their own submitted personal information', function () {
    Storage::fake('public');

    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->post('/personal-details', personalInformationPayload([
            'photo' => UploadedFile::fake()->image('original.jpg'),
        ]));

    $profile = DB::table('applicant_profiles')
        ->where('user_id', $applicant->id)
        ->first();

    $this->post(
        '/personal-details/update',
        personalInformationPayload([
            'full_name' => 'Updated Applicant Name',
            'present_address' => 'Tagum City',
            'photo' => UploadedFile::fake()->image('replacement.png'),
        ])
    )
        ->assertSessionHasNoErrors()
        ->assertRedirect('/personal-details');

    $this->assertDatabaseHas('applicant_profiles', [
        'user_id' => $applicant->id,
        'applicant_number' => $profile->applicant_number,
        'full_name' => 'Updated Applicant Name',
        'present_address' => 'Tagum City',
    ]);

    $newPhotoPath = DB::table('applicant_profiles')
        ->where('user_id', $applicant->id)
        ->value('photo_path');

    expect($newPhotoPath)->not->toBe($profile->photo_path);
    Storage::disk('public')->assertMissing($profile->photo_path);
    Storage::disk('public')->assertExists($newPhotoPath);
});

it('requires an existing profile before updating personal information', function () {
    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->post('/personal-details/update', personalInformationPayload())
        ->assertNotFound();
});

it('requires a valid applicant photo on the first submission', function () {
    Storage::fake('public');

    $applicant = User::factory()->create([
        'role' => 'applicant',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($applicant)
        ->post('/personal-details', personalInformationPayload([
            'photo' => UploadedFile::fake()->create(
                'not-a-photo.pdf',
                100,
                'application/pdf'
            ),
        ]))
        ->assertSessionHasErrors('photo');

    $this->assertDatabaseMissing('applicant_profiles', [
        'user_id' => $applicant->id,
    ]);
});

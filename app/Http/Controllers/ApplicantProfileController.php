<?php

namespace App\Http\Controllers;

use App\Models\ApplicantProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class ApplicantProfileController extends Controller
{
    public function create(Request $request)
    {
        $user = $request->user();

        $profile = ApplicantProfile::where(
            'user_id',
            $user->id
        )->first();

        return Inertia::render(
            'Applicant/PersonalDetails',
            [
                'profile' => $profile,
                'email' => $user->email,
            ]
        );
    }

    public function store(Request $request)
    {
        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Prevent duplicate personal-information submission
        |--------------------------------------------------------------------------
        */

        $existingProfile = ApplicantProfile::where(
            'user_id',
            $user->id
        )->first();

        if ($existingProfile) {
            return redirect()
                ->route('personal.details')
                ->with(
                    'info',
                    'Your personal information has already been submitted.'
                );
        }

        $validated = $this->validateProfile($request, true);
        $photo = $validated['photo'];
        unset($validated['photo']);

        $photoPath = $photo->store(
            "applicant-photos/{$user->id}",
            'public'
        );

        ApplicantProfile::create([
            'user_id' => $user->id,
            'applicant_number' => $this->generateApplicantNumber(),
            'photo_path' => $photoPath,
            ...$validated,
        ]);

        return redirect()
            ->route('personal.details')
            ->with(
                'success',
                'Personal information saved successfully.'
            );
    }

    public function update(Request $request)
    {
        $profile = ApplicantProfile::where(
            'user_id',
            $request->user()->id
        )->firstOrFail();

        $validated = $this->validateProfile(
            $request,
            !$profile->photo_path
        );

        $photo = $validated['photo'] ?? null;
        unset($validated['photo']);

        if ($photo) {
            $oldPhotoPath = $profile->photo_path;
            $newPhotoPath = $photo->store(
                "applicant-photos/{$request->user()->id}",
                'public'
            );

            try {
                $profile->update([
                    ...$validated,
                    'photo_path' => $newPhotoPath,
                ]);
            } catch (\Throwable $exception) {
                Storage::disk('public')->delete($newPhotoPath);
                throw $exception;
            }

            if ($oldPhotoPath) {
                Storage::disk('public')->delete($oldPhotoPath);
            }
        } else {
            $profile->update($validated);
        }

        return redirect()
            ->route('personal.details')
            ->with(
                'success',
                'Personal information updated successfully.'
            );
    }

    private function validateProfile(
        Request $request,
        bool $photoRequired = false
    ): array
    {
        $validated = $request->validate([
            'photo' => [
                $photoRequired ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
            'full_name' => 'required|string|max:255',
            'school_graduated' => 'required|string|max:255',
            'employment_status' => 'required|string|max:100',
            'present_address' => 'required|string',
            'age' => 'required|integer|min:1|max:100',
            'gender' => 'required|in:Male,Female,Other',
            'gender_other' => 'required_if:gender,Other|nullable|string|max:100',
            'contact_number' => 'required|string|max:20',
            'religion' => 'required|string|max:100',
            'civil_status' => 'required|in:Single,Married,Widowed,Separated,Divorced',
            'individual_income' => 'nullable|numeric|min:0',
            'individual_income_range' => [
                'required',
                Rule::in([
                    'Below ₱10,000.00',
                    '₱10,001.00 – ₱20,000.00',
                    '₱20,001.00 – ₱30,000.00',
                    '₱30,001.00 – ₱40,000.00',
                    '₱40,001.00 – ₱50,000.00',
                    '₱50,001.00 – ₱100,000.00',
                    'Above ₱100,000.00',
                ]),
            ],
            'family_income' => 'nullable|numeric|min:0',
            'family_income_range' => [
                'required',
                Rule::in([
                    'Below ₱10,000.00',
                    '₱10,001.00 – ₱20,000.00',
                    '₱20,001.00 – ₱30,000.00',
                    '₱30,001.00 – ₱40,000.00',
                    '₱40,001.00 – ₱50,000.00',
                    '₱50,001.00 – ₱100,000.00',
                    'Above ₱100,000.00',
                ]),
            ],
            'ethnic_affiliation' => 'required|string|max:100',
            'ethnic_affiliation_other' => 'required_if:ethnic_affiliation,Other|nullable|string|max:100',
            'is_indigenous' => 'required|boolean',
            'indigenous_community' => 'nullable|string|max:255',
            'is_pwd' => 'required|boolean',
            'pwd_type' => 'nullable|string|max:255',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Clear conditional fields when applicant answered No
        |--------------------------------------------------------------------------
        */

        if (!(bool) $validated['is_indigenous']) {
            $validated['indigenous_community'] = null;
        }

        if (!(bool) $validated['is_pwd']) {
            $validated['pwd_type'] = null;
        }

        /*
        |--------------------------------------------------------------------------
        | Resolve Gender Value
        |--------------------------------------------------------------------------
        |
        | Male and Female are stored directly. If the applicant chooses Other,
        | the value typed in gender_other is saved in the gender column.
        |
        */

        $genderToSave =
            $validated['gender'] === 'Other'
                ? trim($validated['gender_other'])
                : $validated['gender'];

        $validated['gender'] = $genderToSave;
        unset($validated['gender_other']);

        $validated['ethnic_affiliation'] =
            $validated['ethnic_affiliation'] === 'Other'
                ? trim($validated['ethnic_affiliation_other'])
                : $validated['ethnic_affiliation'];
        unset($validated['ethnic_affiliation_other']);

        if ($validated['family_income'] === null) {
            unset($validated['family_income']);
        }

        if ($validated['individual_income'] === null) {
            unset($validated['individual_income']);
        }

        return $validated;
    }

    private function generateApplicantNumber(): string
    {
        $year = date('Y');

        $lastProfile = ApplicantProfile::where(
            'applicant_number',
            'like',
            "APP-$year-%"
        )
            ->latest('id')
            ->first();

        $number = $lastProfile
            ? ((int) substr($lastProfile->applicant_number, -4)) + 1
            : 1;

        return sprintf(
            'APP-%s-%04d',
            $year,
            $number
        );
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\ApplicantProfile;
use Illuminate\Http\Request;
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

        $validated = $request->validate([
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
            'individual_income' => 'required|numeric|min:0',
            'family_income' => 'required|numeric|min:0',
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

        ApplicantProfile::create([
            'user_id' => $user->id,
            'applicant_number' => $this->generateApplicantNumber(),
            'full_name' => $validated['full_name'],
            'school_graduated' => $validated['school_graduated'],
            'employment_status' => $validated['employment_status'],
            'present_address' => $validated['present_address'],
            'age' => $validated['age'],
            'gender' => $genderToSave,
            'contact_number' => $validated['contact_number'],
            'religion' => $validated['religion'],
            'civil_status' => $validated['civil_status'],
            'individual_income' => $validated['individual_income'],
            'family_income' => $validated['family_income'],
            'is_indigenous' => $validated['is_indigenous'],
            'indigenous_community' => $validated['indigenous_community'],
            'is_pwd' => $validated['is_pwd'],
            'pwd_type' => $validated['pwd_type'],
        ]);

        /*
        |--------------------------------------------------------------------------
        | Return to Personal Information page
        |--------------------------------------------------------------------------
        |
        | The GET request will now find the saved profile, so the frontend will
        | show the read-only information view instead of the form.
        |
        */

        return redirect()
            ->route('personal.details')
            ->with(
                'success',
                'Personal information saved successfully.'
            );
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

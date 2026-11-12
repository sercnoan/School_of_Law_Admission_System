<?php

namespace App\Http\Controllers;

use App\Models\ApplicantProfile;
use App\Models\ProfileOption;
use App\Models\School;
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
                'formOptions' => $this->formOptions($profile),
                'schools' => School::active()
                    ->orderBy('name')
                    ->get(['name', 'region']),
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
            ! $profile->photo_path,
            $profile
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
        bool $photoRequired = false,
        ?ApplicantProfile $profile = null
    ): array {
        $validated = $request->validate([
            'photo' => [
                $photoRequired ? 'required' : 'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:10240',
            ],
            'first_name' => 'required|string|max:100',
            'middle_name' => 'nullable|string|max:100',
            'last_name' => 'required|string|max:100',
            'school_graduated' => [
                'required',
                'string',
                'max:255',
                function (string $attribute, mixed $value, \Closure $fail): void {
                    if (
                        $value !== '__other__'
                        && ! School::active()->where('name', $value)->exists()
                    ) {
                        $fail('Select a college or university from the list.');
                    }
                },
            ],
            'school_graduated_other' => [
                'required_if:school_graduated,__other__',
                'nullable',
                'string',
                'max:255',
            ],
            'employment_status' => [
                'required',
                'string',
                'max:100',
                Rule::in($this->allowedValues('employment_status', $profile?->employment_status)),
            ],
            'present_address' => 'required|string',
            'age' => 'required|integer|min:1|max:100',
            'gender' => [
                'required',
                Rule::in(ProfileOption::activeValues('gender')),
            ],
            'gender_other' => 'required_if:gender,Other|nullable|string|max:100',
            'contact_number' => 'required|string|max:20',
            'religion' => [
                'required',
                Rule::in(ProfileOption::activeValues('religion')),
            ],
            'religion_other' => 'required_if:religion,Other|nullable|string|max:100',
            'civil_status' => [
                'required',
                Rule::in($this->allowedValues('civil_status', $profile?->civil_status)),
            ],
            'individual_income' => 'nullable|numeric|min:0',
            'individual_income_range' => [
                'required',
                Rule::in($this->allowedValues('income_range', $profile?->individual_income_range)),
            ],
            'family_income' => 'nullable|numeric|min:0',
            'family_income_range' => [
                'required',
                Rule::in($this->allowedValues('income_range', $profile?->family_income_range)),
            ],
            'ethnic_affiliation' => [
                'required',
                'string',
                'max:100',
                Rule::in(ProfileOption::activeValues('ethnic_affiliation')),
            ],
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

        if (! (bool) $validated['is_indigenous']) {
            $validated['indigenous_community'] = null;
        }

        if (! (bool) $validated['is_pwd']) {
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

        $validated['religion'] =
            $validated['religion'] === 'Other'
                ? trim($validated['religion_other'])
                : $validated['religion'];
        unset($validated['religion_other']);

        $validated['ethnic_affiliation'] =
            $validated['ethnic_affiliation'] === 'Other'
                ? trim($validated['ethnic_affiliation_other'])
                : $validated['ethnic_affiliation'];
        unset($validated['ethnic_affiliation_other']);

        $validated['first_name'] = trim($validated['first_name']);
        $validated['middle_name'] = filled($validated['middle_name'] ?? null)
            ? trim($validated['middle_name'])
            : null;
        $validated['last_name'] = trim($validated['last_name']);
        $validated['full_name'] = $this->formatFullName(
            $validated['first_name'],
            $validated['middle_name'],
            $validated['last_name']
        );

        $validated['school_graduated'] =
            $validated['school_graduated'] === '__other__'
                ? trim($validated['school_graduated_other'])
                : $validated['school_graduated'];
        unset($validated['school_graduated_other']);

        if ($validated['family_income'] === null) {
            unset($validated['family_income']);
        }

        if ($validated['individual_income'] === null) {
            unset($validated['individual_income']);
        }

        return $validated;
    }

    private function formatFullName(
        string $firstName,
        ?string $middleName,
        string $lastName
    ): string {
        $givenNames = collect([$firstName, $middleName])
            ->filter()
            ->implode(' ');

        return "{$lastName}, {$givenNames}";
    }

    private function formOptions(?ApplicantProfile $profile): array
    {
        return [
            'employment_status' => $this->allowedValues(
                'employment_status',
                $profile?->employment_status
            ),
            'civil_status' => $this->allowedValues(
                'civil_status',
                $profile?->civil_status
            ),
            'gender' => ProfileOption::activeValues('gender'),
            'religion' => ProfileOption::activeValues('religion'),
            'ethnic_affiliation' => ProfileOption::activeValues('ethnic_affiliation'),
            'income_range' => array_values(array_unique([
                ...$this->allowedValues('income_range', $profile?->individual_income_range),
                ...$this->allowedValues('income_range', $profile?->family_income_range),
            ])),
        ];
    }

    private function allowedValues(string $field, ?string $currentValue = null): array
    {
        $values = ProfileOption::activeValues($field);

        if (filled($currentValue) && ! in_array($currentValue, $values, true)) {
            $values[] = $currentValue;
        }

        return $values;
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

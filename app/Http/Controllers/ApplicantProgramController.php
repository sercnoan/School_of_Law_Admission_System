<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\ApplicantProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ApplicantProgramController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Academic Year Start Month
    |--------------------------------------------------------------------------
    |
    | 8 = August
    |
    | Example:
    | August 2026 - July 2027 = AY 2026-2027
    |
    | Change this number if your School of Law officially uses a different
    | starting month for its academic year.
    |
    */

    private const ACADEMIC_YEAR_START_MONTH = 7;


    /*
    |--------------------------------------------------------------------------
    | Program Selection Page
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        $profile = ApplicantProfile::where(
            'user_id',
            $user->id
        )->first();

        return Inertia::render(
            'Applicant/Program',
            [
                'application' => $profile ? Application::where('applicant_profile_id', $profile->id)->first() : null,
                'hasProfile' =>
                    $profile !== null,

                'profile' =>
                    $profile,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store Program Selection
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()
                ->route('login')
                ->with(
                    'error',
                    'You must be logged in.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Find Applicant Profile
        |--------------------------------------------------------------------------
        */

        $profile = ApplicantProfile::where(
            'user_id',
            $user->id
        )->first();


        /*
        |--------------------------------------------------------------------------
        | Profile Required
        |--------------------------------------------------------------------------
        */

        if (!$profile) {
            return redirect()
                ->route('personal.details')
                ->with(
                    'error',
                    'Please complete your Personal Details before selecting a program.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Validate Program
        |--------------------------------------------------------------------------
        */

        $validated = $request->validate([
            'program' => [
                'required',
                'string',
                'in:Juris Doctor,Master of Legal Studies',
            ],
        ]);


        /*
        |--------------------------------------------------------------------------
        | Find Existing Application or Create New Instance
        |--------------------------------------------------------------------------
        |
        | We intentionally do NOT use updateOrCreate with academic_year.
        |
        | This prevents an old application's academic year from changing if
        | the applicant edits their program during a later academic year.
        |
        */

        return DB::transaction(function () use ($profile, $validated) {
            $application = Application::where('applicant_profile_id', $profile->id)
                ->lockForUpdate()->first();

            if ($application && (in_array($application->application_status, ['Approved', 'Completed'], true) || $application->schedule_id)) {
                throw ValidationException::withMessages([
                    'program' => 'This application is locked. Contact admissions to request corrections.',
                ]);
            }

            $application ??= new Application(['applicant_profile_id' => $profile->id]);
            $application->program = $validated['program'];
            if (!$application->exists || empty($application->academic_year)) {
                $application->academic_year = $this->getCurrentAcademicYear();
            }
            $application->save();

            return redirect()->route('applicant.requirements')
                ->with('success', 'Program selected successfully.');
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Determine Current Academic Year
    |--------------------------------------------------------------------------
    */

    private function getCurrentAcademicYear(): string
    {
        $now = now();

        $startYear =
            $now->month >=
            self::ACADEMIC_YEAR_START_MONTH

                ? $now->year

                : $now->year - 1;


        return
            $startYear .
            '-' .
            ($startYear + 1);
    }
}
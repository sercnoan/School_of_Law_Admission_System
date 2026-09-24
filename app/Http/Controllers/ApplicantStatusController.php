<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Requirement;
use App\Models\RequirementSubmission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ApplicantStatusController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Applicant Application Status
    |--------------------------------------------------------------------------
    */

    public function index(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Logged-in User
        |--------------------------------------------------------------------------
        */

        $user = $request->user();

        /*
        |--------------------------------------------------------------------------
        | Applicant Profile
        |--------------------------------------------------------------------------
        */

        $profile = $user->applicantProfile;

        if (!$profile) {
            return redirect()
                ->route('personal.details');
        }

        /*
        |--------------------------------------------------------------------------
        | Applicant Application
        |--------------------------------------------------------------------------
        */

        $application = Application::where(
            'applicant_profile_id',
            $profile->id
        )->first();

        if (!$application) {
            return redirect()
                ->route('applicant.program')
                ->with(
                    'error',
                    'Please select a program first.'
                );
        }

        /*
        |--------------------------------------------------------------------------
        | Requirements
        |--------------------------------------------------------------------------
        */

        $requirements = Requirement::whereIn(
            'program',
            [
                $application->program,
                'Both',
            ]
        )
            ->where(
                'is_required',
                true
            )
            ->orderBy(
                'requirement_id'
            )
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Requirement Submissions
        |--------------------------------------------------------------------------
        */

        $submissions = RequirementSubmission::where(
            'application_id',
            $application->application_id
        )
            ->get()
            ->keyBy(
                'requirement_id'
            );

        /*
        |--------------------------------------------------------------------------
        | Combine Requirements and Submissions
        |--------------------------------------------------------------------------
        */

        $requirements = $requirements->map(
            function ($requirement) use ($submissions) {
                $submission = $submissions->get(
                    $requirement->requirement_id
                );

                return [
                    'requirement_id' =>
                        $requirement->requirement_id,

                    'requirement_name' =>
                        $requirement->requirement_name,

                    'description' =>
                        $requirement->description,

                    'is_required' =>
                        (bool) $requirement->is_required,

                    'submitted' =>
                        $submission !== null,

                    'submission' => $submission
                        ? [
                            'submission_id' =>
                                $submission->submission_id,

                            'file_name' =>
                                $submission->file_name,

                            'file_path' =>
                                $submission->file_path,

                            'file_type' =>
                                $submission->file_type,

                            'file_size' =>
                                $submission->file_size,

                            'verification_status' =>
                                $submission->verification_status,

                            'remarks' =>
                                $submission->remarks,

                            'uploaded_at' =>
                                $submission->uploaded_at,
                        ]
                        : null,
                ];
            }
        );

        /*
        |--------------------------------------------------------------------------
        | Examination Result
        |--------------------------------------------------------------------------
        */

        $examinationResult = DB::table(
            'examination_results'
        )
            ->where(
                'application_id',
                $application->application_id
            )
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Selected Examination Schedule
        |--------------------------------------------------------------------------
        |
        | Read the selected examination schedule directly from
        | applications.schedule_id. This is the same source used by the
        | applicant Examination page.
        |
        */

        $selectedSchedule = DB::table(
            'applications'
        )
            ->join(
                'examination_schedules',
                'applications.schedule_id',
                '=',
                'examination_schedules.schedule_id'
            )
            ->where(
                'applications.application_id',
                $application->application_id
            )
            ->select(
                'examination_schedules.*'
            )
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Fallback Examination Schedule
        |--------------------------------------------------------------------------
        |
        | If applications.schedule_id is empty but the examination result
        | already contains a schedule_id, use that schedule as a fallback.
        |
        */

        if (
            !$selectedSchedule &&
            $examinationResult &&
            $examinationResult->schedule_id
        ) {
            $selectedSchedule = DB::table(
                'examination_schedules'
            )
                ->where(
                    'schedule_id',
                    $examinationResult->schedule_id
                )
                ->first();
        }

        /*
        |--------------------------------------------------------------------------
        | Interview Schedule
        |--------------------------------------------------------------------------
        */

        $interviewSchedule = DB::table(
            'interview_schedules'
        )
            ->where(
                'application_id',
                $application->application_id
            )
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Interview Result
        |--------------------------------------------------------------------------
        */

        $interviewResult = DB::table(
            'interview_results'
        )
            ->where(
                'application_id',
                $application->application_id
            )
            ->first();

        /*
        |--------------------------------------------------------------------------
        | Applicant Information
        |--------------------------------------------------------------------------
        */

        $applicantProfile = [
            'id' =>
                $profile->id,

            'applicant_number' =>
                $profile->applicant_number,

            'full_name' =>
                $profile->full_name,

            'contact_number' =>
                $profile->contact_number,

            'email' =>
                $user->email,
        ];

        /*
        |--------------------------------------------------------------------------
        | Return Status Page
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'Applicant/Status',
            [
                'application' =>
                    $application,

                'applicantProfile' =>
                    $applicantProfile,

                'requirements' =>
                    $requirements,

                'selectedSchedule' =>
                    $selectedSchedule,

                'examinationResult' =>
                    $examinationResult,

                'interviewSchedule' =>
                    $interviewSchedule,

                'interviewResult' =>
                    $interviewResult,
            ]
        );
    }
}

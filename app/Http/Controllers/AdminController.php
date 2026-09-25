<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Admin Dashboard
    |--------------------------------------------------------------------------
    */

    public function dashboard()
    {
        /*
        |--------------------------------------------------------------------------
        | Total Applications
        |--------------------------------------------------------------------------
        */

        $totalApplications = DB::table('applications')
            ->count();

        /*
        |--------------------------------------------------------------------------
        | Application Status Counts
        |--------------------------------------------------------------------------
        |
        | applications.application_status supports:
        | Pending, Under Review, Approved, Declined, Completed.
        |
        | Including all five statuses ensures:
        |
        | Total Applications =
        | Pending + Under Review + Approved + Declined + Completed
        |
        */

        $pendingApplications = DB::table('applications')
            ->where('application_status', 'Pending')
            ->count();

        $underReviewApplications = DB::table('applications')
            ->where('application_status', 'Under Review')
            ->count();

        $approvedApplications = DB::table('applications')
            ->where('application_status', 'Approved')
            ->count();

        $declinedApplications = DB::table('applications')
            ->where('application_status', 'Declined')
            ->count();

        return Inertia::render(
            'Admin/Dashboard',
            [
                'statistics' => [
                    'totalApplications' =>
                        $totalApplications,

                    'pendingApplications' =>
                        $pendingApplications,

                    'underReviewApplications' =>
                        $underReviewApplications,

                    'approvedApplications' =>
                        $approvedApplications,

                    'declinedApplications' =>
                        $declinedApplications,

                ],
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Applications List
    |--------------------------------------------------------------------------
    */

    public function applications()
    {
        $applications = DB::table('applications')

            ->join(
                'applicant_profiles',
                'applications.applicant_profile_id',
                '=',
                'applicant_profiles.id'
            )

            ->join(
                'users',
                'applicant_profiles.user_id',
                '=',
                'users.id'
            )

            ->select(
                'applications.application_id',
                'applications.applicant_profile_id',
                'applications.program',
                'applications.application_status',
                'applications.remarks',
                'applications.submitted_at',
                'applications.updated_at',

                'applicant_profiles.applicant_number',
                'applicant_profiles.full_name',

                'users.email'
            )

            ->orderByDesc(
                'applications.submitted_at'
            )

            ->get();


        return Inertia::render(
            'Admin/Applications',
            [
                'applications' =>
                    $applications,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Application Details
    |--------------------------------------------------------------------------
    */

    public function applicationDetails(
        $applicationId
    ) {
        $application = DB::table(
            'applications'
        )

            ->join(
                'applicant_profiles',
                'applications.applicant_profile_id',
                '=',
                'applicant_profiles.id'
            )

            ->join(
                'users',
                'applicant_profiles.user_id',
                '=',
                'users.id'
            )

            ->where(
                'applications.application_id',
                $applicationId
            )

            ->select(
                'applications.application_id',
                'applications.schedule_id',
                'applications.program',
                'applications.application_status',
                'applications.remarks',
                'applications.submitted_at',
                'applications.updated_at',

                'applicant_profiles.id as applicant_profile_id',
                'applicant_profiles.applicant_number',
                'applicant_profiles.full_name',
                'applicant_profiles.school_graduated',
                'applicant_profiles.employment_status',
                'applicant_profiles.present_address',
                'applicant_profiles.age',
                'applicant_profiles.gender',
                'applicant_profiles.contact_number',
                'applicant_profiles.religion',
                'applicant_profiles.civil_status',
                'applicant_profiles.individual_income',
                'applicant_profiles.family_income',
                'applicant_profiles.is_indigenous',
                'applicant_profiles.indigenous_community',
                'applicant_profiles.is_pwd',
                'applicant_profiles.pwd_type',

                'users.email'
            )

            ->first();


        if (!$application) {
            abort(
                404,
                'Application not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Get Requirements
        |--------------------------------------------------------------------------
        */

        $requirements = DB::table(
            'requirements'
        )

            ->where(
                function ($query) use (
                    $application
                ) {
                    $query
                        ->where(
                            'program',
                            $application->program
                        )

                        ->orWhere(
                            'program',
                            'Both'
                        );
                }
            )

            ->where(
                'is_required',
                1
            )

            ->orderBy(
                'requirement_id'
            )

            ->get();


        /*
        |--------------------------------------------------------------------------
        | Get Requirement Submissions
        |--------------------------------------------------------------------------
        */

        $submissions = DB::table(
            'requirement_submissions'
        )

            ->where(
                'application_id',
                $applicationId
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

        $requirements =
            $requirements->map(
                function (
                    $requirement
                ) use (
                    $submissions
                ) {
                    $submission =
                        $submissions->get(
                            $requirement
                                ->requirement_id
                        );


                    return [
                        'requirement_id' =>
                            $requirement
                                ->requirement_id,

                        'requirement_name' =>
                            $requirement
                                ->requirement_name,

                        'description' =>
                            $requirement
                                ->description,

                        'is_required' =>
                            (bool)
                            $requirement
                                ->is_required,

                        'submitted' =>
                            $submission !== null,

                        'submission' =>
                            $submission
                            ? [
                                'submission_id' =>
                                    $submission
                                        ->submission_id,

                                'file_name' =>
                                    $submission
                                        ->file_name,

                                'file_path' =>
                                    $submission
                                        ->file_path,

                                'file_type' =>
                                    $submission
                                        ->file_type,

                                'file_size' =>
                                    $submission
                                        ->file_size,

                                'verification_status' =>
                                    $submission
                                        ->verification_status,

                                'remarks' =>
                                    $submission
                                        ->remarks,

                                'uploaded_at' =>
                                    $submission
                                        ->uploaded_at,
                            ]
                            : null,
                    ];
                }
            );


        return Inertia::render(
            'Admin/ApplicationDetails',
            [
                'application' =>
                    $application,

                'requirements' =>
                    $requirements,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Download Requirement Submission
    |--------------------------------------------------------------------------
    |
    | Downloads the actual file submitted by the applicant.
    |
    | Example database paths:
    |
    | requirements/4/document.pdf
    | admission_requirements/document.pdf
    | storage/requirements/4/document.pdf
    | public/requirements/4/document.pdf
    |
    */

    public function downloadRequirement(
        $submissionId
    ) {
        /*
        |--------------------------------------------------------------------------
        | Find Submission
        |--------------------------------------------------------------------------
        */

        $submission = DB::table(
            'requirement_submissions'
        )

            ->where(
                'submission_id',
                $submissionId
            )

            ->first();


        /*
        |--------------------------------------------------------------------------
        | Check Submission
        |--------------------------------------------------------------------------
        */

        if (!$submission) {
            abort(
                404,
                'Requirement submission not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Check File Path
        |--------------------------------------------------------------------------
        */

        if (
            empty(
                $submission->file_path
            )
        ) {
            abort(
                404,
                'Submitted file path not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Normalize File Path
        |--------------------------------------------------------------------------
        */

        $relativePath = str_replace(
            '\\',
            '/',
            $submission->file_path
        );

        $relativePath = ltrim(
            $relativePath,
            '/'
        );


        /*
        |--------------------------------------------------------------------------
        | Remove Optional Prefixes
        |--------------------------------------------------------------------------
        */

        if (
            str_starts_with(
                $relativePath,
                'storage/'
            )
        ) {
            $relativePath = substr(
                $relativePath,
                strlen('storage/')
            );
        }


        if (
            str_starts_with(
                $relativePath,
                'public/'
            )
        ) {
            $relativePath = substr(
                $relativePath,
                strlen('public/')
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Public Storage Directory
        |--------------------------------------------------------------------------
        */

        $basePath = realpath(
            storage_path(
                'app/public'
            )
        );


        if (!$basePath) {
            abort(
                500,
                'Public storage directory could not be found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Build Full Physical Path
        |--------------------------------------------------------------------------
        */

        $fullPath = realpath(
            $basePath .
            DIRECTORY_SEPARATOR .
            str_replace(
                '/',
                DIRECTORY_SEPARATOR,
                $relativePath
            )
        );


        /*
        |--------------------------------------------------------------------------
        | Make Sure File Exists
        |--------------------------------------------------------------------------
        */

        if (
            !$fullPath ||
            !is_file($fullPath)
        ) {
            abort(
                404,
                'Submitted file not found on the server.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Security Check
        |--------------------------------------------------------------------------
        |
        | Prevents paths outside storage/app/public
        |
        */

        $expectedPrefix =
            rtrim(
                $basePath,
                DIRECTORY_SEPARATOR
            ) .
            DIRECTORY_SEPARATOR;


        if (
            !str_starts_with(
                $fullPath,
                $expectedPrefix
            )
        ) {
            abort(
                403,
                'Invalid file path.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Download Filename
        |--------------------------------------------------------------------------
        */

        $downloadName =
            !empty(
                $submission->file_name
            )
            ? $submission->file_name
            : basename($fullPath);


        /*
        |--------------------------------------------------------------------------
        | Download File
        |--------------------------------------------------------------------------
        */

        return response()->download(
            $fullPath,
            $downloadName,
            [
                'Content-Type' =>
                    $submission->file_type
                    ?: 'application/octet-stream',
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Application Status
    |--------------------------------------------------------------------------
    */

    public function updateApplicationStatus(Request $request, $applicationId)
    {
        $validated = $request->validate([
            'application_status' => ['required', 'in:Pending,Under Review,Approved,Declined,Completed'],
            'remarks' => ['nullable', 'string', 'max:2000'],
        ]);

        DB::transaction(function () use ($validated, $applicationId) {
            $application = DB::table('applications')
                ->where('application_id', $applicationId)
                ->lockForUpdate()
                ->first();

            abort_if(!$application, 404, 'Application not found.');

            if ($application->schedule_id && !in_array($validated['application_status'], ['Approved', 'Completed'], true)) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'application_status' => 'Resolve the existing examination booking before reopening or declining this application.',
                ]);
            }

            if ($validated['application_status'] === 'Approved') {
                $requirements = DB::table('requirements')
                    ->whereIn('program', [$application->program, 'Both'])
                    ->where('is_required', 1)
                    ->orderBy('requirement_id')
                    ->get();

                $submissions = DB::table('requirement_submissions')
                    ->where('application_id', $applicationId)
                    ->whereIn('requirement_id', $requirements->pluck('requirement_id'))
                    ->lockForUpdate()
                    ->get()
                    ->groupBy('requirement_id');

                $outstanding = $requirements->filter(function ($requirement) use ($submissions) {
                    $documents = $submissions->get($requirement->requirement_id);

                    return !$documents || $documents->contains(
                        fn ($document) => $document->verification_status !== 'Approved'
                    );
                });

                if ($outstanding->isNotEmpty()) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'application_status' => 'Approve every required document first. Needs attention: '
                            .$outstanding->pluck('requirement_name')->implode('; ').'.',
                    ]);
                }
            }

            DB::table('applications')->where('application_id', $applicationId)->update([
                'application_status' => $validated['application_status'],
                'remarks' => $validated['remarks'] ?? null,
                'updated_at' => now(),
            ]);
        });

        return redirect()->route('admin.application.details', $applicationId)
            ->with('success', 'Application status updated successfully.');
    }


    /*
    |--------------------------------------------------------------------------
    | Verify Requirement Submission
    |--------------------------------------------------------------------------
    */

    public function verifyRequirement(
        Request $request,
        $applicationId,
        $submissionId
    ) {
        $validated =
            $request->validate([
                'verification_status' => [
                    'required',
                    'in:Approved,Declined',
                ],

                'remarks' => [
                    'nullable',
                    'string',
                    'max:2000',
                ],
            ]);


        $submission = DB::table(
            'requirement_submissions'
        )

            ->where(
                'submission_id',
                $submissionId
            )

            ->where(
                'application_id',
                $applicationId
            )

            ->first();


        if (!$submission) {
            abort(
                404,
                'Requirement submission not found.'
            );
        }


        DB::table(
            'requirement_submissions'
        )

            ->where(
                'submission_id',
                $submissionId
            )

            ->where(
                'application_id',
                $applicationId
            )

            ->update([
                'verification_status' =>
                    $validated[
                        'verification_status'
                    ],

                'remarks' =>
                    $validated[
                        'remarks'
                    ] ?? null,
            ]);


        return redirect()

            ->route(
                'admin.application.details',
                $applicationId
            )

            ->with(
                'success',
                'Requirement verification updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Examination Schedules
    |--------------------------------------------------------------------------
    */


    /*
    |--------------------------------------------------------------------------
    | Display Examination Schedules
    |--------------------------------------------------------------------------
    */

    public function examinationSchedules()
    {
        $schedules = DB::table(
            'examination_schedules'
        )

            ->orderBy(
                'exam_date',
                'asc'
            )

            ->orderBy(
                'exam_time',
                'asc'
            )

            ->get();


        return Inertia::render(
            'Admin/ExaminationSchedules',
            [
                'schedules' =>
                    $schedules,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Create Examination Schedule Page
    |--------------------------------------------------------------------------
    */

    public function createExaminationSchedule()
    {
        return Inertia::render(
            'Admin/CreateExaminationSchedule'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Store Examination Schedule
    |--------------------------------------------------------------------------
    */

    public function storeExaminationSchedule(
        Request $request
    ) {
        $validated =
            $request->validate([
                'exam_date' => [
                    'required',
                    'date',
                ],

                'exam_time' => [
                    'required',
                ],

                'venue' => [
                    'required',
                    'string',
                    'max:150',
                ],

                'max_applicants' => [
                    'required',
                    'integer',
                    'min:1',
                ],

                'instructions' => [
                    'nullable',
                    'string',
                ],

                'notes' => [
                    'nullable',
                    'string',
                ],

                'status' => [
                    'required',
                    'in:Open,Closed,Completed',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Schedule
        |--------------------------------------------------------------------------
        */

        $existingSchedule = DB::table(
            'examination_schedules'
        )

            ->where(
                'exam_date',
                $validated[
                    'exam_date'
                ]
            )

            ->where(
                'exam_time',
                $validated[
                    'exam_time'
                ]
            )

            ->where(
                'venue',
                $validated[
                    'venue'
                ]
            )

            ->where(
                'status',
                '!=',
                'Completed'
            )

            ->exists();


        if ($existingSchedule) {
            return back()

                ->withErrors([
                    'exam_date' =>
                        'An examination schedule with the same date, time, and venue already exists.',
                ])

                ->withInput();
        }


        /*
        |--------------------------------------------------------------------------
        | Insert Schedule
        |--------------------------------------------------------------------------
        */

        DB::table(
            'examination_schedules'
        )

            ->insert([
                'admin_id' =>
                    auth()->id(),

                'exam_date' =>
                    $validated[
                        'exam_date'
                    ],

                'exam_time' =>
                    $validated[
                        'exam_time'
                    ],

                'venue' =>
                    $validated[
                        'venue'
                    ],

                'max_applicants' =>
                    $validated[
                        'max_applicants'
                    ],

                /*
                |--------------------------------------------------------------------------
                | Initially all slots are available
                |--------------------------------------------------------------------------
                */

                'available_slots' =>
                    $validated[
                        'max_applicants'
                    ],

                'instructions' =>
                    $validated[
                        'instructions'
                    ] ?? null,

                'notes' =>
                    $validated[
                        'notes'
                    ] ?? null,

                'status' =>
                    $validated[
                        'status'
                    ],

                'created_at' =>
                    now(),

                'updated_at' =>
                    now(),
            ]);


        /*
        |--------------------------------------------------------------------------
        | Return to Schedule List
        |--------------------------------------------------------------------------
        */

        return redirect()

            ->route(
                'admin.examination.schedules'
            )

            ->with(
                'success',
                'Examination schedule created successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Delete Examination Schedule
    |--------------------------------------------------------------------------
    */

    public function deleteExaminationSchedule(
        $scheduleId
    ) {
        $schedule = DB::table(
            'examination_schedules'
        )

            ->where(
                'schedule_id',
                $scheduleId
            )

            ->first();


        if (!$schedule) {
            abort(
                404,
                'Examination schedule not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent deletion if applicants have already taken slots
        |--------------------------------------------------------------------------
        */

        if (
            $schedule
                ->available_slots <
            $schedule
                ->max_applicants
        ) {
            return back()
                ->with(
                    'error',
                    'This examination schedule cannot be deleted because applicants have already selected it.'
                );
        }


        DB::table(
            'examination_schedules'
        )

            ->where(
                'schedule_id',
                $scheduleId
            )

            ->delete();


        return redirect()

            ->route(
                'admin.examination.schedules'
            )

            ->with(
                'success',
                'Examination schedule deleted successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Update Examination Schedule Status
    |--------------------------------------------------------------------------
    */

    public function updateExaminationScheduleStatus(
        Request $request,
        $scheduleId
    ) {
        $validated =
            $request->validate([
                'status' => [
                    'required',
                    'in:Open,Closed,Completed',
                ],
            ]);


        $schedule = DB::table(
            'examination_schedules'
        )

            ->where(
                'schedule_id',
                $scheduleId
            )

            ->first();


        if (!$schedule) {
            abort(
                404,
                'Examination schedule not found.'
            );
        }


        DB::table(
            'examination_schedules'
        )

            ->where(
                'schedule_id',
                $scheduleId
            )

            ->update([
                'status' =>
                    $validated[
                        'status'
                    ],

                'updated_at' =>
                    now(),
            ]);


        return back()
            ->with(
                'success',
                'Examination schedule status updated successfully.'
            );
    }
}
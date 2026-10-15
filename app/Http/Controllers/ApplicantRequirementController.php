<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ApplicantRequirementController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Requirements Page
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $user = auth()->user();

        $profile = $user->applicantProfile;

        if (!$profile) {
            return redirect()->route('personal.details');
        }

        $application = DB::table('applications')
            ->where('applicant_profile_id', $profile->id)
            ->first();

        if (!$application) {
            return redirect()->route('applicant.program');
        }

        /*
        |--------------------------------------------------------------------------
        | Get Requirements
        |--------------------------------------------------------------------------
        */

        $requirements = DB::table('requirements')
            ->where(function ($query) use ($application) {
                $query
                    ->where('program', $application->program)
                    ->orWhere('program', 'Both');
            })
            ->where('is_required', 1)
            ->orderBy('requirement_id')
            ->get();

        /*
        |--------------------------------------------------------------------------
        | Get Existing Submissions
        |--------------------------------------------------------------------------
        */

        $submissions = DB::table('requirement_submissions')
            ->where('application_id', $application->application_id)
            ->get();

        return Inertia::render('Applicant/Requirements', [
            'application' => $application,
            'requirements' => $requirements,
            'submissions' => $submissions,
        ]);
    }


    /*
    |--------------------------------------------------------------------------
    | Remove Requirement Submission
    |--------------------------------------------------------------------------
    */

    public function remove(Request $request, $requirementId)
    {
        return DB::transaction(function () use ($request, $requirementId) {
            $profile = $request->user()->applicantProfile;

            if (!$profile) {
                return redirect()
                    ->route('personal.details')
                    ->with('error', 'Please complete your personal details first.');
            }

            $application = DB::table('applications')
                ->where('applicant_profile_id', $profile->id)
                ->lockForUpdate()
                ->first();

            if (!$application) {
                return redirect()
                    ->route('applicant.program')
                    ->with('error', 'Please select a program first.');
            }

            if (in_array($application->application_status, ['Approved', 'Completed'], true) || $application->schedule_id) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'file' => 'This application is locked. Contact admissions to request corrections.',
                ]);
            }

            $submission = DB::table('requirement_submissions')
                ->where('application_id', $application->application_id)
                ->where('requirement_id', $requirementId)
                ->lockForUpdate()
                ->first();

            if (!$submission) {
                return redirect()
                    ->route('applicant.requirements')
                    ->with('error', 'The submitted document could not be found.');
            }

            DB::table('requirement_submissions')
                ->where('submission_id', $submission->submission_id)
                ->delete();

            if ($submission->file_path) {
                DB::afterCommit(function () use ($submission) {
                    Storage::disk('public')->delete($submission->file_path);
                });
            }

            return redirect()
                ->route('applicant.requirements')
                ->with('success', 'Document removed. You may now upload a new PDF.');
        });
    }


    /*
    |--------------------------------------------------------------------------
    | Upload Requirement
    |--------------------------------------------------------------------------
    */

    public function upload(
        Request $request,
        $requirementId
    ) {
        return DB::transaction(function () use ($request, $requirementId) {
            /*
            |--------------------------------------------------------------------------
            | Validate File
            |--------------------------------------------------------------------------
            */

            $validated = $request->validate([
                'file' => [
                    'required',
                    'file',
                    'mimes:pdf',
                    'max:10240',
                ],
            ]);


            /*
            |--------------------------------------------------------------------------
            | Get Applicant
            |--------------------------------------------------------------------------
            */

            $user = auth()->user();

            $profile = $user->applicantProfile;

            if (!$profile) {
                return redirect()
                    ->route('personal.details')
                    ->with('error', 'Please complete your personal details first.');
            }


            /*
            |--------------------------------------------------------------------------
            | Get Application
            |--------------------------------------------------------------------------
            */

            $application = DB::table('applications')
                ->where(
                    'applicant_profile_id',
                    $profile->id
                )
                ->lockForUpdate()
                ->first();


            if (!$application) {
                return redirect()
                    ->route('applicant.program')
                    ->with('error', 'Please select a program first.');
            }
            if (in_array($application->application_status, ['Approved', 'Completed'], true) || $application->schedule_id) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'file' => 'This application is locked. Contact admissions to request corrections.',
                ]);
            }



            /*
            |--------------------------------------------------------------------------
            | Verify Requirement Exists
            |--------------------------------------------------------------------------
            */

            $requirement = DB::table('requirements')
                ->where(
                    'requirement_id',
                    $requirementId
                )
                ->first();


            if (!$requirement) {
                abort(404, 'Requirement not found.');
            }


            /*
            |--------------------------------------------------------------------------
            | Find Existing Submission
            |--------------------------------------------------------------------------
            */

            $existingSubmission = DB::table('requirement_submissions')
                ->where(
                    'application_id',
                    $application->application_id
                )
                ->where(
                    'requirement_id',
                    $requirementId
                )
                ->first();

            if ($existingSubmission) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'file' => 'Remove the existing document before uploading another one.',
                ]);
            }


            /*
            |--------------------------------------------------------------------------
            | Store New File
            |--------------------------------------------------------------------------
            */

            $file = $validated['file'];

            $fileName = $file->getClientOriginalName();

            $fileType = $file->getClientMimeType();

            $fileSize = $file->getSize();


            $directory =
                'requirements/' .
                $application->application_id;


            $newFilePath = $file->store(
                $directory,
                'public'
            );


            DB::table('requirement_submissions')
                ->insert([
                    'application_id' =>
                        $application->application_id,

                    'requirement_id' =>
                        $requirementId,

                    'file_name' =>
                        $fileName,

                    'file_path' =>
                        $newFilePath,

                    'file_type' =>
                        $fileType,

                    'file_size' =>
                        $fileSize,

                    'verification_status' =>
                        'Pending',

                    'remarks' =>
                        null,

                    'uploaded_at' =>
                        now(),
                ]);


            /*
            |--------------------------------------------------------------------------
            | Return to Requirements
            |--------------------------------------------------------------------------
            */

            return redirect()
                ->route('applicant.requirements')
                ->with('success', 'Document uploaded successfully and is now pending review.');

        });
    }


    /*
    |--------------------------------------------------------------------------
    | Submit Application
    |--------------------------------------------------------------------------
    */

    public function submit()
    {
        return DB::transaction(function () {
            $user = auth()->user();

            $profile = $user->applicantProfile;

            if (!$profile) {
                return redirect()
                    ->route('personal.details')
                    ->with('error', 'Please complete your personal details first.');
            }


            $application = DB::table('applications')
                ->where(
                    'applicant_profile_id',
                    $profile->id
                )
                ->lockForUpdate()
                ->first();


            if (!$application) {
                return redirect()
                    ->route('applicant.program')
                    ->with('error', 'No application found.');
            }
            if (in_array($application->application_status, ['Approved', 'Completed'], true) || $application->schedule_id) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'application' => 'This application is locked. Contact admissions to request corrections.',
                ]);
            }



            /*
            |--------------------------------------------------------------------------
            | Get Required Requirements
            |--------------------------------------------------------------------------
            */

            $requirements = DB::table('requirements')
                ->where(function ($query) use ($application) {
                    $query
                        ->where('program', $application->program)
                        ->orWhere('program', 'Both');
                })
                ->where('is_required', 1)
                ->get();


            /*
            |--------------------------------------------------------------------------
            | Check Required Documents
            |--------------------------------------------------------------------------
            */

            $submittedCount = DB::table('requirement_submissions')
                ->where(
                    'application_id',
                    $application->application_id
                )
                ->whereIn(
                    'requirement_id',
                    $requirements->pluck('requirement_id')
                )
                ->count();


            if (
                $submittedCount <
                $requirements->count()
            ) {
                return redirect()
                    ->route('applicant.requirements')
                    ->with(
                        'error',
                        'Please upload all required documents before submitting your application.'
                    );
            }


            /*
            |--------------------------------------------------------------------------
            | Submit Application
            |--------------------------------------------------------------------------
            */

            DB::table('applications')
                ->where(
                    'application_id',
                    $application->application_id
                )
                ->update([
                    'application_status' =>
                        'Under Review',

                    'submitted_at' =>
                        now(),

                    'updated_at' =>
                        now(),
                ]);


            /*
            |--------------------------------------------------------------------------
            | Return
            |--------------------------------------------------------------------------
            */

            return redirect()
                ->route('applicant.status')
                ->with(
                    'success',
                    'Your application has been submitted successfully.'
                );

        });
    }
}

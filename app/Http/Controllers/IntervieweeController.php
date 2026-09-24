<?php

namespace App\Http\Controllers;

use App\Mail\InterviewFailedMail;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Throwable;

class IntervieweeController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Interviewees List
    |--------------------------------------------------------------------------
    |
    | Only applicants who:
    |
    | 1. Passed the examination
    | 2. Have an interview schedule
    | 3. Successfully received the examination-passed /
    |    interview-schedule email
    |
    | will appear on this page.
    |
    */

    public function index()
    {
        $interviewees = DB::table(
            'applications'
        )

            /*
            |--------------------------------------------------------------------------
            | Applicant Profile
            |--------------------------------------------------------------------------
            */

            ->join(
                'applicant_profiles',
                'applications.applicant_profile_id',
                '=',
                'applicant_profiles.id'
            )

            /*
            |--------------------------------------------------------------------------
            | User
            |--------------------------------------------------------------------------
            */

            ->join(
                'users',
                'applicant_profiles.user_id',
                '=',
                'users.id'
            )

            /*
            |--------------------------------------------------------------------------
            | Examination Result
            |--------------------------------------------------------------------------
            */

            ->join(
                'examination_results',
                'applications.application_id',
                '=',
                'examination_results.application_id'
            )

            /*
            |--------------------------------------------------------------------------
            | Interview Schedule
            |--------------------------------------------------------------------------
            */

            ->join(
                'interview_schedules',
                'applications.application_id',
                '=',
                'interview_schedules.application_id'
            )

            /*
            |--------------------------------------------------------------------------
            | Interview Result
            |--------------------------------------------------------------------------
            |
            | LEFT JOIN because applicants who have not yet been evaluated
            | must still appear as Pending.
            |
            */

            ->leftJoin(
                'interview_results',
                'applications.application_id',
                '=',
                'interview_results.application_id'
            )

            /*
            |--------------------------------------------------------------------------
            | Only Passed Examinees Whose Interview Email Was Sent
            |--------------------------------------------------------------------------
            */

            ->where(
                'examination_results.result',
                'Passed'
            )

            ->whereNotNull(
                'examination_results.notification_sent_at'
            )

            /*
            |--------------------------------------------------------------------------
            | Select Data
            |--------------------------------------------------------------------------
            */

            ->select(

                // Application
                'applications.application_id',
                'applications.program',
                'applications.academic_year',

                // Applicant
                'applicant_profiles.applicant_number',
                'applicant_profiles.full_name',
                'applicant_profiles.contact_number',

                // User
                'users.email',

                // Examination
                'examination_results.result as exam_result',
                'examination_results.notification_sent_at as exam_email_sent_at',

                // Interview Schedule
                'interview_schedules.interview_id',
                'interview_schedules.interview_date',
                'interview_schedules.interview_time',
                'interview_schedules.venue as interview_venue',
                'interview_schedules.instructions as interview_instructions',

                // Interview Result
                DB::raw(
                    "COALESCE(
                        interview_results.result,
                        'Pending'
                    ) as interview_result"
                ),

                'interview_results.remarks as interview_remarks',
                'interview_results.decided_by as interview_decided_by',
                'interview_results.decided_at as interview_decided_at',
                'interview_results.notification_sent_at as interview_notification_sent_at'
            )

            /*
            |--------------------------------------------------------------------------
            | Ordering
            |--------------------------------------------------------------------------
            */

            ->orderBy(
                'interview_schedules.interview_date',
                'asc'
            )

            ->orderBy(
                'interview_schedules.interview_time',
                'asc'
            )

            ->get();


        /*
        |--------------------------------------------------------------------------
        | Return Page
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'Admin/Interviewees',
            [
                'interviewees' =>
                    $interviewees,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Mark Interview as Passed
    |--------------------------------------------------------------------------
    |
    | Passed applicants are automatically included in the Final List.
    | No separate final_list database table is required.
    |
    */

    public function pass(
        Request $request,
        $applicationId
    ) {
        $validated =
            $request->validate([
                'remarks' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Get Eligible Interviewee
        |--------------------------------------------------------------------------
        */

        $interviewee =
            $this->getEligibleInterviewee(
                $applicationId
            );


        if (!$interviewee) {

            return back()->with(
                'error',
                'The interviewee could not be found or is not eligible for interview evaluation.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Interview Must Already Be Finished
        |--------------------------------------------------------------------------
        */

        if (
            !$this->interviewHasFinished(
                $interviewee
            )
        ) {

            return back()->with(
                'error',
                'The interview has not finished yet. The result cannot be recorded.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Decision
        |--------------------------------------------------------------------------
        */

        $existingResult =
            DB::table(
                'interview_results'
            )

                ->where(
                    'application_id',
                    $applicationId
                )

                ->first();


        if (
            $existingResult &&
            in_array(
                $existingResult->result,
                [
                    'Passed',
                    'Failed',
                ],
                true
            )
        ) {

            return back()->with(
                'error',
                'An interview result has already been recorded for this applicant.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Save Passed Result
        |--------------------------------------------------------------------------
        */

        $now =
            Carbon::now(
                'Asia/Manila'
            );


        if ($existingResult) {

            DB::table(
                'interview_results'
            )

                ->where(
                    'id',
                    $existingResult->id
                )

                ->update([
                    'interview_id' =>
                        $interviewee->interview_id,

                    'result' =>
                        'Passed',

                    'remarks' =>
                        $validated['remarks'] ?? null,

                    'decided_by' =>
                        auth()->id(),

                    'decided_at' =>
                        $now,

                    /*
                    | Passed applicants do not need a failure-result email.
                    | The email address itself will be displayed in Final List.
                    */
                    'notification_sent_at' =>
                        null,

                    'updated_at' =>
                        $now,
                ]);

        } else {

            DB::table(
                'interview_results'
            )

                ->insert([
                    'application_id' =>
                        $interviewee->application_id,

                    'interview_id' =>
                        $interviewee->interview_id,

                    'result' =>
                        'Passed',

                    'remarks' =>
                        $validated['remarks'] ?? null,

                    'decided_by' =>
                        auth()->id(),

                    'decided_at' =>
                        $now,

                    'notification_sent_at' =>
                        null,

                    'created_at' =>
                        $now,

                    'updated_at' =>
                        $now,
                ]);
        }


        return back()->with(
            'success',
            $interviewee->full_name .
                ' has been marked as Passed and is now included in the Final List.'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Mark Interview as Failed
    |--------------------------------------------------------------------------
    |
    | The Failed result is saved first.
    |
    | After saving the result, the system attempts to send the applicant
    | an interview failure notification email.
    |
    | If email sending fails:
    | - the Failed result remains saved
    | - notification_sent_at remains NULL
    | - the admin can use Retry Email
    |
    */

    public function fail(
        Request $request,
        $applicationId
    ) {
        $validated =
            $request->validate([
                'remarks' => [
                    'nullable',
                    'string',
                    'max:5000',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Get Eligible Interviewee
        |--------------------------------------------------------------------------
        */

        $interviewee =
            $this->getEligibleInterviewee(
                $applicationId
            );


        if (!$interviewee) {

            return back()->with(
                'error',
                'The interviewee could not be found or is not eligible for interview evaluation.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Interview Must Already Be Finished
        |--------------------------------------------------------------------------
        */

        if (
            !$this->interviewHasFinished(
                $interviewee
            )
        ) {

            return back()->with(
                'error',
                'The interview has not finished yet. The result cannot be recorded.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Duplicate Decision
        |--------------------------------------------------------------------------
        */

        $existingResult =
            DB::table(
                'interview_results'
            )

                ->where(
                    'application_id',
                    $applicationId
                )

                ->first();


        if (
            $existingResult &&
            in_array(
                $existingResult->result,
                [
                    'Passed',
                    'Failed',
                ],
                true
            )
        ) {

            return back()->with(
                'error',
                'An interview result has already been recorded for this applicant.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Save Failed Result First
        |--------------------------------------------------------------------------
        */

        $now =
            Carbon::now(
                'Asia/Manila'
            );


        if ($existingResult) {

            DB::table(
                'interview_results'
            )

                ->where(
                    'id',
                    $existingResult->id
                )

                ->update([
                    'interview_id' =>
                        $interviewee->interview_id,

                    'result' =>
                        'Failed',

                    'remarks' =>
                        $validated['remarks'] ?? null,

                    'decided_by' =>
                        auth()->id(),

                    'decided_at' =>
                        $now,

                    /*
                    | Reset first. It will only be filled after a successful email.
                    */
                    'notification_sent_at' =>
                        null,

                    'updated_at' =>
                        $now,
                ]);

        } else {

            DB::table(
                'interview_results'
            )

                ->insert([
                    'application_id' =>
                        $interviewee->application_id,

                    'interview_id' =>
                        $interviewee->interview_id,

                    'result' =>
                        'Failed',

                    'remarks' =>
                        $validated['remarks'] ?? null,

                    'decided_by' =>
                        auth()->id(),

                    'decided_at' =>
                        $now,

                    'notification_sent_at' =>
                        null,

                    'created_at' =>
                        $now,

                    'updated_at' =>
                        $now,
                ]);
        }


        /*
        |--------------------------------------------------------------------------
        | Send Failure Email
        |--------------------------------------------------------------------------
        */

        try {

            Mail::to(
                $interviewee->email
            )->send(
                new InterviewFailedMail(
                    $interviewee
                )
            );


            /*
            |--------------------------------------------------------------------------
            | Record Successful Email
            |--------------------------------------------------------------------------
            */

            DB::table(
                'interview_results'
            )

                ->where(
                    'application_id',
                    $applicationId
                )

                ->update([
                    'notification_sent_at' =>
                        Carbon::now(
                            'Asia/Manila'
                        ),

                    'updated_at' =>
                        Carbon::now(
                            'Asia/Manila'
                        ),
                ]);


            return back()->with(
                'success',
                $interviewee->full_name .
                    ' has been marked as Failed and the interview result email was sent successfully.'
            );

        } catch (Throwable $exception) {

            report(
                $exception
            );


            /*
            |--------------------------------------------------------------------------
            | Important
            |--------------------------------------------------------------------------
            |
            | Do NOT remove the Failed result when email sending fails.
            |
            */

            return back()->with(
                'error',
                $interviewee->full_name .
                    ' was marked as Failed, but the email could not be sent. Use Retry Email to send it again.'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Retry Failed Interview Email
    |--------------------------------------------------------------------------
    */

    public function retryEmail(
        $applicationId
    ) {
        /*
        |--------------------------------------------------------------------------
        | Get Applicant and Stored Interview Result
        |--------------------------------------------------------------------------
        */

        $interviewee =
            DB::table(
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

                ->join(
                    'interview_schedules',
                    'applications.application_id',
                    '=',
                    'interview_schedules.application_id'
                )

                ->join(
                    'interview_results',
                    'applications.application_id',
                    '=',
                    'interview_results.application_id'
                )

                ->where(
                    'applications.application_id',
                    $applicationId
                )

                ->select(
                    'applications.application_id',
                    'applications.program',
                    'applications.academic_year',

                    'applicant_profiles.applicant_number',
                    'applicant_profiles.full_name',

                    'users.email',

                    'interview_schedules.interview_id',
                    'interview_schedules.interview_date',
                    'interview_schedules.interview_time',
                    'interview_schedules.venue as interview_venue',

                    'interview_results.result as interview_result',
                    'interview_results.notification_sent_at'
                )

                ->first();


        if (!$interviewee) {

            return back()->with(
                'error',
                'Interview result not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Retry Is Only For Failed Applicants
        |--------------------------------------------------------------------------
        */

        if (
            $interviewee->interview_result !==
            'Failed'
        ) {

            return back()->with(
                'error',
                'Retry Email is only available for applicants who failed the interview.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Email Was Already Sent
        |--------------------------------------------------------------------------
        */

        if (
            $interviewee->notification_sent_at
        ) {

            return back()->with(
                'success',
                'The interview result email has already been sent to this applicant.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Retry Email
        |--------------------------------------------------------------------------
        */

        try {

            Mail::to(
                $interviewee->email
            )->send(
                new InterviewFailedMail(
                    $interviewee
                )
            );


            $now =
                Carbon::now(
                    'Asia/Manila'
                );


            DB::table(
                'interview_results'
            )

                ->where(
                    'application_id',
                    $applicationId
                )

                ->update([
                    'notification_sent_at' =>
                        $now,

                    'updated_at' =>
                        $now,
                ]);


            return back()->with(
                'success',
                'The interview result email was sent successfully to ' .
                    $interviewee->full_name .
                    '.'
            );

        } catch (Throwable $exception) {

            report(
                $exception
            );


            return back()->with(
                'error',
                'The email could not be sent. Please check your mail configuration and try again.'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Final List
    |--------------------------------------------------------------------------
    |
    | Only applicants whose interview result is Passed are included.
    |
    | The applicant email comes from the users table.
    |
    */

    public function finalList()
    {
        $finalists =
            $this->finalListQuery()
                ->get();


        return Inertia::render(
            'Admin/FinalList',
            [
                'finalists' =>
                    $finalists,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Download Final List PDF
    |--------------------------------------------------------------------------
    |
    | Generates a PDF containing the names and email addresses of applicants
    | who passed the admission interview.
    |
    */

    public function downloadFinalListPdf()
    {
        $finalists =
            $this->finalListQuery()
                ->get();


        $generatedAt =
            Carbon::now(
                'Asia/Manila'
            );


        $pdf =
            Pdf::loadView(
                'admin.final-list-pdf',
                [
                    'finalists' =>
                        $finalists,

                    'generatedAt' =>
                        $generatedAt,
                ]
            )
                ->setPaper(
                    'a4',
                    'portrait'
                );


        $fileName =
            'usep-school-of-law-final-list-' .
            $generatedAt->format(
                'Y-m-d'
            ) .
            '.pdf';


        return $pdf->download(
            $fileName
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Final List Query
    |--------------------------------------------------------------------------
    |
    | Shared by:
    | - Final List page
    | - Final List PDF download
    |
    | This guarantees that the web page and downloaded PDF use the same
    | Passed-applicant criteria.
    |
    */

    private function finalListQuery()
    {
        return DB::table(
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

            ->join(
                'examination_results',
                'applications.application_id',
                '=',
                'examination_results.application_id'
            )

            ->join(
                'interview_schedules',
                'applications.application_id',
                '=',
                'interview_schedules.application_id'
            )

            ->join(
                'interview_results',
                'applications.application_id',
                '=',
                'interview_results.application_id'
            )

            /*
            |--------------------------------------------------------------------------
            | Must Have Passed Examination
            |--------------------------------------------------------------------------
            */

            ->where(
                'examination_results.result',
                'Passed'
            )

            ->whereNotNull(
                'examination_results.notification_sent_at'
            )

            /*
            |--------------------------------------------------------------------------
            | Must Have Passed Interview
            |--------------------------------------------------------------------------
            */

            ->where(
                'interview_results.result',
                'Passed'
            )

            /*
            |--------------------------------------------------------------------------
            | Select Final List Information
            |--------------------------------------------------------------------------
            */

            ->select(
                'applications.application_id',
                'applications.program',
                'applications.academic_year',

                'applicant_profiles.applicant_number',
                'applicant_profiles.full_name',
                'applicant_profiles.contact_number',

                'users.email',

                'interview_schedules.interview_date',
                'interview_schedules.interview_time',
                'interview_schedules.venue as interview_venue',

                'interview_results.result as interview_result',
                'interview_results.decided_at as interview_decided_at'
            )

            ->orderBy(
                'applications.academic_year',
                'desc'
            )

            ->orderBy(
                'applicant_profiles.full_name',
                'asc'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | Get Eligible Interviewee
    |--------------------------------------------------------------------------
    |
    | An applicant is eligible for interview evaluation only if:
    |
    | 1. Examination result is Passed
    | 2. Examination result email was successfully sent
    | 3. An interview schedule exists
    |
    */

    private function getEligibleInterviewee(
        $applicationId
    ) {
        return DB::table(
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

            ->join(
                'examination_results',
                'applications.application_id',
                '=',
                'examination_results.application_id'
            )

            ->join(
                'interview_schedules',
                'applications.application_id',
                '=',
                'interview_schedules.application_id'
            )

            ->where(
                'applications.application_id',
                $applicationId
            )

            ->where(
                'examination_results.result',
                'Passed'
            )

            ->whereNotNull(
                'examination_results.notification_sent_at'
            )

            ->select(
                'applications.application_id',
                'applications.program',
                'applications.academic_year',

                'applicant_profiles.applicant_number',
                'applicant_profiles.full_name',
                'applicant_profiles.contact_number',

                'users.email',

                'interview_schedules.interview_id',
                'interview_schedules.interview_date',
                'interview_schedules.interview_time',
                'interview_schedules.venue as interview_venue',
                'interview_schedules.instructions as interview_instructions'
            )

            ->first();
    }


    /*
    |--------------------------------------------------------------------------
    | Interview Finished Check
    |--------------------------------------------------------------------------
    */

    private function interviewHasFinished(
        $interviewee
    ) {
        if (
            !$interviewee->interview_date ||
            !$interviewee->interview_time
        ) {
            return false;
        }


        $interviewDateTime =
            Carbon::parse(
                $interviewee->interview_date .
                    ' ' .
                    $interviewee->interview_time,
                'Asia/Manila'
            );


        $currentDateTime =
            Carbon::now(
                'Asia/Manila'
            );


        return $interviewDateTime
            ->lessThanOrEqualTo(
                $currentDateTime
            );
    }
}

<?php

namespace App\Http\Controllers;

use App\Mail\ExamFailedMail;
use App\Mail\ExamPassedMail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Throwable;

class ExamineeController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Examinee List
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        /*
        |--------------------------------------------------------------------------
        | Base Query
        |--------------------------------------------------------------------------
        |
        | Only applications that already selected an examination schedule
        | are considered examinees.
        |
        */

        $query =
            DB::table('applications')

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
                    'examination_schedules',
                    'applications.schedule_id',
                    '=',
                    'examination_schedules.schedule_id'
                )

                ->leftJoin(
                    'examination_results',
                    'applications.application_id',
                    '=',
                    'examination_results.application_id'
                )

                ->leftJoin(
                    'interview_schedules',
                    'applications.application_id',
                    '=',
                    'interview_schedules.application_id'
                )

                ->whereNotNull(
                    'applications.schedule_id'
                );


        /*
        |--------------------------------------------------------------------------
        | Columns
        |--------------------------------------------------------------------------
        */

        $columns = [

            'applications.application_id',
            'applications.applicant_profile_id',
            'applications.program',
            'applications.application_status',
            'applications.schedule_id',
            'applications.submitted_at',

            'applicant_profiles.applicant_number',
            'applicant_profiles.full_name',

            'users.email',

            'examination_schedules.exam_date',
            'examination_schedules.exam_time',

            'examination_schedules.venue as exam_venue',

            'examination_schedules.status as schedule_status',

            DB::raw(
                "COALESCE(examination_results.result, 'Pending') as exam_result"
            ),

            'examination_results.remarks as result_remarks',
            'examination_results.decided_at',
            'examination_results.notification_sent_at',

            'interview_schedules.interview_id',
            'interview_schedules.interview_date',
            'interview_schedules.interview_time',

            'interview_schedules.venue as interview_venue',

            'interview_schedules.instructions as interview_instructions',
        ];


        /*
        |--------------------------------------------------------------------------
        | Academic Year
        |--------------------------------------------------------------------------
        |
        | This keeps the Examinees page compatible even if the academic_year
        | migration has not yet been run.
        |
        */

        if (
            Schema::hasColumn(
                'applications',
                'academic_year'
            )
        ) {
            $columns[] =
                'applications.academic_year';
        } else {
            $columns[] =
                DB::raw(
                    'NULL as academic_year'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Get Examinees
        |--------------------------------------------------------------------------
        */

        $examinees =
            $query
                ->select(
                    $columns
                )

                ->orderByDesc(
                    'examination_schedules.exam_date'
                )

                ->orderBy(
                    'examination_schedules.exam_time'
                )

                ->get();


        /*
        |--------------------------------------------------------------------------
        | Available Academic Years
        |--------------------------------------------------------------------------
        */

        $academicYears =
            $examinees
                ->pluck(
                    'academic_year'
                )
                ->filter()
                ->unique()
                ->sortDesc()
                ->values();


        return Inertia::render(
            'Admin/Examinees',
            [
                'examinees' =>
                    $examinees,

                'academicYears' =>
                    $academicYears,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Mark Examinee as Passed
    |--------------------------------------------------------------------------
    */

    public function pass(
        Request $request,
        $applicationId
    ) {
        /*
        |--------------------------------------------------------------------------
        | Validate Interview Details
        |--------------------------------------------------------------------------
        */

        $validated =
            $request->validate([
                'interview_date' => [
                    'required',
                    'date',
                    'after_or_equal:today',
                ],

                'interview_time' => [
                    'required',
                ],

                'venue' => [
                    'required',
                    'string',
                    'max:150',
                ],

                'instructions' => [
                    'nullable',
                    'string',
                    'max:3000',
                ],

                'remarks' => [
                    'nullable',
                    'string',
                    'max:2000',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Find Examinee
        |--------------------------------------------------------------------------
        */

        $examinee =
            $this->findExaminee(
                $applicationId
            );


        if (!$examinee) {
            abort(
                404,
                'Examinee not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Result Before Examination
        |--------------------------------------------------------------------------
        */

        if (
            !$this->examinationFinished(
                $examinee
            )
        ) {
            return back()->with(
                'error',
                'You cannot record an examination result before the scheduled examination date and time.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Interview Must Not Be Before Exam
        |--------------------------------------------------------------------------
        */

        $examDate =
            Carbon::parse(
                $examinee->exam_date
            )
                ->startOfDay();


        $interviewDate =
            Carbon::parse(
                $validated[
                    'interview_date'
                ]
            )
                ->startOfDay();


        if (
            $interviewDate->lt(
                $examDate
            )
        ) {
            return back()
                ->withErrors([
                    'interview_date' =>
                        'The interview cannot be scheduled before the examination date.',
                ])
                ->withInput();
        }


        /*
        |--------------------------------------------------------------------------
        | Save Result + Interview
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $applicationId,
                $examinee,
                $validated
            ) {

                /*
                |--------------------------------------------------------------------------
                | Examination Result
                |--------------------------------------------------------------------------
                */

                $existingResult =
                    DB::table(
                        'examination_results'
                    )

                        ->where(
                            'application_id',
                            $applicationId
                        )

                        ->first();


                $resultData = [

                    'schedule_id' =>
                        $examinee->schedule_id,

                    'result' =>
                        'Passed',

                    'remarks' =>
                        $validated[
                            'remarks'
                        ] ?? null,

                    'decided_by' =>
                        auth()->id(),

                    'decided_at' =>
                        now(),

                    /*
                    |--------------------------------------------------------------------------
                    | Reset Until New Email Successfully Sends
                    |--------------------------------------------------------------------------
                    */

                    'notification_sent_at' =>
                        null,

                    'updated_at' =>
                        now(),
                ];


                if ($existingResult) {

                    DB::table(
                        'examination_results'
                    )

                        ->where(
                            'application_id',
                            $applicationId
                        )

                        ->update(
                            $resultData
                        );

                } else {

                    $resultData[
                        'application_id'
                    ] =
                        $applicationId;

                    $resultData[
                        'created_at'
                    ] =
                        now();


                    DB::table(
                        'examination_results'
                    )
                        ->insert(
                            $resultData
                        );
                }


                /*
                |--------------------------------------------------------------------------
                | Interview Schedule
                |--------------------------------------------------------------------------
                */

                $existingInterview =
                    DB::table(
                        'interview_schedules'
                    )

                        ->where(
                            'application_id',
                            $applicationId
                        )

                        ->first();


                $interviewData = [

                    'admin_id' =>
                        auth()->id(),

                    'interview_date' =>
                        $validated[
                            'interview_date'
                        ],

                    'interview_time' =>
                        $validated[
                            'interview_time'
                        ],

                    'venue' =>
                        $validated[
                            'venue'
                        ],

                    'instructions' =>
                        $validated[
                            'instructions'
                        ] ?? null,

                    'updated_at' =>
                        now(),
                ];


                if ($existingInterview) {

                    DB::table(
                        'interview_schedules'
                    )

                        ->where(
                            'application_id',
                            $applicationId
                        )

                        ->update(
                            $interviewData
                        );

                } else {

                    $interviewData[
                        'application_id'
                    ] =
                        $applicationId;

                    $interviewData[
                        'created_at'
                    ] =
                        now();


                    DB::table(
                        'interview_schedules'
                    )
                        ->insert(
                            $interviewData
                        );
                }
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Send Passed Email
        |--------------------------------------------------------------------------
        */

        try {

            Mail::to(
                $examinee->email
            )->send(
                new ExamPassedMail(
                    $examinee->full_name,
                    $validated[
                        'interview_date'
                    ],
                    $validated[
                        'interview_time'
                    ],
                    $validated[
                        'venue'
                    ],
                    $validated[
                        'instructions'
                    ] ?? null
                )
            );


            /*
            |--------------------------------------------------------------------------
            | Record Successful Notification
            |--------------------------------------------------------------------------
            */

            DB::table(
                'examination_results'
            )

                ->where(
                    'application_id',
                    $applicationId
                )

                ->update([
                    'notification_sent_at' =>
                        now(),

                    'updated_at' =>
                        now(),
                ]);


            return back()->with(
                'success',
                'The examinee was marked as Passed and the interview notification email was sent successfully.'
            );

        } catch (Throwable $exception) {

            report(
                $exception
            );


            /*
            |--------------------------------------------------------------------------
            | Result Is Still Saved
            |--------------------------------------------------------------------------
            */

            return back()->with(
                'warning',
                'The examinee was marked as Passed and the interview was saved, but the email could not be sent. Check your mail configuration and try again.'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Mark Examinee as Failed
    |--------------------------------------------------------------------------
    */

    public function fail(
        Request $request,
        $applicationId
    ) {
        /*
        |--------------------------------------------------------------------------
        | Validate
        |--------------------------------------------------------------------------
        */

        $validated =
            $request->validate([
                'remarks' => [
                    'nullable',
                    'string',
                    'max:2000',
                ],
            ]);


        /*
        |--------------------------------------------------------------------------
        | Find Examinee
        |--------------------------------------------------------------------------
        */

        $examinee =
            $this->findExaminee(
                $applicationId
            );


        if (!$examinee) {
            abort(
                404,
                'Examinee not found.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Prevent Result Before Exam
        |--------------------------------------------------------------------------
        */

        if (
            !$this->examinationFinished(
                $examinee
            )
        ) {
            return back()->with(
                'error',
                'You cannot record an examination result before the scheduled examination date and time.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Save Failed Result
        |--------------------------------------------------------------------------
        */

        DB::transaction(
            function () use (
                $applicationId,
                $examinee,
                $validated
            ) {

                $existingResult =
                    DB::table(
                        'examination_results'
                    )

                        ->where(
                            'application_id',
                            $applicationId
                        )

                        ->first();


                $resultData = [

                    'schedule_id' =>
                        $examinee->schedule_id,

                    'result' =>
                        'Failed',

                    'remarks' =>
                        $validated[
                            'remarks'
                        ] ?? null,

                    'decided_by' =>
                        auth()->id(),

                    'decided_at' =>
                        now(),

                    'notification_sent_at' =>
                        null,

                    'updated_at' =>
                        now(),
                ];


                if ($existingResult) {

                    DB::table(
                        'examination_results'
                    )

                        ->where(
                            'application_id',
                            $applicationId
                        )

                        ->update(
                            $resultData
                        );

                } else {

                    $resultData[
                        'application_id'
                    ] =
                        $applicationId;

                    $resultData[
                        'created_at'
                    ] =
                        now();


                    DB::table(
                        'examination_results'
                    )
                        ->insert(
                            $resultData
                        );
                }


                /*
                |--------------------------------------------------------------------------
                | Remove Interview If Result Was Changed From Passed → Failed
                |--------------------------------------------------------------------------
                */

                DB::table(
                    'interview_schedules'
                )

                    ->where(
                        'application_id',
                        $applicationId
                    )

                    ->delete();
            }
        );


        /*
        |--------------------------------------------------------------------------
        | Send Failed Email
        |--------------------------------------------------------------------------
        */

        try {

            Mail::to(
                $examinee->email
            )->send(
                new ExamFailedMail(
                    $examinee->full_name
                )
            );


            DB::table(
                'examination_results'
            )

                ->where(
                    'application_id',
                    $applicationId
                )

                ->update([
                    'notification_sent_at' =>
                        now(),

                    'updated_at' =>
                        now(),
                ]);


            return back()->with(
                'success',
                'The examinee was marked as Failed and the result notification email was sent successfully.'
            );

        } catch (Throwable $exception) {

            report(
                $exception
            );


            return back()->with(
                'warning',
                'The examinee was marked as Failed, but the email could not be sent. Check your mail configuration and try again.'
            );
        }
    }


    /*
    |--------------------------------------------------------------------------
    | Find Examinee
    |--------------------------------------------------------------------------
    */

    private function findExaminee(
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
                'examination_schedules',
                'applications.schedule_id',
                '=',
                'examination_schedules.schedule_id'
            )

            ->where(
                'applications.application_id',
                $applicationId
            )

            ->whereNotNull(
                'applications.schedule_id'
            )

            ->select(

                'applications.application_id',
                'applications.schedule_id',

                'applicant_profiles.full_name',
                'applicant_profiles.applicant_number',

                'users.email',

                'examination_schedules.exam_date',
                'examination_schedules.exam_time',
                'examination_schedules.venue as exam_venue',
                'examination_schedules.status as schedule_status'
            )

            ->first();
    }


    /*
    |--------------------------------------------------------------------------
    | Check Whether Exam Has Finished
    |--------------------------------------------------------------------------
    */

    private function examinationFinished(
        $examinee
    ): bool {
        /*
        |--------------------------------------------------------------------------
        | Admin May Explicitly Mark Schedule Completed
        |--------------------------------------------------------------------------
        */

        if (
            $examinee->schedule_status ===
            'Completed'
        ) {
            return true;
        }


        /*
        |--------------------------------------------------------------------------
        | Otherwise Check Scheduled Date + Time
        |--------------------------------------------------------------------------
        */

        $examDateTime =
            Carbon::parse(
                $examinee->exam_date .
                ' ' .
                $examinee->exam_time
            );


        return $examDateTime
            ->lessThanOrEqualTo(
                now()
            );
    }
}
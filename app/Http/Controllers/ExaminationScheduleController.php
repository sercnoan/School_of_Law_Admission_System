<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ExaminationScheduleController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Keep Examination Schedule Statuses Current
    |--------------------------------------------------------------------------
    |
    | Examination schedules use only two statuses:
    | - Open   = still available / upcoming
    | - Closed = manually closed or the examination date and time has passed
    |
    | This also converts any old "Completed" records to "Closed".
    |
    */

    private function syncScheduleStatuses(): void
    {
        $now = Carbon::now(
            'Asia/Manila'
        );

        /*
        |--------------------------------------------------------------------------
        | Convert Legacy Completed Statuses To Closed
        |--------------------------------------------------------------------------
        */

        DB::table(
            'examination_schedules'
        )
            ->where(
                'status',
                'Completed'
            )
            ->update([
                'status' =>
                    'Closed',

                'updated_at' =>
                    now(),
            ]);


        /*
        |--------------------------------------------------------------------------
        | Automatically Close Past Examination Schedules
        |--------------------------------------------------------------------------
        */

        DB::table(
            'examination_schedules'
        )
            ->where(
                'status',
                'Open'
            )
            ->where(
                function ($query) use ($now) {

                    $query
                        ->whereDate(
                            'exam_date',
                            '<',
                            $now->toDateString()
                        )
                        ->orWhere(
                            function ($query) use ($now) {

                                $query
                                    ->whereDate(
                                        'exam_date',
                                        $now->toDateString()
                                    )
                                    ->whereTime(
                                        'exam_time',
                                        '<=',
                                        $now->format(
                                            'H:i:s'
                                        )
                                    );
                            }
                        );
                }
            )
            ->update([
                'status' =>
                    'Closed',

                'updated_at' =>
                    now(),
            ]);
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN
    | Display Examination Schedules
    |--------------------------------------------------------------------------
    */

    public function index()
    {
        $this->syncScheduleStatuses();

        /*
        |--------------------------------------------------------------------------
        | Get Examination Schedules
        |--------------------------------------------------------------------------
        */

        $schedules = DB::table('examination_schedules')
            ->orderBy('exam_date', 'asc')
            ->orderBy('exam_time', 'asc')
            ->get();


        /*
        |--------------------------------------------------------------------------
        | Get Applicants Assigned To Each Schedule
        |--------------------------------------------------------------------------
        */

        $schedules = $schedules->map(function ($schedule) {

            $applicants = DB::table('applications')
                ->join(
                    'applicant_profiles',
                    'applications.applicant_profile_id',
                    '=',
                    'applicant_profiles.id'
                )
                ->where(
                    'applications.schedule_id',
                    $schedule->schedule_id
                )
                ->select([

                    'applications.application_id',

                    'applications.applicant_profile_id',

                    'applications.program',

                    'applications.application_status',

                    'applicant_profiles.applicant_number',

                    'applicant_profiles.full_name',

                ])
                ->orderBy(
                    'applicant_profiles.full_name',
                    'asc'
                )
                ->get();


            /*
            |--------------------------------------------------------------------------
            | Attach Applicants To Schedule
            |--------------------------------------------------------------------------
            */

            $schedule->applicants = $applicants;

            /*
            |--------------------------------------------------------------------------
            | Number Of Applicants Scheduled
            |--------------------------------------------------------------------------
            */

            $schedule->scheduled_applicants =
                $applicants->count();


            return $schedule;
        });


        /*
        |--------------------------------------------------------------------------
        | Return Examination Schedule Page
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'Admin/ExaminationSchedules',
            [
                'schedules' => $schedules,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN
    | Create Schedule Page
    |--------------------------------------------------------------------------
    */

    public function create()
    {
        return Inertia::render(
            'Admin/CreateExaminationSchedule'
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN
    | Store Examination Schedule
    |--------------------------------------------------------------------------
    */

    public function store(Request $request)
    {
        $validated = $request->validate([

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

        ]);


        /*
        |--------------------------------------------------------------------------
        | Get Logged-in User
        |--------------------------------------------------------------------------
        */

        $user = auth()->user();


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
        | Make Sure User Is Admin
        |--------------------------------------------------------------------------
        */

        if ($user->role !== 'admin') {

            abort(
                403,
                'You are not authorized to create examination schedules.'
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Check Duplicate Schedule
        |--------------------------------------------------------------------------
        */

        $existingSchedule = DB::table(
            'examination_schedules'
        )
            ->where(
                'exam_date',
                $validated['exam_date']
            )
            ->where(
                'exam_time',
                $validated['exam_time']
            )
            ->where(
                'venue',
                $validated['venue']
            )
            ->first();


        if ($existingSchedule) {

            return back()
                ->withInput()
                ->with(
                    'error',
                    'An examination schedule already exists for this date, time, and venue.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Available Slots
        |--------------------------------------------------------------------------
        */

        $availableSlots =
            (int) $validated['max_applicants'];


        /*
        |--------------------------------------------------------------------------
        | Create Schedule
        |--------------------------------------------------------------------------
        */

        DB::table(
            'examination_schedules'
        )->insert([

            'admin_id' =>
                $user->id,

            'exam_date' =>
                $validated['exam_date'],

            'exam_time' =>
                $validated['exam_time'],

            'venue' =>
                $validated['venue'],

            'max_applicants' =>
                $validated['max_applicants'],

            'available_slots' =>
                $availableSlots,

            'instructions' =>
                $validated['instructions'] ?? null,

            'notes' =>
                $validated['notes'] ?? null,

            'status' =>
                'Open',

            'created_at' =>
                now(),

            'updated_at' =>
                now(),

        ]);


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
    | ADMIN
    | Edit Schedule
    |--------------------------------------------------------------------------
    */

    public function edit($scheduleId)
    {
        $this->syncScheduleStatuses();

        $schedule = DB::table(
            'examination_schedules'
        )
            ->where(
                'schedule_id',
                $scheduleId
            )
            ->first();


        if (!$schedule) {

            return redirect()
                ->route(
                    'admin.examination.schedules'
                )
                ->with(
                    'error',
                    'Examination schedule not found.'
                );
        }


        return Inertia::render(
            'Admin/EditExaminationSchedule',
            [
                'schedule' => $schedule,
            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN
    | Update Schedule
    |--------------------------------------------------------------------------
    */

    public function update(
        Request $request,
        $scheduleId
    ) {
        $this->syncScheduleStatuses();

        $validated = $request->validate([

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
                'in:Open,Closed',
            ],

        ]);


        /*
        |--------------------------------------------------------------------------
        | Get Existing Schedule
        |--------------------------------------------------------------------------
        */

        $schedule = DB::table(
            'examination_schedules'
        )
            ->where(
                'schedule_id',
                $scheduleId
            )
            ->first();


        if (!$schedule) {

            return redirect()
                ->route(
                    'admin.examination.schedules'
                )
                ->with(
                    'error',
                    'Examination schedule not found.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Calculate Already Booked Applicants
        |--------------------------------------------------------------------------
        */

        $bookedApplicants =
            (int) $schedule->max_applicants -
            (int) $schedule->available_slots;


        /*
        |--------------------------------------------------------------------------
        | Calculate New Available Slots
        |--------------------------------------------------------------------------
        */

        $newAvailableSlots =
            (int) $validated['max_applicants'] -
            $bookedApplicants;


        /*
        |--------------------------------------------------------------------------
        | Prevent Invalid Capacity
        |--------------------------------------------------------------------------
        */

        if ($newAvailableSlots < 0) {

            return back()
                ->withInput()
                ->with(
                    'error',
                    'The maximum number of applicants cannot be lower than the number of applicants already booked.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Update Schedule
        |--------------------------------------------------------------------------
        */

        DB::table(
            'examination_schedules'
        )
            ->where(
                'schedule_id',
                $scheduleId
            )
            ->update([

                'exam_date' =>
                    $validated['exam_date'],

                'exam_time' =>
                    $validated['exam_time'],

                'venue' =>
                    $validated['venue'],

                'max_applicants' =>
                    $validated['max_applicants'],

                'available_slots' =>
                    $newAvailableSlots,

                'instructions' =>
                    $validated['instructions'] ?? null,

                'notes' =>
                    $validated['notes'] ?? null,

                'status' =>
                    $validated['status'],

                'updated_at' =>
                    now(),

            ]);


        return redirect()
            ->route(
                'admin.examination.schedules'
            )
            ->with(
                'success',
                'Examination schedule updated successfully.'
            );
    }


    /*
    |--------------------------------------------------------------------------
    | ADMIN
    | Delete Schedule
    |--------------------------------------------------------------------------
    */

    public function destroy($scheduleId)
    {
        $this->syncScheduleStatuses();

        $schedule = DB::table(
            'examination_schedules'
        )
            ->where(
                'schedule_id',
                $scheduleId
            )
            ->first();


        if (!$schedule) {

            return redirect()
                ->route(
                    'admin.examination.schedules'
                )
                ->with(
                    'error',
                    'Examination schedule not found.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Check If Applicants Are Already Scheduled
        |--------------------------------------------------------------------------
        */

        $applicantCount = DB::table('applications')
            ->where(
                'schedule_id',
                $scheduleId
            )
            ->count();


        if ($applicantCount > 0) {

            return back()
                ->with(
                    'error',
                    'This examination schedule cannot be deleted because applicants are already assigned to it.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Delete Schedule
        |--------------------------------------------------------------------------
        */

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
    | APPLICANT
    | Display Available Examination Schedules
    |--------------------------------------------------------------------------
    */

    public function applicantIndex()
    {
        $this->syncScheduleStatuses();

        $user = auth()->user();


        /*
        |--------------------------------------------------------------------------
        | Get Applicant Profile
        |--------------------------------------------------------------------------
        */

        $profile = $user->applicantProfile;


        if (!$profile) {

            return Inertia::render(
                'Applicant/Examination',
                [
                    'application' => null,
                    'schedules' => [],
                    'message' =>
                        'Please complete your personal information first.',
                    'messageType' =>
                        'warning',
                ]
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Get Application
        |--------------------------------------------------------------------------
        */

        $application = DB::table(
            'applications'
        )
            ->where(
                'applicant_profile_id',
                $profile->id
            )
            ->first();


        if (!$application) {

            return Inertia::render(
                'Applicant/Examination',
                [
                    'application' => null,
                    'schedules' => [],
                    'message' =>
                        'Please choose your program and complete your application first.',
                    'messageType' =>
                        'warning',
                ]
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Check Application Status
        |--------------------------------------------------------------------------
        */

        if (
            $application->application_status !==
            'Approved'
        ) {

            return Inertia::render(
                'Applicant/Examination',
                [
                    'application' =>
                        $application,

                    'schedules' =>
                        [],

                    'message' =>
                        'Your application must be approved before you can select an examination schedule.',

                    'messageType' =>
                        'warning',
                ]
            );
        }


        /*
        |--------------------------------------------------------------------------
        | Get Current Selected Schedule
        |--------------------------------------------------------------------------
        */

        $selectedSchedule = null;


        if ($application->schedule_id) {

            $selectedSchedule = DB::table(
                'examination_schedules'
            )
                ->where(
                    'schedule_id',
                    $application->schedule_id
                )
                ->first();
        }


        /*
        |--------------------------------------------------------------------------
        | Get Available Schedules
        |--------------------------------------------------------------------------
        */

        /*
        |--------------------------------------------------------------------------
        | Current Date And Time
        |--------------------------------------------------------------------------
        |
        | Examination schedules are interpreted using Philippine local time.
        |
        */

        $now = Carbon::now(
            'Asia/Manila'
        );


        $schedules = DB::table(
            'examination_schedules'
        )
            ->where(
                'status',
                'Open'
            )
            ->where(
                'available_slots',
                '>',
                0
            )
            ->where(
                function ($query) use ($now) {

                    $query
                        ->whereDate(
                            'exam_date',
                            '>',
                            $now->toDateString()
                        )
                        ->orWhere(
                            function ($query) use ($now) {

                                $query
                                    ->whereDate(
                                        'exam_date',
                                        $now->toDateString()
                                    )
                                    ->whereTime(
                                        'exam_time',
                                        '>',
                                        $now->format(
                                            'H:i:s'
                                        )
                                    );
                            }
                        );
                }
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


        /*
        |--------------------------------------------------------------------------
        | Return Examination Page
        |--------------------------------------------------------------------------
        */

        return Inertia::render(
            'Applicant/Examination',
            [

                'application' =>
                    $application,

                'schedules' =>
                    $schedules,

                'selectedSchedule' =>
                    $selectedSchedule,

                'message' =>
                    null,

                'messageType' =>
                    null,

            ]
        );
    }


    /*
    |--------------------------------------------------------------------------
    | APPLICANT
    | Select Examination Schedule
    |--------------------------------------------------------------------------
    */

    public function applicantSelect(
        Request $request,
        $scheduleId
    ) {
        $this->syncScheduleStatuses();

        $user = auth()->user();


        /*
        |--------------------------------------------------------------------------
        | Get Applicant Profile
        |--------------------------------------------------------------------------
        */

        $profile = $user->applicantProfile;


        if (!$profile) {

            return back()
                ->with(
                    'error',
                    'Please complete your personal information first.'
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Database Transaction
        |--------------------------------------------------------------------------
        */

        try {

            DB::transaction(function () use (
                $profile,
                $scheduleId
            ) {

                /*
                |--------------------------------------------------------------------------
                | Lock Application
                |--------------------------------------------------------------------------
                */

                $application = DB::table(
                    'applications'
                )
                    ->where(
                        'applicant_profile_id',
                        $profile->id
                    )
                    ->lockForUpdate()
                    ->first();


                if (!$application) {

                    abort(
                        404,
                        'Application not found.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Application Must Be Approved
                |--------------------------------------------------------------------------
                */

                if (
                    $application->application_status !==
                    'Approved'
                ) {

                    abort(
                        403,
                        'Your application has not been approved.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Prevent Multiple Schedule Selection
                |--------------------------------------------------------------------------
                */

                if ($application->schedule_id) {

                    abort(
                        409,
                        'You already have an examination schedule.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Lock Schedule
                |--------------------------------------------------------------------------
                */

                $schedule = DB::table(
                    'examination_schedules'
                )
                    ->where(
                        'schedule_id',
                        $scheduleId
                    )
                    ->lockForUpdate()
                    ->first();


                if (!$schedule) {

                    abort(
                        404,
                        'Examination schedule not found.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Check Schedule Status
                |--------------------------------------------------------------------------
                */

                if (
                    $schedule->status !==
                    'Open'
                ) {

                    abort(
                        409,
                        'This examination schedule is no longer open.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Check Available Slots
                |--------------------------------------------------------------------------
                */

                if (
                    (int) $schedule->available_slots <=
                    0
                ) {

                    abort(
                        409,
                        'This examination schedule is already full.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Prevent Selecting A Past Examination Schedule
                |--------------------------------------------------------------------------
                */

                $examDateTime = Carbon::parse(
                    $schedule->exam_date .
                    ' ' .
                    $schedule->exam_time,
                    'Asia/Manila'
                );


                $currentDateTime = Carbon::now(
                    'Asia/Manila'
                );


                if (
                    $examDateTime->lessThanOrEqualTo(
                        $currentDateTime
                    )
                ) {

                    abort(
                        409,
                        'This examination schedule has already passed. Please select another available schedule.'
                    );
                }


                /*
                |--------------------------------------------------------------------------
                | Assign Schedule To Application
                |--------------------------------------------------------------------------
                */

                DB::table(
                    'applications'
                )
                    ->where(
                        'application_id',
                        $application->application_id
                    )
                    ->update([

                        'schedule_id' =>
                            $schedule->schedule_id,

                        'updated_at' =>
                            now(),

                    ]);


                /*
                |--------------------------------------------------------------------------
                | Decrease Available Slots
                |--------------------------------------------------------------------------
                */

                DB::table(
                    'examination_schedules'
                )
                    ->where(
                        'schedule_id',
                        $schedule->schedule_id
                    )
                    ->update([

                        'available_slots' =>
                            (int) $schedule->available_slots - 1,

                        'updated_at' =>
                            now(),

                    ]);

            });


        } catch (
            \Symfony\Component\HttpKernel\Exception\HttpException $exception
        ) {

            return back()
                ->with(
                    'error',
                    $exception->getMessage()
                );
        }


        /*
        |--------------------------------------------------------------------------
        | Success
        |--------------------------------------------------------------------------
        */

        return redirect()
            ->route(
                'applicant.examination'
            )
            ->with(
                'success',
                'Your examination schedule has been selected successfully.'
            );
    }
}
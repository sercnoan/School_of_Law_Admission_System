<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ApplicantProfileController;
use App\Http\Controllers\ApplicantProgramController;
use App\Http\Controllers\ApplicantRequirementController;
use App\Http\Controllers\ApplicantStatusController;
use App\Http\Controllers\ExaminationScheduleController;
use App\Http\Controllers\ExamineeController;
use App\Http\Controllers\IntervieweeController;


/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth',
    'verified'
])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Main Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/dashboard',
        function () {

            if (
                auth()->user()->role ===
                'admin'
            ) {
                return redirect()
                    ->route(
                        'admin.dashboard'
                    );
            }

            return redirect()
                ->route(
                    'applicant.dashboard'
                );
        }
    )->name(
        'dashboard'
    );


    /*
    |--------------------------------------------------------------------------
    | Applicant Dashboard
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/applicant/dashboard',
        function () {

            return Inertia::render(
                'Applicant/Dashboard'
            );
        }
    )->name(
        'applicant.dashboard'
    );


    /*
    |--------------------------------------------------------------------------
    | Applicant Personal Details
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/personal-details',
        [
            ApplicantProfileController::class,
            'create'
        ]
    )->name(
        'personal.details'
    );


    Route::post(
        '/personal-details',
        [
            ApplicantProfileController::class,
            'store'
        ]
    )->name(
        'personal.details.store'
    );


    /*
    |--------------------------------------------------------------------------
    | Applicant Program
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/applicant/program',
        [
            ApplicantProgramController::class,
            'index'
        ]
    )->name(
        'applicant.program'
    );


    Route::post(
        '/applicant/program',
        [
            ApplicantProgramController::class,
            'store'
        ]
    )->name(
        'applicant.program.store'
    );


    /*
    |--------------------------------------------------------------------------
    | Applicant Requirements
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/applicant/requirements',
        [
            ApplicantRequirementController::class,
            'index'
        ]
    )->name(
        'applicant.requirements'
    );


    /*
    |--------------------------------------------------------------------------
    | Upload / Replace Requirement
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/applicant/requirements/{requirementId}/upload',
        [
            ApplicantRequirementController::class,
            'upload'
        ]
    )->name(
        'applicant.requirements.upload'
    );


    /*
    |--------------------------------------------------------------------------
    | Submit Application
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/applicant/requirements/submit',
        [
            ApplicantRequirementController::class,
            'submit'
        ]
    )->name(
        'applicant.requirements.submit'
    );


    /*
    |--------------------------------------------------------------------------
    | Applicant Examination
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/applicant/examination',
        [
            ExaminationScheduleController::class,
            'applicantIndex'
        ]
    )->name(
        'applicant.examination'
    );


    /*
    |--------------------------------------------------------------------------
    | Select Examination Schedule
    |--------------------------------------------------------------------------
    */

    Route::post(
        '/applicant/examination/{scheduleId}/select',
        [
            ExaminationScheduleController::class,
            'applicantSelect'
        ]
    )->name(
        'applicant.examination.select'
    );


    /*
    |--------------------------------------------------------------------------
    | Applicant Application Status
    |--------------------------------------------------------------------------
    */

    Route::get(
        '/applicant/status',
        [
            ApplicantStatusController::class,
            'index'
        ]
    )->name(
        'applicant.status'
    );


    /*
    |--------------------------------------------------------------------------
    | Admin Routes
    |--------------------------------------------------------------------------
    */

    Route::middleware([
        'admin'
    ])
        ->prefix('admin')
        ->group(function () {


            /*
            |--------------------------------------------------------------------------
            | Admin Dashboard
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/dashboard',
                [
                    AdminController::class,
                    'dashboard'
                ]
            )->name(
                'admin.dashboard'
            );


            /*
            |--------------------------------------------------------------------------
            | Applications
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/applications',
                [
                    AdminController::class,
                    'applications'
                ]
            )->name(
                'admin.applications'
            );


            /*
            |--------------------------------------------------------------------------
            | Application Details
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/applications/{applicationId}',
                [
                    AdminController::class,
                    'applicationDetails'
                ]
            )->name(
                'admin.application.details'
            );


            /*
            |--------------------------------------------------------------------------
            | Download Applicant Requirement
            |--------------------------------------------------------------------------
            |
            | URL:
            |
            | /admin/requirements/{submissionId}/download
            |
            */

            Route::get(
                '/requirements/{submissionId}/download',
                [
                    AdminController::class,
                    'downloadRequirement'
                ]
            )->name(
                'admin.requirement.download'
            );


            /*
            |--------------------------------------------------------------------------
            | Update Overall Application Status
            |--------------------------------------------------------------------------
            */

            Route::post(
                '/applications/{applicationId}/status',
                [
                    AdminController::class,
                    'updateApplicationStatus'
                ]
            )->name(
                'admin.application.status'
            );


            /*
            |--------------------------------------------------------------------------
            | Verify Individual Requirement
            |--------------------------------------------------------------------------
            */

            Route::post(
                '/applications/{applicationId}/requirements/{submissionId}/verify',
                [
                    AdminController::class,
                    'verifyRequirement'
                ]
            )->name(
                'admin.requirement.verify'
            );


            /*
            |--------------------------------------------------------------------------
            | Examinees
            |--------------------------------------------------------------------------
            |
            | Displays every applicant who has selected an examination
            | schedule.
            |
            */

            Route::get(
                '/examinees',
                [
                    ExamineeController::class,
                    'index'
                ]
            )->name(
                'admin.examinees'
            );


            /*
            |--------------------------------------------------------------------------
            | Mark Examinee as Passed
            |--------------------------------------------------------------------------
            |
            | Saves:
            | - Passed result
            | - Interview date
            | - Interview time
            | - Interview venue
            | - Interview instructions
            |
            | It will also send the Passed email.
            |
            */

            Route::post(
                '/examinees/{applicationId}/pass',
                [
                    ExamineeController::class,
                    'pass'
                ]
            )->name(
                'admin.examinees.pass'
            );


            /*
            |--------------------------------------------------------------------------
            | Mark Examinee as Failed
            |--------------------------------------------------------------------------
            |
            | Saves the Failed result and sends the Failed notification email.
            |
            */

            Route::post(
                '/examinees/{applicationId}/fail',
                [
                    ExamineeController::class,
                    'fail'
                ]
            )->name(
                'admin.examinees.fail'
            );


            /*
            |--------------------------------------------------------------------------
            | Interviewees
            |--------------------------------------------------------------------------
            |
            | Displays applicants who:
            | - Passed the examination
            | - Have an interview schedule
            | - Successfully received the interview schedule email
            |
            */

            Route::get(
                '/interviewees',
                [
                    IntervieweeController::class,
                    'index'
                ]
            )->name(
                'admin.interviewees'
            );


            /*
            |--------------------------------------------------------------------------
            | Mark Interviewee as Passed
            |--------------------------------------------------------------------------
            */

            Route::post(
                '/interviewees/{applicationId}/pass',
                [
                    IntervieweeController::class,
                    'pass'
                ]
            )->name(
                'admin.interviewees.pass'
            );


            /*
            |--------------------------------------------------------------------------
            | Mark Interviewee as Failed
            |--------------------------------------------------------------------------
            */

            Route::post(
                '/interviewees/{applicationId}/fail',
                [
                    IntervieweeController::class,
                    'fail'
                ]
            )->name(
                'admin.interviewees.fail'
            );


            /*
            |--------------------------------------------------------------------------
            | Retry Failed Interview Email
            |--------------------------------------------------------------------------
            */

            Route::post(
                '/interviewees/{applicationId}/retry-email',
                [
                    IntervieweeController::class,
                    'retryEmail'
                ]
            )->name(
                'admin.interviewees.retry-email'
            );


            /*
            |--------------------------------------------------------------------------
            | Final List
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/final-list',
                [
                    IntervieweeController::class,
                    'finalList'
                ]
            )->name(
                'admin.final-list'
            );


            /*
            |--------------------------------------------------------------------------
            | Download Final List PDF
            |--------------------------------------------------------------------------
            |
            | Downloads a PDF containing the names and email addresses
            | of applicants who passed the admission interview.
            |
            */

            Route::get(
                '/final-list/pdf',
                [
                    IntervieweeController::class,
                    'downloadFinalListPdf'
                ]
            )->name(
                'admin.final-list.pdf'
            );


            /*
            |--------------------------------------------------------------------------
            | Examination Schedules
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/examination-schedules',
                [
                    ExaminationScheduleController::class,
                    'index'
                ]
            )->name(
                'admin.examination.schedules'
            );


            /*
            |--------------------------------------------------------------------------
            | Create Examination Schedule
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/examination-schedules/create',
                [
                    ExaminationScheduleController::class,
                    'create'
                ]
            )->name(
                'admin.examination.schedules.create'
            );


            /*
            |--------------------------------------------------------------------------
            | Store Examination Schedule
            |--------------------------------------------------------------------------
            */

            Route::post(
                '/examination-schedules',
                [
                    ExaminationScheduleController::class,
                    'store'
                ]
            )->name(
                'admin.examination.schedules.store'
            );


            /*
            |--------------------------------------------------------------------------
            | Edit Examination Schedule
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/examination-schedules/{scheduleId}/edit',
                [
                    ExaminationScheduleController::class,
                    'edit'
                ]
            )->name(
                'admin.examination.schedules.edit'
            );


            /*
            |--------------------------------------------------------------------------
            | Update Examination Schedule
            |--------------------------------------------------------------------------
            */

            Route::put(
                '/examination-schedules/{scheduleId}',
                [
                    ExaminationScheduleController::class,
                    'update'
                ]
            )->name(
                'admin.examination.schedules.update'
            );


            /*
            |--------------------------------------------------------------------------
            | Delete Examination Schedule
            |--------------------------------------------------------------------------
            */

            Route::delete(
                '/examination-schedules/{scheduleId}',
                [
                    ExaminationScheduleController::class,
                    'destroy'
                ]
            )->name(
                'admin.examination.schedules.destroy'
            );

        });

});


/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/

require __DIR__.'/settings.php';
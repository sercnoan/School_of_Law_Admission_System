<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AdmissionProgramController;
use App\Http\Controllers\AdmissionRequirementController;
use App\Http\Controllers\ApplicantProfileController;
use App\Http\Controllers\ApplicantProgramController;
use App\Http\Controllers\ApplicantReportController;
use App\Http\Controllers\ApplicantRequirementController;
use App\Http\Controllers\ApplicantStatusController;
use App\Http\Controllers\EmailOtpVerificationController;
use App\Http\Controllers\ExaminationScheduleController;
use App\Http\Controllers\ExamineeController;
use App\Http\Controllers\IntervieweeController;
use App\Http\Controllers\InterviewerController;
use App\Http\Controllers\ProfileOptionController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware('auth')->group(function () {
    Route::get('/email/otp', [EmailOtpVerificationController::class, 'show'])
        ->name('otp.verification.notice');
    Route::post('/email/otp/verify', [EmailOtpVerificationController::class, 'verify'])
        ->middleware('throttle:10,1')
        ->name('otp.verification.verify');
    Route::post('/email/otp/resend', [EmailOtpVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('otp.verification.resend');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware([
    'auth',
    'otp.verified',
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

            if (auth()->user()->role === 'interviewer') {
                return redirect()->route('interviewer.interviewees');
            }

            return redirect()
                ->route(
                    'applicant.dashboard'
                );
        }
    )->name(
        'dashboard'
    );

    Route::middleware('interviewer')
        ->prefix('interviewer')
        ->group(function () {
            Route::get('/interviewees', [InterviewerController::class, 'index'])
                ->name('interviewer.interviewees');
            Route::get('/interviewees/{applicationId}', [InterviewerController::class, 'show'])
                ->name('interviewer.interviewees.show');
            Route::get('/requirements/{submissionId}/download', [InterviewerController::class, 'downloadRequirement'])
                ->name('interviewer.requirement.download');
            Route::get('/requirements/{submissionId}/view', [InterviewerController::class, 'viewRequirement'])
                ->name('interviewer.requirement.view');
        });

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
            'create',
        ]
    )->name(
        'personal.details'
    );

    Route::post(
        '/personal-details',
        [
            ApplicantProfileController::class,
            'store',
        ]
    )->name(
        'personal.details.store'
    );

    Route::put(
        '/personal-details',
        [
            ApplicantProfileController::class,
            'update',
        ]
    )->name(
        'personal.details.update'
    );

    Route::post(
        '/personal-details/update',
        [
            ApplicantProfileController::class,
            'update',
        ]
    )->name(
        'personal.details.update-with-photo'
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
            'index',
        ]
    )->name(
        'applicant.program'
    );

    Route::post(
        '/applicant/program',
        [
            ApplicantProgramController::class,
            'store',
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
            'index',
        ]
    )->name(
        'applicant.requirements'
    );

    Route::get(
        '/applicant/requirements/review',
        [
            ApplicantRequirementController::class,
            'review',
        ]
    )->name(
        'applicant.requirements.review'
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
            'upload',
        ]
    )->name(
        'applicant.requirements.upload'
    );

    Route::delete(
        '/applicant/requirements/{requirementId}',
        [
            ApplicantRequirementController::class,
            'remove',
        ]
    )->name(
        'applicant.requirements.remove'
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
            'submit',
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
            'applicantIndex',
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
            'applicantSelect',
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
            'index',
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
        'admin',
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
                    'dashboard',
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
                    'applications',
                ]
            )->name(
                'admin.applications'
            );

            Route::get('/reports', [ApplicantReportController::class, 'index'])
                ->name('admin.reports');
            Route::get('/reports/pdf', [ApplicantReportController::class, 'download'])
                ->name('admin.reports.pdf');

            Route::get('/form-options', [ProfileOptionController::class, 'index'])
                ->name('admin.form-options');
            Route::post('/form-options', [ProfileOptionController::class, 'store'])
                ->name('admin.form-options.store');
            Route::put('/form-options/{profileOption}', [ProfileOptionController::class, 'update'])
                ->name('admin.form-options.update');
            Route::patch('/form-options/{profileOption}/toggle', [ProfileOptionController::class, 'toggle'])
                ->name('admin.form-options.toggle');
            Route::delete('/form-options/{profileOption}', [ProfileOptionController::class, 'destroy'])
                ->name('admin.form-options.destroy');
            Route::post('/form-options/{profileOption}/move', [ProfileOptionController::class, 'move'])
                ->name('admin.form-options.move');

            Route::get('/programs', [AdmissionProgramController::class, 'index'])
                ->name('admin.programs');
            Route::post('/programs', [AdmissionProgramController::class, 'store'])
                ->name('admin.programs.store');
            Route::put('/programs/{admissionProgram}', [AdmissionProgramController::class, 'update'])
                ->name('admin.programs.update');
            Route::patch('/programs/{admissionProgram}/toggle', [AdmissionProgramController::class, 'toggle'])
                ->name('admin.programs.toggle');
            Route::delete('/programs/{admissionProgram}', [AdmissionProgramController::class, 'destroy'])
                ->name('admin.programs.destroy');
            Route::post('/programs/{admissionProgram}/move', [AdmissionProgramController::class, 'move'])
                ->name('admin.programs.move');

            Route::get('/admission-requirements', [AdmissionRequirementController::class, 'index'])
                ->name('admin.admission-requirements');
            Route::post('/admission-requirements', [AdmissionRequirementController::class, 'store'])
                ->name('admin.admission-requirements.store');
            Route::put('/admission-requirements/{requirement}', [AdmissionRequirementController::class, 'update'])
                ->name('admin.admission-requirements.update');
            Route::patch('/admission-requirements/{requirement}/toggle', [AdmissionRequirementController::class, 'toggle'])
                ->name('admin.admission-requirements.toggle');
            Route::delete('/admission-requirements/{requirement}', [AdmissionRequirementController::class, 'destroy'])
                ->name('admin.admission-requirements.destroy');
            Route::post('/admission-requirements/{requirement}/move', [AdmissionRequirementController::class, 'move'])
                ->name('admin.admission-requirements.move');

            /*
            |--------------------------------------------------------------------------
            | Application Details
            |--------------------------------------------------------------------------
            */

            Route::get(
                '/applications/{applicationId}',
                [
                    AdminController::class,
                    'applicationDetails',
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
                    'downloadRequirement',
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
                    'updateApplicationStatus',
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
                    'verifyRequirement',
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
                    'index',
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
                    'pass',
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
                    'fail',
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
                    'index',
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
                    'pass',
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
                    'fail',
                ]
            )->name(
                'admin.interviewees.fail'
            );

            Route::post(
                '/interviewees/{applicationId}/waitlist',
                [
                    IntervieweeController::class,
                    'waitlist',
                ]
            )->name(
                'admin.interviewees.waitlist'
            );

            Route::get(
                '/waitlisted',
                [
                    IntervieweeController::class,
                    'waitlisted',
                ]
            )->name(
                'admin.waitlisted'
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
                    'retryEmail',
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
                    'finalList',
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
                    'downloadFinalListPdf',
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
                    'index',
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
                    'create',
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
                    'store',
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
                    'edit',
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
                    'update',
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
                    'destroy',
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

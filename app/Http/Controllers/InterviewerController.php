<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class InterviewerController extends Controller
{
    public function index()
    {
        return Inertia::render('Interviewer/Interviewees', [
            'interviewees' => $this->eligibleInterviewees()->get(),
        ]);
    }

    public function show(int $applicationId)
    {
        $interviewee = $this->eligibleInterviewees()
            ->where('applications.application_id', $applicationId)
            ->first();

        abort_unless($interviewee, 404, 'Interviewee not found.');

        $profile = DB::table('applications')
            ->join('applicant_profiles', 'applications.applicant_profile_id', '=', 'applicant_profiles.id')
            ->join('users', 'applicant_profiles.user_id', '=', 'users.id')
            ->where('applications.application_id', $applicationId)
            ->select('applications.application_id', 'applications.program', 'applications.academic_year', 'applicant_profiles.*', 'users.email')
            ->first();

        $requirements = DB::table('requirements')
            ->where(function ($query) use ($profile) {
                $query->where('program', $profile->program)->orWhere('program', 'Both');
            })
            ->where('is_required', 1)
            ->orderBy('requirement_id')
            ->get();

        $submissions = DB::table('requirement_submissions')
            ->where('application_id', $applicationId)
            ->get()
            ->keyBy('requirement_id');

        $documents = $requirements->map(function ($requirement) use ($submissions) {
            $submission = $submissions->get($requirement->requirement_id);

            return [
                'requirement_id' => $requirement->requirement_id,
                'requirement_name' => $requirement->requirement_name,
                'description' => $requirement->description,
                'submitted' => (bool) $submission,
                'submission' => $submission,
            ];
        });

        return Inertia::render('Interviewer/IntervieweeDetails', [
            'interviewee' => $interviewee,
            'profile' => $profile,
            'documents' => $documents,
        ]);
    }

    public function downloadRequirement(int $submissionId)
    {
        [$submission, $relativePath] = $this->requirementFile($submissionId);

        return Storage::disk('public')->download($relativePath, $submission->file_name ?: basename($relativePath));
    }

    public function viewRequirement(int $submissionId)
    {
        [$submission, $relativePath] = $this->requirementFile($submissionId);
        $fileName = str_replace(['"', "\r", "\n"], '', $submission->file_name ?: basename($relativePath));

        return response()->file(Storage::disk('public')->path($relativePath), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$fileName.'"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function requirementFile(int $submissionId): array
    {
        $submission = DB::table('requirement_submissions')
            ->join('applications', 'requirement_submissions.application_id', '=', 'applications.application_id')
            ->join('examination_results', 'applications.application_id', '=', 'examination_results.application_id')
            ->join('interview_schedules', 'applications.application_id', '=', 'interview_schedules.application_id')
            ->where('requirement_submissions.submission_id', $submissionId)
            ->where('examination_results.result', 'Passed')
            ->whereNotNull('examination_results.notification_sent_at')
            ->select('requirement_submissions.*')
            ->first();

        abort_unless($submission, 404, 'Requirement submission not found.');

        $relativePath = ltrim(str_replace('\\', '/', $submission->file_path), '/');
        foreach (['storage/', 'public/'] as $prefix) {
            if (str_starts_with($relativePath, $prefix)) {
                $relativePath = substr($relativePath, strlen($prefix));
            }
        }

        abort_unless(Storage::disk('public')->exists($relativePath), 404, 'Submitted file not found.');

        return [$submission, $relativePath];
    }

    private function eligibleInterviewees()
    {
        return DB::table('applications')
            ->join('applicant_profiles', 'applications.applicant_profile_id', '=', 'applicant_profiles.id')
            ->join('users', 'applicant_profiles.user_id', '=', 'users.id')
            ->join('examination_results', 'applications.application_id', '=', 'examination_results.application_id')
            ->join('interview_schedules', 'applications.application_id', '=', 'interview_schedules.application_id')
            ->leftJoin('interview_results', 'applications.application_id', '=', 'interview_results.application_id')
            ->where('examination_results.result', 'Passed')
            ->whereNotNull('examination_results.notification_sent_at')
            ->select(
                'applications.application_id',
                'applications.program',
                'applications.academic_year',
                'applicant_profiles.applicant_number',
                'applicant_profiles.full_name',
                'applicant_profiles.photo_path',
                'applicant_profiles.contact_number',
                'users.email',
                'interview_schedules.interview_date',
                'interview_schedules.interview_time',
                'interview_schedules.venue as interview_venue',
                'interview_schedules.instructions as interview_instructions',
                DB::raw("COALESCE(interview_results.result, 'Pending') as interview_result")
            )
            ->orderBy('interview_schedules.interview_date')
            ->orderBy('interview_schedules.interview_time');
    }
}

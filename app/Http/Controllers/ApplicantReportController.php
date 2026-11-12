<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Query\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

class ApplicantReportController extends Controller
{
    private const FILTER_KEYS = [
        'city',
        'religion',
        'gender',
        'ethnic_affiliation',
        'employment_status',
        'program',
        'application_status',
        'submitted_from',
        'submitted_to',
    ];

    public function index(Request $request): InertiaResponse
    {
        $filters = $this->validatedFilters($request);

        return Inertia::render('Admin/Reports', [
            'filters' => $filters,
            'filterOptions' => $this->filterOptions(),
            'applicants' => $this->applicantQuery($filters)->get(),
        ]);
    }

    public function download(Request $request)
    {
        $filters = $this->validatedFilters($request);
        $applicants = $this->applicantQuery($filters)->get();

        $filterLabels = [
            'city' => 'City / address contains',
            'religion' => 'Religion',
            'gender' => 'Gender',
            'ethnic_affiliation' => 'Ethnic affiliation',
            'employment_status' => 'Employment status',
            'program' => 'Program',
            'application_status' => 'Application status',
            'submitted_from' => 'Submitted from',
            'submitted_to' => 'Submitted to',
        ];

        $activeFilters = collect($filters)
            ->filter(fn ($value) => filled($value))
            ->mapWithKeys(fn ($value, $key) => [
                $filterLabels[$key] => $value,
            ]);

        $logoPath = public_path('Images/law-logo.jpeg');
        $logoData = is_file($logoPath)
            ? 'data:image/jpeg;base64,'.base64_encode(file_get_contents($logoPath))
            : null;

        $pdf = Pdf::loadView('reports.applicants', [
            'applicants' => $applicants,
            'activeFilters' => $activeFilters,
            'generatedAt' => now(),
            'generatedBy' => $request->user()?->name ?? 'Administrator',
            'logoData' => $logoData,
        ])->setPaper('a4', 'landscape');

        return $pdf->download(
            'usep-sol-applicant-report-'.now()->format('Y-m-d-His').'.pdf'
        );
    }

    private function validatedFilters(Request $request): array
    {
        $validated = $request->validate([
            'city' => ['nullable', 'string', 'max:150'],
            'religion' => ['nullable', 'string', 'max:100'],
            'gender' => ['nullable', 'string', 'max:100'],
            'ethnic_affiliation' => ['nullable', 'string', 'max:150'],
            'employment_status' => ['nullable', 'string', 'max:100'],
            'program' => ['nullable', 'string', 'max:150'],
            'application_status' => ['nullable', 'string', 'max:50'],
            'submitted_from' => ['nullable', 'date'],
            'submitted_to' => ['nullable', 'date', 'after_or_equal:submitted_from'],
        ]);

        return collect(self::FILTER_KEYS)
            ->mapWithKeys(function ($key) use ($validated) {
                $value = $validated[$key] ?? '';

                return [$key => is_string($value) ? trim($value) : $value];
            })
            ->all();
    }

    private function applicantQuery(array $filters): Builder
    {
        return DB::table('applications')
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
            ->where('applications.application_status', '!=', 'Pending')
            ->when($filters['city'], fn (Builder $query, $value) => $query
                ->where('applicant_profiles.present_address', 'like', "%{$value}%"))
            ->when($filters['religion'], fn (Builder $query, $value) => $query
                ->where('applicant_profiles.religion', $value))
            ->when($filters['gender'], fn (Builder $query, $value) => $query
                ->where('applicant_profiles.gender', $value))
            ->when($filters['ethnic_affiliation'], fn (Builder $query, $value) => $query
                ->where('applicant_profiles.ethnic_affiliation', $value))
            ->when($filters['employment_status'], fn (Builder $query, $value) => $query
                ->where('applicant_profiles.employment_status', $value))
            ->when($filters['program'], fn (Builder $query, $value) => $query
                ->where('applications.program', $value))
            ->when($filters['application_status'], fn (Builder $query, $value) => $query
                ->where('applications.application_status', $value))
            ->when($filters['submitted_from'], fn (Builder $query, $value) => $query
                ->whereDate('applications.submitted_at', '>=', $value))
            ->when($filters['submitted_to'], fn (Builder $query, $value) => $query
                ->whereDate('applications.submitted_at', '<=', $value))
            ->select(
                'applications.application_id',
                'applications.program',
                'applications.application_status',
                'applications.submitted_at',
                'applicant_profiles.applicant_number',
                'applicant_profiles.full_name',
                'applicant_profiles.present_address',
                'applicant_profiles.religion',
                'applicant_profiles.gender',
                'applicant_profiles.ethnic_affiliation',
                'applicant_profiles.employment_status',
                'users.email'
            )
            ->orderBy('applicant_profiles.full_name');
    }

    private function filterOptions(): array
    {
        return [
            'religions' => $this->profileOptions('religion'),
            'genders' => $this->profileOptions('gender'),
            'ethnicAffiliations' => $this->profileOptions('ethnic_affiliation'),
            'employmentStatuses' => $this->profileOptions('employment_status'),
            'programs' => $this->applicationOptions('program'),
            'applicationStatuses' => $this->applicationOptions('application_status'),
        ];
    }

    private function profileOptions(string $column): array
    {
        return DB::table('applicant_profiles')
            ->join(
                'applications',
                'applications.applicant_profile_id',
                '=',
                'applicant_profiles.id'
            )
            ->where('applications.application_status', '!=', 'Pending')
            ->whereNotNull("applicant_profiles.{$column}")
            ->where("applicant_profiles.{$column}", '!=', '')
            ->distinct()
            ->orderBy("applicant_profiles.{$column}")
            ->pluck("applicant_profiles.{$column}")
            ->values()
            ->all();
    }

    private function applicationOptions(string $column): array
    {
        return DB::table('applications')
            ->where('application_status', '!=', 'Pending')
            ->whereNotNull($column)
            ->where($column, '!=', '')
            ->distinct()
            ->orderBy($column)
            ->pluck($column)
            ->values()
            ->all();
    }
}

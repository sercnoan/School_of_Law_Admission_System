<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Applicant Demographic Report</title>
    <style>
        @page { margin: 26px 30px 38px; }
        * { box-sizing: border-box; }
        body { margin: 0; color: #1f2937; font-family: DejaVu Sans, sans-serif; font-size: 8px; }
        .brand-table, .report-table { width: 100%; border-collapse: collapse; }
        .brand-table { border-bottom: 3px solid #7a2028; }
        .brand-table td { padding: 0 0 10px; vertical-align: middle; }
        .logo { width: 54px; height: 54px; object-fit: cover; }
        .brand { padding-left: 12px !important; }
        .brand strong { display: block; color: #691f1f; font-family: Georgia, serif; font-size: 18px; }
        .brand span { display: block; margin-top: 3px; color: #6b7280; font-size: 8px; letter-spacing: 1.2px; }
        .report-title { color: #111827; font-size: 16px; font-weight: bold; text-align: right; }
        .report-subtitle { margin-top: 3px; color: #6b7280; font-size: 8px; text-align: right; }
        .summary { margin: 12px 0 8px; padding: 9px 11px; border: 1px solid #d1d5db; background: #f9fafb; }
        .summary strong { color: #691f1f; font-size: 11px; }
        .summary-meta { margin-top: 3px; color: #6b7280; }
        .filters { margin: 0 0 10px; }
        .filter-label { color: #6b7280; font-weight: bold; }
        .filter-value { color: #111827; }
        .filter-separator { color: #9ca3af; padding: 0 5px; }
        .report-table { table-layout: fixed; }
        .report-table thead { display: table-header-group; }
        .report-table tr { page-break-inside: avoid; }
        .report-table th { padding: 6px 5px; border: 1px solid #6b7280; background: #7a2028; color: #fff; font-size: 7px; letter-spacing: .25px; text-align: left; text-transform: uppercase; }
        .report-table td { padding: 6px 5px; border: 1px solid #9ca3af; line-height: 1.35; vertical-align: top; word-wrap: break-word; }
        .report-table tbody tr:nth-child(even) td { background: #f3f4f6; }
        .number { text-align: center; }
        .muted { color: #6b7280; font-size: 7px; }
        .empty { padding: 24px !important; color: #6b7280; text-align: center; }
        .footer { position: fixed; right: 0; bottom: -24px; left: 0; border-top: 1px solid #d1d5db; padding-top: 6px; color: #6b7280; font-size: 7px; text-align: center; }
        .page-number:after { content: "Page " counter(page); }
    </style>
</head>
<body>
    <div class="footer">USeP School of Law Admission Management System - <span class="page-number"></span></div>

    <table class="brand-table">
        <tr>
            <td style="width: 58px;">
                @if ($logoData)
                    <img class="logo" src="{{ $logoData }}" alt="USeP School of Law">
                @endif
            </td>
            <td class="brand">
                <strong>School of Law</strong>
                <span>UNIVERSITY OF SOUTHEASTERN PHILIPPINES</span>
            </td>
            <td style="width: 42%;">
                <div class="report-title">Applicant Demographic Report</div>
                <div class="report-subtitle">Generated {{ $generatedAt->format('F j, Y - g:i A') }}</div>
            </td>
        </tr>
    </table>

    <div class="summary">
        <strong>{{ $applicants->count() }} matching applicant{{ $applicants->count() === 1 ? '' : 's' }}</strong>
        <div class="summary-meta">Prepared by {{ $generatedBy }}</div>
    </div>

    <div class="filters">
        @if ($activeFilters->isEmpty())
            <span class="filter-label">Criteria:</span> <span class="filter-value">All submitted applicants</span>
        @else
            @foreach ($activeFilters as $label => $value)
                <span class="filter-label">{{ $label }}:</span> <span class="filter-value">{{ $value }}</span>
                @unless ($loop->last)<span class="filter-separator">|</span>@endunless
            @endforeach
        @endif
    </div>

    <table class="report-table">
        <thead>
            <tr>
                <th style="width: 3%; text-align: center;">#</th>
                <th style="width: 9%;">Applicant No.</th>
                <th style="width: 13%;">Applicant</th>
                <th style="width: 12%;">Program</th>
                <th style="width: 18%;">Present Address</th>
                <th style="width: 9%;">Religion</th>
                <th style="width: 7%;">Gender</th>
                <th style="width: 10%;">Ethnic Affiliation</th>
                <th style="width: 10%;">Employment</th>
                <th style="width: 9%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($applicants as $applicant)
                <tr>
                    <td class="number">{{ $loop->iteration }}</td>
                    <td>{{ $applicant->applicant_number }}</td>
                    <td><strong>{{ $applicant->full_name }}</strong><br><span class="muted">{{ $applicant->email }}</span></td>
                    <td>{{ $applicant->program }}</td>
                    <td>{{ $applicant->present_address }}</td>
                    <td>{{ $applicant->religion ?: 'Not specified' }}</td>
                    <td>{{ $applicant->gender ?: 'Not specified' }}</td>
                    <td>{{ $applicant->ethnic_affiliation ?: 'Not specified' }}</td>
                    <td>{{ $applicant->employment_status ?: 'Not specified' }}</td>
                    <td>
                        {{ $applicant->application_status === 'Under Review' ? 'Pending' : $applicant->application_status }}<br>
                        <span class="muted">{{ $applicant->submitted_at ? \Carbon\Carbon::parse($applicant->submitted_at)->format('M j, Y') : 'Not submitted' }}</span>
                    </td>
                </tr>
            @empty
                <tr><td colspan="10" class="empty">No applicants matched the selected criteria.</td></tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>

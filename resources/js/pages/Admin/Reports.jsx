import RecordPagination, {
    useRecordPagination,
} from '@/components/record-pagination';
import PortalLayout from '@/layouts/portal-layout';
import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    Download,
    FileBarChart,
    Filter,
    MapPin,
    RotateCcw,
    Search,
    Users,
} from 'lucide-react';
import { useMemo, useState } from 'react';

const emptyFilters = {
    city: '',
    religion: '',
    gender: '',
    ethnic_affiliation: '',
    employment_status: '',
    program: '',
    application_status: '',
    submitted_from: '',
    submitted_to: '',
};

export default function Reports({
    applicants = [],
    filters = emptyFilters,
    filterOptions = {},
}) {
    const [form, setForm] = useState({ ...emptyFilters, ...filters });
    const appliedFilterCount = Object.values(filters).filter(Boolean).length;
    const pagination = useRecordPagination(
        applicants,
        JSON.stringify(filters),
    );

    const pdfUrl = useMemo(() => {
        const query = new URLSearchParams(
            Object.entries(filters).filter(([, value]) => value),
        ).toString();

        return `/admin/reports/pdf${query ? `?${query}` : ''}`;
    }, [filters]);

    const updateFilter = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
    };

    const applyFilters = (event) => {
        event.preventDefault();
        router.get('/admin/reports', form, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setForm(emptyFilters);
        router.get('/admin/reports', {}, {
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <>
            <Head title="Applicant Reports" />

            <div className="min-h-screen bg-gray-50">
                <PortalLayout audience="admin">
                    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#922b2b]">
                                    ADMISSIONS ANALYTICS
                                </p>
                                <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                                    Applicant Reports
                                </h1>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                                    Combine demographic and application filters,
                                    review the matching applicants, and download
                                    the complete results as a PDF.
                                </p>
                            </div>

                            <div className="flex w-fit items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5e6e6] text-[#922b2b]">
                                    <Users size={21} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                        Matching Applicants
                                    </p>
                                    <p className="mt-0.5 text-2xl font-bold text-gray-900">
                                        {applicants.length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <form
                            onSubmit={applyFilters}
                            className="mb-7 rounded-2xl border border-gray-300 bg-white p-5 shadow-md sm:p-6"
                        >
                            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center gap-2">
                                    <Filter size={19} className="text-[#922b2b]" />
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Report Criteria
                                    </h2>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {appliedFilterCount
                                        ? `${appliedFilterCount} active filter${appliedFilterCount === 1 ? '' : 's'}`
                                        : 'Showing all submitted applicants'}
                                </span>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                <FilterField label="City or Address">
                                    <div className="relative">
                                        <MapPin
                                            size={17}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                        <input
                                            value={form.city}
                                            onChange={(event) =>
                                                updateFilter(
                                                    'city',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Example: Davao City"
                                            className="h-11 w-full rounded-xl border border-gray-300 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
                                        />
                                    </div>
                                </FilterField>

                                <SelectFilter
                                    label="Religion"
                                    value={form.religion}
                                    options={filterOptions.religions}
                                    onChange={(value) =>
                                        updateFilter('religion', value)
                                    }
                                />
                                <SelectFilter
                                    label="Gender"
                                    value={form.gender}
                                    options={filterOptions.genders}
                                    onChange={(value) =>
                                        updateFilter('gender', value)
                                    }
                                />
                                <SelectFilter
                                    label="Ethnic Affiliation"
                                    value={form.ethnic_affiliation}
                                    options={filterOptions.ethnicAffiliations}
                                    onChange={(value) =>
                                        updateFilter('ethnic_affiliation', value)
                                    }
                                />
                                <SelectFilter
                                    label="Employment Status"
                                    value={form.employment_status}
                                    options={filterOptions.employmentStatuses}
                                    onChange={(value) =>
                                        updateFilter('employment_status', value)
                                    }
                                />
                                <SelectFilter
                                    label="Program"
                                    value={form.program}
                                    options={filterOptions.programs}
                                    onChange={(value) =>
                                        updateFilter('program', value)
                                    }
                                />
                                <SelectFilter
                                    label="Application Status"
                                    value={form.application_status}
                                    options={filterOptions.applicationStatuses}
                                    onChange={(value) =>
                                        updateFilter('application_status', value)
                                    }
                                />
                                <FilterField label="Submitted From">
                                    <input
                                        type="date"
                                        value={form.submitted_from}
                                        onChange={(event) =>
                                            updateFilter(
                                                'submitted_from',
                                                event.target.value,
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
                                    />
                                </FilterField>
                                <FilterField label="Submitted To">
                                    <input
                                        type="date"
                                        value={form.submitted_to}
                                        min={form.submitted_from || undefined}
                                        onChange={(event) =>
                                            updateFilter(
                                                'submitted_to',
                                                event.target.value,
                                            )
                                        }
                                        className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
                                    />
                                </FilterField>
                            </div>

                            <div className="mt-6 flex flex-col-reverse gap-3 border-t-2 border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    <RotateCcw size={17} />
                                    Clear Filters
                                </button>

                                <button
                                    type="submit"
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#922b2b] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#691f1f]"
                                >
                                    <Search size={17} />
                                    Generate Preview
                                </button>
                            </div>
                        </form>

                        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                                    <FileBarChart
                                        size={19}
                                        className="text-[#922b2b]"
                                    />
                                    Report Preview
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    The PDF will contain all {applicants.length}{' '}
                                    matching record{applicants.length === 1 ? '' : 's'}.
                                </p>
                            </div>

                            {applicants.length > 0 ? (
                                <a
                                    href={pdfUrl}
                                    className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800"
                                >
                                    <Download size={18} />
                                    Download PDF Report
                                </a>
                            ) : (
                                <button
                                    type="button"
                                    disabled
                                    className="inline-flex w-fit cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-gray-300 px-5 py-3 text-sm font-semibold text-gray-500"
                                >
                                    <Download size={18} />
                                    Download PDF Report
                                </button>
                            )}
                        </div>

                        <div className="hidden overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-md lg:block">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[1180px]">
                                    <thead>
                                        <tr className="border-b-2 border-gray-400 bg-gray-100">
                                            <TableHeader>Applicant</TableHeader>
                                            <TableHeader>Program</TableHeader>
                                            <TableHeader>Present Address</TableHeader>
                                            <TableHeader>Religion</TableHeader>
                                            <TableHeader>Gender</TableHeader>
                                            <TableHeader>Ethnic Affiliation</TableHeader>
                                            <TableHeader>Employment</TableHeader>
                                            <TableHeader>Status</TableHeader>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y-[3px] divide-gray-300">
                                        {pagination.pageRecords.length ? (
                                            pagination.pageRecords.map(
                                                (applicant) => (
                                                    <tr
                                                        key={
                                                            applicant.application_id
                                                        }
                                                        className="transition odd:bg-white even:bg-gray-50/70 hover:bg-[#fbf3f3]"
                                                    >
                                                        <td className="border-l-[6px] border-l-[#922b2b] px-5 py-5">
                                                            <p className="font-semibold text-gray-900">
                                                                {applicant.full_name}
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {
                                                                    applicant.applicant_number
                                                                }
                                                            </p>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {applicant.email}
                                                            </p>
                                                        </td>
                                                        <ReportCell>
                                                            {applicant.program}
                                                        </ReportCell>
                                                        <ReportCell>
                                                            {
                                                                applicant.present_address
                                                            }
                                                        </ReportCell>
                                                        <ReportCell>
                                                            {applicant.religion ||
                                                                'Not specified'}
                                                        </ReportCell>
                                                        <ReportCell>
                                                            {applicant.gender ||
                                                                'Not specified'}
                                                        </ReportCell>
                                                        <ReportCell>
                                                            {applicant.ethnic_affiliation ||
                                                                'Not specified'}
                                                        </ReportCell>
                                                        <ReportCell>
                                                            {applicant.employment_status ||
                                                                'Not specified'}
                                                        </ReportCell>
                                                        <td className="px-5 py-5">
                                                            <span className="inline-flex rounded-full bg-[#f5e6e6] px-3 py-1.5 text-xs font-semibold text-[#691f1f]">
                                                                {displayStatus(
                                                                    applicant.application_status,
                                                                )}
                                                            </span>
                                                            <p className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                                                                <CalendarDays
                                                                    size={13}
                                                                />
                                                                {formatDate(
                                                                    applicant.submitted_at,
                                                                )}
                                                            </p>
                                                        </td>
                                                    </tr>
                                                ),
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={8}
                                                    className="px-6 py-16 text-center"
                                                >
                                                    <EmptyState />
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-4 lg:hidden">
                            {pagination.pageRecords.length ? (
                                pagination.pageRecords.map((applicant) => (
                                    <article
                                        key={applicant.application_id}
                                        className="rounded-2xl border border-gray-300 border-l-[6px] border-l-[#922b2b] bg-white p-5 shadow-md"
                                    >
                                        <h3 className="font-bold text-gray-900">
                                            {applicant.full_name}
                                        </h3>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {applicant.applicant_number} -{' '}
                                            {applicant.email}
                                        </p>
                                        <div className="mt-4 grid gap-3 border-t-2 border-gray-300 pt-4 sm:grid-cols-2">
                                            <MobileInfo
                                                label="Address"
                                                value={
                                                    applicant.present_address
                                                }
                                            />
                                            <MobileInfo
                                                label="Religion"
                                                value={
                                                    applicant.religion ||
                                                    'Not specified'
                                                }
                                            />
                                            <MobileInfo
                                                label="Gender"
                                                value={
                                                    applicant.gender ||
                                                    'Not specified'
                                                }
                                            />
                                            <MobileInfo
                                                label="Ethnic Affiliation"
                                                value={
                                                    applicant.ethnic_affiliation ||
                                                    'Not specified'
                                                }
                                            />
                                            <MobileInfo
                                                label="Program"
                                                value={applicant.program}
                                            />
                                            <MobileInfo
                                                label="Status"
                                                value={displayStatus(
                                                    applicant.application_status,
                                                )}
                                            />
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-gray-300 bg-white px-5 py-14 text-center shadow-md">
                                    <EmptyState />
                                </div>
                            )}
                        </div>

                        <RecordPagination
                            {...pagination}
                            totalRecords={applicants.length}
                            onPageChange={pagination.setPage}
                        />
                    </div>
                </PortalLayout>
            </div>
        </>
    );
}

function FilterField({ label, children }) {
    return (
        <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                {label}
            </label>
            {children}
        </div>
    );
}

function SelectFilter({ label, value, options = [], onChange }) {
    return (
        <FilterField label={label}>
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-11 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
            >
                <option value="">All {label}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {displayStatus(option)}
                    </option>
                ))}
            </select>
        </FilterField>
    );
}

function TableHeader({ children }) {
    return (
        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-600">
            {children}
        </th>
    );
}

function ReportCell({ children }) {
    return <td className="px-5 py-5 text-sm text-gray-700">{children}</td>;
}

function MobileInfo({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">{value}</p>
        </div>
    );
}

function EmptyState() {
    return (
        <div>
            <FileBarChart size={30} className="mx-auto text-gray-300" />
            <h3 className="mt-3 font-bold text-gray-800">
                No matching applicants
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                Change or clear the report criteria and try again.
            </p>
        </div>
    );
}

function displayStatus(status) {
    return status === 'Under Review' ? 'Pending' : status;
}

function formatDate(value) {
    if (!value) return 'Not submitted';

    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

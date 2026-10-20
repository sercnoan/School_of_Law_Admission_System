import PortalLayout from '@/layouts/portal-layout';
import RecordPagination, { useRecordPagination } from '@/components/record-pagination';
import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, Clock, GraduationCap, ListChecks, Mail, MapPin, Search } from 'lucide-react';

export default function Waitlisted({ waitlisted = [] }) {
    const { flash = {} } = usePage().props;
    const [search, setSearch] = useState('');
    const [program, setProgram] = useState('All');
    const [processingId, setProcessingId] = useState(null);
    const maroon = '#922b2b';

    const programs = useMemo(
        () => [...new Set(waitlisted.map((item) => item.program).filter(Boolean))].sort(),
        [waitlisted]
    );

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();

        return waitlisted.filter((item) => {
            const matchesSearch = !query || [item.full_name, item.applicant_number, item.email]
                .filter(Boolean)
                .some((value) => String(value).toLowerCase().includes(query));
            const matchesProgram = program === 'All' || item.program === program;

            return matchesSearch && matchesProgram;
        });
    }, [waitlisted, search, program]);

    const pagination = useRecordPagination(filtered, `${search}|${program}`);

    const addToFinalList = (item) => {
        const confirmed = window.confirm(
            `Add ${item.full_name} to the Final List? This will mark the interview result as Passed.`
        );

        if (!confirmed) return;

        router.post(
            `/admin/interviewees/${item.application_id}/pass`,
            {},
            {
                preserveScroll: true,
                onStart: () => setProcessingId(item.application_id),
                onFinish: () => setProcessingId(null),
            }
        );
    };

    return (
        <>
            <Head title="Waitlisted Applicants" />

            <div className="min-h-screen bg-gray-50">
                <PortalLayout audience="admin">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#922b2b]">Admission Management</p>
                                <h1 className="mt-1 text-2xl font-bold text-[#691f1f] sm:text-3xl">Waitlisted Applicants</h1>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                                    Applicants placed on hold after their admission interview while awaiting a final decision.
                                </p>
                            </div>

                            <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 ring-1 ring-amber-200">
                                <ListChecks size={18} />
                                {waitlisted.length} Waitlisted Applicant{waitlisted.length === 1 ? '' : 's'}
                            </div>
                        </div>

                        {flash.success && (
                            <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                                <CheckCircle2 size={19} className="mt-0.5 shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                        )}

                        {flash.error && (
                            <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                                <AlertCircle size={19} className="mt-0.5 shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                        )}

                        <div className="mb-6 grid gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:grid-cols-2 sm:p-6">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Search</label>
                                <div className="relative">
                                    <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        value={search}
                                        onChange={(event) => setSearch(event.target.value)}
                                        placeholder="Name, applicant number, email..."
                                        className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 text-sm outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">Program</label>
                                <select
                                    value={program}
                                    onChange={(event) => setProgram(event.target.value)}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
                                >
                                    <option value="All">All Programs</option>
                                    {programs.map((value) => <option key={value} value={value}>{value}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filtered.length ? pagination.pageRecords.map((item) => (
                                <article key={item.application_id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h2 className="text-lg font-bold text-gray-900">{item.full_name}</h2>
                                                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">Waitlisted</span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-500">{item.applicant_number}</p>
                                            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                                                <span className="flex items-center gap-2"><Mail size={15} />{item.email}</span>
                                                <span className="flex items-center gap-2"><GraduationCap size={15} />{item.program}</span>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => addToFinalList(item)}
                                            disabled={processingId === item.application_id}
                                            className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <CheckCircle2 size={17} />
                                            {processingId === item.application_id
                                                ? 'Adding...'
                                                : 'Add to Final List'}
                                        </button>
                                    </div>

                                    <div className="mt-5 grid gap-4 border-t border-gray-100 pt-5 md:grid-cols-2">
                                        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
                                            <p className="font-semibold text-gray-900">Interview Schedule</p>
                                            <p className="mt-2 flex items-center gap-2"><CalendarDays size={15} />{formatDate(item.interview_date)}</p>
                                            <p className="mt-2 flex items-center gap-2"><Clock size={15} />{formatTime(item.interview_time)}</p>
                                            <p className="mt-2 flex items-center gap-2"><MapPin size={15} />{item.interview_venue || 'Not available'}</p>
                                        </div>

                                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                                            <p className="text-xs font-bold uppercase tracking-wide text-amber-700">Waitlist Status</p>
                                            <p className="mt-2 text-sm font-semibold text-amber-950">Awaiting a final admission decision</p>
                                            <p className="mt-3 text-xs text-amber-700">Added {formatDateTime(item.waitlisted_at)}</p>
                                        </div>
                                    </div>
                                </article>
                            )) : (
                                <div className="rounded-2xl border border-gray-100 bg-white px-5 py-16 text-center shadow-sm">
                                    <ListChecks size={30} className="mx-auto text-gray-300" />
                                    <h2 className="mt-4 font-bold text-gray-800">No waitlisted applicants found</h2>
                                    <p className="mt-1 text-sm text-gray-500">Waitlisted interviewees will appear here.</p>
                                </div>
                            )}
                        </div>

                        <RecordPagination
                            {...pagination}
                            totalRecords={filtered.length}
                            onPageChange={pagination.setPage}
                        />
                    </div>
                </PortalLayout>
            </div>
        </>
    );
}

function formatDate(date) {
    if (!date) return 'Not available';
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(time) {
    if (!time) return 'Not available';
    const [hours, minutes] = String(time).split(':').map(Number);
    const value = new Date();
    value.setHours(hours, minutes, 0, 0);
    return value.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatDateTime(value) {
    if (!value) return 'date unavailable';
    return new Date(String(value).replace(' ', 'T')).toLocaleString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
    });
}

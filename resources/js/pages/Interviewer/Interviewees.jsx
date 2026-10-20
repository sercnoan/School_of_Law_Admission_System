import RecordPagination, {
    useRecordPagination,
} from '@/components/record-pagination';
import PortalLayout from '@/layouts/portal-layout';
import { Head, Link } from '@inertiajs/react';
import { CalendarDays, ChevronRight, Search, UserCheck } from 'lucide-react';
import { useMemo, useState } from 'react';

export default function Interviewees({ interviewees = [] }) {
    const [search, setSearch] = useState('');
    const [program, setProgram] = useState('All');
    const programs = [
        ...new Set(interviewees.map((item) => item.program).filter(Boolean)),
    ].sort();
    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();

        return interviewees.filter((item) => {
            const matchesSearch =
                !term ||
                [item.full_name, item.applicant_number, item.email]
                    .filter(Boolean)
                    .some((value) =>
                        String(value).toLowerCase().includes(term),
                    );
            return (
                matchesSearch && (program === 'All' || item.program === program)
            );
        });
    }, [interviewees, search, program]);
    const pagination = useRecordPagination(filtered, `${search}|${program}`);

    const formatDate = (value) =>
        value
            ? new Date(`${value}T00:00:00`).toLocaleDateString('en-PH', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
              })
            : 'Not scheduled';

    return (
        <>
            <Head title="Interviewer Portal" />
            <div className="min-h-screen bg-gray-50">
                <PortalLayout audience="interviewer">
                    <div className="mx-auto max-w-7xl space-y-6">
                        <header>
                            <p className="text-sm font-semibold text-[#922b2b]">
                                Interview panel
                            </p>
                            <h1 className="mt-1 text-3xl font-bold text-gray-900">
                                Interviewees
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Review candidate profiles and submitted
                                admission documents.
                            </p>
                        </header>

                        <section className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
                            <div className="grid gap-3 sm:grid-cols-[1fr_260px]">
                                <label className="relative">
                                    <span className="sr-only">
                                        Search interviewees
                                    </span>
                                    <Search
                                        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
                                        size={18}
                                    />
                                    <input
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                        placeholder="Search by name, applicant number, or email"
                                        className="w-full rounded-xl border border-gray-300 py-2.5 pr-4 pl-10 text-sm outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
                                    />
                                </label>
                                <select
                                    value={program}
                                    onChange={(event) =>
                                        setProgram(event.target.value)
                                    }
                                    className="rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#922b2b]"
                                >
                                    <option value="All">All programs</option>
                                    {programs.map((value) => (
                                        <option key={value} value={value}>
                                            {value}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </section>

                        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                            {pagination.pageRecords.length ? (
                                <div className="divide-y divide-gray-100">
                                    {pagination.pageRecords.map((item) => (
                                        <Link
                                            key={item.application_id}
                                            href={`/interviewer/interviewees/${item.application_id}`}
                                            className="flex items-center gap-4 p-5 transition hover:bg-gray-50"
                                        >
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#922b2b]/10 text-[#922b2b]">
                                                {item.photo_path ? (
                                                    <img
                                                        src={`/storage/${item.photo_path}`}
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <UserCheck size={21} />
                                                )}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <h2 className="font-semibold text-gray-900">
                                                        {item.full_name}
                                                    </h2>
                                                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                                                        {item.interview_result ||
                                                            'Pending'}
                                                    </span>
                                                </div>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {item.applicant_number} ·{' '}
                                                    {item.program}
                                                </p>
                                                <p className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
                                                    <CalendarDays size={14} />{' '}
                                                    {formatDate(
                                                        item.interview_date,
                                                    )}{' '}
                                                    ·{' '}
                                                    {item.interview_time ||
                                                        'Time not set'}{' '}
                                                    ·{' '}
                                                    {item.interview_venue ||
                                                        'Venue not set'}
                                                </p>
                                            </div>
                                            <ChevronRight
                                                className="shrink-0 text-gray-400"
                                                size={20}
                                            />
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-16 text-center">
                                    <UserCheck
                                        className="mx-auto text-gray-300"
                                        size={40}
                                    />
                                    <p className="mt-3 font-medium text-gray-700">
                                        No interviewees found
                                    </p>
                                </div>
                            )}
                            <RecordPagination {...pagination} />
                        </section>
                    </div>
                </PortalLayout>
            </div>
        </>
    );
}

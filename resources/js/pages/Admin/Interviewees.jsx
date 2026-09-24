import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    AlertCircle,
    CalendarCheck,
    CalendarDays,
    CheckCircle2,
    ClipboardCheck,
    Clock,
    FileText,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Menu,
    Phone,
    Search,
    UserCheck,
    X,
    XCircle,
} from 'lucide-react';

export default function Interviewees({
    interviewees = [],
}) {
    const { props } = usePage();
    const flash = props.flash ?? {};

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [academicYearFilter, setAcademicYearFilter] = useState('All');
    const [programFilter, setProgramFilter] = useState('All');
    const [resultFilter, setResultFilter] = useState('All');
    const [passTarget, setPassTarget] = useState(null);
    const [failTarget, setFailTarget] = useState(null);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    const passForm = useForm({});
    const failForm = useForm({});

    const academicYears = useMemo(() => {
        return [...new Set(
            interviewees
                .map((interviewee) => interviewee.academic_year)
                .filter(Boolean)
        )].sort((a, b) => String(b).localeCompare(String(a)));
    }, [interviewees]);

    const programs = useMemo(() => {
        return [...new Set(
            interviewees
                .map((interviewee) => interviewee.program)
                .filter(Boolean)
        )].sort();
    }, [interviewees]);

    const interviewFinished = (interviewee) => {
        if (!interviewee?.interview_date || !interviewee?.interview_time) {
            return false;
        }

        const time = String(interviewee.interview_time).slice(0, 8);
        const interviewDateTime = new Date(
            `${interviewee.interview_date}T${time}+08:00`
        );

        if (Number.isNaN(interviewDateTime.getTime())) {
            return false;
        }

        return interviewDateTime.getTime() <= Date.now();
    };

    const filteredInterviewees = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return interviewees.filter((interviewee) => {
            const matchesSearch =
                !normalizedSearch ||
                [
                    interviewee.full_name,
                    interviewee.applicant_number,
                    interviewee.email,
                    interviewee.contact_number,
                ]
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(normalizedSearch)
                    );

            const matchesAcademicYear =
                academicYearFilter === 'All' ||
                interviewee.academic_year === academicYearFilter;

            const matchesProgram =
                programFilter === 'All' ||
                interviewee.program === programFilter;

            const result = interviewee.interview_result ?? 'Pending';

            const matchesResult =
                resultFilter === 'All' ||
                result === resultFilter;

            return (
                matchesSearch &&
                matchesAcademicYear &&
                matchesProgram &&
                matchesResult
            );
        });
    }, [
        interviewees,
        search,
        academicYearFilter,
        programFilter,
        resultFilter,
    ]);

    const totalInterviewees = interviewees.length;
    const pendingCount = interviewees.filter(
        (interviewee) =>
            (interviewee.interview_result ?? 'Pending') === 'Pending'
    ).length;
    const passedCount = interviewees.filter(
        (interviewee) => interviewee.interview_result === 'Passed'
    ).length;
    const failedCount = interviewees.filter(
        (interviewee) => interviewee.interview_result === 'Failed'
    ).length;

    const openPassModal = (interviewee) => {
        passForm.reset();
        passForm.clearErrors();
        setPassTarget(interviewee);
    };

    const openFailModal = (interviewee) => {
        failForm.reset();
        failForm.clearErrors();
        setFailTarget(interviewee);
    };

    const submitPassed = (event) => {
        event.preventDefault();

        if (!passTarget) {
            return;
        }

        passForm.post(
            `/admin/interviewees/${passTarget.application_id}/pass`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setPassTarget(null);
                    passForm.reset();
                },
            }
        );
    };

    const submitFailed = (event) => {
        event.preventDefault();

        if (!failTarget) {
            return;
        }

        failForm.post(
            `/admin/interviewees/${failTarget.application_id}/fail`,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFailTarget(null);
                    failForm.reset();
                },
            }
        );
    };


    const clearFilters = () => {
        setSearch('');
        setAcademicYearFilter('All');
        setProgramFilter('All');
        setResultFilter('All');
    };

    const hasFilters =
        search ||
        academicYearFilter !== 'All' ||
        programFilter !== 'All' ||
        resultFilter !== 'All';

    return (
        <>
            <Head title="Interviewees" />

            <div className="min-h-screen bg-gray-50">
                <header
                    className="sticky top-0 z-40 flex h-16 items-center px-4 text-white shadow-md lg:hidden"
                    style={{ backgroundColor: maroon }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 transition hover:bg-white/10"
                            aria-label="Open navigation"
                        >
                            <Menu size={23} />
                        </button>

                        <img
                            src="/images/law-logo.jpeg"
                            alt="USeP School of Law"
                            className="h-9 w-9 rounded-full bg-white object-contain"
                        />

                        <div>
                            <p className="text-sm font-bold leading-tight">
                                USeP School of Law
                            </p>
                            <p className="text-[11px] text-white/75">
                                Administration
                            </p>
                        </div>
                    </div>
                </header>

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                <aside
                    className={`
                        fixed
                        left-0
                        top-0
                        z-50
                        flex
                        h-screen
                        w-72
                        flex-col
                        text-white
                        shadow-xl
                        transition-transform
                        duration-300
                        lg:w-64
                        lg:translate-x-0
                        ${
                            sidebarOpen
                                ? 'translate-x-0'
                                : '-translate-x-full'
                        }
                    `}
                    style={{
                        backgroundColor:
                            darkMaroon,
                    }}
                >
                    <div className="border-b border-white/10 px-5 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-1">
                                <img
                                    src="/images/law-logo.jpeg"
                                    alt="USeP School of Law"
                                    className="h-full w-full rounded-full object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-base font-bold">
                                    USeP School of Law
                                </h1>

                                <p className="mt-0.5 text-xs text-white/65">
                                    Administration Portal
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSidebarOpen(
                                        false
                                    )
                                }
                                className="ml-auto rounded-lg p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
                                aria-label="Close navigation"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1 px-3 py-5">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            Main Menu
                        </p>

                        <NavigationItem
                            href="/admin/dashboard"
                            icon={LayoutDashboard}
                            label="Dashboard"
                            onClick={() => setSidebarOpen(false)}
                        />

                        <NavigationItem
                            href="/admin/applications"
                            icon={FileText}
                            label="Applications"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <NavigationItem
                            href="/admin/examinees"
                            icon={UserCheck}
                            label="Examinees"
                            onClick={() => setSidebarOpen(false)}
                        />

                        <NavigationItem
                            href="/admin/interviewees"
                            icon={CalendarCheck}
                            label="Interviewees"
                            active
                            maroon={maroon}
                            onClick={() => setSidebarOpen(false)}
                        />

                        <NavigationItem
                            href="/admin/final-list"
                            icon={ClipboardCheck}
                            label="Final List"
                            onClick={() => setSidebarOpen(false)}
                        />

                        <NavigationItem
                            href="/admin/examination-schedules"
                            icon={CalendarDays}
                            label="Examination Schedules"
                            onClick={() => setSidebarOpen(false)}
                        />
                    </nav>

                    <div className="border-t border-white/10 p-3">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                            <LogOut size={19} />
                            <span>Logout</span>
                        </Link>
                    </div>
                </aside>

                <main className="min-h-screen p-4 sm:p-6 lg:ml-64 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-7">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <p
                                        className="text-sm font-semibold"
                                        style={{ color: maroon }}
                                    >
                                        Admission Management
                                    </p>

                                    <h1
                                        className="mt-1 text-2xl font-bold sm:text-3xl"
                                        style={{ color: darkMaroon }}
                                    >
                                        Interviewees
                                    </h1>

                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                                        Applicants shown here have passed the admission examination,
                                        have an interview schedule, and have successfully received
                                        their interview schedule email.
                                    </p>
                                </div>

                                <div
                                    className="inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
                                    style={{
                                        backgroundColor: '#f5e6e6',
                                        color: maroon,
                                    }}
                                >
                                    <CalendarCheck size={18} />
                                    {totalInterviewees}{' '}
                                    Interviewee{totalInterviewees === 1 ? '' : 's'}
                                </div>
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

                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <SummaryCard
                                label="Total Interviewees"
                                value={totalInterviewees}
                                icon={CalendarCheck}
                                maroon={maroon}
                            />
                            <SummaryCard
                                label="Pending"
                                value={pendingCount}
                                icon={Clock}
                                type="warning"
                            />
                            <SummaryCard
                                label="Passed"
                                value={passedCount}
                                icon={CheckCircle2}
                                type="success"
                            />
                            <SummaryCard
                                label="Failed"
                                value={failedCount}
                                icon={XCircle}
                                type="danger"
                            />
                        </div>

                        <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                                <div>
                                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                                        Search
                                    </label>

                                    <div className="relative">
                                        <Search
                                            size={18}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                            placeholder="Name, applicant no., email..."
                                            className="w-full rounded-xl border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
                                        />
                                    </div>
                                </div>

                                <FilterSelect
                                    label="Academic Year"
                                    value={academicYearFilter}
                                    onChange={setAcademicYearFilter}
                                    allLabel="All Academic Years"
                                    options={academicYears}
                                />

                                <FilterSelect
                                    label="Program"
                                    value={programFilter}
                                    onChange={setProgramFilter}
                                    allLabel="All Programs"
                                    options={programs}
                                />

                                <FilterSelect
                                    label="Interview Result"
                                    value={resultFilter}
                                    onChange={setResultFilter}
                                    allLabel="All Results"
                                    options={['Pending', 'Passed', 'Failed']}
                                />
                            </div>

                            {hasFilters && (
                                <div className="mt-4 text-right">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="text-sm font-semibold hover:underline"
                                        style={{ color: maroon }}
                                    >
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 bg-gray-50">
                                            <TableHeader>Interviewee</TableHeader>
                                            <TableHeader>Academic Year</TableHeader>
                                            <TableHeader>Program</TableHeader>
                                            <TableHeader>Interview Schedule</TableHeader>
                                            <TableHeader>Result</TableHeader>
                                            <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-gray-100">
                                        {filteredInterviewees.length > 0 ? (
                                            filteredInterviewees.map((interviewee) => (
                                                <tr
                                                    key={interviewee.application_id}
                                                    className="align-top transition hover:bg-gray-50"
                                                >
                                                    <td className="px-5 py-5">
                                                        <p className="font-semibold text-gray-900">
                                                            {interviewee.full_name}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {interviewee.applicant_number}
                                                        </p>
                                                        <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                            <Mail size={12} />
                                                            {interviewee.email}
                                                        </p>
                                                        {interviewee.contact_number && (
                                                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                                <Phone size={12} />
                                                                {interviewee.contact_number}
                                                            </p>
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <span
                                                            className="rounded-full px-3 py-1.5 text-xs font-semibold"
                                                            style={{
                                                                backgroundColor: '#f5e6e6',
                                                                color: maroon,
                                                            }}
                                                        >
                                                            {interviewee.academic_year
                                                                ? `AY ${interviewee.academic_year}`
                                                                : 'Not assigned'}
                                                        </span>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <div className="flex items-center gap-2 text-sm text-gray-800">
                                                            <GraduationCap
                                                                size={16}
                                                                style={{ color: maroon }}
                                                            />
                                                            {interviewee.program}
                                                        </div>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <InterviewSchedule
                                                            interviewee={interviewee}
                                                            formatDate={formatDate}
                                                            formatTime={formatTime}
                                                        />
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <InterviewResultBadge
                                                            result={
                                                                interviewee.interview_result ??
                                                                'Pending'
                                                            }
                                                        />

                                                        <p className="mt-2 text-xs text-gray-500">
                                                            Schedule email:{' '}
                                                            <span className="font-semibold text-green-600">
                                                                Sent
                                                            </span>
                                                        </p>
                                                    </td>

                                                    <td className="px-5 py-5">
                                                        <InterviewActions
                                                            interviewee={interviewee}
                                                            finished={interviewFinished(interviewee)}
                                                            onPass={() => openPassModal(interviewee)}
                                                            onFail={() => openFailModal(interviewee)}
                                                        />
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
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
                            {filteredInterviewees.length > 0 ? (
                                filteredInterviewees.map((interviewee) => (
                                    <div
                                        key={interviewee.application_id}
                                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <p className="font-bold text-gray-900">
                                                    {interviewee.full_name}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500">
                                                    {interviewee.applicant_number}
                                                </p>
                                                <p className="mt-1 truncate text-xs text-gray-500">
                                                    {interviewee.email}
                                                </p>
                                            </div>

                                            <InterviewResultBadge
                                                result={
                                                    interviewee.interview_result ??
                                                    'Pending'
                                                }
                                            />
                                        </div>

                                        <div className="mt-4 grid grid-cols-2 gap-3">
                                            <MobileInfo
                                                label="Academic Year"
                                                value={
                                                    interviewee.academic_year
                                                        ? `AY ${interviewee.academic_year}`
                                                        : 'Not assigned'
                                                }
                                            />
                                            <MobileInfo
                                                label="Program"
                                                value={interviewee.program}
                                            />
                                        </div>

                                        <div className="mt-4 border-t border-gray-100 pt-4">
                                            <InterviewSchedule
                                                interviewee={interviewee}
                                                formatDate={formatDate}
                                                formatTime={formatTime}
                                            />
                                        </div>

                                        {interviewee.interview_instructions && (
                                            <div className="mt-4 rounded-xl bg-gray-50 p-3">
                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                                    Instructions
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-gray-700">
                                                    {interviewee.interview_instructions}
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-5">
                                            <InterviewActions
                                                interviewee={interviewee}
                                                finished={interviewFinished(interviewee)}
                                                onPass={() => openPassModal(interviewee)}
                                                onFail={() => openFailModal(interviewee)}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-gray-100 bg-white px-5 py-12 text-center shadow-sm">
                                    <EmptyState />
                                </div>
                            )}
                        </div>

                        <div className="mt-4 text-sm text-gray-500">
                            Showing <strong>{filteredInterviewees.length}</strong> of{' '}
                            <strong>{interviewees.length}</strong> interviewees
                        </div>
                    </div>
                </main>
            </div>

            {passTarget && (
                <Modal
                    title="Mark Interview as Passed"
                    onClose={() => setPassTarget(null)}
                >
                    <form onSubmit={submitPassed} className="space-y-5">
                        <IntervieweeModalHeader interviewee={passTarget} />
                        <InterviewSummary interviewee={passTarget} />

                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                            <p className="font-semibold">
                                Final List Qualification
                            </p>

                            <p className="mt-1 leading-6">
                                After confirmation, this applicant will be marked as
                                Passed and will automatically appear in the Final List
                                together with their registered email address.
                            </p>

                            <p className="mt-2 font-medium">
                                No interview result email is required for passed applicants.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setPassTarget(null)}
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={passForm.processing}
                                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {passForm.processing ? 'Saving...' : 'Confirm Passed'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {failTarget && (
                <Modal
                    title="Mark Interview as Failed"
                    onClose={() => setFailTarget(null)}
                >
                    <form onSubmit={submitFailed} className="space-y-5">
                        <IntervieweeModalHeader interviewee={failTarget} />
                        <InterviewSummary interviewee={failTarget} />

                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                            <p className="font-semibold">Email Notification</p>
                            <p className="mt-1 leading-6">
                                After confirmation, the applicant will receive an email
                                informing them that they did not pass the admission interview.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setFailTarget(null)}
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={failForm.processing}
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {failForm.processing ? 'Saving...' : 'Confirm Failed'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
        </>
    );
}

function NavigationItem({
    href,
    icon: Icon,
    label,
    active = false,
    maroon,
    onClick,
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={
                active
                    ? 'group flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-white shadow-sm transition'
                    : 'group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white'
            }
            style={
                active
                    ? {
                          backgroundColor:
                              maroon,
                      }
                    : {}
            }
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );
}

function SummaryCard({
    label,
    value,
    icon: Icon,
    maroon,
    type,
}) {
    let styles = {
        backgroundColor: '#f5e6e6',
        color: maroon ?? '#922b2b',
    };

    if (type === 'warning') {
        styles = {
            backgroundColor: '#fef3c7',
            color: '#a16207',
        };
    }

    if (type === 'success') {
        styles = {
            backgroundColor: '#dcfce7',
            color: '#15803d',
        };
    }

    if (type === 'danger') {
        styles = {
            backgroundColor: '#fee2e2',
            color: '#b91c1c',
        };
    }

    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={styles}
                >
                    <Icon size={21} />
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {label}
                    </p>
                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>
            </div>
        </div>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    allLabel,
    options,
}) {
    return (
        <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
                {label}
            </label>

            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/10"
            >
                <option value="All">{allLabel}</option>

                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function TableHeader({ children }) {
    return (
        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
            {children}
        </th>
    );
}

function InterviewSchedule({
    interviewee,
    formatDate,
    formatTime,
}) {
    return (
        <div className="space-y-1.5 text-sm">
            <p className="flex items-center gap-2 font-medium text-gray-800">
                <CalendarDays size={15} />
                {formatDate(interviewee.interview_date)}
            </p>

            <p className="flex items-center gap-2 text-gray-500">
                <Clock size={15} />
                {formatTime(interviewee.interview_time)}
            </p>

            <p className="flex items-start gap-2 text-gray-500">
                <MapPin size={15} className="mt-0.5 shrink-0" />
                <span>{interviewee.interview_venue}</span>
            </p>
        </div>
    );
}

function InterviewResultBadge({ result }) {
    let className = 'bg-yellow-100 text-yellow-800';

    if (result === 'Passed') {
        className = 'bg-green-100 text-green-700';
    }

    if (result === 'Failed') {
        className = 'bg-red-100 text-red-700';
    }

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${className}`}
        >
            {result}
        </span>
    );
}

function InterviewActions({
    interviewee,
    finished,
    onPass,
    onFail,
}) {
    const result = interviewee.interview_result ?? 'Pending';

    if (result !== 'Pending') {
        return (
            <div className="text-center">
                <p className="text-xs font-medium text-gray-500">
                    Interview result recorded.
                </p>
            </div>
        );
    }

    if (!finished) {
        return (
            <div className="text-center">
                <p className="text-xs font-medium text-gray-500">
                    Interview has not finished yet.
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap justify-center gap-2">
            <button
                type="button"
                onClick={onPass}
                className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
            >
                <CheckCircle2 size={15} />
                Passed
            </button>

            <button
                type="button"
                onClick={onFail}
                className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
            >
                <XCircle size={15} />
                Failed
            </button>
        </div>
    );
}

function Modal({ title, children, onClose }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-5 sm:p-6">{children}</div>
            </div>
        </div>
    );
}

function IntervieweeModalHeader({ interviewee }) {
    return (
        <div className="rounded-xl bg-gray-50 p-4">
            <p className="font-bold text-gray-900">
                {interviewee.full_name}
            </p>
            <p className="mt-1 text-sm text-gray-500">
                {interviewee.applicant_number} • {interviewee.program}
            </p>
            <p className="mt-1 text-sm text-gray-500">
                {interviewee.email}
            </p>
        </div>
    );
}

function InterviewSummary({ interviewee }) {
    return (
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-4 sm:grid-cols-2">
            <MobileInfo
                label="Interview Date"
                value={formatDate(interviewee.interview_date)}
            />
            <MobileInfo
                label="Interview Time"
                value={formatTime(interviewee.interview_time)}
            />
            <div className="sm:col-span-2">
                <MobileInfo
                    label="Venue"
                    value={interviewee.interview_venue}
                />
            </div>
        </div>
    );
}

function FormField({ label, error, children }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
                {label}
            </label>
            {children}
            {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

function MobileInfo({ label, value }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
                {value || 'Not available'}
            </p>
        </div>
    );
}

function EmptyState() {
    return (
        <div>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <CalendarCheck size={26} />
            </div>
            <h3 className="mt-4 font-semibold text-gray-800">
                No interviewees found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
                Try changing your search or filters.
            </p>
        </div>
    );
}

function formatDate(date) {
    if (!date) {
        return 'Not available';
    }

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatTime(time) {
    if (!time) {
        return 'Not available';
    }

    const [hours, minutes] = String(time).split(':').map(Number);
    const value = new Date();

    value.setHours(hours, minutes, 0, 0);

    return value.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}

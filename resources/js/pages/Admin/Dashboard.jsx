
import { Head, Link } from '@inertiajs/react';

import {
    LayoutDashboard,
    FileText,
    UserCheck,
    CalendarCheck,
    Clock,
    CheckCircle,
    XCircle,
    Calendar,
    CalendarDays,
    LogOut,
    Menu,
    X,
    ChevronRight,
    TrendingUp,
    ClipboardCheck,
} from 'lucide-react';

import { useState } from 'react';

export default function Dashboard({
    statistics = {},
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const maroon = '#922b2b';

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gray-50">

                {/* =====================================================
                    MOBILE HEADER
                ===================================================== */}

                <header
                    className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 text-white shadow-md lg:hidden"
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

                        <div className="flex items-center gap-2">
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

                    </div>

                </header>


                {/* =====================================================
                    MOBILE OVERLAY
                ===================================================== */}

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}


                {/* =====================================================
                    SIDEBAR
                ===================================================== */}

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
                        ${sidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                        }
                    `}
                    style={{ backgroundColor: '#691f1f' }}
                >

                    {/* =================================================
                        SIDEBAR BRAND
                    ================================================= */}

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


                            {/* CLOSE MOBILE SIDEBAR */}

                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="ml-auto rounded-lg p-2 text-white/80 hover:bg-white/10 lg:hidden"
                                aria-label="Close navigation"
                            >
                                <X size={20} />
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        NAVIGATION
                    ================================================= */}

                    <nav className="flex-1 space-y-1 px-3 py-5">

                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            Main Menu
                        </p>


                        {/* DASHBOARD */}

                        <Link
                            href="/admin/dashboard"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-white shadow-sm transition"
                            style={{
                                backgroundColor: '#922b2b',
                            }}
                        >

                            <LayoutDashboard size={20} />

                            <span>Dashboard</span>

                        </Link>


                        {/* APPLICATIONS */}

                        <Link
                            href="/admin/applications"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                        >

                            <FileText size={20} />

                            <span>Applications</span>

                        </Link>
                        {/* EXAMINEES */}

                        <Link
                            href="/admin/examinees"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                        >

                            <UserCheck size={20} />

                            <span>Examinees</span>

                        </Link>


                        {/* INTERVIEWEES */}

                        <Link
                            href="/admin/interviewees"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                        >

                            <CalendarCheck size={20} />

                            <span>Interviewees</span>

                        </Link>

                        {/* FINAL LIST */}

                        <Link
                            href="/admin/final-list"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                            <ClipboardCheck size={20} />
                            <span>Final List</span>
                        </Link>


                        {/* EXAMINATION */}

                        <Link
                            href="/admin/examination-schedules"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                        >

                            <CalendarDays size={20} />

                            <span>Examination Schedules</span>

                        </Link>

                    </nav>


                    {/* =================================================
                        SIDEBAR FOOTER
                    ================================================= */}

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


                {/* =====================================================
                    MAIN CONTENT
                ================================================= */}

                <main className="min-h-screen lg:ml-64">

                    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p
                                    className="mb-2 text-sm font-semibold"
                                    style={{ color: maroon }}
                                >
                                    ADMINISTRATION PORTAL
                                </p>

                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                                    Dashboard
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm text-gray-500 sm:text-base">
                                    Monitor applications, applicants, and examination schedules from one place.
                                </p>

                            </div>


                            {/* QUICK EXAMINATION BUTTON */}

                            <Link
                                href="/admin/examination-schedules"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
                                style={{ backgroundColor: maroon }}
                            >

                                <Calendar size={18} />

                                Manage Examinations

                            </Link>

                        </div>


                        {/* =================================================
                            OVERVIEW TITLE
                        ================================================= */}

                        <div className="mb-4 flex items-center gap-2">

                            <TrendingUp
                                size={19}
                                style={{ color: maroon }}
                            />

                            <h2 className="text-lg font-bold text-gray-900">
                                Application Overview
                            </h2>

                        </div>


                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            {/* TOTAL APPLICATIONS */}

                            <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-gray-500">
                                            Total Applications
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-gray-900">
                                            {statistics.totalApplications ?? 0}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            All submitted applications
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-purple-50 p-3 text-purple-700">
                                        <FileText size={23} />
                                    </div>

                                </div>

                            </div>


                            {/* PENDING */}

                            <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-gray-500">
                                            Pending
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-gray-900">
                                            {statistics.pendingApplications ?? 0}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            Awaiting review
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-yellow-50 p-3 text-yellow-700">
                                        <Clock size={23} />
                                    </div>

                                </div>

                            </div>


                            {/* UNDER REVIEW */}

                            <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-6">

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-gray-500">
                                            Under Review
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-gray-900">
                                            {statistics.underReviewApplications ?? 0}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            Currently being reviewed
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-orange-50 p-3 text-orange-700">
                                        <ClipboardCheck size={23} />
                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            APPLICATION STATUS
                        ================================================= */}

                        <div className="mt-8 mb-4 flex items-center gap-2">

                            <ClipboardCheck
                                size={19}
                                style={{ color: maroon }}
                            />

                            <h2 className="text-lg font-bold text-gray-900">
                                Application Status
                            </h2>

                        </div>


                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

                            {/* APPROVED */}

                            <div className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-gray-500">
                                            Approved Applications
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-green-700">
                                            {statistics.approvedApplications ?? 0}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            Successfully approved
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-green-50 p-3 text-green-700">
                                        <CheckCircle size={25} />
                                    </div>

                                </div>

                            </div>


                            {/* DECLINED */}

                            <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm sm:p-6">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm font-medium text-gray-500">
                                            Declined Applications
                                        </p>

                                        <p className="mt-2 text-3xl font-bold text-red-700">
                                            {statistics.declinedApplications ?? 0}
                                        </p>

                                        <p className="mt-2 text-xs text-gray-400">
                                            Applications not approved
                                        </p>

                                    </div>

                                    <div className="rounded-xl bg-red-50 p-3 text-red-700">
                                        <XCircle size={25} />
                                    </div>

                                </div>

                            </div>


                        </div>


                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <div className="mt-10">

                            <div className="mb-4">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Quick Actions
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Quickly access the most frequently used administrative functions.
                                </p>

                            </div>


                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                                {/* APPLICATIONS */}

                                <Link
                                    href="/admin/applications"
                                    className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md sm:p-6"
                                >

                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: '#f5e6e6',
                                            color: maroon,
                                        }}
                                    >
                                        <FileText size={24} />
                                    </div>

                                    <div className="mt-5 flex items-center justify-between">

                                        <h3 className="font-bold text-gray-900">
                                            Review Applications
                                        </h3>

                                        <ChevronRight
                                            size={18}
                                            className="text-gray-300 transition group-hover:translate-x-1"
                                        />

                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        View submitted applications, check requirements, and update application status.
                                    </p>

                                </Link>


                                {/* EXAMINATIONS */}

                                <Link
                                    href="/admin/examination-schedules"
                                    className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-red-200 hover:shadow-md sm:p-6"
                                >

                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-xl"
                                        style={{
                                            backgroundColor: '#f5e6e6',
                                            color: maroon,
                                        }}
                                    >
                                        <Calendar size={24} />
                                    </div>

                                    <div className="mt-5 flex items-center justify-between">

                                        <h3 className="font-bold text-gray-900">
                                            Examination Schedules
                                        </h3>

                                        <ChevronRight
                                            size={18}
                                            className="text-gray-300 transition group-hover:translate-x-1"
                                        />

                                    </div>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        Create and manage examination dates, times, venues, and available slots.
                                    </p>

                                </Link>

                            </div>

                        </div>


                        {/* =================================================
                            EXAMINATION NOTICE
                        ================================================= */}

                        <div
                            className="mt-8 overflow-hidden rounded-2xl p-5 shadow-sm sm:p-6"
                            style={{
                                backgroundColor: '#f9eeee',
                                border: '1px solid #ead0d0',
                            }}
                        >

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">

                                <div
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                                    style={{
                                        backgroundColor: '#f1d9d9',
                                        color: maroon,
                                    }}
                                >
                                    <Calendar size={24} />
                                </div>


                                <div className="flex-1">

                                    <h2
                                        className="font-bold"
                                        style={{ color: '#691f1f' }}
                                    >
                                        Examination Schedule Management
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Manage available examination dates and times that approved applicants can select.
                                    </p>


                                    <Link
                                        href="/admin/examination-schedules"
                                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
                                        style={{
                                            backgroundColor: maroon,
                                        }}
                                    >

                                        <Calendar size={17} />

                                        Manage Examination Schedules

                                        <ChevronRight size={16} />

                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div className="mt-10 border-t border-gray-200 pt-5 text-center sm:text-left">

                            <p className="text-xs text-gray-400">
                                USeP School of Law Admission Portal • Administration
                            </p>

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}


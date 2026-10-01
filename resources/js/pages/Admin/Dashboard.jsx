import PortalLayout from '@/layouts/portal-layout';

import { Head, Link } from '@inertiajs/react';

import { FileText, CheckCircle, XCircle, Calendar, ChevronRight, TrendingUp, ClipboardCheck } from 'lucide-react';


export default function Dashboard({
    statistics = {},
}) {

    const maroon = '#922b2b';

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="min-h-screen bg-gray-50">


                {/* =====================================================
                    MAIN CONTENT
                ================================================= */}

                <PortalLayout audience="admin">

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


                            {/* PENDING SUBMITTED APPLICATIONS */}

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
                                            Submitted and awaiting a decision
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

                </PortalLayout>

            </div>
        </>
    );
}

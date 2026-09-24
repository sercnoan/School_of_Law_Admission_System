import { Head, Link, router } from '@inertiajs/react';

import {
    LayoutDashboard,
    FileText,
    UserCheck,
    CalendarCheck,
    ClipboardCheck,
    CalendarDays,
    LogOut,
    Menu,
    X,
    ArrowLeft,
    User,
    GraduationCap,
    ClipboardList,
    CheckCircle,
    XCircle,
    Clock,
    ExternalLink,
    Download,
} from 'lucide-react';

import { useState } from 'react';

export default function ApplicationDetails({
    application,
    requirements = [],
}) {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    const [remarks, setRemarks] = useState(
        application.remarks || ''
    );

    const [requirementRemarks, setRequirementRemarks] =
        useState({});

    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    /*
    |--------------------------------------------------------------------------
    | Format File Size
    |--------------------------------------------------------------------------
    */

    const formatFileSize = (size) => {
        if (!size) {
            return 'Unknown size';
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(size / 1024).toFixed(1)} KB`;
        }

        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    };

    /*
    |--------------------------------------------------------------------------
    | Application Status
    |--------------------------------------------------------------------------
    */

    const getStatusClass = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-100 text-green-700';

            case 'Declined':
                return 'bg-red-100 text-red-700';

            case 'Under Review':
                return 'bg-orange-100 text-orange-700';

            case 'Completed':
                return 'bg-blue-100 text-blue-700';

            default:
                return 'bg-yellow-100 text-yellow-700';
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Requirement Status
    |--------------------------------------------------------------------------
    */

    const getRequirementStatus = (requirement) => {
        if (!requirement.submitted) {
            return {
                label: 'Not Submitted',
                className: 'bg-gray-100 text-gray-600',
            };
        }

        if (
            requirement.submission?.verification_status ===
            'Approved'
        ) {
            return {
                label: 'Approved',
                className: 'bg-green-100 text-green-700',
            };
        }

        if (
            requirement.submission?.verification_status ===
            'Declined'
        ) {
            return {
                label: 'Declined',
                className: 'bg-red-100 text-red-700',
            };
        }

        return {
            label: 'Pending Review',
            className: 'bg-yellow-100 text-yellow-700',
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Count Submitted Requirements
    |--------------------------------------------------------------------------
    */

    const submittedCount = requirements.filter(
        (requirement) => requirement.submitted
    ).length;

    const totalRequirements = requirements.length;

    /*
    |--------------------------------------------------------------------------
    | Update Application Status
    |--------------------------------------------------------------------------
    */

    const updateApplicationStatus = (status) => {
        const confirmed = window.confirm(
            `Are you sure you want to mark this application as ${status}?`
        );

        if (!confirmed) {
            return;
        }

        router.post(
            `/admin/applications/${application.application_id}/status`,
            {
                application_status: status,
                remarks: remarks,
            },
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Verify Requirement
    |--------------------------------------------------------------------------
    */

    const verifyRequirement = (
        requirement,
        status
    ) => {
        if (!requirement.submitted) {
            return;
        }

        let message;

        if (status === 'Approved') {
            message =
                'Are you sure you want to approve this document?';
        } else {
            message =
                'Are you sure you want to decline this document?';
        }

        const confirmed = window.confirm(message);

        if (!confirmed) {
            return;
        }

        const submissionId =
            requirement.submission.submission_id;

        router.post(
            `/admin/applications/${application.application_id}/requirements/${submissionId}/verify`,
            {
                verification_status: status,
                remarks:
                    requirementRemarks[submissionId] || '',
            },
            {
                preserveScroll: true,
            }
        );
    };

    /*
    |--------------------------------------------------------------------------
    | Requirement Remarks
    |--------------------------------------------------------------------------
    */

    const updateRequirementRemarks = (
        submissionId,
        value
    ) => {
        setRequirementRemarks((previous) => ({
            ...previous,
            [submissionId]: value,
        }));
    };

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head title="Application Details" />

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
                    style={{ backgroundColor: darkMaroon }}
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


                        <Link
                            href="/admin/dashboard"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>


                        <Link
                            href="/admin/applications"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-white shadow-sm transition"
                            style={{ backgroundColor: maroon }}
                        >
                            <FileText size={20} />
                            <span>Applications</span>
                        </Link>
                        <Link
                            href="/admin/examinees"
                            onClick={() => setSidebarOpen(false)}
                            className="group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                            <UserCheck size={20} />
                            <span>Examinees</span>
                        </Link>


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
                ===================================================== */}

                <main className="min-h-screen lg:ml-64">

                    <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

                        <div className="mx-auto max-w-7xl">

                            {/* =================================================
                                HEADER
                            ================================================= */}

                            <div className="mb-6">

                                <Link
                                    href="/admin/applications"
                                    className="
                                        mb-4
                                        inline-flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-medium
                                        text-[#922b2b]
                                        hover:text-[#7c2424]
                                    "
                                >
                                    <ArrowLeft size={18} />

                                    Back to Applications
                                </Link>

                                <div
                                    className="
                                        flex
                                        flex-col
                                        justify-between
                                        gap-4
                                        md:flex-row
                                        md:items-center
                                    "
                                >

                                    <div>

                                        <div
                                            className="
                                                mb-2
                                                flex
                                                items-center
                                                gap-2
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wider
                                                text-[#922b2b]
                                            "
                                        >
                                            <FileText size={15} />

                                            Admission Management
                                        </div>

                                        <h1
                                            className="
                                                text-2xl
                                                font-bold
                                                tracking-tight
                                                text-gray-900
                                                sm:text-3xl
                                            "
                                        >
                                            Application Details
                                        </h1>

                                        <p className="mt-1 text-sm text-gray-600">
                                            Application #
                                            {application.application_id}
                                        </p>

                                    </div>

                                    <span
                                        className={`
                                            inline-flex
                                            w-fit
                                            rounded-full
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            ${getStatusClass(
                                                application.application_status
                                            )}
                                        `}
                                    >
                                        {application.application_status}
                                    </span>

                                </div>

                            </div>

                            {/* =================================================
                                APPLICANT INFORMATION
                            ================================================= */}

                            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="flex items-center gap-3 border-b px-6 py-5">

                                    <div className="rounded-lg bg-[#922b2b]/10 p-2 text-[#922b2b]">
                                        <User size={22} />
                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-gray-900">
                                            Applicant Information
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Personal details of the applicant
                                        </p>

                                    </div>

                                </div>

                                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Full Name
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.full_name}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Applicant Number
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.applicant_number}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Email
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.email}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Age
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.age}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Gender
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.gender}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Contact Number
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.contact_number}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Civil Status
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.civil_status}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Religion
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.religion || 'N/A'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Employment Status
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.employment_status}
                                        </p>
                                    </div>

                                    <div className="md:col-span-2 lg:col-span-3">

                                        <p className="text-sm text-gray-500">
                                            Present Address
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.present_address}
                                        </p>

                                    </div>

                                    <div className="md:col-span-2">

                                        <p className="text-sm text-gray-500">
                                            School Graduated
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.school_graduated}
                                        </p>

                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                ADDITIONAL INFORMATION
                            ================================================= */}

                            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="flex items-center gap-3 border-b px-6 py-5">

                                    <div className="rounded-lg bg-purple-100 p-2 text-purple-800">
                                        <User size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Additional Information
                                        </h2>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Individual Income
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            ₱
                                            {Number(
                                                application.individual_income || 0
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Family Income
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            ₱
                                            {Number(
                                                application.family_income || 0
                                            ).toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Indigenous Community
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.is_indigenous
                                                ? application.indigenous_community || 'Yes'
                                                : 'No'}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            PWD
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {application.is_pwd
                                                ? application.pwd_type || 'Yes'
                                                : 'No'}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                APPLICATION INFORMATION
                            ================================================= */}

                            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="flex items-center gap-3 border-b px-6 py-5">

                                    <div className="rounded-lg bg-green-100 p-2 text-green-800">
                                        <GraduationCap size={22} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Application Information
                                        </h2>
                                    </div>

                                </div>

                                <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Program
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-gray-900">
                                            {application.program}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Date Submitted
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {formatDate(
                                                application.submitted_at
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Documents Submitted
                                        </p>

                                        <p className="mt-1 font-semibold text-gray-900">
                                            {submittedCount} / {totalRequirements}
                                        </p>
                                    </div>

                                </div>

                            </div>

                            {/* =================================================
                                REQUIREMENTS
                            ================================================= */}

                            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="flex items-center gap-3 border-b px-6 py-5">

                                    <div className="rounded-lg bg-orange-100 p-2 text-orange-800">
                                        <ClipboardList size={22} />
                                    </div>

                                    <div>

                                        <h2 className="text-lg font-bold text-gray-900">
                                            Requirements
                                        </h2>

                                        <p className="text-sm text-gray-500">
                                            Review and download each submitted document
                                        </p>

                                    </div>

                                </div>

                                <div className="divide-y">

                                    {requirements.length > 0 ? (

                                        requirements.map((requirement) => {

                                            const status =
                                                getRequirementStatus(
                                                    requirement
                                                );

                                            const submission =
                                                requirement.submission;

                                            return (

                                                <div
                                                    key={
                                                        requirement.requirement_id
                                                    }
                                                    className="px-6 py-6"
                                                >

                                                    {/* Requirement Header */}

                                                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                                                        <div className="flex items-start gap-4">

                                                            <div className="mt-1">

                                                                {requirement.submitted ? (

                                                                    requirement.submission?.verification_status ===
                                                                    'Approved' ? (

                                                                        <CheckCircle
                                                                            size={22}
                                                                            className="text-green-600"
                                                                        />

                                                                    ) : requirement.submission?.verification_status ===
                                                                      'Declined' ? (

                                                                        <XCircle
                                                                            size={22}
                                                                            className="text-red-600"
                                                                        />

                                                                    ) : (

                                                                        <Clock
                                                                            size={22}
                                                                            className="text-yellow-500"
                                                                        />

                                                                    )

                                                                ) : (

                                                                    <Clock
                                                                        size={22}
                                                                        className="text-gray-400"
                                                                    />

                                                                )}

                                                            </div>

                                                            <div>

                                                                <h3 className="font-semibold text-gray-900">
                                                                    {
                                                                        requirement.requirement_name
                                                                    }
                                                                </h3>

                                                                {requirement.description && (

                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        {
                                                                            requirement.description
                                                                        }
                                                                    </p>

                                                                )}

                                                            </div>

                                                        </div>

                                                        <span
                                                            className={`
                                                                w-fit
                                                                rounded-full
                                                                px-3
                                                                py-1
                                                                text-xs
                                                                font-semibold
                                                                ${status.className}
                                                            `}
                                                        >
                                                            {status.label}
                                                        </span>

                                                    </div>

                                                    {/* Submitted Document */}

                                                    {requirement.submitted &&
                                                        submission && (

                                                            <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">

                                                                <div
                                                                    className="
                                                                        flex
                                                                        flex-col
                                                                        gap-4
                                                                        md:flex-row
                                                                        md:items-center
                                                                        md:justify-between
                                                                    "
                                                                >

                                                                    <div className="min-w-0">

                                                                        <p className="text-sm text-gray-500">
                                                                            Submitted File
                                                                        </p>

                                                                        <p className="mt-1 break-all font-medium text-gray-900">
                                                                            {
                                                                                submission.file_name
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-gray-500">

                                                                            {formatFileSize(
                                                                                submission.file_size
                                                                            )}

                                                                            {' • '}

                                                                            Uploaded{' '}

                                                                            {formatDate(
                                                                                submission.uploaded_at
                                                                            )}

                                                                        </p>

                                                                    </div>

                                                                    {/* FILE ACTIONS */}

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            flex-col
                                                                            gap-2
                                                                            sm:flex-row
                                                                            sm:flex-wrap
                                                                        "
                                                                    >

                                                                        {/* VIEW */}

                                                                        <a
                                                                            href={`/storage/${submission.file_path}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="
                                                                                inline-flex
                                                                                items-center
                                                                                justify-center
                                                                                gap-2
                                                                                rounded-lg
                                                                                border
                                                                                border-[#922b2b]
                                                                                bg-white
                                                                                px-4
                                                                                py-2.5
                                                                                text-sm
                                                                                font-medium
                                                                                text-[#922b2b]
                                                                                transition
                                                                                hover:bg-[#922b2b]/5
                                                                            "
                                                                        >

                                                                            <ExternalLink
                                                                                size={16}
                                                                            />

                                                                            View Document

                                                                        </a>

                                                                        {/* DOWNLOAD */}

                                                                        <a
                                                                            href={`/admin/requirements/${submission.submission_id}/download`}
                                                                            className="
                                                                                inline-flex
                                                                                items-center
                                                                                justify-center
                                                                                gap-2
                                                                                rounded-lg
                                                                                bg-[#922b2b]
                                                                                px-4
                                                                                py-2.5
                                                                                text-sm
                                                                                font-semibold
                                                                                text-white
                                                                                transition
                                                                                hover:bg-[#7c2424]
                                                                            "
                                                                        >

                                                                            <Download
                                                                                size={16}
                                                                            />

                                                                            Download PDF

                                                                        </a>

                                                                    </div>

                                                                </div>

                                                                {/* Remarks */}

                                                                <div className="mt-4">

                                                                    <label
                                                                        className="
                                                                            mb-2
                                                                            block
                                                                            text-sm
                                                                            font-medium
                                                                            text-gray-700
                                                                        "
                                                                    >
                                                                        Verification Remarks
                                                                    </label>

                                                                    <textarea
                                                                        value={
                                                                            requirementRemarks[
                                                                                submission.submission_id
                                                                            ] ??
                                                                            submission.remarks ??
                                                                            ''
                                                                        }
                                                                        onChange={(e) =>
                                                                            updateRequirementRemarks(
                                                                                submission.submission_id,
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        rows={3}
                                                                        placeholder="Add remarks about this document..."
                                                                        className="
                                                                            w-full
                                                                            rounded-lg
                                                                            border
                                                                            border-gray-300
                                                                            bg-white
                                                                            px-4
                                                                            py-3
                                                                            text-sm
                                                                            text-gray-900
                                                                            outline-none
                                                                            placeholder:text-gray-400
                                                                            focus:border-[#922b2b]
                                                                            focus:ring-2
                                                                            focus:ring-[#922b2b]/10
                                                                        "
                                                                    />

                                                                </div>

                                                                {/* Verification Buttons */}

                                                                <div className="mt-4 flex flex-wrap gap-3">

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            verifyRequirement(
                                                                                requirement,
                                                                                'Approved'
                                                                            )
                                                                        }
                                                                        className="
                                                                            inline-flex
                                                                            items-center
                                                                            gap-2
                                                                            rounded-lg
                                                                            bg-green-600
                                                                            px-4
                                                                            py-2.5
                                                                            text-sm
                                                                            font-medium
                                                                            text-white
                                                                            transition
                                                                            hover:bg-green-700
                                                                        "
                                                                    >

                                                                        <CheckCircle
                                                                            size={17}
                                                                        />

                                                                        Approve Document

                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            verifyRequirement(
                                                                                requirement,
                                                                                'Declined'
                                                                            )
                                                                        }
                                                                        className="
                                                                            inline-flex
                                                                            items-center
                                                                            gap-2
                                                                            rounded-lg
                                                                            bg-red-600
                                                                            px-4
                                                                            py-2.5
                                                                            text-sm
                                                                            font-medium
                                                                            text-white
                                                                            transition
                                                                            hover:bg-red-700
                                                                        "
                                                                    >

                                                                        <XCircle
                                                                            size={17}
                                                                        />

                                                                        Decline Document

                                                                    </button>

                                                                </div>

                                                            </div>

                                                        )}

                                                    {/* Not Submitted */}

                                                    {!requirement.submitted && (

                                                        <div
                                                            className="
                                                                mt-4
                                                                rounded-lg
                                                                border
                                                                border-dashed
                                                                border-gray-300
                                                                bg-gray-50
                                                                p-4
                                                            "
                                                        >

                                                            <p className="text-sm text-gray-500">
                                                                The applicant has not submitted this requirement yet.
                                                            </p>

                                                        </div>

                                                    )}

                                                </div>

                                            );

                                        })

                                    ) : (

                                        <div className="px-6 py-12 text-center">

                                            <FileText
                                                size={40}
                                                className="mx-auto text-gray-300"
                                            />

                                            <p className="mt-3 font-medium text-gray-600">
                                                No requirements found.
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                            {/* =================================================
                                APPLICATION DECISION
                            ================================================= */}

                            <div className="mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                                <div className="border-b px-6 py-5">

                                    <h2 className="text-lg font-bold text-gray-900">
                                        Application Decision
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Review the complete application and provide a final decision.
                                    </p>

                                </div>

                                <div className="p-6">

                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Application Remarks
                                    </label>

                                    <textarea
                                        value={remarks}
                                        onChange={(e) =>
                                            setRemarks(e.target.value)
                                        }
                                        rows={5}
                                        placeholder="Enter remarks for this application..."
                                        className="
                                            w-full
                                            rounded-lg
                                            border
                                            border-gray-300
                                            bg-white
                                            px-4
                                            py-3
                                            text-gray-900
                                            outline-none
                                            placeholder:text-gray-400
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />

                                    <div className="mt-5 flex flex-wrap gap-3">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    'Under Review'
                                                )
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-lg
                                                bg-orange-600
                                                px-5
                                                py-3
                                                font-medium
                                                text-white
                                                transition
                                                hover:bg-orange-700
                                            "
                                        >
                                            <Clock size={18} />

                                            Mark Under Review
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    'Approved'
                                                )
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-lg
                                                bg-green-600
                                                px-5
                                                py-3
                                                font-medium
                                                text-white
                                                transition
                                                hover:bg-green-700
                                            "
                                        >
                                            <CheckCircle size={18} />

                                            Approve Application
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateApplicationStatus(
                                                    'Declined'
                                                )
                                            }
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-lg
                                                bg-red-600
                                                px-5
                                                py-3
                                                font-medium
                                                text-white
                                                transition
                                                hover:bg-red-700
                                            "
                                        >
                                            <XCircle size={18} />

                                            Decline Application
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}
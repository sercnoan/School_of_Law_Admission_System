import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import {
    LayoutDashboard,
    User,
    FileText,
    GraduationCap,
    LogOut,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    RefreshCw,
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    ClipboardList,
    Menu,
    X,
} from 'lucide-react';

import { useState } from 'react';


export default function Requirements({
    application,
    requirements = [],
    submissions = [],
}) {
    const { flash } = usePage().props;

    const [uploading, setUploading] =
        useState(null);

    const [errors, setErrors] =
        useState({});

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';


    /*
    |--------------------------------------------------------------------------
    | Find Submission
    |--------------------------------------------------------------------------
    */

    const getSubmission = (
        requirementId
    ) => {
        return submissions.find(
            (submission) =>
                Number(
                    submission.requirement_id
                ) === Number(requirementId)
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Verification Status
    |--------------------------------------------------------------------------
    */

    const getVerificationStatus = (
        submission
    ) => {
        if (!submission) {
            return {
                label: 'Not Submitted',
                className:
                    'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
                icon: Clock,
            };
        }

        switch (
            submission.verification_status
        ) {
            case 'Approved':
                return {
                    label: 'Approved',
                    className:
                        'bg-green-50 text-green-700 ring-1 ring-green-200',
                    icon: CheckCircle,
                };

            case 'Declined':
                return {
                    label: 'Declined',
                    className:
                        'bg-red-50 text-red-700 ring-1 ring-red-200',
                    icon: XCircle,
                };

            default:
                return {
                    label: 'Pending Review',
                    className:
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
                    icon: Clock,
                };
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Application Status
    |--------------------------------------------------------------------------
    */

    const getApplicationStatusClass = (
        status
    ) => {
        switch (status) {
            case 'Approved':
                return 'bg-green-50 text-green-700 ring-1 ring-green-200';

            case 'Declined':
                return 'bg-red-50 text-red-700 ring-1 ring-red-200';

            case 'Under Review':
                return 'bg-orange-50 text-orange-700 ring-1 ring-orange-200';

            case 'Completed':
                return 'bg-blue-50 text-blue-700 ring-1 ring-blue-200';

            default:
                return 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200';
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Format File Size
    |--------------------------------------------------------------------------
    */

    const formatFileSize = (size) => {
        if (!size) {
            return '';
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(
                size / 1024
            ).toFixed(1)} KB`;
        }

        return `${(
            size /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };


    /*
    |--------------------------------------------------------------------------
    | Upload Requirement
    |--------------------------------------------------------------------------
    */

    const handleUpload = (
        requirementId,
        file
    ) => {
        if (!file) {
            return;
        }

        setUploading(requirementId);

        setErrors((previous) => ({
            ...previous,
            [requirementId]: null,
        }));

        const formData =
            new FormData();

        formData.append(
            'file',
            file
        );

        router.post(
            `/applicant/requirements/${requirementId}/upload`,
            formData,
            {
                forceFormData: true,
                preserveScroll: true,

                onError: (error) => {
                    setErrors(
                        (previous) => ({
                            ...previous,

                            [requirementId]:
                                error.file ||
                                'Unable to upload the file.',
                        })
                    );
                },

                onFinish: () => {
                    setUploading(null);
                },
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Submit Application
    |--------------------------------------------------------------------------
    */

    const handleSubmitApplication =
        () => {
            const confirmed =
                window.confirm(
                    'Are you sure you want to submit your application? Make sure all required documents are uploaded.'
                );

            if (!confirmed) {
                return;
            }

            router.post(
                '/applicant/requirements/submit',
                {},
                {
                    preserveScroll: true,
                }
            );
        };


    /*
    |--------------------------------------------------------------------------
    | Statistics
    |--------------------------------------------------------------------------
    */

    const submittedCount =
        requirements.filter(
            (requirement) =>
                getSubmission(
                    requirement.requirement_id
                )
        ).length;


    const approvedCount =
        requirements.filter(
            (requirement) => {
                const submission =
                    getSubmission(
                        requirement.requirement_id
                    );

                return (
                    submission
                        ?.verification_status ===
                    'Approved'
                );
            }
        ).length;


    const declinedCount =
        requirements.filter(
            (requirement) => {
                const submission =
                    getSubmission(
                        requirement.requirement_id
                    );

                return (
                    submission
                        ?.verification_status ===
                    'Declined'
                );
            }
        ).length;


    /*
    |--------------------------------------------------------------------------
    | Required Requirements
    |--------------------------------------------------------------------------
    */

    const requiredRequirements =
        requirements.filter(
            (requirement) =>
                requirement.is_required
        );


    const requiredSubmittedCount =
        requiredRequirements.filter(
            (requirement) =>
                getSubmission(
                    requirement.requirement_id
                )
        ).length;


    const allRequiredSubmitted =
        requiredRequirements.length >
            0 &&
        requiredSubmittedCount ===
            requiredRequirements.length;


    /*
    |--------------------------------------------------------------------------
    | Progress
    |--------------------------------------------------------------------------
    */

    const progressPercentage =
        requiredRequirements.length > 0
            ? Math.round(
                  (requiredSubmittedCount /
                      requiredRequirements.length) *
                      100
              )
            : 0;


    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const navigation = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
        },
        {
            label: 'Choose Program',
            href: '/applicant/program',
            icon: GraduationCap,
        },
        {
            label: 'Requirements',
            href: '/applicant/requirements',
            icon: FileText,
        },
        {
            label: 'Examination',
            href: '/applicant/examination',
            icon: CalendarDays,
        },
        {
            label: 'Application Status',
            href: '/applicant/status',
            icon: ClipboardList,
        },
        {
            label: 'Personal Information',
            href: '/personal-details',
            icon: User,
        },
    ];


    return (
        <>
            <Head title="Requirements" />

            <div className="min-h-screen bg-gray-50">

                {/* =====================================================
                    MOBILE HEADER
                ===================================================== */}

                <header
                    className="
                        sticky
                        top-0
                        z-40
                        flex
                        h-16
                        items-center
                        justify-between
                        px-4
                        text-white
                        shadow-md
                        lg:hidden
                    "
                    style={{
                        backgroundColor:
                            maroon,
                    }}
                >

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(
                                    true
                                )
                            }
                            className="
                                rounded-lg
                                p-2
                                transition
                                hover:bg-white/10
                            "
                            aria-label="Open navigation"
                        >
                            <Menu size={23} />
                        </button>


                        <div className="flex items-center gap-2">

                            <img
                                src="/images/law-logo.jpeg"
                                alt="USeP School of Law"
                                className="
                                    h-9
                                    w-9
                                    rounded-full
                                    bg-white
                                    object-contain
                                "
                            />

                            <div>

                                <p className="text-sm font-bold leading-tight">
                                    USeP School of Law
                                </p>

                                <p className="text-[11px] text-white/75">
                                    Admission Portal
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
                        className="
                            fixed
                            inset-0
                            z-40
                            bg-black/50
                            lg:hidden
                        "
                        onClick={() =>
                            setSidebarOpen(
                                false
                            )
                        }
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

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <div className="border-b border-white/10 px-5 py-6">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    p-1
                                "
                            >

                                <img
                                    src="/images/law-logo.jpeg"
                                    alt="USeP School of Law"
                                    className="
                                        h-full
                                        w-full
                                        rounded-full
                                        object-contain
                                    "
                                />

                            </div>


                            <div className="min-w-0">

                                <h1 className="truncate text-base font-bold">
                                    USeP School of Law
                                </h1>

                                <p className="mt-0.5 text-xs text-white/65">
                                    Admission Portal
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={() =>
                                    setSidebarOpen(
                                        false
                                    )
                                }
                                className="
                                    ml-auto
                                    rounded-lg
                                    p-2
                                    text-white/80
                                    transition
                                    hover:bg-white/10
                                    lg:hidden
                                "
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

                        <p
                            className="
                                mb-3
                                px-3
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-widest
                                text-white/40
                            "
                        >
                            Main Menu
                        </p>


                        {navigation.map(
                            (item) => {
                                const Icon =
                                    item.icon;

                                const active =
                                    item.label ===
                                    'Requirements';

                                return (

                                    <Link
                                        key={
                                            item.label
                                        }
                                        href={
                                            item.href
                                        }
                                        onClick={() =>
                                            setSidebarOpen(
                                                false
                                            )
                                        }
                                        className={`
                                            flex
                                            items-center
                                            gap-3
                                            rounded-xl
                                            px-4
                                            py-3
                                            transition

                                            ${
                                                active
                                                    ? 'font-medium text-white shadow-sm'
                                                    : 'text-white/75 hover:bg-white/10 hover:text-white'
                                            }
                                        `}
                                        style={
                                            active
                                                ? {
                                                      backgroundColor:
                                                          maroon,
                                                  }
                                                : {}
                                        }
                                    >

                                        <Icon
                                            size={
                                                20
                                            }
                                        />

                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>

                                    </Link>

                                );
                            }
                        )}

                    </nav>


                    {/* =================================================
                        LOGOUT
                    ================================================= */}

                    <div className="border-t border-white/10 p-3">

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="
                                flex
                                w-full
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-sm
                                font-medium
                                text-white/75
                                transition
                                hover:bg-white/10
                                hover:text-white
                            "
                        >

                            <LogOut size={19} />

                            <span>
                                Logout
                            </span>

                        </Link>

                    </div>

                </aside>


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <main className="min-h-screen lg:ml-64">

                    <div
                        className="
                            mx-auto
                            max-w-[1600px]
                            px-4
                            py-6
                            sm:px-6
                            sm:py-8
                            lg:px-8
                            lg:py-10
                        "
                    >

                        <div className="mx-auto max-w-6xl">


                            {/* =================================================
                                BACK
                            ================================================= */}

                            <Link
                                href="/dashboard"
                                className="
                                    mb-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-semibold
                                    transition
                                    hover:opacity-75
                                "
                                style={{
                                    color: maroon,
                                }}
                            >

                                <ArrowLeft
                                    size={17}
                                />

                                Back to Dashboard

                            </Link>


                            {/* =================================================
                                PAGE HEADER
                            ================================================= */}

                            <div className="mb-8 sm:mb-10">

                                <p
                                    className="mb-2 text-sm font-semibold"
                                    style={{
                                        color: maroon,
                                    }}
                                >
                                    ADMISSION PORTAL
                                </p>


                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-gray-900
                                        sm:text-3xl
                                        lg:text-4xl
                                    "
                                >
                                    Admission Requirements
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-sm
                                        leading-6
                                        text-gray-500
                                        sm:text-base
                                    "
                                >
                                    Upload the required
                                    documents for your
                                    selected School of Law
                                    program.
                                </p>

                            </div>


                            {/* =================================================
                                FLASH SUCCESS
                            ================================================= */}

                            {flash?.success && (

                                <div
                                    className="
                                        mb-6
                                        flex
                                        items-start
                                        gap-3
                                        rounded-xl
                                        border
                                        border-green-200
                                        bg-green-50
                                        p-4
                                        text-green-800
                                        shadow-sm
                                    "
                                >

                                    <CheckCircle
                                        size={20}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <p className="text-sm">
                                        {
                                            flash.success
                                        }
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                FLASH ERROR
                            ================================================= */}

                            {flash?.error && (

                                <div
                                    className="
                                        mb-6
                                        flex
                                        items-start
                                        gap-3
                                        rounded-xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        p-4
                                        text-red-800
                                        shadow-sm
                                    "
                                >

                                    <AlertCircle
                                        size={20}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <p className="text-sm">
                                        {
                                            flash.error
                                        }
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                APPLICATION INFORMATION
                            ================================================= */}

                            <div
                                className="
                                    mb-6
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-5
                                        p-5
                                        sm:p-6
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                    "
                                >

                                    <div className="flex items-center gap-4">

                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-xl
                                            "
                                            style={{
                                                backgroundColor:
                                                    '#f5e6e6',
                                                color: maroon,
                                            }}
                                        >

                                            <GraduationCap
                                                size={
                                                    24
                                                }
                                            />

                                        </div>


                                        <div>

                                            <p className="text-sm font-medium text-gray-500">
                                                Selected
                                                Program
                                            </p>

                                            <h2 className="mt-1 text-xl font-bold text-gray-900">
                                                {
                                                    application.program
                                                }
                                            </h2>

                                        </div>

                                    </div>


                                    <div>

                                        <p className="text-sm font-medium text-gray-500">
                                            Application
                                            Status
                                        </p>

                                        <span
                                            className={`
                                                mt-2
                                                inline-flex
                                                rounded-full
                                                px-3
                                                py-1.5
                                                text-sm
                                                font-semibold

                                                ${getApplicationStatusClass(
                                                    application.application_status
                                                )}
                                            `}
                                        >
                                            {
                                                application.application_status
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                REQUIREMENT OVERVIEW TITLE
                            ================================================= */}

                            <div className="mb-4">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Requirements Progress
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Track your uploaded
                                    and reviewed
                                    admission documents.
                                </p>

                            </div>


                            {/* =================================================
                                PROGRESS CARD
                            ================================================= */}

                            <div
                                className="
                                    mb-6
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    p-5
                                    shadow-sm
                                    sm:p-6
                                "
                            >

                                <div
                                    className="
                                        mb-5
                                        flex
                                        flex-col
                                        gap-3
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    <div>

                                        <p className="font-bold text-gray-900">
                                            Required
                                            Documents
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">

                                            {
                                                requiredSubmittedCount
                                            }{' '}

                                            of{' '}

                                            {
                                                requiredRequirements.length
                                            }{' '}

                                            required
                                            documents
                                            uploaded

                                        </p>

                                    </div>


                                    <p
                                        className="text-3xl font-bold"
                                        style={{
                                            color: maroon,
                                        }}
                                    >
                                        {
                                            progressPercentage
                                        }
                                        %
                                    </p>

                                </div>


                                {/* PROGRESS BAR */}

                                <div className="h-3 overflow-hidden rounded-full bg-gray-200">

                                    <div
                                        className="
                                            h-full
                                            rounded-full
                                            transition-all
                                            duration-500
                                        "
                                        style={{
                                            width: `${progressPercentage}%`,
                                            backgroundColor:
                                                maroon,
                                        }}
                                    />

                                </div>


                                {/* COUNTERS */}

                                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">

                                    <div className="rounded-xl bg-gray-50 p-4 text-center">

                                        <p className="text-2xl font-bold text-gray-900">
                                            {
                                                submittedCount
                                            }
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-gray-500">
                                            Submitted
                                        </p>

                                    </div>


                                    <div className="rounded-xl bg-green-50 p-4 text-center">

                                        <p className="text-2xl font-bold text-green-700">
                                            {
                                                approvedCount
                                            }
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-green-600">
                                            Approved
                                        </p>

                                    </div>


                                    <div className="rounded-xl bg-red-50 p-4 text-center">

                                        <p className="text-2xl font-bold text-red-700">
                                            {
                                                declinedCount
                                            }
                                        </p>

                                        <p className="mt-1 text-xs font-medium text-red-600">
                                            Declined
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                REQUIREMENTS LIST HEADER
                            ================================================= */}

                            <div className="mb-4">

                                <h2 className="text-lg font-bold text-gray-900">
                                    Required Documents
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Upload each document
                                    and monitor its
                                    verification status.
                                </p>

                            </div>


                            {/* =================================================
                                REQUIREMENTS LIST
                            ================================================= */}

                            <div className="space-y-5">

                                {requirements.map(
                                    (
                                        requirement
                                    ) => {

                                        const submission =
                                            getSubmission(
                                                requirement.requirement_id
                                            );

                                        const verification =
                                            getVerificationStatus(
                                                submission
                                            );

                                        const StatusIcon =
                                            verification.icon;


                                        return (

                                            <div
                                                key={
                                                    requirement.requirement_id
                                                }
                                                className="
                                                    overflow-hidden
                                                    rounded-2xl
                                                    border
                                                    border-gray-100
                                                    bg-white
                                                    shadow-sm
                                                    transition
                                                    hover:shadow-md
                                                "
                                            >

                                                <div className="p-5 sm:p-6">


                                                    {/* =====================
                                                        HEADER
                                                    ===================== */}

                                                    <div
                                                        className="
                                                            flex
                                                            flex-col
                                                            gap-4
                                                            md:flex-row
                                                            md:items-start
                                                            md:justify-between
                                                        "
                                                    >

                                                        <div>

                                                            <div className="flex items-center gap-3">

                                                                <div
                                                                    className="
                                                                        flex
                                                                        h-10
                                                                        w-10
                                                                        shrink-0
                                                                        items-center
                                                                        justify-center
                                                                        rounded-xl
                                                                    "
                                                                    style={{
                                                                        backgroundColor:
                                                                            '#f5e6e6',
                                                                        color: maroon,
                                                                    }}
                                                                >

                                                                    <FileText
                                                                        size={
                                                                            20
                                                                        }
                                                                    />

                                                                </div>


                                                                <h2 className="text-lg font-bold text-gray-900">

                                                                    {
                                                                        requirement.requirement_name
                                                                    }

                                                                </h2>

                                                            </div>


                                                            {requirement.description && (

                                                                <p
                                                                    className="
                                                                        mt-3
                                                                        max-w-3xl
                                                                        text-sm
                                                                        leading-6
                                                                        text-gray-500
                                                                    "
                                                                >
                                                                    {
                                                                        requirement.description
                                                                    }
                                                                </p>

                                                            )}


                                                            {requirement.is_required && (

                                                                <span className="mt-3 inline-flex rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 ring-1 ring-red-100">
                                                                    Required
                                                                </span>

                                                            )}

                                                        </div>


                                                        <div
                                                            className={`
                                                                inline-flex
                                                                w-fit
                                                                items-center
                                                                gap-2
                                                                rounded-full
                                                                px-3
                                                                py-1.5
                                                                text-xs
                                                                font-semibold

                                                                ${verification.className}
                                                            `}
                                                        >

                                                            <StatusIcon
                                                                size={
                                                                    15
                                                                }
                                                            />

                                                            {
                                                                verification.label
                                                            }

                                                        </div>

                                                    </div>


                                                    {/* =================================================
                                                        SUBMITTED FILE
                                                    ================================================= */}

                                                    {submission && (

                                                        <div
                                                            className="
                                                                mt-5
                                                                rounded-xl
                                                                border
                                                                border-gray-200
                                                                bg-gray-50/70
                                                                p-4
                                                                sm:p-5
                                                            "
                                                        >

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

                                                                <div className="flex items-start gap-3">

                                                                    <CheckCircle
                                                                        size={
                                                                            20
                                                                        }
                                                                        className="
                                                                            mt-0.5
                                                                            shrink-0
                                                                            text-green-600
                                                                        "
                                                                    />

                                                                    <div className="min-w-0">

                                                                        <p className="text-sm font-semibold text-gray-900">
                                                                            Document
                                                                            Uploaded
                                                                        </p>

                                                                        <p className="mt-1 break-all text-sm text-gray-700">
                                                                            {
                                                                                submission.file_name
                                                                            }
                                                                        </p>

                                                                        {submission.file_size && (

                                                                            <p className="mt-1 text-xs text-gray-500">
                                                                                {formatFileSize(
                                                                                    submission.file_size
                                                                                )}
                                                                            </p>

                                                                        )}

                                                                    </div>

                                                                </div>


                                                                {/* VIEW DOCUMENT */}

                                                                <a
                                                                    href={`/storage/${submission.file_path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="
                                                                        inline-flex
                                                                        w-fit
                                                                        items-center
                                                                        justify-center
                                                                        gap-2
                                                                        rounded-xl
                                                                        border
                                                                        px-4
                                                                        py-2.5
                                                                        text-sm
                                                                        font-semibold
                                                                        transition
                                                                        hover:bg-[#f9eeee]
                                                                    "
                                                                    style={{
                                                                        borderColor:
                                                                            '#d9aaaa',
                                                                        color: maroon,
                                                                    }}
                                                                >

                                                                    <Eye
                                                                        size={
                                                                            17
                                                                        }
                                                                    />

                                                                    View
                                                                    Document

                                                                </a>

                                                            </div>


                                                            {/* =====================
                                                                APPROVED
                                                            ===================== */}

                                                            {submission.verification_status ===
                                                                'Approved' && (

                                                                <div
                                                                    className="
                                                                        mt-4
                                                                        flex
                                                                        items-start
                                                                        gap-3
                                                                        rounded-xl
                                                                        border
                                                                        border-green-200
                                                                        bg-green-50
                                                                        p-4
                                                                    "
                                                                >

                                                                    <CheckCircle
                                                                        size={
                                                                            19
                                                                        }
                                                                        className="
                                                                            mt-0.5
                                                                            shrink-0
                                                                            text-green-600
                                                                        "
                                                                    />

                                                                    <div>

                                                                        <p className="text-sm font-semibold text-green-800">
                                                                            Document
                                                                            Approved
                                                                        </p>

                                                                        <p className="mt-1 text-sm leading-6 text-green-700">
                                                                            This
                                                                            document
                                                                            has
                                                                            been
                                                                            verified
                                                                            by
                                                                            the
                                                                            admissions
                                                                            administrator.
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            )}


                                                            {/* =====================
                                                                PENDING
                                                            ===================== */}

                                                            {(!submission.verification_status ||
                                                                submission.verification_status ===
                                                                    'Pending') && (

                                                                <div
                                                                    className="
                                                                        mt-4
                                                                        flex
                                                                        items-start
                                                                        gap-3
                                                                        rounded-xl
                                                                        border
                                                                        border-yellow-200
                                                                        bg-yellow-50
                                                                        p-4
                                                                    "
                                                                >

                                                                    <Clock
                                                                        size={
                                                                            19
                                                                        }
                                                                        className="
                                                                            mt-0.5
                                                                            shrink-0
                                                                            text-yellow-600
                                                                        "
                                                                    />

                                                                    <div>

                                                                        <p className="text-sm font-semibold text-yellow-800">
                                                                            Pending
                                                                            Review
                                                                        </p>

                                                                        <p className="mt-1 text-sm leading-6 text-yellow-700">
                                                                            Your
                                                                            document
                                                                            has
                                                                            been
                                                                            submitted
                                                                            and
                                                                            is
                                                                            waiting
                                                                            for
                                                                            administrator
                                                                            review.
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            )}


                                                            {/* =====================
                                                                DECLINED
                                                            ===================== */}

                                                            {submission.verification_status ===
                                                                'Declined' && (

                                                                <div
                                                                    className="
                                                                        mt-4
                                                                        rounded-xl
                                                                        border
                                                                        border-red-200
                                                                        bg-red-50
                                                                        p-4
                                                                    "
                                                                >

                                                                    <div className="flex items-start gap-3">

                                                                        <XCircle
                                                                            size={
                                                                                19
                                                                            }
                                                                            className="
                                                                                mt-0.5
                                                                                shrink-0
                                                                                text-red-600
                                                                            "
                                                                        />

                                                                        <div className="flex-1">

                                                                            <p className="text-sm font-semibold text-red-800">
                                                                                Document
                                                                                Declined
                                                                            </p>

                                                                            <p className="mt-1 text-sm leading-6 text-red-700">
                                                                                This
                                                                                document
                                                                                was
                                                                                not
                                                                                accepted.
                                                                                Review
                                                                                the
                                                                                administrator's
                                                                                remarks
                                                                                and
                                                                                upload
                                                                                a
                                                                                replacement.
                                                                            </p>


                                                                            {submission.remarks && (

                                                                                <div
                                                                                    className="
                                                                                        mt-3
                                                                                        rounded-xl
                                                                                        border
                                                                                        border-red-100
                                                                                        bg-white
                                                                                        p-3
                                                                                    "
                                                                                >

                                                                                    <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                                                                                        Administrator
                                                                                        Remarks
                                                                                    </p>

                                                                                    <p className="mt-1 text-sm leading-6 text-gray-800">
                                                                                        {
                                                                                            submission.remarks
                                                                                        }
                                                                                    </p>

                                                                                </div>

                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                </div>

                                                            )}

                                                        </div>

                                                    )}


                                                    {/* =================================================
                                                        UPLOAD / REPLACE
                                                    ================================================= */}

                                                    {(
                                                        !submission ||
                                                        submission.verification_status ===
                                                            'Declined'
                                                    ) && (

                                                        <div className="mt-5">

                                                            <label
                                                                htmlFor={`file-${requirement.requirement_id}`}
                                                                className="block cursor-pointer"
                                                            >

                                                                <div
                                                                    className="
                                                                        rounded-xl
                                                                        border-2
                                                                        border-dashed
                                                                        border-gray-300
                                                                        p-6
                                                                        text-center
                                                                        transition
                                                                        hover:border-[#922b2b]
                                                                        hover:bg-[#f9eeee]
                                                                    "
                                                                >

                                                                    {uploading ===
                                                                    requirement.requirement_id ? (

                                                                        <>

                                                                            <RefreshCw
                                                                                size={
                                                                                    28
                                                                                }
                                                                                className="
                                                                                    mx-auto
                                                                                    animate-spin
                                                                                "
                                                                                style={{
                                                                                    color: maroon,
                                                                                }}
                                                                            />

                                                                            <p
                                                                                className="mt-3 text-sm font-semibold"
                                                                                style={{
                                                                                    color: maroon,
                                                                                }}
                                                                            >
                                                                                Uploading
                                                                                document...
                                                                            </p>

                                                                        </>

                                                                    ) : (

                                                                        <>

                                                                            <Upload
                                                                                size={
                                                                                    28
                                                                                }
                                                                                className="mx-auto text-gray-400"
                                                                            />

                                                                            <p className="mt-3 text-sm font-semibold text-gray-700">

                                                                                {submission
                                                                                    ? 'Replace Declined Document'
                                                                                    : 'Upload Document'}

                                                                            </p>

                                                                            <p className="mt-1 text-xs text-gray-500">
                                                                                PDF,
                                                                                JPG,
                                                                                JPEG,
                                                                                or
                                                                                PNG
                                                                                •
                                                                                Maximum
                                                                                10MB
                                                                            </p>

                                                                        </>

                                                                    )}

                                                                </div>

                                                            </label>


                                                            <input
                                                                id={`file-${requirement.requirement_id}`}
                                                                type="file"
                                                                accept=".pdf,.jpg,.jpeg,.png"
                                                                className="hidden"
                                                                disabled={
                                                                    uploading ===
                                                                    requirement.requirement_id
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) => {

                                                                    const file =
                                                                        event
                                                                            .target
                                                                            .files?.[0];

                                                                    handleUpload(
                                                                        requirement.requirement_id,
                                                                        file
                                                                    );

                                                                    event.target.value =
                                                                        '';

                                                                }}
                                                            />


                                                            {errors[
                                                                requirement
                                                                    .requirement_id
                                                            ] && (

                                                                <div
                                                                    className="
                                                                        mt-3
                                                                        flex
                                                                        items-center
                                                                        gap-2
                                                                        rounded-xl
                                                                        border
                                                                        border-red-200
                                                                        bg-red-50
                                                                        px-4
                                                                        py-3
                                                                        text-sm
                                                                        text-red-700
                                                                    "
                                                                >

                                                                    <AlertCircle
                                                                        size={
                                                                            17
                                                                        }
                                                                    />

                                                                    {
                                                                        errors[
                                                                            requirement
                                                                                .requirement_id
                                                                        ]
                                                                    }

                                                                </div>

                                                            )}

                                                        </div>

                                                    )}


                                                    {/* =================================================
                                                        APPROVED
                                                    ================================================= */}

                                                    {submission
                                                        ?.verification_status ===
                                                        'Approved' && (

                                                        <div
                                                            className="
                                                                mt-5
                                                                rounded-xl
                                                                border
                                                                border-green-200
                                                                bg-green-50
                                                                p-4
                                                            "
                                                        >

                                                            <p className="text-sm font-medium text-green-800">
                                                                This
                                                                requirement
                                                                has been
                                                                approved.
                                                                No further
                                                                action is
                                                                required.
                                                            </p>

                                                        </div>

                                                    )}

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                            </div>


                            {/* =================================================
                                SUBMIT APPLICATION
                            ================================================= */}

                            <div
                                className="
                                    mt-8
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    shadow-sm
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-5
                                        p-5
                                        sm:p-6
                                        md:flex-row
                                        md:items-center
                                        md:justify-between
                                    "
                                >

                                    <div>

                                        <h2 className="text-lg font-bold text-gray-900">
                                            Submit
                                            Application
                                        </h2>

                                        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">

                                            {allRequiredSubmitted
                                                ? 'All required documents have been uploaded. You may submit your application.'
                                                : 'Please upload all required documents before submitting your application.'}

                                        </p>

                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            handleSubmitApplication
                                        }
                                        disabled={
                                            !allRequiredSubmitted ||
                                            application.application_status !==
                                                'Pending'
                                        }
                                        className="
                                            inline-flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            px-6
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-sm
                                            transition
                                            hover:opacity-90
                                            disabled:cursor-not-allowed
                                            disabled:bg-gray-400
                                            disabled:opacity-70
                                            sm:w-auto
                                        "
                                        style={
                                            allRequiredSubmitted &&
                                            application.application_status ===
                                                'Pending'
                                                ? {
                                                      backgroundColor:
                                                          maroon,
                                                  }
                                                : {}
                                        }
                                    >

                                        <CheckCircle
                                            size={18}
                                        />

                                        Submit Application

                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                                IMPORTANT NOTICE
                            ================================================= */}

                            <div
                                className="
                                    mt-6
                                    overflow-hidden
                                    rounded-2xl
                                    p-5
                                    shadow-sm
                                    sm:p-6
                                "
                                style={{
                                    backgroundColor:
                                        '#f9eeee',
                                    border:
                                        '1px solid #ead0d0',
                                }}
                            >

                                <div className="flex items-start gap-4">

                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                        "
                                        style={{
                                            backgroundColor:
                                                '#f1d9d9',
                                            color: maroon,
                                        }}
                                    >

                                        <AlertCircle
                                            size={21}
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="font-bold"
                                            style={{
                                                color:
                                                    darkMaroon,
                                            }}
                                        >
                                            Important
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Make sure all
                                            uploaded
                                            documents are
                                            clear, complete,
                                            and readable.
                                            Documents
                                            marked as
                                            declined may be
                                            replaced after
                                            reviewing the
                                            administrator's
                                            remarks.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                FOOTER
                            ================================================= */}

                            <div className="mt-10 border-t border-gray-200 pt-5">

                                <p className="text-center text-xs text-gray-400 sm:text-left">
                                    USeP School of Law
                                    Admission Portal •
                                    Applicant
                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}
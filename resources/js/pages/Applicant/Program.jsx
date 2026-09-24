import {
    Head,
    Link,
    useForm,
    usePage,
} from '@inertiajs/react';

import {
    AlertCircle,
    CheckCircle,
    ArrowRight,
    LayoutDashboard,
    GraduationCap,
    FileText,
    CalendarDays,
    ClipboardList,
    User,
    LogOut,
    Menu,
    X,
    Scale,
    BookOpen,
} from 'lucide-react';

import { useState } from 'react';

export default function Program({
    hasProfile,
}) {
    const { flash } = usePage().props;

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        program: '',
    });

    /*
    |--------------------------------------------------------------------------
    | Submit Program
    |--------------------------------------------------------------------------
    */

    const submit = (e) => {
        e.preventDefault();

        post('/applicant/program');
    };

    /*
    |--------------------------------------------------------------------------
    | Shared Applicant Layout
    |--------------------------------------------------------------------------
    */

    const ApplicantLayout = ({
        children,
    }) => {
        return (
            <div className="min-h-screen bg-gray-50">

                {/* =====================================================
                    MOBILE HEADER
                ===================================================== */}

                <header
                    className="
                        sticky top-0 z-40
                        flex h-16
                        items-center justify-between
                        px-4
                        text-white
                        shadow-md
                        lg:hidden
                    "
                    style={{
                        backgroundColor: maroon,
                    }}
                >
                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(true)
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
                                    h-9 w-9
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
                            fixed inset-0
                            z-40
                            bg-black/50
                            lg:hidden
                        "
                        onClick={() =>
                            setSidebarOpen(false)
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

                    {/* SIDEBAR BRAND */}

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
                                    setSidebarOpen(false)
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


                        {/* DASHBOARD */}

                        <Link
                            href="/dashboard"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-white/75
                                transition
                                hover:bg-white/10
                                hover:text-white
                            "
                        >
                            <LayoutDashboard
                                size={20}
                            />

                            <span>
                                Dashboard
                            </span>
                        </Link>


                        {/* CHOOSE PROGRAM - ACTIVE */}

                        <Link
                            href="/applicant/program"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                font-medium
                                text-white
                                shadow-sm
                            "
                            style={{
                                backgroundColor:
                                    maroon,
                            }}
                        >
                            <GraduationCap
                                size={20}
                            />

                            <span>
                                Choose Program
                            </span>
                        </Link>


                        {/* REQUIREMENTS */}

                        <Link
                            href="/applicant/requirements"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-white/75
                                transition
                                hover:bg-white/10
                                hover:text-white
                            "
                        >
                            <FileText size={20} />

                            <span>
                                Requirements
                            </span>
                        </Link>


                        {/* EXAMINATION */}

                        <Link
                            href="/applicant/examination"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-white/75
                                transition
                                hover:bg-white/10
                                hover:text-white
                            "
                        >
                            <CalendarDays
                                size={20}
                            />

                            <span>
                                Examination
                            </span>
                        </Link>


                        {/* APPLICATION STATUS */}

                        <Link
                            href="/applicant/status"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-white/75
                                transition
                                hover:bg-white/10
                                hover:text-white
                            "
                        >
                            <ClipboardList
                                size={20}
                            />

                            <span>
                                Application Status
                            </span>
                        </Link>


                        {/* PERSONAL INFORMATION */}

                        <Link
                            href="/personal-details"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                text-white/75
                                transition
                                hover:bg-white/10
                                hover:text-white
                            "
                        >
                            <User size={20} />

                            <span>
                                Personal Information
                            </span>
                        </Link>

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
                        {children}
                    </div>

                </main>

            </div>
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Personal Details Not Completed
    |--------------------------------------------------------------------------
    */

    if (!hasProfile) {
        return (
            <>
                <Head title="Choose Program" />

                <ApplicantLayout>

                    <div className="mx-auto max-w-5xl">

                        {/* =================================================
                            HEADER
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
                                Choose Your Program
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
                                Select the School of Law
                                program you want to apply
                                for.
                            </p>

                        </div>


                        {/* =================================================
                            PERSONAL DETAILS WARNING
                        ================================================= */}

                        <div
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-yellow-200
                                bg-yellow-50
                                p-5
                                shadow-sm
                                sm:p-6
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-start
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-yellow-100
                                        text-yellow-700
                                    "
                                >
                                    <AlertCircle
                                        size={24}
                                    />
                                </div>


                                <div className="flex-1">

                                    <h2 className="text-lg font-bold text-yellow-900">
                                        Personal Details
                                        Required
                                    </h2>

                                    <p
                                        className="
                                            mt-2
                                            max-w-3xl
                                            text-sm
                                            leading-6
                                            text-yellow-800
                                        "
                                    >
                                        Before selecting
                                        an admission
                                        program, you must
                                        first complete
                                        your Personal
                                        Details. This
                                        information is
                                        required before
                                        you can continue
                                        with your
                                        application and
                                        submit your
                                        requirements.
                                    </p>


                                    <Link
                                        href="/personal-details"
                                        className="
                                            mt-5
                                            inline-flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-sm
                                            transition
                                            hover:opacity-90
                                            sm:w-auto
                                        "
                                        style={{
                                            backgroundColor:
                                                maroon,
                                        }}
                                    >
                                        Complete Personal
                                        Details

                                        <ArrowRight
                                            size={18}
                                        />
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            APPLICATION PROCESS
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
                                    <CheckCircle
                                        size={21}
                                    />
                                </div>


                                <div>

                                    <h3
                                        className="font-bold"
                                        style={{
                                            color:
                                                darkMaroon,
                                        }}
                                    >
                                        Application
                                        Process
                                    </h3>

                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Complete your
                                        Personal Details
                                        first. After
                                        that, you can
                                        select your
                                        program, upload
                                        the required
                                        documents, and
                                        continue your
                                        admission
                                        application.
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

                </ApplicantLayout>
            </>
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Normal Program Selection
    |--------------------------------------------------------------------------
    */

    return (
        <>
            <Head title="Choose Program" />

            <ApplicantLayout>

                <div className="mx-auto max-w-6xl">

                    {/* =================================================
                        HEADER
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
                            Choose Your Program
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
                            Select the School of Law
                            program you want to apply
                            for.
                        </p>

                    </div>


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
                                text-red-700
                                shadow-sm
                            "
                        >
                            <AlertCircle
                                size={20}
                                className="mt-0.5 shrink-0"
                            />

                            <p className="text-sm">
                                {flash.error}
                            </p>
                        </div>

                    )}


                    {/* =================================================
                        PROGRAM SELECTION HEADER
                    ================================================= */}

                    <div className="mb-4">

                        <h2 className="text-lg font-bold text-gray-900">
                            Available Programs
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Choose one program to continue
                            your application.
                        </p>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form onSubmit={submit}>

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                md:grid-cols-2
                            "
                        >

                            {/* =================================================
                                JURIS DOCTOR
                            ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'program',
                                        'Juris Doctor'
                                    )
                                }
                                className={`
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    bg-white
                                    p-6
                                    text-left
                                    shadow-sm
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-md
                                    sm:p-8
                                    ${
                                        data.program ===
                                        'Juris Doctor'
                                            ? 'border-[#922b2b] ring-2 ring-[#922b2b]/10'
                                            : 'border-gray-200 hover:border-red-200'
                                    }
                                `}
                            >

                                {/* ICON */}

                                <div
                                    className="
                                        flex
                                        h-14
                                        w-14
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
                                    <Scale size={27} />
                                </div>


                                <h2 className="mt-6 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Juris Doctor
                                </h2>


                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Apply for the Juris
                                    Doctor program and
                                    pursue professional
                                    legal education at the
                                    USeP School of Law.
                                </p>


                                <div className="mt-6">

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            rounded-full
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                data.program ===
                                                'Juris Doctor'
                                                    ? 'text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                            }
                                        `}
                                        style={
                                            data.program ===
                                            'Juris Doctor'
                                                ? {
                                                      backgroundColor:
                                                          maroon,
                                                  }
                                                : {}
                                        }
                                    >
                                        {data.program ===
                                        'Juris Doctor'
                                            ? 'Selected'
                                            : 'Select Program'}
                                    </span>

                                </div>


                                {/* SELECTED INDICATOR */}

                                {data.program ===
                                    'Juris Doctor' && (

                                    <div
                                        className="
                                            absolute
                                            right-5
                                            top-5
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-white
                                        "
                                        style={{
                                            backgroundColor:
                                                maroon,
                                        }}
                                    >
                                        <CheckCircle
                                            size={19}
                                        />
                                    </div>

                                )}

                            </button>


                            {/* =================================================
                                MASTER OF LEGAL STUDIES
                            ================================================= */}

                            <button
                                type="button"
                                onClick={() =>
                                    setData(
                                        'program',
                                        'Master of Legal Studies'
                                    )
                                }
                                className={`
                                    group
                                    relative
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    bg-white
                                    p-6
                                    text-left
                                    shadow-sm
                                    transition
                                    hover:-translate-y-1
                                    hover:shadow-md
                                    sm:p-8
                                    ${
                                        data.program ===
                                        'Master of Legal Studies'
                                            ? 'border-[#922b2b] ring-2 ring-[#922b2b]/10'
                                            : 'border-gray-200 hover:border-red-200'
                                    }
                                `}
                            >

                                {/* ICON */}

                                <div
                                    className="
                                        flex
                                        h-14
                                        w-14
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
                                    <BookOpen
                                        size={27}
                                    />
                                </div>


                                <h2 className="mt-6 text-xl font-bold text-gray-900 sm:text-2xl">
                                    Master of Legal
                                    Studies
                                </h2>


                                <p className="mt-3 text-sm leading-6 text-gray-500">
                                    Apply for the Master
                                    of Legal Studies
                                    program for advanced
                                    interdisciplinary
                                    study of law and legal
                                    systems.
                                </p>


                                <div className="mt-6">

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            rounded-full
                                            px-4
                                            py-2
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                data.program ===
                                                'Master of Legal Studies'
                                                    ? 'text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                            }
                                        `}
                                        style={
                                            data.program ===
                                            'Master of Legal Studies'
                                                ? {
                                                      backgroundColor:
                                                          maroon,
                                                  }
                                                : {}
                                        }
                                    >
                                        {data.program ===
                                        'Master of Legal Studies'
                                            ? 'Selected'
                                            : 'Select Program'}
                                    </span>

                                </div>


                                {/* SELECTED INDICATOR */}

                                {data.program ===
                                    'Master of Legal Studies' && (

                                    <div
                                        className="
                                            absolute
                                            right-5
                                            top-5
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-full
                                            text-white
                                        "
                                        style={{
                                            backgroundColor:
                                                maroon,
                                        }}
                                    >
                                        <CheckCircle
                                            size={19}
                                        />
                                    </div>

                                )}

                            </button>

                        </div>


                        {/* =================================================
                            VALIDATION ERROR
                        ================================================= */}

                        {errors.program && (

                            <div
                                className="
                                    mt-5
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
                                    size={18}
                                />

                                {errors.program}
                            </div>

                        )}


                        {/* =================================================
                            SELECTED PROGRAM SUMMARY
                        ================================================= */}

                        {data.program && (

                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-col
                                    gap-4
                                    rounded-2xl
                                    p-5
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                                style={{
                                    backgroundColor:
                                        '#f9eeee',
                                    border:
                                        '1px solid #ead0d0',
                                }}
                            >

                                <div className="flex items-start gap-3">

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
                                                '#f1d9d9',
                                            color: maroon,
                                        }}
                                    >
                                        <CheckCircle
                                            size={20}
                                        />
                                    </div>

                                    <div>

                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                            Selected
                                            Program
                                        </p>

                                        <p
                                            className="mt-1 font-bold"
                                            style={{
                                                color:
                                                    darkMaroon,
                                            }}
                                        >
                                            {
                                                data.program
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            CONTINUE
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-col-reverse
                                gap-3
                                sm:flex-row
                                sm:items-center
                                sm:justify-end
                            "
                        >

                            <Link
                                href="/dashboard"
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-gray-300
                                    bg-white
                                    px-6
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-gray-700
                                    transition
                                    hover:bg-gray-50
                                "
                            >
                                Back to Dashboard
                            </Link>


                            <button
                                type="submit"
                                disabled={
                                    !data.program ||
                                    processing
                                }
                                className="
                                    inline-flex
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
                                    disabled:opacity-60
                                "
                                style={
                                    !data.program ||
                                    processing
                                        ? {}
                                        : {
                                              backgroundColor:
                                                  maroon,
                                          }
                                }
                            >
                                {processing
                                    ? 'Saving...'
                                    : 'Continue to Requirements'}

                                {!processing && (
                                    <ArrowRight
                                        size={18}
                                    />
                                )}
                            </button>

                        </div>

                    </form>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="mt-10 border-t border-gray-200 pt-5">

                        <p className="text-center text-xs text-gray-400 sm:text-left">
                            USeP School of Law
                            Admission Portal • Applicant
                        </p>

                    </div>

                </div>

            </ApplicantLayout>
        </>
    );
}
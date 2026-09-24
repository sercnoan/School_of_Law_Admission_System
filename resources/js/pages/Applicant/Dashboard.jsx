import { Head, Link } from '@inertiajs/react';

import {
    LayoutDashboard,
    GraduationCap,
    FileText,
    CalendarDays,
    ClipboardList,
    User,
    LogOut,
    Menu,
    X,
    ChevronRight,
    ArrowRight,
} from 'lucide-react';

import { useState } from 'react';

export default function Dashboard() {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    return (
        <>
            <Head title="Applicant Dashboard" />

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

                    {/* =================================================
                        SIDEBAR BRAND
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


                            {/* MOBILE CLOSE */}

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


                        {/* DASHBOARD - ACTIVE */}

                        <Link
                            href="/dashboard"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                group
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                px-4
                                py-3
                                font-medium
                                text-white
                                shadow-sm
                                transition
                            "
                            style={{
                                backgroundColor:
                                    maroon,
                            }}
                        >
                            <LayoutDashboard
                                size={20}
                            />

                            <span>
                                Dashboard
                            </span>
                        </Link>


                        {/* CHOOSE PROGRAM */}

                        <Link
                            href="/applicant/program"
                            onClick={() =>
                                setSidebarOpen(false)
                            }
                            className="
                                group
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
                                group
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
                                group
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
                                group
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
                                group
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
                                Applicant Dashboard
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
                                Welcome to the USeP School
                                of Law Admission System.
                                Manage your application
                                process from one place.
                            </p>

                        </div>


                        {/* =================================================
                            START APPLICATION CARD
                        ================================================= */}

                        <div
                            className="
                                mb-8
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

                                <div className="flex items-start gap-4">

                                    <div
                                        className="
                                            flex
                                            h-12
                                            w-12
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
                                        <GraduationCap
                                            size={24}
                                        />
                                    </div>


                                    <div>

                                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                                            Start Your
                                            Application
                                        </h2>

                                        <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                                            Begin your
                                            admission
                                            application by
                                            selecting the
                                            School of Law
                                            program you
                                            want to apply
                                            for.
                                        </p>

                                    </div>

                                </div>


                                <Link
                                    href="/applicant/program"
                                    className="
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
                                        md:w-auto
                                    "
                                    style={{
                                        backgroundColor:
                                            maroon,
                                    }}
                                >
                                    <GraduationCap
                                        size={18}
                                    />

                                    Choose Program

                                    <ArrowRight
                                        size={17}
                                    />
                                </Link>

                            </div>

                        </div>


                        {/* =================================================
                            QUICK ACTIONS HEADER
                        ================================================= */}

                        <div className="mb-4">

                            <h2 className="text-lg font-bold text-gray-900">
                                Application Process
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Access each step of your
                                admission application.
                            </p>

                        </div>


                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {/* CHOOSE PROGRAM */}

                            <DashboardCard
                                href="/applicant/program"
                                icon={
                                    GraduationCap
                                }
                                title="Choose Program"
                                description="Select the School of Law program you want to apply for."
                                maroon={maroon}
                            />


                            {/* REQUIREMENTS */}

                            <DashboardCard
                                href="/applicant/requirements"
                                icon={FileText}
                                title="Requirements"
                                description="Upload and review the admission documents required for your selected program."
                                maroon={maroon}
                            />


                            {/* EXAMINATION */}

                            <DashboardCard
                                href="/applicant/examination"
                                icon={
                                    CalendarDays
                                }
                                title="Examination"
                                description="View available examination schedules and manage your examination details."
                                maroon={maroon}
                            />


                            {/* APPLICATION STATUS */}

                            <DashboardCard
                                href="/applicant/status"
                                icon={
                                    ClipboardList
                                }
                                title="Application Status"
                                description="Track the progress and current status of your admission application."
                                maroon={maroon}
                            />


                            {/* PERSONAL INFORMATION */}

                            <DashboardCard
                                href="/personal-details"
                                icon={User}
                                title="Personal Information"
                                description="Review and update the personal information included in your application."
                                maroon={maroon}
                            />

                        </div>


                        {/* =================================================
                            APPLICATION GUIDE
                        ================================================= */}

                        <div
                            className="
                                mt-8
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
                                    "
                                    style={{
                                        backgroundColor:
                                            '#f1d9d9',
                                        color: maroon,
                                    }}
                                >
                                    <ClipboardList
                                        size={24}
                                    />
                                </div>


                                <div className="flex-1">

                                    <h2
                                        className="font-bold"
                                        style={{
                                            color:
                                                darkMaroon,
                                        }}
                                    >
                                        Admission
                                        Application Guide
                                    </h2>

                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Complete your
                                        personal
                                        information,
                                        select your
                                        preferred program,
                                        submit all required
                                        documents, and
                                        monitor your
                                        application status
                                        regularly.
                                    </p>


                                    <Link
                                        href="/applicant/program"
                                        className="
                                            mt-4
                                            inline-flex
                                            w-full
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:opacity-90
                                            sm:w-auto
                                        "
                                        style={{
                                            backgroundColor:
                                                maroon,
                                        }}
                                    >
                                        Continue
                                        Application

                                        <ChevronRight
                                            size={16}
                                        />
                                    </Link>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div
                            className="
                                mt-10
                                border-t
                                border-gray-200
                                pt-5
                                text-center
                                sm:text-left
                            "
                        >
                            <p className="text-xs text-gray-400">
                                USeP School of Law
                                Admission Portal •
                                Applicant
                            </p>
                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}


/*
|--------------------------------------------------------------------------
| Dashboard Card
|--------------------------------------------------------------------------
*/

function DashboardCard({
    href,
    icon: Icon,
    title,
    description,
    maroon,
}) {
    return (
        <Link
            href={href}
            className="
                group
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-1
                hover:border-red-200
                hover:shadow-md
                sm:p-6
            "
        >

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
                <Icon size={24} />
            </div>


            <div className="mt-5 flex items-center justify-between gap-3">

                <h3 className="font-bold text-gray-900">
                    {title}
                </h3>

                <ChevronRight
                    size={18}
                    className="
                        shrink-0
                        text-gray-300
                        transition
                        group-hover:translate-x-1
                    "
                />

            </div>


            <p className="mt-2 text-sm leading-6 text-gray-500">
                {description}
            </p>

        </Link>
    );
}
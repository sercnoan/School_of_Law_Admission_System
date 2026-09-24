import {
    Head,
    Link,
    useForm,
    usePage,
} from '@inertiajs/react';

import {
    LayoutDashboard,
    FileText,
    Users,
    UserCheck,
    CalendarCheck,
    ClipboardCheck,
    CalendarDays,
    LogOut,
    Menu,
    X,
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    Save,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';

import { useState } from 'react';


export default function EditExaminationSchedule({
    schedule,
}) {
    const { flash } = usePage().props;

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';


    /*
    |--------------------------------------------------------------------------
    | Applicants Already Assigned
    |--------------------------------------------------------------------------
    */

    const bookedApplicants =
        Number(schedule.max_applicants || 0) -
        Number(schedule.available_slots || 0);


    /*
    |--------------------------------------------------------------------------
    | Form
    |--------------------------------------------------------------------------
    */

    const {
        data,
        setData,
        put,
        processing,
        errors,
    } = useForm({
        exam_date:
            schedule.exam_date || '',

        exam_time:
            schedule.exam_time
                ? String(
                      schedule.exam_time
                  ).slice(0, 5)
                : '',

        venue:
            schedule.venue || '',

        max_applicants:
            schedule.max_applicants || '',

        instructions:
            schedule.instructions || '',

        notes:
            schedule.notes || '',

        status:
            schedule.status === 'Completed'
                ? 'Closed'
                : schedule.status || 'Open',
    });


    /*
    |--------------------------------------------------------------------------
    | Submit
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {
        event.preventDefault();

        put(
            `/admin/examination-schedules/${schedule.schedule_id}`,
            {
                preserveScroll: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Navigation
    |--------------------------------------------------------------------------
    */

    const navigation = [
        {
            label: 'Dashboard',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
        },

        {
            label: 'Applications',
            href: '/admin/applications',
            icon: FileText,
        },

        {
            label: 'Examinees',
            href: '/admin/examinees',
            icon: UserCheck,
        },

        {
            label: 'Interviewees',
            href: '/admin/interviewees',
            icon: CalendarCheck,
        },

        {
            label: 'Final List',
            href: '/admin/final-list',
            icon: ClipboardCheck,
        },

        {
            label: 'Examination Schedules',
            href: '/admin/examination-schedules',
            icon: CalendarDays,
        },
    ];


    /*
    |--------------------------------------------------------------------------
    | Shared Input Classes
    |--------------------------------------------------------------------------
    */

    const inputClass = `
        h-12
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        text-sm
        text-gray-900
        outline-none
        transition
        placeholder:text-gray-400
        focus:border-[#922b2b]
        focus:ring-2
        focus:ring-[#922b2b]/10
    `;


    const textareaClass = `
        w-full
        rounded-xl
        border
        border-gray-300
        bg-white
        px-4
        py-3
        text-sm
        leading-6
        text-gray-900
        outline-none
        transition
        placeholder:text-gray-400
        focus:border-[#922b2b]
        focus:ring-2
        focus:ring-[#922b2b]/10
    `;


    return (
        <>
            <Head title="Edit Examination Schedule" />

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
                        className="
                            fixed
                            inset-0
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
                                    Administration Portal
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
                                    'Examination Schedules';


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
                                            size={20}
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

                        <div className="mx-auto max-w-5xl">


                            {/* =================================================
                                BACK BUTTON
                            ================================================= */}

                            <Link
                                href="/admin/examination-schedules"
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

                                Back to Examination
                                Schedules

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
                                    ADMINISTRATION PORTAL
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
                                    Edit Examination
                                    Schedule
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
                                    Update the examination
                                    date, time, venue,
                                    capacity, instructions,
                                    notes, and schedule
                                    status.
                                </p>

                            </div>


                            {/* =================================================
                                SUCCESS MESSAGE
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
                                SCHEDULE OVERVIEW
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

                                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">

                                    <div className="flex items-center gap-3">

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
                                                    '#f5e6e6',

                                                color:
                                                    maroon,
                                            }}
                                        >

                                            <CalendarDays
                                                size={22}
                                            />

                                        </div>


                                        <div>

                                            <h2 className="font-bold text-gray-900">
                                                Current
                                                Schedule
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Current
                                                capacity and
                                                applicant
                                                allocation
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        p-5
                                        sm:grid-cols-3
                                        sm:p-6
                                    "
                                >

                                    {/* MAXIMUM */}

                                    <SummaryCard
                                        icon={Users}
                                        label="Maximum Applicants"
                                        value={
                                            schedule.max_applicants
                                        }
                                        maroon={
                                            maroon
                                        }
                                    />


                                    {/* SCHEDULED */}

                                    <SummaryCard
                                        icon={CheckCircle}
                                        label="Scheduled Applicants"
                                        value={
                                            bookedApplicants
                                        }
                                        maroon={
                                            maroon
                                        }
                                    />


                                    {/* AVAILABLE */}

                                    <SummaryCard
                                        icon={CalendarDays}
                                        label="Available Slots"
                                        value={
                                            schedule.available_slots
                                        }
                                        maroon={
                                            maroon
                                        }
                                    />

                                </div>

                            </div>


                            {/* =================================================
                                BOOKED APPLICANTS WARNING
                            ================================================= */}

                            {bookedApplicants > 0 && (

                                <div
                                    className="
                                        mb-6
                                        flex
                                        items-start
                                        gap-3
                                        rounded-2xl
                                        border
                                        border-yellow-200
                                        bg-yellow-50
                                        p-5
                                        shadow-sm
                                    "
                                >

                                    <AlertCircle
                                        size={21}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-yellow-600
                                        "
                                    />


                                    <div>

                                        <h3 className="font-bold text-yellow-900">
                                            Applicants
                                            Already Assigned
                                        </h3>

                                        <p className="mt-1 text-sm leading-6 text-yellow-800">
                                            This schedule
                                            currently has{' '}
                                            <strong>
                                                {
                                                    bookedApplicants
                                                }
                                            </strong>{' '}
                                            applicant
                                            {bookedApplicants !==
                                            1
                                                ? 's'
                                                : ''}{' '}
                                            assigned. The
                                            maximum number
                                            of applicants
                                            cannot be
                                            reduced below{' '}
                                            <strong>
                                                {
                                                    bookedApplicants
                                                }
                                            </strong>
                                            .
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                VALIDATION ERRORS
                            ================================================= */}

                            {Object.keys(errors)
                                .length > 0 && (

                                <div
                                    className="
                                        mb-6
                                        rounded-2xl
                                        border
                                        border-red-200
                                        bg-red-50
                                        p-5
                                        shadow-sm
                                    "
                                >

                                    <div className="flex items-start gap-3">

                                        <AlertCircle
                                            size={21}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-red-600
                                            "
                                        />


                                        <div>

                                            <h3 className="font-bold text-red-900">
                                                Please
                                                correct the
                                                following
                                            </h3>


                                            <ul
                                                className="
                                                    mt-2
                                                    list-disc
                                                    space-y-1
                                                    pl-5
                                                    text-sm
                                                    text-red-700
                                                "
                                            >

                                                {Object.values(
                                                    errors
                                                ).map(
                                                    (
                                                        error,
                                                        index
                                                    ) => (

                                                        <li
                                                            key={
                                                                index
                                                            }
                                                        >
                                                            {
                                                                error
                                                            }
                                                        </li>

                                                    )
                                                )}

                                            </ul>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                EDIT FORM
                            ================================================= */}

                            <form
                                onSubmit={
                                    handleSubmit
                                }
                                className="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    shadow-sm
                                "
                            >

                                {/* =================================================
                                    FORM HEADER
                                ================================================= */}

                                <div className="border-b border-gray-100 px-5 py-5 sm:px-6">

                                    <div className="flex items-center gap-3">

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
                                                    '#f5e6e6',

                                                color:
                                                    maroon,
                                            }}
                                        >

                                            <Calendar
                                                size={22}
                                            />

                                        </div>


                                        <div>

                                            <h2 className="font-bold text-gray-900">
                                                Schedule
                                                Information
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                Modify the
                                                examination
                                                schedule
                                                details
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    FORM BODY
                                ================================================= */}

                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-6
                                        p-5
                                        sm:p-6
                                        md:grid-cols-2
                                    "
                                >

                                    {/* =============================================
                                        DATE
                                    ============================================= */}

                                    <div>

                                        <FieldLabel
                                            htmlFor="exam_date"
                                        >
                                            Examination Date
                                        </FieldLabel>


                                        <div className="relative">

                                            <Calendar
                                                size={18}
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-3.5
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-400
                                                "
                                            />

                                            <input
                                                id="exam_date"
                                                type="date"
                                                value={
                                                    data.exam_date
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setData(
                                                        'exam_date',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={`${inputClass} pl-11`}
                                            />

                                        </div>


                                        <FieldError
                                            error={
                                                errors.exam_date
                                            }
                                        />

                                    </div>


                                    {/* =============================================
                                        TIME
                                    ============================================= */}

                                    <div>

                                        <FieldLabel
                                            htmlFor="exam_time"
                                        >
                                            Examination Time
                                        </FieldLabel>


                                        <div className="relative">

                                            <Clock
                                                size={18}
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-3.5
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-400
                                                "
                                            />

                                            <input
                                                id="exam_time"
                                                type="time"
                                                value={
                                                    data.exam_time
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setData(
                                                        'exam_time',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={`${inputClass} pl-11`}
                                            />

                                        </div>


                                        <FieldError
                                            error={
                                                errors.exam_time
                                            }
                                        />

                                    </div>


                                    {/* =============================================
                                        VENUE
                                    ============================================= */}

                                    <div className="md:col-span-2">

                                        <FieldLabel
                                            htmlFor="venue"
                                        >
                                            Examination Venue
                                        </FieldLabel>


                                        <div className="relative">

                                            <MapPin
                                                size={18}
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-3.5
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-400
                                                "
                                            />

                                            <input
                                                id="venue"
                                                type="text"
                                                value={
                                                    data.venue
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setData(
                                                        'venue',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={`${inputClass} pl-11`}
                                                placeholder="Enter examination venue"
                                            />

                                        </div>


                                        <FieldError
                                            error={
                                                errors.venue
                                            }
                                        />

                                    </div>


                                    {/* =============================================
                                        MAXIMUM APPLICANTS
                                    ============================================= */}

                                    <div>

                                        <FieldLabel
                                            htmlFor="max_applicants"
                                        >
                                            Maximum Applicants
                                        </FieldLabel>


                                        <div className="relative">

                                            <Users
                                                size={18}
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-3.5
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-400
                                                "
                                            />

                                            <input
                                                id="max_applicants"
                                                type="number"
                                                min={Math.max(
                                                    1,
                                                    bookedApplicants
                                                )}
                                                value={
                                                    data.max_applicants
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setData(
                                                        'max_applicants',
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                className={`${inputClass} pl-11`}
                                                placeholder="Enter maximum applicants"
                                            />

                                        </div>


                                        {bookedApplicants >
                                            0 && (

                                            <p className="mt-2 text-xs leading-5 text-gray-500">
                                                Minimum
                                                allowed:{' '}
                                                <span className="font-semibold text-gray-700">
                                                    {
                                                        bookedApplicants
                                                    }
                                                </span>{' '}
                                                because
                                                applicants
                                                are already
                                                assigned.
                                            </p>

                                        )}


                                        <FieldError
                                            error={
                                                errors.max_applicants
                                            }
                                        />

                                    </div>


                                    {/* =============================================
                                        STATUS
                                    ============================================= */}

                                    <div>

                                        <FieldLabel
                                            htmlFor="status"
                                        >
                                            Schedule Status
                                        </FieldLabel>


                                        <select
                                            id="status"
                                            value={
                                                data.status
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setData(
                                                    'status',
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={
                                                inputClass
                                            }
                                        >

                                            <option value="Open">
                                                Open
                                            </option>

                                            <option value="Closed">
                                                Closed
                                            </option>

                                        </select>


                                        <FieldError
                                            error={
                                                errors.status
                                            }
                                        />

                                    </div>


                                    {/* =============================================
                                        INSTRUCTIONS
                                    ============================================= */}

                                    <div className="md:col-span-2">

                                        <FieldLabel
                                            htmlFor="instructions"
                                        >
                                            Examination
                                            Instructions
                                        </FieldLabel>


                                        <textarea
                                            id="instructions"
                                            rows={5}
                                            value={
                                                data.instructions
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setData(
                                                    'instructions',
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={
                                                textareaClass
                                            }
                                            placeholder="Enter instructions for applicants..."
                                        />


                                        <p className="mt-2 text-xs leading-5 text-gray-500">
                                            These
                                            instructions
                                            may be shown to
                                            applicants who
                                            select this
                                            schedule.
                                        </p>


                                        <FieldError
                                            error={
                                                errors.instructions
                                            }
                                        />

                                    </div>


                                    {/* =============================================
                                        NOTES
                                    ============================================= */}

                                    <div className="md:col-span-2">

                                        <FieldLabel
                                            htmlFor="notes"
                                        >
                                            Administrative
                                            Notes
                                        </FieldLabel>


                                        <textarea
                                            id="notes"
                                            rows={4}
                                            value={
                                                data.notes
                                            }
                                            onChange={(
                                                event
                                            ) =>
                                                setData(
                                                    'notes',
                                                    event
                                                        .target
                                                        .value
                                                )
                                            }
                                            className={
                                                textareaClass
                                            }
                                            placeholder="Optional administrative notes..."
                                        />


                                        <FieldError
                                            error={
                                                errors.notes
                                            }
                                        />

                                    </div>

                                </div>


                                {/* =================================================
                                    FORM ACTIONS
                                ================================================= */}

                                <div
                                    className="
                                        flex
                                        flex-col-reverse
                                        gap-3
                                        border-t
                                        border-gray-100
                                        bg-gray-50/50
                                        px-5
                                        py-5
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-end
                                        sm:px-6
                                    "
                                >

                                    <Link
                                        href="/admin/examination-schedules"
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
                                        Cancel
                                    </Link>


                                    <button
                                        type="submit"
                                        disabled={
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
                                            disabled:opacity-70
                                        "
                                        style={
                                            processing
                                                ? {}
                                                : {
                                                      backgroundColor:
                                                          maroon,
                                                  }
                                        }
                                    >

                                        {processing ? (

                                            <>
                                                <span
                                                    className="
                                                        h-4
                                                        w-4
                                                        animate-spin
                                                        rounded-full
                                                        border-2
                                                        border-white/40
                                                        border-t-white
                                                    "
                                                />

                                                Saving...
                                            </>

                                        ) : (

                                            <>
                                                <Save
                                                    size={18}
                                                />

                                                Save Changes
                                            </>

                                        )}

                                    </button>

                                </div>

                            </form>


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

                                        <h3
                                            className="font-bold"
                                            style={{
                                                color:
                                                    darkMaroon,
                                            }}
                                        >
                                            Important
                                        </h3>


                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Updating the
                                            examination
                                            date, time, or
                                            venue will also
                                            affect
                                            applicants who
                                            have already
                                            selected this
                                            schedule.
                                            Review all
                                            changes
                                            carefully
                                            before saving.
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
                                    Administration
                                </p>

                            </div>

                        </div>

                    </div>

                </main>

            </div>
        </>
    );
}


/*
|--------------------------------------------------------------------------
| Field Label
|--------------------------------------------------------------------------
*/

function FieldLabel({
    htmlFor,
    children,
}) {
    return (
        <label
            htmlFor={htmlFor}
            className="
                mb-2
                block
                text-sm
                font-semibold
                text-gray-700
            "
        >
            {children}
        </label>
    );
}


/*
|--------------------------------------------------------------------------
| Field Error
|--------------------------------------------------------------------------
*/

function FieldError({
    error,
}) {
    if (!error) {
        return null;
    }

    return (
        <p className="mt-2 text-sm text-red-600">
            {error}
        </p>
    );
}


/*
|--------------------------------------------------------------------------
| Summary Card
|--------------------------------------------------------------------------
*/

function SummaryCard({
    icon: Icon,
    label,
    value,
    maroon,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                p-4
            "
        >

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

                    <Icon size={19} />

                </div>


                <div>

                    <p className="text-xs font-medium text-gray-500">
                        {label}
                    </p>

                    <p className="mt-0.5 text-xl font-bold text-gray-900">
                        {value}
                    </p>

                </div>

            </div>

        </div>
    );
}
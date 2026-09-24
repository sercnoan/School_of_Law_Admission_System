import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import {
    ArrowLeft,
    CalendarDays,
    Clock,
    MapPin,
    Users,
    FileText,
    Save,
    AlertCircle,
    LayoutDashboard,
    UserCheck,
    CalendarCheck,
    ClipboardCheck,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

import { useState } from 'react';


export default function CreateExaminationSchedule() {

    const [
        sidebarOpen,
        setSidebarOpen,
    ] = useState(false);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';


    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        exam_date: '',
        exam_time: '',
        venue: '',
        max_applicants: '',
        instructions: '',
        notes: '',
        status: 'Open',
    });


    /*
    |--------------------------------------------------------------------------
    | Submit Form
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {

        event.preventDefault();

        post(
            '/admin/examination-schedules'
        );

    };


    return (

        <>

            <Head
                title="Create Examination Schedule"
            />


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
                                    Administration Portal
                                </p>

                            </div>


                            {/* MOBILE CLOSE */}

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


                        {/* DASHBOARD */}

                        <Link
                            href="/admin/dashboard"
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
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

                            <LayoutDashboard
                                size={20}
                            />

                            <span>
                                Dashboard
                            </span>

                        </Link>


                        {/* APPLICATIONS */}

                        <Link
                            href="/admin/applications"
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
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

                            <FileText
                                size={20}
                            />

                            <span>
                                Applications
                            </span>

                        </Link>
                        {/* EXAMINEES */}

                        <Link
                            href="/admin/examinees"
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
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

                            <UserCheck
                                size={20}
                            />

                            <span>
                                Examinees
                            </span>

                        </Link>


                        {/* INTERVIEWEES */}

                        <Link
                            href="/admin/interviewees"
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
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

                            <CalendarCheck
                                size={20}
                            />

                            <span>
                                Interviewees
                            </span>

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


                        {/* EXAMINATION SCHEDULES - ACTIVE */}

                        <Link
                            href="/admin/examination-schedules"
                            onClick={() =>
                                setSidebarOpen(
                                    false
                                )
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

                            <CalendarDays
                                size={20}
                            />

                            <span>
                                Examination Schedules
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

                            <LogOut
                                size={19}
                            />

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
                            max-w-4xl
                            px-4
                            py-6
                            sm:px-6
                            sm:py-8
                            lg:px-8
                            lg:py-10
                        "
                    >


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
                                font-medium
                                transition
                                hover:opacity-75
                            "
                            style={{
                                color:
                                    maroon,
                            }}
                        >

                            <ArrowLeft
                                size={18}
                            />

                            Back to Examination Schedules

                        </Link>


                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <div className="mb-6">


                            <p
                                className="mb-2 text-sm font-semibold"
                                style={{
                                    color:
                                        maroon,
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
                                "
                            >
                                Create Examination Schedule
                            </h1>


                            <p className="mt-2 text-gray-600">
                                Create an available examination schedule for qualified applicants.
                            </p>


                        </div>


                        {/* =================================================
                            ERRORS
                        ================================================= */}

                        {Object.keys(
                            errors
                        ).length >
                            0 && (

                            <div
                                className="
                                    mb-6
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-4
                                "
                            >

                                <div className="flex items-start gap-3">


                                    <AlertCircle
                                        size={20}
                                        className="mt-0.5 text-red-600"
                                    />


                                    <div>


                                        <p className="font-semibold text-red-800">
                                            Please correct the following errors:
                                        </p>


                                        <ul className="mt-2 list-disc pl-5 text-sm text-red-700">

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
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-5
                                shadow-sm
                                sm:p-8
                            "
                        >


                            {/* DATE */}

                            <div className="mb-6">


                                <label
                                    htmlFor="exam_date"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Examination Date
                                </label>


                                <div className="relative">


                                    <CalendarDays
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
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
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                {errors.exam_date && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.exam_date
                                        }
                                    </p>

                                )}


                            </div>


                            {/* TIME */}

                            <div className="mb-6">


                                <label
                                    htmlFor="exam_time"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Examination Time
                                </label>


                                <div className="relative">


                                    <Clock
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
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
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                {errors.exam_time && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.exam_time
                                        }
                                    </p>

                                )}


                            </div>


                            {/* VENUE */}

                            <div className="mb-6">


                                <label
                                    htmlFor="venue"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Examination Venue
                                </label>


                                <div className="relative">


                                    <MapPin
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
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
                                        placeholder="Example: Room 506"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            placeholder:text-gray-400
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                {errors.venue && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.venue
                                        }
                                    </p>

                                )}


                            </div>


                            {/* MAX APPLICANTS */}

                            <div className="mb-6">


                                <label
                                    htmlFor="max_applicants"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Maximum Applicants
                                </label>


                                <div className="relative">


                                    <Users
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    />


                                    <input
                                        id="max_applicants"
                                        type="number"
                                        min="1"
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
                                        placeholder="Example: 50"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            placeholder:text-gray-400
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                <p className="mt-1 text-xs text-gray-500">
                                    Available slots will initially equal the maximum number of applicants.
                                </p>


                                {errors.max_applicants && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.max_applicants
                                        }
                                    </p>

                                )}


                            </div>


                            {/* STATUS */}

                            <div className="mb-6">


                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Schedule Status
                                </label>


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
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                >


                                    <option value="Open">
                                        Open
                                    </option>


                                    <option value="Closed">
                                        Closed
                                    </option>


                                    <option value="Completed">
                                        Completed
                                    </option>


                                </select>


                                {errors.status && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.status
                                        }
                                    </p>

                                )}


                            </div>


                            {/* INSTRUCTIONS */}

                            <div className="mb-6">


                                <label
                                    htmlFor="instructions"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Instructions
                                </label>


                                <textarea
                                    id="instructions"
                                    rows="4"
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
                                    placeholder="Enter examination instructions for applicants..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-gray-900
                                        outline-none
                                        placeholder:text-gray-400
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                />


                                {errors.instructions && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.instructions
                                        }
                                    </p>

                                )}


                            </div>


                            {/* NOTES */}

                            <div className="mb-8">


                                <label
                                    htmlFor="notes"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Notes
                                </label>


                                <textarea
                                    id="notes"
                                    rows="4"
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
                                    placeholder="Optional notes..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-gray-900
                                        outline-none
                                        placeholder:text-gray-400
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                />


                                {errors.notes && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.notes
                                        }
                                    </p>

                                )}


                            </div>


                            {/* BUTTONS */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >


                                <Link
                                    href="/admin/examination-schedules"
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-300
                                        px-6
                                        py-3
                                        text-center
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
                                        font-semibold
                                        text-white
                                        transition
                                        hover:opacity-90
                                        disabled:cursor-not-allowed
                                        disabled:bg-gray-400
                                    "
                                    style={
                                        !processing
                                            ? {
                                                  backgroundColor:
                                                      maroon,
                                              }
                                            : {}
                                    }
                                >

                                    <Save
                                        size={18}
                                    />

                                    {processing
                                        ? 'Creating...'
                                        : 'Create Schedule'}

                                </button>


                            </div>


                        </form>


                    </div>


                </main>


            </div>

        </>

    );

}
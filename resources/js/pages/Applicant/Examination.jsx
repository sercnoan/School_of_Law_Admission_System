import PortalLayout from '@/layouts/portal-layout';
import {
    Head,
    Link,
    router,
} from '@inertiajs/react';

import { LayoutDashboard, GraduationCap, FileText, CalendarDays, ClipboardList, User, Calendar, Clock, MapPin, Users, CheckCircle, AlertCircle } from 'lucide-react';

import { useEffect, useState } from 'react';


export default function Examination({
    application = null,
    schedules = [],
    selectedSchedule = null,
    message = null,
    messageType = null,
}) {

    const [currentTime, setCurrentTime] =
        useState(Date.now());

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Format Time
    |--------------------------------------------------------------------------
    */

    const formatTime = (time) => {
        if (!time) {
            return 'Not available';
        }

        const [hours, minutes] = time
            .split(':')
            .map(Number);

        const date = new Date();

        date.setHours(
            hours,
            minutes,
            0,
            0
        );

        return date.toLocaleTimeString(
            'en-US',
            {
                hour: 'numeric',
                minute: '2-digit',
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Keep Current Time Updated
    |--------------------------------------------------------------------------
    |
    | This allows an examination schedule to disappear automatically when its
    | date and time have already passed, even if the applicant keeps this page
    | open without refreshing.
    |
    */

    useEffect(() => {

        const timer = window.setInterval(
            () => {
                setCurrentTime(
                    Date.now()
                );
            },
            30000
        );

        return () => {
            window.clearInterval(
                timer
            );
        };

    }, []);


    /*
    |--------------------------------------------------------------------------
    | Check If Schedule Has Passed
    |--------------------------------------------------------------------------
    |
    | Examination schedules are interpreted as Philippine time (UTC+08:00).
    |
    */

    const scheduleHasPassed = (
        schedule
    ) => {

        if (
            !schedule?.exam_date ||
            !schedule?.exam_time
        ) {
            return true;
        }

        const time =
            String(
                schedule.exam_time
            ).slice(
                0,
                8
            );

        const examDateTime =
            new Date(
                `${schedule.exam_date}T${time}+08:00`
            );

        if (
            Number.isNaN(
                examDateTime.getTime()
            )
        ) {
            return true;
        }

        return (
            examDateTime.getTime() <=
            currentTime
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Filter Available Schedules
    |--------------------------------------------------------------------------
    */

    const availableSchedules =
        schedules.filter(
            (schedule) =>
                !scheduleHasPassed(
                    schedule
                )
        );


    /*
    |--------------------------------------------------------------------------
    | Select Schedule
    |--------------------------------------------------------------------------
    */

    const selectSchedule = (
        schedule
    ) => {

        /*
        |--------------------------------------------------------------------------
        | Frontend Safety Check
        |--------------------------------------------------------------------------
        */

        if (
            scheduleHasPassed(
                schedule
            )
        ) {

            window.alert(
                'This examination schedule has already passed. Please select another available schedule.'
            );

            return;
        }


        if (
            schedule.status !==
            'Open'
        ) {

            window.alert(
                'This examination schedule is no longer open.'
            );

            return;
        }


        if (
            Number(
                schedule.available_slots
            ) <= 0
        ) {

            window.alert(
                'This examination schedule is already full.'
            );

            return;
        }


        const confirmed =
            window.confirm(
                'Are you sure you want to select this examination schedule? You will not be able to select another schedule after confirming.'
            );

        if (!confirmed) {
            return;
        }

        router.post(
            `/applicant/examination/${schedule.schedule_id}/select`
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
            <Head title="Examination" />

            <div className="min-h-screen bg-gray-50">


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <PortalLayout audience="applicant">

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
                                    Examination Schedule
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
                                    Select an available
                                    examination date and
                                    time for your School of
                                    Law admission
                                    application.
                                </p>

                            </div>


                            {/* =================================================
                                SUCCESS MESSAGE
                            ================================================= */}

                            {window.history.state
                                ?.flash?.success && (

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
                                        sm:p-5
                                    "
                                >

                                    <CheckCircle
                                        size={21}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <div>

                                        <p className="font-semibold">
                                            Success
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-green-700">
                                            {
                                                window
                                                    .history
                                                    .state
                                                    .flash
                                                    .success
                                            }
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                MESSAGE
                            ================================================= */}

                            {message && (

                                <div
                                    className="
                                        mb-6
                                        flex
                                        items-start
                                        gap-3
                                        rounded-xl
                                        border
                                        border-yellow-200
                                        bg-yellow-50
                                        p-4
                                        text-yellow-800
                                        shadow-sm
                                        sm:p-5
                                    "
                                >

                                    <AlertCircle
                                        size={21}
                                        className="mt-0.5 shrink-0"
                                    />

                                    <div>

                                        <p className="font-semibold">
                                            Examination
                                            Schedule
                                        </p>

                                        <p className="mt-1 text-sm leading-6 text-yellow-700">
                                            {message}
                                        </p>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                SELECTED SCHEDULE
                            ================================================= */}

                            {selectedSchedule && (

                                <div
                                    className="
                                        mb-8
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-green-200
                                        bg-green-50
                                        shadow-sm
                                    "
                                >

                                    <div className="p-5 sm:p-6">

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
                                                    bg-green-100
                                                    text-green-700
                                                "
                                            >
                                                <CheckCircle
                                                    size={
                                                        25
                                                    }
                                                />
                                            </div>


                                            <div className="flex-1">

                                                <p className="text-sm font-semibold text-green-700">
                                                    Examination
                                                    Schedule
                                                    Confirmed
                                                </p>

                                                <h2 className="mt-1 text-xl font-bold text-green-900 sm:text-2xl">
                                                    Your
                                                    Examination
                                                    Schedule
                                                </h2>


                                                {/* DETAILS */}

                                                <div
                                                    className="
                                                        mt-6
                                                        grid
                                                        grid-cols-1
                                                        gap-5
                                                        sm:grid-cols-2
                                                        lg:grid-cols-3
                                                    "
                                                >

                                                    {/* DATE */}

                                                    <div
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-green-200
                                                            bg-white
                                                            p-4
                                                        "
                                                    >

                                                        <div className="flex items-start gap-3">

                                                            <Calendar
                                                                size={
                                                                    20
                                                                }
                                                                className="mt-0.5 text-green-700"
                                                            />

                                                            <div>

                                                                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                                                                    Date
                                                                </p>

                                                                <p className="mt-1 font-semibold text-gray-900">
                                                                    {formatDate(
                                                                        selectedSchedule.exam_date
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {/* TIME */}

                                                    <div
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-green-200
                                                            bg-white
                                                            p-4
                                                        "
                                                    >

                                                        <div className="flex items-start gap-3">

                                                            <Clock
                                                                size={
                                                                    20
                                                                }
                                                                className="mt-0.5 text-green-700"
                                                            />

                                                            <div>

                                                                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                                                                    Time
                                                                </p>

                                                                <p className="mt-1 font-semibold text-gray-900">
                                                                    {formatTime(
                                                                        selectedSchedule.exam_time
                                                                    )}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>


                                                    {/* VENUE */}

                                                    <div
                                                        className="
                                                            rounded-xl
                                                            border
                                                            border-green-200
                                                            bg-white
                                                            p-4
                                                        "
                                                    >

                                                        <div className="flex items-start gap-3">

                                                            <MapPin
                                                                size={
                                                                    20
                                                                }
                                                                className="mt-0.5 text-green-700"
                                                            />

                                                            <div className="min-w-0">

                                                                <p className="text-xs font-semibold uppercase tracking-wide text-green-700">
                                                                    Venue
                                                                </p>

                                                                <p className="mt-1 break-words font-semibold text-gray-900">
                                                                    {
                                                                        selectedSchedule.venue
                                                                    }
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* INSTRUCTIONS */}

                                                {selectedSchedule.instructions && (

                                                    <div
                                                        className="
                                                            mt-5
                                                            rounded-xl
                                                            border
                                                            border-green-200
                                                            bg-white
                                                            p-4
                                                        "
                                                    >

                                                        <p className="text-sm font-bold text-green-900">
                                                            Examination
                                                            Instructions
                                                        </p>

                                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                                                            {
                                                                selectedSchedule.instructions
                                                            }
                                                        </p>

                                                    </div>

                                                )}


                                                {/* NOTES */}

                                                {selectedSchedule.notes && (

                                                    <div
                                                        className="
                                                            mt-4
                                                            rounded-xl
                                                            border
                                                            border-green-200
                                                            bg-white
                                                            p-4
                                                        "
                                                    >

                                                        <p className="text-sm font-bold text-green-900">
                                                            Notes
                                                        </p>

                                                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                                                            {
                                                                selectedSchedule.notes
                                                            }
                                                        </p>

                                                    </div>

                                                )}

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                AVAILABLE SCHEDULES
                            ================================================= */}

                            {!selectedSchedule &&
                                application
                                    ?.application_status ===
                                    'Approved' && (

                                <div>

                                    {/* TITLE */}

                                    <div className="mb-5">

                                        <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                                            Available
                                            Examination
                                            Schedules
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Choose one
                                            available
                                            examination
                                            schedule below.
                                        </p>

                                    </div>


                                    {/* NO SCHEDULES */}

                                    {availableSchedules.length ===
                                    0 ? (

                                        <div
                                            className="
                                                rounded-2xl
                                                border
                                                border-gray-100
                                                bg-white
                                                p-8
                                                text-center
                                                shadow-sm
                                                sm:p-10
                                            "
                                        >

                                            <div
                                                className="
                                                    mx-auto
                                                    flex
                                                    h-16
                                                    w-16
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                "
                                                style={{
                                                    backgroundColor:
                                                        '#f5e6e6',
                                                    color: maroon,
                                                }}
                                            >
                                                <CalendarDays
                                                    size={
                                                        30
                                                    }
                                                />
                                            </div>


                                            <h3 className="mt-5 text-lg font-bold text-gray-900">
                                                No
                                                Examination
                                                Schedules
                                                Available
                                            </h3>

                                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                                                There are
                                                currently
                                                no
                                                available
                                                examination
                                                schedules.
                                                Please
                                                check
                                                again
                                                later.
                                            </p>

                                        </div>

                                    ) : (

                                        <div
                                            className="
                                                grid
                                                grid-cols-1
                                                gap-5
                                                lg:grid-cols-2
                                            "
                                        >

                                            {availableSchedules.map(
                                                (
                                                    schedule
                                                ) => (

                                                    <div
                                                        key={
                                                            schedule.schedule_id
                                                        }
                                                        className="
                                                            overflow-hidden
                                                            rounded-2xl
                                                            border
                                                            border-gray-100
                                                            bg-white
                                                            shadow-sm
                                                            transition
                                                            hover:-translate-y-0.5
                                                            hover:shadow-md
                                                        "
                                                    >

                                                        <div className="p-5 sm:p-6">

                                                            {/* HEADER */}

                                                            <div className="flex items-start justify-between gap-4">

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
                                                                    <CalendarDays
                                                                        size={
                                                                            24
                                                                        }
                                                                    />
                                                                </div>


                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1.5
                                                                        rounded-full
                                                                        bg-green-50
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        font-semibold
                                                                        text-green-700
                                                                        ring-1
                                                                        ring-green-200
                                                                    "
                                                                >
                                                                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

                                                                    Open
                                                                </span>

                                                            </div>


                                                            {/* DATE */}

                                                            <div className="mt-6">

                                                                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                                    Examination
                                                                    Date
                                                                </p>

                                                                <p className="mt-1 text-xl font-bold text-gray-900">
                                                                    {formatDate(
                                                                        schedule.exam_date
                                                                    )}
                                                                </p>

                                                            </div>


                                                            {/* DETAILS */}

                                                            <div className="mt-5 space-y-4">

                                                                {/* TIME */}

                                                                <div className="flex items-center gap-3">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-9
                                                                            w-9
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-lg
                                                                        "
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#f9eeee',
                                                                            color: maroon,
                                                                        }}
                                                                    >
                                                                        <Clock
                                                                            size={
                                                                                17
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div>

                                                                        <p className="text-xs text-gray-500">
                                                                            Time
                                                                        </p>

                                                                        <p className="font-medium text-gray-900">
                                                                            {formatTime(
                                                                                schedule.exam_time
                                                                            )}
                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                {/* VENUE */}

                                                                <div className="flex items-center gap-3">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-9
                                                                            w-9
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-lg
                                                                        "
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#f9eeee',
                                                                            color: maroon,
                                                                        }}
                                                                    >
                                                                        <MapPin
                                                                            size={
                                                                                17
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="min-w-0">

                                                                        <p className="text-xs text-gray-500">
                                                                            Venue
                                                                        </p>

                                                                        <p className="break-words font-medium text-gray-900">
                                                                            {
                                                                                schedule.venue
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>


                                                                {/* AVAILABLE SLOTS */}

                                                                <div className="flex items-center gap-3">

                                                                    <div
                                                                        className="
                                                                            flex
                                                                            h-9
                                                                            w-9
                                                                            shrink-0
                                                                            items-center
                                                                            justify-center
                                                                            rounded-lg
                                                                        "
                                                                        style={{
                                                                            backgroundColor:
                                                                                '#f9eeee',
                                                                            color: maroon,
                                                                        }}
                                                                    >
                                                                        <Users
                                                                            size={
                                                                                17
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div>

                                                                        <p className="text-xs text-gray-500">
                                                                            Available
                                                                            Slots
                                                                        </p>

                                                                        <p className="font-medium text-gray-900">
                                                                            {
                                                                                schedule.available_slots
                                                                            }{' '}
                                                                            of{' '}
                                                                            {
                                                                                schedule.max_applicants
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            {/* INSTRUCTIONS */}

                                                            {schedule.instructions && (

                                                                <div
                                                                    className="
                                                                        mt-5
                                                                        rounded-xl
                                                                        p-4
                                                                    "
                                                                    style={{
                                                                        backgroundColor:
                                                                            '#f9eeee',
                                                                        border:
                                                                            '1px solid #ead0d0',
                                                                    }}
                                                                >

                                                                    <p
                                                                        className="text-xs font-bold uppercase tracking-wide"
                                                                        style={{
                                                                            color: maroon,
                                                                        }}
                                                                    >
                                                                        Instructions
                                                                    </p>

                                                                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                                                                        {
                                                                            schedule.instructions
                                                                        }
                                                                    </p>

                                                                </div>

                                                            )}


                                                            {/* SELECT BUTTON */}

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    selectSchedule(
                                                                        schedule
                                                                    )
                                                                }
                                                                className="
                                                                    mt-6
                                                                    flex
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
                                                                "
                                                                style={{
                                                                    backgroundColor:
                                                                        maroon,
                                                                }}
                                                            >

                                                                <CalendarDays
                                                                    size={
                                                                        18
                                                                    }
                                                                />

                                                                Select This
                                                                Schedule

                                                            </button>

                                                        </div>

                                                    </div>

                                                )
                                            )}

                                        </div>

                                    )}

                                </div>

                            )}


                            {/* =================================================
                                APPLICATION NOT FOUND
                            ================================================= */}

                            {!application &&
                                !message && (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        p-8
                                        text-center
                                        shadow-sm
                                        sm:p-10
                                    "
                                >

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-yellow-50
                                            text-yellow-600
                                        "
                                    >
                                        <AlertCircle
                                            size={30}
                                        />
                                    </div>


                                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                                        Application Not
                                        Found
                                    </h2>

                                    <p className="mt-2 text-sm text-gray-500 sm:text-base">
                                        Please complete
                                        your application
                                        first.
                                    </p>


                                    <Link
                                        href="/applicant/program"
                                        className="
                                            mt-6
                                            inline-flex
                                            items-center
                                            justify-center
                                            rounded-xl
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                            text-white
                                            transition
                                            hover:opacity-90
                                        "
                                        style={{
                                            backgroundColor:
                                                maroon,
                                        }}
                                    >
                                        Continue
                                        Application
                                    </Link>

                                </div>

                            )}


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

                </PortalLayout>

            </div>
        </>
    );
}
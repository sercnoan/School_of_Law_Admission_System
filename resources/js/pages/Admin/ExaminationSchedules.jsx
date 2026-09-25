import PortalLayout from '@/layouts/portal-layout';
import {
    Head,
    Link,
    router,
    usePage,
} from '@inertiajs/react';

import { LayoutDashboard, FileText, CalendarDays, Plus, Trash2, Edit, Clock, MapPin, AlertCircle, CheckCircle, XCircle, User, GraduationCap, CalendarCheck, ClipboardCheck, UserCheck, Search, ChevronDown, ChevronUp, RotateCcw, Info } from 'lucide-react';

import {
    useMemo,
    useState,
} from 'react';


export default function ExaminationSchedules({
    schedules = [],
}) {
    const { flash } = usePage().props;


    const [search, setSearch] =
        useState('');

    const [statusFilter, setStatusFilter] =
        useState('Open');

    const [expandedSchedules, setExpandedSchedules] =
        useState({});

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';


    /*
    |--------------------------------------------------------------------------
    | Delete Schedule
    |--------------------------------------------------------------------------
    */

    const handleDelete = (scheduleId) => {
        const confirmed =
            window.confirm(
                'Are you sure you want to delete this examination schedule?'
            );

        if (!confirmed) {
            return;
        }

        router.delete(
            `/admin/examination-schedules/${scheduleId}`,
            {
                preserveScroll: true,
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Schedule Status
    |--------------------------------------------------------------------------
    */

    const getStatus = (status) => {
        switch (status) {
            case 'Open':
                return {
                    label: 'Open',
                    className:
                        'bg-green-50 text-green-700 ring-1 ring-green-200',
                    icon: CheckCircle,
                };

            case 'Closed':
                return {
                    label: 'Closed',
                    className:
                        'bg-red-50 text-red-700 ring-1 ring-red-200',
                    icon: XCircle,
                };

            case 'Completed':
                return {
                    label: 'Closed',
                    className:
                        'bg-red-50 text-red-700 ring-1 ring-red-200',
                    icon: XCircle,
                };

            default:
                return {
                    label:
                        status || 'Unknown',
                    className:
                        'bg-gray-100 text-gray-700 ring-1 ring-gray-200',
                    icon: AlertCircle,
                };
        }
    };


    /*
    |--------------------------------------------------------------------------
    | Applicant Status
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
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) {
            return 'Not available';
        }

        const parsedDate =
            new Date(
                `${date}T00:00:00`
            );

        return parsedDate
            .toLocaleDateString(
                'en-US',
                {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                }
            );
    };


    /*
    |--------------------------------------------------------------------------
    | Compact Date Parts
    |--------------------------------------------------------------------------
    */

    const getDateParts = (date) => {
        if (!date) {
            return {
                month: '---',
                day: '--',
                year: '',
            };
        }

        const parsedDate =
            new Date(
                `${date}T00:00:00`
            );

        return {
            month:
                parsedDate
                    .toLocaleDateString(
                        'en-US',
                        {
                            month: 'short',
                        }
                    )
                    .toUpperCase(),

            day:
                parsedDate
                    .toLocaleDateString(
                        'en-US',
                        {
                            day: '2-digit',
                        }
                    ),

            year:
                parsedDate
                    .getFullYear(),
        };
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

        const parts =
            time.split(':');

        const hour =
            Number(parts[0]);

        const minute =
            Number(parts[1]);

        const date =
            new Date();

        date.setHours(
            hour,
            minute,
            0
        );

        return date
            .toLocaleTimeString(
                'en-US',
                {
                    hour: 'numeric',
                    minute: '2-digit',
                }
            );
    };


    /*
    |--------------------------------------------------------------------------
    | Summary Values
    |--------------------------------------------------------------------------
    */

    const totalScheduledApplicants =
        schedules.reduce(
            (total, schedule) =>
                total +
                Number(
                    schedule
                        .scheduled_applicants ||
                    0
                ),
            0
        );

    const openSchedules =
        schedules.filter(
            (schedule) =>
                schedule.status ===
                'Open'
        ).length;


    /*
    |--------------------------------------------------------------------------
    | Search / Filter
    |--------------------------------------------------------------------------
    */

    const filteredSchedules =
        useMemo(
            () => {
                const query =
                    search
                        .trim()
                        .toLowerCase();

                return schedules.filter(
                    (schedule) => {
                        const effectiveStatus =
                            schedule.status ===
                            'Completed'
                                ? 'Closed'
                                : schedule.status;

                        const matchesStatus =
                            effectiveStatus ===
                            statusFilter;

                        if (
                            !matchesStatus
                        ) {
                            return false;
                        }

                        if (!query) {
                            return true;
                        }

                        const searchable =
                            [
                                formatDate(
                                    schedule.exam_date
                                ),
                                formatTime(
                                    schedule.exam_time
                                ),
                                schedule.venue,
                                schedule.status,
                                schedule.instructions,
                                schedule.notes,
                            ]
                                .filter(
                                    Boolean
                                )
                                .join(' ')
                                .toLowerCase();

                        return searchable
                            .includes(
                                query
                            );
                    }
                );
            },
            [
                schedules,
                search,
                statusFilter,
            ]
        );


    /*
    |--------------------------------------------------------------------------
    | Expanded Schedule
    |--------------------------------------------------------------------------
    */

    const toggleSchedule = (
        scheduleId
    ) => {
        setExpandedSchedules(
            (previous) => ({
                ...previous,
                [scheduleId]:
                    !previous[
                        scheduleId
                    ],
            })
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {
        setSearch('');
        setStatusFilter('Open');
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
            label:
                'Examination Schedules',
            href: '/admin/examination-schedules',
            icon: CalendarDays,
        },
    ];


    return (
        <>
            <Head title="Examination Schedules" />

            <div className="min-h-screen bg-gray-50">


                {/* =====================================================
                    MAIN
                ===================================================== */}

                <PortalLayout audience="admin">

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

                        <div className="mx-auto max-w-7xl">

                            {/* =================================================
                                PAGE HEADER
                            ================================================= */}

                            <div
                                className="
                                    mb-8
                                    flex
                                    flex-col
                                    gap-5
                                    md:flex-row
                                    md:items-end
                                    md:justify-between
                                "
                            >

                                <div>

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
                                            lg:text-4xl
                                        "
                                    >
                                        Examination Schedules
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
                                        Manage examination dates,
                                        applicant capacity, venues,
                                        and assigned examinees from
                                        one streamlined workspace.
                                    </p>

                                </div>


                                <Link
                                    href="/admin/examination-schedules/create"
                                    className="
                                        inline-flex
                                        w-full
                                        shrink-0
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

                                    <Plus size={18} />

                                    Create Schedule

                                </Link>

                            </div>


                            {/* =================================================
                                FLASH MESSAGES
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
                                SUMMARY
                            ================================================= */}

                            <div
                                className="
                                    mb-6
                                    grid
                                    grid-cols-1
                                    gap-4
                                    sm:grid-cols-3
                                "
                            >

                                <SummaryCard
                                    icon={
                                        CalendarDays
                                    }
                                    label="Total Schedules"
                                    value={
                                        schedules.length
                                    }
                                    maroon={
                                        maroon
                                    }
                                />


                                <SummaryCard
                                    icon={
                                        CalendarCheck
                                    }
                                    label="Open Schedules"
                                    value={
                                        openSchedules
                                    }
                                    maroon={
                                        maroon
                                    }
                                />


                                <SummaryCard
                                    icon={
                                        UserCheck
                                    }
                                    label="Applicants Scheduled"
                                    value={
                                        totalScheduledApplicants
                                    }
                                    maroon={
                                        maroon
                                    }
                                />

                            </div>


                            {/* =================================================
                                SEARCH / FILTER BAR
                            ================================================= */}

                            {schedules.length >
                                0 && (

                                <div
                                    className="
                                        mb-6
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        p-4
                                        shadow-sm
                                        sm:p-5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-4
                                            xl:flex-row
                                            xl:items-center
                                            xl:justify-between
                                        "
                                    >

                                        <div
                                            className="
                                                relative
                                                w-full
                                                xl:max-w-md
                                            "
                                        >

                                            <Search
                                                size={18}
                                                className="
                                                    absolute
                                                    left-3.5
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-gray-400
                                                "
                                            />

                                            <input
                                                type="text"
                                                value={
                                                    search
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSearch(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="Search by date, venue, status, or notes..."
                                                className="
                                                    h-11
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-gray-300
                                                    bg-white
                                                    pl-10
                                                    pr-4
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


                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-2
                                            "
                                        >

                                            {[
                                                'Open',
                                                'Closed',
                                            ].map(
                                                (
                                                    status
                                                ) => (

                                                    <button
                                                        key={
                                                            status
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setStatusFilter(
                                                                status
                                                            )
                                                        }
                                                        className={`
                                                            rounded-lg
                                                            px-3.5
                                                            py-2
                                                            text-xs
                                                            font-semibold
                                                            transition
                                                            ${
                                                                statusFilter ===
                                                                status
                                                                    ? 'text-white shadow-sm'
                                                                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                                                            }
                                                        `}
                                                        style={
                                                            statusFilter ===
                                                            status
                                                                ? {
                                                                      backgroundColor:
                                                                          maroon,
                                                                  }
                                                                : {}
                                                        }
                                                    >
                                                        {
                                                            status
                                                        }
                                                    </button>

                                                )
                                            )}


                                            {search && (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        clearFilters
                                                    }
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-1.5
                                                        rounded-lg
                                                        px-3
                                                        py-2
                                                        text-xs
                                                        font-semibold
                                                        text-gray-500
                                                        transition
                                                        hover:bg-gray-100
                                                        hover:text-gray-800
                                                    "
                                                >
                                                    <RotateCcw
                                                        size={
                                                            14
                                                        }
                                                    />
                                                    Clear
                                                </button>

                                            )}

                                        </div>

                                    </div>


                                    <div
                                        className="
                                            mt-4
                                            border-t
                                            border-gray-100
                                            pt-4
                                            text-xs
                                            text-gray-500
                                        "
                                    >

                                        Showing{' '}

                                        <span className="font-semibold text-gray-800">
                                            {
                                                filteredSchedules.length
                                            }
                                        </span>{' '}

                                        of{' '}

                                        <span className="font-semibold text-gray-800">
                                            {
                                                schedules.length
                                            }
                                        </span>{' '}

                                        {statusFilter.toLowerCase()} examination schedules

                                    </div>

                                </div>

                            )}


                            {/* =================================================
                                EMPTY STATE
                            ================================================= */}

                            {schedules.length ===
                                0 && (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        px-6
                                        py-14
                                        text-center
                                        shadow-sm
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

                                            color:
                                                maroon,
                                        }}
                                    >

                                        <CalendarDays
                                            size={
                                                30
                                            }
                                        />

                                    </div>


                                    <h2 className="mt-5 text-xl font-bold text-gray-900">
                                        No Examination Schedules
                                    </h2>


                                    <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-500">
                                        Create your first
                                        examination schedule so
                                        approved applicants can
                                        select an available date.
                                    </p>


                                    <Link
                                        href="/admin/examination-schedules/create"
                                        className="
                                            mt-6
                                            inline-flex
                                            items-center
                                            gap-2
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

                                        <Plus
                                            size={
                                                18
                                            }
                                        />

                                        Create Schedule

                                    </Link>

                                </div>

                            )}


                            {/* =================================================
                                NO FILTER RESULTS
                            ================================================= */}

                            {schedules.length >
                                0 &&
                                filteredSchedules.length ===
                                    0 && (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-gray-200
                                        bg-white
                                        px-6
                                        py-12
                                        text-center
                                        shadow-sm
                                    "
                                >

                                    <div
                                        className="
                                            mx-auto
                                            flex
                                            h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-gray-100
                                            text-gray-500
                                        "
                                    >
                                        <Search
                                            size={
                                                25
                                            }
                                        />
                                    </div>

                                    <h2 className="mt-4 text-lg font-bold text-gray-900">
                                        No matching schedules
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Try changing your search
                                        or status filter.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        className="
                                            mt-5
                                            text-sm
                                            font-semibold
                                            hover:underline
                                        "
                                        style={{
                                            color:
                                                maroon,
                                        }}
                                    >
                                        Clear filters
                                    </button>

                                </div>

                            )}


                            {/* =================================================
                                SCHEDULE DIRECTORY
                            ================================================= */}

                            {filteredSchedules.length >
                                0 && (

                                <div className="space-y-4">

                                    {filteredSchedules.map(
                                        (
                                            schedule
                                        ) => {

                                            const status =
                                                getStatus(
                                                    schedule.status
                                                );

                                            const StatusIcon =
                                                status.icon;

                                            const applicants =
                                                schedule.applicants ||
                                                [];

                                            const dateParts =
                                                getDateParts(
                                                    schedule.exam_date
                                                );

                                            const maxApplicants =
                                                Number(
                                                    schedule.max_applicants ||
                                                        0
                                                );

                                            const scheduledCount =
                                                Number(
                                                    schedule.scheduled_applicants ||
                                                        applicants.length ||
                                                        0
                                                );

                                            const availableSlots =
                                                Number(
                                                    schedule.available_slots ??
                                                        Math.max(
                                                            maxApplicants -
                                                                scheduledCount,
                                                            0
                                                        )
                                                );

                                            const occupancy =
                                                maxApplicants >
                                                0
                                                    ? Math.min(
                                                          100,
                                                          Math.round(
                                                              (scheduledCount /
                                                                  maxApplicants) *
                                                                  100
                                                          )
                                                      )
                                                    : 0;

                                            const isExpanded =
                                                Boolean(
                                                    expandedSchedules[
                                                        schedule
                                                            .schedule_id
                                                    ]
                                                );


                                            return (

                                                <section
                                                    key={
                                                        schedule.schedule_id
                                                    }
                                                    className="
                                                        overflow-hidden
                                                        rounded-2xl
                                                        border
                                                        border-gray-200
                                                        bg-white
                                                        shadow-sm
                                                        transition
                                                        hover:border-gray-300
                                                        hover:shadow-md
                                                    "
                                                >

                                                    {/* =========================================
                                                        COMPACT SCHEDULE SUMMARY
                                                    ========================================= */}

                                                    <div className="p-5 sm:p-6">

                                                        <div
                                                            className="
                                                                grid
                                                                gap-5
                                                                lg:grid-cols-[auto_minmax(0,1fr)]
                                                                xl:grid-cols-[auto_minmax(0,1fr)_auto]
                                                            "
                                                        >

                                                            {/* DATE BADGE */}

                                                            <div
                                                                className="
                                                                    flex
                                                                    h-20
                                                                    w-20
                                                                    shrink-0
                                                                    flex-col
                                                                    items-center
                                                                    justify-center
                                                                    rounded-2xl
                                                                    border
                                                                "
                                                                style={{
                                                                    backgroundColor:
                                                                        '#f9eeee',
                                                                    borderColor:
                                                                        '#ead0d0',
                                                                }}
                                                            >

                                                                <span
                                                                    className="
                                                                        text-[10px]
                                                                        font-bold
                                                                        tracking-[0.16em]
                                                                    "
                                                                    style={{
                                                                        color:
                                                                            maroon,
                                                                    }}
                                                                >
                                                                    {
                                                                        dateParts.month
                                                                    }
                                                                </span>

                                                                <span className="mt-0.5 text-2xl font-bold leading-none text-gray-900">
                                                                    {
                                                                        dateParts.day
                                                                    }
                                                                </span>

                                                                <span className="mt-1 text-[10px] font-medium text-gray-400">
                                                                    {
                                                                        dateParts.year
                                                                    }
                                                                </span>

                                                            </div>


                                                            {/* PRIMARY INFORMATION */}

                                                            <div className="min-w-0">

                                                                <div className="flex flex-wrap items-center gap-2">

                                                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                                        Examination Schedule
                                                                    </p>


                                                                    <span
                                                                        className={`
                                                                            inline-flex
                                                                            items-center
                                                                            gap-1.5
                                                                            rounded-full
                                                                            px-2.5
                                                                            py-1
                                                                            text-[11px]
                                                                            font-semibold
                                                                            ${status.className}
                                                                        `}
                                                                    >

                                                                        <StatusIcon
                                                                            size={
                                                                                13
                                                                            }
                                                                        />

                                                                        {
                                                                            status.label
                                                                        }

                                                                    </span>

                                                                </div>


                                                                <h2 className="mt-1.5 text-lg font-bold text-gray-900 sm:text-xl">
                                                                    {formatDate(
                                                                        schedule.exam_date
                                                                    )}
                                                                </h2>


                                                                <div
                                                                    className="
                                                                        mt-3
                                                                        flex
                                                                        flex-col
                                                                        gap-2
                                                                        text-sm
                                                                        text-gray-600
                                                                        sm:flex-row
                                                                        sm:flex-wrap
                                                                        sm:items-center
                                                                        sm:gap-x-5
                                                                    "
                                                                >

                                                                    <span className="inline-flex items-center gap-2">
                                                                        <Clock
                                                                            size={
                                                                                16
                                                                            }
                                                                            style={{
                                                                                color:
                                                                                    maroon,
                                                                            }}
                                                                        />
                                                                        {formatTime(
                                                                            schedule.exam_time
                                                                        )}
                                                                    </span>


                                                                    <span className="inline-flex min-w-0 items-center gap-2">
                                                                        <MapPin
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="shrink-0"
                                                                            style={{
                                                                                color:
                                                                                    maroon,
                                                                            }}
                                                                        />
                                                                        <span className="truncate">
                                                                            {
                                                                                schedule.venue
                                                                            }
                                                                        </span>
                                                                    </span>

                                                                </div>


                                                                {/* CAPACITY */}

                                                                <div className="mt-5 max-w-xl">

                                                                    <div className="mb-2 flex items-center justify-between gap-4">

                                                                        <p className="text-xs font-semibold text-gray-500">
                                                                            Capacity
                                                                        </p>

                                                                        <p className="text-xs font-semibold text-gray-700">
                                                                            {
                                                                                scheduledCount
                                                                            }{' '}
                                                                            /{' '}
                                                                            {
                                                                                maxApplicants
                                                                            }{' '}
                                                                            scheduled
                                                                        </p>

                                                                    </div>


                                                                    <div className="h-2 overflow-hidden rounded-full bg-gray-100">

                                                                        <div
                                                                            className="h-full rounded-full transition-all"
                                                                            style={{
                                                                                width: `${occupancy}%`,
                                                                                backgroundColor:
                                                                                    maroon,
                                                                            }}
                                                                        />

                                                                    </div>

                                                                </div>

                                                            </div>


                                                            {/* ACTIONS */}

                                                            <div
                                                                className="
                                                                    flex
                                                                    flex-wrap
                                                                    items-start
                                                                    gap-2
                                                                    lg:col-span-2
                                                                    lg:pl-[100px]
                                                                    xl:col-span-1
                                                                    xl:pl-0
                                                                "
                                                            >

                                                                <a
                                                                    href={`/admin/examination-schedules/${schedule.schedule_id}/edit`}
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        justify-center
                                                                        gap-2
                                                                        rounded-xl
                                                                        border
                                                                        px-3.5
                                                                        py-2.5
                                                                        text-sm
                                                                        font-semibold
                                                                        transition
                                                                        hover:bg-[#f9eeee]
                                                                    "
                                                                    style={{
                                                                        borderColor:
                                                                            '#d9aaaa',

                                                                        color:
                                                                            maroon,
                                                                    }}
                                                                >

                                                                    <Edit
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                    Edit

                                                                </a>


                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            schedule.schedule_id
                                                                        )
                                                                    }
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        justify-center
                                                                        gap-2
                                                                        rounded-xl
                                                                        border
                                                                        border-red-200
                                                                        px-3.5
                                                                        py-2.5
                                                                        text-sm
                                                                        font-semibold
                                                                        text-red-600
                                                                        transition
                                                                        hover:bg-red-50
                                                                    "
                                                                >

                                                                    <Trash2
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                    Delete

                                                                </button>

                                                            </div>

                                                        </div>


                                                        {/* QUICK METRICS */}

                                                        <div
                                                            className="
                                                                mt-6
                                                                grid
                                                                grid-cols-2
                                                                gap-3
                                                                border-t
                                                                border-gray-100
                                                                pt-5
                                                                md:grid-cols-4
                                                            "
                                                        >

                                                            <MiniMetric
                                                                label="Available Slots"
                                                                value={
                                                                    availableSlots
                                                                }
                                                            />

                                                            <MiniMetric
                                                                label="Scheduled"
                                                                value={
                                                                    scheduledCount
                                                                }
                                                            />

                                                            <MiniMetric
                                                                label="Capacity"
                                                                value={
                                                                    maxApplicants
                                                                }
                                                            />

                                                            <MiniMetric
                                                                label="Applicants Listed"
                                                                value={
                                                                    applicants.length
                                                                }
                                                            />

                                                        </div>

                                                    </div>


                                                    {/* =========================================
                                                        EXPAND / COLLAPSE
                                                    ========================================= */}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            toggleSchedule(
                                                                schedule.schedule_id
                                                            )
                                                        }
                                                        className="
                                                            flex
                                                            w-full
                                                            items-center
                                                            justify-between
                                                            gap-3
                                                            border-t
                                                            border-gray-100
                                                            bg-gray-50/70
                                                            px-5
                                                            py-3.5
                                                            text-left
                                                            text-sm
                                                            font-semibold
                                                            text-gray-700
                                                            transition
                                                            hover:bg-gray-100
                                                            sm:px-6
                                                        "
                                                    >

                                                        <span>
                                                            {isExpanded
                                                                ? 'Hide details and applicants'
                                                                : `View details and applicants (${applicants.length})`}
                                                        </span>


                                                        {isExpanded
                                                            ? (
                                                                <ChevronUp
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            )
                                                            : (
                                                                <ChevronDown
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            )}

                                                    </button>


                                                    {/* =========================================
                                                        EXPANDED DETAILS
                                                    ========================================= */}

                                                    {isExpanded && (

                                                        <div
                                                            className="
                                                                border-t
                                                                border-gray-100
                                                                bg-gray-50/40
                                                                p-5
                                                                sm:p-6
                                                            "
                                                        >

                                                            {(schedule.instructions ||
                                                                schedule.notes) && (

                                                                <div
                                                                    className="
                                                                        mb-6
                                                                        grid
                                                                        gap-4
                                                                        lg:grid-cols-2
                                                                    "
                                                                >

                                                                    {schedule.instructions && (

                                                                        <DetailCard
                                                                            title="Applicant Instructions"
                                                                            text={
                                                                                schedule.instructions
                                                                            }
                                                                            maroon={
                                                                                maroon
                                                                            }
                                                                        />

                                                                    )}


                                                                    {schedule.notes && (

                                                                        <DetailCard
                                                                            title="Administrative Notes"
                                                                            text={
                                                                                schedule.notes
                                                                            }
                                                                            maroon={
                                                                                maroon
                                                                            }
                                                                            neutral
                                                                        />

                                                                    )}

                                                                </div>

                                                            )}


                                                            <div
                                                                className="
                                                                    flex
                                                                    flex-col
                                                                    gap-3
                                                                    sm:flex-row
                                                                    sm:items-center
                                                                    sm:justify-between
                                                                "
                                                            >

                                                                <div>

                                                                    <h3 className="font-bold text-gray-900">
                                                                        Scheduled Applicants
                                                                    </h3>

                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        Applicants who selected
                                                                        this examination schedule.
                                                                    </p>

                                                                </div>


                                                                <span
                                                                    className="
                                                                        w-fit
                                                                        rounded-full
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        font-semibold
                                                                    "
                                                                    style={{
                                                                        backgroundColor:
                                                                            '#f5e6e6',

                                                                        color:
                                                                            maroon,
                                                                    }}
                                                                >
                                                                    {
                                                                        applicants.length
                                                                    }{' '}
                                                                    applicant
                                                                    {applicants.length !==
                                                                    1
                                                                        ? 's'
                                                                        : ''}
                                                                </span>

                                                            </div>


                                                            {applicants.length ===
                                                                0 ? (

                                                                <div
                                                                    className="
                                                                        mt-5
                                                                        rounded-xl
                                                                        border
                                                                        border-dashed
                                                                        border-gray-300
                                                                        bg-white
                                                                        px-5
                                                                        py-8
                                                                        text-center
                                                                    "
                                                                >

                                                                    <User
                                                                        size={
                                                                            24
                                                                        }
                                                                        className="mx-auto text-gray-400"
                                                                    />

                                                                    <p className="mt-3 font-semibold text-gray-700">
                                                                        No applicants assigned
                                                                    </p>

                                                                    <p className="mt-1 text-sm text-gray-500">
                                                                        No applicant has selected
                                                                        this schedule yet.
                                                                    </p>

                                                                </div>

                                                            ) : (

                                                                <>
                                                                    {/* DESKTOP TABLE */}

                                                                    <div
                                                                        className="
                                                                            mt-5
                                                                            hidden
                                                                            overflow-hidden
                                                                            rounded-xl
                                                                            border
                                                                            border-gray-200
                                                                            bg-white
                                                                            md:block
                                                                        "
                                                                    >

                                                                        <div
                                                                            className="
                                                                                grid
                                                                                grid-cols-12
                                                                                gap-4
                                                                                border-b
                                                                                border-gray-200
                                                                                bg-gray-50
                                                                                px-4
                                                                                py-3
                                                                                text-xs
                                                                                font-semibold
                                                                                uppercase
                                                                                tracking-wide
                                                                                text-gray-500
                                                                            "
                                                                        >

                                                                            <div className="col-span-4">
                                                                                Applicant
                                                                            </div>

                                                                            <div className="col-span-3">
                                                                                Applicant Number
                                                                            </div>

                                                                            <div className="col-span-3">
                                                                                Program
                                                                            </div>

                                                                            <div className="col-span-2">
                                                                                Status
                                                                            </div>

                                                                        </div>


                                                                        <div className="divide-y divide-gray-100">

                                                                            {applicants.map(
                                                                                (
                                                                                    applicant
                                                                                ) => (

                                                                                    <div
                                                                                        key={
                                                                                            applicant.application_id
                                                                                        }
                                                                                        className="
                                                                                            grid
                                                                                            grid-cols-12
                                                                                            items-center
                                                                                            gap-4
                                                                                            px-4
                                                                                            py-4
                                                                                        "
                                                                                    >

                                                                                        <div className="col-span-4">

                                                                                            <div className="flex items-center gap-3">

                                                                                                <div
                                                                                                    className="
                                                                                                        flex
                                                                                                        h-9
                                                                                                        w-9
                                                                                                        shrink-0
                                                                                                        items-center
                                                                                                        justify-center
                                                                                                        rounded-full
                                                                                                    "
                                                                                                    style={{
                                                                                                        backgroundColor:
                                                                                                            '#f5e6e6',

                                                                                                        color:
                                                                                                            maroon,
                                                                                                    }}
                                                                                                >

                                                                                                    <User
                                                                                                        size={
                                                                                                            16
                                                                                                        }
                                                                                                    />

                                                                                                </div>


                                                                                                <p className="min-w-0 truncate font-semibold text-gray-900">
                                                                                                    {
                                                                                                        applicant.full_name
                                                                                                    }
                                                                                                </p>

                                                                                            </div>

                                                                                        </div>


                                                                                        <div className="col-span-3 text-sm font-medium text-gray-700">
                                                                                            {
                                                                                                applicant.applicant_number
                                                                                            }
                                                                                        </div>


                                                                                        <div className="col-span-3">

                                                                                            <div className="flex items-center gap-2 text-sm text-gray-700">

                                                                                                <GraduationCap
                                                                                                    size={
                                                                                                        16
                                                                                                    }
                                                                                                    style={{
                                                                                                        color:
                                                                                                            maroon,
                                                                                                    }}
                                                                                                />

                                                                                                <span>
                                                                                                    {applicant.program ||
                                                                                                        'Not specified'}
                                                                                                </span>

                                                                                            </div>

                                                                                        </div>


                                                                                        <div className="col-span-2">

                                                                                            <span
                                                                                                className={`
                                                                                                    inline-flex
                                                                                                    rounded-full
                                                                                                    px-2.5
                                                                                                    py-1
                                                                                                    text-xs
                                                                                                    font-semibold
                                                                                                    ${getApplicationStatusClass(
                                                                                                        applicant.application_status
                                                                                                    )}
                                                                                                `}
                                                                                            >
                                                                                                {
                                                                                                    applicant.application_status
                                                                                                }
                                                                                            </span>

                                                                                        </div>

                                                                                    </div>

                                                                                )
                                                                            )}

                                                                        </div>

                                                                    </div>


                                                                    {/* MOBILE APPLICANT CARDS */}

                                                                    <div className="mt-5 space-y-3 md:hidden">

                                                                        {applicants.map(
                                                                            (
                                                                                applicant
                                                                            ) => (

                                                                                <div
                                                                                    key={
                                                                                        applicant.application_id
                                                                                    }
                                                                                    className="
                                                                                        rounded-xl
                                                                                        border
                                                                                        border-gray-200
                                                                                        bg-white
                                                                                        p-4
                                                                                    "
                                                                                >

                                                                                    <div className="flex items-start justify-between gap-3">

                                                                                        <div className="flex min-w-0 items-center gap-3">

                                                                                            <div
                                                                                                className="
                                                                                                    flex
                                                                                                    h-10
                                                                                                    w-10
                                                                                                    shrink-0
                                                                                                    items-center
                                                                                                    justify-center
                                                                                                    rounded-full
                                                                                                "
                                                                                                style={{
                                                                                                    backgroundColor:
                                                                                                        '#f5e6e6',

                                                                                                    color:
                                                                                                        maroon,
                                                                                                }}
                                                                                            >

                                                                                                <User
                                                                                                    size={
                                                                                                        18
                                                                                                    }
                                                                                                />

                                                                                            </div>


                                                                                            <div className="min-w-0">

                                                                                                <p className="truncate font-semibold text-gray-900">
                                                                                                    {
                                                                                                        applicant.full_name
                                                                                                    }
                                                                                                </p>

                                                                                                <p className="mt-0.5 text-xs text-gray-500">
                                                                                                    {
                                                                                                        applicant.applicant_number
                                                                                                    }
                                                                                                </p>

                                                                                            </div>

                                                                                        </div>


                                                                                        <span
                                                                                            className={`
                                                                                                inline-flex
                                                                                                shrink-0
                                                                                                rounded-full
                                                                                                px-2.5
                                                                                                py-1
                                                                                                text-[11px]
                                                                                                font-semibold
                                                                                                ${getApplicationStatusClass(
                                                                                                    applicant.application_status
                                                                                                )}
                                                                                            `}
                                                                                        >
                                                                                            {
                                                                                                applicant.application_status
                                                                                            }
                                                                                        </span>

                                                                                    </div>


                                                                                    <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-3 text-sm text-gray-600">

                                                                                        <GraduationCap
                                                                                            size={
                                                                                                16
                                                                                            }
                                                                                            style={{
                                                                                                color:
                                                                                                    maroon,
                                                                                            }}
                                                                                        />

                                                                                        {applicant.program ||
                                                                                            'Not specified'}

                                                                                    </div>

                                                                                </div>

                                                                            )
                                                                        )}

                                                                    </div>

                                                                </>

                                                            )}

                                                        </div>

                                                    )}

                                                </section>

                                            );
                                        }
                                    )}

                                </div>

                            )}


                            {/* =================================================
                                MANAGEMENT NOTICE
                            ================================================= */}

                            <div
                                className="
                                    mt-8
                                    rounded-2xl
                                    border
                                    border-[#ead0d0]
                                    bg-[#f9eeee]
                                    p-5
                                    sm:p-6
                                "
                            >

                                <div className="flex items-start gap-4">

                                    <div
                                        className="
                                            flex
                                            h-10
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-white
                                            shadow-sm
                                        "
                                        style={{
                                            color:
                                                maroon,
                                        }}
                                    >

                                        <Info
                                            size={
                                                19
                                            }
                                        />

                                    </div>


                                    <div>

                                        <h2
                                            className="font-bold"
                                            style={{
                                                color:
                                                    darkMaroon,
                                            }}
                                        >
                                            Schedule Management Reminder
                                        </h2>


                                        <p className="mt-1 text-sm leading-6 text-gray-600">
                                            Editing or deleting a schedule
                                            can affect applicants who have
                                            already selected it. Review the
                                            assigned applicant list before
                                            changing the date, time, venue,
                                            or capacity.
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

                </PortalLayout>

            </div>
        </>
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
                rounded-2xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                sm:p-6
            "
        >

            <div className="flex items-center gap-4">

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

                        color: maroon,
                    }}
                >

                    <Icon size={20} />

                </div>


                <div className="min-w-0">

                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
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


/*
|--------------------------------------------------------------------------
| Mini Metric
|--------------------------------------------------------------------------
*/

function MiniMetric({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-xl
                bg-gray-50
                px-3
                py-3
                sm:px-4
            "
        >

            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
                {value}
            </p>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Detail Card
|--------------------------------------------------------------------------
*/

function DetailCard({
    title,
    text,
    maroon,
    neutral = false,
}) {
    return (
        <div
            className={`
                rounded-xl
                border
                p-4
                ${
                    neutral
                        ? 'border-gray-200 bg-white'
                        : 'border-[#ead0d0] bg-[#f9eeee]'
                }
            `}
        >

            <p
                className={`
                    text-xs
                    font-bold
                    uppercase
                    tracking-wide
                    ${
                        neutral
                            ? 'text-gray-500'
                            : ''
                    }
                `}
                style={
                    neutral
                        ? {}
                        : {
                              color:
                                  maroon,
                          }
                }
            >
                {title}
            </p>


            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-700">
                {text}
            </p>

        </div>
    );
}

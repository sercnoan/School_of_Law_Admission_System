import PortalLayout from '@/layouts/portal-layout';
import { Head, Link } from '@inertiajs/react';

import { FileText, Users, Search, Eye, Filter, CalendarDays, GraduationCap, Mail, Hash } from 'lucide-react';

import { useMemo, useState } from 'react';

export default function Applications({
    applications = [],
}) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [programFilter, setProgramFilter] = useState('All');

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    /*
    |--------------------------------------------------------------------------
    | Filter Applications
    |--------------------------------------------------------------------------
    */

    const filteredApplications = useMemo(() => {
        return applications.filter((application) => {
            const searchText = search
                .toLowerCase()
                .trim();

            const matchesSearch =
                !searchText ||
                application.full_name
                    ?.toLowerCase()
                    .includes(searchText) ||
                application.applicant_number
                    ?.toLowerCase()
                    .includes(searchText) ||
                application.email
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesStatus =
                statusFilter === 'All' ||
                application.application_status ===
                    statusFilter;

            const matchesProgram =
                programFilter === 'All' ||
                application.program ===
                    programFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesProgram
            );
        });
    }, [
        applications,
        search,
        statusFilter,
        programFilter,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Status Badge
    |--------------------------------------------------------------------------
    */

    const statusBadge = (status) => {
        switch (status) {
            case 'Approved':
                return {
                    className:
                        'bg-green-50 text-green-700 ring-1 ring-green-200',
                    dot: 'bg-green-500',
                };

            case 'Declined':
                return {
                    className:
                        'bg-red-50 text-red-700 ring-1 ring-red-200',
                    dot: 'bg-red-500',
                };

            case 'Under Review':
                return {
                    className:
                        'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
                    dot: 'bg-orange-500',
                };

            case 'Completed':
                return {
                    className:
                        'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
                    dot: 'bg-blue-500',
                };

            default:
                return {
                    className:
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
                    dot: 'bg-yellow-500',
                };
        }
    };

    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (date) => {
        if (!date) {
            return 'Not submitted';
        }

        return new Date(date).toLocaleDateString(
            'en-US',
            {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            }
        );
    };

    return (
        <>
            <Head title="Applications" />

            <div className="min-h-screen bg-gray-50">


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <PortalLayout audience="admin">

                    <div
                        className="
                            mx-auto
                            max-w-[1600px]
                            px-4 py-6
                            sm:px-6 sm:py-8
                            lg:px-8 lg:py-10
                        "
                    >

                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <div
                            className="
                                mb-8
                                flex flex-col
                                gap-5
                                sm:mb-10
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div>

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
                                    Applications
                                </h1>

                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-sm
                                        text-gray-500
                                        sm:text-base
                                    "
                                >
                                    Review and manage
                                    applicant submissions
                                    for the School of Law
                                    admission process.
                                </p>

                            </div>


                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    px-5 py-4
                                    shadow-sm
                                "
                            >

                                <p className="text-xs font-medium text-gray-500">
                                    Total Applications
                                </p>

                                <p className="mt-1 text-2xl font-bold text-gray-900">
                                    {applications.length}
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            SEARCH & FILTERS TITLE
                        ================================================= */}

                        <div className="mb-4 flex items-center gap-2">

                            <Filter
                                size={19}
                                style={{
                                    color: maroon,
                                }}
                            />

                            <h2 className="text-lg font-bold text-gray-900">
                                Search & Filters
                            </h2>

                        </div>


                        {/* =================================================
                            SEARCH / FILTERS
                        ================================================= */}

                        <div
                            className="
                                mb-8
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-5
                                shadow-sm
                                sm:p-6
                            "
                        >

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                                {/* SEARCH */}

                                <div className="relative">

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
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(
                                                e.target.value
                                            )
                                        }
                                        placeholder="Search applicant..."
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
                                            transition
                                            placeholder:text-gray-400
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />

                                </div>


                                {/* STATUS */}

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(e) =>
                                        setStatusFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        h-11
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                >
                                    <option value="All">
                                        All Statuses
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Under Review">
                                        Under Review
                                    </option>

                                    <option value="Approved">
                                        Approved
                                    </option>

                                    <option value="Declined">
                                        Declined
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>
                                </select>


                                {/* PROGRAM */}

                                <select
                                    value={
                                        programFilter
                                    }
                                    onChange={(e) =>
                                        setProgramFilter(
                                            e.target.value
                                        )
                                    }
                                    className="
                                        h-11
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                >
                                    <option value="All">
                                        All Programs
                                    </option>

                                    <option value="Juris Doctor">
                                        Juris Doctor
                                    </option>

                                    <option value="Master of Legal Studies">
                                        Master of Legal Studies
                                    </option>
                                </select>

                            </div>


                            {/* ACTIVE FILTERS */}

                            {(search ||
                                statusFilter !==
                                    'All' ||
                                programFilter !==
                                    'All') && (

                                <div className="mt-4 flex flex-wrap items-center gap-2">

                                    <span className="text-xs text-gray-500">
                                        Active filters:
                                    </span>


                                    {search && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setSearch('')
                                            }
                                            className="
                                                rounded-full
                                                bg-gray-100
                                                px-3 py-1.5
                                                text-xs
                                                font-medium
                                                text-gray-700
                                                hover:bg-gray-200
                                            "
                                        >
                                            Search: {search}
                                        </button>
                                    )}


                                    {statusFilter !==
                                        'All' && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setStatusFilter(
                                                    'All'
                                                )
                                            }
                                            className="
                                                rounded-full
                                                px-3 py-1.5
                                                text-xs
                                                font-medium
                                            "
                                            style={{
                                                backgroundColor:
                                                    '#f5e6e6',
                                                color: maroon,
                                            }}
                                        >
                                            {
                                                statusFilter
                                            }
                                        </button>

                                    )}


                                    {programFilter !==
                                        'All' && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setProgramFilter(
                                                    'All'
                                                )
                                            }
                                            className="
                                                rounded-full
                                                px-3 py-1.5
                                                text-xs
                                                font-medium
                                            "
                                            style={{
                                                backgroundColor:
                                                    '#f5e6e6',
                                                color: maroon,
                                            }}
                                        >
                                            {
                                                programFilter
                                            }
                                        </button>

                                    )}


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearch('');
                                            setStatusFilter(
                                                'All'
                                            );
                                            setProgramFilter(
                                                'All'
                                            );
                                        }}
                                        className="
                                            ml-auto
                                            text-xs
                                            font-semibold
                                            hover:underline
                                        "
                                        style={{
                                            color: maroon,
                                        }}
                                    >
                                        Clear all
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            APPLICATIONS TITLE
                        ================================================= */}

                        <div
                            className="
                                mb-4
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div className="flex items-center gap-2">

                                <FileText
                                    size={19}
                                    style={{
                                        color: maroon,
                                    }}
                                />

                                <h2 className="text-lg font-bold text-gray-900">
                                    Application Records
                                </h2>

                            </div>


                            <p className="text-sm text-gray-500">
                                Showing{' '}
                                <span className="font-semibold text-gray-800">
                                    {
                                        filteredApplications.length
                                    }
                                </span>{' '}
                                of{' '}
                                <span className="font-semibold text-gray-800">
                                    {applications.length}
                                </span>
                            </p>

                        </div>


                        {/* =================================================
                            MOBILE CARDS
                        ================================================= */}

                        <div className="space-y-4 lg:hidden">

                            {filteredApplications.length >
                            0 ? (

                                filteredApplications.map(
                                    (
                                        application
                                    ) => {

                                        const status =
                                            statusBadge(
                                                application.application_status
                                            );

                                        return (

                                            <div
                                                key={
                                                    application.application_id
                                                }
                                                className="
                                                    rounded-2xl
                                                    border
                                                    border-gray-100
                                                    bg-white
                                                    p-5
                                                    shadow-sm
                                                "
                                            >

                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="flex min-w-0 items-center gap-3">

                                                        <div
                                                            className="
                                                                flex
                                                                h-11
                                                                w-11
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                            "
                                                            style={{
                                                                backgroundColor:
                                                                    '#f5e6e6',
                                                                color: maroon,
                                                            }}
                                                        >
                                                            <Users
                                                                size={
                                                                    20
                                                                }
                                                            />
                                                        </div>

                                                        <div className="min-w-0">

                                                            <h3 className="truncate font-semibold text-gray-900">
                                                                {
                                                                    application.full_name
                                                                }
                                                            </h3>

                                                            <p className="mt-0.5 truncate text-xs text-gray-500">
                                                                {
                                                                    application.email
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <span
                                                        className={`
                                                            inline-flex
                                                            shrink-0
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            px-2.5
                                                            py-1.5
                                                            text-[11px]
                                                            font-semibold
                                                            ${status.className}
                                                        `}
                                                    >
                                                        <span
                                                            className={`
                                                                h-1.5
                                                                w-1.5
                                                                rounded-full
                                                                ${status.dot}
                                                            `}
                                                        />

                                                        {
                                                            application.application_status
                                                        }
                                                    </span>

                                                </div>


                                                <div
                                                    className="
                                                        mt-5
                                                        grid
                                                        gap-4
                                                        border-t
                                                        border-gray-100
                                                        pt-4
                                                    "
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <Hash
                                                            size={
                                                                17
                                                            }
                                                            className="text-gray-400"
                                                        />

                                                        <div>

                                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                                Applicant
                                                                Number
                                                            </p>

                                                            <p className="text-sm font-medium text-gray-800">
                                                                {
                                                                    application.applicant_number
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="flex items-center gap-3">

                                                        <GraduationCap
                                                            size={
                                                                17
                                                            }
                                                            style={{
                                                                color: maroon,
                                                            }}
                                                        />

                                                        <div>

                                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                                Program
                                                            </p>

                                                            <p className="text-sm font-medium text-gray-800">
                                                                {
                                                                    application.program
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    <div className="flex items-center gap-3">

                                                        <CalendarDays
                                                            size={
                                                                17
                                                            }
                                                            className="text-gray-400"
                                                        />

                                                        <div>

                                                            <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400">
                                                                Submitted
                                                            </p>

                                                            <p className="text-sm font-medium text-gray-800">
                                                                {formatDate(
                                                                    application.submitted_at
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>


                                                <Link
                                                    href={`/admin/applications/${application.application_id}`}
                                                    className="
                                                        mt-5
                                                        flex w-full
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        px-4 py-3
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
                                                    <Eye
                                                        size={
                                                            17
                                                        }
                                                    />

                                                    View Application
                                                </Link>

                                            </div>

                                        );
                                    }
                                )

                            ) : (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        px-6 py-12
                                        text-center
                                        shadow-sm
                                    "
                                >

                                    <div
                                        className="
                                            mx-auto
                                            flex h-14
                                            w-14
                                            items-center
                                            justify-center
                                            rounded-full
                                        "
                                        style={{
                                            backgroundColor:
                                                '#f5e6e6',
                                            color: maroon,
                                        }}
                                    >
                                        <FileText
                                            size={25}
                                        />
                                    </div>

                                    <h3 className="mt-4 font-semibold text-gray-800">
                                        No applications
                                        found
                                    </h3>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Try changing your
                                        search or filters.
                                    </p>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            DESKTOP TABLE
                        ================================================= */}

                        <div
                            className="
                                hidden
                                overflow-hidden
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                shadow-sm
                                lg:block
                            "
                        >

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="border-b border-gray-200 bg-gray-50/80">

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Applicant
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Applicant
                                                Number
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Program
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Submitted
                                            </th>

                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Status
                                            </th>

                                            <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {filteredApplications.length >
                                        0 ? (

                                            filteredApplications.map(
                                                (
                                                    application
                                                ) => {

                                                    const status =
                                                        statusBadge(
                                                            application.application_status
                                                        );

                                                    return (

                                                        <tr
                                                            key={
                                                                application.application_id
                                                            }
                                                            className="
                                                                transition
                                                                hover:bg-gray-50
                                                            "
                                                        >

                                                            {/* APPLICANT */}

                                                            <td className="px-6 py-5">

                                                                <div className="flex items-center gap-3">

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
                                                                            color: maroon,
                                                                        }}
                                                                    >
                                                                        <Users
                                                                            size={
                                                                                18
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="min-w-0">

                                                                        <p className="font-semibold text-gray-900">
                                                                            {
                                                                                application.full_name
                                                                            }
                                                                        </p>

                                                                        <p
                                                                            className="
                                                                                mt-0.5
                                                                                flex
                                                                                items-center
                                                                                gap-1
                                                                                text-xs
                                                                                text-gray-500
                                                                            "
                                                                        >
                                                                            <Mail
                                                                                size={
                                                                                    12
                                                                                }
                                                                            />

                                                                            {
                                                                                application.email
                                                                            }
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            {/* APPLICANT NUMBER */}

                                                            <td className="px-6 py-5">

                                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">

                                                                    <Hash
                                                                        size={
                                                                            15
                                                                        }
                                                                        className="text-gray-400"
                                                                    />

                                                                    {
                                                                        application.applicant_number
                                                                    }

                                                                </div>

                                                            </td>


                                                            {/* PROGRAM */}

                                                            <td className="px-6 py-5">

                                                                <div className="flex items-center gap-2">

                                                                    <GraduationCap
                                                                        size={
                                                                            17
                                                                        }
                                                                        style={{
                                                                            color: maroon,
                                                                        }}
                                                                    />

                                                                    <span className="text-sm font-medium text-gray-800">
                                                                        {
                                                                            application.program
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </td>


                                                            {/* SUBMITTED */}

                                                            <td className="px-6 py-5">

                                                                <div className="flex items-center gap-2 text-sm text-gray-600">

                                                                    <CalendarDays
                                                                        size={
                                                                            16
                                                                        }
                                                                        className="text-gray-400"
                                                                    />

                                                                    {formatDate(
                                                                        application.submitted_at
                                                                    )}

                                                                </div>

                                                            </td>


                                                            {/* STATUS */}

                                                            <td className="px-6 py-5">

                                                                <span
                                                                    className={`
                                                                        inline-flex
                                                                        items-center
                                                                        gap-2
                                                                        rounded-full
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        font-semibold
                                                                        ${status.className}
                                                                    `}
                                                                >

                                                                    <span
                                                                        className={`
                                                                            h-1.5
                                                                            w-1.5
                                                                            rounded-full
                                                                            ${status.dot}
                                                                        `}
                                                                    />

                                                                    {
                                                                        application.application_status
                                                                    }

                                                                </span>

                                                            </td>


                                                            {/* ACTION */}

                                                            <td className="px-6 py-5 text-center">

                                                                <Link
                                                                    href={`/admin/applications/${application.application_id}`}
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-2
                                                                        rounded-xl
                                                                        px-4
                                                                        py-2.5
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
                                                                    <Eye
                                                                        size={
                                                                            16
                                                                        }
                                                                    />

                                                                    View
                                                                </Link>

                                                            </td>

                                                        </tr>

                                                    );
                                                }
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan={
                                                        6
                                                    }
                                                    className="px-6 py-16 text-center"
                                                >

                                                    <div
                                                        className="
                                                            mx-auto
                                                            flex
                                                            h-14
                                                            w-14
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                        "
                                                        style={{
                                                            backgroundColor:
                                                                '#f5e6e6',
                                                            color: maroon,
                                                        }}
                                                    >
                                                        <FileText
                                                            size={
                                                                26
                                                            }
                                                        />
                                                    </div>

                                                    <h3 className="mt-4 font-semibold text-gray-800">
                                                        No
                                                        applications
                                                        found
                                                    </h3>

                                                    <p className="mt-1 text-sm text-gray-500">
                                                        Try
                                                        changing
                                                        your
                                                        search or
                                                        filters.
                                                    </p>

                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* =================================================
                            RESULT COUNT
                        ================================================= */}

                        <div
                            className="
                                mt-4
                                flex
                                flex-col
                                gap-2
                                text-xs
                                text-gray-500
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <p>
                                Showing{' '}

                                <span className="font-semibold text-gray-700">
                                    {
                                        filteredApplications.length
                                    }
                                </span>{' '}

                                of{' '}

                                <span className="font-semibold text-gray-700">
                                    {
                                        applications.length
                                    }
                                </span>{' '}

                                applications
                            </p>


                            {(search ||
                                statusFilter !==
                                    'All' ||
                                programFilter !==
                                    'All') && (

                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch('');
                                        setStatusFilter(
                                            'All'
                                        );
                                        setProgramFilter(
                                            'All'
                                        );
                                    }}
                                    className="w-fit font-semibold hover:underline"
                                    style={{
                                        color: maroon,
                                    }}
                                >
                                    Clear all filters
                                </button>

                            )}

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
                                Administration
                            </p>

                        </div>

                    </div>

                </PortalLayout>

            </div>
        </>
    );
}
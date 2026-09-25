import PortalLayout from '@/layouts/portal-layout';
import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { CheckCircle2, ClipboardCheck, Download, GraduationCap, Mail, Search } from 'lucide-react';

export default function FinalList({
    finalists = [],
}) {

    const [search, setSearch] =
        useState('');

    const [academicYearFilter, setAcademicYearFilter] =
        useState('All');

    const [programFilter, setProgramFilter] =
        useState('All');

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';


    /*
    |--------------------------------------------------------------------------
    | Academic Years
    |--------------------------------------------------------------------------
    */

    const academicYears =
        useMemo(() => {

            return [
                ...new Set(
                    finalists
                        .map(
                            (finalist) =>
                                finalist.academic_year
                        )
                        .filter(Boolean)
                ),
            ].sort(
                (a, b) =>
                    String(b).localeCompare(
                        String(a)
                    )
            );

        }, [finalists]);


    /*
    |--------------------------------------------------------------------------
    | Programs
    |--------------------------------------------------------------------------
    */

    const programs =
        useMemo(() => {

            return [
                ...new Set(
                    finalists
                        .map(
                            (finalist) =>
                                finalist.program
                        )
                        .filter(Boolean)
                ),
            ].sort();

        }, [finalists]);


    /*
    |--------------------------------------------------------------------------
    | Filtered Finalists
    |--------------------------------------------------------------------------
    */

    const filteredFinalists =
        useMemo(() => {

            const normalizedSearch =
                search
                    .trim()
                    .toLowerCase();

            return finalists.filter(
                (finalist) => {

                    const matchesSearch =
                        !normalizedSearch ||
                        [
                            finalist.full_name,
                            finalist.applicant_number,
                            finalist.email,
                        ]
                            .filter(Boolean)
                            .some(
                                (value) =>
                                    String(value)
                                        .toLowerCase()
                                        .includes(
                                            normalizedSearch
                                        )
                            );

                    const matchesAcademicYear =
                        academicYearFilter ===
                            'All' ||
                        finalist.academic_year ===
                            academicYearFilter;

                    const matchesProgram =
                        programFilter ===
                            'All' ||
                        finalist.program ===
                            programFilter;

                    return (
                        matchesSearch &&
                        matchesAcademicYear &&
                        matchesProgram
                    );
                }
            );

        }, [
            finalists,
            search,
            academicYearFilter,
            programFilter,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Clear Filters
    |--------------------------------------------------------------------------
    */

    const clearFilters = () => {
        setSearch('');
        setAcademicYearFilter(
            'All'
        );
        setProgramFilter(
            'All'
        );
    };


    const hasFilters =
        search ||
        academicYearFilter !==
            'All' ||
        programFilter !==
            'All';


    return (
        <>
            <Head title="Final List" />

            <div className="min-h-screen bg-gray-50">


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <PortalLayout audience="admin">

                    <div className="mx-auto max-w-7xl">

                        {/* PAGE HEADER */}

                        <div className="mb-7">

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-end
                                    sm:justify-between
                                "
                            >

                                <div>

                                    <p
                                        className="text-sm font-semibold"
                                        style={{
                                            color:
                                                maroon,
                                        }}
                                    >
                                        Admission Management
                                    </p>


                                    <h1
                                        className="
                                            mt-1
                                            text-2xl
                                            font-bold
                                            sm:text-3xl
                                        "
                                        style={{
                                            color:
                                                darkMaroon,
                                        }}
                                    >
                                        Final List
                                    </h1>


                                    <p
                                        className="
                                            mt-2
                                            max-w-3xl
                                            text-sm
                                            leading-6
                                            text-gray-500
                                        "
                                    >
                                        Applicants shown here have successfully
                                        passed the admission interview and are
                                        ready for the next admission process.
                                    </p>

                                </div>


                                <div
                                    className="
                                        flex
                                        w-full
                                        flex-col
                                        gap-3
                                        sm:w-auto
                                        sm:flex-row
                                        sm:items-center
                                    "
                                >

                                    <div
                                        className="
                                            inline-flex
                                            w-fit
                                            items-center
                                            gap-2
                                            rounded-xl
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                        "
                                        style={{
                                            backgroundColor:
                                                '#f5e6e6',

                                            color:
                                                maroon,
                                        }}
                                    >
                                        <ClipboardCheck
                                            size={18}
                                        />

                                        {
                                            finalists.length
                                        }{' '}

                                        Qualified Applicant
                                        {
                                            finalists.length ===
                                            1
                                                ? ''
                                                : 's'
                                        }

                                    </div>


                                    {finalists.length > 0 ? (

                                        <a
                                            href="/admin/final-list/pdf"
                                            className="
                                                inline-flex
                                                w-fit
                                                items-center
                                                justify-center
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
                                            <Download
                                                size={18}
                                            />

                                            Download PDF
                                        </a>

                                    ) : (

                                        <button
                                            type="button"
                                            disabled
                                            className="
                                                inline-flex
                                                w-fit
                                                cursor-not-allowed
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                bg-gray-300
                                                px-4
                                                py-2.5
                                                text-sm
                                                font-semibold
                                                text-gray-500
                                            "
                                        >
                                            <Download
                                                size={18}
                                            />

                                            Download PDF
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* SUMMARY CARD */}

                        <div className="mb-6">

                            <div
                                className="
                                    max-w-sm
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    p-5
                                    shadow-sm
                                "
                            >

                                <div className="flex items-center gap-4">

                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-green-100
                                            text-green-700
                                        "
                                    >
                                        <CheckCircle2
                                            size={21}
                                        />
                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-gray-500
                                            "
                                        >
                                            Ready for Admission
                                        </p>


                                        <p className="mt-1 text-2xl font-bold text-gray-900">
                                            {
                                                finalists.length
                                            }
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* FILTERS */}

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
                                    grid
                                    grid-cols-1
                                    gap-4
                                    md:grid-cols-2
                                    xl:grid-cols-3
                                "
                            >

                                {/* SEARCH */}

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-wider
                                            text-gray-500
                                        "
                                    >
                                        Search
                                    </label>


                                    <div className="relative">

                                        <Search
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
                                            placeholder="Name, applicant no., email..."
                                            className="
                                                w-full
                                                rounded-xl
                                                border
                                                border-gray-300
                                                bg-white
                                                py-3
                                                pl-11
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

                                </div>


                                <FilterSelect
                                    label="Academic Year"
                                    value={
                                        academicYearFilter
                                    }
                                    onChange={
                                        setAcademicYearFilter
                                    }
                                    allLabel="All Academic Years"
                                    options={
                                        academicYears
                                    }
                                />


                                <FilterSelect
                                    label="Program"
                                    value={
                                        programFilter
                                    }
                                    onChange={
                                        setProgramFilter
                                    }
                                    allLabel="All Programs"
                                    options={
                                        programs
                                    }
                                />

                            </div>


                            {hasFilters && (

                                <div className="mt-4 text-right">

                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        className="
                                            text-sm
                                            font-semibold
                                            hover:underline
                                        "
                                        style={{
                                            color:
                                                maroon,
                                        }}
                                    >
                                        Clear all filters
                                    </button>

                                </div>

                            )}

                        </div>


                        {/* DESKTOP TABLE */}

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

                                        <tr className="border-b border-gray-200 bg-gray-50">

                                            <TableHeader>
                                                Applicant
                                            </TableHeader>

                                            <TableHeader>
                                                Applicant No.
                                            </TableHeader>

                                            <TableHeader>
                                                Academic Year
                                            </TableHeader>

                                            <TableHeader>
                                                Program
                                            </TableHeader>

                                            <TableHeader>
                                                Email
                                            </TableHeader>

                                            <TableHeader>
                                                Interview
                                            </TableHeader>

                                            <TableHeader>
                                                Status
                                            </TableHeader>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {filteredFinalists.length >
                                        0 ? (

                                            filteredFinalists.map(
                                                (
                                                    finalist
                                                ) => (

                                                    <tr
                                                        key={
                                                            finalist.application_id
                                                        }
                                                        className="
                                                            transition
                                                            hover:bg-gray-50
                                                        "
                                                    >

                                                        <td className="px-5 py-5">

                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    finalist.full_name
                                                                }
                                                            </p>

                                                            {finalist.contact_number && (

                                                                <p className="mt-1 text-xs text-gray-500">
                                                                    {
                                                                        finalist.contact_number
                                                                    }
                                                                </p>

                                                            )}

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <span className="text-sm font-medium text-gray-700">
                                                                {
                                                                    finalist.applicant_number
                                                                }
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <span
                                                                className="
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
                                                                {finalist.academic_year
                                                                    ? `AY ${finalist.academic_year}`
                                                                    : 'Not assigned'}
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <div className="flex items-center gap-2 text-sm text-gray-800">

                                                                <GraduationCap
                                                                    size={16}
                                                                    style={{
                                                                        color:
                                                                            maroon,
                                                                    }}
                                                                />

                                                                {
                                                                    finalist.program
                                                                }

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <div className="flex items-center gap-2 text-sm text-gray-700">

                                                                <Mail
                                                                    size={15}
                                                                    className="shrink-0 text-gray-400"
                                                                />

                                                                <span className="break-all">
                                                                    {
                                                                        finalist.email
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <div className="space-y-1">

                                                                <span
                                                                    className="
                                                                        inline-flex
                                                                        items-center
                                                                        gap-1.5
                                                                        rounded-full
                                                                        bg-green-100
                                                                        px-3
                                                                        py-1.5
                                                                        text-xs
                                                                        font-semibold
                                                                        text-green-700
                                                                    "
                                                                >
                                                                    <CheckCircle2
                                                                        size={14}
                                                                    />

                                                                    Passed
                                                                </span>


                                                                {finalist.interview_decided_at && (

                                                                    <p className="text-xs text-gray-400">
                                                                        Recorded{' '}
                                                                        {
                                                                            formatDateTime(
                                                                                finalist.interview_decided_at
                                                                            )
                                                                        }
                                                                    </p>

                                                                )}

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    bg-green-100
                                                                    px-3
                                                                    py-1.5
                                                                    text-xs
                                                                    font-semibold
                                                                    text-green-700
                                                                "
                                                            >
                                                                <ClipboardCheck
                                                                    size={14}
                                                                />

                                                                Ready for Admission
                                                            </span>

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan={
                                                        7
                                                    }
                                                    className="
                                                        px-6
                                                        py-16
                                                        text-center
                                                    "
                                                >
                                                    <EmptyState />
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* MOBILE CARDS */}

                        <div className="space-y-4 lg:hidden">

                            {filteredFinalists.length >
                            0 ? (

                                filteredFinalists.map(
                                    (
                                        finalist
                                    ) => (

                                        <div
                                            key={
                                                finalist.application_id
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

                                                <div className="min-w-0">

                                                    <p className="font-bold text-gray-900">
                                                        {
                                                            finalist.full_name
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {
                                                            finalist.applicant_number
                                                        }
                                                    </p>

                                                </div>


                                                <span
                                                    className="
                                                        inline-flex
                                                        shrink-0
                                                        items-center
                                                        gap-1
                                                        rounded-full
                                                        bg-green-100
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-semibold
                                                        text-green-700
                                                    "
                                                >
                                                    <CheckCircle2
                                                        size={13}
                                                    />

                                                    Passed
                                                </span>

                                            </div>


                                            <div
                                                className="
                                                    mt-4
                                                    grid
                                                    grid-cols-1
                                                    gap-3
                                                    sm:grid-cols-2
                                                "
                                            >

                                                <MobileInfo
                                                    label="Academic Year"
                                                    value={
                                                        finalist.academic_year
                                                            ? `AY ${finalist.academic_year}`
                                                            : 'Not assigned'
                                                    }
                                                />


                                                <MobileInfo
                                                    label="Program"
                                                    value={
                                                        finalist.program
                                                    }
                                                />

                                            </div>


                                            <div className="mt-4 border-t border-gray-100 pt-4">

                                                <p
                                                    className="
                                                        text-xs
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-gray-400
                                                    "
                                                >
                                                    Email
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        break-all
                                                        text-sm
                                                        font-semibold
                                                        text-gray-800
                                                    "
                                                >
                                                    {
                                                        finalist.email
                                                    }
                                                </p>

                                            </div>


                                            <div
                                                className="
                                                    mt-4
                                                    rounded-xl
                                                    bg-green-50
                                                    p-3
                                                    text-sm
                                                    font-semibold
                                                    text-green-700
                                                "
                                            >
                                                <div className="flex items-center gap-2">

                                                    <ClipboardCheck
                                                        size={17}
                                                    />

                                                    Ready for Admission

                                                </div>
                                            </div>

                                        </div>

                                    )
                                )

                            ) : (

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-gray-100
                                        bg-white
                                        px-5
                                        py-12
                                        text-center
                                        shadow-sm
                                    "
                                >
                                    <EmptyState />
                                </div>

                            )}

                        </div>


                        {/* COUNT */}

                        <div className="mt-4 text-sm text-gray-500">

                            Showing{' '}

                            <strong>
                                {
                                    filteredFinalists.length
                                }
                            </strong>

                            {' '}of{' '}

                            <strong>
                                {
                                    finalists.length
                                }
                            </strong>

                            {' '}qualified applicants

                        </div>

                    </div>

                </PortalLayout>

            </div>
        </>
    );
}


/*
|--------------------------------------------------------------------------
| Navigation Item
|--------------------------------------------------------------------------
*/

function NavigationItem({
    href,
    icon: Icon,
    label,
    active = false,
    maroon,
    onClick,
}) {
    return (
        <Link
            href={href}
            onClick={
                onClick
            }
            className={
                active
                    ? 'group flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-white shadow-sm transition'
                    : 'group flex items-center gap-3 rounded-xl px-4 py-3 text-white/75 transition hover:bg-white/10 hover:text-white'
            }
            style={
                active
                    ? {
                          backgroundColor:
                              maroon,
                      }
                    : {}
            }
        >
            <Icon size={20} />

            <span>
                {label}
            </span>
        </Link>
    );
}


/*
|--------------------------------------------------------------------------
| Filter Select
|--------------------------------------------------------------------------
*/

function FilterSelect({
    label,
    value,
    onChange,
    allLabel,
    options,
}) {
    return (
        <div>

            <label
                className="
                    mb-2
                    block
                    text-xs
                    font-bold
                    uppercase
                    tracking-wider
                    text-gray-500
                "
            >
                {label}
            </label>


            <select
                value={
                    value
                }
                onChange={(
                    event
                ) =>
                    onChange(
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
                    text-sm
                    text-gray-900
                    outline-none
                    focus:border-[#922b2b]
                    focus:ring-2
                    focus:ring-[#922b2b]/10
                "
            >

                <option value="All">
                    {allLabel}
                </option>


                {options.map(
                    (
                        option
                    ) => (

                        <option
                            key={
                                option
                            }
                            value={
                                option
                            }
                        >
                            {option}
                        </option>

                    )
                )}

            </select>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Table Header
|--------------------------------------------------------------------------
*/

function TableHeader({
    children,
}) {
    return (
        <th
            className="
                px-5
                py-4
                text-left
                text-xs
                font-bold
                uppercase
                tracking-wider
                text-gray-500
            "
        >
            {children}
        </th>
    );
}


/*
|--------------------------------------------------------------------------
| Mobile Info
|--------------------------------------------------------------------------
*/

function MobileInfo({
    label,
    value,
}) {
    return (
        <div>

            <p
                className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-400
                "
            >
                {label}
            </p>


            <p className="mt-1 text-sm font-semibold text-gray-800">
                {value ||
                    'Not available'}
            </p>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

function EmptyState()
{
    return (
        <div>

            <div
                className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-100
                    text-gray-400
                "
            >
                <ClipboardCheck
                    size={26}
                />
            </div>


            <h3 className="mt-4 font-semibold text-gray-800">
                No qualified applicants found
            </h3>


            <p className="mt-1 text-sm text-gray-500">
                Applicants will appear here after passing their admission interview.
            </p>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Format Date Time
|--------------------------------------------------------------------------
*/

function formatDateTime(
    dateTime
) {
    if (!dateTime) {
        return '';
    }


    const date =
        new Date(
            String(dateTime).replace(
                ' ',
                'T'
            )
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return dateTime;
    }


    return date
        .toLocaleString(
            'en-US',
            {
                year:
                    'numeric',

                month:
                    'short',

                day:
                    'numeric',

                hour:
                    'numeric',

                minute:
                    '2-digit',
            }
        );
}

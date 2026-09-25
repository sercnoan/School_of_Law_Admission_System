import PortalLayout from '@/layouts/portal-layout';
import { Head, useForm, usePage } from '@inertiajs/react';

import { LayoutDashboard, FileText, Users, CalendarDays, X, Search, Filter, CheckCircle, XCircle, Clock, MapPin, Mail, GraduationCap, UserCheck, CalendarCheck, ClipboardCheck, BookOpen } from 'lucide-react';

import {
    useMemo,
    useState,
} from 'react';


export default function Examinees({
    examinees = [],
    academicYears = [],
}) {
    const {
        flash,
    } = usePage().props;


    const [
        search,
        setSearch,
    ] = useState('');


    const [
        academicYearFilter,
        setAcademicYearFilter,
    ] = useState('All');


    const [
        programFilter,
        setProgramFilter,
    ] = useState('All');


    const [
        resultFilter,
        setResultFilter,
    ] = useState('All');


    const [
        passTarget,
        setPassTarget,
    ] = useState(null);


    const [
        failTarget,
        setFailTarget,
    ] = useState(null);


    const maroon =
        '#922b2b';

    const darkMaroon =
        '#691f1f';


    /*
    |--------------------------------------------------------------------------
    | Passed Form
    |--------------------------------------------------------------------------
    */

    const passForm =
        useForm({
            interview_date: '',
            interview_time: '',
            venue: '',
            instructions: '',
        });


    /*
    |--------------------------------------------------------------------------
    | Failed Form
    |--------------------------------------------------------------------------
    */

    const failForm =
        useForm({});


    /*
    |--------------------------------------------------------------------------
    | Filter Examinees
    |--------------------------------------------------------------------------
    */

    const filteredExaminees =
        useMemo(() => {

            return examinees.filter(
                (examinee) => {

                    const text =
                        search
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        !text ||

                        examinee.full_name
                            ?.toLowerCase()
                            .includes(
                                text
                            ) ||

                        examinee.applicant_number
                            ?.toLowerCase()
                            .includes(
                                text
                            ) ||

                        examinee.email
                            ?.toLowerCase()
                            .includes(
                                text
                            );


                    const matchesYear =
                        academicYearFilter ===
                            'All' ||

                        examinee.academic_year ===
                            academicYearFilter;


                    const matchesProgram =
                        programFilter ===
                            'All' ||

                        examinee.program ===
                            programFilter;


                    const matchesResult =
                        resultFilter ===
                            'All' ||

                        examinee.exam_result ===
                            resultFilter;


                    return (
                        matchesSearch &&
                        matchesYear &&
                        matchesProgram &&
                        matchesResult
                    );
                }
            );

        }, [
            examinees,
            search,
            academicYearFilter,
            programFilter,
            resultFilter,
        ]);


    /*
    |--------------------------------------------------------------------------
    | Counts
    |--------------------------------------------------------------------------
    */

    const pendingCount =
        examinees.filter(
            (item) =>
                item.exam_result ===
                'Pending'
        ).length;


    const passedCount =
        examinees.filter(
            (item) =>
                item.exam_result ===
                'Passed'
        ).length;


    const failedCount =
        examinees.filter(
            (item) =>
                item.exam_result ===
                'Failed'
        ).length;


    /*
    |--------------------------------------------------------------------------
    | Format Date
    |--------------------------------------------------------------------------
    */

    const formatDate = (
        date
    ) => {

        if (!date) {
            return 'Not available';
        }


        return new Date(
            `${date}T00:00:00`
        ).toLocaleDateString(
            'en-US',
            {
                year:
                    'numeric',

                month:
                    'long',

                day:
                    'numeric',
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Format Time
    |--------------------------------------------------------------------------
    */

    const formatTime = (
        time
    ) => {

        if (!time) {
            return 'Not available';
        }


        const [
            hours,
            minutes,
        ] =
            String(time)
                .split(':')
                .map(Number);


        const value =
            new Date();


        value.setHours(
            hours,
            minutes,
            0,
            0
        );


        return value
            .toLocaleTimeString(
                'en-US',
                {
                    hour:
                        'numeric',

                    minute:
                        '2-digit',
                }
            );
    };


    /*
    |--------------------------------------------------------------------------
    | Examination Finished
    |--------------------------------------------------------------------------
    */

    const examFinished = (
        examinee
    ) => {

        if (
            examinee.schedule_status ===
            'Completed'
        ) {
            return true;
        }


        const date =
            new Date(
                `${examinee.exam_date}T${String(
                    examinee.exam_time
                ).slice(
                    0,
                    8
                )}`
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return false;
        }


        return (
            date.getTime() <=
            Date.now()
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Open Passed Modal
    |--------------------------------------------------------------------------
    */

    const openPassModal = (
        examinee
    ) => {

        passForm.reset();

        passForm.clearErrors();

        setPassTarget(
            examinee
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Open Failed Modal
    |--------------------------------------------------------------------------
    */

    const openFailModal = (
        examinee
    ) => {

        failForm.reset();

        failForm.clearErrors();

        setFailTarget(
            examinee
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Submit Passed
    |--------------------------------------------------------------------------
    */

    const submitPassed = (
        event
    ) => {

        event.preventDefault();


        if (!passTarget) {
            return;
        }


        passForm.post(
            `/admin/examinees/${passTarget.application_id}/pass`,
            {
                preserveScroll:
                    true,

                onSuccess: () => {

                    setPassTarget(
                        null
                    );

                    passForm.reset();
                },
            }
        );
    };


    /*
    |--------------------------------------------------------------------------
    | Submit Failed
    |--------------------------------------------------------------------------
    */

    const submitFailed = (
        event
    ) => {

        event.preventDefault();


        if (!failTarget) {
            return;
        }


        failForm.post(
            `/admin/examinees/${failTarget.application_id}/fail`,
            {
                preserveScroll:
                    true,

                onSuccess: () => {

                    setFailTarget(
                        null
                    );

                    failForm.reset();
                },
            }
        );
    };


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

        setResultFilter(
            'All'
        );
    };


    const hasFilters =
        search ||
        academicYearFilter !==
            'All' ||
        programFilter !==
            'All' ||
        resultFilter !==
            'All';


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


    return (
        <>
            <Head title="Examinees" />


            <div className="min-h-screen bg-gray-50">


                {/* MAIN */}

                <PortalLayout audience="admin">

                    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">

                        {/* HEADER */}

                        <div className="mb-8">

                            <p
                                className="mb-2 text-sm font-semibold"
                                style={{
                                    color:
                                        maroon,
                                }}
                            >
                                ADMINISTRATION PORTAL
                            </p>


                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl lg:text-4xl">
                                Examinees
                            </h1>


                            <p className="mt-2 max-w-3xl text-sm text-gray-500 sm:text-base">
                                View applicants who have
                                selected an examination
                                schedule, record their
                                examination result, and
                                automatically notify them
                                by email.
                            </p>

                        </div>


                        {/* FLASH */}

                        {flash?.success && (

                            <AlertBox
                                type="success"
                                message={
                                    flash.success
                                }
                            />

                        )}


                        {flash?.warning && (

                            <AlertBox
                                type="warning"
                                message={
                                    flash.warning
                                }
                            />

                        )}


                        {flash?.error && (

                            <AlertBox
                                type="error"
                                message={
                                    flash.error
                                }
                            />

                        )}


                        {/* SUMMARY */}

                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                            <SummaryCard
                                label="Total Examinees"
                                value={
                                    examinees.length
                                }
                                icon={
                                    Users
                                }
                                maroon={
                                    maroon
                                }
                            />


                            <SummaryCard
                                label="Pending Results"
                                value={
                                    pendingCount
                                }
                                icon={
                                    Clock
                                }
                            />


                            <SummaryCard
                                label="Passed"
                                value={
                                    passedCount
                                }
                                icon={
                                    CheckCircle
                                }
                                type="success"
                            />


                            <SummaryCard
                                label="Failed"
                                value={
                                    failedCount
                                }
                                icon={
                                    XCircle
                                }
                                type="danger"
                            />

                        </div>


                        {/* FILTERS */}

                        <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">

                            <div className="mb-4 flex items-center gap-2">

                                <Filter
                                    size={19}
                                    style={{
                                        color:
                                            maroon,
                                    }}
                                />

                                <h2 className="font-bold text-gray-900">
                                    Search & Filters
                                </h2>

                            </div>


                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

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
                                        placeholder="Search examinee..."
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
                                            caret-gray-900
                                            outline-none
                                            placeholder:text-gray-400
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />

                                </div>


                                <select
                                    value={
                                        academicYearFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setAcademicYearFilter(
                                            event
                                                .target
                                                .value
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
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                >

                                    <option value="All">
                                        All Academic Years
                                    </option>


                                    {academicYears.map(
                                        (
                                            year
                                        ) => (

                                            <option
                                                key={
                                                    year
                                                }
                                                value={
                                                    year
                                                }
                                            >
                                                AY {year}
                                            </option>

                                        )
                                    )}

                                </select>


                                <select
                                    value={
                                        programFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setProgramFilter(
                                            event
                                                .target
                                                .value
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


                                <select
                                    value={
                                        resultFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setResultFilter(
                                            event
                                                .target
                                                .value
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
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                >

                                    <option value="All">
                                        All Results
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>

                                    <option value="Passed">
                                        Passed
                                    </option>

                                    <option value="Failed">
                                        Failed
                                    </option>

                                </select>

                            </div>


                            {hasFilters && (

                                <div className="mt-4 text-right">

                                    <button
                                        type="button"
                                        onClick={
                                            clearFilters
                                        }
                                        className="text-sm font-semibold hover:underline"
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

                        <div className="hidden overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:block">

                            <div className="overflow-x-auto">

                                <table className="w-full">

                                    <thead>

                                        <tr className="border-b border-gray-200 bg-gray-50">

                                            <TableHeader>
                                                Examinee
                                            </TableHeader>

                                            <TableHeader>
                                                Academic Year
                                            </TableHeader>

                                            <TableHeader>
                                                Program
                                            </TableHeader>

                                            <TableHeader>
                                                Examination
                                            </TableHeader>

                                            <TableHeader>
                                                Result
                                            </TableHeader>

                                            <TableHeader>
                                                Email
                                            </TableHeader>

                                            <th className="px-5 py-4 text-center text-xs font-bold uppercase tracking-wider text-gray-500">
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody className="divide-y divide-gray-100">

                                        {filteredExaminees.length >
                                        0 ? (

                                            filteredExaminees.map(
                                                (
                                                    examinee
                                                ) => (

                                                    <tr
                                                        key={
                                                            examinee.application_id
                                                        }
                                                        className="hover:bg-gray-50"
                                                    >

                                                        <td className="px-5 py-5">

                                                            <p className="font-semibold text-gray-900">
                                                                {
                                                                    examinee.full_name
                                                                }
                                                            </p>

                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {
                                                                    examinee.applicant_number
                                                                }
                                                            </p>

                                                            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">

                                                                <Mail size={12} />

                                                                {
                                                                    examinee.email
                                                                }

                                                            </p>

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
                                                                {examinee.academic_year
                                                                    ? `AY ${examinee.academic_year}`
                                                                    : 'Not assigned'}
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <div className="flex items-center gap-2 text-sm">

                                                                <GraduationCap
                                                                    size={16}
                                                                    style={{
                                                                        color:
                                                                            maroon,
                                                                    }}
                                                                />

                                                                {
                                                                    examinee.program
                                                                }

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <div className="space-y-1 text-sm">

                                                                <p className="flex items-center gap-2 font-medium text-gray-800">

                                                                    <CalendarDays
                                                                        size={15}
                                                                    />

                                                                    {formatDate(
                                                                        examinee.exam_date
                                                                    )}

                                                                </p>


                                                                <p className="flex items-center gap-2 text-gray-500">

                                                                    <Clock
                                                                        size={15}
                                                                    />

                                                                    {formatTime(
                                                                        examinee.exam_time
                                                                    )}

                                                                </p>


                                                                <p className="flex items-center gap-2 text-gray-500">

                                                                    <MapPin
                                                                        size={15}
                                                                    />

                                                                    {
                                                                        examinee.exam_venue
                                                                    }

                                                                </p>

                                                            </div>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <ResultBadge
                                                                result={
                                                                    examinee.exam_result
                                                                }
                                                            />


                                                            {examinee.notification_sent_at && (

                                                                <p className="mt-2 text-xs text-green-600">
                                                                    Email sent
                                                                </p>

                                                            )}

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <span className="text-sm text-gray-600">
                                                                {examinee.notification_sent_at
                                                                    ? 'Sent'
                                                                    : 'Not sent'}
                                                            </span>

                                                        </td>


                                                        <td className="px-5 py-5">

                                                            <ActionButtons
                                                                examinee={
                                                                    examinee
                                                                }
                                                                finished={
                                                                    examFinished(
                                                                        examinee
                                                                    )
                                                                }
                                                                onPass={() =>
                                                                    openPassModal(
                                                                        examinee
                                                                    )
                                                                }
                                                                onFail={() =>
                                                                    openFailModal(
                                                                        examinee
                                                                    )
                                                                }
                                                            />

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan={7}
                                                    className="px-6 py-16 text-center text-gray-500"
                                                >
                                                    No examinees found.
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        </div>


                        {/* MOBILE CARDS */}

                        <div className="space-y-4 lg:hidden">

                            {filteredExaminees.map(
                                (
                                    examinee
                                ) => (

                                    <div
                                        key={
                                            examinee.application_id
                                        }
                                        className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                                    >

                                        <div className="flex items-start justify-between gap-3">

                                            <div>

                                                <h3 className="font-bold text-gray-900">
                                                    {
                                                        examinee.full_name
                                                    }
                                                </h3>

                                                <p className="text-xs text-gray-500">
                                                    {
                                                        examinee.applicant_number
                                                    }
                                                </p>

                                            </div>


                                            <ResultBadge
                                                result={
                                                    examinee.exam_result
                                                }
                                            />

                                        </div>


                                        <div className="mt-4 space-y-3 border-t border-gray-100 pt-4 text-sm">

                                            <InfoLine
                                                icon={
                                                    BookOpen
                                                }
                                                value={
                                                    examinee.academic_year
                                                        ? `AY ${examinee.academic_year}`
                                                        : 'Academic year not assigned'
                                                }
                                            />


                                            <InfoLine
                                                icon={
                                                    GraduationCap
                                                }
                                                value={
                                                    examinee.program
                                                }
                                            />


                                            <InfoLine
                                                icon={
                                                    CalendarDays
                                                }
                                                value={
                                                    formatDate(
                                                        examinee.exam_date
                                                    )
                                                }
                                            />


                                            <InfoLine
                                                icon={
                                                    Clock
                                                }
                                                value={
                                                    formatTime(
                                                        examinee.exam_time
                                                    )
                                                }
                                            />


                                            <InfoLine
                                                icon={
                                                    MapPin
                                                }
                                                value={
                                                    examinee.exam_venue
                                                }
                                            />

                                        </div>


                                        <div className="mt-5">

                                            <ActionButtons
                                                examinee={
                                                    examinee
                                                }
                                                finished={
                                                    examFinished(
                                                        examinee
                                                    )
                                                }
                                                onPass={() =>
                                                    openPassModal(
                                                        examinee
                                                    )
                                                }
                                                onFail={() =>
                                                    openFailModal(
                                                        examinee
                                                    )
                                                }
                                            />

                                        </div>

                                    </div>

                                )
                            )}

                        </div>


                        <div className="mt-4 text-sm text-gray-500">

                            Showing{' '}

                            <strong>
                                {
                                    filteredExaminees.length
                                }
                            </strong>

                            {' '}of{' '}

                            <strong>
                                {
                                    examinees.length
                                }
                            </strong>

                            {' '}examinees

                        </div>

                    </div>

                </PortalLayout>

            </div>


            {/* PASSED MODAL */}

            {passTarget && (

                <Modal
                    title="Mark Examinee as Passed"
                    onClose={() =>
                        setPassTarget(
                            null
                        )
                    }
                >

                    <form
                        onSubmit={
                            submitPassed
                        }
                        className="space-y-5"
                    >

                        <ApplicantModalHeader
                            examinee={
                                passTarget
                            }
                        />


                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                            <FormField
                                label="Interview Date"
                                error={
                                    passForm.errors
                                        .interview_date
                                }
                            >

                                <input
                                    type="date"
                                    value={
                                        passForm.data
                                            .interview_date
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        passForm.setData(
                                            'interview_date',
                                            event.target.value
                                        )
                                    }
                                    className="form-input"
                                />

                            </FormField>


                            <FormField
                                label="Interview Time"
                                error={
                                    passForm.errors
                                        .interview_time
                                }
                            >

                                <input
                                    type="time"
                                    value={
                                        passForm.data
                                            .interview_time
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        passForm.setData(
                                            'interview_time',
                                            event.target.value
                                        )
                                    }
                                    className="form-input"
                                />

                            </FormField>

                        </div>


                        <FormField
                            label="Interview Venue"
                            error={
                                passForm.errors
                                    .venue
                            }
                        >

                            <input
                                value={
                                    passForm.data
                                        .venue
                                }
                                onChange={(
                                    event
                                ) =>
                                    passForm.setData(
                                        'venue',
                                        event.target.value
                                    )
                                }
                                placeholder="Example: School of Law Conference Room"
                                className="form-input"
                            />

                        </FormField>


                        <FormField
                            label="Interview Instructions"
                            error={
                                passForm.errors
                                    .instructions
                            }
                        >

                            <textarea
                                rows={3}
                                value={
                                    passForm.data
                                        .instructions
                                }
                                onChange={(
                                    event
                                ) =>
                                    passForm.setData(
                                        'instructions',
                                        event.target.value
                                    )
                                }
                                placeholder="Example: Please arrive 15 minutes early and bring a valid ID."
                                className="form-input"
                            />

                        </FormField>


                        <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">

                            <p className="font-semibold">
                                Email Notification
                            </p>

                            <p className="mt-1">
                                After confirmation,
                                the applicant will automatically
                                receive a Passed email containing
                                the interview date, time, venue,
                                and instructions.
                            </p>

                        </div>


                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setPassTarget(
                                        null
                                    )
                                }
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    passForm.processing
                                }
                                className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {passForm.processing
                                    ? 'Saving...'
                                    : 'Confirm Passed'}
                            </button>

                        </div>

                    </form>

                </Modal>

            )}


            {/* FAILED MODAL */}

            {failTarget && (

                <Modal
                    title="Mark Examinee as Failed"
                    onClose={() =>
                        setFailTarget(
                            null
                        )
                    }
                >

                    <form
                        onSubmit={
                            submitFailed
                        }
                        className="space-y-5"
                    >

                        <ApplicantModalHeader
                            examinee={
                                failTarget
                            }
                        />


                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">

                            <p className="font-semibold">
                                Email Notification
                            </p>

                            <p className="mt-1">
                                The applicant will automatically
                                receive an email informing them
                                that they did not pass the
                                admission examination.
                            </p>

                        </div>


                        <div className="flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setFailTarget(
                                        null
                                    )
                                }
                                className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={
                                    failForm.processing
                                }
                                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                            >
                                {failForm.processing
                                    ? 'Saving...'
                                    : 'Confirm Failed'}
                            </button>

                        </div>

                    </form>

                </Modal>

            )}


            <style>{`
                .form-input {
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid #d1d5db;
                    background-color: #ffffff;
                    color: #111827;
                    caret-color: #111827;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    outline: none;
                    color-scheme: light;
                }

                .form-input::placeholder {
                    color: #9ca3af;
                    opacity: 1;
                }

                .form-input:focus {
                    border-color: #922b2b;
                    box-shadow: 0 0 0 2px rgba(146, 43, 43, 0.1);
                }
            `}</style>

        </>
    );
}


/*
|--------------------------------------------------------------------------
| Summary Card
|--------------------------------------------------------------------------
*/

function SummaryCard({
    label,
    value,
    icon: Icon,
    maroon,
    type,
}) {
    let styles = {
        backgroundColor:
            '#f5e6e6',

        color:
            maroon ||
            '#922b2b',
    };


    if (
        type ===
        'success'
    ) {
        styles = {
            backgroundColor:
                '#dcfce7',

            color:
                '#15803d',
        };
    }


    if (
        type ===
        'danger'
    ) {
        styles = {
            backgroundColor:
                '#fee2e2',

            color:
                '#b91c1c',
        };
    }


    return (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={
                    styles
                }
            >
                <Icon size={21} />
            </div>


            <p className="mt-4 text-sm text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
                {value}
            </p>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Result Badge
|--------------------------------------------------------------------------
*/

function ResultBadge({
    result,
}) {
    if (
        result ===
        'Passed'
    ) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 ring-1 ring-green-200">

                <CheckCircle size={14} />

                Passed
            </span>
        );
    }


    if (
        result ===
        'Failed'
    ) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 ring-1 ring-red-200">

                <XCircle size={14} />

                Failed
            </span>
        );
    }


    return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-200">

            <Clock size={14} />

            Pending
        </span>
    );
}


/*
|--------------------------------------------------------------------------
| Action Buttons
|--------------------------------------------------------------------------
*/

function ActionButtons({
    finished,
    onPass,
    onFail,
}) {
    if (!finished) {

        return (
            <div className="text-center">

                <p className="text-xs font-medium text-gray-500">
                    Examination has not
                    finished yet.
                </p>

            </div>
        );
    }


    return (
        <div className="flex flex-wrap justify-center gap-2">

            <button
                type="button"
                onClick={
                    onPass
                }
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-green-600
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-green-700
                "
            >
                <CheckCircle size={15} />

                Passed
            </button>


            <button
                type="button"
                onClick={
                    onFail
                }
                className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-lg
                    bg-red-600
                    px-3
                    py-2
                    text-xs
                    font-semibold
                    text-white
                    hover:bg-red-700
                "
            >
                <XCircle size={15} />

                Failed
            </button>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Alert
|--------------------------------------------------------------------------
*/

function AlertBox({
    type,
    message,
}) {
    let className =
        'border-yellow-200 bg-yellow-50 text-yellow-800';

    let Icon =
        Clock;


    if (
        type ===
        'success'
    ) {
        className =
            'border-green-200 bg-green-50 text-green-800';

        Icon =
            CheckCircle;
    }


    if (
        type ===
        'error'
    ) {
        className =
            'border-red-200 bg-red-50 text-red-800';

        Icon =
            XCircle;
    }


    return (
        <div
            className={`
                mb-6
                flex
                items-start
                gap-3
                rounded-xl
                border
                p-4
                ${className}
            `}
        >
            <Icon
                size={20}
                className="mt-0.5 shrink-0"
            />

            <p className="text-sm">
                {message}
            </p>
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
        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
            {children}
        </th>
    );
}


/*
|--------------------------------------------------------------------------
| Information Line
|--------------------------------------------------------------------------
*/

function InfoLine({
    icon: Icon,
    value,
}) {
    return (
        <div className="flex items-center gap-3 text-gray-600">

            <Icon
                size={16}
                className="shrink-0 text-gray-400"
            />

            <span>
                {value}
            </span>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Modal
|--------------------------------------------------------------------------
*/

function Modal({
    title,
    children,
    onClose,
}) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                    <h2 className="text-xl font-bold text-gray-900">
                        {title}
                    </h2>


                    <button
                        type="button"
                        onClick={
                            onClose
                        }
                        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={21} />
                    </button>

                </div>


                <div className="p-6">
                    {children}
                </div>

            </div>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Applicant Modal Header
|--------------------------------------------------------------------------
*/

function ApplicantModalHeader({
    examinee,
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-4">

            <p className="font-bold text-gray-900">
                {
                    examinee.full_name
                }
            </p>

            <p className="mt-1 text-sm text-gray-500">
                {
                    examinee.applicant_number
                }
            </p>

            <p className="mt-1 text-sm text-gray-500">
                {
                    examinee.email
                }
            </p>

        </div>
    );
}


/*
|--------------------------------------------------------------------------
| Field
|--------------------------------------------------------------------------
*/

function FormField({
    label,
    error,
    children,
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-semibold text-gray-700">
                {label}
            </label>


            {children}


            {error && (

                <p className="mt-1.5 text-xs font-medium text-red-600">
                    {error}
                </p>

            )}

        </div>
    );
}
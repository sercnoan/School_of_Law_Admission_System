import PortalLayout from '@/layouts/portal-layout';
import {
    Head,
    Link,
    useForm,
    usePage,
} from '@inertiajs/react';

import { AlertCircle, CheckCircle, ArrowRight, Scale, BookOpen } from 'lucide-react';


export default function Program({
    hasProfile,
    application = null,
}) {
    const { flash } = usePage().props;


    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        program: application?.program || '',
    });

    /*
    |--------------------------------------------------------------------------
    | Submit Program
    |--------------------------------------------------------------------------
    */

    const isLocked = ['Approved', 'Completed'].includes(application?.application_status) || Boolean(application?.schedule_id);

    const submit = (e) => {
        e.preventDefault();
        if (isLocked) return;

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
                        {children}
                    </div>

                </PortalLayout>

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

                    {isLocked && (
                        <p role="status" className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
                            Your application is locked. Contact admissions if you need to change your program or documents.
                        </p>
                    )}
                    <form onSubmit={submit}>
                        <fieldset disabled={isLocked} className="min-w-0 border-0 p-0">

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
                                    isLocked || !data.program ||
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
                                    isLocked || !data.program ||
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

                    </fieldset>
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
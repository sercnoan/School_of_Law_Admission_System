import PortalLayout from '@/layouts/portal-layout';
import {
    Head,
    Link,
    useForm,
    usePage,
} from '@inertiajs/react';

import { AlertCircle, CheckCircle, ArrowRight, Scale, BookOpen, ExternalLink } from 'lucide-react';
import { useState } from 'react';


export default function Program({
    hasProfile,
    application = null,
}) {
    const { flash } = usePage().props;


    const maroon = '#922b2b';
    const [qualificationProgram, setQualificationProgram] = useState(null);

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

                            <div
                                className={`relative flex flex-col overflow-hidden rounded-xl border bg-white transition ${
                                    data.program === 'Juris Doctor [Thesis] (JD)'
                                        ? 'border-[#922b2b] bg-[#fffafa]'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                            <button
                                type="button"
                                onClick={() => {
                                    setData(
                                        'program',
                                        'Juris Doctor [Thesis] (JD)'
                                    );
                                }}
                                className="group block w-full flex-1 p-5 pb-4 text-left sm:p-6 sm:pb-4"
                            >

                                {/* ICON */}

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
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
                                    <Scale size={20} />
                                </div>


                                <h2 className="mt-4 text-lg font-bold text-gray-900">
                                    Juris Doctor [Thesis] (JD)
                                </h2>


                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    Professional legal education at the USeP School of Law.
                                </p>


                                <div className="mt-5 flex flex-wrap items-center gap-3">

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            rounded-lg
                                            px-3
                                            py-1.5
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                data.program ===
                                                'Juris Doctor [Thesis] (JD)'
                                                    ? 'text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                            }
                                        `}
                                        style={
                                            data.program ===
                                            'Juris Doctor [Thesis] (JD)'
                                                ? {
                                                      backgroundColor:
                                                          maroon,
                                                  }
                                                : {}
                                        }
                                    >
                                        {data.program ===
                                        'Juris Doctor [Thesis] (JD)'
                                            ? 'Selected'
                                            : 'Select Program'}
                                    </span>

                                </div>


                                {/* SELECTED INDICATOR */}

                                {data.program ===
                                    'Juris Doctor [Thesis] (JD)' && (

                                    <div
                                        className="
                                            absolute
                                            right-4
                                            top-4
                                            flex
                                            h-7
                                            w-7
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
                                            size={15}
                                        />
                                    </div>

                                )}

                            </button>

                            <div className="mx-5 mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-100 pt-4 sm:mx-6 sm:mb-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQualificationProgram(
                                            'Juris Doctor [Thesis] (JD)'
                                        )
                                    }
                                    className="text-sm font-semibold text-[#691f1f] transition hover:text-[#922b2b]"
                                >
                                    View Qualifications
                                </button>
                                <a
                                    href="https://usep.edu.ph/sol/academic-programs-2/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#691f1f] transition hover:text-[#922b2b]"
                                >
                                    <ExternalLink size={16} />
                                    View Prospectus
                                </a>
                            </div>
                            </div>


                            {/* =================================================
                                MASTER OF LEGAL STUDIES - JURIS DOCTOR
                            ================================================= */}

                            <div
                                className={`relative flex flex-col overflow-hidden rounded-xl border bg-white transition ${
                                    data.program === 'Master of Legal Studies-Juris Doctor (MLS-JD)'
                                        ? 'border-[#922b2b] bg-[#fffafa]'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                            <button
                                type="button"
                                onClick={() => {
                                    setData(
                                        'program',
                                        'Master of Legal Studies-Juris Doctor (MLS-JD)'
                                    );
                                }}
                                className="group block w-full flex-1 p-5 pb-4 text-left sm:p-6 sm:pb-4"
                            >

                                {/* ICON */}

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
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
                                        size={20}
                                    />
                                </div>


                                <h2 className="mt-4 text-lg font-bold text-gray-900">
                                    Master of Legal Studies-Juris Doctor (MLS-JD)
                                </h2>


                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    A ladderized path for advanced interdisciplinary legal study.
                                </p>


                                <div className="mt-5 flex flex-wrap items-center gap-3">

                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            rounded-lg
                                            px-3
                                            py-1.5
                                            text-sm
                                            font-semibold
                                            transition
                                            ${
                                                data.program ===
                                                'Master of Legal Studies-Juris Doctor (MLS-JD)'
                                                    ? 'text-white'
                                                    : 'bg-gray-100 text-gray-700'
                                            }
                                        `}
                                        style={
                                            data.program ===
                                            'Master of Legal Studies-Juris Doctor (MLS-JD)'
                                                ? {
                                                      backgroundColor:
                                                          maroon,
                                                  }
                                                : {}
                                        }
                                    >
                                        {data.program ===
                                        'Master of Legal Studies-Juris Doctor (MLS-JD)'
                                            ? 'Selected'
                                            : 'Select Program'}
                                    </span>

                                </div>


                                {/* SELECTED INDICATOR */}

                                {data.program ===
                                    'Master of Legal Studies-Juris Doctor (MLS-JD)' && (

                                    <div
                                        className="
                                            absolute
                                            right-4
                                            top-4
                                            flex
                                            h-7
                                            w-7
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
                                            size={15}
                                        />
                                    </div>

                                )}

                            </button>

                            <div className="mx-5 mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-100 pt-4 sm:mx-6 sm:mb-6">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setQualificationProgram(
                                            'Master of Legal Studies-Juris Doctor (MLS-JD)'
                                        )
                                    }
                                    className="text-sm font-semibold text-[#691f1f] transition hover:text-[#922b2b]"
                                >
                                    View Qualifications
                                </button>
                                <a
                                    href="https://usep.edu.ph/sol/academic-programs-2/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#691f1f] transition hover:text-[#922b2b]"
                                >
                                    <ExternalLink size={16} />
                                    View Prospectus
                                </a>
                            </div>
                            </div>

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

                    {qualificationProgram && (
                        <div className="privacy-notice-backdrop" role="presentation">
                            <section
                                className="privacy-notice program-qualifications-notice"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="program-qualifications-title"
                                aria-describedby="program-qualifications-description"
                            >
                                <div className="privacy-notice-icon" aria-hidden="true">
                                    <BookOpen size={26} />
                                </div>
                                <p className="privacy-notice-eyebrow">
                                    Admission Qualifications
                                </p>
                                <h2 id="program-qualifications-title">
                                    {qualificationProgram}
                                </h2>
                                <div
                                    id="program-qualifications-description"
                                    className="privacy-notice-body"
                                >
                                    <p>
                                        An applicant for admission to USeP-SoL&apos;s{' '}
                                        {qualificationProgram === 'Juris Doctor [Thesis] (JD)'
                                            ? 'Juris Doctor [Thesis] Program'
                                            : 'Ladderized Master of Legal Studies-Juris Doctor (MLS-JD) Program'}{' '}
                                        must have obtained, from a recognized and reputable college or university,
                                        a Bachelor&apos;s Degree in Arts or Sciences or a higher academic degree, and
                                        must have complied with the minimum requirements for law students set by
                                        the Legal Education Board.
                                    </p>

                                    {qualificationProgram ===
                                        'Master of Legal Studies-Juris Doctor (MLS-JD)' && (
                                        <p>
                                            <strong>
                                                The applicant must also have at least two (2) years of work experience.
                                            </strong>
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    className="privacy-notice-action"
                                    onClick={() => setQualificationProgram(null)}
                                >
                                    Close
                                </button>
                            </section>
                        </div>
                    )}


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

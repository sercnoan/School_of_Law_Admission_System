import PortalLayout from '@/layouts/portal-layout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowRight,
    BookOpen,
    CheckCircle,
    ExternalLink,
    Scale,
} from 'lucide-react';
import { useState } from 'react';

export default function Program({
    hasProfile,
    application = null,
    programs = [],
}) {
    const { flash } = usePage().props;
    const [qualificationProgram, setQualificationProgram] = useState(null);
    const isLocked =
        ['Approved', 'Completed'].includes(application?.application_status) ||
        Boolean(application?.schedule_id);
    const { data, setData, post, processing, errors } = useForm({
        program: application?.program || '',
    });

    const submit = (event) => {
        event.preventDefault();
        if (!isLocked) post('/applicant/program');
    };

    const ApplicantLayout = ({ children }) => (
        <div className="min-h-screen bg-gray-50">
            <PortalLayout audience="applicant">
                <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                    {children}
                </div>
            </PortalLayout>
        </div>
    );

    if (!hasProfile) {
        return (
            <>
                <Head title="Choose Program" />
                <ApplicantLayout>
                    <div className="mx-auto max-w-5xl">
                        <PageHeader />

                        <div className="overflow-hidden rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm sm:p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700">
                                    <AlertCircle size={24} />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-lg font-bold text-yellow-900">
                                        Personal Information Required
                                    </h2>
                                    <p className="mt-2 max-w-3xl text-sm leading-6 text-yellow-800">
                                        Complete your personal information
                                        before selecting an admission program
                                        and uploading requirements.
                                    </p>
                                    <Link
                                        href="/personal-details"
                                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#922b2b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#691f1f] sm:w-auto"
                                    >
                                        Complete Personal Information
                                        <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 overflow-hidden rounded-2xl border border-[#ead0d0] bg-[#f9eeee] p-5 shadow-sm sm:p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1d9d9] text-[#922b2b]">
                                    <CheckCircle size={21} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#691f1f]">
                                        Application Process
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        After completing your personal
                                        information, choose a program, upload
                                        the required documents, and continue
                                        your admission application.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </ApplicantLayout>
            </>
        );
    }

    return (
        <>
            <Head title="Choose Program" />
            <ApplicantLayout>
                <div className="mx-auto max-w-6xl">
                    <PageHeader />

                    {flash?.error && (
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 shadow-sm">
                            <AlertCircle
                                size={20}
                                className="mt-0.5 shrink-0"
                            />
                            <p className="text-sm">{flash.error}</p>
                        </div>
                    )}

                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-gray-900">
                            Available Programs
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Choose one program to continue your application.
                        </p>
                    </div>

                    {isLocked && (
                        <p
                            role="status"
                            className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"
                        >
                            Your application is locked. Contact admissions if
                            you need to change your program or documents.
                        </p>
                    )}

                    <form onSubmit={submit}>
                        <fieldset disabled={isLocked} className="border-0 p-0">
                            {programs.length ? (
                                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                    {programs.map((program, index) => (
                                        <ProgramCard
                                            key={program.id}
                                            program={program}
                                            selected={
                                                data.program === program.name
                                            }
                                            current={
                                                application?.program ===
                                                program.name
                                            }
                                            icon={
                                                index % 2 === 0
                                                    ? Scale
                                                    : BookOpen
                                            }
                                            onSelect={() =>
                                                setData('program', program.name)
                                            }
                                            onQualifications={() =>
                                                setQualificationProgram(program)
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-12 text-center">
                                    <AlertCircle
                                        size={30}
                                        className="mx-auto text-amber-500"
                                    />
                                    <h2 className="mt-4 font-bold text-amber-900">
                                        No programs are currently available
                                    </h2>
                                    <p className="mt-1 text-sm text-amber-700">
                                        Please contact the School of Law
                                        admissions office.
                                    </p>
                                </div>
                            )}

                            {errors.program && (
                                <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                    <AlertCircle size={18} />
                                    {errors.program}
                                </div>
                            )}

                            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
                                <Link
                                    href="/dashboard"
                                    className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Back to Dashboard
                                </Link>
                                <button
                                    type="submit"
                                    disabled={
                                        isLocked || !data.program || processing
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#922b2b] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#691f1f] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:opacity-60"
                                >
                                    {processing
                                        ? 'Saving...'
                                        : 'Continue to Requirements'}
                                    {!processing && <ArrowRight size={18} />}
                                </button>
                            </div>
                        </fieldset>
                    </form>

                    {qualificationProgram && (
                        <div
                            className="privacy-notice-backdrop"
                            role="presentation"
                        >
                            <section
                                className="privacy-notice program-qualifications-notice"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="program-qualifications-title"
                                aria-describedby="program-qualifications-description"
                            >
                                <div
                                    className="privacy-notice-icon"
                                    aria-hidden="true"
                                >
                                    <BookOpen size={26} />
                                </div>
                                <p className="privacy-notice-eyebrow">
                                    Admission Qualifications
                                </p>
                                <h2 id="program-qualifications-title">
                                    {qualificationProgram.name}
                                </h2>
                                <div
                                    id="program-qualifications-description"
                                    className="privacy-notice-body whitespace-pre-line"
                                >
                                    <p>
                                        {qualificationProgram.qualification ||
                                            'Please contact the School of Law admissions office for this program’s qualification requirements.'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    className="privacy-notice-action"
                                    onClick={() =>
                                        setQualificationProgram(null)
                                    }
                                >
                                    Close
                                </button>
                            </section>
                        </div>
                    )}

                    <div className="mt-10 border-t border-gray-200 pt-5">
                        <p className="text-center text-xs text-gray-400 sm:text-left">
                            USeP School of Law Admission Portal • Applicant
                        </p>
                    </div>
                </div>
            </ApplicantLayout>
        </>
    );
}

function PageHeader() {
    return (
        <div className="mb-8 sm:mb-10">
            <p className="mb-2 text-sm font-semibold text-[#922b2b]">
                ADMISSION PORTAL
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                Choose Your Program
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Select the School of Law program you want to apply for.
            </p>
        </div>
    );
}

function ProgramCard({
    program,
    selected,
    current,
    icon: Icon,
    onSelect,
    onQualifications,
}) {
    const unavailable = !program.is_active && !current;

    return (
        <article
            className={`relative flex flex-col overflow-hidden rounded-xl border bg-white transition ${
                selected
                    ? 'border-[#922b2b] bg-[#fffafa] shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
            } ${unavailable ? 'opacity-60' : ''}`}
        >
            <button
                type="button"
                onClick={onSelect}
                disabled={unavailable}
                className="group block w-full flex-1 p-5 pb-4 text-left disabled:cursor-not-allowed sm:p-6 sm:pb-4"
            >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e6e6] text-[#922b2b]">
                    <Icon size={20} />
                </div>
                <h2 className="mt-4 text-lg font-bold text-gray-900">
                    {program.name}
                </h2>
                {program.short_name && program.short_name !== program.name && (
                    <p className="mt-1 text-xs font-bold tracking-wide text-[#922b2b] uppercase">
                        {program.short_name}
                    </p>
                )}
                <p className="mt-2 text-sm leading-6 text-gray-500">
                    {program.description || 'School of Law admission program.'}
                </p>
                <span
                    className={`mt-5 inline-flex rounded-lg px-3 py-1.5 text-sm font-semibold ${
                        selected
                            ? 'bg-[#922b2b] text-white'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                >
                    {selected ? 'Selected' : 'Select Program'}
                </span>
                {selected && (
                    <span className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[#922b2b] text-white">
                        <CheckCircle size={15} />
                    </span>
                )}
            </button>

            <div className="mx-5 mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-gray-100 pt-4 sm:mx-6 sm:mb-6">
                <button
                    type="button"
                    onClick={onQualifications}
                    className="text-sm font-semibold text-[#691f1f] transition hover:text-[#922b2b]"
                >
                    View Qualifications
                </button>
                {program.prospectus_url && (
                    <a
                        href={program.prospectus_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#691f1f] transition hover:text-[#922b2b]"
                    >
                        <ExternalLink size={16} />
                        View Prospectus
                    </a>
                )}
            </div>
        </article>
    );
}

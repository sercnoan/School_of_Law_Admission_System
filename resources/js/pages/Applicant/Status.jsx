import { Head, Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import {
    AlertCircle,
    ArrowRight,
    CalendarDays,
    CheckCircle,
    ClipboardList,
    Clock,
    ExternalLink,
    FileText,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Menu,
    User,
    X,
    XCircle,
} from 'lucide-react';

export default function Status({
    application,
    applicantProfile = null,
    requirements = [],
    selectedSchedule = null,
    examinationResult = null,
    interviewSchedule = null,
    interviewResult = null,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

        const dateOnly = String(date).slice(0, 10);

        return new Date(
            `${dateOnly}T00:00:00`
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

        const [
            hours,
            minutes,
        ] = String(time)
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
    | Format File Size
    |--------------------------------------------------------------------------
    */

    const formatFileSize = (size) => {
        if (!size) {
            return 'Unknown size';
        }

        if (size < 1024) {
            return `${size} B`;
        }

        if (size < 1024 * 1024) {
            return `${(
                size / 1024
            ).toFixed(1)} KB`;
        }

        return `${(
            size /
            (1024 * 1024)
        ).toFixed(1)} MB`;
    };

    /*
    |--------------------------------------------------------------------------
    | Requirement Status
    |--------------------------------------------------------------------------
    */

    const getRequirementStatus = (
        requirement
    ) => {
        if (!requirement.submitted) {
            return {
                label: 'Not Submitted',
                className:
                    'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
                icon: Clock,
            };
        }

        if (
            requirement.submission
                ?.verification_status ===
            'Approved'
        ) {
            return {
                label: 'Approved',
                className:
                    'bg-green-50 text-green-700 ring-1 ring-green-200',
                icon: CheckCircle,
            };
        }

        if (
            requirement.submission
                ?.verification_status ===
            'Declined'
        ) {
            return {
                label: 'Declined',
                className:
                    'bg-red-50 text-red-700 ring-1 ring-red-200',
                icon: XCircle,
            };
        }

        return {
            label: 'Pending Review',
            className:
                'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
            icon: Clock,
        };
    };

    /*
    |--------------------------------------------------------------------------
    | Requirement Counts
    |--------------------------------------------------------------------------
    */

    const submittedCount =
        requirements.filter(
            (requirement) =>
                requirement.submitted
        ).length;

    const approvedCount =
        requirements.filter(
            (requirement) =>
                requirement.submission
                    ?.verification_status ===
                'Approved'
        ).length;

    const declinedCount =
        requirements.filter(
            (requirement) =>
                requirement.submission
                    ?.verification_status ===
                'Declined'
        ).length;

    const totalRequirements =
        requirements.length;

    const progressPercentage =
        totalRequirements > 0
            ? Math.round(
                  (approvedCount /
                      totalRequirements) *
                      100
              )
            : 0;

    const requirementsComplete =
        totalRequirements > 0 &&
        approvedCount ===
            totalRequirements;

    const hasDeclinedRequirement =
        declinedCount > 0;

    /*
    |--------------------------------------------------------------------------
    | Result Values
    |--------------------------------------------------------------------------
    */

    const examResult =
        examinationResult?.result ??
        'Pending';

    const interviewResultValue =
        interviewResult?.result ??
        'Pending';

    const applicationApproved =
        application.application_status ===
            'Approved' ||
        application.application_status ===
            'Completed';

    const applicationDeclined =
        application.application_status ===
        'Declined';

    const examPassed =
        examResult === 'Passed';

    const examFailed =
        examResult === 'Failed';

    const interviewPassed =
        interviewResultValue ===
        'Passed';

    const interviewFailed =
        interviewResultValue ===
        'Failed';

    /*
    |--------------------------------------------------------------------------
    | Examination / Interview Timing
    |--------------------------------------------------------------------------
    */

    const scheduleDateTimeHasPassed = (
        date,
        time
    ) => {
        if (!date || !time) {
            return false;
        }

        const normalizedTime =
            String(time).slice(
                0,
                8
            );

        const value = new Date(
            `${String(date).slice(
                0,
                10
            )}T${normalizedTime}+08:00`
        );

        if (
            Number.isNaN(
                value.getTime()
            )
        ) {
            return false;
        }

        return (
            value.getTime() <=
            Date.now()
        );
    };

    const examSchedulePassed =
        selectedSchedule
            ? scheduleDateTimeHasPassed(
                  selectedSchedule.exam_date,
                  selectedSchedule.exam_time
              )
            : false;

    const interviewSchedulePassed =
        interviewSchedule
            ? scheduleDateTimeHasPassed(
                  interviewSchedule.interview_date,
                  interviewSchedule.interview_time
              )
            : false;

    /*
    |--------------------------------------------------------------------------
    | Application Status Card
    |--------------------------------------------------------------------------
    */

    const applicationStatus =
        useMemo(() => {
            switch (
                application.application_status
            ) {
                case 'Approved':
                    return {
                        label: 'Approved',
                        description:
                            'Your application has been approved by the School of Law.',
                        className:
                            'bg-green-50 text-green-700 ring-1 ring-green-200',
                        icon: CheckCircle,
                    };

                case 'Declined':
                    return {
                        label: 'Declined',
                        description:
                            'Your application did not proceed. Review the information provided below.',
                        className:
                            'bg-red-50 text-red-700 ring-1 ring-red-200',
                        icon: XCircle,
                    };

                case 'Under Review':
                    return {
                        label:
                            'Under Review',
                        description:
                            'Your application is currently being reviewed by the School of Law.',
                        className:
                            'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
                        icon: Clock,
                    };

                case 'Completed':
                    return {
                        label: 'Completed',
                        description:
                            'Your application has completed its initial review stage.',
                        className:
                            'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
                        icon: CheckCircle,
                    };

                default:
                    return {
                        label: 'Pending',
                        description:
                            'Your application is waiting for review.',
                        className:
                            'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
                        icon: Clock,
                    };
            }
        }, [
            application.application_status,
        ]);

    const StatusIcon =
        applicationStatus.icon;

    /*
    |--------------------------------------------------------------------------
    | Admission Progress
    |--------------------------------------------------------------------------
    */

    const stages =
        useMemo(() => {
            const terminalFailure =
                applicationDeclined ||
                examFailed ||
                interviewFailed;

            return [
                {
                    label: 'Application',
                    state:
                        applicationDeclined
                            ? 'failed'
                            : applicationApproved
                              ? 'complete'
                              : 'active',
                },
                {
                    label: 'Requirements',
                    state:
                        hasDeclinedRequirement
                            ? 'failed'
                            : requirementsComplete
                              ? 'complete'
                              : applicationDeclined
                                ? 'pending'
                                : 'active',
                },
                {
                    label: 'Examination',
                    state:
                        examFailed
                            ? 'failed'
                            : examPassed
                              ? 'complete'
                              : applicationApproved &&
                                  requirementsComplete
                                ? 'active'
                                : 'pending',
                },
                {
                    label: 'Interview',
                    state:
                        interviewFailed
                            ? 'failed'
                            : interviewPassed
                              ? 'complete'
                              : examPassed
                                ? 'active'
                                : 'pending',
                },
                {
                    label: 'Final Result',
                    state:
                        interviewPassed
                            ? 'complete'
                            : terminalFailure
                              ? 'failed'
                              : 'pending',
                },
            ];
        }, [
            applicationDeclined,
            applicationApproved,
            hasDeclinedRequirement,
            requirementsComplete,
            examFailed,
            examPassed,
            interviewFailed,
            interviewPassed,
        ]);

    /*
    |--------------------------------------------------------------------------
    | Current Step / Next Action
    |--------------------------------------------------------------------------
    */

    const currentStep =
        useMemo(() => {
            if (
                applicationDeclined
            ) {
                return {
                    tone: 'danger',
                    eyebrow:
                        'APPLICATION RESULT',
                    title:
                        'Application Declined',
                    description:
                        'Your application did not proceed to the next stage. Please review any applicant-facing remarks or contact the School of Law if you need clarification.',
                };
            }

            if (
                hasDeclinedRequirement
            ) {
                return {
                    tone: 'danger',
                    eyebrow:
                        'ACTION REQUIRED',
                    title:
                        'Update Declined Requirements',
                    description:
                        'One or more submitted requirements were declined. Replace the affected document before your application can continue.',
                    href:
                        '/applicant/requirements',
                    actionLabel:
                        'Review Requirements',
                };
            }

            if (
                !applicationApproved
            ) {
                return {
                    tone: 'warning',
                    eyebrow:
                        'CURRENT STEP',
                    title:
                        application.application_status ===
                        'Under Review'
                            ? 'Application Under Review'
                            : 'Waiting for Application Review',
                    description:
                        'The School of Law is reviewing your application and submitted requirements. No action is required from you unless a requirement is returned.',
                };
            }

            if (
                !requirementsComplete
            ) {
                return {
                    tone: 'warning',
                    eyebrow:
                        'CURRENT STEP',
                    title:
                        'Requirements Review',
                    description:
                        'Your application is approved, but some required documents are still awaiting approval. Monitor the Requirements section for updates.',
                    href:
                        '/applicant/requirements',
                    actionLabel:
                        'View Requirements',
                };
            }

            if (
                !selectedSchedule
            ) {
                return {
                    tone: 'primary',
                    eyebrow:
                        'NEXT STEP',
                    title:
                        'Select an Examination Schedule',
                    description:
                        'Your application and required documents are ready. Choose an available examination schedule to continue your admission process.',
                    href:
                        '/applicant/examination',
                    actionLabel:
                        'Select Examination Schedule',
                };
            }

            if (
                examFailed
            ) {
                return {
                    tone: 'danger',
                    eyebrow:
                        'EXAMINATION RESULT',
                    title:
                        'Examination Not Passed',
                    description:
                        'Unfortunately, you did not pass the admission examination. Your application will not proceed to the interview stage.',
                };
            }

            if (
                !examPassed
            ) {
                if (
                    examSchedulePassed
                ) {
                    return {
                        tone: 'warning',
                        eyebrow:
                            'CURRENT STEP',
                        title:
                            'Waiting for Examination Result',
                        description:
                            'Your scheduled examination time has passed. Please wait for the School of Law to record your official examination result.',
                    };
                }

                return {
                    tone: 'primary',
                    eyebrow:
                        'CURRENT STEP',
                    title:
                        'Prepare for Your Examination',
                    description:
                        'Your examination schedule is confirmed. Please arrive on time and follow the instructions provided by the School of Law.',
                    details: [
                        {
                            label: 'Date',
                            value:
                                formatDate(
                                    selectedSchedule.exam_date
                                ),
                        },
                        {
                            label: 'Time',
                            value:
                                formatTime(
                                    selectedSchedule.exam_time
                                ),
                        },
                        {
                            label: 'Venue',
                            value:
                                selectedSchedule.venue,
                        },
                    ],
                };
            }

            if (
                !interviewSchedule
            ) {
                return {
                    tone: 'warning',
                    eyebrow:
                        'CURRENT STEP',
                    title:
                        'Waiting for Interview Schedule',
                    description:
                        'You passed the admission examination. The School of Law is preparing your interview schedule.',
                };
            }

            if (
                interviewFailed
            ) {
                return {
                    tone: 'danger',
                    eyebrow:
                        'INTERVIEW RESULT',
                    title:
                        'Interview Not Passed',
                    description:
                        'Unfortunately, you did not pass the admission interview. Please check your registered email for the official notification.',
                };
            }

            if (
                interviewPassed
            ) {
                return {
                    tone: 'success',
                    eyebrow:
                        'ADMISSION PROCESS COMPLETED',
                    title:
                        'Qualified Applicant',
                    description:
                        'Congratulations! You successfully completed the admission evaluation process and have been included in the Final List of qualified applicants.',
                };
            }

            if (
                interviewSchedulePassed
            ) {
                return {
                    tone: 'warning',
                    eyebrow:
                        'CURRENT STEP',
                    title:
                        'Waiting for Interview Result',
                    description:
                        'Your scheduled interview time has passed. Please wait for the School of Law to finalize your interview result.',
                };
            }

            return {
                tone: 'primary',
                eyebrow:
                    'CURRENT STEP',
                title:
                    'Prepare for Your Admission Interview',
                description:
                    'You passed the examination and your interview has been scheduled. Please attend on the date and time shown below.',
                details: [
                    {
                        label: 'Date',
                        value:
                            formatDate(
                                interviewSchedule.interview_date
                            ),
                    },
                    {
                        label: 'Time',
                        value:
                            formatTime(
                                interviewSchedule.interview_time
                            ),
                    },
                    {
                        label: 'Venue',
                        value:
                            interviewSchedule.venue,
                    },
                ],
            };
        }, [
            applicationDeclined,
            hasDeclinedRequirement,
            applicationApproved,
            application.application_status,
            requirementsComplete,
            selectedSchedule,
            examFailed,
            examPassed,
            examSchedulePassed,
            interviewSchedule,
            interviewFailed,
            interviewPassed,
            interviewSchedulePassed,
        ]);

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
            label:
                'Application Status',
            href: '/applicant/status',
            icon: ClipboardList,
        },
        {
            label:
                'Personal Information',
            href: '/personal-details',
            icon: User,
        },
    ];

    return (
        <>
            <Head title="Application Status" />

            <div className="min-h-screen bg-gray-50">
                {/* =====================================================
                    MOBILE HEADER
                ===================================================== */}

                <header
                    className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 text-white shadow-md lg:hidden"
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
                            className="rounded-lg p-2 transition hover:bg-white/10"
                            aria-label="Open navigation"
                        >
                            <Menu
                                size={
                                    23
                                }
                            />
                        </button>

                        <div className="flex items-center gap-2">
                            <img
                                src="/images/law-logo.jpeg"
                                alt="USeP School of Law"
                                className="h-9 w-9 rounded-full bg-white object-contain"
                            />

                            <div>
                                <p className="text-sm font-bold leading-tight">
                                    USeP
                                    School of
                                    Law
                                </p>

                                <p className="text-[11px] text-white/75">
                                    Admission
                                    Portal
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
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
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
                    <div className="border-b border-white/10 px-5 py-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white p-1">
                                <img
                                    src="/images/law-logo.jpeg"
                                    alt="USeP School of Law"
                                    className="h-full w-full rounded-full object-contain"
                                />
                            </div>

                            <div className="min-w-0">
                                <h1 className="truncate text-base font-bold">
                                    USeP
                                    School of
                                    Law
                                </h1>

                                <p className="mt-0.5 text-xs text-white/65">
                                    Admission
                                    Portal
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setSidebarOpen(
                                        false
                                    )
                                }
                                className="ml-auto rounded-lg p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
                                aria-label="Close navigation"
                            >
                                <X
                                    size={
                                        20
                                    }
                                />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1 px-3 py-5">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            Main Menu
                        </p>

                        {navigation.map(
                            (
                                item
                            ) => {
                                const Icon =
                                    item.icon;

                                const active =
                                    item.label ===
                                    'Application Status';

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
                                            size={
                                                20
                                            }
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

                    <div className="border-t border-white/10 p-3">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                            <LogOut
                                size={
                                    19
                                }
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
                    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        <div className="mx-auto max-w-6xl">
                            {/* PAGE HEADER */}

                            <div className="mb-8 sm:mb-10">
                                <p
                                    className="mb-2 text-sm font-semibold"
                                    style={{
                                        color:
                                            maroon,
                                    }}
                                >
                                    ADMISSION
                                    PORTAL
                                </p>

                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
                                    Application
                                    Status
                                </h1>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                                    Track
                                    your
                                    admission
                                    progress
                                    from
                                    application
                                    review
                                    through
                                    examination,
                                    interview,
                                    and final
                                    qualification.
                                </p>
                            </div>

                            {/* =================================================
                                APPLICATION SUMMARY
                            ================================================= */}

                            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                <div className="flex flex-col gap-5 p-5 sm:p-6 md:flex-row md:items-center md:justify-between">
                                    <div className="flex min-w-0 items-start gap-4">
                                        <div
                                            className={`
                                                flex
                                                h-12
                                                w-12
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                ${applicationStatus.className}
                                            `}
                                        >
                                            <StatusIcon
                                                size={
                                                    24
                                                }
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Application
                                                Status
                                            </p>

                                            <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                                                {
                                                    applicationStatus.label
                                                }
                                            </h2>

                                            <p className="mt-1 max-w-xl text-sm leading-6 text-gray-500">
                                                {
                                                    applicationStatus.description
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0 md:text-right">
                                        <p className="text-sm text-gray-500">
                                            Applicant
                                            Number
                                        </p>

                                        <p
                                            className="mt-1 text-xl font-bold"
                                            style={{
                                                color:
                                                    maroon,
                                            }}
                                        >
                                            {applicantProfile?.applicant_number ??
                                                `#${application.application_id}`}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* =================================================
                                ADMISSION PROGRESS
                            ================================================= */}

                            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                                <div className="mb-5">
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Admission
                                        Progress
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Your
                                        progress
                                        updates
                                        automatically
                                        as each
                                        admission
                                        stage is
                                        completed.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                                    {stages.map(
                                        (
                                            stage,
                                            index
                                        ) => (
                                            <ProgressStage
                                                key={
                                                    stage.label
                                                }
                                                number={
                                                    index +
                                                    1
                                                }
                                                label={
                                                    stage.label
                                                }
                                                state={
                                                    stage.state
                                                }
                                                maroon={
                                                    maroon
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* =================================================
                                CURRENT STEP
                            ================================================= */}

                            <CurrentStepCard
                                step={
                                    currentStep
                                }
                                maroon={
                                    maroon
                                }
                            />

                            {/* =================================================
                                APPLICATION INFORMATION
                            ================================================= */}

                            <div className="mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                <SectionHeader
                                    icon={
                                        GraduationCap
                                    }
                                    title="Application Information"
                                    description="Your School of Law admission details"
                                    maroon={
                                        maroon
                                    }
                                />

                                <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                                    <InfoItem
                                        label="Applicant Name"
                                        value={
                                            applicantProfile?.full_name
                                        }
                                    />

                                    <InfoItem
                                        label="Applicant Number"
                                        value={
                                            applicantProfile?.applicant_number
                                        }
                                    />

                                    <InfoItem
                                        label="Program"
                                        value={
                                            application.program
                                        }
                                    />

                                    <InfoItem
                                        label="Academic Year"
                                        value={
                                            application.academic_year
                                        }
                                    />

                                    <InfoItem
                                        label="Email"
                                        value={
                                            applicantProfile?.email
                                        }
                                    />

                                    <InfoItem
                                        label="Date Submitted"
                                        value={formatDate(
                                            application.submitted_at
                                        )}
                                    />
                                </div>
                            </div>

                            {/* =================================================
                                EXAMINATION & INTERVIEW
                            ================================================= */}

                            <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                                <ExaminationCard
                                    applicationApproved={
                                        applicationApproved
                                    }
                                    requirementsComplete={
                                        requirementsComplete
                                    }
                                    selectedSchedule={
                                        selectedSchedule
                                    }
                                    examinationResult={
                                        examinationResult
                                    }
                                    formatDate={
                                        formatDate
                                    }
                                    formatTime={
                                        formatTime
                                    }
                                    examSchedulePassed={
                                        examSchedulePassed
                                    }
                                    maroon={
                                        maroon
                                    }
                                />

                                <InterviewCard
                                    examPassed={
                                        examPassed
                                    }
                                    examFailed={
                                        examFailed
                                    }
                                    interviewSchedule={
                                        interviewSchedule
                                    }
                                    interviewResult={
                                        interviewResult
                                    }
                                    interviewSchedulePassed={
                                        interviewSchedulePassed
                                    }
                                    formatDate={
                                        formatDate
                                    }
                                    formatTime={
                                        formatTime
                                    }
                                    maroon={
                                        maroon
                                    }
                                />
                            </div>

                            {/* =================================================
                                FINAL RESULT
                            ================================================= */}

                            <FinalResultCard
                                applicationDeclined={
                                    applicationDeclined
                                }
                                examFailed={
                                    examFailed
                                }
                                interviewFailed={
                                    interviewFailed
                                }
                                interviewPassed={
                                    interviewPassed
                                }
                            />

                            {/* =================================================
                                REQUIREMENT PROGRESS
                            ================================================= */}

                            <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="font-bold text-gray-900">
                                            Requirement
                                            Progress
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {
                                                approvedCount
                                            }{' '}
                                            of{' '}
                                            {
                                                totalRequirements
                                            }{' '}
                                            requirements
                                            approved
                                        </p>
                                    </div>

                                    <span
                                        className="shrink-0 text-2xl font-bold"
                                        style={{
                                            color:
                                                maroon,
                                        }}
                                    >
                                        {
                                            progressPercentage
                                        }
                                        %
                                    </span>
                                </div>

                                <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-200">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${progressPercentage}%`,
                                            backgroundColor:
                                                maroon,
                                        }}
                                    />
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                    <ProgressItem
                                        value={
                                            submittedCount
                                        }
                                        label="Submitted"
                                        className="bg-gray-50 text-gray-800"
                                    />

                                    <ProgressItem
                                        value={
                                            approvedCount
                                        }
                                        label="Approved"
                                        className="bg-green-50 text-green-700"
                                    />

                                    <ProgressItem
                                        value={
                                            declinedCount
                                        }
                                        label="Declined"
                                        className="bg-red-50 text-red-700"
                                    />

                                    <ProgressItem
                                        value={
                                            totalRequirements
                                        }
                                        label="Total"
                                        className="bg-gray-50 text-gray-800"
                                    />
                                </div>
                            </div>

                            {/* =================================================
                                APPLICATION REMARKS
                            ================================================= */}

                            {application.remarks && (
                                <div className="mb-6 rounded-2xl border border-orange-200 bg-orange-50 p-5 shadow-sm sm:p-6">
                                    <h2 className="font-bold text-orange-900">
                                        Application
                                        Remarks
                                    </h2>

                                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-orange-800">
                                        {
                                            application.remarks
                                        }
                                    </p>
                                </div>
                            )}

                            {/* =================================================
                                REQUIREMENTS
                            ================================================= */}

                            <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                                <SectionHeader
                                    icon={
                                        ClipboardList
                                    }
                                    title="Requirements"
                                    description="Review the status of each submitted document."
                                    maroon={
                                        maroon
                                    }
                                />

                                <div className="divide-y divide-gray-100">
                                    {requirements.length >
                                    0 ? (
                                        requirements.map(
                                            (
                                                requirement
                                            ) => {
                                                const status =
                                                    getRequirementStatus(
                                                        requirement
                                                    );

                                                const RequirementStatusIcon =
                                                    status.icon;

                                                const submission =
                                                    requirement.submission;

                                                return (
                                                    <div
                                                        key={
                                                            requirement.requirement_id
                                                        }
                                                        className="p-5 sm:p-6"
                                                    >
                                                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                                            <div className="flex min-w-0 items-start gap-4">
                                                                <RequirementStatusIcon
                                                                    size={
                                                                        22
                                                                    }
                                                                    className={`
                                                                        mt-0.5
                                                                        shrink-0

                                                                        ${
                                                                            status.label ===
                                                                            'Approved'
                                                                                ? 'text-green-600'
                                                                                : status.label ===
                                                                                    'Declined'
                                                                                  ? 'text-red-600'
                                                                                  : status.label ===
                                                                                      'Pending Review'
                                                                                    ? 'text-yellow-500'
                                                                                    : 'text-gray-400'
                                                                        }
                                                                    `}
                                                                />

                                                                <div className="min-w-0">
                                                                    <h3 className="font-semibold text-gray-900">
                                                                        {
                                                                            requirement.requirement_name
                                                                        }
                                                                    </h3>

                                                                    {requirement.description && (
                                                                        <p className="mt-1 text-sm leading-6 text-gray-500">
                                                                            {
                                                                                requirement.description
                                                                            }
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <span
                                                                className={`
                                                                    w-fit
                                                                    shrink-0
                                                                    rounded-full
                                                                    px-3
                                                                    py-1.5
                                                                    text-xs
                                                                    font-semibold
                                                                    ${status.className}
                                                                `}
                                                            >
                                                                {
                                                                    status.label
                                                                }
                                                            </span>
                                                        </div>

                                                        {submission && (
                                                            <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/70 p-4">
                                                                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                                                    <div className="min-w-0">
                                                                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                                            Submitted
                                                                            File
                                                                        </p>

                                                                        <p className="mt-1 break-all font-medium text-gray-900">
                                                                            {
                                                                                submission.file_name
                                                                            }
                                                                        </p>

                                                                        <p className="mt-1 text-xs text-gray-500">
                                                                            {formatFileSize(
                                                                                submission.file_size
                                                                            )}

                                                                            {
                                                                                ' • Uploaded '
                                                                            }

                                                                            {formatDate(
                                                                                submission.uploaded_at
                                                                            )}
                                                                        </p>
                                                                    </div>

                                                                    <a
                                                                        href={`/storage/${submission.file_path}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition hover:bg-[#f9eeee] sm:w-fit"
                                                                        style={{
                                                                            borderColor:
                                                                                '#d9aaaa',
                                                                            color:
                                                                                maroon,
                                                                        }}
                                                                    >
                                                                        <ExternalLink
                                                                            size={
                                                                                16
                                                                            }
                                                                        />

                                                                        View
                                                                        Document
                                                                    </a>
                                                                </div>

                                                                {submission.verification_status ===
                                                                    'Declined' &&
                                                                    submission.remarks && (
                                                                        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                                                                            <p className="text-sm font-semibold text-red-800">
                                                                                Reason
                                                                                for
                                                                                Declining
                                                                            </p>

                                                                            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-red-700">
                                                                                {
                                                                                    submission.remarks
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                            </div>
                                                        )}

                                                        {submission?.verification_status ===
                                                            'Declined' && (
                                                            <div className="mt-4">
                                                                <Link
                                                                    href="/applicant/requirements"
                                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-fit"
                                                                    style={{
                                                                        backgroundColor:
                                                                            maroon,
                                                                    }}
                                                                >
                                                                    Replace
                                                                    Document

                                                                    <ArrowRight
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Link>
                                                            </div>
                                                        )}

                                                        {!submission && (
                                                            <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                                                                <p className="text-sm leading-6 text-gray-500">
                                                                    This
                                                                    requirement
                                                                    has
                                                                    not
                                                                    been
                                                                    submitted
                                                                    yet.
                                                                </p>

                                                                <Link
                                                                    href="/applicant/requirements"
                                                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-75"
                                                                    style={{
                                                                        color:
                                                                            maroon,
                                                                    }}
                                                                >
                                                                    Upload
                                                                    Requirement

                                                                    <ArrowRight
                                                                        size={
                                                                            16
                                                                        }
                                                                    />
                                                                </Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            }
                                        )
                                    ) : (
                                        <div className="p-8 text-center text-sm text-gray-500">
                                            No
                                            requirements
                                            are
                                            currently
                                            available.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* FOOTER */}

                            <div className="mt-10 border-t border-gray-200 pt-5">
                                <p className="text-center text-xs text-gray-400 sm:text-left">
                                    USeP
                                    School of
                                    Law
                                    Admission
                                    Portal •
                                    Applicant
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
| Progress Stage
|--------------------------------------------------------------------------
*/

function ProgressStage({
    number,
    label,
    state,
    maroon,
}) {
    let wrapperClass =
        'border-gray-200 bg-gray-50';

    let iconClass =
        'bg-gray-200 text-gray-500';

    let statusText =
        'Pending';

    let StatusIcon =
        Clock;

    if (
        state ===
        'complete'
    ) {
        wrapperClass =
            'border-green-200 bg-green-50';

        iconClass =
            'bg-green-100 text-green-700';

        statusText =
            'Completed';

        StatusIcon =
            CheckCircle;
    }

    if (
        state ===
        'active'
    ) {
        wrapperClass =
            'border-[#ead0d0] bg-[#f9eeee]';

        iconClass =
            'bg-[#f1d9d9]';

        statusText =
            'Current';
    }

    if (
        state ===
        'failed'
    ) {
        wrapperClass =
            'border-red-200 bg-red-50';

        iconClass =
            'bg-red-100 text-red-700';

        statusText =
            'Stopped';

        StatusIcon =
            XCircle;
    }

    return (
        <div
            className={`rounded-xl border p-4 ${wrapperClass}`}
        >
            <div className="flex items-center gap-3 md:block">
                <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconClass}`}
                    style={
                        state ===
                        'active'
                            ? {
                                  color:
                                      maroon,
                              }
                            : {}
                    }
                >
                    {state ===
                    'active' ? (
                        <span className="text-sm font-bold">
                            {
                                number
                            }
                        </span>
                    ) : (
                        <StatusIcon
                            size={
                                18
                            }
                        />
                    )}
                </div>

                <div className="min-w-0 md:mt-3">
                    <p className="font-semibold text-gray-900">
                        {
                            label
                        }
                    </p>

                    <p
                        className={`mt-0.5 text-xs font-medium ${
                            state ===
                            'complete'
                                ? 'text-green-700'
                                : state ===
                                    'failed'
                                  ? 'text-red-700'
                                  : state ===
                                      'active'
                                    ? 'text-[#922b2b]'
                                    : 'text-gray-400'
                        }`}
                    >
                        {
                            statusText
                        }
                    </p>
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Current Step Card
|--------------------------------------------------------------------------
*/

function CurrentStepCard({
    step,
    maroon,
}) {
    const toneStyles = {
        primary: {
            wrapper:
                'border-[#ead0d0] bg-[#f9eeee]',
            icon:
                'bg-[#f1d9d9]',
            text:
                '#691f1f',
            Icon:
                ArrowRight,
        },
        warning: {
            wrapper:
                'border-yellow-200 bg-yellow-50',
            icon:
                'bg-yellow-100 text-yellow-700',
            text:
                '#854d0e',
            Icon:
                Clock,
        },
        success: {
            wrapper:
                'border-green-200 bg-green-50',
            icon:
                'bg-green-100 text-green-700',
            text:
                '#166534',
            Icon:
                CheckCircle,
        },
        danger: {
            wrapper:
                'border-red-200 bg-red-50',
            icon:
                'bg-red-100 text-red-700',
            text:
                '#991b1b',
            Icon:
                XCircle,
        },
    };

    const style =
        toneStyles[
            step.tone
        ] ??
        toneStyles.primary;

    const Icon =
        style.Icon;

    return (
        <div
            className={`mb-6 rounded-2xl border p-5 shadow-sm sm:p-6 ${style.wrapper}`}
        >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                    style={
                        step.tone ===
                        'primary'
                            ? {
                                  color:
                                      maroon,
                              }
                            : {}
                    }
                >
                    <Icon
                        size={
                            23
                        }
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <p
                        className="text-xs font-bold uppercase tracking-widest"
                        style={{
                            color:
                                style.text,
                        }}
                    >
                        {
                            step.eyebrow
                        }
                    </p>

                    <h2
                        className="mt-1 text-xl font-bold sm:text-2xl"
                        style={{
                            color:
                                style.text,
                        }}
                    >
                        {
                            step.title
                        }
                    </h2>

                    <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600">
                        {
                            step.description
                        }
                    </p>

                    {step.details &&
                        step.details.length >
                            0 && (
                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {step.details.map(
                                    (
                                        detail
                                    ) => (
                                        <div
                                            key={
                                                detail.label
                                            }
                                            className="rounded-xl border border-white/70 bg-white/80 p-3"
                                        >
                                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                {
                                                    detail.label
                                                }
                                            </p>

                                            <p className="mt-1 font-semibold text-gray-900">
                                                {
                                                    detail.value ??
                                                    'Not available'
                                                }
                                            </p>
                                        </div>
                                    )
                                )}
                            </div>
                        )}

                    {step.href &&
                        step.actionLabel && (
                            <Link
                                href={
                                    step.href
                                }
                                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 sm:w-auto"
                                style={{
                                    backgroundColor:
                                        maroon,
                                }}
                            >
                                {
                                    step.actionLabel
                                }

                                <ArrowRight
                                    size={
                                        17
                                    }
                                />
                            </Link>
                        )}
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Examination Card
|--------------------------------------------------------------------------
*/

function ExaminationCard({
    applicationApproved,
    requirementsComplete,
    selectedSchedule,
    examinationResult,
    formatDate,
    formatTime,
    examSchedulePassed,
    maroon,
}) {
    const result =
        examinationResult?.result ??
        'Pending';

    let statusLabel =
        'Locked';

    let statusClass =
        'bg-gray-100 text-gray-600';

    let description =
        'Complete the earlier admission stages before proceeding to the examination.';

    if (
        applicationApproved &&
        requirementsComplete &&
        !selectedSchedule
    ) {
        statusLabel =
            'Schedule Required';

        statusClass =
            'bg-yellow-100 text-yellow-700';

        description =
            'You are eligible to select an examination schedule.';
    }

    if (
        selectedSchedule
    ) {
        statusLabel =
            examSchedulePassed
                ? 'Result Pending'
                : 'Scheduled';

        statusClass =
            'bg-blue-100 text-blue-700';

        description =
            examSchedulePassed
                ? 'Your scheduled examination time has passed. Please wait for the official result.'
                : 'Your examination schedule has been confirmed.';
    }

    if (
        result ===
        'Passed'
    ) {
        statusLabel =
            'Passed';

        statusClass =
            'bg-green-100 text-green-700';

        description =
            'You passed the admission examination and qualified for the interview stage.';
    }

    if (
        result ===
        'Failed'
    ) {
        statusLabel =
            'Failed';

        statusClass =
            'bg-red-100 text-red-700';

        description =
            'You did not pass the admission examination.';
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader
                icon={
                    CalendarDays
                }
                title="Examination"
                description="Your examination schedule and official result"
                maroon={
                    maroon
                }
            />

            <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Examination
                            Status
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            {
                                description
                            }
                        </p>
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass}`}
                    >
                        {
                            statusLabel
                        }
                    </span>
                </div>

                {selectedSchedule && (
                    <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4">
                        <ScheduleLine
                            icon={
                                CalendarDays
                            }
                            label="Date"
                            value={formatDate(
                                selectedSchedule.exam_date
                            )}
                            maroon={
                                maroon
                            }
                        />

                        <ScheduleLine
                            icon={
                                Clock
                            }
                            label="Time"
                            value={formatTime(
                                selectedSchedule.exam_time
                            )}
                            maroon={
                                maroon
                            }
                        />

                        <ScheduleLine
                            icon={
                                MapPin
                            }
                            label="Venue"
                            value={
                                selectedSchedule.venue
                            }
                            maroon={
                                maroon
                            }
                        />
                    </div>
                )}

                {applicationApproved &&
                    requirementsComplete &&
                    !selectedSchedule && (
                        <Link
                            href="/applicant/examination"
                            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto"
                            style={{
                                backgroundColor:
                                    maroon,
                            }}
                        >
                            Select
                            Examination
                            Schedule

                            <ArrowRight
                                size={
                                    16
                                }
                            />
                        </Link>
                    )}
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Interview Card
|--------------------------------------------------------------------------
*/

function InterviewCard({
    examPassed,
    examFailed,
    interviewSchedule,
    interviewResult,
    interviewSchedulePassed,
    formatDate,
    formatTime,
    maroon,
}) {
    const result =
        interviewResult?.result ??
        'Pending';

    let statusLabel =
        'Locked';

    let statusClass =
        'bg-gray-100 text-gray-600';

    let description =
        'You must pass the admission examination before proceeding to the interview.';

    if (
        examFailed
    ) {
        description =
            'The interview stage is unavailable because the admission examination was not passed.';
    }

    if (
        examPassed &&
        !interviewSchedule
    ) {
        statusLabel =
            'Awaiting Schedule';

        statusClass =
            'bg-yellow-100 text-yellow-700';

        description =
            'You passed the examination. The School of Law is preparing your interview schedule.';
    }

    if (
        interviewSchedule
    ) {
        statusLabel =
            interviewSchedulePassed
                ? 'Result Pending'
                : 'Scheduled';

        statusClass =
            'bg-blue-100 text-blue-700';

        description =
            interviewSchedulePassed
                ? 'Your scheduled interview time has passed. Please wait for the official result.'
                : 'Your admission interview has been scheduled.';
    }

    if (
        result ===
        'Passed'
    ) {
        statusLabel =
            'Passed';

        statusClass =
            'bg-green-100 text-green-700';

        description =
            'You successfully passed the admission interview.';
    }

    if (
        result ===
        'Failed'
    ) {
        statusLabel =
            'Failed';

        statusClass =
            'bg-red-100 text-red-700';

        description =
            'You did not pass the admission interview. Please check your registered email for the official notification.';
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <SectionHeader
                icon={
                    ClipboardList
                }
                title="Interview"
                description="Your admission interview schedule and result"
                maroon={
                    maroon
                }
            />

            <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold text-gray-900">
                            Interview
                            Status
                        </p>

                        <p className="mt-1 text-sm leading-6 text-gray-500">
                            {
                                description
                            }
                        </p>
                    </div>

                    <span
                        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${statusClass}`}
                    >
                        {
                            statusLabel
                        }
                    </span>
                </div>

                {interviewSchedule && (
                    <>
                        <div className="mt-5 space-y-3 rounded-xl bg-gray-50 p-4">
                            <ScheduleLine
                                icon={
                                    CalendarDays
                                }
                                label="Date"
                                value={formatDate(
                                    interviewSchedule.interview_date
                                )}
                                maroon={
                                    maroon
                                }
                            />

                            <ScheduleLine
                                icon={
                                    Clock
                                }
                                label="Time"
                                value={formatTime(
                                    interviewSchedule.interview_time
                                )}
                                maroon={
                                    maroon
                                }
                            />

                            <ScheduleLine
                                icon={
                                    MapPin
                                }
                                label="Venue"
                                value={
                                    interviewSchedule.venue
                                }
                                maroon={
                                    maroon
                                }
                            />
                        </div>

                        {interviewSchedule.instructions && (
                            <div className="mt-4 rounded-xl border border-[#ead0d0] bg-[#f9eeee] p-4">
                                <p
                                    className="text-xs font-bold uppercase tracking-wide"
                                    style={{
                                        color:
                                            maroon,
                                    }}
                                >
                                    Interview
                                    Instructions
                                </p>

                                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-700">
                                    {
                                        interviewSchedule.instructions
                                    }
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Final Result Card
|--------------------------------------------------------------------------
*/

function FinalResultCard({
    applicationDeclined,
    examFailed,
    interviewFailed,
    interviewPassed,
}) {
    const stopped =
        applicationDeclined ||
        examFailed ||
        interviewFailed;

    if (
        interviewPassed
    ) {
        return (
            <div className="mb-6 overflow-hidden rounded-2xl border border-green-200 bg-green-50 shadow-sm">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
                            <CheckCircle
                                size={
                                    29
                                }
                            />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                                FINAL
                                ADMISSION
                                RESULT
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-green-900">
                                Qualified
                                Applicant
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-green-800">
                                Congratulations!
                                You
                                successfully
                                completed
                                the USeP
                                School of
                                Law
                                admission
                                evaluation
                                process.
                                Your name
                                has been
                                included
                                in the
                                Final List
                                of
                                qualified
                                applicants.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (
        stopped
    ) {
        return (
            <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-red-50 shadow-sm">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700">
                            <XCircle
                                size={
                                    29
                                }
                            />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-red-700">
                                FINAL
                                ADMISSION
                                RESULT
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-red-900">
                                Admission
                                Process
                                Ended
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-red-800">
                                Your
                                admission
                                process
                                did not
                                proceed
                                beyond one
                                of the
                                required
                                evaluation
                                stages.
                                Review the
                                corresponding
                                status
                                section
                                above for
                                details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="p-6 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                        <Clock
                            size={
                                27
                            }
                        />
                    </div>

                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                            FINAL
                            ADMISSION
                            RESULT
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Pending
                        </h2>

                        <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500">
                            Complete
                            the
                            previous
                            admission
                            stages
                            before
                            your final
                            admission
                            result can
                            be
                            determined.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Section Header
|--------------------------------------------------------------------------
*/

function SectionHeader({
    icon: Icon,
    title,
    description,
    maroon,
}) {
    return (
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-5 sm:px-6">
            <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{
                    backgroundColor:
                        '#f5e6e6',
                    color:
                        maroon,
                }}
            >
                <Icon
                    size={
                        22
                    }
                />
            </div>

            <div className="min-w-0">
                <h2 className="font-bold text-gray-900">
                    {
                        title
                    }
                </h2>

                {description && (
                    <p className="text-sm leading-6 text-gray-500">
                        {
                            description
                        }
                    </p>
                )}
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Information Item
|--------------------------------------------------------------------------
*/

function InfoItem({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-sm font-medium text-gray-500">
                {
                    label
                }
            </p>

            <p className="mt-1 break-words font-semibold text-gray-900">
                {value ??
                    'Not available'}
            </p>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Schedule Line
|--------------------------------------------------------------------------
*/

function ScheduleLine({
    icon: Icon,
    label,
    value,
    maroon,
}) {
    return (
        <div className="flex items-start gap-3">
            <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{
                    backgroundColor:
                        '#f9eeee',
                    color:
                        maroon,
                }}
            >
                <Icon
                    size={
                        17
                    }
                />
            </div>

            <div className="min-w-0">
                <p className="text-xs text-gray-500">
                    {
                        label
                    }
                </p>

                <p className="break-words font-semibold text-gray-900">
                    {value ??
                        'Not available'}
                </p>
            </div>
        </div>
    );
}

/*
|--------------------------------------------------------------------------
| Progress Item
|--------------------------------------------------------------------------
*/

function ProgressItem({
    value,
    label,
    className,
}) {
    return (
        <div
            className={`rounded-xl p-4 text-center ${className}`}
        >
            <p className="text-2xl font-bold">
                {
                    value
                }
            </p>

            <p className="mt-1 text-xs font-medium opacity-75">
                {
                    label
                }
            </p>
        </div>
    );
}

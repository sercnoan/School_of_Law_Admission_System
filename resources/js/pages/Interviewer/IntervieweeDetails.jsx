import PortalLayout from '@/layouts/portal-layout';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    CalendarDays,
    Download,
    ExternalLink,
    FileText,
    Mail,
    MapPin,
    Phone,
    User,
} from 'lucide-react';

const labels = {
    applicant_number: 'Applicant number',
    full_name: 'Full name',
    email: 'Email address',
    contact_number: 'Contact number',
    age: 'Age',
    gender: 'Gender',
    civil_status: 'Civil status',
    religion: 'Religion',
    present_address: 'Present address',
    school_graduated: 'School graduated',
    employment_status: 'Employment status',
    ethnic_affiliation: 'Ethnic affiliation',
    is_indigenous: 'Member of an Indigenous Peoples Community',
    indigenous_community: 'Indigenous community',
    is_pwd: 'Person with disability',
    pwd_type: 'Disability type',
    individual_income_range: 'Individual monthly income',
    family_income_range: 'Family gross monthly income',
    program: 'Program',
    academic_year: 'Academic year',
};

export default function IntervieweeDetails({
    interviewee,
    profile,
    documents = [],
}) {
    const profileFields = Object.entries(labels).filter(
        ([key]) =>
            profile[key] !== null &&
            profile[key] !== undefined &&
            profile[key] !== '',
    );
    const displayValue = (key, value) => {
        if (key === 'is_indigenous' || key === 'is_pwd')
            return value ? 'Yes' : 'No';
        return String(value);
    };

    return (
        <>
            <Head title={`${profile.full_name} — Interviewee`} />
            <div className="min-h-screen bg-gray-50">
                <PortalLayout audience="interviewer">
                    <div className="mx-auto max-w-6xl space-y-6">
                        <Link
                            href="/interviewer/interviewees"
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[#922b2b] hover:underline"
                        >
                            <ArrowLeft size={17} /> Back to interviewees
                        </Link>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                                <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 text-gray-400">
                                    {profile.photo_path ? (
                                        <img
                                            src={`/storage/${profile.photo_path}`}
                                            alt={`Photo of ${profile.full_name}`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <User size={38} />
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-[#922b2b]">
                                        Interviewee profile
                                    </p>
                                    <h1 className="mt-1 text-3xl font-bold text-gray-900">
                                        {profile.full_name}
                                    </h1>
                                    <p className="mt-2 text-sm text-gray-600">
                                        {profile.applicant_number} ·{' '}
                                        {profile.program}
                                    </p>
                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
                                        <span className="inline-flex items-center gap-1.5">
                                            <Mail size={15} />
                                            {profile.email}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Phone size={15} />
                                            {profile.contact_number ||
                                                'Not provided'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">
                                Interview schedule
                            </h2>
                            <div className="mt-4 grid gap-4 sm:grid-cols-2">
                                <p className="flex gap-3 text-sm text-gray-700">
                                    <CalendarDays
                                        className="shrink-0 text-[#922b2b]"
                                        size={19}
                                    />
                                    <span>
                                        <strong className="block text-gray-900">
                                            Date and time
                                        </strong>
                                        {interviewee.interview_date ||
                                            'Not set'}{' '}
                                        ·{' '}
                                        {interviewee.interview_time ||
                                            'Not set'}
                                    </span>
                                </p>
                                <p className="flex gap-3 text-sm text-gray-700">
                                    <MapPin
                                        className="shrink-0 text-[#922b2b]"
                                        size={19}
                                    />
                                    <span>
                                        <strong className="block text-gray-900">
                                            Venue
                                        </strong>
                                        {interviewee.interview_venue ||
                                            'Not set'}
                                    </span>
                                </p>
                            </div>
                            {interviewee.interview_instructions && (
                                <p className="mt-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
                                    {interviewee.interview_instructions}
                                </p>
                            )}
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">
                                Personal information
                            </h2>
                            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                                {profileFields.map(([key, label]) => (
                                    <div key={key}>
                                        <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                                            {label}
                                        </dt>
                                        <dd className="mt-1 text-sm font-medium text-gray-900">
                                            {displayValue(key, profile[key])}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">
                                Submitted documents
                            </h2>
                            <div className="mt-5 divide-y divide-gray-100 rounded-xl border border-gray-200">
                                {documents.map((document) => (
                                    <div
                                        key={document.requirement_id}
                                        className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                                    >
                                        <FileText
                                            className="shrink-0 text-[#922b2b]"
                                            size={21}
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="font-semibold text-gray-900">
                                                {document.requirement_name}
                                            </p>
                                            <p className="mt-0.5 text-xs text-gray-500">
                                                {document.submitted
                                                    ? document.submission
                                                          .file_name
                                                    : 'Not submitted'}
                                            </p>
                                        </div>
                                        {document.submitted && (
                                            <div className="flex flex-wrap gap-2">
                                                <a
                                                    href={`/interviewer/requirements/${document.submission.submission_id}/view`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#922b2b] bg-white px-3.5 py-2 text-sm font-semibold text-[#922b2b] hover:bg-[#922b2b]/5"
                                                >
                                                    <ExternalLink size={16} />{' '}
                                                    View document
                                                </a>
                                                <a
                                                    href={`/interviewer/requirements/${document.submission.submission_id}/download`}
                                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#922b2b] px-3.5 py-2 text-sm font-semibold text-white hover:bg-[#7c2424]"
                                                >
                                                    <Download size={16} />{' '}
                                                    Download
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </PortalLayout>
            </div>
        </>
    );
}

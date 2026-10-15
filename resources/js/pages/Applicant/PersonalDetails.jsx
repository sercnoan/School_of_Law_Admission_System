import PortalLayout from '@/layouts/portal-layout';
import { Head, useForm } from '@inertiajs/react';

import { AlertCircle, BadgeCheck, CalendarDays, Camera, CheckCircle2, ClipboardList, FileText, GraduationCap, ImagePlus, LayoutDashboard, Pencil, User, WalletCards, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const ethnicAffiliations = [
    'Bisaya/Cebuano',
    'Tagalog',
    'Ilocano',
    'Hiligaynon/Ilonggo',
    'Waray',
    'Bicolano',
    'Kapampangan',
    'Pangasinense',
    'Moro',
    'Indigenous Peoples Group',
    'Prefer not to say',
];

const monthlyIncomeRanges = [
    'Below ₱10,000.00',
    '₱10,001.00 – ₱20,000.00',
    '₱20,001.00 – ₱30,000.00',
    '₱30,001.00 – ₱40,000.00',
    '₱40,001.00 – ₱50,000.00',
    '₱50,001.00 – ₱100,000.00',
    'Above ₱100,000.00',
];

export default function PersonalDetails({
    profile = null,
    email = null,
}) {

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm font-medium text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 hover:border-gray-300 focus:border-[#922b2b] focus:bg-white focus:ring-4 focus:ring-[#922b2b]/10';

    const storedGender = profile?.gender || '';
    const standardGender = ['Male', 'Female'].includes(
        storedGender
    );
    const storedEthnicAffiliation =
        profile?.ethnic_affiliation || '';
    const standardEthnicAffiliation =
        ethnicAffiliations.includes(storedEthnicAffiliation);

    const [isEditing, setIsEditing] = useState(false);
    const [showReview, setShowReview] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        setError,
        clearErrors,
        reset,
    } = useForm({
        photo: null,
        full_name: profile?.full_name || '',
        school_graduated: profile?.school_graduated || '',
        employment_status: profile?.employment_status || '',
        present_address: profile?.present_address || '',
        age: profile?.age ?? '',
        gender: profile
            ? standardGender
                ? storedGender
                : 'Other'
            : '',
        gender_other:
            profile && !standardGender ? storedGender : '',
        contact_number: profile?.contact_number || '',
        religion: profile?.religion || '',
        civil_status: profile?.civil_status || '',
        individual_income: profile?.individual_income ?? '',
        individual_income_range: profile?.individual_income_range || '',
        family_income: profile?.family_income ?? '',
        family_income_range: profile?.family_income_range || '',
        ethnic_affiliation: profile
            ? standardEthnicAffiliation
                ? storedEthnicAffiliation
                : storedEthnicAffiliation
                  ? 'Other'
                  : ''
            : '',
        ethnic_affiliation_other:
            profile &&
            storedEthnicAffiliation &&
            !standardEthnicAffiliation
                ? storedEthnicAffiliation
                : '',
        is_indigenous:
            profile?.is_indigenous === null ||
            profile?.is_indigenous === undefined
                ? ''
                : String(Number(profile.is_indigenous)),
        indigenous_community:
            profile?.indigenous_community || '',
        is_pwd:
            profile?.is_pwd === null ||
            profile?.is_pwd === undefined
                ? ''
                : String(Number(profile.is_pwd)),
        pwd_type: profile?.pwd_type || '',
    });

    const selectedPhotoPreview = useMemo(
        () =>
            typeof File !== 'undefined' && data.photo instanceof File
                ? URL.createObjectURL(data.photo)
                : null,
        [data.photo]
    );

    useEffect(
        () => () => {
            if (selectedPhotoPreview) {
                URL.revokeObjectURL(selectedPhotoPreview);
            }
        },
        [selectedPhotoPreview]
    );

    const savedPhotoUrl = profile?.photo_path
        ? `/storage/${profile.photo_path}`
        : null;
    const photoPreview = selectedPhotoPreview || savedPhotoUrl;

    const submit = (event) => {
        event.preventDefault();

        clearErrors();

        const requiredFields = {
            full_name: 'Enter your full name.',
            school_graduated: 'Enter the school you graduated from.',
            employment_status: 'Select your employment status.',
            present_address: 'Enter your present address.',
            age: 'Enter your age.',
            gender: 'Select your gender.',
            contact_number: 'Enter your contact number.',
            religion: 'Enter your religion.',
            civil_status: 'Select your civil status.',
            individual_income_range: 'Select your individual gross monthly income range.',
            family_income_range: 'Select your family gross monthly income range.',
            ethnic_affiliation: 'Select your ethnic affiliation.',
            is_indigenous: 'Select Yes or No.',
            is_pwd: 'Select Yes or No.',
        };

        const missing = Object.fromEntries(
            Object.entries(requiredFields).filter(
                ([field]) =>
                    data[field] === '' ||
                    data[field] === null ||
                    data[field] === undefined
            )
        );

        if (!photoPreview) {
            missing.photo = 'Upload your applicant photo.';
        }

        if (
            data.gender === 'Other' &&
            !data.gender_other.trim()
        ) {
            missing.gender_other =
                'Describe your gender.';
        }

        if (
            data.ethnic_affiliation === 'Other' &&
            !data.ethnic_affiliation_other.trim()
        ) {
            missing.ethnic_affiliation_other =
                'Enter your ethnic affiliation.';
        }

        if (Object.keys(missing).length > 0) {
            setError(missing);
            return;
        }

        setShowReview(true);
    };

    const confirmSubmission = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                setShowReview(false);
                setIsEditing(false);
            },
            onError: () => setShowReview(false),
        };

        if (profile) {
            post('/personal-details/update', {
                ...options,
                forceFormData: true,
            });
            return;
        }

        post('/personal-details', {
            ...options,
            forceFormData: true,
        });
    };

    const cancelEditing = () => {
        reset();
        clearErrors();
        setShowReview(false);
        setIsEditing(false);
    };

    const yesNo = (value) =>
        Number(value) === 1 ? 'Yes' : 'No';

    const errorCount = Object.keys(errors).length;

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
            <Head title="Personal Information" />

            <div className="min-h-screen bg-gray-50">
                {/* MOBILE HEADER */}


                {/* MOBILE OVERLAY */}


                {/* SIDEBAR */}


                {/* MAIN CONTENT */}
                <PortalLayout audience="applicant">
                    <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
                        <div className="mx-auto max-w-5xl">
                            <div className="mb-8">
                                <p
                                    className="mb-2 text-sm font-semibold"
                                    style={{ color: maroon }}
                                >
                                    ADMISSION PORTAL
                                </p>

                                <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                    Personal Information
                                </h1>

                                <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-500 sm:text-base">
                                    {profile
                                        ? 'Review the personal information you submitted for your School of Law application.'
                                        : 'Provide your personal information to continue with your School of Law application.'}
                                </p>
                            </div>

                            {profile && !isEditing ? (
                                <SavedProfile
                                    profile={profile}
                                    email={email}
                                    maroon={maroon}
                                    yesNo={yesNo}
                                    onEdit={() =>
                                        setIsEditing(true)
                                    }
                                />
                            ) : (
                                <form
                                    onSubmit={submit}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* FORM HEADER */}
                                    <div className="border-b border-gray-100 px-5 py-6 sm:px-7">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {profile
                                                        ? 'Edit Personal Details'
                                                        : 'Personal Details'}
                                                </h2>

                                                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500">
                                                    Enter your information carefully. You will review it before saving. Fields marked
                                                    with <span className="font-semibold text-red-500">*</span>{' '}
                                                    are required.
                                                </p>
                                            </div>

                                            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#ead0d0] bg-[#f9eeee] px-3 py-1.5 text-xs font-semibold text-[#691f1f]">
                                                <span className="h-2 w-2 rounded-full bg-[#922b2b]" />
                                                Applicant Information
                                            </div>
                                        </div>
                                    </div>

                                    {/* VALIDATION SUMMARY */}
                                    {errorCount > 0 && (
                                        <div className="mx-5 mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 sm:mx-7">
                                            <AlertCircle
                                                size={19}
                                                className="mt-0.5 shrink-0 text-red-600"
                                            />

                                            <div>
                                                <p className="text-sm font-semibold text-red-800">
                                                    Some information needs your attention.
                                                </p>

                                                <p className="mt-1 text-sm leading-5 text-red-700">
                                                    Check the fields highlighted below and try again.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* FORM BODY */}
                                    <div className="p-5 sm:p-7">
                                        <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-12">

                                            {/* APPLICANT PHOTO */}
                                            <div className="md:col-span-12">
                                                <CleanField
                                                    label="Applicant Photo"
                                                    error={errors.photo}
                                                    required
                                                >
                                                    <div className={`flex flex-col gap-5 rounded-2xl border p-4 sm:flex-row sm:items-center ${errors.photo ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-gray-50/70'}`}>
                                                        <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-400">
                                                            {photoPreview ? (
                                                                <img
                                                                    src={photoPreview}
                                                                    alt="Applicant photo preview"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Camera size={36} />
                                                            )}
                                                        </div>

                                                        <div className="flex-1">
                                                            <p className="text-sm font-semibold text-gray-900">
                                                                {profile?.photo_path
                                                                    ? 'Choose a new photo only if you want to replace the current one.'
                                                                    : 'Upload a clear, recent photo of yourself.'}
                                                            </p>
                                                            <p className="mt-1 text-xs leading-5 text-gray-500">
                                                                JPG, PNG, or WebP. Maximum file size: 10 MB.
                                                            </p>

                                                            <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#d9b8b8] bg-white px-4 py-2.5 text-sm font-bold text-[#691f1f] transition hover:bg-[#fffafa]">
                                                                <ImagePlus size={17} />
                                                                {photoPreview ? 'Change Photo' : 'Choose Photo'}
                                                                <input
                                                                    type="file"
                                                                    accept="image/jpeg,image/png,image/webp"
                                                                    className="sr-only"
                                                                    onChange={(event) =>
                                                                        setData(
                                                                            'photo',
                                                                            event.target.files?.[0] || null
                                                                        )
                                                                    }
                                                                />
                                                            </label>
                                                        </div>
                                                    </div>
                                                </CleanField>
                                            </div>

                                            {/* FULL NAME */}
                                            <div className="md:col-span-12">
                                                <CleanField
                                                    label="Full Name"
                                                    error={errors.full_name}
                                                    required
                                                >
                                                    <input
                                                        type="text"
                                                        value={data.full_name}
                                                        onChange={(e) =>
                                                            setData(
                                                                'full_name',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                        placeholder="Last Name, First Name, Middle Name"
                                                    />
                                                </CleanField>
                                            </div>

                                            {/* SCHOOL */}
                                            <div className="md:col-span-6">
                                                <CleanField
                                                    label="School Graduated"
                                                    error={
                                                        errors.school_graduated
                                                    }
                                                    required
                                                >
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.school_graduated
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'school_graduated',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                        placeholder="Enter school or university"
                                                    />
                                                </CleanField>
                                            </div>

                                            {/* EMPLOYMENT */}
                                            <div className="md:col-span-6">
                                                <CleanField
                                                    label="Employment Status"
                                                    error={
                                                        errors.employment_status
                                                    }
                                                    required
                                                >
                                                    <select
                                                        value={
                                                            data.employment_status
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'employment_status',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Select employment status
                                                        </option>
                                                        <option value="Student">
                                                            Student
                                                        </option>
                                                        <option value="Employed">
                                                            Employed
                                                        </option>
                                                        <option value="Self-Employed">
                                                            Self-Employed
                                                        </option>
                                                        <option value="Not Currently Employed">
                                                            Not Currently Employed
                                                        </option>
                                                    </select>
                                                </CleanField>
                                            </div>

                                            {/* ADDRESS */}
                                            <div className="md:col-span-12">
                                                <CleanField
                                                    label="Present Address"
                                                    error={
                                                        errors.present_address
                                                    }
                                                    required
                                                >
                                                    <textarea
                                                        rows={3}
                                                        value={
                                                            data.present_address
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'present_address',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`${inputClass} resize-none`}
                                                        placeholder="House/Unit No., Street, Barangay, City/Municipality, Province"
                                                    />
                                                </CleanField>
                                            </div>

                                            {/* AGE */}
                                            <div className="md:col-span-4">
                                                <CleanField
                                                    label="Age"
                                                    error={errors.age}
                                                    required
                                                >
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="100"
                                                        value={data.age}
                                                        onChange={(e) =>
                                                            setData(
                                                                'age',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                        placeholder="Enter age"
                                                    />
                                                </CleanField>
                                            </div>

                                            {/* CIVIL STATUS */}
                                            <div className="md:col-span-4">
                                                <CleanField
                                                    label="Civil Status"
                                                    error={
                                                        errors.civil_status
                                                    }
                                                    required
                                                >
                                                    <select
                                                        value={
                                                            data.civil_status
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'civil_status',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Select civil status
                                                        </option>
                                                        <option value="Single">
                                                            Single
                                                        </option>
                                                        <option value="Married">
                                                            Married
                                                        </option>
                                                        <option value="Widowed">
                                                            Widowed
                                                        </option>
                                                        <option value="Separated">
                                                            Separated
                                                        </option>
                                                        <option value="Divorced">
                                                            Divorced
                                                        </option>
                                                    </select>
                                                </CleanField>
                                            </div>

                                            {/* GENDER */}
                                            <div className="md:col-span-4">
                                                <CleanField
                                                    label="Gender"
                                                    error={errors.gender}
                                                    required
                                                >
                                                    <div className="space-y-3">
                                                        <select
                                                            value={data.gender}
                                                            onChange={(e) => {
                                                                const value =
                                                                    e.target.value;

                                                                setData(
                                                                    'gender',
                                                                    value
                                                                );

                                                                if (
                                                                    value !==
                                                                    'Other'
                                                                ) {
                                                                    setData(
                                                                        'gender_other',
                                                                        ''
                                                                    );
                                                                }
                                                            }}
                                                            className={inputClass}
                                                        >
                                                            <option value="">
                                                                Select gender
                                                            </option>
                                                            <option value="Male">
                                                                Male
                                                            </option>
                                                            <option value="Female">
                                                                Female
                                                            </option>
                                                            <option value="Other">
                                                                Other
                                                            </option>
                                                        </select>

                                                        {data.gender ===
                                                            'Other' && (
                                                            <div>
                                                                <label
                                                                    htmlFor="gender_other"
                                                                    className="mb-2 block text-xs font-semibold text-gray-600"
                                                                >
                                                                    Specify gender
                                                                    <span className="ml-1 text-red-500">
                                                                        *
                                                                    </span>
                                                                </label>

                                                                <input
                                                                    id="gender_other"
                                                                    type="text"
                                                                    value={
                                                                        data.gender_other
                                                                    }
                                                                    onChange={(e) =>
                                                                        setData(
                                                                            'gender_other',
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    className={inputClass}
                                                                    placeholder="Enter gender"
                                                                    maxLength={100}
                                                                    autoComplete="off"
                                                                    autoFocus
                                                                />

                                                                {errors.gender_other && (
                                                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600">
                                                                        <AlertCircle
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                        {
                                                                            errors.gender_other
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CleanField>
                                            </div>

                                            {/* CONTACT */}
                                            <div className="md:col-span-6">
                                                <CleanField
                                                    label="Contact Number"
                                                    error={
                                                        errors.contact_number
                                                    }
                                                    required
                                                >
                                                    <input
                                                        type="text"
                                                        value={
                                                            data.contact_number
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'contact_number',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                        placeholder="09XXXXXXXXX"
                                                    />
                                                </CleanField>
                                            </div>

                                            {/* RELIGION */}
                                            <div className="md:col-span-6">
                                                <CleanField
                                                    label="Religion"
                                                    error={errors.religion}
                                                    required
                                                >
                                                    <input
                                                        type="text"
                                                        value={data.religion}
                                                        onChange={(e) =>
                                                            setData(
                                                                'religion',
                                                                e.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                        placeholder="Enter religion"
                                                    />
                                                </CleanField>
                                            </div>

                                            {/* INDIVIDUAL INCOME */}
                                            <div className="md:col-span-6">
                                                <CleanField
                                                    label="Individual Gross Monthly Income"
                                                    error={
                                                        errors.individual_income_range
                                                    }
                                                    required
                                                >
                                                    <select
                                                        value={
                                                            data.individual_income_range
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'individual_income_range',
                                                                event.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Select an income range
                                                        </option>
                                                        {monthlyIncomeRanges.map(
                                                            (range) => (
                                                                <option
                                                                    key={range}
                                                                    value={range}
                                                                >
                                                                    {range}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </CleanField>

                                                <p className="mt-1.5 text-xs text-gray-400">
                                                    Select the range for your personal monthly income.
                                                </p>
                                            </div>

                                            {/* FAMILY INCOME */}
                                            <div className="md:col-span-6">
                                                <CleanField
                                                    label="Family Gross Monthly Income"
                                                    error={
                                                        errors.family_income_range
                                                    }
                                                    required
                                                >
                                                    <select
                                                        value={
                                                            data.family_income_range
                                                        }
                                                        onChange={(event) =>
                                                            setData(
                                                                'family_income_range',
                                                                event.target.value
                                                            )
                                                        }
                                                        className={inputClass}
                                                    >
                                                        <option value="">
                                                            Select an income range
                                                        </option>
                                                        {monthlyIncomeRanges.map(
                                                            (range) => (
                                                                <option
                                                                    key={range}
                                                                    value={range}
                                                                >
                                                                    {range}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </CleanField>

                                                <p className="mt-1.5 text-xs text-gray-400">
                                                    Select the combined monthly income of your household or family.
                                                </p>
                                            </div>

                                            {/* ETHNIC AFFILIATION */}
                                            <div className="md:col-span-12">
                                                <CleanField
                                                    label="Ethnic Affiliation"
                                                    error={
                                                        errors.ethnic_affiliation
                                                    }
                                                    required
                                                >
                                                    <div className="space-y-3">
                                                        <select
                                                            value={
                                                                data.ethnic_affiliation
                                                            }
                                                            onChange={(event) => {
                                                                setData(
                                                                    'ethnic_affiliation',
                                                                    event.target.value
                                                                );

                                                                if (
                                                                    event.target.value !==
                                                                    'Other'
                                                                ) {
                                                                    setData(
                                                                        'ethnic_affiliation_other',
                                                                        ''
                                                                    );
                                                                }
                                                            }}
                                                            className={inputClass}
                                                        >
                                                            <option value="">
                                                                Select ethnic affiliation
                                                            </option>
                                                            {ethnicAffiliations.map(
                                                                (affiliation) => (
                                                                    <option
                                                                        key={affiliation}
                                                                        value={affiliation}
                                                                    >
                                                                        {affiliation}
                                                                    </option>
                                                                )
                                                            )}
                                                            <option value="Other">
                                                                Other
                                                            </option>
                                                        </select>

                                                        {data.ethnic_affiliation ===
                                                            'Other' && (
                                                            <div>
                                                                <input
                                                                    type="text"
                                                                    value={
                                                                        data.ethnic_affiliation_other
                                                                    }
                                                                    onChange={(event) =>
                                                                        setData(
                                                                            'ethnic_affiliation_other',
                                                                            event.target.value
                                                                        )
                                                                    }
                                                                    className={inputClass}
                                                                    placeholder="Enter your ethnic affiliation"
                                                                    maxLength={100}
                                                                />

                                                                {errors.ethnic_affiliation_other && (
                                                                    <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600">
                                                                        <AlertCircle size={15} />
                                                                        {errors.ethnic_affiliation_other}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </CleanField>
                                            </div>

                                            {/* INDIGENOUS PEOPLES */}
                                            <div className="md:col-span-12">
                                                <InlineChoice
                                                    label="Are you a member of an Indigenous Peoples Community of the Philippines?"
                                                    value={
                                                        data.is_indigenous
                                                    }
                                                    onChange={(value) => {
                                                        setData(
                                                            'is_indigenous',
                                                            value
                                                        );

                                                        if (
                                                            value === '0'
                                                        ) {
                                                            setData(
                                                                'indigenous_community',
                                                                ''
                                                            );
                                                        }
                                                    }}
                                                    error={
                                                        errors.is_indigenous
                                                    }
                                                    required
                                                />
                                            </div>

                                            {data.is_indigenous === '1' && (
                                                <div className="md:col-span-12">
                                                    <CleanField
                                                        label="Indigenous Peoples Community"
                                                        error={
                                                            errors.indigenous_community
                                                        }
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                data.indigenous_community
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'indigenous_community',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                            placeholder="Enter community or group"
                                                        />
                                                    </CleanField>
                                                </div>
                                            )}

                                            {/* PWD */}
                                            <div className="md:col-span-12">
                                                <InlineChoice
                                                    label="Are you a person with disability?"
                                                    value={data.is_pwd}
                                                    onChange={(value) => {
                                                        setData(
                                                            'is_pwd',
                                                            value
                                                        );

                                                        if (
                                                            value === '0'
                                                        ) {
                                                            setData(
                                                                'pwd_type',
                                                                ''
                                                            );
                                                        }
                                                    }}
                                                    error={errors.is_pwd}
                                                    required
                                                />
                                            </div>

                                            {data.is_pwd === '1' && (
                                                <div className="md:col-span-12">
                                                    <CleanField
                                                        label="Type of Disability"
                                                        error={
                                                            errors.pwd_type
                                                        }
                                                    >
                                                        <input
                                                            type="text"
                                                            value={
                                                                data.pwd_type
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'pwd_type',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={
                                                                inputClass
                                                            }
                                                            placeholder="Enter type of disability"
                                                        />
                                                    </CleanField>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* FORM FOOTER */}
                                    <div className="border-t border-gray-100 bg-gray-50/70 px-5 py-5 sm:px-7">
                                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                            <p className="max-w-2xl text-sm leading-6 text-gray-500">
                                                Your information will not be saved until you confirm it in the review window.
                                            </p>

                                            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                                {profile && (
                                                    <button
                                                        type="button"
                                                        onClick={cancelEditing}
                                                        disabled={processing}
                                                        className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                                                    >
                                                        Cancel
                                                    </button>
                                                )}

                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                                    style={{
                                                        backgroundColor:
                                                            maroon,
                                                    }}
                                                >
                                                    Review Information
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {showReview && (
                                <PersonalInformationReview
                                    data={data}
                                    photoPreview={photoPreview}
                                    email={email}
                                    processing={processing}
                                    isEditing={Boolean(profile)}
                                    yesNo={yesNo}
                                    onClose={() =>
                                        setShowReview(false)
                                    }
                                    onConfirm={confirmSubmission}
                                />
                            )}

                            <div className="mt-10 border-t border-gray-200 pt-5">
                                <p className="text-center text-xs text-gray-400 sm:text-left">
                                    USeP School of Law Admission
                                    Portal • Applicant
                                </p>
                            </div>
                        </div>
                    </div>
                </PortalLayout>
            </div>
        </>
    );
}

function SavedProfile({
    profile,
    email,
    maroon,
    yesNo,
    onEdit,
}) {
    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-green-100 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-green-100 text-green-700 shadow-sm">
                            {profile.photo_path ? (
                                <img
                                    src={`/storage/${profile.photo_path}`}
                                    alt={`${profile.full_name} applicant photo`}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                    <BadgeCheck size={28} />
                                </div>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                                PROFILE COMPLETED
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-gray-900">
                                Personal Information Submitted
                            </h2>

                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:items-end">
                        <div className="rounded-xl border border-green-200 bg-white px-4 py-3 sm:text-right">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                Applicant Number
                            </p>
                            <p className="mt-1 text-lg font-bold text-green-700">
                                {profile.applicant_number}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onEdit}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#d9b8b8] bg-white px-4 py-2.5 text-sm font-bold text-[#691f1f] transition hover:bg-[#fffafa]"
                        >
                            <Pencil size={16} />
                            Edit Information
                        </button>
                    </div>
                </div>

                <div className="space-y-7 p-5 sm:p-6">
                    <ProfileSection
                        title="Personal Information"
                        icon={User}
                        maroon={maroon}
                    >
                        <ProfileGrid>
                            <ProfileValue
                                label="Full Name"
                                value={profile.full_name}
                                wide
                            />
                            <ProfileValue
                                label="Email Address"
                                value={email}
                            />
                            <ProfileValue
                                label="Contact Number"
                                value={
                                    profile.contact_number
                                }
                            />
                            <ProfileValue
                                label="School Graduated"
                                value={
                                    profile.school_graduated
                                }
                            />
                            <ProfileValue
                                label="Employment Status"
                                value={
                                    profile.employment_status
                                }
                            />
                            <ProfileValue
                                label="Age"
                                value={profile.age}
                            />
                            <ProfileValue
                                label="Gender"
                                value={profile.gender}
                            />
                            <ProfileValue
                                label="Religion"
                                value={profile.religion}
                            />
                            <ProfileValue
                                label="Civil Status"
                                value={
                                    profile.civil_status
                                }
                            />
                            <ProfileValue
                                label="Present Address"
                                value={
                                    profile.present_address
                                }
                                wide
                            />
                        </ProfileGrid>
                    </ProfileSection>

                    <div className="border-t border-gray-100" />

                    <ProfileSection
                        title="Income Information"
                        icon={WalletCards}
                        maroon={maroon}
                    >
                        <ProfileGrid>
                            <ProfileValue
                                label="Individual Gross Monthly Income"
                                value={
                                    profile.individual_income_range ||
                                    'Not provided'
                                }
                            />
                            <ProfileValue
                                label="Family Gross Monthly Income"
                                value={
                                    profile.family_income_range ||
                                    'Not provided'
                                }
                            />
                        </ProfileGrid>
                    </ProfileSection>

                    <div className="border-t border-gray-100" />

                    <ProfileSection
                        title="Additional Information"
                        icon={ClipboardList}
                        maroon={maroon}
                    >
                        <ProfileGrid>
                            <ProfileValue
                                label="Ethnic Affiliation"
                                value={
                                    profile.ethnic_affiliation ||
                                    'Not provided'
                                }
                            />
                            <ProfileValue
                                label="Member of Indigenous Peoples Community"
                                value={yesNo(
                                    profile.is_indigenous
                                )}
                            />
                            <ProfileValue
                                label="Indigenous Peoples Community"
                                value={
                                    Number(
                                        profile.is_indigenous
                                    ) === 1
                                        ? profile.indigenous_community ||
                                          'Not specified'
                                        : 'Not applicable'
                                }
                            />
                            <ProfileValue
                                label="Person with Disability"
                                value={yesNo(
                                    profile.is_pwd
                                )}
                            />
                            <ProfileValue
                                label="Type of Disability"
                                value={
                                    Number(
                                        profile.is_pwd
                                    ) === 1
                                        ? profile.pwd_type ||
                                          'Not specified'
                                        : 'Not applicable'
                                }
                            />
                        </ProfileGrid>
                    </ProfileSection>
                </div>
            </div>

        </div>
    );
}

function PersonalInformationReview({
    data,
    photoPreview,
    email,
    processing,
    isEditing,
    yesNo,
    onClose,
    onConfirm,
}) {
    const gender =
        data.gender === 'Other'
            ? data.gender_other
            : data.gender;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="personal-information-review-title"
        >
            <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-5 sm:px-7">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#922b2b]">
                            REVIEW BEFORE SAVING
                        </p>
                        <h2
                            id="personal-information-review-title"
                            className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl"
                        >
                            Confirm Your Personal Information
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Check every detail carefully. Choose Back to Edit if something needs correction.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        aria-label="Close review"
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                    >
                        <X size={21} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                    <div className="mb-5 flex flex-col items-center gap-3 text-center">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Applicant Photo
                        </p>
                        <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
                            {photoPreview ? (
                                <img
                                    src={photoPreview}
                                    alt="Applicant photo for review"
                                    className="h-full w-full rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-gray-400">
                                    <Camera size={30} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <ReviewValue label="Full Name" value={data.full_name} wide />
                        <ReviewValue label="Email Address" value={email} />
                        <ReviewValue label="Contact Number" value={data.contact_number} />
                        <ReviewValue label="School Graduated" value={data.school_graduated} />
                        <ReviewValue label="Employment Status" value={data.employment_status} />
                        <ReviewValue label="Age" value={data.age} />
                        <ReviewValue label="Gender" value={gender} />
                        <ReviewValue label="Religion" value={data.religion} />
                        <ReviewValue label="Civil Status" value={data.civil_status} />
                        <ReviewValue label="Present Address" value={data.present_address} wide />
                        <ReviewValue
                            label="Individual Gross Monthly Income"
                            value={data.individual_income_range}
                        />
                        <ReviewValue
                            label="Family Gross Monthly Income"
                            value={data.family_income_range}
                        />
                        <ReviewValue
                            label="Ethnic Affiliation"
                            value={
                                data.ethnic_affiliation === 'Other'
                                    ? data.ethnic_affiliation_other
                                    : data.ethnic_affiliation
                            }
                        />
                        <ReviewValue label="Indigenous Peoples Community Member" value={yesNo(data.is_indigenous)} />
                        <ReviewValue
                            label="Indigenous Peoples Community"
                            value={data.is_indigenous === '1' ? data.indigenous_community || 'Not specified' : 'Not applicable'}
                        />
                        <ReviewValue label="Person with Disability" value={yesNo(data.is_pwd)} />
                        <ReviewValue
                            label="Type of Disability"
                            value={data.is_pwd === '1' ? data.pwd_type || 'Not specified' : 'Not applicable'}
                        />
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={processing}
                        className="inline-flex min-h-12 items-center justify-center rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                        Back to Edit
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={processing}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#922b2b] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#691f1f] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 size={18} />
                        {processing
                            ? 'Saving...'
                            : isEditing
                              ? 'Confirm Changes'
                              : 'Confirm and Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function ReviewValue({ label, value, wide = false }) {
    return (
        <div
            className={`rounded-xl border border-gray-200 bg-gray-50 p-4 ${
                wide ? 'sm:col-span-2 lg:col-span-3' : ''
            }`}
        >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
            </p>
            <p className="mt-1 break-words font-semibold text-gray-900">
                {value === '' || value === null || value === undefined
                    ? 'Not provided'
                    : value}
            </p>
        </div>
    );
}

function ProfileSection({
    title,
    icon: Icon,
    maroon,
    children,
}) {
    return (
        <section>
            <div className="mb-5 flex items-center gap-3">
                <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{
                        backgroundColor: '#f5e6e6',
                        color: maroon,
                    }}
                >
                    <Icon size={20} />
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                    {title}
                </h3>
            </div>

            {children}
        </section>
    );
}

function ProfileGrid({ children }) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {children}
        </div>
    );
}

function ProfileValue({
    label,
    value,
    wide = false,
}) {
    return (
        <div
            className={`rounded-xl border border-gray-100 bg-gray-50 p-4 ${
                wide
                    ? 'sm:col-span-2 lg:col-span-3'
                    : ''
            }`}
        >
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {label}
            </p>
            <p className="mt-1 break-words font-semibold text-gray-900">
                {value ?? 'Not provided'}
            </p>
        </div>
    );
}

function CleanField({
    label,
    error,
    children,
    required = false,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-gray-800">
                {label}

                {required && (
                    <span className="ml-1 text-red-500">
                        *
                    </span>
                )}
            </label>

            {children}

            {error && (
                <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-red-600">
                    <AlertCircle size={15} />
                    {error}
                </p>
            )}
        </div>
    );
}

function InlineChoice({
    label,
    value,
    onChange,
    error,
    required = false,
}) {
    return (
        <div
            className={`rounded-xl border p-4 sm:p-5 ${
                error
                    ? 'border-red-200 bg-red-50/40'
                    : 'border-gray-200 bg-gray-50/60'
            }`}
        >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <p className="max-w-2xl text-sm font-semibold leading-6 text-gray-800">
                    {label}

                    {required && (
                        <span className="ml-1 text-red-500">
                            *
                        </span>
                    )}
                </p>

                <div className="grid w-full grid-cols-2 gap-2 lg:w-52">
                    <ChoiceOption
                        label="Yes"
                        selected={value === '1'}
                        onClick={() => onChange('1')}
                    />

                    <ChoiceOption
                        label="No"
                        selected={value === '0'}
                        onClick={() => onChange('0')}
                    />
                </div>
            </div>

            {error && (
                <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-600">
                    <AlertCircle size={15} />
                    {error}
                </p>
            )}
        </div>
    );
}

function ChoiceOption({
    label,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`min-h-11 rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
                selected
                    ? 'border-[#922b2b] bg-[#922b2b] text-white shadow-sm'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-[#d9b8b8] hover:bg-[#fffafa]'
            }`}
        >
            {label}
        </button>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    AlertCircle,
    BadgeCheck,
    CalendarDays,
    Check,
    ClipboardList,
    FileText,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    Menu,
    User,
    WalletCards,
    X,
} from 'lucide-react';

export default function PersonalDetails({
    profile = null,
    email = null,
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';

    const inputClass =
        'w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3.5 text-sm font-medium text-gray-900 outline-none transition placeholder:font-normal placeholder:text-gray-400 hover:border-gray-300 focus:border-[#922b2b] focus:bg-white focus:ring-4 focus:ring-[#922b2b]/10';

    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        full_name: '',
        school_graduated: '',
        employment_status: '',
        present_address: '',
        age: '',
        gender: '',
        gender_other: '',
        contact_number: '',
        religion: '',
        civil_status: '',
        individual_income: '',
        family_income: '',
        is_indigenous: '',
        indigenous_community: '',
        is_pwd: '',
        pwd_type: '',
    });

    const submit = (event) => {
        event.preventDefault();
        post('/personal-details');
    };

    const formatCurrency = (value) => {
        if (
            value === null ||
            value === undefined ||
            value === ''
        ) {
            return 'Not provided';
        }

        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(Number(value));
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
                <header
                    className="sticky top-0 z-40 flex h-16 items-center px-4 text-white shadow-md lg:hidden"
                    style={{ backgroundColor: maroon }}
                >
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 transition hover:bg-white/10"
                            aria-label="Open navigation"
                        >
                            <Menu size={23} />
                        </button>

                        <div className="flex items-center gap-2">
                            <img
                                src="/images/law-logo.jpeg"
                                alt="USeP School of Law"
                                className="h-9 w-9 rounded-full bg-white object-contain"
                            />

                            <div>
                                <p className="text-sm font-bold leading-tight">
                                    USeP School of Law
                                </p>
                                <p className="text-[11px] text-white/75">
                                    Admission Portal
                                </p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* MOBILE OVERLAY */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* SIDEBAR */}
                <aside
                    className={`
                        fixed left-0 top-0 z-50 flex h-screen w-72
                        flex-col text-white shadow-xl transition-transform
                        duration-300 lg:w-64 lg:translate-x-0
                        ${
                            sidebarOpen
                                ? 'translate-x-0'
                                : '-translate-x-full'
                        }
                    `}
                    style={{ backgroundColor: darkMaroon }}
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
                                    USeP School of Law
                                </h1>
                                <p className="mt-0.5 text-xs text-white/65">
                                    Admission Portal
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="ml-auto rounded-lg p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
                                aria-label="Close navigation"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1 px-3 py-5">
                        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                            Main Menu
                        </p>

                        {navigation.map((item) => {
                            const Icon = item.icon;
                            const active =
                                item.label ===
                                'Personal Information';

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    onClick={() =>
                                        setSidebarOpen(false)
                                    }
                                    className={`
                                        flex items-center gap-3 rounded-xl
                                        px-4 py-3 transition
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
                                    <Icon size={20} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="border-t border-white/10 p-3">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white"
                        >
                            <LogOut size={19} />
                            <span>Logout</span>
                        </Link>
                    </div>
                </aside>

                {/* MAIN CONTENT */}
                <main className="min-h-screen lg:ml-64">
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

                            {profile ? (
                                <SavedProfile
                                    profile={profile}
                                    email={email}
                                    maroon={maroon}
                                    formatCurrency={
                                        formatCurrency
                                    }
                                    yesNo={yesNo}
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
                                                    Personal Details
                                                </h2>

                                                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-gray-500">
                                                    Enter your information carefully. Fields marked
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
                                                        <option value="Unemployed">
                                                            Unemployed
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
                                                    label="Individual Income"
                                                    error={
                                                        errors.individual_income
                                                    }
                                                    required
                                                >
                                                    <div className="relative">
                                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-gray-500">
                                                            ₱
                                                        </span>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={
                                                                data.individual_income
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'individual_income',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={`${inputClass} pl-9`}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </CleanField>

                                                <p className="mt-1.5 text-xs text-gray-400">
                                                    Enter 0 if you currently have no income.
                                                </p>
                                            </div>

                                            {/* FAMILY INCOME */}
                                            <div className="md:col-span-6">
                                                <CleanField
                                                    label="Family Income"
                                                    error={
                                                        errors.family_income
                                                    }
                                                    required
                                                >
                                                    <div className="relative">
                                                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-gray-500">
                                                            ₱
                                                        </span>

                                                        <input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            value={
                                                                data.family_income
                                                            }
                                                            onChange={(e) =>
                                                                setData(
                                                                    'family_income',
                                                                    e.target.value
                                                                )
                                                            }
                                                            className={`${inputClass} pl-9`}
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </CleanField>

                                                <p className="mt-1.5 text-xs text-gray-400">
                                                    Enter the combined household or family income.
                                                </p>
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
                                                Review your information before submitting. After
                                                saving, this page will show your personal
                                                information in read-only mode.
                                            </p>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                                                style={{
                                                    backgroundColor:
                                                        maroon,
                                                }}
                                            >
                                                {processing
                                                    ? 'Saving...'
                                                    : 'Save Personal Information'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            )}

                            <div className="mt-10 border-t border-gray-200 pt-5">
                                <p className="text-center text-xs text-gray-400 sm:text-left">
                                    USeP School of Law Admission
                                    Portal • Applicant
                                </p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

function SavedProfile({
    profile,
    email,
    maroon,
    formatCurrency,
    yesNo,
}) {
    return (
        <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl border border-green-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-green-100 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                            <BadgeCheck size={25} />
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-700">
                                PROFILE COMPLETED
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-gray-900">
                                Personal Information Submitted
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-gray-600">
                                These are the personal details
                                currently saved for your
                                admission application.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-green-200 bg-white px-4 py-3 sm:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                            Applicant Number
                        </p>
                        <p className="mt-1 text-lg font-bold text-green-700">
                            {profile.applicant_number}
                        </p>
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
                                label="Individual Income"
                                value={formatCurrency(
                                    profile.individual_income
                                )}
                            />
                            <ProfileValue
                                label="Family Income"
                                value={formatCurrency(
                                    profile.family_income
                                )}
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

            <div className="rounded-2xl border border-[#ead0d0] bg-[#f9eeee] p-5">
                <p
                    className="font-semibold"
                    style={{ color: maroon }}
                >
                    Personal information is read-only
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-600">
                    If any submitted information is
                    incorrect, please contact the USeP
                    School of Law admission office.
                </p>
            </div>
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

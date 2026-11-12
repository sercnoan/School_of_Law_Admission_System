import PortalLayout from '@/layouts/portal-layout';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import {
    BookOpen,
    ChevronDown,
    ChevronUp,
    CircleAlert,
    CircleCheck,
    ClipboardList,
    ExternalLink,
    GraduationCap,
    Pencil,
    Plus,
    Save,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';

const emptyProgram = {
    name: '',
    short_name: '',
    description: '',
    qualification: '',
    prospectus_url: 'https://usep.edu.ph/sol/academic-programs-2/',
};

export default function Programs({ programs = [] }) {
    const { props } = usePage();
    const form = useForm(emptyProgram);

    const submit = (event) => {
        event.preventDefault();
        form.post('/admin/programs', {
            preserveScroll: true,
            onSuccess: () => form.setData(emptyProgram),
        });
    };

    return (
        <PortalLayout audience="admin">
            <Head title="Admission Programs" />

            <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-[#922b2b] uppercase">
                                Administration Portal
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                                Admission Programs
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Add and manage the programs applicants can
                                choose. Disabled programs remain on existing
                                records but are unavailable to new applicants.
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#922b2b]/10 text-[#922b2b]">
                            <GraduationCap size={25} />
                        </div>
                    </div>
                </section>

                {props.flash?.success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800">
                        <CircleCheck size={19} />
                        {props.flash.success}
                    </div>
                )}

                {(props.errors?.program || form.errors.program) && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        <CircleAlert size={19} />
                        {props.errors?.program || form.errors.program}
                    </div>
                )}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-gray-950">
                            Add a Program
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            The new program becomes available on the applicant
                            portal immediately.
                        </p>
                    </div>

                    <ProgramForm
                        form={form}
                        onSubmit={submit}
                        submitLabel="Add Program"
                        submitIcon={Plus}
                    />
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-950">
                                Available Programs
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Each program has its own separate admission
                                requirements list.
                            </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-200">
                            {
                                programs.filter((program) => program.is_active)
                                    .length
                            }{' '}
                            active
                        </span>
                    </div>

                    <div className="space-y-4">
                        {programs.map((program, index) => (
                            <ProgramRow
                                key={program.id}
                                program={program}
                                isFirst={index === 0}
                                isLast={index === programs.length - 1}
                            />
                        ))}
                    </div>
                </section>
            </div>
        </PortalLayout>
    );
}

function ProgramRow({ program, isFirst, isLast }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        name: program.name,
        short_name: program.short_name || '',
        description: program.description || '',
        qualification: program.qualification || '',
        prospectus_url: program.prospectus_url || '',
    });

    const save = (event) => {
        event.preventDefault();
        form.put(`/admin/programs/${program.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const move = (direction) => {
        router.post(
            `/admin/programs/${program.id}/move`,
            { direction },
            { preserveScroll: true },
        );
    };

    const toggle = () => {
        router.patch(
            `/admin/programs/${program.id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const remove = () => {
        if (
            window.confirm(
                `Delete “${program.name}”? Programs already used by an application or requirement cannot be deleted.`,
            )
        ) {
            router.delete(`/admin/programs/${program.id}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <article
            className={`overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm ${
                program.is_active ? '' : 'bg-gray-50 opacity-75'
            }`}
        >
            {editing ? (
                <form onSubmit={save} className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <h3 className="font-bold text-gray-950">
                            Edit Program
                        </h3>
                        <button
                            type="button"
                            onClick={() => {
                                form.reset();
                                form.clearErrors();
                                setEditing(false);
                            }}
                            className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50"
                            aria-label="Cancel editing"
                        >
                            <X size={18} />
                        </button>
                    </div>
                    <ProgramForm
                        form={form}
                        onSubmit={save}
                        submitLabel="Save Changes"
                        submitIcon={Save}
                        nested
                    />
                </form>
            ) : (
                <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5e6e6] text-[#922b2b]">
                                    <BookOpen size={19} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-950">
                                    {program.name}
                                </h3>
                                {program.short_name && (
                                    <span className="rounded-full bg-[#f5e6e6] px-2.5 py-1 text-xs font-bold text-[#691f1f]">
                                        {program.short_name}
                                    </span>
                                )}
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                        program.is_active
                                            ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                            : 'bg-gray-200 text-gray-600'
                                    }`}
                                >
                                    {program.is_active ? 'Active' : 'Disabled'}
                                </span>
                            </div>
                            <p className="mt-4 max-w-4xl text-sm leading-6 text-gray-600">
                                {program.description ||
                                    'No description provided.'}
                            </p>
                            <p className="mt-3 line-clamp-2 max-w-4xl text-sm leading-6 text-gray-500">
                                <span className="font-semibold text-gray-700">
                                    Qualifications:{' '}
                                </span>
                                {program.qualification || 'Not specified'}
                            </p>
                            {program.prospectus_url && (
                                <a
                                    href={program.prospectus_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-[#922b2b] hover:underline"
                                >
                                    <ExternalLink size={15} />
                                    View Prospectus
                                </a>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Link
                                href={`/admin/admission-requirements?program=${encodeURIComponent(program.name)}`}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#922b2b]/25 bg-[#922b2b]/5 px-3 py-2.5 text-sm font-semibold text-[#922b2b] hover:bg-[#922b2b]/10"
                            >
                                <ClipboardList size={16} /> Requirements
                            </Link>
                            <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => move('up')}
                                className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                                aria-label="Move program up"
                            >
                                <ChevronUp size={17} />
                            </button>
                            <button
                                type="button"
                                disabled={isLast}
                                onClick={() => move('down')}
                                className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                                aria-label="Move program down"
                            >
                                <ChevronDown size={17} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(true)}
                                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                <Pencil size={16} /> Edit
                            </button>
                            <button
                                type="button"
                                onClick={toggle}
                                className={`rounded-xl px-3 py-2.5 text-sm font-semibold ${
                                    program.is_active
                                        ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
                                        : 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                }`}
                            >
                                {program.is_active ? 'Disable' : 'Enable'}
                            </button>
                            <button
                                type="button"
                                onClick={remove}
                                className="rounded-xl border border-red-200 p-2.5 text-red-600 hover:bg-red-50"
                                aria-label="Delete program"
                            >
                                <Trash2 size={17} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </article>
    );
}

function ProgramForm({
    form,
    onSubmit,
    submitLabel,
    submitIcon: SubmitIcon,
    nested = false,
}) {
    const fields = (
        <>
            <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Program Name" error={form.errors.name}>
                    <input
                        value={form.data.name}
                        onChange={(event) =>
                            form.setData('name', event.target.value)
                        }
                        maxLength={180}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                    />
                </FormField>
                <FormField label="Short Name" error={form.errors.short_name}>
                    <input
                        value={form.data.short_name}
                        onChange={(event) =>
                            form.setData('short_name', event.target.value)
                        }
                        maxLength={60}
                        className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                    />
                </FormField>
            </div>

            <FormField label="Description" error={form.errors.description}>
                <textarea
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData('description', event.target.value)
                    }
                    rows={2}
                    maxLength={500}
                    placeholder="Short description shown on the applicant program card"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                />
            </FormField>

            <FormField
                label="Admission Qualifications"
                error={form.errors.qualification}
            >
                <textarea
                    value={form.data.qualification}
                    onChange={(event) =>
                        form.setData('qualification', event.target.value)
                    }
                    rows={4}
                    maxLength={5000}
                    placeholder="Qualifications displayed when applicants select View Qualifications"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                />
            </FormField>

            <FormField
                label="Prospectus Link"
                error={form.errors.prospectus_url}
            >
                <input
                    type="url"
                    value={form.data.prospectus_url}
                    onChange={(event) =>
                        form.setData('prospectus_url', event.target.value)
                    }
                    maxLength={500}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                />
            </FormField>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={form.processing}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#922b2b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#761f1f] disabled:opacity-60"
                >
                    <SubmitIcon size={17} />
                    {form.processing ? 'Saving...' : submitLabel}
                </button>
            </div>
        </>
    );

    return nested ? (
        <div className="space-y-4">{fields}</div>
    ) : (
        <form onSubmit={onSubmit} className="space-y-4">
            {fields}
        </form>
    );
}

function FormField({ label, error, children }) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                {label}
            </span>
            {children}
            {error && (
                <span className="mt-2 block text-sm font-medium text-red-600">
                    {error}
                </span>
            )}
        </label>
    );
}

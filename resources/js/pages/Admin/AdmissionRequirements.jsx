import PortalLayout from '@/layouts/portal-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    CircleAlert,
    CircleCheck,
    ClipboardList,
    Pencil,
    Plus,
    Save,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdmissionRequirements({
    programs = [],
    selectedProgram = '',
    requirements = [],
}) {
    const { props } = usePage();
    const form = useForm({
        program: selectedProgram,
        requirement_name: '',
        description: '',
        is_required: true,
    });

    useEffect(() => {
        form.setData('program', selectedProgram);
    }, [selectedProgram]);

    const selectProgram = (program) => {
        router.get(
            '/admin/admission-requirements',
            { program },
            { preserveState: true, replace: true },
        );
    };

    const submit = (event) => {
        event.preventDefault();
        form.post('/admin/admission-requirements', {
            preserveScroll: true,
            onSuccess: () =>
                form.setData({
                    program: selectedProgram,
                    requirement_name: '',
                    description: '',
                    is_required: true,
                }),
        });
    };

    const selectedLabel = selectedProgram;

    return (
        <PortalLayout audience="admin">
            <Head title="Admission Requirements" />

            <div className="space-y-6">
                <section className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-3xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-[#922b2b] uppercase">
                                Administration Portal
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                                Admission Requirements
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Choose a program, then add or edit the documents
                                applicants must submit. Every program has its
                                own separate requirements list.
                            </p>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#922b2b]/10 text-[#922b2b]">
                            <ClipboardList size={25} />
                        </div>
                    </div>
                </section>

                {props.flash?.success && (
                    <Notice type="success" message={props.flash.success} />
                )}
                {(props.errors?.requirement || form.errors.program) && (
                    <Notice
                        type="error"
                        message={
                            props.errors?.requirement || form.errors.program
                        }
                    />
                )}

                <section className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm sm:p-6">
                    <label className="block max-w-2xl">
                        <span className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                            Requirements for
                        </span>
                        <select
                            value={selectedProgram}
                            onChange={(event) =>
                                selectProgram(event.target.value)
                            }
                            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                        >
                            {programs.map((program) => (
                                <option key={program.id} value={program.name}>
                                    {program.name}
                                    {!program.is_active ? ' — Disabled' : ''}
                                </option>
                            ))}
                        </select>
                    </label>
                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        These documents will appear only for applicants who
                        choose {selectedProgram}.
                    </p>
                </section>

                <section className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-gray-950">
                            Add a Requirement
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Adding to: {selectedLabel}
                        </p>
                    </div>

                    <RequirementForm
                        form={form}
                        onSubmit={submit}
                        submitLabel="Add Requirement"
                        submitIcon={Plus}
                    />
                </section>

                <section>
                    <div className="mb-4 flex items-end justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-bold text-gray-950">
                                {selectedLabel}
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Reorder, edit, disable, or remove requirements.
                            </p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-300">
                            {
                                requirements.filter((item) => item.is_active)
                                    .length
                            }{' '}
                            active
                        </span>
                    </div>

                    {requirements.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">
                            No program-specific requirements yet. Use the form
                            above to add one.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {requirements.map((requirement, index) => (
                                <RequirementRow
                                    key={requirement.requirement_id}
                                    requirement={requirement}
                                    isFirst={index === 0}
                                    isLast={index === requirements.length - 1}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PortalLayout>
    );
}

function RequirementRow({ requirement, isFirst, isLast }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({
        program: requirement.program,
        requirement_name: requirement.requirement_name,
        description: requirement.description || '',
        is_required: Boolean(requirement.is_required),
    });

    const save = (event) => {
        event.preventDefault();
        form.put(
            `/admin/admission-requirements/${requirement.requirement_id}`,
            {
                preserveScroll: true,
                onSuccess: () => setEditing(false),
            },
        );
    };

    const move = (direction) => {
        router.post(
            `/admin/admission-requirements/${requirement.requirement_id}/move`,
            { direction },
            { preserveScroll: true },
        );
    };

    const toggle = () => {
        router.patch(
            `/admin/admission-requirements/${requirement.requirement_id}/toggle`,
            {},
            { preserveScroll: true },
        );
    };

    const remove = () => {
        if (
            window.confirm(
                `Delete “${requirement.requirement_name}”? Requirements with submitted files cannot be deleted.`,
            )
        ) {
            router.delete(
                `/admin/admission-requirements/${requirement.requirement_id}`,
                { preserveScroll: true },
            );
        }
    };

    return (
        <article
            className={`overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm ${
                requirement.is_active ? '' : 'bg-gray-50 opacity-75'
            }`}
        >
            {editing ? (
                <form onSubmit={save} className="p-5 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <h3 className="font-bold text-gray-950">
                            Edit Requirement
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
                    <RequirementForm
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
                                <h3 className="font-bold text-gray-950">
                                    {requirement.requirement_name}
                                </h3>
                                <Badge
                                    label={
                                        requirement.is_required
                                            ? 'Required'
                                            : 'Optional'
                                    }
                                    active={requirement.is_required}
                                />
                                <Badge
                                    label={
                                        requirement.is_active
                                            ? 'Active'
                                            : 'Disabled'
                                    }
                                    active={requirement.is_active}
                                />
                            </div>
                            <p className="mt-3 max-w-4xl text-sm leading-6 text-gray-600">
                                {requirement.description ||
                                    'No instructions provided.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                disabled={isFirst}
                                onClick={() => move('up')}
                                className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                                aria-label="Move requirement up"
                            >
                                <ChevronUp size={17} />
                            </button>
                            <button
                                type="button"
                                disabled={isLast}
                                onClick={() => move('down')}
                                className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                                aria-label="Move requirement down"
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
                                    requirement.is_active
                                        ? 'bg-amber-50 text-amber-800 ring-1 ring-amber-200'
                                        : 'bg-green-50 text-green-700 ring-1 ring-green-200'
                                }`}
                            >
                                {requirement.is_active ? 'Disable' : 'Enable'}
                            </button>
                            <button
                                type="button"
                                onClick={remove}
                                className="rounded-xl border border-red-200 p-2.5 text-red-600 hover:bg-red-50"
                                aria-label="Delete requirement"
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

function RequirementForm({
    form,
    onSubmit,
    submitLabel,
    submitIcon: SubmitIcon,
    nested = false,
}) {
    const fields = (
        <>
            <FormField
                label="Requirement Name"
                error={form.errors.requirement_name}
            >
                <input
                    value={form.data.requirement_name}
                    onChange={(event) =>
                        form.setData('requirement_name', event.target.value)
                    }
                    maxLength={150}
                    className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                />
            </FormField>

            <FormField label="Instructions" error={form.errors.description}>
                <textarea
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData('description', event.target.value)
                    }
                    rows={3}
                    maxLength={2000}
                    placeholder="Tell the applicant what document is accepted"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                />
            </FormField>

            <label className="flex items-start gap-3 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3">
                <input
                    type="checkbox"
                    checked={form.data.is_required}
                    onChange={(event) =>
                        form.setData('is_required', event.target.checked)
                    }
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#922b2b] focus:ring-[#922b2b]"
                />
                <span>
                    <span className="block text-sm font-bold text-gray-900">
                        Required before application submission
                    </span>
                    <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                        Clear this if applicants may submit without this
                        document.
                    </span>
                </span>
            </label>

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

function Notice({ type, message }) {
    const Icon = type === 'success' ? CircleCheck : CircleAlert;
    const classes =
        type === 'success'
            ? 'border-green-200 bg-green-50 text-green-800'
            : 'border-red-200 bg-red-50 text-red-700';

    return (
        <div
            className={`flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-semibold ${classes}`}
        >
            <Icon size={19} />
            {message}
        </div>
    );
}

function Badge({ label, active }) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                active
                    ? 'bg-green-50 text-green-700 ring-1 ring-green-200'
                    : 'bg-gray-100 text-gray-600 ring-1 ring-gray-200'
            }`}
        >
            {label}
        </span>
    );
}

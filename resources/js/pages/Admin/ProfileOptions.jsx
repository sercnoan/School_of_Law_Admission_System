import PortalLayout from '@/layouts/portal-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    ChevronDown,
    ChevronUp,
    CircleAlert,
    CircleCheck,
    LockKeyhole,
    Pencil,
    Plus,
    Save,
    SlidersHorizontal,
    Trash2,
    X,
} from 'lucide-react';
import { useState } from 'react';

const fieldDescriptions = {
    employment_status: 'Choices shown in the Employment Status field.',
    civil_status: 'Choices shown in the Civil Status field.',
    gender: 'Choices shown in the Gender field.',
    religion: 'Choices shown in the Religion field.',
    ethnic_affiliation: 'Choices shown in the Ethnic Affiliation field.',
    income_range: 'Shared choices for individual and family monthly income.',
};

export default function ProfileOptions({ fieldLabels, options }) {
    const { props } = usePage();
    const fields = Object.keys(fieldLabels);
    const addForm = useForm({
        field: fields[0] || '',
        value: '',
    });

    const submitNewOption = (event) => {
        event.preventDefault();
        addForm.post('/admin/form-options', {
            preserveScroll: true,
            onSuccess: () => addForm.reset('value'),
        });
    };

    return (
        <PortalLayout audience="admin">
            <Head title="Form Options" />

            <div className="space-y-6">
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <p className="text-xs font-bold tracking-[0.18em] text-[#922b2b] uppercase">
                                Administration Portal
                            </p>
                            <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
                                Personal Information Options
                            </h1>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Manage the choices applicants see in
                                personal-information dropdowns. Disabled choices
                                remain on existing records but cannot be
                                selected in new applications.
                            </p>
                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#922b2b]/10 text-[#922b2b]">
                            <SlidersHorizontal size={24} />
                        </div>
                    </div>
                </section>

                {props.flash?.success && (
                    <div className="flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-800">
                        <CircleCheck size={19} />
                        {props.flash.success}
                    </div>
                )}

                {(addForm.errors.option || props.errors?.option) && (
                    <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                        <CircleAlert size={19} />
                        {addForm.errors.option || props.errors.option}
                    </div>
                )}

                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="mb-5">
                        <h2 className="text-lg font-bold text-gray-950">
                            Add an option
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            The new option becomes available to applicants
                            immediately.
                        </p>
                    </div>

                    <form
                        onSubmit={submitNewOption}
                        className="grid gap-4 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)_auto] md:items-start"
                    >
                        <label className="block">
                            <span className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                                Field
                            </span>
                            <select
                                value={addForm.data.field}
                                onChange={(event) =>
                                    addForm.setData('field', event.target.value)
                                }
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                            >
                                {fields.map((field) => (
                                    <option key={field} value={field}>
                                        {fieldLabels[field]}
                                    </option>
                                ))}
                            </select>
                            {addForm.errors.field && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {addForm.errors.field}
                                </p>
                            )}
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-xs font-bold tracking-wide text-gray-500 uppercase">
                                Option name
                            </span>
                            <input
                                value={addForm.data.value}
                                onChange={(event) =>
                                    addForm.setData('value', event.target.value)
                                }
                                placeholder="Enter a new option"
                                maxLength={100}
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-900 outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                            />
                            {addForm.errors.value && (
                                <p className="mt-2 text-sm font-medium text-red-600">
                                    {addForm.errors.value}
                                </p>
                            )}
                        </label>

                        <button
                            type="submit"
                            disabled={addForm.processing}
                            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#922b2b] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#761f1f] disabled:cursor-not-allowed disabled:opacity-60 md:mt-7"
                        >
                            <Plus size={17} />
                            Add Option
                        </button>
                    </form>
                </section>

                <div className="grid gap-6 xl:grid-cols-2">
                    {fields.map((field) => (
                        <OptionGroup
                            key={field}
                            field={field}
                            label={fieldLabels[field]}
                            options={options[field] || []}
                        />
                    ))}
                </div>
            </div>
        </PortalLayout>
    );
}

function OptionGroup({ field, label, options }) {
    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 bg-gray-50/80 px-5 py-4 sm:px-6">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-bold text-gray-950">{label}</h2>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            {fieldDescriptions[field]}
                        </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-gray-500 shadow-sm ring-1 ring-gray-200">
                        {options.filter((option) => option.is_active).length}{' '}
                        active
                    </span>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {options.map((option, index) => (
                    <OptionRow
                        key={option.id}
                        option={option}
                        isFirst={index === 0}
                        isLast={index === options.length - 1}
                    />
                ))}
            </div>
        </section>
    );
}

function OptionRow({ option, isFirst, isLast }) {
    const [editing, setEditing] = useState(false);
    const form = useForm({ value: option.value });

    const save = (event) => {
        event.preventDefault();
        form.put(`/admin/form-options/${option.id}`, {
            preserveScroll: true,
            onSuccess: () => setEditing(false),
        });
    };

    const move = (direction) => {
        router.post(
            `/admin/form-options/${option.id}/move`,
            { direction },
            { preserveScroll: true },
        );
    };

    const remove = () => {
        if (
            !window.confirm(
                `Delete "${option.value}"? It will no longer appear as a choice for applicants. Existing applicant records will not be changed.`,
            )
        ) {
            return;
        }

        router.delete(`/admin/form-options/${option.id}`, {
            preserveScroll: true,
        });
    };

    return (
        <div
            className={`p-4 sm:px-6 ${option.is_active ? '' : 'bg-gray-50 opacity-70'}`}
        >
            {editing ? (
                <form onSubmit={save} className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            value={form.data.value}
                            onChange={(event) =>
                                form.setData('value', event.target.value)
                            }
                            maxLength={100}
                            autoFocus
                            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm font-semibold outline-none focus:border-[#922b2b] focus:ring-4 focus:ring-[#922b2b]/10"
                        />
                        <button
                            type="submit"
                            disabled={form.processing}
                            className="rounded-xl bg-[#922b2b] p-2.5 text-white disabled:opacity-60"
                            aria-label="Save option"
                        >
                            <Save size={17} />
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                form.setData('value', option.value);
                                form.clearErrors();
                                setEditing(false);
                            }}
                            className="rounded-xl border border-gray-200 p-2.5 text-gray-500 hover:bg-gray-50"
                            aria-label="Cancel editing"
                        >
                            <X size={17} />
                        </button>
                    </div>
                    {form.errors.value && (
                        <p className="text-sm font-medium text-red-600">
                            {form.errors.value}
                        </p>
                    )}
                </form>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-sm font-bold text-gray-900">
                                {option.value}
                            </p>
                            {!option.is_active && (
                                <span className="rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-bold tracking-wide text-gray-600 uppercase">
                                    Disabled
                                </span>
                            )}
                            {option.is_custom && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold tracking-wide text-amber-700 uppercase ring-1 ring-amber-200">
                                    <LockKeyhole size={10} /> Custom entry
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={() => move('up')}
                            disabled={isFirst}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-25"
                            aria-label={`Move ${option.value} up`}
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            type="button"
                            onClick={() => move('down')}
                            disabled={isLast}
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 disabled:opacity-25"
                            aria-label={`Move ${option.value} down`}
                        >
                            <ChevronDown size={16} />
                        </button>
                        {!option.is_custom && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#922b2b]"
                                    aria-label={`Edit ${option.value}`}
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={remove}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-700"
                                    aria-label={`Delete ${option.value}`}
                                    title="Delete option"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.patch(
                                            `/admin/form-options/${option.id}/toggle`,
                                            {},
                                            { preserveScroll: true },
                                        )
                                    }
                                    className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                                        option.is_active
                                            ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {option.is_active ? 'Enabled' : 'Disabled'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

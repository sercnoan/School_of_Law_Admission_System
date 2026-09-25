import PortalLayout from '@/layouts/portal-layout';
import {
    Head,
    Link,
    useForm,
} from '@inertiajs/react';

import { ArrowLeft, CalendarDays, Clock, MapPin, Users, Save, AlertCircle } from 'lucide-react';


export default function CreateExaminationSchedule() {


    const maroon = '#922b2b';
    const darkMaroon = '#691f1f';


    const {
        data,
        setData,
        post,
        processing,
        errors,
    } = useForm({
        exam_date: '',
        exam_time: '',
        venue: '',
        max_applicants: '',
        instructions: '',
        notes: '',
        status: 'Open',
    });


    /*
    |--------------------------------------------------------------------------
    | Submit Form
    |--------------------------------------------------------------------------
    */

    const handleSubmit = (event) => {

        event.preventDefault();

        post(
            '/admin/examination-schedules'
        );

    };


    return (

        <>

            <Head
                title="Create Examination Schedule"
            />


            <div className="min-h-screen bg-gray-50">


                {/* =====================================================
                    MAIN CONTENT
                ===================================================== */}

                <PortalLayout audience="admin">


                    <div
                        className="
                            mx-auto
                            max-w-4xl
                            px-4
                            py-6
                            sm:px-6
                            sm:py-8
                            lg:px-8
                            lg:py-10
                        "
                    >


                        {/* =================================================
                            BACK BUTTON
                        ================================================= */}

                        <Link
                            href="/admin/examination-schedules"
                            className="
                                mb-6
                                inline-flex
                                items-center
                                gap-2
                                text-sm
                                font-medium
                                transition
                                hover:opacity-75
                            "
                            style={{
                                color:
                                    maroon,
                            }}
                        >

                            <ArrowLeft
                                size={18}
                            />

                            Back to Examination Schedules

                        </Link>


                        {/* =================================================
                            PAGE HEADER
                        ================================================= */}

                        <div className="mb-6">


                            <p
                                className="mb-2 text-sm font-semibold"
                                style={{
                                    color:
                                        maroon,
                                }}
                            >
                                ADMINISTRATION PORTAL
                            </p>


                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                    sm:text-3xl
                                "
                            >
                                Create Examination Schedule
                            </h1>


                            <p className="mt-2 text-gray-600">
                                Create an available examination schedule for qualified applicants.
                            </p>


                        </div>


                        {/* =================================================
                            ERRORS
                        ================================================= */}

                        {Object.keys(
                            errors
                        ).length >
                            0 && (

                            <div
                                className="
                                    mb-6
                                    rounded-xl
                                    border
                                    border-red-200
                                    bg-red-50
                                    p-4
                                "
                            >

                                <div className="flex items-start gap-3">


                                    <AlertCircle
                                        size={20}
                                        className="mt-0.5 text-red-600"
                                    />


                                    <div>


                                        <p className="font-semibold text-red-800">
                                            Please correct the following errors:
                                        </p>


                                        <ul className="mt-2 list-disc pl-5 text-sm text-red-700">

                                            {Object.values(
                                                errors
                                            ).map(
                                                (
                                                    error,
                                                    index
                                                ) => (

                                                    <li
                                                        key={
                                                            index
                                                        }
                                                    >
                                                        {
                                                            error
                                                        }
                                                    </li>

                                                )
                                            )}

                                        </ul>


                                    </div>


                                </div>


                            </div>

                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                p-5
                                shadow-sm
                                sm:p-8
                            "
                        >


                            {/* DATE */}

                            <div className="mb-6">


                                <label
                                    htmlFor="exam_date"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Examination Date
                                </label>


                                <div className="relative">


                                    <CalendarDays
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    />


                                    <input
                                        id="exam_date"
                                        type="date"
                                        value={
                                            data.exam_date
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setData(
                                                'exam_date',
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                {errors.exam_date && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.exam_date
                                        }
                                    </p>

                                )}


                            </div>


                            {/* TIME */}

                            <div className="mb-6">


                                <label
                                    htmlFor="exam_time"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Examination Time
                                </label>


                                <div className="relative">


                                    <Clock
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    />


                                    <input
                                        id="exam_time"
                                        type="time"
                                        value={
                                            data.exam_time
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setData(
                                                'exam_time',
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                {errors.exam_time && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.exam_time
                                        }
                                    </p>

                                )}


                            </div>


                            {/* VENUE */}

                            <div className="mb-6">


                                <label
                                    htmlFor="venue"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Examination Venue
                                </label>


                                <div className="relative">


                                    <MapPin
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    />


                                    <input
                                        id="venue"
                                        type="text"
                                        value={
                                            data.venue
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setData(
                                                'venue',
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Example: Room 506"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            placeholder:text-gray-400
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                {errors.venue && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.venue
                                        }
                                    </p>

                                )}


                            </div>


                            {/* MAX APPLICANTS */}

                            <div className="mb-6">


                                <label
                                    htmlFor="max_applicants"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Maximum Applicants
                                </label>


                                <div className="relative">


                                    <Users
                                        size={19}
                                        className="
                                            absolute
                                            left-3
                                            top-1/2
                                            -translate-y-1/2
                                            text-gray-500
                                        "
                                    />


                                    <input
                                        id="max_applicants"
                                        type="number"
                                        min="1"
                                        value={
                                            data.max_applicants
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setData(
                                                'max_applicants',
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Example: 50"
                                        className="
                                            w-full
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            py-3
                                            pl-10
                                            pr-4
                                            text-gray-900
                                            outline-none
                                            placeholder:text-gray-400
                                            transition
                                            focus:border-[#922b2b]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/10
                                        "
                                    />


                                </div>


                                <p className="mt-1 text-xs text-gray-500">
                                    Available slots will initially equal the maximum number of applicants.
                                </p>


                                {errors.max_applicants && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.max_applicants
                                        }
                                    </p>

                                )}


                            </div>


                            {/* STATUS */}

                            <div className="mb-6">


                                <label
                                    htmlFor="status"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Schedule Status
                                </label>


                                <select
                                    id="status"
                                    value={
                                        data.status
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setData(
                                            'status',
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                >


                                    <option value="Open">
                                        Open
                                    </option>


                                    <option value="Closed">
                                        Closed
                                    </option>


                                    <option value="Completed">
                                        Completed
                                    </option>


                                </select>


                                {errors.status && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.status
                                        }
                                    </p>

                                )}


                            </div>


                            {/* INSTRUCTIONS */}

                            <div className="mb-6">


                                <label
                                    htmlFor="instructions"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Instructions
                                </label>


                                <textarea
                                    id="instructions"
                                    rows="4"
                                    value={
                                        data.instructions
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setData(
                                            'instructions',
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Enter examination instructions for applicants..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-gray-900
                                        outline-none
                                        placeholder:text-gray-400
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                />


                                {errors.instructions && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.instructions
                                        }
                                    </p>

                                )}


                            </div>


                            {/* NOTES */}

                            <div className="mb-8">


                                <label
                                    htmlFor="notes"
                                    className="mb-2 block text-sm font-semibold text-gray-800"
                                >
                                    Notes
                                </label>


                                <textarea
                                    id="notes"
                                    rows="4"
                                    value={
                                        data.notes
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setData(
                                            'notes',
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Optional notes..."
                                    className="
                                        w-full
                                        rounded-xl
                                        border
                                        border-gray-300
                                        bg-white
                                        px-4
                                        py-3
                                        text-gray-900
                                        outline-none
                                        placeholder:text-gray-400
                                        transition
                                        focus:border-[#922b2b]
                                        focus:ring-2
                                        focus:ring-[#922b2b]/10
                                    "
                                />


                                {errors.notes && (

                                    <p className="mt-2 text-sm text-red-600">
                                        {
                                            errors.notes
                                        }
                                    </p>

                                )}


                            </div>


                            {/* BUTTONS */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >


                                <Link
                                    href="/admin/examination-schedules"
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-300
                                        px-6
                                        py-3
                                        text-center
                                        font-semibold
                                        text-gray-700
                                        transition
                                        hover:bg-gray-50
                                    "
                                >
                                    Cancel
                                </Link>


                                <button
                                    type="submit"
                                    disabled={
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
                                        font-semibold
                                        text-white
                                        transition
                                        hover:opacity-90
                                        disabled:cursor-not-allowed
                                        disabled:bg-gray-400
                                    "
                                    style={
                                        !processing
                                            ? {
                                                  backgroundColor:
                                                      maroon,
                                              }
                                            : {}
                                    }
                                >

                                    <Save
                                        size={18}
                                    />

                                    {processing
                                        ? 'Creating...'
                                        : 'Create Schedule'}

                                </button>


                            </div>


                        </form>


                    </div>


                </PortalLayout>


            </div>

        </>

    );

}

import { Head, Link } from '@inertiajs/react';
import { LogIn, UserPlus, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="USeP School of Law - Admission Portal" />

            <div className="min-h-screen bg-white text-gray-900">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="w-full bg-[#922b2b] text-white shadow-md">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">

                        {/* LOGO + TITLE */}

                        <div className="flex items-center gap-3 sm:gap-4">

                            <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white sm:h-16 sm:w-16">
                                <img
                                    src="/images/law-logo.jpeg"
                                    alt="USeP School of Law"
                                    className="h-full w-full object-contain"
                                />
                            </div>

                            <div>
                                <h1 className="text-base font-semibold sm:text-xl lg:text-2xl">
                                    USeP - School of Law
                                </h1>

                                <p className="text-xs text-red-100 sm:text-sm">
                                    Admission Portal
                                </p>
                            </div>

                        </div>

                        {/* DESKTOP NAVIGATION */}

                        <div className="hidden items-center gap-3 sm:flex">

                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-lg border border-white/70 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-[#922b2b]"
                            >
                                <LogIn size={17} />
                                Log in
                            </Link>

                            <Link
                                href="/register"
                                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#922b2b] transition hover:bg-gray-100"
                            >
                                <UserPlus size={17} />
                                Create Account
                            </Link>

                        </div>

                    </div>
                </header>


                {/* =====================================================
                    HERO SECTION
                ===================================================== */}

                <main>

                    <section className="relative overflow-hidden bg-gradient-to-b from-red-50 via-white to-white">

                        <div className="mx-auto grid min-h-[calc(100vh-89px)] w-full max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:px-10 lg:py-20">

                            {/* LEFT CONTENT */}

                            <div className="text-center lg:text-left">

                                {/* BADGE */}

                                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-xs font-semibold text-[#922b2b] sm:text-sm">

                                    <ShieldCheck size={16} />

                                    Official Admission Portal

                                </div>


                                {/* TITLE */}

                                <h2 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">

                                    USeP
                                    <span className="block text-[#922b2b]">
                                        School of Law
                                    </span>

                                </h2>


                                {/* DESCRIPTION */}

                                <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg lg:mx-0">

                                    Welcome to the University of Southeastern
                                    Philippines School of Law Admission Portal.
                                    Submit your application, upload your
                                    requirements, and track your admission
                                    status in one convenient platform.

                                </p>


                                {/* BUTTONS */}

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">

                                    <Link
                                        href="/login"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#922b2b] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#7c2424] sm:h-13"
                                    >

                                        <LogIn size={18} />

                                        Log in

                                        <ArrowRight size={17} />

                                    </Link>


                                    <Link
                                        href="/register"
                                        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-[#922b2b] bg-white px-7 text-sm font-semibold text-[#922b2b] transition hover:bg-red-50 sm:h-13"
                                    >

                                        <UserPlus size={18} />

                                        Create Account

                                    </Link>

                                </div>

                            </div>


                            {/* RIGHT LOGO / VISUAL */}

                            <div className="flex justify-center lg:justify-end">

                                <div className="relative">

                                    {/* OUTER DECORATION */}

                                    <div className="absolute -inset-5 rounded-full bg-red-100 opacity-70 blur-sm sm:-inset-8" />

                                    <div className="absolute -inset-2 rounded-full border border-red-200 sm:-inset-4" />


                                    {/* LOGO */}

                                    <div className="relative flex h-64 w-64 items-center justify-center overflow-hidden rounded-full border-8 border-white bg-white shadow-xl sm:h-80 sm:w-80 lg:h-96 lg:w-96">

                                        <img
                                            src="/images/law-logo.jpeg"
                                            alt="University of Southeastern Philippines School of Law"
                                            className="h-full w-full object-contain"
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        INFORMATION SECTION
                    ================================================= */}

                    <section className="border-t border-gray-100 bg-white">

                        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-3 lg:px-10">

                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">

                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-[#922b2b]">
                                    <UserPlus size={21} />
                                </div>

                                <h3 className="font-bold text-gray-900">
                                    Create Your Account
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    Register as an applicant and provide your
                                    personal and educational information.
                                </p>

                            </div>


                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">

                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-[#922b2b]">
                                    <ShieldCheck size={21} />
                                </div>

                                <h3 className="font-bold text-gray-900">
                                    Submit Requirements
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    Upload the required documents for your
                                    selected admission program.
                                </p>

                            </div>


                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-6">

                                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-red-100 text-[#922b2b]">
                                    <ArrowRight size={21} />
                                </div>

                                <h3 className="font-bold text-gray-900">
                                    Track Your Application
                                </h3>

                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    Monitor your application status and stay
                                    updated throughout the admission process.
                                </p>

                            </div>

                        </div>

                    </section>

                </main>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <footer className="border-t border-gray-200 bg-[#922b2b] text-white">

                    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-5 py-6 text-center sm:px-8 md:flex-row md:text-left lg:px-10">

                        <div>
                            <p className="text-sm font-semibold">
                                USeP - School of Law
                            </p>

                            <p className="mt-1 text-xs text-red-100">
                                Admission Portal
                            </p>
                        </div>

                        <p className="text-xs text-red-100">
                            University of Southeastern Philippines
                        </p>

                    </div>

                </footer>

            </div>
        </>
    );
}


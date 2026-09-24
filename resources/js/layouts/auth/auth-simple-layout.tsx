import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-white">

            {/* =========================================================
                HEADER
            ========================================================= */}

            <header className="w-full bg-[#922b2b]">
                <div className="mx-auto flex w-full max-w-[1600px] items-center px-5 py-4 sm:px-8 sm:py-5 lg:px-12 lg:py-6">

                    {/* LAW LOGO */}
                    <Link
                        href={home()}
                        className="flex shrink-0 items-center"
                    >
                        <div className="flex h-16 w-16 items-center justify-center bg-white sm:h-20 sm:w-20 lg:h-28 lg:w-28">
                            <img
                                src="/images/law-logo.jpeg"
                                alt="USeP School of Law Logo"
                                className="h-full w-full object-contain p-2"
                            />
                        </div>
                    </Link>

                    {/* HEADER TITLE */}
                    <div className="ml-4 sm:ml-6 lg:ml-7">
                        <h1 className="text-xl font-medium leading-tight text-white sm:text-2xl lg:text-3xl xl:text-4xl">
                            USeP - School of Law
                        </h1>

                        <p className="mt-1 text-xl font-medium leading-tight text-white sm:text-2xl lg:text-3xl xl:text-4xl">
                            Admission Portal
                        </p>
                    </div>

                </div>
            </header>


            {/* =========================================================
                MAIN CONTENT
            ========================================================= */}

            <main className="min-h-[calc(100vh-96px)] bg-white">

                <div className="mx-auto flex w-full max-w-5xl justify-center px-5 py-12 sm:px-8 sm:py-16 lg:px-10 lg:py-20">

                    <div className="w-full max-w-[430px]">

                        {/* =================================================
                            CENTER LOGO
                        ================================================= */}

                      


                        {/* =================================================
                            PAGE TITLE
                        ================================================= */}

                        {title && (
                            <div className="mb-8 text-center">

                                <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">
                                    {title}
                                </h2>

                                {description && (
                                    <p className="mt-2 text-sm text-gray-500 sm:text-base">
                                        {description}
                                    </p>
                                )}

                            </div>
                        )}


                        {/* =================================================
                            FORM
                        ================================================= */}

                        <div className="w-full">
                            {children}
                        </div>

                    </div>

                </div>

            </main>

        </div>
    );
}
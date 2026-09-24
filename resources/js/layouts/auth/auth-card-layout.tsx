import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { home } from '@/routes';

export default function AuthCardLayout({
    children,
    title,
    description,
}: PropsWithChildren<{
    name?: string;
    title?: string;
    description?: string;
}>) {
    return (
        <div className="min-h-svh bg-white">
            {/* =====================================================
                TOP HEADER
            ===================================================== */}

            <header className="w-full bg-[#922B2B]">
                <div className="mx-auto flex min-h-[90px] w-full max-w-7xl items-center px-5 py-4 sm:px-8 lg:px-12">
                    <Link
                        href={home()}
                        className="flex items-center gap-4"
                    >
                        {/* Logo */}
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white p-1.5 sm:h-16 sm:w-16">
                            <AppLogoIcon className="h-full w-full fill-current text-[#922B2B]" />
                        </div>

                        {/* School Name */}
                        <div className="leading-tight text-white">
                            <p className="text-base font-medium sm:text-lg md:text-xl">
                                USeP - School of Law
                            </p>

                            <p className="text-base font-medium sm:text-lg md:text-xl">
                                Admission Portal
                            </p>
                        </div>
                    </Link>
                </div>
            </header>

            {/* =====================================================
                MAIN CONTENT
            ===================================================== */}

            <main className="flex min-h-[calc(100svh-90px)] w-full items-start justify-center px-4 py-10 sm:px-6 sm:py-14 md:items-center md:py-16 lg:px-8">
                <div className="w-full max-w-md sm:max-w-lg">
                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <div className="mb-6 flex justify-center sm:mb-8">
                        <Link
                            href={home()}
                            aria-label="Go to homepage"
                            className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20"
                        >
                            <AppLogoIcon className="h-full w-full fill-current text-[#922B2B]" />
                        </Link>
                    </div>

                    {/* =================================================
                        AUTH CARD
                    ================================================= */}

                    <Card className="w-full rounded-2xl border border-gray-200 bg-white shadow-lg">
                        <CardHeader className="space-y-2 px-5 pt-7 text-center sm:px-8 sm:pt-9">
                            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                {title}
                            </CardTitle>

                            {description && (
                                <CardDescription className="mx-auto max-w-sm text-sm leading-6 text-gray-500 sm:text-base">
                                    {description}
                                </CardDescription>
                            )}
                        </CardHeader>

                        <CardContent className="px-5 pb-7 pt-5 sm:px-8 sm:pb-9 sm:pt-6">
                            {children}
                        </CardContent>
                    </Card>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <p className="mt-6 text-center text-xs text-gray-400 sm:mt-8 sm:text-sm">
                        University of Southeastern Philippines
                    </p>
                </div>
            </main>
        </div>
    );
}
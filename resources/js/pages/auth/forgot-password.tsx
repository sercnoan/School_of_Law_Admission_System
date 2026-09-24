import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, LogIn, UserPlus } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { email } from '@/routes/password';

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <>
            <Head title="Forgot password" />

            <div className="min-h-screen bg-white text-gray-900">
                <header className="w-full bg-[#922b2b] text-white shadow-md">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
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

                <main className="flex min-h-[calc(100vh-104px)] w-full items-center justify-center px-5 py-10 sm:px-8 sm:py-14">
                    <div className="w-full max-w-md">
                        <div className="mb-5 flex items-center justify-center">
                            <img
                                src="/images/law-logo.jpeg"
                                alt="University of Southeastern Philippines"
                                className="h-20 w-20 object-contain"
                            />
                        </div>

                        <div className="mb-8 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                                Forgot password
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 sm:text-base">
                                Enter your email to receive a password reset link.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-5 rounded-xl bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        <Form {...email.form()}>
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium text-gray-900 sm:text-base"
                                        >
                                            Email address
                                        </Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="off"
                                            autoFocus
                                            placeholder="email@example.com"
                                            className="h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-base text-gray-900 shadow-none placeholder:text-gray-400 focus:border-[#922b2b] focus:ring-2 focus:ring-[#922b2b]/20 sm:h-14"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="my-6 flex items-center justify-start">
                                        <Button
                                            className="h-12 w-full rounded-xl bg-[#922b2b] text-sm font-semibold text-white hover:bg-[#7c2424] sm:h-14 sm:text-base"
                                            disabled={processing}
                                            data-test="email-password-reset-link-button"
                                        >
                                            {processing && (
                                                <LoaderCircle className="h-4 w-4 animate-spin" />
                                            )}
                                            Email password reset link
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>

                        <div className="space-x-1 text-center text-sm text-gray-500 sm:text-base">
                            <span>Or, return to</span>
                            <TextLink
                                href={login()}
                                className="font-semibold text-[#922b2b] hover:underline"
                            >
                                log in
                            </TextLink>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

ForgotPassword.layout = {
    title: 'Forgot password',
    description: 'Enter your email to receive a password reset link',
};

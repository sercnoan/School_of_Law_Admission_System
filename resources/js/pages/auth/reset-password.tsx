import { Form, Head, Link } from '@inertiajs/react';
import { LogIn, UserPlus } from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { update } from '@/routes/password';

type Props = {
    token: string;
    email: string;
    passwordRules: string;
};

export default function ResetPassword({ token, email, passwordRules }: Props) {
    return (
        <>
            <Head title="Reset password" />

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
                                Reset password
                            </h1>

                            <p className="mt-2 text-sm text-gray-500 sm:text-base">
                                Please enter your new password below.
                            </p>
                        </div>

                        <Form
                            {...update.form()}
                            transform={(data) => ({ ...data, token, email })}
                            resetOnSuccess={['password', 'password_confirmation']}
                        >
                            {({ processing, errors }) => (
                                <div className="grid gap-6">
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="email"
                                            className="text-sm font-medium text-gray-900 sm:text-base"
                                        >
                                            Email
                                        </Label>

                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            value={email}
                                            className="h-12 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 text-base text-gray-700 shadow-none sm:h-14"
                                            readOnly
                                        />

                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-sm font-medium text-gray-900 sm:text-base"
                                        >
                                            Password
                                        </Label>

                                        <div className="w-full [&_input]:h-12 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-300 [&_input]:bg-white [&_input]:px-4 [&_input]:text-base [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400 [&_input]:shadow-none [&_input]:focus:border-[#922b2b] [&_input]:focus:ring-2 [&_input]:focus:ring-[#922b2b]/20 sm:[&_input]:h-14">
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                autoComplete="new-password"
                                                autoFocus
                                                placeholder="Password"
                                                passwordrules={passwordRules}
                                            />
                                        </div>

                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password_confirmation"
                                            className="text-sm font-medium text-gray-900 sm:text-base"
                                        >
                                            Confirm password
                                        </Label>

                                        <div className="w-full [&_input]:h-12 [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-gray-300 [&_input]:bg-white [&_input]:px-4 [&_input]:text-base [&_input]:text-gray-900 [&_input]:placeholder:text-gray-400 [&_input]:shadow-none [&_input]:focus:border-[#922b2b] [&_input]:focus:ring-2 [&_input]:focus:ring-[#922b2b]/20 sm:[&_input]:h-14">
                                            <PasswordInput
                                                id="password_confirmation"
                                                name="password_confirmation"
                                                autoComplete="new-password"
                                                placeholder="Confirm password"
                                                passwordrules={passwordRules}
                                            />
                                        </div>

                                        <InputError
                                            message={errors.password_confirmation}
                                            className="mt-2"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="mt-2 h-12 w-full rounded-xl bg-[#922b2b] text-sm font-semibold text-white hover:bg-[#7c2424] sm:h-14 sm:text-base"
                                        disabled={processing}
                                        data-test="reset-password-button"
                                    >
                                        {processing && <Spinner />}
                                        Reset password
                                    </Button>
                                </div>
                            )}
                        </Form>
                    </div>
                </main>
            </div>
        </>
    );
}

ResetPassword.layout = {
    title: 'Reset password',
    description: 'Please enter your new password below',
};

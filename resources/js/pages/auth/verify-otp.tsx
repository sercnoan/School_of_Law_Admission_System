import { Head, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle, LogOut, MailCheck } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    email: string;
    status?: string;
    retryAfter?: number;
};

export default function VerifyOtp({ email, status, retryAfter = 0 }: Props) {
    const form = useForm({ otp: '' });
    const { errors } = usePage().props;
    const [countdown, setCountdown] = useState(retryAfter);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        setCountdown(retryAfter);
    }, [retryAfter]);

    useEffect(() => {
        if (countdown <= 0) return;

        const timer = window.setTimeout(
            () => setCountdown((seconds) => Math.max(0, seconds - 1)),
            1000,
        );

        return () => window.clearTimeout(timer);
    }, [countdown]);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        form.post('/email/otp/verify', {
            preserveScroll: true,
            onError: () => form.setData('otp', ''),
        });
    };

    const resend = () => {
        if (countdown > 0 || resending) return;

        router.post(
            '/email/otp/resend',
            {},
            {
                preserveScroll: true,
                onStart: () => setResending(true),
                onFinish: () => setResending(false),
            },
        );
    };

    return (
        <>
            <Head title="Verify Your Email" />

            <div className="min-h-screen bg-gray-50">
                <header className="w-full bg-[#922b2b] text-white shadow-md">
                    <div className="mx-auto flex w-full max-w-7xl items-center gap-4 px-5 py-4 sm:px-8 sm:py-5 lg:px-10">
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
                </header>

                <main className="flex min-h-[calc(100vh-104px)] items-center justify-center px-5 py-10">
                    <section className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#922b2b]/10 text-[#922b2b]">
                            <MailCheck size={27} />
                        </div>

                        <div className="mt-5 text-center">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                                Verify your email
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Enter the six-digit code sent to{' '}
                                <span className="font-semibold text-gray-700">
                                    {email}
                                </span>
                                . The code expires in 10 minutes.
                            </p>
                        </div>

                        {status && (
                            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-center text-sm font-medium text-green-700">
                                {status}
                            </div>
                        )}

                        {errors.resend && (
                            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-700">
                                {errors.resend}
                            </div>
                        )}

                        <form onSubmit={submit} className="mt-6 space-y-5">
                            <div>
                                <Label
                                    htmlFor="otp"
                                    className="mb-2 block text-sm font-semibold text-gray-900"
                                >
                                    Verification code
                                </Label>
                                <Input
                                    id="otp"
                                    type="text"
                                    value={form.data.otp}
                                    onChange={(event) =>
                                        form.setData(
                                            'otp',
                                            event.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 6),
                                        )
                                    }
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    autoFocus
                                    maxLength={6}
                                    placeholder="000000"
                                    spellCheck={false}
                                    dir="ltr"
                                    className="h-16 w-full rounded-xl border-2 border-gray-300 bg-white px-6 text-center font-mono text-2xl font-bold tracking-[0.4em] text-gray-950 caret-[#922b2b] shadow-inner placeholder:text-gray-300 focus-visible:border-[#922b2b] focus-visible:ring-4 focus-visible:ring-[#922b2b]/15"
                                    style={{
                                        WebkitTextFillColor: '#111827',
                                        opacity: 1,
                                    }}
                                />
                                <InputError
                                    message={form.errors.otp}
                                    className="mt-2"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={
                                    form.processing ||
                                    form.data.otp.length !== 6
                                }
                                className="h-12 w-full rounded-xl bg-[#922b2b] font-semibold text-white hover:bg-[#761f1f]"
                            >
                                {form.processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                Verify Email
                            </Button>
                        </form>

                        <div className="mt-5 text-center text-sm text-gray-500">
                            Didn&apos;t receive the code?{' '}
                            <button
                                type="button"
                                onClick={resend}
                                disabled={countdown > 0 || resending}
                                className="font-semibold text-[#922b2b] hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                            >
                                {resending
                                    ? 'Sending...'
                                    : countdown > 0
                                      ? `Resend in ${countdown}s`
                                      : 'Resend code'}
                            </button>
                        </div>

                        <button
                            type="button"
                            onClick={() => router.post('/logout')}
                            className="mx-auto mt-6 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-800"
                        >
                            <LogOut size={16} /> Log out
                        </button>
                    </section>
                </main>
            </div>
        </>
    );
}

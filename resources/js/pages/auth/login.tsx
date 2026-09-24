import { Form, Head, Link } from '@inertiajs/react';
import { LogIn, UserPlus } from 'lucide-react';

import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({
    status,
    canResetPassword,
}: Props) {
    return (
        <>
            <Head title="Log in" />

            <PasskeyVerify />

            <div className="min-h-screen bg-white">

                {/* =====================================================
                    HEADER
                ===================================================== */}

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

                {/* =====================================================
                    MAIN LOGIN AREA
                ===================================================== */}


                <main
                    className="
                        flex
                        min-h-[calc(100vh-112px)]
                        w-full
                        items-start
                        justify-center
                        px-5
                        py-10
                        sm:px-8
                        sm:py-14
                        md:items-center
                        md:px-10
                        md:py-16
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                        "
                    >

                        {/* =================================================
                            TITLE
                        ================================================= */}


                    <div className="mb-5 flex items-center justify-center">

                        <img
                            src="/images/law-logo.jpeg"
                            alt="University of Southeastern Philippines"
                            className="h-20 w-20 object-contain"
                        />

                    </div>

                        <div className="mb-8 text-center sm:mb-10">

                            <h2
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-gray-900
                                    sm:text-3xl
                                "
                            >
                                Log in
                            </h2>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-gray-500
                                    sm:text-base
                                "
                            >
                                Enter your account credentials to continue.
                            </p>

                        </div>


                        {/* =================================================
                            LOGIN FORM
                        ================================================= */}

                        <Form
                            {...store.form()}
                            resetOnSuccess={['password']}
                            className="w-full"
                        >
                            {({
                                processing,
                                errors,
                            }) => (

                                <div className="flex flex-col gap-5 sm:gap-6">

                                    {/* =================================================
                                        EMAIL
                                    ================================================= */}

                                    <div className="grid gap-2">

                                        <Label
                                            htmlFor="email"
                                            className="
                                                text-sm
                                                font-medium
                                                text-gray-900
                                                sm:text-base
                                            "
                                        >
                                            Email address
                                        </Label>


                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            required
                                            autoFocus
                                            tabIndex={1}
                                            autoComplete="email"
                                            placeholder="Email address"
                                            className="
                                                h-12
                                                w-full
                                                rounded-xl
                                                border
                                                border-gray-300
                                                bg-white
                                                px-4
                                                text-base
                                                text-gray-900
                                                placeholder:text-gray-400
                                                shadow-none
                                                outline-none
                                                focus:border-[#922b2b]
                                                focus:ring-2
                                                focus:ring-[#922b2b]/20
                                                sm:h-14
                                            "
                                        />


                                        <InputError
                                            message={errors.email}
                                        />

                                    </div>


                                    {/* =================================================
                                        PASSWORD
                                    ================================================= */}

                                    <div className="grid gap-2">

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-3
                                            "
                                        >

                                            <Label
                                                htmlFor="password"
                                                className="
                                                    text-sm
                                                    font-medium
                                                    text-gray-900
                                                    sm:text-base
                                                "
                                            >
                                                Password
                                            </Label>


                                            {canResetPassword && (

                                                <TextLink
                                                    href={request()}
                                                    tabIndex={5}
                                                    className="
                                                        text-xs
                                                        font-medium
                                                        text-[#922b2b]
                                                        hover:underline
                                                        sm:text-sm
                                                    "
                                                >
                                                    Forgot password?
                                                </TextLink>

                                            )}

                                        </div>


                                        {/* 
                                            The [&_input] selectors force
                                            the styles onto the actual
                                            input inside PasswordInput.
                                        */}

                                        <div
                                            className="
                                                w-full
                                                [&_input]:h-12
                                                [&_input]:w-full
                                                [&_input]:rounded-xl
                                                [&_input]:border
                                                [&_input]:border-gray-300
                                                [&_input]:bg-white
                                                [&_input]:px-4
                                                [&_input]:text-base
                                                [&_input]:text-gray-900
                                                [&_input]:placeholder:text-gray-400
                                                [&_input]:shadow-none
                                                [&_input]:outline-none
                                                [&_input]:focus:border-[#922b2b]
                                                [&_input]:focus:ring-2
                                                [&_input]:focus:ring-[#922b2b]/20
                                                sm:[&_input]:h-14
                                            "
                                        >

                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="
                                                    text-gray-900
                                                    placeholder:text-gray-400
                                                "
                                            />

                                        </div>


                                        <InputError
                                            message={errors.password}
                                        />

                                    </div>


                                    {/* =================================================
                                        REMEMBER ME
                                    ================================================= */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-3
                                        "
                                    >

                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                        />

                                        <Label
                                            htmlFor="remember"
                                            className="
                                                cursor-pointer
                                                text-sm
                                                font-normal
                                                text-gray-600
                                            "
                                        >
                                            Remember me
                                        </Label>

                                    </div>


                                    {/* =================================================
                                        LOGIN BUTTON
                                    ================================================= */}

                                    <Button
                                        type="submit"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                        className="
                                            mt-1
                                            h-12
                                            w-full
                                            rounded-xl
                                            bg-[#922b2b]
                                            text-sm
                                            font-semibold
                                            text-white
                                            shadow-none
                                            transition
                                            hover:bg-[#7c2424]
                                            focus:ring-2
                                            focus:ring-[#922b2b]/30
                                            disabled:cursor-not-allowed
                                            disabled:opacity-70
                                            sm:h-14
                                            sm:text-base
                                        "
                                    >

                                        {processing && (
                                            <Spinner />
                                        )}

                                        {processing
                                            ? 'Logging in...'
                                            : 'Log in'
                                        }

                                    </Button>

                                </div>

                            )}
                        </Form>


                        {/* =================================================
                            REGISTER LINK
                        ================================================= */}

                        <div
                            className="
                                mt-6
                                text-center
                                text-sm
                                text-gray-500
                                sm:mt-8
                                sm:text-base
                            "
                        >

                            Don't have an account?{' '}

                            <TextLink
                                href={register()}
                                tabIndex={6}
                                className="
                                    font-semibold
                                    text-[#922b2b]
                                    hover:underline
                                "
                            >
                                Sign up
                            </TextLink>

                        </div>


                        {/* =================================================
                            STATUS MESSAGE
                        ================================================= */}

                        {status && (

                            <div
                                className="
                                    mt-4
                                    rounded-lg
                                    bg-green-50
                                    px-4
                                    py-3
                                    text-center
                                    text-sm
                                    font-medium
                                    text-green-700
                                "
                            >
                                {status}
                            </div>

                        )}

                    </div>

                </main>

            </div>
        </>
    );
}


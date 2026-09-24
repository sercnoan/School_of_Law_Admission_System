import { Form, Head, Link } from '@inertiajs/react';
import { LogIn, UserPlus } from 'lucide-react';

import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

import { login } from '@/routes';
import { store } from '@/routes/register';


type Props = {
    passwordRules: string;
};


export default function Register({
    passwordRules,
}: Props) {

    return (
        <>
            <Head title="Create an Account" />


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
                    REGISTER CONTENT
                ===================================================== */}

                <div className="mx-auto flex min-h-[calc(100vh-160px)] w-full max-w-xl flex-col items-center justify-center px-6 py-10">

                    {/* =================================================
                        LOGO
                    ================================================= */}

                    <div className="mb-5 flex items-center justify-center">

                        <img
                            src="/images/law-logo.jpeg"
                            alt="University of Southeastern Philippines"
                            className="h-20 w-20 object-contain"
                        />

                    </div>


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-black">
                        Create an account
                    </h1>


                    <p className="mb-8 text-center text-sm text-gray-500">
                        Register for the USeP School of Law Admission Portal
                    </p>


                    {/* =================================================
                        REGISTER FORM
                    ================================================= */}

                    <Form
                        {...store.form()}
                        resetOnSuccess={[
                            'password',
                            'password_confirmation',
                        ]}
                        disableWhileProcessing
                        className="w-full max-w-md"
                    >

                        {({
                            processing,
                            errors,
                        }) => (

                            <div className="flex flex-col gap-5">

                                {/* =================================================
                                    NAME
                                ================================================= */}

                                <div className="grid gap-2">

                                    <Label
                                        htmlFor="name"
                                        className="text-base font-normal text-black"
                                    >
                                        Full name
                                    </Label>


                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className="
                                            h-14
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            px-4
                                            text-base
                                            text-black
                                            shadow-none
                                            placeholder:text-gray-400
                                            focus:border-[#8F2D2D]
                                            focus:ring-[#8F2D2D]
                                        "
                                    />


                                    <InputError
                                        message={errors.name}
                                        className="mt-1"
                                    />

                                </div>


                                {/* =================================================
                                    EMAIL
                                ================================================= */}

                                <div className="grid gap-2">

                                    <Label
                                        htmlFor="email"
                                        className="text-base font-normal text-black"
                                    >
                                        Email address
                                    </Label>


                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="
                                            h-14
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            px-4
                                            text-base
                                            text-black
                                            shadow-none
                                            placeholder:text-gray-400
                                            focus:border-[#8F2D2D]
                                            focus:ring-[#8F2D2D]
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

                                    <Label
                                        htmlFor="password"
                                        className="text-base font-normal text-black"
                                    >
                                        Password
                                    </Label>


                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Create a password"
                                        passwordrules={passwordRules}
                                        className="
                                            h-14
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            px-4
                                            text-base
                                            text-black
                                            shadow-none
                                            placeholder:text-gray-400
                                            focus:border-[#8F2D2D]
                                            focus:ring-[#8F2D2D]
                                        "
                                    />


                                    <InputError
                                        message={errors.password}
                                    />

                                </div>


                                {/* =================================================
                                    CONFIRM PASSWORD
                                ================================================= */}

                                <div className="grid gap-2">

                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-base font-normal text-black"
                                    >
                                        Confirm password
                                    </Label>


                                    <PasswordInput
                                        id="password_confirmation"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm your password"
                                        passwordrules={passwordRules}
                                        className="
                                            h-14
                                            rounded-xl
                                            border
                                            border-gray-300
                                            bg-white
                                            px-4
                                            text-base
                                            text-black
                                            shadow-none
                                            placeholder:text-gray-400
                                            focus:border-[#8F2D2D]
                                            focus:ring-[#8F2D2D]
                                        "
                                    />


                                    <InputError
                                        message={
                                            errors.password_confirmation
                                        }
                                    />

                                </div>


                                {/* =================================================
                                    CREATE ACCOUNT BUTTON
                                ================================================= */}

                                <Button
                                    type="submit"
                                    tabIndex={5}
                                    disabled={processing}
                                    data-test="register-user-button"
                                    className="
                                        mt-2
                                        h-14
                                        w-full
                                        rounded-xl
                                        bg-[#8F2D2D]
                                        text-base
                                        font-semibold
                                        text-white
                                        shadow-none
                                        hover:bg-[#7C2626]
                                    "
                                >

                                    {processing && (
                                        <Spinner />
                                    )}


                                    {processing
                                        ? 'Creating account...'
                                        : 'Create account'
                                    }

                                </Button>

                            </div>

                        )}

                    </Form>


                    {/* =================================================
                        LOGIN LINK
                    ================================================= */}

                    <div className="mt-8 text-center text-base text-gray-500">

                        Already have an account?{' '}

                        <TextLink
                            href={login()}
                            tabIndex={6}
                            className="font-semibold text-black hover:underline"
                        >
                            Log in
                        </TextLink>

                    </div>

                </div>

            </div>
        </>
    );
}
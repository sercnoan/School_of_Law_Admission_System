<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmailOtpIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && $request->user()->email_verified_at === null) {
            return redirect()->route('otp.verification.notice');
        }

        return $next($request);
    }
}

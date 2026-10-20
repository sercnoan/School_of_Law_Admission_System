<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InterviewerMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user() || $request->user()->role !== 'interviewer') {
            abort(403, 'Unauthorized access.');
        }

        return $next($request);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureStaff
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()?->account_type !== 'staff') {
            return response()->json([
                'message' => 'Unauthorized. Staff access only.',
            ]);
        }

        return $next($request);
    }
}

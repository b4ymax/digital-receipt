<?php

declare(strict_types=1);

namespace App\Http\Responses\Fortify;

use App\Actions\Receipt\ClaimReceipt;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Laravel\Fortify\Fortify;
use Symfony\Component\HttpFoundation\Response;

final class RegisterResponse implements RegisterResponseContract
{
    public function toResponse($request): Response
    {
        if ($request instanceof Request) {
            $receiptId = $request->session()->pull('pending_receipt_id');

            if ($receiptId !== null && $request->user()) {
                app(ClaimReceipt::class)->handle(
                    $request->user(),
                    (int) $receiptId,
                );
            }

            if ($request->wantsJson()) {
                return new JsonResponse('', 201);
            }
        }

        return redirect()->intended(Fortify::redirects('register'));
    }
}

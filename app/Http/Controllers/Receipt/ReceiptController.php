<?php

declare(strict_types=1);

namespace App\Http\Controllers\Receipt;

use App\Actions\Receipt\ClaimReceipt;
use App\Http\Controllers\Controller;
use App\Models\Receipt;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

final class ReceiptController extends Controller
{
    public function show(Request $request, Receipt $receipt, ClaimReceipt $claimReceipt): Response
    {
        if ($request->user() !== null) {
            $claimed = $claimReceipt->handle(
                $request->user(),
                $receipt->id,
            );

            if ($claimed) {
                $request->session()->forget('pending_receipt_id');
            }
        } else {
            $request->session()->put(
                'pending_receipt_id',
                $receipt->id,
            );
        }

        $receipt->load('items');

        return Inertia::render('receipts/show', [
            'receipt' => $receipt,
        ]);
    }
}

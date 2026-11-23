<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actions\Receipt\CreateReceipt;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StorePosReceiptRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\URL;

final class PosReceiptController extends Controller
{
    public function store(StorePosReceiptRequest $request): JsonResponse
    {
        $receipt = CreateReceipt::run($request->validated());

        $receiptUrl = URL::temporarySignedRoute(
            'receipts.show',
            now()->addMinutes(5),
            ['receipt' => $receipt->id],
        );

        return response()->json([
            'message' => 'Receipt created successfully.',
            'data' => [
                'id' => $receipt->id,
                'receipt_number' => $receipt->receipt_number,
                'delivery_method' => $receipt->delivery_method,
                'subtotal' => $receipt->subtotal,
                'tax' => $receipt->tax,
                'total' => $receipt->total,
                'purchased_at' => $receipt->purchased_at,
                'items' => $receipt->items,
                'receipt_url' => $receiptUrl,
            ],
        ], 201);
    }
}

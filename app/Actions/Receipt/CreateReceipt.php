<?php

declare(strict_types=1);

namespace App\Actions\Receipt;

use App\Models\Receipt;
use App\Models\ReceiptItem;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

final class CreateReceipt
{
    use AsAction;

    /**
     * @param array<string, mixed> $data
     */
    public function handle(array $data): Receipt
    {
        return DB::transaction(function () use ($data): Receipt {
            $receipt = new Receipt();

            $receipt->forceFill([
                'receipt_number' => $data['receipt_number'],
                'delivery_method' => $data['delivery_method'],
                'subtotal' => $data['subtotal'],
                'tax' => $data['tax'] ?? 0,
                'total' => $data['total'],
                'purchased_at' => $data['purchased_at'],
            ]);

            $receipt->save();

            foreach ($data['items'] as $itemData) {
                $item = new ReceiptItem();

                $item->forceFill([
                    'product_name' => $itemData['product_name'],
                    'quantity' => $itemData['quantity'],
                    'unit_price' => $itemData['unit_price'],
                    'subtotal' => $itemData['subtotal'],
                ]);

                $receipt->items()->save($item);
            }

            return $receipt->load('items');
        });
    }
}

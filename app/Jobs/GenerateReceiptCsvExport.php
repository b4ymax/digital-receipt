<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Receipt;
use App\Models\ReceiptExport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Throwable;

final class GenerateReceiptCsvExport implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly int $exportId,
    ) {}

    public function handle(): void
    {
        $export = ReceiptExport::query()->findOrFail($this->exportId);

        $export->update([
            'status' => 'processing',
        ]);

        $receipts = Receipt::query()
            ->where('user_id', $export->user_id)
            ->whereIn('id', $export->receipt_ids)
            ->with('items')
            ->orderBy('purchased_at')
            ->get();

        $stream = fopen('php://temp', 'r+');

        if ($stream === false) {
            throw new \RuntimeException('Unable to create CSV stream.');
        }

        fputcsv($stream, [
            'Receipt Number',
            'Purchase Date',
            'Product Name',
            'Quantity',
            'Unit Price',
            'Item Subtotal',
            'Receipt Subtotal',
            'Tax',
            'Receipt Total',
        ]);

        foreach ($receipts as $receipt) {
            foreach ($receipt->items as $item) {
                fputcsv($stream, [
                    $receipt->receipt_number,
                    $receipt->purchased_at,
                    $item->product_name,
                    $item->quantity,
                    $item->unit_price,
                    $item->subtotal,
                    $receipt->subtotal,
                    $receipt->tax,
                    $receipt->total,
                ]);
            }
        }

        rewind($stream);

        $csv = stream_get_contents($stream);

        fclose($stream);

        if ($csv === false) {
            throw new \RuntimeException('Unable to read CSV content.');
        }

        $filePath = "exports/receipt-export-{$export->id}.csv";

        Storage::disk('local')->put($filePath, $csv);

        $export->update([
            'status' => 'completed',
            'file_path' => $filePath,
        ]);
    }

    public function failed(?Throwable $exception): void
    {
        ReceiptExport::query()
            ->whereKey($this->exportId)
            ->update([
                'status' => 'failed',
                'error_message' => $exception?->getMessage(),
            ]);
    }
}

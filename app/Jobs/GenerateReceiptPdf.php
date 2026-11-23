<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\ReceiptPdf;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Spatie\LaravelPdf\Facades\Pdf;
use Throwable;

final class GenerateReceiptPdf implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly int $receiptPdfId,
    ) {}

    public function handle(): void
    {
        $receiptPdf = ReceiptPdf::query()
            ->with('receipt.items')
            ->findOrFail($this->receiptPdfId);

        $receiptPdf->update([
            'status' => 'processing',
            'error_message' => null,
        ]);

        $receipt = $receiptPdf->receipt;

        $filePath = "receipt-pdfs/receipt-{$receipt->id}-{$receiptPdf->id}.pdf";

        Storage::disk('local')->makeDirectory('receipt-pdfs');

        Pdf::view('pdf.receipt', [
            'receipt' => $receipt,
        ])
            ->format('a4')
            ->save(Storage::disk('local')->path($filePath));

        $receiptPdf->update([
            'status' => 'completed',
            'file_path' => $filePath,
        ]);
    }

    public function failed(Throwable $exception): void
    {
        ReceiptPdf::query()
            ->whereKey($this->receiptPdfId)
            ->update([
                'status' => 'failed',
                'error_message' => $exception->getMessage(),
            ]);
    }
}

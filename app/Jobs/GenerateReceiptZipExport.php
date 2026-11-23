<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Receipt;
use App\Models\ReceiptZipExport;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Spatie\LaravelPdf\Facades\Pdf;
use Throwable;
use ZipStream\ZipStream;

final class GenerateReceiptZipExport implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public function __construct(
        public readonly int $receiptZipExportId,
    ) {}

    public function handle(): void
    {
        $export = ReceiptZipExport::query()
            ->findOrFail($this->receiptZipExportId);

        $export->update([
            'status' => 'processing',
            'error_message' => null,
        ]);

        $receipts = Receipt::query()
            ->where('user_id', $export->user_id)
            ->whereIn('id', $export->receipt_ids)
            ->with('items')
            ->get();

        if ($receipts->count() !== count($export->receipt_ids)) {
            throw new RuntimeException(
                'Some selected receipts could not be found.',
            );
        }

        $tempDirectory = "receipt-zip-temp/{$export->id}";
        $zipPath = "exports/receipt-zip-export-{$export->id}.zip";

        $storage = Storage::disk('local');

        $storage->makeDirectory($tempDirectory);
        $storage->makeDirectory('exports');

        $zipFile = fopen($storage->path($zipPath), 'wb');

        if ($zipFile === false) {
            throw new RuntimeException('Unable to create ZIP file.');
        }

        try {
            $zip = new ZipStream(
                outputStream: $zipFile,
                sendHttpHeaders: false,
                outputName: basename($zipPath),
            );

            foreach ($receipts as $receipt) {
                $pdfPath = "{$tempDirectory}/receipt-{$receipt->id}.pdf";

                Pdf::view('pdf.receipt', [
                    'receipt' => $receipt,
                ])
                    ->format('a4')
                    ->save($storage->path($pdfPath));

                $zip->addFileFromPath(
                    fileName: "{$receipt->receipt_number}.pdf",
                    path: $storage->path($pdfPath),
                );
            }

            $zip->finish();
        } finally {
            fclose($zipFile);
            $storage->deleteDirectory($tempDirectory);
        }

        $export->update([
            'status' => 'completed',
            'file_path' => $zipPath,
        ]);
    }

    public function failed(Throwable $exception): void
    {
        $export = ReceiptZipExport::query()
            ->find($this->receiptZipExportId);

        if ($export === null) {
            return;
        }

        Storage::disk('local')->delete(
            "exports/receipt-zip-export-{$export->id}.zip",
        );

        Storage::disk('local')->deleteDirectory(
            "receipt-zip-temp/{$export->id}",
        );

        $export->update([
            'status' => 'failed',
            'error_message' => $exception->getMessage(),
        ]);
    }
}

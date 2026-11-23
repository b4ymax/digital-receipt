<?php

declare(strict_types=1);

namespace App\Http\Controllers\Receipt;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateReceiptPdf;
use App\Models\Receipt;
use App\Models\ReceiptPdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ReceiptPdfController extends Controller
{
    public function store(Request $request, Receipt $receipt): JsonResponse
    {
        abort_unless(
            (int) $receipt->user_id === (int) $request->user()->id,
            404,
        );

        $receiptPdf = ReceiptPdf::query()->create([
            'user_id' => $request->user()->id,
            'receipt_id' => $receipt->id,
            'status' => 'pending',
        ]);

        GenerateReceiptPdf::dispatch($receiptPdf->id);

        return response()->json([
            'message' => 'Receipt PDF generation has been queued successfully.',
            'data' => [
                'id' => $receiptPdf->id,
                'status' => $receiptPdf->status,
            ],
        ]);
    }

    public function show(Request $request, ReceiptPdf $receiptPdf,): JsonResponse
    {
        abort_unless(
            (int) $receiptPdf->user_id === (int) $request->user()->id,
            404,
        );

        return response()->json([
            'data' => [
                'id' => $receiptPdf->id,
                'status' => $receiptPdf->status,
                'download_url' => $receiptPdf->status === 'completed'
                    ? route('receipt-pdfs.download', $receiptPdf)
                    : null,
                'error_message' => $receiptPdf->error_message,
            ],
        ]);
    }

    public function download(
        Request $request,
        ReceiptPdf $receiptPdf,
    ): StreamedResponse {
        abort_unless(
            (int) $receiptPdf->user_id === (int) $request->user()->id,
            404,
        );

        abort_unless(
            $receiptPdf->status === 'completed' &&
            $receiptPdf->file_path !== null &&
            Storage::disk('local')->exists($receiptPdf->file_path),
            404,
        );

        return Storage::disk('local')->download(
            $receiptPdf->file_path,
            "receipt-{$receiptPdf->receipt_id}.pdf",
        );
    }
}

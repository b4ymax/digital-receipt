<?php

declare(strict_types=1);

namespace App\Http\Controllers\Receipt;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateReceiptZipExport;
use App\Models\ReceiptZipExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ReceiptZipExportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'receipt_ids' => ['required', 'array', 'min:1'],
            'receipt_ids.*' => ['required', 'integer', 'distinct'],
        ]);

        $receiptIds = array_map(
            'intval',
            $validated['receipt_ids'],
        );

        $user = $request->user();

        $export = ReceiptZipExport::query()->create([
            'user_id' => $user->id,
            'receipt_ids' => $receiptIds,
            'status' => 'pending',
        ]);

        GenerateReceiptZipExport::dispatch($export->id);

        return response()->json([
            'message' => 'ZIP export has been queued successfully.',
            'data' => [
                'id' => $export->id,
                'status' => $export->status,
            ],
        ]);
    }

    public function show(
        Request $request,
        ReceiptZipExport $receiptZipExport,
    ): JsonResponse {
        return response()->json([
            'data' => [
                'id' => $receiptZipExport->id,
                'status' => $receiptZipExport->status,
                'download_url' => $receiptZipExport->status === 'completed'
                    ? route('receipt-zip-exports.download', $receiptZipExport)
                    : null,
                'error_message' => $receiptZipExport->error_message,
            ],
        ]);
    }

    public function download(
        ReceiptZipExport $receiptZipExport,
    ): StreamedResponse {
        return Storage::disk('local')->download(
            $receiptZipExport->file_path,
            "receipts-export-{$receiptZipExport->id}.zip",
        );
    }
}

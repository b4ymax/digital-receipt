<?php

declare(strict_types=1);

namespace App\Http\Controllers\Receipt;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateReceiptCsvExport;
use App\Models\Receipt;
use App\Models\ReceiptExport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

final class ReceiptExportController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'receipt_ids' => ['required', 'array', 'min:1'],
            'receipt_ids.*' => ['required', 'integer', 'distinct'],
        ]);

        $userId = $request->user()->id;

        $receiptIds = array_map(
            'intval',
            $validated['receipt_ids'],
        );

        $ownedReceiptIds = Receipt::query()
            ->where('user_id', $userId)
            ->whereIn('id', $receiptIds)
            ->pluck('id')
            ->map(fn ($id): int => (int) $id)
            ->all();

        if (count($ownedReceiptIds) !== count($receiptIds)) {
            return response()->json([
                'message' => 'One or more selected receipts are invalid.',
            ], 422);
        }

        $export = ReceiptExport::query()->create([
            'user_id' => $userId,
            'receipt_ids' => $receiptIds,
            'format' => 'csv',
            'status' => 'pending',
        ]);

        GenerateReceiptCsvExport::dispatch($export->id);

        return response()->json([
            'message' => 'CSV export has been queued successfully.',
            'data' => [
                'export_id' => $export->id,
                'status' => $export->status,
            ],
        ], 202);
    }

    public function show(ReceiptExport $receiptExport): JsonResponse
    {
        return response()->json([
            'data' => [
                'id' => $receiptExport->id,
                'status' => $receiptExport->status,
                'download_url' => $receiptExport->status === 'completed'
                    ? route('receipt-exports.download', $receiptExport)
                    : null,
                'error_message' => $receiptExport->error_message,
            ],
        ]);
    }

    public function download(ReceiptExport $receiptExport,): StreamedResponse
    {
        return Storage::disk('local')->download(
            $receiptExport->file_path,
            "receipt-export-{$receiptExport->id}.csv",
        );
    }
}

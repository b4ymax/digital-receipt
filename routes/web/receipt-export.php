<?php

declare(strict_types=1);

use App\Http\Controllers\Receipt\ReceiptExportController;
use Illuminate\Support\Facades\Route;

Route::post('/receipt-exports', [ReceiptExportController::class, 'store'])->name('receipt-exports.store');
Route::get('/receipt-exports/{receiptExport}', [ReceiptExportController::class, 'show'])->name('receipt-exports.show');
Route::get('/receipt-exports/{receiptExport}/download', [ReceiptExportController::class, 'download'])->name('receipt-exports.download');

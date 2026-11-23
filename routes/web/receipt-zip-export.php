<?php

declare(strict_types=1);

use App\Http\Controllers\Receipt\ReceiptZipExportController;
use Illuminate\Support\Facades\Route;

Route::post('/receipt-zip-exports', [ReceiptZipExportController::class, 'store'])->name('receipt-zip-exports.store');
Route::get('/receipt-zip-exports/{receiptZipExport}', [ReceiptZipExportController::class, 'show'])->name('receipt-zip-exports.show');
Route::get('/receipt-zip-exports/{receiptZipExport}/download', [ReceiptZipExportController::class, 'download'])->name('receipt-zip-exports.download');

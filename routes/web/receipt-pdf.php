<?php

declare(strict_types=1);

use App\Http\Controllers\Receipt\ReceiptPdfController;
use Illuminate\Support\Facades\Route;

Route::post('/receipts/{receipt}/pdf', [ReceiptPdfController::class, 'store'])->name('receipt-pdfs.store');
Route::get('/receipt-pdfs/{receiptPdf}', [ReceiptPdfController::class, 'show'])->name('receipt-pdfs.show');
Route::get('/receipt-pdfs/{receiptPdf}/download', [ReceiptPdfController::class, 'download'])->name('receipt-pdfs.download');

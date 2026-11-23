<?php

declare(strict_types=1);

use App\Http\Controllers\Receipt\ReceiptController;
use Illuminate\Support\Facades\Route;

Route::get('/receipts/{receipt}', [ReceiptController::class, 'show'])->middleware('signed')->name('receipts.show');

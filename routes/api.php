<?php

use App\Http\Controllers\Api\PosAuthController;
use App\Http\Controllers\Api\PosReceiptController;
use App\Http\Middleware\EnsureStaff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Staff authentication
Route::post('/pos/login', [PosAuthController::class, 'login']);

// Authenticated staff API
Route::middleware(['auth:sanctum', EnsureStaff::class])->group(function () {
    Route::post('/pos/logout', [PosAuthController::class, 'logout']);

    Route::get('/pos/test', function () {
        return response()->json([
            'message' => 'POS authentication successful.',
        ]);
    });

    Route::post('/pos/receipts', [PosReceiptController::class, 'store']);
});



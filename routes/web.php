<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

require __DIR__.'/web/receipt.php';

Route::middleware('auth')->group(function (): void {
    require __DIR__.'/web/dashboard.php';
    require __DIR__.'/web/receipt-export.php';
    require __DIR__.'/web/receipt-pdf.php';
    require __DIR__.'/web/receipt-zip-export.php';
});

require __DIR__.'/settings.php';

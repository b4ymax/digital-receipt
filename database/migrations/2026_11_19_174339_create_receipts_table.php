<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable();
            $table->string('receipt_number')->unique();
            $table->string('delivery_method');
            $table->float('subtotal');
            $table->float('tax')->default(0);
            $table->float('total');
            $table->timestamp('purchased_at');
            $table->timestamps();
            $table->softDeletes();
        });
    }
};

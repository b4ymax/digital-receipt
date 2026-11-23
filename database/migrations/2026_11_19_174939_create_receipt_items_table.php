<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('receipt_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('receipt_id');
            $table->string('product_name');
            $table->float('quantity');
            $table->float('unit_price');
            $table->float('subtotal');
            $table->timestamps();
        });
    }
};

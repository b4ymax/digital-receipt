<?php

namespace App\Models;

use Database\Factories\ReceiptFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UseFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

#[UseFactory(ReceiptFactory::class)]
#[Fillable(['user_id', 'receipt_number', 'delivery_method', 'subtotal', 'tax', 'total', 'purchased_at'])]
class Receipt extends Model
{
    use HasFactory;
    use SoftDeletes;

    /** @return HasMany<ReceiptItem, $this> */
    public function items(): HasMany
    {
        return $this->hasMany(ReceiptItem::class);
    }
}

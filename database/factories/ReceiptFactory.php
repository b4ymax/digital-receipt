<?php

namespace Database\Factories;

use App\Models\Receipt;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Receipt>
 */
class ReceiptFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 10, 500);
        $tax = round($subtotal * 0.06, 2);

        return [
            'user_id' => null,
            'receipt_number' => 'RCP-'.Str::upper(Str::random(10)),
            'delivery_method' => fake()->randomElement(['digital', 'physical']),
            'subtotal' => $subtotal,
            'tax' => $tax,
            'total' => $subtotal + $tax,
            'purchased_at' => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }
}

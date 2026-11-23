<?php

declare(strict_types=1);

namespace App\Actions\Receipt;

use App\Models\Receipt;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Lorisleiva\Actions\Concerns\AsAction;

final class ClaimReceipt
{
    use AsAction;

    public function handle(User $user, int $receiptId): bool
    {
        return DB::transaction(function () use ($user, $receiptId): bool {
            $receipt = Receipt::query()
                ->lockForUpdate()
                ->find($receiptId);

            if ($receipt === null) {
                return false;
            }

            if (
                $receipt->user_id !== null &&
                (int) $receipt->user_id !== $user->id
            ) {
                return false;
            }

            if ($receipt->user_id === null) {
                $receipt->user_id = $user->id;
                $receipt->save();
            }

            return true;
        });
    }
}

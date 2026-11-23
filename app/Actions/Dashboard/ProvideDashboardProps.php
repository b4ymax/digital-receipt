<?php

declare(strict_types=1);

namespace App\Actions\Dashboard;

use App\Data\Dashboard\DashboardFilterData;
use App\Models\Receipt;
use App\Models\ReceiptItem;
use Illuminate\Support\Facades\Auth;
use Lorisleiva\Actions\Concerns\AsAction;

final class ProvideDashboardProps
{
    use AsAction;

    public function handle(DashboardFilterData $data): array
    {
        $startDate = $data->startDate
            ?? now()->startOfMonth()->toDateString();

        $endDate = $data->endDate
            ?? now()->endOfMonth()->toDateString();

        $userId = Auth::id();

        $receipts = Receipt::query()
            ->where('user_id', $userId)
            ->whereBetween('purchased_at', [
                $startDate.' 00:00:00',
                $endDate.' 23:59:59',
            ])
            ->with('items')
            ->latest('purchased_at')
            ->get();

        $filteredReceipts = Receipt::query()
            ->where('user_id', $userId)
            ->whereBetween('purchased_at', [
                $startDate.' 00:00:00',
                $endDate.' 23:59:59',
            ]);

        $breakdown = ReceiptItem::query()
            ->whereHas('receipt', function ($query) use (
                $userId,
                $startDate,
                $endDate,
            ): void {
                $query->where('user_id', $userId)
                    ->whereBetween('purchased_at', [
                        $startDate.' 00:00:00',
                        $endDate.' 23:59:59',
                    ]);
            })
            ->selectRaw(
                'product_name, SUM(quantity) as total_quantity, SUM(subtotal) as total_spent'
            )
            ->groupBy('product_name')
            ->orderByDesc('total_spent')
            ->get();

        return [
            'receipts' => $receipts,
            'monthlySummary' => [
                'total_expenses' => $filteredReceipts->sum('total'),
                'receipt_count' => $filteredReceipts->count(),
                'breakdown' => $breakdown,
            ],
            'dateFilters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ];
    }
}

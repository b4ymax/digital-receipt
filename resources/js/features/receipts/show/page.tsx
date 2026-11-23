import { Link } from '@inertiajs/react';
import type { Receipt } from '@/types/entities/receipt';

type Props = {
    receipt: Receipt;
};

export default function ReceiptPage({ receipt }: Props) {
    const formatAmount = (amount: number): string =>
        amount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
            <div className="mx-auto max-w-lg">
                {/* Header */}
                <div className="mb-6 text-center">
                    <div className="mx-auto mb-3 flex size-14 items-center justify-center rounded-full bg-green-100">
                        <span className="text-2xl text-green-700">✓</span>
                    </div>

                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Digital Receipt
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Your purchase details
                    </p>
                </div>

                {/* Receipt card */}
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-dashed border-gray-200 px-6 py-5">
                        <p className="text-center text-xs font-medium uppercase tracking-wider text-gray-400">
                            Receipt Number
                        </p>

                        <p className="mt-2 text-center text-lg font-bold text-gray-900">
                            {receipt.receipt_number}
                        </p>

                        <p className="mt-2 text-center text-sm text-gray-500">
                            {new Date(receipt.purchased_at).toLocaleString()}
                        </p>
                    </div>

                    {/* Items */}
                    <div className="px-6 py-5">
                        <h2 className="mb-5 text-sm font-semibold text-gray-900">
                            Purchased Items
                        </h2>

                        <div className="space-y-5">
                            {receipt.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex justify-between gap-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-medium text-gray-900">
                                            {item.product_name}
                                        </p>

                                        <p className="mt-1 text-sm text-gray-500">
                                            {item.quantity} ×{' '}
                                            {formatAmount(item.unit_price)}
                                        </p>
                                    </div>

                                    <p className="shrink-0 font-medium text-gray-900">
                                        {formatAmount(item.subtotal)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-dashed border-gray-200 bg-gray-50 px-6 py-5">
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatAmount(receipt.subtotal)}</span>
                            </div>

                            <div className="flex justify-between text-gray-600">
                                <span>Tax</span>
                                <span>{formatAmount(receipt.tax)}</span>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-5">
                            <span className="font-semibold text-gray-900">
                                Total
                            </span>

                            <span className="text-2xl font-bold text-green-700">
                                {formatAmount(receipt.total)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Save receipt */}
                <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-5">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <span className="text-lg">♧</span>
                        </div>

                        <div>
                            <h2 className="font-semibold text-gray-900">
                                Keep your receipt safe
                            </h2>

                            <p className="mt-1 text-sm leading-relaxed text-gray-600">
                                Sign in or create an account to save this
                                receipt and access it anytime.
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        <Link
                            href="/login"
                            className="flex w-full items-center justify-center rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"
                        >
                            Sign in
                        </Link>

                        <Link
                            href="/register"
                            className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                        >
                            Create account
                        </Link>
                    </div>
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    Thank you for your purchase.
                </p>
            </div>
        </div>
    );
}

import {Receipt} from "@/types/entities/receipt";
import ReceiptCard from "@/pages/users/components/receipt-card";

interface ReceiptListProps {
    receipts: Receipt[];
    selectedReceiptIds: number[];
    onSelectionChange: (receiptId: number) => void;
    onToggleAll: () => void;
}

export default function ReceiptList({receipts, selectedReceiptIds, onSelectionChange, onToggleAll}: ReceiptListProps)
{
    const selectedReceipts = receipts.filter((receipt) =>
        selectedReceiptIds.includes(receipt.id),
    );

    const selectedTotal = selectedReceipts.reduce(
        (total, receipt) => total + Number(receipt.total),
        0,
    );

    const allReceiptsSelected =
        receipts.length > 0 &&
        receipts.every((receipt) => selectedReceiptIds.includes(receipt.id));

    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">Receipts</h2>

                <p className="text-sm text-muted-foreground">
                    Select receipts you want to include in your export.
                </p>
            </div>

            {receipts.length > 0 && (
                <div className="space-y-3 rounded-xl border p-4">
                    <label className="flex items-center gap-2 text-sm font-medium">
                        <input
                            type="checkbox"
                            checked={allReceiptsSelected}
                            onChange={onToggleAll}
                            className="size-4 rounded border"
                        />

                        Select all receipts
                    </label>

                    <div className="flex flex-wrap items-end justify-between gap-4 border-t pt-3">
                        <div className="flex gap-8">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Selected receipts
                                </p>

                                <p className="font-semibold">
                                    {selectedReceipts.length}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Selected total
                                </p>

                                <p className="font-semibold">
                                    {selectedTotal.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {receipts.length === 0 ? (
                <div className="rounded-xl border p-8 text-center">
                    <p className="font-medium">No receipts found</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Try selecting a different date range.
                    </p>
                </div>
            ) : (
                receipts.map((receipt) => (
                    <ReceiptCard
                        key={receipt.id}
                        receipt={receipt}
                        selected={selectedReceiptIds.includes(receipt.id)}
                        onSelectionChange={onSelectionChange}
                    />
                ))
            )}
        </section>
    );
}

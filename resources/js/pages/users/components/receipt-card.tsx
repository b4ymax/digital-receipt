import { Receipt } from "@/types/entities/receipt";
import { useReceiptPdf } from "@/pages/users/hooks/useReceiptPdf";

interface ReceiptCardProps {
    receipt: Receipt;
    selected: boolean;
    onSelectionChange: (receiptId: number) => void;
}

export default function ReceiptCard({
                                        receipt,
                                        selected,
                                        onSelectionChange,
                                    }: ReceiptCardProps) {
    const {
        pdfStatus,
        downloadUrl,
        loading,
        generatePdf,
    } = useReceiptPdf();

    return (
        <div className="rounded-xl border p-5">
            <div className="mb-4 flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelectionChange(receipt.id)}
                    className="size-4 rounded border"
                />

                <span className="text-sm text-muted-foreground">
                    Include in export
                </span>
            </div>

            <div className="flex flex-wrap justify-between gap-2">
                <div>
                    <h3 className="font-semibold">
                        {receipt.receipt_number}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        {new Date(receipt.purchased_at).toLocaleString()}
                    </p>
                </div>

                <p className="font-semibold">
                    {Number(receipt.total).toFixed(2)}
                </p>
            </div>

            <div className="mt-4 space-y-3">
                {receipt.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex justify-between gap-4 text-sm"
                    >
                        <span>
                            {item.product_name} × {item.quantity}
                        </span>

                        <span>
                            {Number(item.subtotal).toFixed(2)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-4 space-y-1 border-t pt-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Subtotal
                    </span>

                    <span>
                        {Number(receipt.subtotal).toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between">
                    <span className="text-muted-foreground">
                        Tax
                    </span>

                    <span>
                        {Number(receipt.tax).toFixed(2)}
                    </span>
                </div>

                <div className="flex justify-between font-semibold">
                    <span>Total</span>

                    <span>
                        {Number(receipt.total).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="mt-4 border-t pt-4">
                <button
                    type="button"
                    onClick={() => void generatePdf(receipt.id)}
                    disabled={loading || pdfStatus === "pending" || pdfStatus === "processing"}
                    className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading
                        ? "Requesting..."
                        : pdfStatus === "pending" || pdfStatus === "processing"
                            ? "Generating PDF..."
                            : "Generate PDF"}
                </button>

                {pdfStatus === "completed" && downloadUrl && (
                    <a
                        href={downloadUrl}
                        className="ml-3 text-sm font-medium text-primary underline"
                    >
                        Download PDF
                    </a>
                )}

                {pdfStatus === "failed" && (
                    <p className="mt-2 text-sm text-destructive">
                        PDF generation failed. Please try again.
                    </p>
                )}
            </div>
        </div>
    );
}

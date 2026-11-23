import ReceiptQrCode from '@/features/receipts/components/receipt-qr-code';

type Props = {
    receiptUrl: string;
    receiptNumber: string;
};

export default function ShowQrPage({receiptUrl, receiptNumber}: Props
) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 text-center shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">
                        Digital Receipt
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Receipt #{receiptNumber}
                    </p>
                </div>

                <ReceiptQrCode receiptUrl={receiptUrl} />

                <p className="text-sm text-muted-foreground">
                    Scan this QR code with your phone to view your receipt.
                </p>

                <p className="text-xs text-muted-foreground">
                    This QR code expires in 5 minutes.
                </p>
            </div>
        </div>
    );
}

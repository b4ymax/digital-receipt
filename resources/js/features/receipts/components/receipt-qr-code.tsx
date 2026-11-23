import { QRCodeSVG } from 'qrcode.react';

type Props = {
    receiptUrl: string;
};

export default function ReceiptQrCode({ receiptUrl }: Props) {
    return (
        <div className="flex flex-col items-center gap-3">
            <QRCodeSVG
                value={receiptUrl}
                size={220}
                level="H"
                includeMargin
            />

            <p className="text-sm text-muted-foreground">
                Scan to view your digital receipt
            </p>
        </div>
    );
}

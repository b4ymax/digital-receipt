import ReceiptPage from '@/features/receipts/show/page';
import { Head, usePage } from '@inertiajs/react';

interface Receipt {
    id: number;
    receipt_number: string;
    delivery_method: string;
    subtotal: number;
    tax: number;
    total: number;
    purchased_at: string;
    items: {
        id: number;
        product_name: string;
        quantity: number;
        unit_price: number;
        subtotal: number;
    }[];
}

type ReceiptProps = {
    receipt: Receipt;
};

const Show = () => {
    const { receipt } = usePage<ReceiptProps>().props;

    return (
        <>
            <Head title={`Receipt ${receipt.receipt_number}`} />

            <ReceiptPage receipt={receipt} />
        </>
    );
};

export default Show;

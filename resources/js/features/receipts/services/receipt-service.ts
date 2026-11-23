export interface CreateReceiptItem {
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface CreateReceiptPayload {
    receipt_number: string;
    delivery_method: 'digital' | 'physical';
    subtotal: number;
    tax: number;
    total: number;
    purchased_at: string;
    items: CreateReceiptItem[];
}

export interface CreateReceiptResponse {
    message: string;
    data: {
        id: number;
        receipt_number: string;
        delivery_method: 'digital' | 'physical';
        subtotal: number;
        tax: number;
        total: number;
        purchased_at: string;
        receipt_url: string;
    };
}

export async function createReceipt(
    payload: CreateReceiptPayload,
): Promise<CreateReceiptResponse> {
    const response = await fetch('/api/pos/receipts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error('Failed to create receipt.');
    }

    return response.json() as Promise<CreateReceiptResponse>;
}

export interface ReceiptItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface Receipt {
    id: number;
    receipt_number: string;
    delivery_method: string;
    subtotal: number;
    tax: number;
    total: number;
    purchased_at: string;
    items: ReceiptItem[];
}


export interface ReceiptItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

export interface Receipt {
    id: number;
    receipt_number: string;
    delivery_method: string;
    subtotal: number;
    tax: number;
    total: number;
    purchased_at: string;
    items: ReceiptItem[];
}

export interface MonthlyBreakdown {
    product_name: string;
    total_quantity: number;
    total_spent: number;
}

export interface MonthlySummary {
    total_expenses: number;
    receipt_count: number;
    breakdown: MonthlyBreakdown[];
}

export interface DateFilters {
    start_date: string;
    end_date: string;
}

export interface DashboardProps {
    receipts: Receipt[];
    monthlySummary: MonthlySummary;
    dateFilters: DateFilters;
}


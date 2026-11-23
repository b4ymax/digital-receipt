import {MonthlySummary} from "@/types/entities/receipt";

interface ExpenseSummaryProps {
    monthlySummary: MonthlySummary;
    startDate: string;
    endDate: string;
    onStartDateChange: (date: string) => void;
    onEndDateChange: (date: string) => void;
    onApplyFilters: () => void;
    onResetFilters: () => void;
}

export default function ExpenseSummary({monthlySummary, startDate, endDate, onStartDateChange, onEndDateChange, onApplyFilters, onResetFilters}: ExpenseSummaryProps)
{
    return (
        <section className="space-y-4">
            <div>
                <h2 className="text-lg font-semibold">
                    Expense Summary
                </h2>

                <p className="text-sm text-muted-foreground">
                    View your expenses for a selected period.
                </p>
            </div>

            <div className="rounded-xl border p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label
                            htmlFor="start_date"
                            className="text-sm font-medium"
                        >
                            Start date
                        </label>

                        <input
                            id="start_date"
                            type="date"
                            value={startDate}
                            max={endDate}
                            onChange={(event) =>
                                onStartDateChange(event.target.value)
                            }
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="end_date"
                            className="text-sm font-medium"
                        >
                            End date
                        </label>

                        <input
                            id="end_date"
                            type="date"
                            value={endDate}
                            min={startDate}
                            onChange={(event) =>
                                onEndDateChange(event.target.value)
                            }
                            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onApplyFilters}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                        Apply filter
                    </button>

                    <button
                        type="button"
                        onClick={onResetFilters}
                        className="rounded-md border px-4 py-2 text-sm font-medium"
                    >
                        Reset to this month
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border p-5">
                    <p className="text-sm text-muted-foreground">
                        Total expenses
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {Number(monthlySummary.total_expenses).toFixed(2)}
                    </p>
                </div>

                <div className="rounded-xl border p-5">
                    <p className="text-sm text-muted-foreground">
                        Number of receipts
                    </p>

                    <p className="mt-2 text-2xl font-semibold">
                        {monthlySummary.receipt_count}
                    </p>
                </div>
            </div>

            <div className="rounded-xl border p-5">
                <h3 className="font-semibold">
                    Spending by product
                </h3>

                {monthlySummary.breakdown.length === 0 ? (
                    <p className="mt-3 text-sm text-muted-foreground">
                        No expenses recorded in this period.
                    </p>
                ) : (
                    <div className="mt-4 space-y-4">
                        {monthlySummary.breakdown.map((item) => (
                            <div
                                key={item.product_name}
                                className="flex items-center justify-between gap-4"
                            >
                                <div>
                                    <p className="font-medium">
                                        {item.product_name}
                                    </p>

                                    <p className="text-sm text-muted-foreground">
                                        Quantity: {Number(item.total_quantity)}
                                    </p>
                                </div>

                                <p className="font-semibold">
                                    {Number(item.total_spent).toFixed(2)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

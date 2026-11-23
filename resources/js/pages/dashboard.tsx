
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { dashboard } from '@/routes';
import { useReceiptExport } from '@/pages/users/hooks/useReceiptExport';
import { useReceiptZipExport } from '@/pages/users/hooks/useReceiptZipExport';
import { DashboardProps } from '@/types/entities/receipt';
import ReceiptList from '@/pages/users/components/receipt-list';
import ExpenseSummary from '@/pages/users/components/expense-summary';

export default function Dashboard({
                                      receipts,
                                      monthlySummary,
                                      dateFilters,
                                  }: DashboardProps) {
    const [startDate, setStartDate] = useState(dateFilters.start_date);
    const [endDate, setEndDate] = useState(dateFilters.end_date);
    const [selectedReceiptIds, setSelectedReceiptIds] = useState<number[]>([]);

    const {
        exportCsv,
        exportStatus,
        downloadUrl,
    } = useReceiptExport();

    const {
        exportZip,
        exportStatus: zipExportStatus,
        downloadUrl: zipDownloadUrl,
        loading: zipLoading,
    } = useReceiptZipExport();

    const allReceiptsSelected =
        receipts.length > 0 &&
        receipts.every((receipt) => selectedReceiptIds.includes(receipt.id));

    const toggleReceipt = (receiptId: number) => {
        setSelectedReceiptIds((current) =>
            current.includes(receiptId)
                ? current.filter((id) => id !== receiptId)
                : [...current, receiptId],
        );
    };

    const toggleAllReceipts = () => {
        if (allReceiptsSelected) {
            setSelectedReceiptIds((current) =>
                current.filter(
                    (id) => !receipts.some((receipt) => receipt.id === id),
                ),
            );

            return;
        }

        setSelectedReceiptIds((current) => [
            ...new Set([...current, ...receipts.map((receipt) => receipt.id)]),
        ]);
    };

    const totalExpenses = receipts.reduce(
        (total, receipt) => total + Number(receipt.total),
        0,
    );

    const applyFilters = () => {
        router.get(
            dashboard().url,
            {
                start_date: startDate,
                end_date: endDate,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const resetFilters = () => {
        const today = new Date();
        const firstDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            1,
        );

        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        };

        const start = formatDate(firstDay);
        const end = formatDate(
            new Date(today.getFullYear(), today.getMonth() + 1, 0),
        );

        setStartDate(start);
        setEndDate(end);

        router.get(
            dashboard().url,
            {
                start_date: start,
                end_date: end,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-semibold">My Receipts</h1>
                    <p className="text-sm text-muted-foreground">
                        View and manage your saved receipts.
                    </p>
                </div>

                <ExpenseSummary
                    monthlySummary={monthlySummary}
                    startDate={startDate}
                    endDate={endDate}
                    onStartDateChange={setStartDate}
                    onEndDateChange={setEndDate}
                    onApplyFilters={applyFilters}
                    onResetFilters={resetFilters}
                />

                <ReceiptList
                    receipts={receipts}
                    selectedReceiptIds={selectedReceiptIds}
                    onSelectionChange={toggleReceipt}
                    onToggleAll={toggleAllReceipts}
                />

                <div className="space-y-5 rounded-xl border p-5">
                    <div>
                        <h2 className="font-semibold">Export Receipts</h2>
                        <p className="text-sm text-muted-foreground">
                            Export your selected receipts as CSV or ZIP.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {selectedReceiptIds.length} receipt(s) selected
                        </p>
                    </div>

                    {/* CSV Export */}
                    <div className="space-y-3">
                        <button
                            type="button"
                            onClick={() => exportCsv(selectedReceiptIds)}
                            disabled={
                                selectedReceiptIds.length === 0 ||
                                exportStatus === 'pending' ||
                                exportStatus === 'processing'
                            }
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                            Export CSV
                        </button>

                        {exportStatus && (
                            <p className="text-sm">
                                CSV export status: {exportStatus}
                            </p>
                        )}

                        {downloadUrl && (
                            <div>
                                <a
                                    href={downloadUrl}
                                    className="text-sm font-medium text-primary underline"
                                >
                                    Download CSV
                                </a>
                            </div>
                        )}
                    </div>

                    {/* ZIP Export */}
                    <div className="space-y-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={() => exportZip(selectedReceiptIds)}
                            disabled={
                                selectedReceiptIds.length === 0 ||
                                zipLoading ||
                                zipExportStatus === 'pending' ||
                                zipExportStatus === 'processing'
                            }
                            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                        >
                            {zipLoading ||
                            zipExportStatus === 'pending' ||
                            zipExportStatus === 'processing'
                                ? 'Generating ZIP...'
                                : 'Export ZIP'}
                        </button>

                        {zipExportStatus && (
                            <p className="text-sm">
                                ZIP export status: {zipExportStatus}
                            </p>
                        )}

                        {zipDownloadUrl && (
                            <div>
                                <a
                                    href={zipDownloadUrl}
                                    className="text-sm font-medium text-primary underline"
                                >
                                    Download ZIP
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground">
                    All-time expenses: {totalExpenses.toFixed(2)}
                </p>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

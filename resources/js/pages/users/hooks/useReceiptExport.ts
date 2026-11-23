
import { useEffect, useState } from 'react';

interface ReceiptExportResponse {
    message: string;
    data: {
        export_id: number;
        status: string;
    };
}

interface ReceiptExportStatusResponse {
    data: {
        id: number;
        status: string;
        download_url?: string | null;
        error_message?: string | null;
    };
}

export function useReceiptExport() {
    const [exportId, setExportId] = useState<number | null>(null);
    const [exportStatus, setExportStatus] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    async function exportCsv(receiptIds: number[]) {
        try {
            const response = await fetch('/receipt-exports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN':
                        document.querySelector<HTMLMetaElement>(
                            'meta[name="csrf-token"]',
                        )?.content ?? '',
                },
                body: JSON.stringify({
                    receipt_ids: receiptIds,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ?? 'Unable to start CSV export.',
                );
            }

            const result = data as ReceiptExportResponse;

            setExportId(result.data.export_id);
            setExportStatus(result.data.status);
            setDownloadUrl(null);
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : 'Unable to export CSV.',
            );
        }
    }

    useEffect(() => {
        if (
            exportId === null ||
            exportStatus === 'completed' ||
            exportStatus === 'failed'
        ) {
            return;
        }

        let timeout: ReturnType<typeof setTimeout>;

        const checkExportStatus = async () => {
            try {
                const response = await fetch(
                    `/receipt-exports/${exportId}`,
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    },
                );

                if (!response.ok) {
                    throw new Error('Unable to check export status.');
                }

                const responseData =
                    (await response.json()) as ReceiptExportStatusResponse;

                const exportData = responseData.data;

                setExportStatus(exportData.status);

                if (exportData.status === 'completed') {
                    setDownloadUrl(exportData.download_url ?? null);
                    return;
                }

                if (exportData.status === 'failed') {
                    return;
                }

                timeout = setTimeout(checkExportStatus, 2000);
            } catch (error) {
                timeout = setTimeout(checkExportStatus, 2000);
            }
        };

        timeout = setTimeout(checkExportStatus, 2000);

        return () => clearTimeout(timeout);
    }, [exportId, exportStatus]);

    return {
        exportCsv,
        exportStatus,
        downloadUrl,
    };
}

import { useCallback, useEffect, useState } from 'react';

interface ReceiptZipExportResponse {
    data: {
        id: number;
        status: string;
        download_url: string | null;
        error_message: string | null;
    };
}

export function useReceiptZipExport() {
    const [exportId, setExportId] = useState<number | null>(null);
    const [exportStatus, setExportStatus] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const exportZip = async (receiptIds: number[]): Promise<void> => {
        setLoading(true);
        setExportStatus('pending');
        setDownloadUrl(null);

        try {
            const csrfToken =
                document.querySelector<HTMLMetaElement>(
                    'meta[name="csrf-token"]',
                )?.content ?? '';

            const response = await fetch('/receipt-zip-exports', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({
                    receipt_ids: receiptIds,
                }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ?? 'Unable to create ZIP export.',
                );
            }

            setExportId(result.data.id);
            setExportStatus(result.data.status);
        } catch (error) {
            setExportStatus('failed');

            alert(
                error instanceof Error
                    ? error.message
                    : 'Unable to create ZIP export.',
            );
        } finally {
            setLoading(false);
        }
    };

    const checkExportStatus = useCallback(async (id: number): Promise<void> => {
        try {
            const response = await fetch(`/receipt-zip-exports/${id}`, {
                headers: {
                    Accept: 'application/json',
                },
            });

            const result: ReceiptZipExportResponse = await response.json();

            if (!response.ok) {
                throw new Error('Unable to check ZIP export status.');
            }

            setExportStatus(result.data.status);
            setDownloadUrl(result.data.download_url);

            if (result.data.status === 'failed') {
                alert(
                    result.data.error_message ??
                    'ZIP export generation failed.',
                );
            }
        } catch (error) {
            setExportStatus('failed');

            alert(
                error instanceof Error
                    ? error.message
                    : 'Unable to check ZIP export status.',
            );
        }
    }, []);

    useEffect(() => {
        if (
            exportId === null ||
            exportStatus === 'completed' ||
            exportStatus === 'failed'
        ) {
            return;
        }

        const timeout = window.setTimeout(() => {
            void checkExportStatus(exportId);
        }, 2000);

        return () => window.clearTimeout(timeout);
    }, [exportId, exportStatus, checkExportStatus]);

    return {
        exportId,
        exportStatus,
        downloadUrl,
        loading,
        exportZip,
    };
}

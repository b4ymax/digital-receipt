import {useCallback, useEffect, useState} from 'react';

interface ReceiptPdfResponse {
    data: {
        id: number;
        status: string;
        download_url: string | null;
        error_message: string | null;
    };
}

export function useReceiptPdf() {
    const [pdfId, setPdfId] = useState<number | null>(null);
    const [pdfStatus, setPdfStatus] = useState<string | null>(null);
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const generatePdf = async (receiptId: number): Promise<void> => {
        setLoading(true);
        setPdfStatus('pending');
        setDownloadUrl(null);

        try {
            const csrfToken =
                document.querySelector<HTMLMetaElement>(
                    'meta[name="csrf-token"]',
                )?.content ?? '';

            const response = await fetch(`/receipts/${receiptId}/pdf`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ?? 'Unable to generate receipt PDF.',
                );
            }

            setPdfId(result.data.id);
            setPdfStatus(result.data.status);
        } catch (error) {
            setPdfStatus('failed');

            alert(
                error instanceof Error
                    ? error.message
                    : 'Unable to generate receipt PDF.',
            );
        } finally {
            setLoading(false);
        }
    };

    const checkPdfStatus = useCallback(async (id: number): Promise<void> => {
        try {
            const response = await fetch(`/receipt-pdfs/${id}`, {
                headers: {
                    Accept: 'application/json',
                },
            });

            const result: ReceiptPdfResponse = await response.json();

            if (!response.ok) {
                throw new Error('Unable to check PDF generation status.');
            }

            setPdfStatus(result.data.status);
            setDownloadUrl(result.data.download_url);

            if (result.data.status === 'failed') {
                alert(
                    result.data.error_message ??
                    'Receipt PDF generation failed.',
                );
            }
        } catch (error) {
            setPdfStatus('failed');

            alert(
                error instanceof Error
                    ? error.message
                    : 'Unable to check PDF generation status.',
            );
        }
    }, []);

    useEffect(() => {
        if (
            pdfId === null ||
            pdfStatus === 'completed' ||
            pdfStatus === 'failed'
        ) {
            return;
        }

        const timeout = window.setTimeout(() => {
            void checkPdfStatus(pdfId);
        }, 2000);

        return () => window.clearTimeout(timeout);
    }, [pdfId, pdfStatus, checkPdfStatus]);

    return {
        pdfId,
        pdfStatus,
        downloadUrl,
        loading,
        generatePdf,
        checkPdfStatus,
    };
}

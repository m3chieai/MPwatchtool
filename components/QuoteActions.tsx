'use client'; // Required for browser-side libraries like html2canvas and jspdf

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface QuoteActionsProps {
    quoteId: string;
}

export default function QuoteActions({ quoteId }: QuoteActionsProps) {
    const downloadPDF = async () => {
        // Target the specific container we marked with this ID in page.tsx
        const element = document.getElementById('certificate-content');
        if (!element) {
            console.error("Certificate content not found");
            return;
        }

        try {
            // Use scale 2 for "Retina" quality text in the PDF
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#F9F7F2',
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`MasterPiece-Quote-${quoteId.slice(0, 8).toUpperCase()}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full no-print">
            {/* Native Browser Print Option */}
            <button
                onClick={() => window.print()}
                className="text-[10px] uppercase tracking-widest text-[#999] hover:text-[#1A1A1A] underline transition-colors"
            >
                Print Certificate
            </button>

            {/* PDF Generation Button */}
            <button
                onClick={downloadPDF}
                className="bg-[#1A1A1A] text-white px-12 py-4 uppercase tracking-widest text-xs hover:bg-[#333] transition-colors shadow-lg w-full sm:w-auto"
            >
                Download Digital PDF
            </button>

            <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
        }
      `}</style>
        </div>
    );
}
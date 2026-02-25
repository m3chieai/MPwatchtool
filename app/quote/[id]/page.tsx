import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import QuoteActions from '@/components/QuoteActions';

export default async function QuotePage({ params }: { params: { id: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { id: params.id },
  });

  if (!quote) notFound();

  // Extract calculations from the seeded JSON
  const breakdown = quote.calculationBreakdown as any;

  return (
    <div className="min-h-screen bg-[#F9F7F2] py-20 px-4 font-serif">
      <div className="max-w-3xl mx-auto">

        {/* PDF Capture Container */}
        <div
          id="certificate-content"
          className="bg-white border border-[#E5E1D8] shadow-sm p-12 relative overflow-hidden"
        >
          {/* Subtle Watermark Overlay */}
          <div className="absolute top-0 right-0 p-8 opacity-5 text-8xl font-bold select-none">
            MP
          </div>

          {/* Header */}
          <div className="text-center border-b border-[#E5E1D8] pb-10 mb-10">
            <h2 className="tracking-[0.2em] text-[#1A1A1A] uppercase text-sm mb-4">Official Valuation Certificate</h2>
            <h1 className="text-4xl italic text-[#1A1A1A]">MasterPiece</h1>
          </div>

          {/* Main Details */}
          <div className="grid grid-cols-2 gap-12 mb-12 text-[#333]">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-[#999] mb-1">Brand & Model</p>
              <p className="text-xl">{quote.brand} {quote.model}</p>
              <p className="text-sm text-[#666] mt-1">Ref: {quote.referenceNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-[#999] mb-1">Certificate ID</p>
              <p className="text-sm font-mono">{quote.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          {/* Valuation Section */}
          <div className="bg-[#1A1A1A] text-white p-10 text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.3em] mb-4 opacity-70">Guaranteed Purchase Offer</p>
            <h2 className="text-5xl mb-4">
              ${quote.finalQuoteAmount.toLocaleString('en-CA')} <span className="text-lg opacity-50">CAD</span>
            </h2>
            <div className="inline-block border border-white/20 px-4 py-1 text-[10px] uppercase tracking-widest">
              Valid Until: {format(new Date(quote.validUntil), 'MMM dd, yyyy · HH:mm')}
            </div>
          </div>

          {/* Breakdown Table */}
          <div className="space-y-4 border-t border-[#E5E1D8] pt-8 mb-12">
            <h3 className="text-[10px] uppercase tracking-widest text-[#999] mb-4">Valuation Breakdown</h3>
            <div className="flex justify-between text-sm italic">
              <span>Market Median (Last 30 Days)</span>
              <span>${quote.baseMarketPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm italic text-[#666]">
              <span>Condition Adjustment ({quote.condition})</span>
              <span>-{breakdown?.conditionAdjustment?.toLocaleString() || '0'}</span>
            </div>

            {/* Seeded Material Multiplier Display */}
            <div className="flex justify-between text-sm italic font-semibold text-[#1A1A1A]">
              <span>Material Premium ({breakdown?.metal || 'Standard'})</span>
              <span>+{breakdown?.materialAdjustment?.toLocaleString() || '0'}</span>
            </div>

            <div className="flex justify-between text-sm italic border-t border-[#E5E1D8] pt-4 font-bold">
              <span>Final MasterPiece Offer</span>
              <span>${quote.finalQuoteAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Footer Branding */}
          <div className="text-center">
            <p className="mt-6 text-[10px] text-[#999] leading-relaxed italic">
              This quote is backed by real-time market data and subject to physical inspection. <br />
              Quotes are guaranteed for 72 hours from issuance.
            </p>
          </div>
        </div>

        {/* Action Buttons (Excluded from PDF via CSS in QuoteActions) */}
        <div className="mt-12 flex flex-col items-center gap-6">
          <QuoteActions quoteId={String(quote.id)} />

          <button className="bg-[#1A1A1A] text-white px-12 py-4 uppercase tracking-widest text-xs hover:bg-[#333] transition-colors w-full sm:w-auto">
            Book In-Store Verification
          </button>
        </div>
      </div>
    </div>
  );
}
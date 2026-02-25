import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SearchHistoryPage() {
  const searches = await prisma.searchHistory.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { quote: true },
  }).catch(() => []);

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-16">
      <div className="mb-12">
        <h1
          className="text-5xl mb-4"
          style={{ fontFamily: 'var(--serif)', fontWeight: 300 }}
        >
          Search History
        </h1>
        <p
          className="text-sm text-[#5a5a48]"
          style={{ fontFamily: 'var(--sans)' }}
        >
          Showing last 100 searches for backtesting analysis
        </p>
      </div>

      {searches.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full" style={{ fontFamily: 'var(--sans)' }}>
            <thead>
              <tr className="border-b border-[#1a1a1a]/20">
                <th className="px-4 py-4 text-left text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.1em' }}>
                  Date
                </th>
                <th className="px-4 py-4 text-left text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.1em' }}>
                  Watch
                </th>
                <th className="px-4 py-4 text-right text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.1em' }}>
                  Listings
                </th>
                <th className="px-4 py-4 text-right text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.1em' }}>
                  Median
                </th>
                <th className="px-4 py-4 text-right text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.1em' }}>
                  Reference
                </th>
                <th className="px-4 py-4 text-center text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.1em' }}>
                  Quote
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a1a1a]/10">
              {searches.map((search) => (
                <tr key={search.id} className="hover:bg-[#1a1a1a]/5 transition-colors">
                  <td className="px-4 py-4 text-xs text-[#5a5a48]">
                    {format(new Date(search.createdAt), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm" style={{ fontFamily: 'var(--serif)', fontWeight: 500 }}>
                      {search.brand} {search.referenceNumber}
                    </div>
                    <div className="text-xs text-[#5a5a48]">
                      {search.condition.replace('_', ' ')} · {search.yearOfManufacture || 'Unknown year'}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-right text-sm">
                    {search.validListings}/{search.totalListings}
                  </td>
                  <td className="px-4 py-4 text-right text-sm" style={{ fontFamily: 'var(--serif)' }}>
                    ${search.medianPrice.toLocaleString('en-CA', { minimumFractionDigits: 0 })}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {search.referencePrice ? (
                      <div>
                        <div className="text-sm" style={{ fontFamily: 'var(--serif)' }}>
                          ${search.referencePrice.toLocaleString('en-CA', { minimumFractionDigits: 0 })}
                        </div>
                        {search.priceDifference !== null && (
                          <div className={`text-xs ${search.priceDifference > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {search.priceDifference > 0 ? '+' : ''}{search.priceDifference.toFixed(1)}%
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[#5a5a48]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {search.quoteId ? (
                      <Link
                        href={`/quote/${search.quoteId}`}
                        className="text-xs text-[#1a1a1a] hover:text-[#d4af37] transition-colors underline"
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-xs text-[#5a5a48]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 border border-[#1a1a1a]/10">
          <p
            className="text-sm text-[#5a5a48]"
            style={{ fontFamily: 'var(--sans)' }}
          >
            No searches logged yet
          </p>
        </div>
      )}
    </div>
  );
}
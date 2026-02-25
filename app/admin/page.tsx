import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  // Get stats
  const [totalQuotes, totalErrors, totalSearches, recentErrors] = await Promise.all([
    prisma.quote.count(),
    prisma.errorLog.count().catch(() => 0),
    prisma.searchHistory.count().catch(() => 0),
    prisma.errorLog.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, errorType: true, message: true, createdAt: true, severity: true },
    }).catch(() => []),
  ]);

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-16">
      <h1 
        className="text-5xl mb-16"
        style={{ fontFamily: 'var(--serif)', fontWeight: 300 }}
      >
        System Overview
      </h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="border border-[#1a1a1a]/20 p-8">
          <p 
            className="text-xs tracking-widest uppercase text-[#5a5a48] mb-4"
            style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
          >
            Total Quotes
          </p>
          <p 
            className="text-5xl"
            style={{ fontFamily: 'var(--serif)', fontWeight: 600 }}
          >
            {totalQuotes}
          </p>
        </div>

        <div className="border border-[#1a1a1a]/20 p-8">
          <p 
            className="text-xs tracking-widest uppercase text-[#5a5a48] mb-4"
            style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
          >
            Error Logs
          </p>
          <p 
            className="text-5xl"
            style={{ fontFamily: 'var(--serif)', fontWeight: 600 }}
          >
            {totalErrors}
          </p>
        </div>

        <div className="border border-[#1a1a1a]/20 p-8">
          <p 
            className="text-xs tracking-widest uppercase text-[#5a5a48] mb-4"
            style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
          >
            Searches Logged
          </p>
          <p 
            className="text-5xl"
            style={{ fontFamily: 'var(--serif)', fontWeight: 600 }}
          >
            {totalSearches}
          </p>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="border-t border-[#1a1a1a]/10 pt-16">
        <div className="flex justify-between items-center mb-8">
          <h2 
            className="text-xs tracking-widest uppercase text-[#5a5a48]"
            style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
          >
            Recent Errors
          </h2>
          <Link 
            href="/admin/errors"
            className="text-sm hover:text-[#d4af37] transition-colors"
            style={{ fontFamily: 'var(--sans)' }}
          >
            View All →
          </Link>
        </div>

        {recentErrors.length > 0 ? (
          <div className="space-y-4">
            {recentErrors.map((error) => (
              <div 
                key={error.id} 
                className="border border-[#1a1a1a]/10 p-6 hover:border-[#d4af37]/30 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span 
                        className="text-xs tracking-wide px-2 py-1 border border-[#1a1a1a]/20"
                        style={{ fontFamily: 'var(--sans)' }}
                      >
                        {error.errorType}
                      </span>
                      <span 
                        className={`text-xs tracking-wide px-2 py-1 ${
                          error.severity === 'error' 
                            ? 'bg-red-100 text-red-800' 
                            : error.severity === 'warning'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                        style={{ fontFamily: 'var(--sans)' }}
                      >
                        {error.severity}
                      </span>
                    </div>
                    <p 
                      className="text-sm"
                      style={{ fontFamily: 'var(--sans)' }}
                    >
                      {error.message}
                    </p>
                  </div>
                  <p 
                    className="text-xs text-[#5a5a48]"
                    style={{ fontFamily: 'var(--sans)' }}
                  >
                    {new Date(error.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p 
            className="text-sm text-[#5a5a48] py-8 text-center"
            style={{ fontFamily: 'var(--sans)' }}
          >
            No errors logged yet
          </p>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-2 gap-8 mt-16 pt-16 border-t border-[#1a1a1a]/10">
        <Link 
          href="/admin/errors"
          className="border border-[#1a1a1a]/20 p-8 hover:border-[#d4af37] transition-colors group"
        >
          <h3 
            className="text-xl mb-3 group-hover:text-[#d4af37] transition-colors"
            style={{ fontFamily: 'var(--serif)', fontWeight: 500 }}
          >
            Error Logs
          </h3>
          <p 
            className="text-sm text-[#5a5a48]"
            style={{ fontFamily: 'var(--sans)' }}
          >
            View all system errors, warnings, and issues
          </p>
        </Link>

        <Link 
          href="/admin/searches"
          className="border border-[#1a1a1a]/20 p-8 hover:border-[#d4af37] transition-colors group"
        >
          <h3 
            className="text-xl mb-3 group-hover:text-[#d4af37] transition-colors"
            style={{ fontFamily: 'var(--serif)', fontWeight: 500 }}
          >
            Search History
          </h3>
          <p 
            className="text-sm text-[#5a5a48]"
            style={{ fontFamily: 'var(--sans)' }}
          >
            Analyze eBay searches and pricing data for backtesting
          </p>
        </Link>
      </div>
    </div>
  );
}
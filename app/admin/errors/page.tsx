import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function ErrorLogsPage() {
  const errors = await prisma.errorLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
  }).catch(() => []);

  return (
    <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-16">
      <div className="mb-12">
        <h1
          className="text-5xl mb-4"
          style={{ fontFamily: 'var(--serif)', fontWeight: 300 }}
        >
          Error Logs
        </h1>
        <p
          className="text-sm text-[#5a5a48]"
          style={{ fontFamily: 'var(--sans)' }}
        >
          Showing last 100 errors
        </p>
      </div>

      {errors.length > 0 ? (
        <div className="space-y-6">
          {errors.map((error) => (
            <details
              key={error.id}
              className="border border-[#1a1a1a]/10 group"
            >
              <summary className="p-6 cursor-pointer hover:bg-[#1a1a1a]/5 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className="text-xs tracking-wide px-3 py-1 border border-[#1a1a1a]/20"
                        style={{ fontFamily: 'var(--sans)' }}
                      >
                        {error.errorType}
                      </span>
                      <span
                        className={`text-xs tracking-wide px-3 py-1 ${error.severity === 'error'
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
                      className="text-sm mb-2"
                      style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}
                    >
                      {error.message}
                    </p>
                    <p
                      className="text-xs text-[#5a5a48]"
                      style={{ fontFamily: 'var(--sans)' }}
                    >
                      {format(new Date(error.createdAt), 'MMM d, yyyy · h:mm a')}
                    </p>
                  </div>
                </div>
              </summary>

              <div className="px-6 pb-6 border-t border-[#1a1a1a]/10 pt-6">
                {error.stack && (
                  <div className="mb-4">
                    <p
                      className="text-xs tracking-wide uppercase text-[#5a5a48] mb-2"
                      style={{ fontFamily: 'var(--sans)', letterSpacing: '0.1em' }}
                    >
                      Stack Trace
                    </p>
                    <pre
                      className="text-xs bg-[#1a1a1a] text-[#f8f6f3] p-4 overflow-x-auto"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {error.stack}
                    </pre>
                  </div>
                )}

                {error.context && Object.keys(error.context as any).length > 0 && (
                  <div>
                    <p
                      className="text-xs tracking-wide uppercase text-[#5a5a48] mb-2"
                      style={{ fontFamily: 'var(--sans)', letterSpacing: '0.1em' }}
                    >
                      Context
                    </p>
                    <pre
                      className="text-xs bg-[#1a1a1a] text-[#f8f6f3] p-4 overflow-x-auto"
                      style={{ fontFamily: 'monospace' }}
                    >
                      {JSON.stringify(error.context, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-[#1a1a1a]/10">
          <p
            className="text-sm text-[#5a5a48]"
            style={{ fontFamily: 'var(--sans)' }}
          >
            No errors logged yet
          </p>
        </div>
      )}
    </div>
  );
}
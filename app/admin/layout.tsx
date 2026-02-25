import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Admin Header */}
      <nav className="bg-[#1a1a1a] text-[#f8f6f3] border-b border-[#f8f6f3]/10">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <Link 
              href="/admin" 
              className="text-xl tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--serif)', fontWeight: 300, letterSpacing: '0.2em' }}
            >
              Admin Dashboard
            </Link>
            <div className="flex items-center gap-8" style={{ fontFamily: 'var(--sans)' }}>
              <Link 
                href="/admin/errors" 
                className="text-sm tracking-wide uppercase text-[#f8f6f3]/70 hover:text-[#d4af37] transition-colors"
                style={{ letterSpacing: '0.1em' }}
              >
                Error Logs
              </Link>
              <Link 
                href="/admin/searches" 
                className="text-sm tracking-wide uppercase text-[#f8f6f3]/70 hover:text-[#d4af37] transition-colors"
                style={{ letterSpacing: '0.1em' }}
              >
                Search History
              </Link>
              <Link 
                href="/" 
                className="text-sm tracking-wide uppercase text-[#f8f6f3]/70 hover:text-[#d4af37] transition-colors"
                style={{ letterSpacing: '0.1em' }}
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
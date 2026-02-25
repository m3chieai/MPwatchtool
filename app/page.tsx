import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      

      {/* Minimal Header */}
      <nav className="fixed top-0 w-full bg-[#f8f6f3]/95 backdrop-blur-sm z-50 border-b border-[#1a1a1a]/10">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <h1 
              className="text-2xl tracking-[0.3em] uppercase" 
              style={{ fontFamily: 'var(--serif)', fontWeight: 300, letterSpacing: '0.3em' }}
            >
              MasterPiece
            </h1>
            <div className="flex items-center gap-10" style={{ fontFamily: 'var(--sans)' }}>
              <Link
                href="/dealer/login"
                className="text-sm tracking-wide uppercase text-[#1a1a1a]/70 hover-gold"
                style={{ letterSpacing: '0.1em' }}
              >
                Dealer Portal
              </Link>
              <Link
                href="/quote"
                className="text-sm tracking-wide uppercase px-6 py-3 bg-[#1a1a1a] text-[#f8f6f3] hover:bg-[#d4af37] transition-all duration-300"
                style={{ letterSpacing: '0.1em' }}
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Asymmetric Layout */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-7 opacity-0 animate-fade-in-up">
              <div className="max-w-[600px]">
                <p 
                  className="text-sm tracking-widest uppercase text-[#5a5a48] mb-6"
                  style={{ fontFamily: 'var(--sans)', letterSpacing: '0.2em' }}
                >
                  Established 2024
                </p>
                
                <h1 
                  className="text-6xl lg:text-7xl leading-[1.1] mb-8 ruled-line pb-4"
                  style={{ 
                    fontFamily: 'var(--serif)', 
                    fontWeight: 300,
                    color: '#1a1a1a'
                  }}
                >
                  Your Watch's<br />
                  <span style={{ fontWeight: 600, fontStyle: 'italic' }}>True Value</span><br />
                  in 60 Seconds
                </h1>
                
                <p 
                  className="text-lg leading-relaxed mb-12 text-[#1a1a1a]/80"
                  style={{ 
                    fontFamily: 'var(--sans)', 
                    fontWeight: 300,
                    maxWidth: '500px'
                  }}
                >
                  No auctions. No waiting. No compromises. Just instant, 
                  guaranteed quotes backed by real market data and Swiss precision.
                </p>
                
                <div className="flex items-center gap-6 opacity-0 animate-fade-in-up stagger-2">
                  <Link 
                    href="/quote" 
                    className="inline-block px-10 py-4 bg-[#1a1a1a] text-[#f8f6f3] text-sm tracking-widest uppercase hover:bg-[#d4af37] transition-all duration-300"
                    style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
                  >
                    Request Valuation →
                  </Link>
                </div>
                
                <div className="mt-16 pt-8 border-t border-[#1a1a1a]/10 opacity-0 animate-fade-in-up stagger-3">
                  <div className="flex items-center gap-12" style={{ fontFamily: 'var(--sans)' }}>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-[#5a5a48] mb-1" style={{ letterSpacing: '0.15em' }}>Satisfaction</p>
                      <p className="text-2xl" style={{ fontFamily: 'var(--serif)', fontWeight: 600 }}>4.9/5</p>
                    </div>
                    <div className="h-8 w-px bg-[#1a1a1a]/10"></div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-[#5a5a48] mb-1" style={{ letterSpacing: '0.15em' }}>Traded</p>
                      <p className="text-2xl" style={{ fontFamily: 'var(--serif)', fontWeight: 600 }}>$10M+</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right: Image */}
            <div className="lg:col-span-5 opacity-0 animate-fade-in stagger-2">
              <div className="relative">
                <div className="aspect-[3/4] relative overflow-hidden bg-[#1a1a1a]/5">
                  <Image
                    src="/patek-philippe-watch.png"
                    alt="Luxury Timepiece"
                    fill
                    className="object-cover"
                    priority
                    style={{ 
                      filter: 'contrast(1.05) saturate(0.95)',
                      mixBlendMode: 'multiply'
                    }}
                  />
                </div>
                {/* Decorative border */}
                <div className="absolute -bottom-6 -right-6 w-full h-full border border-[#d4af37]/30 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions - Editorial Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <div className="mb-6">
                <div className="w-12 h-12 border border-[#1a1a1a] flex items-center justify-center mb-6">
                  <span className="text-2xl" style={{ fontFamily: 'var(--serif)' }}>I</span>
                </div>
              </div>
              <h3 
                className="text-2xl mb-4 ruled-line pb-2"
                style={{ fontFamily: 'var(--serif)', fontWeight: 500 }}
              >
                Instant Valuation
              </h3>
              <p 
                className="leading-relaxed text-[#1a1a1a]/70"
                style={{ fontFamily: 'var(--sans)', fontWeight: 300 }}
              >
                Market-backed quotes in under 60 seconds. No appointments, 
                no negotiations, no uncertainty.
              </p>
            </div>

            <div>
              <div className="mb-6">
                <div className="w-12 h-12 border border-[#1a1a1a] flex items-center justify-center mb-6">
                  <span className="text-2xl" style={{ fontFamily: 'var(--serif)' }}>II</span>
                </div>
              </div>
              <h3 
                className="text-2xl mb-4 ruled-line pb-2"
                style={{ fontFamily: 'var(--serif)', fontWeight: 500 }}
              >
                Superior Returns
              </h3>
              <p 
                className="leading-relaxed text-[#1a1a1a]/70"
                style={{ fontFamily: 'var(--sans)', fontWeight: 300 }}
              >
                Sellers receive 8-15% more than traditional buyers. 
                We eliminate the middleman premium.
              </p>
            </div>

            <div>
              <div className="mb-6">
                <div className="w-12 h-12 border border-[#1a1a1a] flex items-center justify-center mb-6">
                  <span className="text-2xl" style={{ fontFamily: 'var(--serif)' }}>III</span>
                </div>
              </div>
              <h3 
                className="text-2xl mb-4 ruled-line pb-2"
                style={{ fontFamily: 'var(--serif)', fontWeight: 500 }}
              >
                Guaranteed Trust
              </h3>
              <p 
                className="leading-relaxed text-[#1a1a1a]/70"
                style={{ fontFamily: 'var(--sans)', fontWeight: 300 }}
              >
                In-store authentication. Same-day payment. 
                90-day comprehensive warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison - Minimal Table */}
      <section className="py-24 bg-[#f8f6f3]">
        <div className="max-w-[1100px] mx-auto px-8 lg:px-16">
          <h2 
            className="text-5xl mb-4 text-center ruled-line inline-block pb-3 mx-auto block"
            style={{ fontFamily: 'var(--serif)', fontWeight: 300 }}
          >
            Why MasterPiece
          </h2>
          <p 
            className="text-center text-[#5a5a48] mb-16 tracking-wide"
            style={{ fontFamily: 'var(--sans)', letterSpacing: '0.05em' }}
          >
            Compared to traditional luxury watch buyers
          </p>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ fontFamily: 'var(--sans)' }}>
              <thead>
                <tr className="border-b border-[#1a1a1a]/20">
                  <th className="px-6 py-5 text-left text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.15em' }}>Feature</th>
                  <th className="px-6 py-5 text-center text-xs tracking-widest uppercase bg-[#1a1a1a] text-[#f8f6f3]" style={{ letterSpacing: '0.15em' }}>MasterPiece</th>
                  <th className="px-6 py-5 text-center text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.15em' }}>Bob's Watches</th>
                  <th className="px-6 py-5 text-center text-xs tracking-widest uppercase text-[#5a5a48]" style={{ letterSpacing: '0.15em' }}>Crown & Caliber</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a1a]/10">
                <tr>
                  <td className="px-6 py-5 text-sm">Quote Speed</td>
                  <td className="px-6 py-5 text-center text-sm font-medium bg-[#1a1a1a]/5">Under 60 sec</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">24-48 hours</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">Conditional*</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm">Seller Payout</td>
                  <td className="px-6 py-5 text-center text-sm font-medium bg-[#1a1a1a]/5">85-92%</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">75-80%</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">70-78%</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm">Price Guarantee</td>
                  <td className="px-6 py-5 text-center text-sm font-medium bg-[#1a1a1a]/5">72 hours</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">None</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">Conditional</td>
                </tr>
                <tr>
                  <td className="px-6 py-5 text-sm">Transaction Time</td>
                  <td className="px-6 py-5 text-center text-sm font-medium bg-[#1a1a1a]/5">Same day</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">7-10 days</td>
                  <td className="px-6 py-5 text-center text-sm text-[#1a1a1a]/50">14-21 days</td>
                </tr>
              </tbody>
            </table>
            <p className="text-xs text-[#5a5a48] mt-4 text-center" style={{ fontFamily: 'var(--sans)' }}>
              * Final price determined after inspection
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials - Elegant Cards */}
      <section className="py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-8 lg:px-16">
          <h2 
            className="text-5xl mb-20 text-center ruled-line inline-block pb-3 mx-auto block"
            style={{ fontFamily: 'var(--serif)', fontWeight: 300 }}
          >
            Client Testimonials
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "Best payout I've received for any watch. Quick and professional.", author: 'John M.', location: 'Toronto' },
              { quote: '$2,400 more than Bob\'s Watches offered. No brainer.', author: 'Sarah L.', location: 'Vancouver' },
              { quote: 'Instant quote was accurate. Sold my Submariner in 3 days.', author: 'Michael R.', location: 'Montreal' },
            ].map((testimonial, i) => (
              <div key={i} className="border border-[#1a1a1a]/10 p-8">
                <div className="mb-6">
                  <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                    <path d="M0 20V8.889C0 5.926 0.889 3.519 2.667 1.667C4.444 -0.185 6.852 -1.111 9.889 -1.111V1.778C8.148 1.778 6.704 2.407 5.556 3.667C4.407 4.926 3.833 6.481 3.833 8.333H9.889V20H0ZM14.111 20V8.889C14.111 5.926 15 3.519 16.778 1.667C18.556 -0.185 20.963 -1.111 24 -1.111V1.778C22.259 1.778 20.815 2.407 19.667 3.667C18.519 4.926 17.944 6.481 17.944 8.333H24V20H14.111Z" fill="#d4af37"/>
                  </svg>
                </div>
                <p 
                  className="text-lg leading-relaxed mb-8 italic"
                  style={{ fontFamily: 'var(--serif)', fontWeight: 300 }}
                >
                  {testimonial.quote}
                </p>
                <div className="pt-6 border-t border-[#1a1a1a]/10">
                  <p className="text-sm font-medium" style={{ fontFamily: 'var(--sans)' }}>{testimonial.author}</p>
                  <p className="text-xs text-[#5a5a48] tracking-wide mt-1" style={{ fontFamily: 'var(--sans)' }}>{testimonial.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 bg-[#1a1a1a] text-[#f8f6f3]">
        <div className="max-w-[800px] mx-auto px-8 text-center">
          <h2 
            className="text-5xl lg:text-6xl mb-8"
            style={{ fontFamily: 'var(--serif)', fontWeight: 300, lineHeight: 1.2 }}
          >
            Ready to discover your<br />
            <span style={{ fontWeight: 600, fontStyle: 'italic' }}>watch's true value?</span>
          </h2>
          <p 
            className="text-lg mb-12 text-[#f8f6f3]/70"
            style={{ fontFamily: 'var(--sans)', fontWeight: 300 }}
          >
            Join the modern era of luxury watch trading
          </p>
          <Link 
            href="/quote" 
            className="inline-block px-12 py-5 bg-[#d4af37] text-[#1a1a1a] text-sm tracking-widest uppercase hover:bg-[#f8f6f3] transition-all duration-300"
            style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
          >
            Request Your Quote →
          </Link>
        </div>
      </section>

      {/* Refined Footer */}
      <footer className="bg-[#1a1a1a] text-[#f8f6f3]/60 border-t border-[#f8f6f3]/10">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-16">
          <div className="grid md:grid-cols-4 gap-12 mb-16" style={{ fontFamily: 'var(--sans)' }}>
            <div>
              <h3 
                className="text-[#f8f6f3] text-xl mb-6 tracking-[0.2em] uppercase" 
                style={{ fontFamily: 'var(--serif)', fontWeight: 300, letterSpacing: '0.2em' }}
              >
                MasterPiece
              </h3>
              <p className="text-sm leading-relaxed">
                The modern marketplace for discerning watch collectors.
              </p>
            </div>
            <div>
              <h4 className="text-[#f8f6f3] text-xs tracking-widest uppercase mb-6" style={{ letterSpacing: '0.15em' }}>Services</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/quote" className="hover-gold">Sell Your Watch</Link></li>
                <li><Link href="/inventory" className="hover-gold">Browse Inventory</Link></li>
                <li><Link href="/trade" className="hover-gold">Trade Services</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#f8f6f3] text-xs tracking-widest uppercase mb-6" style={{ letterSpacing: '0.15em' }}>For Dealers</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/dealer/login" className="hover-gold">Portal Access</Link></li>
                <li><Link href="/dealer/register" className="hover-gold">Partnership</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[#f8f6f3] text-xs tracking-widest uppercase mb-6" style={{ letterSpacing: '0.15em' }}>Connect</h4>
              <div className="flex gap-4 mb-6">
                <a href="https://instagram.com/masterpiece" className="w-8 h-8 border border-[#f8f6f3]/20 flex items-center justify-center hover:border-[#d4af37] transition-colors">
                  <span className="text-xs">IG</span>
                </a>
                <a href="https://twitter.com/masterpiece" className="w-8 h-8 border border-[#f8f6f3]/20 flex items-center justify-center hover:border-[#d4af37] transition-colors">
                  <span className="text-xs">TW</span>
                </a>
              </div>
              <p className="text-xs">
                <a href="mailto:hello@masterpiece.com" className="hover-gold">hello@masterpiece.com</a>
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-[#f8f6f3]/10 flex justify-between items-center text-xs">
            <p>&copy; 2026 MasterPiece. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover-gold">Privacy</Link>
              <Link href="/terms" className="hover-gold">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

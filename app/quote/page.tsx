'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type WatchCondition = 'NEW_UNWORN' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD';

interface QuoteFormData {
  brand: string;
  referenceNumber: string;
  condition: WatchCondition | '';
  hasBox: boolean;
  hasPapers: boolean;
  hasOriginalBracelet: boolean;
  hasServiceRecords: boolean;
  yearOfManufacture: number | '';
}

const WATCH_BRANDS = [
  'Rolex',
  'Omega',
  'Patek Philippe',
  'Audemars Piguet',
  'Cartier',
  'IWC',
  'Panerai',
  'Tag Heuer',
  'Breitling',
  'Tudor',
  'Other',
];

const CONDITIONS = [
  {
    value: 'NEW_UNWORN' as const,
    title: 'New/Unworn',
    description: 'Unworn with stickers or tags intact',
    icon: 'I',
  },
  {
    value: 'EXCELLENT' as const,
    title: 'Excellent',
    description: 'Light wear, no polishing issues, minor hairlines',
    icon: 'II',
  },
  {
    value: 'VERY_GOOD' as const,
    title: 'Very Good',
    description: 'Visible wear marks, minor scratches',
    icon: 'III',
  },
  {
    value: 'GOOD' as const,
    title: 'Good',
    description: 'Heavy wear, may require service or refinishing',
    icon: 'IV',
  },
];

export default function QuotePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<QuoteFormData>({
    brand: '',
    referenceNumber: '',
    condition: '',
    hasBox: false,
    hasPapers: false,
    hasOriginalBracelet: true,
    hasServiceRecords: false,
    yearOfManufacture: '',
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/quotes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          customerEmail: 'temp@example.com', // In production, collect email
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate quote');
      }

      const data = await response.json();
      router.push(`/quote/${data.quoteId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.brand &&
      formData.referenceNumber &&
      formData.condition &&
      formData.yearOfManufacture
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f6f3]">
      {/* Refined Header */}
      <nav className="bg-[#f8f6f3] border-b border-[#1a1a1a]/10">
        <div className="max-w-[1200px] mx-auto px-8 lg:px-16">
          <div className="flex justify-between items-center h-20">
            <Link 
              href="/" 
              className="text-2xl tracking-[0.3em] uppercase hover-gold"
              style={{ fontFamily: 'var(--serif)', fontWeight: 300, letterSpacing: '0.3em' }}
            >
              MasterPiece
            </Link>
            <Link 
              href="/" 
              className="text-sm tracking-wide uppercase text-[#1a1a1a]/70 hover-gold"
              style={{ fontFamily: 'var(--sans)', letterSpacing: '0.1em' }}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-[900px] mx-auto px-8 py-16 lg:py-24">
        
        {/* Hero */}
        <div className="text-center mb-16 pb-16 border-b border-[#1a1a1a]/10">
          <p 
            className="text-xs tracking-widest uppercase text-[#5a5a48] mb-6"
            style={{ fontFamily: 'var(--sans)', letterSpacing: '0.2em' }}
          >
            Instant Valuation Service
          </p>
          
          <h1 
            className="text-5xl lg:text-6xl mb-6"
            style={{ fontFamily: 'var(--serif)', fontWeight: 300, lineHeight: 1.2 }}
          >
            Request Your<br />
            <span style={{ fontWeight: 600, fontStyle: 'italic' }}>Guaranteed Quote</span>
          </h1>
          
          <p 
            className="text-base text-[#1a1a1a]/70 max-w-[500px] mx-auto"
            style={{ fontFamily: 'var(--sans)', fontWeight: 300 }}
          >
            72-Hour Price Guarantee · No Obligation · Immediate Results
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-16">
          
          {/* Step 1: Watch Details */}
          <div>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-8 border border-[#1a1a1a] flex items-center justify-center">
                  <span className="text-lg" style={{ fontFamily: 'var(--serif)' }}>I</span>
                </div>
                <h2 
                  className="text-xs tracking-widest uppercase text-[#5a5a48]"
                  style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
                >
                  Timepiece Information
                </h2>
              </div>
            </div>

            <div className="space-y-6" style={{ fontFamily: 'var(--sans)' }}>
              
              {/* Brand */}
              <div>
                <label className="block text-xs tracking-wide uppercase text-[#5a5a48] mb-3" style={{ letterSpacing: '0.1em' }}>
                  Manufacture *
                </label>
                <select
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  className="w-full px-4 py-3 border border-[#1a1a1a]/20 bg-white text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] transition-colors"
                  style={{ fontFamily: 'var(--serif)', fontSize: '16px' }}
                  required
                >
                  <option value="">Select manufacture...</option>
                  {WATCH_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reference Number */}
              <div>
                <label className="block text-xs tracking-wide uppercase text-[#5a5a48] mb-3" style={{ letterSpacing: '0.1em' }}>
                  Reference Number *
                </label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, referenceNumber: e.target.value })
                  }
                  placeholder="e.g., 116610LN, 310.30.42"
                  className="w-full px-4 py-3 border border-[#1a1a1a]/20 bg-white text-[#1a1a1a] placeholder:text-[#1a1a1a]/30 focus:outline-none focus:border-[#d4af37] transition-colors"
                  style={{ fontFamily: 'var(--serif)', fontSize: '16px' }}
                  required
                />
                <p className="text-xs text-[#5a5a48] mt-2" style={{ letterSpacing: '0.05em' }}>
                  Located on case back or warranty card
                </p>
              </div>

              {/* Year */}
              <div>
                <label className="block text-xs tracking-wide uppercase text-[#5a5a48] mb-3" style={{ letterSpacing: '0.1em' }}>
                  Year of Manufacture *
                </label>
                <select
                  value={formData.yearOfManufacture}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearOfManufacture: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-4 py-3 border border-[#1a1a1a]/20 bg-white text-[#1a1a1a] focus:outline-none focus:border-[#d4af37] transition-colors"
                  style={{ fontFamily: 'var(--serif)', fontSize: '16px' }}
                  required
                >
                  <option value="">Select year...</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                  <option value="0">Unknown</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Condition */}
          <div className="pt-16 border-t border-[#1a1a1a]/10">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-8 border border-[#1a1a1a] flex items-center justify-center">
                  <span className="text-lg" style={{ fontFamily: 'var(--serif)' }}>II</span>
                </div>
                <h2 
                  className="text-xs tracking-widest uppercase text-[#5a5a48]"
                  style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
                >
                  Condition Assessment
                </h2>
              </div>
              <p 
                className="text-sm text-[#1a1a1a]/70 mt-4 ml-12"
                style={{ fontFamily: 'var(--sans)', fontWeight: 300 }}
              >
                Select the grade that best describes your timepiece
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.value}
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, condition: cond.value })
                  }
                  className={`p-6 border transition-all ${
                    formData.condition === cond.value
                      ? 'border-[#1a1a1a] bg-[#1a1a1a] text-[#f8f6f3]'
                      : 'border-[#1a1a1a]/20 hover:border-[#d4af37]'
                  }`}
                >
                  <div 
                    className="text-2xl mb-4"
                    style={{ fontFamily: 'var(--serif)' }}
                  >
                    {cond.icon}
                  </div>
                  <div 
                    className="text-sm mb-2 tracking-wide"
                    style={{ fontFamily: 'var(--sans)', fontWeight: 500 }}
                  >
                    {cond.title}
                  </div>
                  <div 
                    className={`text-xs leading-relaxed ${
                      formData.condition === cond.value ? 'text-[#f8f6f3]/70' : 'text-[#1a1a1a]/60'
                    }`}
                    style={{ fontFamily: 'var(--sans)', fontWeight: 300 }}
                  >
                    {cond.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Completeness */}
          <div className="pt-16 border-t border-[#1a1a1a]/10">
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-8 border border-[#1a1a1a] flex items-center justify-center">
                  <span className="text-lg" style={{ fontFamily: 'var(--serif)' }}>III</span>
                </div>
                <h2 
                  className="text-xs tracking-widest uppercase text-[#5a5a48]"
                  style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
                >
                  Included Items
                </h2>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6" style={{ fontFamily: 'var(--sans)' }}>
              
              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.hasBox}
                  onChange={(e) =>
                    setFormData({ ...formData, hasBox: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 border border-[#1a1a1a]/20 text-[#1a1a1a] focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <div className="text-sm mb-1 group-hover:text-[#d4af37] transition-colors" style={{ fontWeight: 500 }}>
                    Original Box
                  </div>
                  <div className="text-xs text-[#1a1a1a]/60 leading-relaxed">
                    Manufacturer packaging
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.hasPapers}
                  onChange={(e) =>
                    setFormData({ ...formData, hasPapers: e.target.checked })
                  }
                  className="mt-1 w-5 h-5 border border-[#1a1a1a]/20 text-[#1a1a1a] focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <div className="text-sm mb-1 group-hover:text-[#d4af37] transition-colors" style={{ fontWeight: 500 }}>
                    Original Papers
                  </div>
                  <div className="text-xs text-[#1a1a1a]/60 leading-relaxed">
                    Warranty card or certificate
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.hasOriginalBracelet}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasOriginalBracelet: e.target.checked,
                    })
                  }
                  className="mt-1 w-5 h-5 border border-[#1a1a1a]/20 text-[#1a1a1a] focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <div className="text-sm mb-1 group-hover:text-[#d4af37] transition-colors" style={{ fontWeight: 500 }}>
                    Original Bracelet
                  </div>
                  <div className="text-xs text-[#1a1a1a]/60 leading-relaxed">
                    Factory bracelet or strap
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-4 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.hasServiceRecords}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hasServiceRecords: e.target.checked,
                    })
                  }
                  className="mt-1 w-5 h-5 border border-[#1a1a1a]/20 text-[#1a1a1a] focus:ring-0 focus:ring-offset-0"
                />
                <div>
                  <div className="text-sm mb-1 group-hover:text-[#d4af37] transition-colors" style={{ fontWeight: 500 }}>
                    Service Records
                  </div>
                  <div className="text-xs text-[#1a1a1a]/60 leading-relaxed">
                    Maintenance documentation
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 border-l-2 border-red-600 bg-red-50">
              <p className="text-sm text-red-800" style={{ fontFamily: 'var(--sans)' }}>
                {error}
              </p>
            </div>
          )}

          {/* Submit */}
          <div className="pt-16 border-t border-[#1a1a1a]/10">
            <div className="text-center">
              <button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="px-12 py-4 bg-[#1a1a1a] text-[#f8f6f3] text-xs tracking-widest uppercase hover:bg-[#d4af37] hover:text-[#1a1a1a] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#1a1a1a] disabled:hover:text-[#f8f6f3]"
                style={{ fontFamily: 'var(--sans)', letterSpacing: '0.15em' }}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating Valuation...
                  </span>
                ) : (
                  'Request Instant Quote →'
                )}
              </button>
              <p 
                className="text-xs text-[#5a5a48] mt-6"
                style={{ fontFamily: 'var(--sans)', letterSpacing: '0.05em' }}
              >
                72-hour guarantee · No obligation · Immediate results
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

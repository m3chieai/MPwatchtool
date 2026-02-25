// Fallback reference prices in USD (current market Feb 2026)
// These are conservative wholesale market prices based on recent sales
// Updated: Feb 9, 2026

export const referencePrices: Record<string, number> = {
  // Daytona
  '116500LN': 30000,  // Ceramic Black Dial
  '116500': 30000,    // Ceramic White Dial
  '126500LN': 32000,  // Newer Ceramic Black
  '116523': 15000,    // Two-Tone
  '116520': 18000,    // SS Pre-Ceramic
  
  // Submariner
  '116610LN': 11000,  // Black Sub Date
  '116610LV': 14000,  // Hulk (discontinued)
  '126610LN': 12000,  // Newer Black Sub
  '126610LV': 15000,  // Starbucks
  '114060': 9000,     // No Date Sub
  '124060': 10000,    // Newer No Date
  
  // GMT-Master II
  '126710BLRO': 16000, // Pepsi (Jubilee)
  '126710BLNR': 15000, // Batman (Jubilee)
  '116710LN': 10000,   // Black GMT
  '116710BLNR': 14000, // Batman (older)
};

export function getReferencePrice(refNumber: string): number | null {
  const cleanRef = refNumber.replace(/\s/g, '').toUpperCase();
  return referencePrices[cleanRef] || null;
}

export function validateEbayPrice(refNumber: string, ebayMedianUSD: number): {
  isValid: boolean;
  referencePrice: number | null;
  difference: number | null;
} {
  const referencePrice = getReferencePrice(refNumber);
  
  if (!referencePrice) {
    return { isValid: true, referencePrice: null, difference: null };
  }
  
  const difference = ((ebayMedianUSD - referencePrice) / referencePrice) * 100;
  const isValid = Math.abs(difference) <= 30;
  
  return { isValid, referencePrice, difference };
}
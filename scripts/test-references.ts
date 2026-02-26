/**
 * Reference Number Test Suite
 * Run: npx tsx scripts/test-references.ts
 *
 * Tests the pricing engine and validation logic for a wide set of
 * Rolex reference numbers without hitting eBay or the database.
 */

import { pricingCalculator } from '../lib/services/pricing.service';
import { validateEbayPrice, getReferencePrice } from '../lib/services/reference-prices';
import { ebayService } from '../lib/services/ebay.service';

// ─── Test Dataset ────────────────────────────────────────────────────────────

interface TestCase {
  brand: string;
  ref: string;
  label: string;
  mockMarketPriceUSD: number;   // simulated eBay median in USD
  condition: 'NEW_UNWORN' | 'EXCELLENT' | 'VERY_GOOD' | 'GOOD';
  hasBox: boolean;
  hasPapers: boolean;
  yearOfManufacture: number;
}

const TEST_CASES: TestCase[] = [
  // ── Submariner (Steel) ──────────────────────────────────────
  { brand: 'Rolex', ref: '116610LN', label: 'Sub Date Black',       mockMarketPriceUSD: 11500, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2018 },
  { brand: 'Rolex', ref: '116610LV', label: 'Sub Hulk (discont.)',  mockMarketPriceUSD: 14000, condition: 'VERY_GOOD',  hasBox: false, hasPapers: false, yearOfManufacture: 2015 },
  { brand: 'Rolex', ref: '126610LN', label: 'Sub Date Black New',   mockMarketPriceUSD: 12000, condition: 'NEW_UNWORN', hasBox: true,  hasPapers: true,  yearOfManufacture: 2023 },
  { brand: 'Rolex', ref: '126610LV', label: 'Starbucks',            mockMarketPriceUSD: 15500, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2022 },
  { brand: 'Rolex', ref: '114060',   label: 'No-Date Sub',          mockMarketPriceUSD: 9200,  condition: 'VERY_GOOD',  hasBox: true,  hasPapers: false, yearOfManufacture: 2017 },
  { brand: 'Rolex', ref: '124060',   label: 'No-Date Sub New',      mockMarketPriceUSD: 10500, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2021 },

  // ── Daytona ──────────────────────────────────────────────────
  { brand: 'Rolex', ref: '116500LN', label: 'Daytona Ceramic Black', mockMarketPriceUSD: 30000, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2020 },
  { brand: 'Rolex', ref: '116500',   label: 'Daytona Ceramic White', mockMarketPriceUSD: 29500, condition: 'VERY_GOOD',  hasBox: false, hasPapers: true,  yearOfManufacture: 2019 },
  { brand: 'Rolex', ref: '126500LN', label: 'Daytona New Gen',       mockMarketPriceUSD: 32000, condition: 'NEW_UNWORN', hasBox: true,  hasPapers: true,  yearOfManufacture: 2023 },
  { brand: 'Rolex', ref: '116520',   label: 'Daytona Pre-Ceramic',   mockMarketPriceUSD: 18500, condition: 'VERY_GOOD',  hasBox: false, hasPapers: false, yearOfManufacture: 2007 },
  { brand: 'Rolex', ref: '116523',   label: 'Daytona Two-Tone',      mockMarketPriceUSD: 15000, condition: 'EXCELLENT',  hasBox: true,  hasPapers: false, yearOfManufacture: 2010 },

  // ── GMT-Master II ─────────────────────────────────────────────
  { brand: 'Rolex', ref: '126710BLRO', label: 'GMT Pepsi (Jubilee)', mockMarketPriceUSD: 16500, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2021 },
  { brand: 'Rolex', ref: '126710BLNR', label: 'GMT Batman (Jubilee)',mockMarketPriceUSD: 15500, condition: 'VERY_GOOD',  hasBox: true,  hasPapers: false, yearOfManufacture: 2020 },
  { brand: 'Rolex', ref: '116710LN',   label: 'GMT Black Bezel',     mockMarketPriceUSD: 10500, condition: 'VERY_GOOD',  hasBox: false, hasPapers: false, yearOfManufacture: 2013 },
  { brand: 'Rolex', ref: '116710BLNR', label: 'GMT Batman (older)', mockMarketPriceUSD: 14500, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2016 },

  // ── Datejust ─────────────────────────────────────────────────
  { brand: 'Rolex', ref: '126234',   label: 'DJ36 Steel/Rolesor',  mockMarketPriceUSD: 8000,  condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2020 },
  { brand: 'Rolex', ref: '126300',   label: 'DJ41 Steel',          mockMarketPriceUSD: 8500,  condition: 'VERY_GOOD',  hasBox: true,  hasPapers: false, yearOfManufacture: 2019 },
  { brand: 'Rolex', ref: '69173',    label: 'DJ26 Ladies Vintage', mockMarketPriceUSD: 3500,  condition: 'VERY_GOOD',  hasBox: false, hasPapers: false, yearOfManufacture: 1993 },
  { brand: 'Rolex', ref: '16233',    label: 'DJ36 Two-Tone Vintage', mockMarketPriceUSD: 5500, condition: 'GOOD',      hasBox: false, hasPapers: false, yearOfManufacture: 1999 },
  { brand: 'Rolex', ref: '16200',    label: 'DJ36 SS Vintage',     mockMarketPriceUSD: 4800,  condition: 'VERY_GOOD',  hasBox: false, hasPapers: false, yearOfManufacture: 2002 },

  // ── Explorer / Explorer II ────────────────────────────────────
  { brand: 'Rolex', ref: '214270',   label: 'Explorer I 39mm',     mockMarketPriceUSD: 7500,  condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2014 },
  { brand: 'Rolex', ref: '226570',   label: 'Explorer II New',     mockMarketPriceUSD: 10000, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2022 },
  { brand: 'Rolex', ref: '216570',   label: 'Explorer II White',   mockMarketPriceUSD: 9500,  condition: 'VERY_GOOD',  hasBox: true,  hasPapers: false, yearOfManufacture: 2016 },

  // ── Sky-Dweller ──────────────────────────────────────────────
  { brand: 'Rolex', ref: '326934',   label: 'Sky-Dweller Steel',   mockMarketPriceUSD: 20000, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2021 },
  { brand: 'Rolex', ref: '336935',   label: 'Sky-Dweller RG',      mockMarketPriceUSD: 45000, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2022 },

  // ── Patek Philippe ───────────────────────────────────────────
  { brand: 'Patek Philippe', ref: '5711/1A', label: 'Nautilus SS',     mockMarketPriceUSD: 80000, condition: 'EXCELLENT',  hasBox: true,  hasPapers: true,  yearOfManufacture: 2019 },
  { brand: 'Patek Philippe', ref: '5726A',   label: 'Annual Cal Naut',  mockMarketPriceUSD: 65000, condition: 'VERY_GOOD',  hasBox: true,  hasPapers: false, yearOfManufacture: 2017 },

  // ── Audemars Piguet ──────────────────────────────────────────
  { brand: 'Audemars Piguet', ref: '15400ST', label: 'Royal Oak 41mm SS', mockMarketPriceUSD: 45000, condition: 'EXCELLENT', hasBox: true, hasPapers: true, yearOfManufacture: 2018 },
  { brand: 'Audemars Piguet', ref: '15202ST', label: 'Royal Oak 39mm Jumbo', mockMarketPriceUSD: 70000, condition: 'VERY_GOOD', hasBox: false, hasPapers: false, yearOfManufacture: 2015 },

  // ── Edge cases ───────────────────────────────────────────────
  { brand: 'Rolex', ref: '228348RBR', label: 'Sky-Dweller Everose/Diamonds', mockMarketPriceUSD: 90000, condition: 'NEW_UNWORN', hasBox: true, hasPapers: true, yearOfManufacture: 2023 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pad(str: string, len: number) {
  return str.length >= len ? str.slice(0, len) : str + ' '.repeat(len - str.length);
}

function fmt(n: number) {
  return `$${Math.round(n).toLocaleString('en-CA')}`;
}

// ─── Mock eBay filter test ────────────────────────────────────────────────────
// Simulates whether a listing title/price would pass the eBay filter for each ref

function testFilter(ref: string, brand: string, priceUSD: number): boolean {
  const mockListing = {
    itemId: 'test',
    title: `${brand} ${ref} Watch Stainless Steel`,
    soldPrice: priceUSD,
    currency: 'USD',
    saleDate: new Date().toISOString(),
    listingUrl: '',
  };
  const result = ebayService.filterValidListings([mockListing], ref);
  return result.length > 0;
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log('\n' + '═'.repeat(110));
console.log(' MASTERPIECE — REFERENCE NUMBER TEST SUITE');
console.log('═'.repeat(110));
console.log(
  pad('Brand', 18) +
  pad('Reference', 12) +
  pad('Label', 30) +
  pad('Market(USD)', 13) +
  pad('RefPrice', 10) +
  pad('PriceOK?', 10) +
  pad('FilterOK?', 10) +
  pad('Quote(CAD)', 13) +
  'Status'
);
console.log('─'.repeat(110));

let passed = 0, warned = 0, failed = 0;

for (const tc of TEST_CASES) {
  const marketUSD = tc.mockMarketPriceUSD;
  const marketCAD = marketUSD * 1.35;

  // 1. Validate against reference prices
  const validation = validateEbayPrice(tc.ref, marketUSD);

  // 2. Resolve final base market price (mirror route logic)
  let baseMarketPrice = marketCAD;
  if (validation.referencePrice && !validation.isValid && validation.difference !== null && validation.difference < -30) {
    baseMarketPrice = validation.referencePrice * 1.35;
  }

  // 3. Calculate quote
  const breakdown = pricingCalculator.calculateQuote({
    baseMarketPrice,
    referenceNumber: tc.ref,
    condition: tc.condition,
    hasBox: tc.hasBox,
    hasPapers: tc.hasPapers,
    hasOriginalBracelet: true,
    yearOfManufacture: tc.yearOfManufacture,
    isHighDemand: pricingCalculator.isHighDemandBrand(tc.brand),
  });

  // 4. Test eBay filter with the mock price
  const filterOk = testFilter(tc.ref, tc.brand, marketUSD);

  // 5. Determine status
  const priceValid = validation.isValid || !validation.referencePrice;
  const quoteOk = breakdown.finalQuote > 0;
  let status = '';
  if (!filterOk) {
    status = '⚠ FILTER REJECT';
    warned++;
  } else if (!quoteOk) {
    status = '✗ NEGATIVE QUOTE';
    failed++;
  } else if (!priceValid) {
    status = '⚠ PRICE ADJUSTED';
    warned++;
    passed++;
  } else {
    status = '✓ OK';
    passed++;
  }

  const refPriceFmt = validation.referencePrice ? fmt(validation.referencePrice) : 'n/a';
  const priceOkFmt  = validation.referencePrice ? (validation.isValid ? 'yes' : `${validation.difference?.toFixed(0)}%`) : 'n/a';

  console.log(
    pad(tc.brand, 18) +
    pad(tc.ref, 12) +
    pad(tc.label, 30) +
    pad(fmt(marketUSD), 13) +
    pad(refPriceFmt, 10) +
    pad(priceOkFmt, 10) +
    pad(filterOk ? 'yes' : 'NO', 10) +
    pad(fmt(breakdown.finalQuote), 13) +
    status
  );
}

console.log('─'.repeat(110));
console.log(`\n Results: ${passed} passed  |  ${warned} warnings  |  ${failed} failed  |  ${TEST_CASES.length} total`);

// ─── Detailed breakdown for 69173 ────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log(' DETAILED BREAKDOWN — Rolex 69173 (Ladies Datejust Vintage)');
console.log('═'.repeat(60));
const tc69173 = TEST_CASES.find(t => t.ref === '69173')!;
const mkt = tc69173.mockMarketPriceUSD * 1.35;
const bd = pricingCalculator.calculateQuote({
  baseMarketPrice: mkt,
  referenceNumber: tc69173.ref,
  condition: tc69173.condition,
  hasBox: tc69173.hasBox,
  hasPapers: tc69173.hasPapers,
  hasOriginalBracelet: true,
  yearOfManufacture: tc69173.yearOfManufacture,
  isHighDemand: true,
});
const fmt2 = pricingCalculator.formatBreakdown(bd);
for (const [k, v] of Object.entries(fmt2)) {
  console.log(`  ${pad(k, 24)} ${v}`);
}
console.log('');

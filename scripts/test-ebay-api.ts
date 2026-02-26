/**
 * Live eBay API Test Suite
 * Run: npx tsx --env-file=.env.local scripts/test-ebay-api.ts
 *
 * Tests actual eBay search + filter for each reference number.
 * Shows how many valid listings are found and whether a quote could be generated.
 */

import { ebayService } from '../lib/services/ebay.service';
import { pricingCalculator } from '../lib/services/pricing.service';
import { validateEbayPrice } from '../lib/services/reference-prices';

// ─── Reference test list (brand + ref number pairs) ──────────────────────────

interface RefTest {
  brand: string;
  ref: string;
  label: string;
}

const REFS: RefTest[] = [
  // Submariner
  { brand: 'Rolex', ref: '116610LN',   label: 'Sub Date Black'            },
  { brand: 'Rolex', ref: '116610LV',   label: 'Sub Hulk'                  },
  { brand: 'Rolex', ref: '126610LN',   label: 'Sub Date New'              },
  { brand: 'Rolex', ref: '126610LV',   label: 'Starbucks'                 },
  { brand: 'Rolex', ref: '114060',     label: 'No-Date Sub'               },
  { brand: 'Rolex', ref: '124060',     label: 'No-Date Sub New'           },
  // Daytona
  { brand: 'Rolex', ref: '116500LN',   label: 'Daytona Ceramic Black'     },
  { brand: 'Rolex', ref: '116500',     label: 'Daytona Ceramic White'     },
  { brand: 'Rolex', ref: '126500LN',   label: 'Daytona New Gen'           },
  { brand: 'Rolex', ref: '116520',     label: 'Daytona Pre-Ceramic'       },
  // GMT
  { brand: 'Rolex', ref: '126710BLRO', label: 'GMT Pepsi'                 },
  { brand: 'Rolex', ref: '126710BLNR', label: 'GMT Batman (New)'          },
  { brand: 'Rolex', ref: '116710BLNR', label: 'GMT Batman (Old)'          },
  { brand: 'Rolex', ref: '116710LN',   label: 'GMT Black'                 },
  // Datejust
  { brand: 'Rolex', ref: '126234',     label: 'Datejust 36'               },
  { brand: 'Rolex', ref: '126300',     label: 'Datejust 41'               },
  { brand: 'Rolex', ref: '69173',      label: 'Datejust Ladies (Vintage)' },
  { brand: 'Rolex', ref: '16233',      label: 'Datejust TT (Vintage)'     },
  { brand: 'Rolex', ref: '16200',      label: 'Datejust SS (Vintage)'     },
  // Explorer
  { brand: 'Rolex', ref: '214270',     label: 'Explorer I'                },
  { brand: 'Rolex', ref: '226570',     label: 'Explorer II'               },
  // Sky-Dweller
  { brand: 'Rolex', ref: '326934',     label: 'Sky-Dweller Steel'         },
  // Patek
  { brand: 'Patek Philippe', ref: '5711/1A', label: 'Nautilus Steel'      },
  { brand: 'Patek Philippe', ref: '5726A',   label: 'Annual Cal Nautilus' },
  // AP
  { brand: 'Audemars Piguet', ref: '15400ST', label: 'Royal Oak 41'       },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pad(s: string, n: number) {
  return (s + ' '.repeat(n)).slice(0, n);
}
function fmtUSD(n: number) {
  return '$' + Math.round(n).toLocaleString('en-US');
}
function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms));
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n' + '═'.repeat(120));
  console.log(' MASTERPIECE — LIVE eBay API TEST');
  console.log(' Environment: EBAY_APP_ID =', process.env.EBAY_APP_ID ? '✓ set' : '✗ MISSING');
  console.log('═'.repeat(120));
  console.log(
    pad('Brand', 18) +
    pad('Reference', 12) +
    pad('Label', 30) +
    pad('Total', 8) +
    pad('Valid', 8) +
    pad('PriceMin', 12) +
    pad('PriceMax', 12) +
    pad('Median', 12) +
    'Result'
  );
  console.log('─'.repeat(120));

  const results: { label: string; status: string }[] = [];

  for (const t of REFS) {
    process.stdout.write(pad(t.brand, 18) + pad(t.ref, 12) + pad(t.label, 30));

    try {
      // 1. eBay search
      const listings = await ebayService.searchSoldListings({
        keywords: `${t.brand} ${t.ref}`,
        brand: t.brand,
        model: '',
        referenceNumber: t.ref,
      });

      // 2. Filter
      const valid = ebayService.filterValidListings(listings, t.ref);

      if (valid.length === 0) {
        console.log(
          pad(String(listings.length), 8) +
          pad('0', 8) +
          pad('—', 12) + pad('—', 12) + pad('—', 12) +
          '✗ No valid listings'
        );
        results.push({ label: `${t.brand} ${t.ref}`, status: 'no_listings' });
        await sleep(300);
        continue;
      }

      // 3. Convert to CAD
      const pricesCAD = await Promise.all(
        valid.map(l => l.currency === 'USD' ? ebayService.convertToCAD(l.soldPrice) : Promise.resolve(l.soldPrice))
      );

      const cleaned  = ebayService.removeOutliers(pricesCAD);
      const median   = ebayService.calculateMedian(cleaned);
      const minPrice = cleaned.length > 0 ? Math.min(...cleaned) : 0;
      const maxPrice = cleaned.length > 0 ? Math.max(...cleaned) : 0;

      // 4. Validate against reference price
      const medianUSD  = median / 1.35;
      const validation = validateEbayPrice(t.ref, medianUSD);

      let baseMarketPrice = median;
      let priceNote = '';
      if (validation.referencePrice && !validation.isValid && validation.difference !== null && validation.difference < -30) {
        baseMarketPrice = validation.referencePrice * 1.35;
        priceNote = ' [ref override]';
      }

      const canQuote = valid.length >= 5;

      // 5. Calculate quote (only if we have enough data)
      let quoteStr = '< 5 listings';
      if (canQuote && cleaned.length > 0) {
        const bd = pricingCalculator.calculateQuote({
          baseMarketPrice,
          referenceNumber: t.ref,
          condition: 'EXCELLENT',
          hasBox: true,
          hasPapers: true,
          hasOriginalBracelet: true,
          yearOfManufacture: 2020,
          isHighDemand: pricingCalculator.isHighDemandBrand(t.brand),
        });
        quoteStr = fmtUSD(bd.finalQuote) + ' CAD' + priceNote;
      }

      const statusIcon = !canQuote ? '⚠' : cleaned.length === 0 ? '✗' : '✓';
      const statusText = !canQuote
        ? `⚠ Only ${valid.length}/5 valid (need more listings)`
        : `✓ Quote: ${quoteStr}`;

      console.log(
        pad(String(listings.length), 8) +
        pad(String(valid.length), 8) +
        pad(cleaned.length > 0 ? fmtUSD(minPrice) : '—', 12) +
        pad(cleaned.length > 0 ? fmtUSD(maxPrice) : '—', 12) +
        pad(cleaned.length > 0 ? fmtUSD(median) : '—', 12) +
        statusText
      );

      results.push({ label: `${t.brand} ${t.ref} (${t.label})`, status: canQuote ? 'ok' : 'insufficient' });

    } catch (err: any) {
      console.log(pad('—', 8) + pad('—', 8) + pad('—', 12) + pad('—', 12) + pad('—', 12) + `✗ API ERROR: ${err?.message}`);
      results.push({ label: `${t.brand} ${t.ref}`, status: 'error' });
    }

    // Be polite to eBay API — 400ms between calls
    await sleep(400);
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log('─'.repeat(120));
  const ok    = results.filter(r => r.status === 'ok').length;
  const insuf = results.filter(r => r.status === 'insufficient').length;
  const none  = results.filter(r => r.status === 'no_listings').length;
  const errs  = results.filter(r => r.status === 'error').length;
  console.log(`\n Results: ✓ ${ok} quotable  |  ⚠ ${insuf} insufficient  |  ✗ ${none} no listings  |  ✗ ${errs} API errors  |  ${results.length} total\n`);

  if (insuf > 0 || none > 0) {
    console.log(' References needing attention:');
    results.filter(r => r.status !== 'ok').forEach(r => {
      console.log(`   - ${r.label}  [${r.status}]`);
    });
    console.log('');
  }
}

main().catch(console.error);

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ebayService } from '@/lib/services/ebay.service';
import { pricingCalculator } from '@/lib/services/pricing.service';
import { validateEbayPrice } from '@/lib/services/reference-prices';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const quoteSchema = z.object({
  customerEmail:      z.string().email(),
  brand:              z.string().min(1),
  referenceNumber:    z.string().min(1),
  condition:          z.enum(['NEW_UNWORN', 'EXCELLENT', 'VERY_GOOD', 'GOOD']),
  hasBox:             z.boolean(),
  hasPapers:          z.boolean(),
  hasOriginalBracelet: z.boolean().optional().default(true),
  hasServiceRecords:  z.boolean().optional().default(false),
  yearOfManufacture:  z.number().min(1950).max(new Date().getFullYear()),
  dialType:  z.enum(['standard', 'factory_diamond', 'aftermarket_diamond']).optional().default('standard'),
  bezelType: z.enum(['original', 'aftermarket_with_original', 'aftermarket_only', 'heavy_iced']).optional().default('original'),
});

// Map common reference numbers to model names
function resolveModelName(brand: string, ref: string): string {
  if (brand.toLowerCase() !== 'rolex') return ref;
  const map: Record<string, string> = {
    // Submariner
    '114060': 'Submariner',      '124060': 'Submariner',
    '116610LN': 'Submariner Date', '116610LV': 'Submariner Date',
    '126610LN': 'Submariner Date', '126610LV': 'Submariner Date',
    // Daytona
    '116500LN': 'Daytona', '116500': 'Daytona',
    '126500LN': 'Daytona', '116520': 'Daytona', '116523': 'Daytona',
    // GMT-Master II
    '116710LN': 'GMT-Master II', '116710BLNR': 'GMT-Master II',
    '126710BLRO': 'GMT-Master II', '126710BLNR': 'GMT-Master II',
    // Explorer
    '214270': 'Explorer', '226570': 'Explorer II', '216570': 'Explorer II',
    // Datejust
    '126234': 'Datejust 36', '126300': 'Datejust 41',
    '69173': 'Datejust',    '16233': 'Datejust',    '16200': 'Datejust',
    // Sky-Dweller
    '326934': 'Sky-Dweller', '336935': 'Sky-Dweller',
  };
  return map[ref.toUpperCase()] ?? ref;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    // 1. Search eBay for listings
    console.log("🔍 Searching eBay for:", validatedData.brand, validatedData.referenceNumber);
    const ebayListings = await ebayService.searchSoldListings({
      keywords: `${validatedData.brand} ${validatedData.referenceNumber}`,
      brand: validatedData.brand,
      model: "",
      referenceNumber: validatedData.referenceNumber
    });

    // 2. Filter valid listings
    const validListings = ebayService.filterValidListings(ebayListings, validatedData.referenceNumber || "");
    console.log("✅ After filtering:", validListings.length, "valid listings");

    if (validListings.length < 5) {
      return NextResponse.json({
        error: "Insufficient market data",
        message: `We found only ${validListings.length} comparable sales. We need at least 5 for accuracy.`
      }, { status: 400 });
    }

    // 3. Process prices
    const pricesInCAD = await Promise.all(validListings.map(async (listing) => {
      if (listing.currency === "USD") return await ebayService.convertToCAD(listing.soldPrice);
      return listing.soldPrice;
    }));

    const cleanedPrices = ebayService.removeOutliers(pricesInCAD);
    const safePrices = cleanedPrices.length > 0 ? cleanedPrices : pricesInCAD;
    let baseMarketPrice = ebayService.calculateMedian(safePrices);

    // 4. Validate against reference prices
    const ebayMedianUSD = baseMarketPrice / 1.35;
    const validation = validateEbayPrice(validatedData.referenceNumber, ebayMedianUSD);

    if (validation.referencePrice && !validation.isValid && validation.difference && validation.difference < -30) {
      baseMarketPrice = validation.referencePrice * 1.35;
    }

    // 5. Calculate quote (includes dial + bezel multipliers)
    const pricingBreakdown = pricingCalculator.calculateQuote({
      baseMarketPrice,
      referenceNumber:    validatedData.referenceNumber,
      condition:          validatedData.condition,
      hasBox:             validatedData.hasBox,
      hasPapers:          validatedData.hasPapers,
      hasOriginalBracelet: validatedData.hasOriginalBracelet,
      yearOfManufacture:  validatedData.yearOfManufacture,
      isHighDemand:       pricingCalculator.isHighDemandBrand(validatedData.brand),
      dialType:           validatedData.dialType,
      bezelType:          validatedData.bezelType,
    });

    // 6. Resolve model name from reference number
    const modelName = resolveModelName(validatedData.brand, validatedData.referenceNumber);

    // 7. Save Quote
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 72);

    const quote = await prisma.quote.create({
      data: {
        customerEmail:      validatedData.customerEmail,
        brand:              validatedData.brand,
        model:              modelName,
        referenceNumber:    validatedData.referenceNumber,
        condition:          validatedData.condition,
        hasBox:             validatedData.hasBox,
        hasPapers:          validatedData.hasPapers,
        hasOriginalBracelet: validatedData.hasOriginalBracelet,
        hasServiceRecords:  validatedData.hasServiceRecords,
        yearOfManufacture:  validatedData.yearOfManufacture,
        dialType:           validatedData.dialType,
        bezelType:          validatedData.bezelType,
        baseMarketPrice,
        finalQuoteAmount:   pricingBreakdown.finalQuote,
        calculationBreakdown: pricingBreakdown as any,
        validUntil,
        status: "ACTIVE"
      }
    });

    // 8. Log to SearchHistory (non-fatal)
    try {
      await prisma.searchHistory.create({
        data: {
          brand:            validatedData.brand,
          referenceNumber:  validatedData.referenceNumber,
          yearOfManufacture: validatedData.yearOfManufacture,
          condition:        validatedData.condition,
          totalListings:    ebayListings.length,
          validListings:    validListings.length,
          priceRangeMin:    Math.min(...safePrices),
          priceRangeMax:    Math.max(...safePrices),
          medianPrice:      baseMarketPrice,
          quoteId:          quote.id,
        }
      });
    } catch (historyError) {
      console.error("⚠️ SearchHistory log failed (non-fatal):", historyError);
    }

    // 9. Email (non-fatal)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: 'MasterPiece <info@mpwatchtool.com>',
          to: validatedData.customerEmail,
          subject: `Your Watch Valuation: ${validatedData.brand} ${validatedData.referenceNumber}`,
          html: `<p>Your watch is valued at <strong>$${pricingBreakdown.finalQuote.toLocaleString()} CAD</strong>.</p>`
        });
      } catch (emailError) {
        console.error("⚠️ Email send failed (non-fatal):", emailError);
      }
    } else {
      console.warn("⚠️ RESEND_API_KEY not set — skipping email");
    }

    return NextResponse.json(quote);

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Quote API Error:", message, error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error", detail: message }, { status: 500 });
  }
}

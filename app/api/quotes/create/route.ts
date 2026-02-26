import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ebayService } from '@/lib/services/ebay.service';
import { pricingCalculator } from '@/lib/services/pricing.service';
import { validateEbayPrice } from '@/lib/services/reference-prices';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

const quoteSchema = z.object({
  customerEmail: z.string().email(),
  brand: z.string().min(1),
  referenceNumber: z.string().min(1),
  condition: z.enum(['NEW_UNWORN', 'EXCELLENT', 'VERY_GOOD', 'GOOD']),
  hasBox: z.boolean(),
  hasPapers: z.boolean(),
  hasOriginalBracelet: z.boolean().optional().default(true),
  hasServiceRecords: z.boolean().optional().default(false),
  yearOfManufacture: z.number().min(1950).max(new Date().getFullYear()),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = quoteSchema.parse(body);

    // 1. Search eBay for sold listings
    console.log("🔍 Searching eBay for:", validatedData.brand, validatedData.referenceNumber);
    const ebayListings = await ebayService.searchSoldListings({
      keywords: `${validatedData.brand} ${validatedData.referenceNumber}`,
      brand: validatedData.brand,
      model: "",
      referenceNumber: validatedData.referenceNumber
    });

    // 2. Filter valid listings
    const validListings = ebayService.filterValidListings(
        ebayListings, 
        validatedData.referenceNumber || ""
    );
    
    console.log("✅ After filtering:", validListings.length, "valid listings");

    if (validListings.length < 5) {
      return NextResponse.json({
        error: "Insufficient market data",
        message: `We found only ${validListings.length} comparable sales. We need at least 5 for accuracy.`
      }, { status: 400 });
    }

    // 3. Process Prices
    const pricesInCAD = await Promise.all(validListings.map(async (listing) => {
      if (listing.currency === "USD") {
        return await ebayService.convertToCAD(listing.soldPrice);
      }
      return listing.soldPrice;
    }));

    const cleanedPrices = ebayService.removeOutliers(pricesInCAD);
    let baseMarketPrice = ebayService.calculateMedian(cleanedPrices);

    // 4. Validate against reference prices
    const ebayMedianUSD = baseMarketPrice / 1.35;
    const validation = validateEbayPrice(validatedData.referenceNumber, ebayMedianUSD);

    if (validation.referencePrice && !validation.isValid && validation.difference && validation.difference < -30) {
        baseMarketPrice = validation.referencePrice * 1.35;
    }

    // 5. Calculate Quote
    const pricingBreakdown = pricingCalculator.calculateQuote({
      baseMarketPrice,
      referenceNumber: validatedData.referenceNumber, 
      condition: validatedData.condition,
      hasBox: validatedData.hasBox,
      hasPapers: validatedData.hasPapers,
      hasOriginalBracelet: validatedData.hasOriginalBracelet,
      yearOfManufacture: validatedData.yearOfManufacture,
      isHighDemand: pricingCalculator.isHighDemandBrand(validatedData.brand),
    });

    // 6. Save Quote to Supabase
    const validUntil = new Date();
    validUntil.setHours(validUntil.getHours() + 72); 

    const quote = await prisma.quote.create({
      data: {
        customerEmail: validatedData.customerEmail,
        brand: validatedData.brand,
        model: "Submariner", 
        referenceNumber: validatedData.referenceNumber,
        condition: validatedData.condition,
        hasBox: validatedData.hasBox,
        hasPapers: validatedData.hasPapers,
        hasOriginalBracelet: validatedData.hasOriginalBracelet,
        hasServiceRecords: validatedData.hasServiceRecords,
        yearOfManufacture: validatedData.yearOfManufacture,
        baseMarketPrice,
        finalQuoteAmount: pricingBreakdown.finalQuote,
        calculationBreakdown: pricingBreakdown as any,
        validUntil,
        status: "ACTIVE"
      }
    });

    // 7. Log to SearchHistory (Fixed terminal code)
    await prisma.searchHistory.create({
      data: {
        brand: validatedData.brand,
        model: "Submariner",
        referenceNumber: validatedData.referenceNumber,
        yearOfManufacture: validatedData.yearOfManufacture,
        condition: validatedData.condition,
        totalListings: ebayListings.length,
        validListings: validListings.length,
        priceRangeMin: Math.min(...cleanedPrices),
        priceRangeMax: Math.max(...cleanedPrices),
        medianPrice: baseMarketPrice
      }
    });

    // 8. Trigger Email via Resend (non-fatal — quote is already saved)
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
    console.error("❌ Quote API Error:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
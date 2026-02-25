import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function review() {
  const quoteId = '98ab134f-3996-40c3-bb9b-3294dff9b129';
  
  const quote = await prisma.quote.findUnique({
    where: { id: quoteId },
  });

  if (!quote) {
    console.log("❌ Quote not found. Double check the ID in your .env or Supabase dashboard.");
    return;
  }

  console.log("\n--- 💎 MASTERPIECE LIVE QUOTE REVIEW ---");
  console.log(`ID: ${quote.id}`);
  console.log(`Customer: ${quote.customerEmail}`);
  console.log(`Watch: ${quote.brand} ${quote.referenceNumber}`);
  console.log(`Final Offer: $${quote.finalQuoteAmount.toLocaleString('en-CA')}`);
  console.log(`Valid Until: ${quote.validUntil}`);
  console.log("\n--- 📊 BREAKDOWN DATA ---");
  console.log(JSON.stringify(quote.calculationBreakdown, null, 2));
}

review().catch(console.error);
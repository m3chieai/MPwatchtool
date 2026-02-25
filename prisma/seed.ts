import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('💎 Starting seed: Rolex Material Test Suite...')

  const testCases = [
    { ref: "126610LN", brand: "Rolex", desc: "Steel Submariner", price: 15500, metal: "Steel" },
    { ref: "126613LB", brand: "Rolex", desc: "Two-Tone Submariner", price: 21000, metal: "Yellow Rolesor" },
    { ref: "126618LB", brand: "Rolex", desc: "Solid Gold Submariner", price: 52000, metal: "18k Yellow Gold" },
    { ref: "126334",   brand: "Rolex", desc: "Datejust 41", price: 14500, metal: "White Rolesor" },
    { ref: "228206",   brand: "Rolex", desc: "Day-Date 40", price: 75000, metal: "Platinum" }
  ]

  for (const item of testCases) {
    // Create a mock Quote for each material type
    const quote = await prisma.quote.create({
      data: {
        customerEmail: "seed@masterpiece.ca",
        brand: item.brand,
        model: item.desc,
        referenceNumber: item.ref,
        condition: "EXCELLENT",
        hasBox: true,
        hasPapers: true,
        yearOfManufacture: 2023,
        baseMarketPrice: item.price,
        finalQuoteAmount: item.price * 0.8, // Simple 20% margin for seed
        validUntil: new Date(Date.now() + 259200000), // 72 hrs
        status: "ACTIVE",
        calculationBreakdown: { seed: true, metal: item.metal } as any
      }
    })

    // Log the search history so it appears in your Admin backtesting view
    await prisma.searchHistory.create({
      data: {
        brand: item.brand,
        referenceNumber: item.ref,
        condition: "EXCELLENT",
        totalListings: 25,
        validListings: 20,
        priceRangeMin: item.price * 0.9,
        priceRangeMax: item.price * 1.1,
        medianPrice: item.price,
        quoteId: quote.id
      }
    })
  }

  console.log('✅ Seed complete: Admin Dashboard is now ready for verification.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
# Master Piece - Luxury Watch Marketplace

A dealer-direct luxury watch platform enabling customers to sell, trade, and buy high-end watches with transparent, market-indexed pricing and guaranteed offers.

## 🚀 Features (MVP)

- **Landing Page** - Conversion-optimized with competitive messaging
- **Instant Quoter** - Get guaranteed quotes in under 60 seconds
- **eBay API Integration** - Real-time sold listing data for accurate pricing
- **Year-Based Margin Calculation** - Automatic margin adjustments based on watch age
- **Market-Indexed Pricing** - Backed by real sold-market data
- **72-Hour Price Guarantee** - Locked pricing for customer confidence

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL database
- eBay Developer Account (credentials provided)

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
cd masterpiece-app
npm install
```

### 2. Database Setup

Create a PostgreSQL database:

```bash
# Using psql
createdb masterpiece

# Or using a GUI tool like pgAdmin, TablePlus, etc.
```

Update your `.env.local` file with your database credentials:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/masterpiece?schema=public"
```

### 3. Initialize Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (for production)
npm run db:migrate
```

### 4. Environment Variables

The `.env.local` file is already configured with your eBay API credentials:

```env
# eBay API (Already configured)
EBAY_APP_ID=[YOUR_EBAY_APP_ID]
EBAY_DEV_ID=[YOUR_EBAY_APP_ID]
EBAY_CERT_ID=[YOUR_EBAY_APP_ID]

# Update this with your database URL
DATABASE_URL="postgresql://user:password@localhost:5432/masterpiece"

# Generate secure secrets for production
JWT_SECRET=your_jwt_secret_change_in_production
NEXTAUTH_SECRET=your_nextauth_secret_change_in_production
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

## 📁 Project Structure

```
masterpiece-app/
├── app/
│   ├── api/
│   │   └── quotes/
│   │       └── create/
│   │           └── route.ts          # Quote generation API
│   ├── quote/
│   │   ├── page.tsx                  # Instant quoter form
│   │   └── [id]/
│   │       └── page.tsx              # Quote results page
│   ├── page.tsx                      # Landing page
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Global styles
├── lib/
│   ├── services/
│   │   ├── ebay.service.ts           # eBay API integration
│   │   └── pricing.service.ts        # Pricing calculator
│   └── prisma.ts                     # Prisma client
├── prisma/
│   └── schema.prisma                 # Database schema
├── .env.local                        # Environment variables
└── package.json                      # Dependencies
```

## 🎨 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **API Integration**: eBay Finding API
- **Deployment**: Vercel-ready

## 🔧 Key Components

### 1. eBay Service (`lib/services/ebay.service.ts`)

Handles all eBay API interactions:
- Search for sold listings
- Parse and clean data
- Filter invalid listings
- Remove statistical outliers
- Convert USD to CAD
- Extract watch details from titles

### 2. Pricing Calculator (`lib/services/pricing.service.ts`)

Calculates quotes with year-based margins:
- **0-5 years**: 15% margin
- **6-10 years**: 20% margin
- **11-20 years**: 30% margin
- Applies condition, box/papers, and liquidity multipliers

### 3. Quote Generation API (`app/api/quotes/create/route.ts`)

- Validates input data
- Fetches eBay sold listings
- Calculates market median
- Generates quote with full breakdown
- Stores quote in database
- Returns quote ID and details

## 📊 Database Schema

### Key Tables

- **users** - User authentication
- **dealers** - Dealer accounts and verification
- **quotes** - Generated customer quotes
- **ebay_sold_listings** - eBay market data
- **pricing_index** - Approved pricing references
- **dealer_pricing_preferences** - Custom pricing adjustments

## 🚀 Deployment to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables:
   - `DATABASE_URL` (use Vercel Postgres or external provider)
   - `EBAY_APP_ID`
   - `EBAY_DEV_ID`
   - `EBAY_CERT_ID`
   - `EBAY_FINDING_API_URL`
   - `JWT_SECRET`
   - `NEXTAUTH_SECRET`
4. Deploy!

### 3. Set up Vercel Postgres (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Link project
vercel link

# Create Postgres database
vercel postgres create

# Pull environment variables
vercel env pull .env.local

# Push database schema
npm run db:push
```

## 🧪 Testing the Quote Flow

### Test Quote Example:

1. Go to http://localhost:3000
2. Click "Get Instant Quote"
3. Fill in the form:
   - Brand: Rolex
   - Reference: 116610LN
   - Condition: Excellent
   - Year: 2020
   - Has Box: Yes
   - Has Papers: Yes
4. Click "Get My Instant Quote"
5. View your quote with full breakdown!

## 📈 What's Included in MVP

✅ **Landing Page**
- Hero section with CTA
- Value propositions
- Competitive comparison table
- How it works sections
- Testimonials
- Footer with links

✅ **Instant Quoter**
- Multi-step form
- Brand/model selection
- Condition selector (visual cards)
- Box & papers checkboxes
- Year selection
- Real-time validation

✅ **Quote Results**
- Large quote display
- Quote ID and expiration
- Watch details summary
- Full pricing breakdown (collapsible)
- Reconditioning explanation
- Next steps guide
- CTAs for booking

✅ **Backend**
- eBay API integration
- Pricing calculator with year-based margins
- Quote persistence
- Data validation
- Error handling

## 🔄 Next Steps (Phase 2)

- [ ] Dealer authentication system
- [ ] Pricing engine dashboard
- [ ] Admin approval workflows
- [ ] Email notifications
- [ ] Appointment booking
- [ ] Customer accounts
- [ ] Inventory marketplace

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Test database connection
npx prisma studio

# Reset database
npx prisma migrate reset
```

### eBay API Errors

- Verify credentials in `.env.local`
- Check eBay API status
- Ensure you're not exceeding rate limits (5,000 calls/day)

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Environment Variables Reference

```env
# eBay API
EBAY_APP_ID=[YOUR_EBAY_APP_ID]
EBAY_DEV_ID=[YOUR_EBAY_APP_ID]
EBAY_CERT_ID=[YOUR_EBAY_APP_ID]
EBAY_FINDING_API_URL=https://svcs.ebay.com/services/search/FindingService/v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/masterpiece

# Auth (generate secure random strings)
JWT_SECRET=your-secret-here
NEXTAUTH_SECRET=your-secret-here

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## 🎯 Key Features Details

### Year-Based Margin System

The pricing engine automatically applies different margins based on watch age:

- **Recent watches (0-5 years)**: 15% margin
  - Lower reconditioning costs
  - Higher turnover
  
- **Mid-age watches (6-10 years)**: 20% margin
  - Standard reconditioning required
  - Moderate service costs

- **Older watches (11+ years)**: 30% margin
  - Extensive reconditioning needed
  - Potential parts replacement
  - Specialized restoration expertise

### Pricing Calculation Flow

```
Base Market Price (eBay median)
  × Condition Multiplier (0.68 - 1.00)
  × Box & Papers Multiplier (1.00 - 1.08)
  × Liquidity Multiplier (0.92 - 1.05)
  = Subtotal
  - Risk Buffer ($500)
  - Year-Based Margin (15%, 20%, or 30%)
  = Final Quote
```

## 📞 Support

For questions or issues:
- Check the troubleshooting section
- Review Prisma docs: https://www.prisma.io/docs
- Review Next.js docs: https://nextjs.org/docs
- eBay API docs: https://developer.ebay.com/

## 📄 License

Proprietary - Master Piece © 2026

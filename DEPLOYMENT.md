# Master Piece - Vercel Deployment Guide

## 🚀 Quick Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
cd masterpiece-app
vercel

# Follow the prompts:
# - Link to existing project? No
# - Project name: masterpiece-watch-marketplace
# - Directory: ./
# - Override settings? No
```

### Option 2: Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Master Piece MVP"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   
   Add these in Vercel Dashboard → Settings → Environment Variables:
   
   ```
   DATABASE_URL=postgresql://user:password@host:5432/masterpiece
   EBAY_APP_ID=[YOUR_EBAY_APP_ID]
   EBAY_DEV_ID=[YOUR_EBAY_APP_ID]
   EBAY_CERT_ID=[YOUR_EBAY_APP_ID]
   EBAY_FINDING_API_URL=https://svcs.ebay.com/services/search/FindingService/v1
   JWT_SECRET=your_production_jwt_secret_min_32_chars
   NEXTAUTH_SECRET=your_production_nextauth_secret_min_32_chars
   NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

## 🗄️ Database Options

### Option A: Vercel Postgres (Easiest)

```bash
# Create Vercel Postgres database
vercel postgres create masterpiece-db

# This automatically:
# - Creates a PostgreSQL database
# - Sets up DATABASE_URL environment variable
# - Configures connection pooling

# Pull environment variables locally
vercel env pull .env.local

# Push database schema
npm run db:push
```

**Pricing**: Free tier includes 256 MB storage, suitable for MVP

### Option B: External PostgreSQL

Use any PostgreSQL provider:

**Recommended Providers:**
- [Neon](https://neon.tech) - Serverless Postgres, generous free tier
- [Supabase](https://supabase.com) - Free tier with 500 MB
- [Railway](https://railway.app) - Simple deployment
- [AWS RDS](https://aws.amazon.com/rds/) - Production-grade

**Setup:**
1. Create database on chosen provider
2. Get connection string
3. Add to Vercel environment variables as `DATABASE_URL`
4. Run migrations:
   ```bash
   # Set DATABASE_URL locally
   export DATABASE_URL="your_connection_string"
   
   # Push schema
   npm run db:push
   ```

## 🔐 Generate Production Secrets

```bash
# Generate secure JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate secure NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add these to Vercel environment variables.

## 🌐 Custom Domain

### Add Domain to Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `masterpiece.com`)
3. Follow DNS configuration instructions

### Update Environment Variables

```
NEXT_PUBLIC_APP_URL=https://masterpiece.com
```

## 📊 Post-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database connected and schema pushed
- [ ] Landing page loads correctly
- [ ] Instant quoter form works
- [ ] Quote generation API returns results
- [ ] Quote results page displays properly
- [ ] eBay API integration working
- [ ] No console errors in production

## 🧪 Test Deployment

### 1. Test Landing Page
Visit: `https://your-domain.vercel.app`

### 2. Test Quote Generation
1. Click "Get Instant Quote"
2. Fill in form:
   - Brand: Rolex
   - Reference: 116610LN
   - Condition: Excellent
   - Year: 2020
   - Has Box: Yes
   - Has Papers: Yes
3. Submit and verify quote appears

### 3. Check API Routes
Visit: `https://your-domain.vercel.app/api/quotes/create`
Should return 405 Method Not Allowed (means route exists)

## 🔍 Debugging Deployment Issues

### Build Fails

```bash
# Test build locally
npm run build

# Common fixes:
# - Check TypeScript errors
# - Verify all imports are correct
# - Ensure all environment variables are set
```

### Runtime Errors

Check Vercel logs:
1. Go to Deployments
2. Click on your deployment
3. View Function Logs

Common issues:
- Database connection errors → Check DATABASE_URL
- eBay API errors → Verify API credentials
- Missing environment variables

### Database Connection Issues

```bash
# Test connection locally with production DATABASE_URL
export DATABASE_URL="your_production_database_url"
npx prisma studio

# If successful, database is accessible
# If fails, check:
# - Firewall rules allow Vercel IPs
# - Connection string is correct
# - Database is running
```

## 🚀 CI/CD Setup

Vercel automatically deploys on git push:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Vercel will automatically:
# 1. Build your project
# 2. Run tests (if configured)
# 3. Deploy to production (main branch)
# 4. Deploy to preview (other branches)
```

## 📈 Monitoring & Analytics

### Vercel Analytics (Built-in)

Enable in Project Settings → Analytics:
- Page views
- Unique visitors
- Top pages
- Performance metrics

### Custom Analytics

Add to `app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

## 🔄 Database Migrations

### Development to Production

```bash
# 1. Create migration locally
npx prisma migrate dev --name add_new_feature

# 2. Commit migration files
git add prisma/migrations
git commit -m "Add new feature migration"

# 3. Push to GitHub
git push

# 4. Vercel will automatically run migrations on deploy
# Or manually run:
vercel env pull
npx prisma migrate deploy
```

## 💰 Estimated Costs

**Free Tier (Sufficient for MVP):**
- Vercel: Free (Hobby plan)
- Vercel Postgres: Free tier (256 MB)
- eBay API: Free (5,000 calls/day)
- **Total**: $0/month

**Scaling (For Production):**
- Vercel Pro: $20/month
- Vercel Postgres: $20/month (1 GB)
- Or external database: $15-50/month
- **Total**: ~$40-70/month

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Guide](https://www.prisma.io/docs/guides/deployment)
- [eBay API Documentation](https://developer.ebay.com/docs)

## 🆘 Getting Help

If you encounter issues:

1. Check Vercel deployment logs
2. Review database connection
3. Verify environment variables
4. Test locally with `npm run build && npm start`
5. Check GitHub Issues or Vercel Community

## 🎉 Success!

Once deployed, share your links:
- Production: `https://masterpiece.vercel.app`
- GitHub: `https://github.com/yourusername/masterpiece`

Your Master Piece MVP is now live! 🚀

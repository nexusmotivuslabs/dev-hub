# Vercel Deployment Guide - Dev Hub

Complete guide for deploying Dev Hub to Vercel.

## Prerequisites

- ✅ Code pushed to GitHub repository
- ✅ Vercel account (free tier works)
- ✅ Node.js 18+ installed locally (for migrations)

## Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)

1. **Create Vercel Postgres Database**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to your project → **Storage** tab
   - Click **Create Database** → **Postgres**
   - Choose a name (e.g., `dev-hub-db`)
   - Select region closest to your users

2. **Environment Variables Auto-Added**
   Vercel automatically adds these:
   - `POSTGRES_URL` - Connection string with pooling
   - `POSTGRES_PRISMA_URL` - Prisma-compatible connection string
   - `POSTGRES_URL_NON_POOLING` - Direct connection (for migrations)

3. **Configure Prisma**
   In Vercel project settings → **Environment Variables**, add:
   ```env
   DATABASE_URL=$POSTGRES_PRISMA_URL
   ```

### Option B: External PostgreSQL

If using external database (AWS RDS, Supabase, etc.):

```env
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require
```

## Step 2: Environment Variables

Add these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

### Required Variables

```env
# Database (from Vercel Postgres or external)
DATABASE_URL=$POSTGRES_PRISMA_URL

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-characters

# Environment
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Optional Variables

```env
# Notion Integration (if using)
NOTION_API_KEY=secret_your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id

# Custom API URL (if needed)
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

## Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click **Add New Project**
   - Import your GitHub repository
   - Vercel auto-detects Next.js

2. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (or `dev-hub` if in monorepo)
   - **Build Command**: `npm run build` (or `cd dev-hub && npm run build`)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install`

3. **Add Environment Variables**
   - Add all variables from Step 2
   - Apply to: **Production**, **Preview**, **Development**

4. **Deploy**
   - Click **Deploy**
   - Wait for build to complete

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd dev-hub
vercel

# Follow prompts:
# - Link to existing project? (or create new)
# - Override settings? (No)
```

## Step 4: Run Database Migrations

After first deployment, run migrations:

### Option A: Via Vercel CLI (Recommended)

```bash
# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy
```

### Option B: Via Vercel Dashboard

1. Go to project → **Settings** → **Functions**
2. Add build command that includes migrations:
   ```json
   {
     "buildCommand": "prisma generate && prisma migrate deploy && next build"
   }
   ```

### Option C: Manual Migration Script

Create a one-time migration script:

```bash
# Run on Vercel CLI or via GitHub Actions
vercel env pull .env.local
npx prisma migrate deploy
```

## Step 5: Verify Deployment

1. **Check Build Logs**
   - Vercel Dashboard → **Deployments** → Click latest deployment
   - Verify build completed successfully

2. **Test Application**
   - Visit your Vercel URL (e.g., `https://dev-hub.vercel.app`)
   - Test authentication
   - Verify database connections

3. **Check Database**
   ```bash
   # Connect to Vercel Postgres
   vercel env pull .env.local
   npx prisma studio
   ```

## Step 6: Custom Domain (Optional)

1. **Add Domain**
   - Vercel Dashboard → **Settings** → **Domains**
   - Add your domain (e.g., `dev-hub.yourdomain.com`)

2. **Configure DNS**
   - Add CNAME record pointing to Vercel
   - Vercel provides exact DNS instructions

## Troubleshooting

### Build Fails: Prisma Client Not Generated

**Error**: `PrismaClientConstructorValidationError`

**Solution**: Add to `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build"
  }
}
```

### Database Connection Errors

**Error**: `Can't reach database server`

**Solutions**:
1. Verify `DATABASE_URL` is set correctly
2. Check database is running (Vercel Postgres)
3. Verify SSL mode if using external database
4. Check firewall rules (external databases)

### Environment Variables Not Loading

**Error**: `process.env.VARIABLE is undefined`

**Solutions**:
1. Verify variable is added in Vercel Dashboard
2. Ensure variable is applied to correct environment (Production/Preview)
3. Redeploy after adding variables
4. Check variable name matches code exactly

### Migration Errors

**Error**: `Migration failed`

**Solutions**:
1. Run migrations locally first: `npm run db:migrate`
2. Check migration files are committed to git
3. Verify `DATABASE_URL` is correct
4. Use `prisma migrate deploy` for production (not `migrate dev`)

## Production Checklist

- [ ] Database created and connected
- [ ] All environment variables set
- [ ] JWT_SECRET generated (32+ characters)
- [ ] Database migrations run successfully
- [ ] Build completes without errors
- [ ] Application accessible at Vercel URL
- [ ] Authentication working
- [ ] Database queries working
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic with Vercel)

## Next Steps

After successful deployment:

1. **Set up Monitoring**
   - Vercel Analytics (built-in)
   - Error tracking (Sentry, etc.)

2. **Configure CI/CD**
   - Automatic deployments on push to main
   - Preview deployments for PRs

3. **Set up Backups**
   - Vercel Postgres: Automatic backups
   - External DB: Configure backup strategy

4. **Performance Optimization**
   - Enable Vercel Edge Functions (if needed)
   - Configure caching headers
   - Optimize images (Next.js Image component)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

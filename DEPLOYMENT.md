# Deployment Guide - Dev Hub

This guide covers deploying Dev Hub to Vercel with PostgreSQL database.

## Prerequisites

- Node.js 18+ installed locally
- Git repository set up
- Vercel account (free tier works)
- PostgreSQL database (Vercel Postgres recommended)

## Database Setup

### Option 1: Vercel Postgres (Recommended)

1. In Vercel Dashboard, go to your project
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL` (use this for Prisma)
   - `POSTGRES_URL_NON_POOLING`

4. In Vercel project settings, add:
   ```env
   DATABASE_URL=$POSTGRES_PRISMA_URL
   ```

### Option 2: External PostgreSQL (AWS RDS, Supabase, etc.)

1. Create PostgreSQL database
2. Get connection string: `postgresql://user:password@host:port/database`
3. In Vercel project settings, add:
   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

## Environment Variables

Add these in **Vercel Dashboard** → **Settings** → **Environment Variables**:

### Required

```env
DATABASE_URL=postgresql://... (connection string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
```

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

### Optional (for Notion integration)

```env
NOTION_API_KEY=secret_your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

## Deployment Steps

### 1. Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment with Prisma"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click **Add New Project**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js

**Option B: Via Vercel CLI**
```bash
npm i -g vercel
vercel
```

### 3. Configure Environment Variables

In Vercel Dashboard → **Settings** → **Environment Variables**, add:
- `DATABASE_URL` (from Vercel Postgres or your provider)
- `JWT_SECRET` (generate with `openssl rand -base64 32`)
- `NOTION_API_KEY` (optional)
- `NOTION_DATABASE_ID` (optional)

### 4. Run Database Migrations

After first deployment, run migrations:

**Option A: Via Vercel CLI**
```bash
vercel env pull .env.local  # Get environment variables
npx prisma migrate deploy
```

**Option B: Via Vercel Dashboard**
1. Go to **Deployments**
2. Click on your deployment
3. Go to **Functions** tab
4. Run migration command in terminal (if available)

**Option C: Create Migration Script**
Create a one-time migration script that runs on first deployment, or run manually via Vercel CLI.

### 5. Verify Deployment

1. Visit your Vercel deployment URL
2. Test authentication (signup/login)
3. Check admin panel (if you have admin user)
4. Review logs in Vercel Dashboard

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Local Database

**Option A: Docker PostgreSQL**
```bash
docker run -d \
  --name dev-hub-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=devhub \
  -p 5432:5432 \
  postgres:15
```

**Option B: Local PostgreSQL**
```bash
createdb devhub
```

### 3. Environment Variables

Create `.env.local`:
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/devhub
JWT_SECRET=dev-secret-change-in-production-min-32-chars
NODE_ENV=development

# Optional
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
```

### 4. Run Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Database Migrations

### Create Migration

```bash
npm run db:migrate
```

This will:
- Generate Prisma Client
- Create migration files
- Apply migration to database

### Deploy Migrations (Production)

```bash
npm run db:migrate:deploy
```

This runs migrations without prompting (for CI/CD).

### Reset Database (Development Only)

```bash
npx prisma migrate reset
```

⚠️ **Warning**: This deletes all data!

## Troubleshooting

### Build Fails

**Error: "Prisma Client not generated"**
```bash
npm run db:generate
npm run build
```

**Error: "DATABASE_URL not found"**
- Check environment variables in Vercel Dashboard
- Ensure `DATABASE_URL` is set correctly

### Database Connection Issues

**Vercel Postgres:**
- Use `POSTGRES_PRISMA_URL` (has connection pooling)
- Not `POSTGRES_URL` (no pooling)

**Connection Timeout:**
- Check database is accessible
- Verify firewall rules
- Test connection string locally

### Migration Errors

**"Migration failed"**
```bash
# Check migration status
npx prisma migrate status

# View migration history
npx prisma migrate resolve --applied <migration_name>
```

## Post-Deployment

### Monitoring

- Check Vercel Dashboard → **Logs** for errors
- Monitor database connections in Vercel Postgres dashboard
- Set up error tracking (Sentry, etc.)

### Database Backup

- Vercel Postgres: Automatic backups (check plan)
- External databases: Set up automated backups
- Export data: `pg_dump <connection_string> > backup.sql`

### Scaling

- Database connection pooling is handled automatically with Prisma
- Vercel serverless functions scale automatically
- Monitor usage in Vercel Dashboard

## Database Providers Comparison

| Provider | Pros | Cons | Best For |
|----------|------|------|----------|
| **Vercel Postgres** | ✅ Integrated, easy setup, automatic backups | ❌ Vendor lock-in, pricing | Vercel deployments |
| **AWS RDS** | ✅ Full control, scalable, enterprise features | ❌ Complex setup, more expensive | Enterprise, AWS users |
| **Supabase** | ✅ Free tier, real-time features, auth | ❌ Additional features you might not need | Startups, MVPs |
| **Railway** | ✅ Simple, good pricing, easy migrations | ❌ Smaller company | Small to medium projects |

## Support

- [Prisma Docs](https://www.prisma.io/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)


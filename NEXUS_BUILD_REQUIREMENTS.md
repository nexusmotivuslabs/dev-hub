# Dev Hub - Build Requirements for Nexus Team

**Project**: Developer Hub  
**Date**: 2025-01-27  
**Status**: Ready for Build  
**Team**: Nexus

---

## 🎯 Overview

This document outlines all requirements and steps needed to successfully build the Developer Hub application.

---

## 📋 Prerequisites

### Required Software
- **Node.js**: 18.x or higher
- **npm**: 9.x or higher (comes with Node.js)
- **PostgreSQL**: 15.x or higher (for database)
- **Git**: Latest version

### Required Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (REQUIRED for build)
- `JWT_SECRET` - Secret key for JWT tokens (REQUIRED)
- `NODE_ENV` - Environment (development/production)

### Optional Environment Variables
- `NOTION_API_KEY` - For Notion integration (optional)
- `NOTION_DATABASE_ID` - For Notion integration (optional)

---

## 🔧 Build Requirements

### 1. Database Setup

**CRITICAL**: The build requires a valid `DATABASE_URL`. Prisma Client initializes during build and needs a connection string.

#### Option A: Local PostgreSQL
```bash
# Start PostgreSQL (if using Docker)
docker run -d \
  --name dev-hub-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=devhub \
  -p 5432:5432 \
  postgres:15

# Set DATABASE_URL
export DATABASE_URL="postgresql://postgres:password@localhost:5432/devhub"
```

#### Option B: Dummy URL for Build (Build Only)
```bash
# Use a dummy URL just for build (won't work at runtime)
export DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
```

**Note**: If using a dummy URL, the build will succeed but the app won't work at runtime. Ensure a real database is configured before deployment.

### 2. Environment Variables Setup

Create `.env.local` file in the `dev-hub/` directory:

```bash
# Database (REQUIRED)
DATABASE_URL="postgresql://postgres:password@localhost:5432/devhub"

# JWT Secret (REQUIRED)
JWT_SECRET="your-secret-key-here-minimum-32-characters-long-for-security"

# Environment
NODE_ENV="development"

# Optional: Notion Integration
NOTION_API_KEY="your_notion_api_key"
NOTION_DATABASE_ID="your_notion_database_id"
```

**Generate JWT Secret**:
```bash
openssl rand -base64 32
```

### 3. Install Dependencies

```bash
cd dev-hub
npm install
```

---

## 🏗️ Build Process

### Step 1: Verify Prerequisites
```bash
# Check Node.js version
node --version  # Should be 18.x or higher

# Check npm version
npm --version  # Should be 9.x or higher

# Verify DATABASE_URL is set
echo $DATABASE_URL
```

### Step 2: Generate Prisma Client
```bash
npm run db:generate
```

This generates the Prisma Client based on the schema.

### Step 3: Run Database Migrations (Optional for Build)
```bash
# Only needed if database doesn't exist yet
npm run db:migrate
```

**Note**: For build, migrations aren't strictly required, but Prisma needs the schema to be valid.

### Step 4: Build the Application
```bash
npm run build
```

**Expected Output**:
```
✔ Generated Prisma Client
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### Step 5: Verify Build
```bash
# Check build output
ls -la .next/

# Start production server (optional test)
npm start
```

---

## ⚠️ Common Build Issues & Solutions

### Issue 1: Prisma Client Validation Error
**Error**:
```
PrismaClientConstructorValidationError: Using engine type "client" requires either "adapter" or "accelerateUrl"
```

**Solution**:
- Ensure `DATABASE_URL` is set in environment
- Format: `postgresql://user:password@host:port/database`
- For build, a dummy URL works but real URL needed for runtime

### Issue 2: TypeScript Errors
**Error**: Type errors in code

**Solution**:
- Run `npm run lint` to identify issues
- Fix TypeScript errors before building
- All known TypeScript errors have been fixed

### Issue 3: Missing Dependencies
**Error**: Module not found

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: Database Connection During Build
**Error**: Cannot connect to database

**Solution**:
- Build doesn't require active database connection
- Only needs valid `DATABASE_URL` format
- Database connection happens at runtime

---

## 📦 Build Output

### Successful Build Creates:
- `.next/` - Next.js build output
- `node_modules/.prisma/` - Generated Prisma Client
- Static pages and optimized assets

### Build Artifacts:
- Server-side code in `.next/server/`
- Client-side code in `.next/static/`
- Optimized images and assets

---

## 🚀 Production Build Checklist

Before deploying to production:

- [ ] `DATABASE_URL` set to production database
- [ ] `JWT_SECRET` set to secure random string (32+ chars)
- [ ] `NODE_ENV=production` set
- [ ] Database migrations run (`npm run db:migrate:deploy`)
- [ ] Build completes successfully (`npm run build`)
- [ ] Production server starts (`npm start`)
- [ ] All environment variables configured in deployment platform

---

## 🔍 Build Verification

### Verify Build Success:
```bash
# 1. Check build completed
npm run build

# 2. Check for errors (should be none)
echo $?  # Should be 0

# 3. Verify .next directory exists
ls -la .next/

# 4. Test production build locally
npm start
# Visit http://localhost:3000
```

### Expected Build Time:
- First build: ~30-60 seconds
- Subsequent builds: ~15-30 seconds
- With cache: ~10-20 seconds

---

## 📝 Build Scripts Reference

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations (development)
npm run db:migrate

# Run migrations (production)
npm run db:migrate:deploy

# Build application
npm run build

# Start production server
npm start

# Development server
npm run dev

# Lint code
npm run lint
```

---

## 🌐 Deployment Platforms

### Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Vercel automatically runs `npm run build`
4. Database: Use Vercel Postgres or external PostgreSQL

### Other Platforms
- **Railway**: Supports PostgreSQL, auto-builds
- **Render**: Supports PostgreSQL, auto-builds
- **AWS/GCP/Azure**: Requires manual setup

---

## 🔐 Security Notes

### Environment Variables
- **Never commit** `.env.local` to git
- Use platform-specific secret management
- Rotate `JWT_SECRET` regularly
- Use strong, random `JWT_SECRET` (32+ characters)

### Database
- Use connection pooling in production
- Enable SSL for database connections
- Use read replicas for scaling
- Regular backups required

---

## 📊 Build Performance

### Optimization Tips:
1. **Use Build Cache**: `.next/cache/` speeds up rebuilds
2. **Incremental Builds**: Only changed files rebuild
3. **Static Generation**: Most pages are statically generated
4. **Code Splitting**: Automatic code splitting for optimal bundles

### Build Size Targets:
- Initial JS bundle: < 200KB
- Total build size: < 50MB
- Static assets: Optimized automatically

---

## 🐛 Troubleshooting

### Build Fails with Prisma Error
1. Check `DATABASE_URL` is set
2. Verify Prisma schema is valid: `npx prisma validate`
3. Regenerate Prisma Client: `npm run db:generate`

### Build Succeeds but App Fails at Runtime
1. Check database is accessible
2. Verify migrations are run
3. Check environment variables are set correctly
4. Review server logs for errors

### Type Errors During Build
1. Run `npm run lint` to see all errors
2. Fix TypeScript errors
3. Ensure all imports are correct
4. Check for missing type definitions

---

## ✅ Build Success Criteria

A successful build should:
- ✅ Complete without errors
- ✅ Generate `.next/` directory
- ✅ Pass TypeScript type checking
- ✅ Pass ESLint checks
- ✅ Generate Prisma Client successfully
- ✅ Create optimized production bundles

---

## 📞 Support

### If Build Fails:
1. Check this document first
2. Review error messages carefully
3. Verify all prerequisites are met
4. Check `BUILD_FIX.md` for specific fixes
5. Review `NEXUS_REFACTORING_BRIEF.md` for context

### Common Commands:
```bash
# Clean build
rm -rf .next node_modules/.cache
npm run build

# Full clean rebuild
rm -rf .next node_modules
npm install
npm run build

# Check Prisma
npx prisma validate
npm run db:generate
```

---

## 📚 Related Documents

- `NEXUS_REFACTORING_BRIEF.md` - Complete refactoring requirements
- `NEXUS_DELEGATION.md` - Delegation handoff document
- `BUILD_FIX.md` - Build troubleshooting guide
- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment instructions

---

**Status**: Ready for Nexus Team  
**Last Updated**: 2025-01-27  
**Next Step**: Nexus team to review and execute build

---

*This document should be updated as build process evolves.*


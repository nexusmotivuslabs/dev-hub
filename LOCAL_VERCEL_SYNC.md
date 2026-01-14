# Keeping Local Development in Sync with Vercel

This guide helps ensure your local development environment matches what's running in Vercel production.

## Quick Checklist

Before deploying, verify:
- [ ] Node.js version matches (use `node --version`, should be 20.x)
- [ ] Environment variables match (compare `.env.local` with Vercel dashboard)
- [ ] Production build works locally (`npm run build:production`)
- [ ] No local-only dependencies or configurations
- [ ] Database schema is up to date (migrations applied)

## 1. Node.js Version Sync

Vercel uses Node.js 20.x by default. Keep your local environment in sync:

### Using NVM (Recommended)
```bash
# Install Node.js 20 if not already installed
nvm install 20
nvm use 20

# Auto-switch when entering directory (add to your shell profile)
echo 'export NVM_DIR="$HOME/.nvm"' >> ~/.zshrc
echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"' >> ~/.zshrc
echo 'autoload -U add-zsh-hook' >> ~/.zshrc
echo 'load-nvmrc() {' >> ~/.zshrc
echo '  local node_version="$(nvm version)"' >> ~/.zshrc
echo '  local nvmrc_path="$(nvm_find_nvmrc)"' >> ~/.zshrc
echo '  if [ -n "$nvmrc_path" ]; then' >> ~/.zshrc
echo '    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")' >> ~/.zshrc
echo '    if [ "$nvmrc_node_version" != "N/A" ] && [ "$nvmrc_node_version" != "$node_version" ]; then' >> ~/.zshrc
echo '      nvm use' >> ~/.zshrc
echo '    fi' >> ~/.zshrc
echo '  fi' >> ~/.zshrc
echo '}' >> ~/.zshrc
echo 'add-zsh-hook chpwd load-nvmrc' >> ~/.zshrc
echo 'load-nvmrc' >> ~/.zshrc
```

### Verify Version
```bash
node --version  # Should output v20.x.x
```

## 2. Environment Variables Sync

### Pull Vercel Environment Variables
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Pull production environment variables (creates .env.vercel)
npm run sync:env

# Compare with local .env.local
diff .env.local .env.vercel
```

### Required Environment Variables
Ensure these are set in both local and Vercel:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key (generate: `openssl rand -base64 32`)
- `NODE_ENV` - Set to `production` in Vercel, `development` locally

### Create .env.local from Example
```bash
cp .env.example .env.local
# Edit .env.local with your local values
```

## 3. Test Production Build Locally

Before pushing to main, test the production build:

```bash
# Build with production environment
npm run build:production

# Test the production build
npm run test:build

# Or manually test
npm run build
npm start
# Visit http://localhost:3000 and verify everything works
```

## 4. Build Command Verification

Ensure your build command matches Vercel:
- **Local**: `npm run build` → runs `prisma generate && next build`
- **Vercel**: Uses `vercel-build` script (same command)

Verify in `package.json`:
```json
{
  "scripts": {
    "build": "prisma generate && next build",
    "vercel-build": "prisma generate && next build"
  }
}
```

## 5. Database Schema Sync

Keep database schema in sync:

```bash
# Generate Prisma Client
npm run db:generate

# Check for pending migrations
npx prisma migrate status

# Apply migrations locally
npm run db:migrate

# After deploying to Vercel, apply migrations:
vercel env pull .env.local
npx prisma migrate deploy
```

## 6. Pre-Deployment Checklist

Before pushing to main:

```bash
# 1. Verify Node.js version
node --version  # Should be 20.x

# 2. Pull latest changes
git pull origin main

# 3. Install dependencies
npm ci  # Use ci instead of install for clean install

# 4. Test production build
npm run build:production

# 5. Run tests (if you have them)
npm test

# 6. Lint code
npm run lint

# 7. Check for TypeScript errors
npx tsc --noEmit

# 8. Start production server and test
npm start
# Test in browser at http://localhost:3000
```

## 7. Common Divergence Issues

### Issue: Different Node.js versions
**Symptom**: Build works locally but fails in Vercel
**Solution**: Use `.nvmrc` file and `engines` in `package.json`

### Issue: Missing environment variables
**Symptom**: App works locally but crashes in production
**Solution**: Compare `.env.local` with Vercel dashboard environment variables

### Issue: Database schema mismatch
**Symptom**: Prisma errors or missing tables in production
**Solution**: Run migrations in production: `npx prisma migrate deploy`

### Issue: Different dependency versions
**Symptom**: Different behavior between local and production
**Solution**: Use `npm ci` instead of `npm install` to match `package-lock.json`

### Issue: Local-only code paths
**Symptom**: Code works locally but fails in production
**Solution**: Check for `process.env.NODE_ENV === 'development'` conditionals

## 8. Automated Sync Script

Create a sync script (optional):

```bash
#!/bin/bash
# sync-with-vercel.sh

echo "🔄 Syncing local environment with Vercel..."

# Pull environment variables
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.vercel

# Compare versions
echo "📊 Checking versions..."
echo "Local Node.js: $(node --version)"
echo "Expected: v20.x.x (see .nvmrc)"

# Test build
echo "🏗️  Testing production build..."
npm run build:production

echo "✅ Sync complete! Review differences in .env files if needed."
```

## 9. Git Hooks (Optional)

Add pre-push hook to test build before pushing:

```bash
# .git/hooks/pre-push
#!/bin/bash

echo "Running pre-push checks..."

# Test build
npm run build:production || {
  echo "❌ Production build failed!"
  exit 1
}

echo "✅ Pre-push checks passed"
```

## 10. Vercel Configuration

Verify `vercel.json` matches expected build:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

## Quick Reference Commands

```bash
# Pull Vercel env vars
npm run sync:env

# Test production build
npm run build:production

# Start production server locally
npm start

# Check Node version
node --version

# Check for dependency updates
npm outdated

# Verify Prisma schema
npx prisma validate
```

## Additional Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)

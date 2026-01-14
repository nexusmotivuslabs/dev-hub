#!/bin/bash

# Sync local development environment with Vercel production
# Usage: ./scripts/sync-with-vercel.sh

set -e

echo "🔄 Syncing local environment with Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "❌ Vercel CLI not found. Install it with: npm i -g vercel"
  exit 1
fi

# Pull environment variables from Vercel
echo "📥 Pulling environment variables from Vercel..."
vercel env pull .env.vercel || {
  echo "⚠️  Could not pull from Vercel. Make sure you're logged in: vercel login"
  exit 1
}

# Compare Node.js version
echo ""
echo "📊 Checking Node.js version..."
NODE_VERSION=$(node --version)
EXPECTED_VERSION=$(cat .nvmrc)
echo "Local Node.js: $NODE_VERSION"
echo "Expected (from .nvmrc): v${EXPECTED_VERSION}"

if [[ "$NODE_VERSION" != "v${EXPECTED_VERSION}"* ]]; then
  echo "⚠️  Warning: Node.js version mismatch! Use 'nvm use' to switch."
fi

# Compare environment variables
echo ""
echo "🔍 Comparing environment variables..."
if [ -f .env.local ]; then
  echo "Comparing .env.local with .env.vercel..."
  diff .env.local .env.vercel 2>/dev/null || echo "⚠️  Environment variables differ. Review manually."
else
  echo "⚠️  .env.local not found. Create it from .env.example"
fi

# Test production build
echo ""
echo "🏗️  Testing production build..."
npm run build:production || {
  echo "❌ Production build failed!"
  exit 1
}

echo ""
echo "✅ Sync complete!"
echo ""
echo "Next steps:"
echo "  1. Review differences: diff .env.local .env.vercel"
echo "  2. Test production build: npm run build:production"
echo "  3. Test locally: npm start"

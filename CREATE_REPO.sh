#!/bin/bash
# Script to create GitHub repository and push code

set -e

echo "🚀 Creating GitHub repository for dev-hub..."
echo ""

# Check if already authenticated
if ! gh auth status &>/dev/null; then
    echo "⚠️  Not authenticated with GitHub CLI"
    echo "Run: gh auth login"
    exit 1
fi

# Create repository (private by default, use --public for public)
echo "Creating repository on GitHub..."
gh repo create dev-hub \
    --private \
    --description "Developer Hub - Centralized knowledge base with Prisma + PostgreSQL" \
    --source=. \
    --remote=origin \
    --push

echo ""
echo "✅ Repository created and code pushed!"
echo ""
echo "Repository URL:"
gh repo view --web

echo ""
echo "Next steps:"
echo "1. Visit your repository on GitHub"
echo "2. Deploy to Vercel: https://vercel.com/new"
echo "3. Follow DEPLOYMENT.md for database setup"


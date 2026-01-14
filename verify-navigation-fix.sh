#!/bin/bash

# Verification script for navigation 404 fix
# Tests navigation links with special characters

echo "========================================="
echo "Navigation 404 Fix Verification"
echo "========================================="
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test cases - paths that previously returned 404
test_cases=(
  "/domains/nexus-agents/agents/Agent%20—%20Architect%20%28Principal%20Engineer%29"
  "/domains/nexus-agents/agents/Agent%20—%20Catalyst%20%28Product%20Owner%29"
  "/domains/nexus-agents/agents/Agent%20—%20Prism%20%28Frontend%20Engineer%29"
  "/domains/nexus-agents/agents/Agent%20—%20Forge%20%28Backend%20Engineer%29"
  "/domains/nexus-agents/agents/Agent%20—%20Aura%20%28UX-UI%20Designer%29"
  "/00-principles"
  "/10-developer-contracts"
  "/20-workflows"
  "/30-tooling/database"
  "/domains"
  "/domains/api-integration/backend/java/authentication"
)

echo "Testing navigation paths..."
echo ""

passed=0
failed=0

for path in "${test_cases[@]}"; do
  status_code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${path}")
  
  if [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓${NC} ${path} -> ${status_code}"
    ((passed++))
  elif [ "$status_code" = "404" ]; then
    echo -e "${RED}✗${NC} ${path} -> ${status_code} (404 - Page not found)"
    ((failed++))
  else
    echo -e "${YELLOW}⚠${NC} ${path} -> ${status_code} (Unexpected status)"
    ((failed++))
  fi
done

echo ""
echo "========================================="
echo "Results:"
echo "========================================="
echo -e "Passed: ${GREEN}${passed}${NC}"
echo -e "Failed: ${RED}${failed}${NC}"
echo ""

if [ $failed -eq 0 ]; then
  echo -e "${GREEN}✅ All navigation paths are working correctly!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some paths are still returning errors${NC}"
  exit 1
fi

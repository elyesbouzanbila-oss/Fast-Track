#!/bin/bash
# Complete Frontend-Backend-Database Verification Script

echo "╔════════════════════════════════════════════════════════════╗"
echo "║   FASTTRACK INTEGRATION VERIFICATION SUITE                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Helper functions
pass() {
  echo -e "${GREEN}✅ PASS${NC}: $1"
  ((PASSED++))
}

fail() {
  echo -e "${RED}❌ FAIL${NC}: $1"
  ((FAILED++))
}

test_api() {
  local method=$1
  local endpoint=$2
  local expected_status=$3
  local data=$4
  
  if [ "$method" = "GET" ]; then
    status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000$endpoint")
  else
    status=$(curl -s -o /dev/null -w "%{http_code}" -X $method -H "Content-Type: application/json" -d "$data" "http://localhost:3000$endpoint")
  fi
  
  if [ "$status" = "$expected_status" ]; then
    pass "$method $endpoint → $status"
  else
    fail "$method $endpoint → Expected $expected_status, got $status"
  fi
}

# ═══════════════════════════════════════════════════════════════
echo "🔍 DOCKER & INFRASTRUCTURE"
echo "═══════════════════════════════════════════════════════════"

# Check Docker running
if docker ps > /dev/null 2>&1; then
  pass "Docker daemon running"
else
  fail "Docker daemon not running"
  exit 1
fi

# Check containers
containers=("nav_api" "nav_postgres" "nav_frontend")
for container in "${containers[@]}"; do
  if docker ps | grep -q "$container"; then
    pass "Container $container is running"
  else
    fail "Container $container is not running"
  fi
done

# ═══════════════════════════════════════════════════════════════
echo ""
echo "🗄️  DATABASE CONNECTIVITY"
echo "═══════════════════════════════════════════════════════════"

# Test PostgreSQL connection
if docker exec nav_postgres psql -U navuser -d navdb -c "SELECT 1;" > /dev/null 2>&1; then
  pass "PostgreSQL connection"
else
  fail "PostgreSQL connection"
fi

# Check tables exist
tables=("users" "hazards" "transit_stops" "transit_routes")
for table in "${tables[@]}"; do
  if docker exec nav_postgres psql -U navuser -d navdb -c "\dt $table" 2>/dev/null | grep -q "$table"; then
    pass "Table '$table' exists"
  else
    fail "Table '$table' missing"
  fi
done

# Count records
user_count=$(docker exec nav_postgres psql -U navuser -d navdb -t -c "SELECT COUNT(*) FROM users;" 2>/dev/null)
hazard_count=$(docker exec nav_postgres psql -U navuser -d navdb -t -c "SELECT COUNT(*) FROM hazards;" 2>/dev/null)

if [ "$user_count" -gt 0 ]; then
  pass "Users table has $user_count records"
else
  fail "Users table is empty"
fi

if [ "$hazard_count" -gt 0 ]; then
  pass "Hazards table has $hazard_count records"
else
  fail "Hazards table is empty"
fi

# ═══════════════════════════════════════════════════════════════
echo ""
echo "🔌 API CONNECTIVITY"
echo "═══════════════════════════════════════════════════════════"

# Check API is running
if curl -s http://localhost:3000/api/health | grep -q "success"; then
  pass "API /health endpoint"
else
  fail "API /health endpoint"
fi

# Test authentication endpoints
test_api "POST" "/api/auth/register" "422" '{"name":"Test","email":"test","password":"test"}'
test_api "GET" "/api/hazards" "200" ""
test_api "GET" "/api/route/transit-stops?lng=10.18&lat=36.80&radius=600" "200" ""

# ═══════════════════════════════════════════════════════════════
echo ""
echo "🌐 FRONTEND ACCESSIBILITY"
echo "═══════════════════════════════════════════════════════════"

pages=("login1.html" "crcount.html" "home page.html" "reclamation.html" "map.html" "TEST_CONSOLE.html")
for page in "${pages[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001/$page")
  if [ "$status" = "200" ]; then
    pass "Frontend page: $page"
  else
    fail "Frontend page: $page (HTTP $status)"
  fi
done

# ═══════════════════════════════════════════════════════════════
echo ""
echo "📝 INTEGRATION CHECKS"
echo "═══════════════════════════════════════════════════════════"

# Check config files
if [ -f "Frontend/config.js" ]; then
  pass "Frontend config.js exists"
else
  fail "Frontend config.js missing"
fi

if [ -f "Frontend/api-client.js" ]; then
  pass "Frontend api-client.js exists"
else
  fail "Frontend api-client.js missing"
fi

if [ -f "Backend/src/config/osrm.js" ]; then
  pass "Backend osrm.js exists"
else
  fail "Backend osrm.js missing"
fi

# Check for OSRM public service URL
if grep -q "router.project-osrm.org" "Backend/src/config/osrm.js" 2>/dev/null; then
  pass "OSRM configured for public service"
else
  fail "OSRM not using public service"
fi

# ═══════════════════════════════════════════════════════════════
echo ""
echo "🔐 JWT TOKEN FLOW"
echo "═══════════════════════════════════════════════════════════"

# Create test user
email="test_$(date +%s)@example.com"
response=$(curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$email\",\"password\":\"TestPass123!\"}")

token=$(echo $response | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ ! -z "$token" ]; then
  pass "JWT token generated for new user"
  
  # Test authenticated request
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    -H "Authorization: Bearer $token" \
    http://localhost:3000/api/auth/me)
  
  if [ "$status" = "200" ]; then
    pass "JWT token authentication works"
  else
    fail "JWT token authentication failed"
  fi
else
  fail "JWT token generation failed"
fi

# ═══════════════════════════════════════════════════════════════
echo ""
echo "📊 SUMMARY"
echo "═══════════════════════════════════════════════════════════"

total=$((PASSED + FAILED))
percentage=$((PASSED * 100 / total))

echo "Tests Passed:  $PASSED"
echo "Tests Failed:  $FAILED"
echo "Total Tests:   $total"
echo "Success Rate:  $percentage%"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
  echo ""
  echo "Your FastTrack integration is ready:"
  echo "  • Frontend:  http://localhost:3001"
  echo "  • Backend:   http://localhost:3000"
  echo "  • Database:  PostgreSQL (navdb)"
  echo "  • Status:    100% Operational"
  exit 0
else
  echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
  echo "Please review errors above and restart containers:"
  echo "  docker compose restart"
  exit 1
fi

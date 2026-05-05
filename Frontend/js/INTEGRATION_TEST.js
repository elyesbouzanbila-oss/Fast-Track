// Test Suite for Frontend-Backend Integration
// Run in browser console on any integrated page

/**
 * SETUP: Open http://localhost:3001/crcount.html
 * These tests verify full API integration
 */

// ============================================================
// TEST 1: User Registration
// ============================================================
async function testSignup() {
  console.log("🧪 TEST 1: User Registration");
  console.log("=====================================");
  
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = "TestPass123!";
  const testName = "Test User";
  
  try {
    const response = await navigationAPI.signup(testName, testEmail, testPassword);
    
    if (response.success) {
      console.log("✅ PASSED: User registered successfully");
      console.log("📊 Response:", response.data.user);
      console.log("🔑 Token stored:", !!navigationAPI.getToken());
      return { email: testEmail, password: testPassword, name: testName, status: "PASSED" };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 2: User Login
// ============================================================
async function testLogin(email, password) {
  console.log("\n🧪 TEST 2: User Login");
  console.log("=====================================");
  
  // Clear token first
  navigationAPI.clearToken();
  console.log("Token cleared for fresh login");
  
  try {
    const response = await navigationAPI.login(email, password);
    
    if (response.success) {
      console.log("✅ PASSED: User logged in successfully");
      console.log("📊 User:", response.data.user);
      console.log("🔑 Token stored:", !!navigationAPI.getToken());
      return { status: "PASSED" };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 3: Get Current User (Me)
// ============================================================
async function testGetMe() {
  console.log("\n🧪 TEST 3: Get Current User (Me)");
  console.log("=====================================");
  
  if (!navigationAPI.getToken()) {
    console.error("❌ FAILED: No token. Run testLogin first");
    return { status: "FAILED", error: "No token" };
  }
  
  try {
    const response = await navigationAPI.getMe();
    
    if (response.success) {
      console.log("✅ PASSED: User info retrieved");
      console.log("📊 User ID:", response.data.id);
      console.log("📊 Name:", response.data.name);
      console.log("📊 Email:", response.data.email);
      return { status: "PASSED", user: response.data };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 4: Report Hazard
// ============================================================
async function testReportHazard() {
  console.log("\n🧪 TEST 4: Report Hazard");
  console.log("=====================================");
  
  if (!navigationAPI.getToken()) {
    console.error("❌ FAILED: No token. Run testLogin first");
    return { status: "FAILED", error: "No token" };
  }
  
  // Use Tunis coordinates
  const testData = {
    type: "pothole",
    lat: 36.8065,
    lng: 10.1815,
    severity: "medium",
    description: "Test hazard for integration testing"
  };
  
  try {
    const response = await navigationAPI.reportHazard(
      testData.type,
      testData.lat,
      testData.lng,
      testData.severity,
      testData.description
    );
    
    if (response.success) {
      console.log("✅ PASSED: Hazard reported successfully");
      console.log("📊 Hazard ID:", response.data.id);
      console.log("📊 Type:", response.data.type);
      console.log("📊 Severity:", response.data.severity);
      return { status: "PASSED", hazardId: response.data.id };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 5: Get Hazards in Area
// ============================================================
async function testGetHazards() {
  console.log("\n🧪 TEST 5: Get Hazards in Area");
  console.log("=====================================");
  
  // Tunis area bbox
  const bbox = {
    minLng: 10.0,
    minLat: 36.7,
    maxLng: 10.3,
    maxLat: 36.9
  };
  
  try {
    const response = await navigationAPI.getHazards(
      bbox.minLng,
      bbox.minLat,
      bbox.maxLng,
      bbox.maxLat
    );
    
    if (response.success) {
      // FIX: backend returns { success, data: [...], count } — use response.count
      // for the total, and response.data for the array.
      const hazards = Array.isArray(response.data) ? response.data : [];
      console.log("✅ PASSED: Hazards retrieved");
      console.log(`📊 Found ${response.count ?? hazards.length} hazards in area`);
      
      if (hazards.length > 0) {
        console.log("📊 First hazard:", hazards[0]);
      } else {
        console.log("ℹ️  No hazards in test bounding box — try reporting one first.");
      }
      return { status: "PASSED", hazardCount: hazards.length };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 6: Calculate Route
// ============================================================
async function testCalculateRoute() {
  console.log("\n🧪 TEST 6: Calculate Route");
  console.log("=====================================");
  
  // NOTE: /api/route uses optionalAuth — works with or without a token.
  // Hazard overlay on the route IS richer when authenticated.
  const origin = { lat: 36.8065, lng: 10.1815 };  // Tunis
  const destination = { lat: 35.8256, lng: 10.6369 };  // Sousse
  
  try {
    const response = await navigationAPI.calculateRoute(
      origin,
      destination,
      'car',
      { avoidHazards: true }
    );
    
    if (response.success) {
      console.log("✅ PASSED: Route calculated");
      console.log("📊 Mode:", response.data.route.mode);
      console.log("📊 Distance:", response.data.route.distance + "m");
      console.log("📊 Duration:", response.data.route.duration + "s");
      
      if (response.data.hazards && response.data.hazards.hasHazards) {
        console.log("⚠️  Hazards on route:", response.data.hazards.hazards.length);
      }
      
      return { status: "PASSED", distance: response.data.route.distance };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 7: Snap Point to Road
// ============================================================
async function testSnapPoint() {
  console.log("\n🧪 TEST 7: Snap Point to Road");
  console.log("=====================================");
  
  const testPoint = { lng: 10.1815, lat: 36.8065 };
  
  try {
    const response = await navigationAPI.snapPoint(
      testPoint.lng,
      testPoint.lat,
      'car'
    );
    
    if (response.success) {
      console.log("✅ PASSED: Point snapped to road");
      console.log("📊 Snapped:", response.data.snapped);
      console.log("📊 Snap Distance:", response.data.snapDistance + "m");
      return { status: "PASSED" };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 8: Get Nearby Transit Stops
// ============================================================
async function testNearbyStops() {
  console.log("\n🧪 TEST 8: Get Nearby Transit Stops");
  console.log("=====================================");
  
  const testPoint = { lng: 10.1815, lat: 36.8065 };
  
  try {
    const response = await navigationAPI.getNearbyTransitStops(
      testPoint.lng,
      testPoint.lat,
      600
    );
    
    if (response.success) {
      console.log("✅ PASSED: Transit stops retrieved");
      console.log(`📊 Found ${response.data.count} stops`);
      
      if (response.data.stops && response.data.stops.length > 0) {
        console.log("📊 First stop:", response.data.stops[0]);
      }
      return { status: "PASSED", stopCount: response.data.count };
    } else {
      console.error("❌ FAILED: " + response.error);
      return { status: "FAILED", error: response.error };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// TEST 9: Logout
// ============================================================
async function testLogout() {
  console.log("\n🧪 TEST 9: Logout");
  console.log("=====================================");
  
  try {
    navigationAPI.logout();
    const token = navigationAPI.getToken();
    
    if (!token) {
      console.log("✅ PASSED: User logged out successfully");
      console.log("🔑 Token cleared:", !token);
      return { status: "PASSED" };
    } else {
      console.error("❌ FAILED: Token still exists");
      return { status: "FAILED" };
    }
  } catch (error) {
    console.error("❌ ERROR:", error.message);
    return { status: "ERROR", error: error.message };
  }
}

// ============================================================
// RUN ALL TESTS
// ============================================================
async function runAllTests() {
  console.clear();
  console.log("🚀 STARTING FULL INTEGRATION TEST SUITE");
  console.log("═════════════════════════════════════════════════");
  console.log("API Base URL:", API_CONFIG.BASE_URL);
  console.log("═════════════════════════════════════════════════\n");
  
  const results = {};
  
  // Test 1: Signup
  const signupResult = await testSignup();
  results.signup = signupResult;
  
  if (signupResult.status !== "PASSED") {
    console.log("\n❌ Signup failed. Cannot continue with other tests.");
    console.log("Make sure the backend is running: docker compose up");
    return results;
  }
  
  // Test 2: Login
  const loginResult = await testLogin(signupResult.email, signupResult.password);
  results.login = loginResult;
  
  if (loginResult.status !== "PASSED") {
    console.log("\n❌ Login failed. Stopping tests.");
    return results;
  }
  
  // Test 3: Get Me
  results.getMe = await testGetMe();
  
  // Test 4: Report Hazard
  const hazardResult = await testReportHazard();
  results.reportHazard = hazardResult;
  
  // Test 5: Get Hazards
  results.getHazards = await testGetHazards();
  
  // Test 6: Calculate Route
  results.calculateRoute = await testCalculateRoute();
  
  // Test 7: Snap Point
  results.snapPoint = await testSnapPoint();
  
  // Test 8: Nearby Stops
  results.nearbyStops = await testNearbyStops();
  
  // Test 9: Logout
  results.logout = await testLogout();
  
  // Summary
  console.log("\n═════════════════════════════════════════════════");
  console.log("📋 TEST SUMMARY");
  console.log("═════════════════════════════════════════════════");
  
  let passed = 0;
  let failed = 0;
  
  Object.entries(results).forEach(([test, result]) => {
    const icon = result.status === "PASSED" ? "✅" : "❌";
    console.log(`${icon} ${test}: ${result.status}`);
    
    if (result.status === "PASSED") passed++;
    else failed++;
  });
  
  console.log("═════════════════════════════════════════════════");
  console.log(`📊 TOTAL: ${passed} passed, ${failed} failed out of ${Object.keys(results).length}`);
  console.log("═════════════════════════════════════════════════\n");
  
  return results;
}

// ============================================================
// QUICK TEST (just login and get user)
// ============================================================
async function quickTest(email, password) {
  console.clear();
  console.log("⚡ QUICK TEST: Login + Get User Info");
  console.log("═════════════════════════════════════════════════");
  
  try {
    // Login
    const loginRes = await navigationAPI.login(email, password);
    if (!loginRes.success) throw new Error(loginRes.error);
    console.log("✅ Login successful");
    
    // Get user info
    const meRes = await navigationAPI.getMe();
    if (!meRes.success) throw new Error(meRes.error);
    console.log("✅ User info retrieved");
    console.log("📊 User:", meRes.data);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

// ============================================================
// INSTRUCTIONS
// ============================================================
console.log(`
╔════════════════════════════════════════════════════════════╗
║        FRONTEND-BACKEND INTEGRATION TEST SUITE             ║
╚════════════════════════════════════════════════════════════╝

HOW TO RUN:

1️⃣  FULL TEST SUITE (creates new user, runs all tests):
   runAllTests()

2️⃣  QUICK TEST (login only):
   quickTest('your@email.com', 'your-password')

3️⃣  INDIVIDUAL TESTS:
   - testSignup()
   - testLogin(email, password)
   - testGetMe()
   - testReportHazard()
   - testGetHazards()
   - testCalculateRoute()
   - testSnapPoint()
   - testNearbyStops()
   - testLogout()

EXAMPLE:
  // Register new user
  result = await testSignup()
  
  // Login with that user
  await testLogin(result.email, result.password)
  
  // Get user info
  await testGetMe()
  
  // Report a hazard
  await testReportHazard()
  
  // Calculate route
  await testCalculateRoute()

REQUIREMENTS:
  ✓ Backend running on http://localhost:3000
  ✓ Frontend running on http://localhost:3001
  ✓ PostgreSQL running (connected to backend)
  ✓ Open browser DevTools (F12) and go to Console tab
  ✓ Navigate to any integrated page first

EXPECTED RESULTS:
  ✅ All tests should show "PASSED"
  ✅ Green checkmarks in console
  ✅ User tokens automatically managed
  ✅ Hazards saved to database
  ✅ Routes calculated successfully
`);

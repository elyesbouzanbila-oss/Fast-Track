# Integration Test Cases

## Quick Start

1. Open browser DevTools: **F12**
2. Go to **Console** tab
3. Navigate to: **http://localhost:3001/crcount.html** (or any integrated page)
4. Copy-paste test commands into console

---

## Test Case 1: Full Automation Test Suite

**Command:**
```javascript
runAllTests()
```

**What it does:**
- ✅ Creates new user (signup)
- ✅ Logs in with that user
- ✅ Gets current user info
- ✅ Reports a hazard
- ✅ Retrieves hazards in area
- ✅ Calculates route between cities
- ✅ Snaps point to road
- ✅ Gets nearby transit stops
- ✅ Logs out

**Expected Output:**
```
✅ signup: PASSED
✅ login: PASSED
✅ getMe: PASSED
✅ reportHazard: PASSED
✅ getHazards: PASSED
✅ calculateRoute: PASSED
✅ snapPoint: PASSED
✅ nearbyStops: PASSED
✅ logout: PASSED

TOTAL: 9 passed, 0 failed
```

**Time:** ~5-10 seconds

---

## Test Case 2: Sign Up Test

**Command:**
```javascript
await testSignup()
```

**What it does:**
- Creates a new user with unique email
- Stores JWT token automatically
- Validates response structure

**Expected Output:**
```
✅ PASSED: User registered successfully
📊 Response: { id: "...", name: "Test User", email: "testuser_xxx@example.com", ... }
🔑 Token stored: true
```

**Verify:**
- Check token in localStorage: `localStorage.getItem('authToken')`
- Token should be a long JWT string

---

## Test Case 3: Login Test

**Command:**
```javascript
// First register
result = await testSignup()

// Then login
await testLogin(result.email, result.password)
```

**What it does:**
- Clears existing token
- Logs in with email/password
- Validates JWT received
- Stores in localStorage

**Expected Output:**
```
✅ PASSED: User logged in successfully
📊 User: { id: "...", email: "test@example.com", ... }
🔑 Token stored: true
```

**Test with existing user:**
```javascript
await testLogin('test@example.com', 'TestPass123!')
```

---

## Test Case 4: Get Current User

**Command:**
```javascript
await testGetMe()
```

**Prerequisites:**
- Must be logged in first: `await testLogin(email, password)`

**What it does:**
- Sends Authorization header with token
- Gets authenticated user info
- Validates token validity

**Expected Output:**
```
✅ PASSED: User info retrieved
📊 User ID: 550e8400-e29b-41d4-a716-446655440000
📊 Name: Test User
📊 Email: test@example.com
```

**Error Scenario:**
- If token expired: redirects to login page
- If no token: shows "FAILED: No token"

---

## Test Case 5: Report Hazard

**Command:**
```javascript
await testReportHazard()
```

**Prerequisites:**
- Must be logged in first

**What it does:**
- Reports pothole at Tunis coordinates
- Submits hazard type, severity, location, description
- Returns hazard ID from database

**Expected Output:**
```
✅ PASSED: Hazard reported successfully
📊 Hazard ID: 12345abc-def6-7890-ghij-klmnopqrstuv
📊 Type: pothole
📊 Severity: medium
```

**Verify in Database:**
```bash
# SSH into container or use psql client
psql -h localhost -U navuser -d navdb

# Query hazards
SELECT id, type, severity, ST_AsText(location) FROM hazards LIMIT 1;
```

---

## Test Case 6: Get Hazards in Area

**Command:**
```javascript
await testGetHazards()
```

**What it does:**
- Queries hazards within Tunis area bounding box
- Returns array of hazards with type, severity, location
- Works without authentication

**Expected Output:**
```
✅ PASSED: Hazards retrieved
📊 Found 5 hazards
📊 First hazard: { id: "...", type: "pothole", severity: "medium", lat: 36.8065, lng: 10.1815, ... }
```

**Custom Area Query:**
```javascript
// Define your own bounding box
const response = await navigationAPI.getHazards(
  10.0,  // minLng
  36.7,  // minLat
  10.3,  // maxLng
  36.9   // maxLat
);
console.log(response.data);  // Array of hazards
```

---

## Test Case 7: Calculate Route

**Command:**
```javascript
await testCalculateRoute()
```

**Prerequisites:**
- Must be logged in first
- Requires OSRM service (or falls back gracefully)

**What it does:**
- Calculates driving route: Tunis → Sousse
- Returns distance (meters) and duration (seconds)
- Shows hazards near the route

**Expected Output:**
```
✅ PASSED: Route calculated
📊 Mode: car
📊 Distance: 142583m
📊 Duration: 5400s
⚠️  Hazards on route: 2
```

**Manual Route Calculation:**
```javascript
const response = await navigationAPI.calculateRoute(
  { lat: 36.8065, lng: 10.1815 },  // Tunis
  { lat: 35.8256, lng: 10.6369 },  // Sousse
  'car',
  { avoidHazards: true }
);

console.log(response.data.route.distance + "m");
console.log(response.data.route.duration + "s");
```

---

## Test Case 8: Snap Point to Road

**Command:**
```javascript
await testSnapPoint()
```

**What it does:**
- Snaps arbitrary coordinate to nearest road
- Returns snapped coordinates and distance
- Works without authentication

**Expected Output:**
```
✅ PASSED: Point snapped to road
📊 Snapped: true
📊 Snap Distance: 12.34m
```

**Custom Point:**
```javascript
const response = await navigationAPI.snapPoint(
  10.1815,  // lng (longitude)
  36.8065,  // lat (latitude)
  'car'     // mode
);
console.log(response.data);
```

---

## Test Case 9: Get Nearby Transit Stops

**Command:**
```javascript
await testNearbyStops()
```

**What it does:**
- Finds transit stops within 600m radius of location
- Returns stop names, coordinates, distance
- Works without authentication

**Expected Output:**
```
✅ PASSED: Transit stops retrieved
📊 Found 3 stops
📊 First stop: { id: "stop-1", name: "Central Station", lat: 36.8065, lng: 10.1815, distance: 250 }
```

**Custom Location:**
```javascript
const response = await navigationAPI.getNearbyTransitStops(
  10.1815,   // lng
  36.8065,   // lat
  1000       // radius in meters
);
console.log(response.data.stops);  // Array of stops
```

---

## Test Case 10: Logout

**Command:**
```javascript
await testLogout()
```

**What it does:**
- Clears JWT token from localStorage
- Verifies token is gone
- User must login again to access protected endpoints

**Expected Output:**
```
✅ PASSED: User logged out successfully
🔑 Token cleared: true
```

**Verify:**
- Try `await navigationAPI.getMe()` → should fail with 401
- Refresh page → redirects to login

---

## Test Case 11: Invalid Email Format

**Command:**
```javascript
// Try signup with bad email
await navigationAPI.signup("Test User", "not-an-email", "Pass123!")
```

**Expected:**
```
❌ Error response with validation details
{
  success: false,
  error: "Validation failed",
  details: [
    {
      param: "email",
      msg: "Invalid value",
      location: "body"
    }
  ]
}
```

---

## Test Case 12: Duplicate Email

**Command:**
```javascript
// Register user
result1 = await testSignup()

// Try to register same email again
await navigationAPI.signup("Another User", result1.email, "Pass123!")
```

**Expected:**
```
❌ FAILED
{
  success: false,
  error: "Email already registered"
}
```

---

## Test Case 13: Wrong Password

**Command:**
```javascript
// Create user
result = await testSignup()

// Try login with wrong password
await navigationAPI.login(result.email, "WrongPassword123!")
```

**Expected:**
```
❌ FAILED
{
  success: false,
  error: "Invalid credentials"
}
```

---

## Test Case 14: Missing Authentication Header

**Command:**
```javascript
// Clear token
navigationAPI.clearToken()

// Try to report hazard (requires auth)
await navigationAPI.reportHazard('pothole', 36.8065, 10.1815, 'medium')
```

**Expected:**
```
❌ Error: 401 Unauthorized
{
  success: false,
  error: "No token provided"
}
```

---

## Test Case 15: Rate Limiting

**Command:**
```javascript
// Spam login attempts
for (let i = 0; i < 30; i++) {
  await navigationAPI.login('test@test.com', 'wrongpass')
}
```

**Expected (after 20 attempts in 15 minutes):**
```
❌ Error: 429 Too Many Requests
{
  success: false,
  error: "Too many requests, please slow down."
}
```

---

## Manual Testing Workflow

### Scenario 1: Complete User Journey

1. **Open signup page:**
   ```
   http://localhost:3001/crcount.html
   ```
   - Fill in name, email, password
   - Click "Sign Up"
   - Should redirect to home page

2. **Logout:**
   - Click user menu (top right)
   - Click "Logout"
   - Should redirect to login page

3. **Login again:**
   ```
   http://localhost:3001/login1.html
   ```
   - Enter email, password
   - Click "Entrée"
   - Should redirect to home page

4. **Report hazard:**
   ```
   http://localhost:3001/reclamation.html
   ```
   - Select hazard type: "Pothole"
   - Select severity: "Medium"
   - Click "Get Current Location" (or enter manually)
   - Add description
   - Click "Report Hazard"

5. **View map:**
   ```
   http://localhost:3001/map.html
   ```
   - Select from/to stations
   - Click "Afficher Route"
   - See route with hazards marked

---

## Troubleshooting Tests

### "No token provided"
- Make sure logged in: `await testLogin(email, password)`
- Check token exists: `localStorage.getItem('authToken')`

### "getaddrinfo ENOTFOUND"
- Backend not running
- Check: `docker ps` (should show nav_api container)
- Start: `docker compose up`

### "Cannot read property 'message' of undefined"
- API returned unexpected format
- Check backend logs: `docker logs nav_api -n 50`

### Tests pass but data not in database
- Check DB connection:
  ```bash
  docker exec nav_postgres psql -U navuser -d navdb -c "SELECT COUNT(*) FROM users;"
  ```
- Verify container: `docker ps | grep postgres`

---

## Performance Baseline

Expected response times on localhost:
- Sign up: ~500ms
- Login: ~300ms
- Get user info: ~100ms
- Report hazard: ~200ms
- Get hazards: ~150ms
- Calculate route: ~1000ms (depends on OSRM)
- Snap point: ~500ms
- Nearby stops: ~200ms


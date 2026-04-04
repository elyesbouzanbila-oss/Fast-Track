# Test Case Quick Reference

## 🎯 Access the Test Console

Open in browser:
```
http://localhost:3001/TEST_CONSOLE.html
```

No console required - full UI with buttons, real-time output, and results dashboard.

---

## 🧪 Test Cases Overview

| # | Test | Purpose | Prerequisites |
|---|------|---------|----------------|
| 1 | **Full Test Suite** | All 9 tests automated | None (creates new user) |
| 2 | **Quick Test** | Login + Get User | Valid email/password |
| 3 | **Sign Up** | Create new account | None |
| 4 | **Login** | Authenticate user | Valid credentials |
| 5 | **Get User** | Fetch auth user info | Must be logged in |
| 6 | **Report Hazard** | Submit hazard report | Must be logged in |
| 7 | **Get Hazards** | Retrieve area hazards | None (public) |
| 8 | **Calculate Route** | Get driving route | Must be logged in |
| 9 | **Snap Point** | Find nearest road | None (public) |
| 10 | **Transit Stops** | Find nearby stops | None (public) |
| 11 | **Logout** | Clear session | Must be logged in |

---

## ✅ Test Scenarios

### Scenario A: New User Journey
```
1. Click "Run All Tests"
   ↓
2. Creates new account automatically
   ↓
3. Tests login, routes, hazards
   ↓
4. Cleans up with logout
```

**Expected:** All 9 tests PASSED (green) ✅

---

### Scenario B: Existing User Test
```
1. Enter email: your-email@example.com
2. Enter password: your-password
3. Click "Quick Test"
   ↓
   Tests: Login → Get User Info
```

**Expected:** Both tests PASSED ✅

---

### Scenario C: Route Testing
```
1. Log in first (Quick Test or Sign Up)
2. Click "Calculate Route" (under Route Tests)
   ↓
   Tests: Tunis → Sousse (142km)
   Shows: Distance, Duration, Hazards
```

**Expected:** PASSED with distance/duration ✅

---

### Scenario D: Hazard Workflow
```
1. Log in first
2. Click "Report Hazard" (under Hazard Tests)
   ↓
   Reports: Pothole at Tunis coords
3. Click "Get Hazards"
   ↓
   Retrieves: Hazards in area (should include reported one)
```

**Expected:** Both PASSED, hazard persisted in DB ✅

---

## 📊 Example Output

### Passing Test
```
✅ [12:34:56] Login successful
✅ [12:34:57] User: Test User (test@example.com)
```

### Failing Test
```
❌ [12:35:00] Invalid credentials
```

### Detailed Results
```
Full Test Suite Results:
├── ✅ signup: PASSED
├── ✅ login: PASSED
├── ✅ getMe: PASSED
├── ✅ reportHazard: PASSED
├── ✅ getHazards: PASSED
├── ✅ calculateRoute: PASSED
├── ✅ snapPoint: PASSED
├── ✅ nearbyStops: PASSED
└── ✅ logout: PASSED

📊 Summary: 9/9 passed (100%)
```

---

## 🔧 Test Data

### Default Test Credentials
- **Mode:** Auto-created new user each run
- **Email:** `testuser_${timestamp}@example.com`
- **Password:** `TestPass123!`
- **Name:** `Test User`

### Manual Test Credentials
```
Email: test@example.com
Password: TestPass123!
```

### Route Test Data
```
From:  Tunis (36.8065, 10.1815)
To:    Sousse (35.8256, 10.6369)
Mode:  Car
Distance: ~142km
Duration: ~90 mins
```

### Hazard Test Data
```
Type: Pothole
Severity: Medium
Location: Tunis (36.8065, 10.1815)
Radius: 50m
Description: Test hazard
```

---

## 🚨 Expected Errors (Test Error Handling)

### Scenario: Login with Wrong Password
```
Input: valid-email@example.com / WrongPassword
Response:
❌ Invalid credentials
```

### Scenario: Signup with Existing Email
```
Input: already-registered@example.com
Response:
❌ Email already registered
```

### Scenario: Invalid Email Format
```
Input: not-an-email / password
Response:
❌ Validation failed
Details: Invalid value for 'email'
```

### Scenario: Missing Required Field
```
Input: (empty email) / password
Response:
❌ Validation failed
Details: Invalid value for 'email'
```

### Scenario: No Authentication Token
```
Test: Report Hazard (without login)
Response:
❌ No token provided
```

### Scenario: Rate Limiting (20+ auth attempts/15min)
```
After 20 login attempts:
❌ Too many requests, please slow down.
```

---

## 📈 Performance Baselines

Expected response times (localhost):

| Operation | Min | Avg | Max |
|-----------|-----|-----|-----|
| Sign Up | 200ms | 500ms | 1s |
| Login | 100ms | 300ms | 800ms |
| Get User | 50ms | 100ms | 300ms |
| Report Hazard | 100ms | 200ms | 600ms |
| Get Hazards | 100ms | 150ms | 500ms |
| Calculate Route | 500ms | 1000ms | 3s |
| Snap Point | 300ms | 500ms | 1500ms |
| Transit Stops | 100ms | 200ms | 600ms |

---

## 🔍 Verification Checklist

After running tests, verify:

- [ ] All 9 tests show ✅ PASSED
- [ ] Success rate is 100%
- [ ] Token appears in browser storage
- [ ] Response times are < 3 seconds each
- [ ] New user appears in database
- [ ] Hazard is persisted in database
- [ ] Route data includes distance/duration
- [ ] User can logout and login again
- [ ] Browser console shows no errors
- [ ] No network errors in DevTools

---

## 🛠️ Debugging

### If tests fail:

1. **Check Backend**
   ```bash
   docker ps
   # Should show: nav_api, nav_postgres, nav_frontend
   ```

2. **Check Logs**
   ```bash
   docker logs nav_api -n 20
   docker logs nav_postgres -n 20
   ```

3. **Check Connection**
   ```bash
   # In browser console
   console.log(API_CONFIG.BASE_URL)
   # Should show: http://localhost:3000
   ```

4. **Test Manual Request**
   ```bash
   # In browser console
   fetch('http://localhost:3000/api/health')
     .then(r => r.json())
     .then(d => console.log(d))
   ```

5. **Clear Token and Retry**
   ```bash
   # In browser console
   localStorage.clear()
   navigationAPI.clearToken()
   # Then rerun test
   ```

---

## 📋 Test Report Template

**Date:** ___________  
**Tester:** ___________  
**Build:** ___________  

### Results
```
Total Tests: ___/9 PASSED
Success Rate: ___%
Duration: ___s

Individual Results:
☐ Sign Up
☐ Login
☐ Get User
☐ Report Hazard
☐ Get Hazards
☐ Calculate Route
☐ Snap Point
☐ Transit Stops
☐ Logout
```

### Issues Found
```
1. 
2. 
3. 
```

### Notes
```


```

---

## 🎓 Learning Path

**New to the API? Follow this order:**

1. Run "Quick Test" with existing credentials
2. Run "Sign Up" to create new account
3. Run individual "Auth Tests" to understand login flow
4. Run "Route Tests" to see navigation features
5. Run "Hazard Tests" to see reporting system
6. Run "Full Test Suite" for complete validation
7. Check TEST_CASES.md for detailed documentation


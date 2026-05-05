## Bug Submission Issue - Root Cause & Fixes Applied

### **Problem**
Bug reports submitted via the reclamation.html form were disappearing and not being stored in the database, or not appearing in the TEST_CONSOLE.html table.

---

### **Root Cause: Field Name Mismatch**

The **frontend** was sending field names in **camelCase**:
```javascript
// reclamation.html (BEFORE FIX)
await navigationAPI.reportBug({
  expectedBehavior: expected,     // ← camelCase
  actualBehavior: actual,         // ← camelCase
  extraDetails,                   // ← camelCase
  sourcePage: pathname,           // ← camelCase
});
```

But the **backend validation** expected **snake_case**:
```javascript
// Backend validation.js
const validateBugReport = validate([
  body('expected_behavior')...     // ← snake_case
  body('actual_behavior')...       // ← snake_case
  body('extra_details')...         // ← snake_case
  body('source_page')...           // ← snake_case
]);
```

**Result:** Validation failed (HTTP 422) because required fields were missing, but the error was silently caught in the frontend catch block, making it appear the bug disappeared.

---

### **Fixes Applied**

#### **1. Frontend: reclamation.html (FIXED)**
Changed form submission to send snake_case field names:

```javascript
// reclamation.html (AFTER FIX)
await navigationAPI.reportBug({
  category,
  impact,
  title,
  steps,
  expected_behavior: expected,     // ← Now snake_case
  actual_behavior: actual,         // ← Now snake_case
  extra_details: bugExtraInput ? bugExtraInput.value.trim() : '',  // ← Now snake_case
  description,
  source_page: window.location.pathname,  // ← Now snake_case
});
```

#### **2. API Client: api-client.js (SIMPLIFIED)**
Removed confusing camelCase-to-snake_case conversion logic:

```javascript
// api-client.js reportBug() method
async reportBug(bug) {
  return this.request('/api/bugs', {
    method: 'POST',
    body: JSON.stringify({
      category: bug.category,
      impact: bug.impact || 'medium',
      title: bug.title,
      steps: bug.steps,
      expected_behavior: bug.expected_behavior || '',        // Expects snake_case in
      actual_behavior: bug.actual_behavior || '',            // Expects snake_case in
      extra_details: bug.extra_details || '',                // Expects snake_case in
      description: bug.description || '',
      source_page: bug.source_page || '',                    // Expects snake_case in
    }),
  });
}
```

---

### **Testing the Fix**

#### **Option 1: Manual Testing**
1. Go to http://localhost:3001/pages/reclamation.html
2. Fill out the form:
   - Category: "UI / UX Issue"
   - Impact: "Medium"
   - Title: "Test bug"
   - Steps: "1. Do something\n2. See error"
   - Expected: "It should work"
   - Actual: "It doesn't"
3. Click "Submit Bug Report"
4. Open DevTools (F12) → Console → verify no errors
5. Go to http://localhost:3001/pages/TEST_CONSOLE.html
6. Click "Load Bugs Table"
7. Your bug should now appear in the table

#### **Option 2: Automated Testing**
Run the test script:
```bash
cd Backend
npm install axios  # if not already installed
node test-bug-submission.js
```

This script:
1. Creates a test user
2. Submits a bug report
3. Retrieves the bugs list
4. Verifies the bug appears in the list
5. Retrieves the specific bug by ID
6. Confirms all fields are stored correctly

---

### **Field Mapping Reference**

| Sent by Frontend | Backend Expects | Database Column | Type |
|-----------------|-----------------|-----------------|------|
| category | category | category | String |
| impact | impact | impact | ENUM('low', 'medium', 'high', 'critical') |
| title | title | title | String(120) |
| steps | steps | steps | Text |
| expected_behavior | expected_behavior | expected_behavior | Text |
| actual_behavior | actual_behavior | actual_behavior | Text |
| extra_details | extra_details | extra_details | Text |
| source_page | source_page | source_page | String(255) |
| (auto) | reported_by | reported_by | UUID (from JWT user) |
| (auto) | status | status | ENUM('open', 'triaged', 'resolved', 'closed') |
| (auto) | createdAt | created_at | DateTime |

---

### **Files Modified**
- ✅ `Frontend/pages/reclamation.html` — Fixed field names in form submission
- ✅ `Frontend/js/api-client.js` — Simplified and clarified field naming
- ✅ `Backend/test-bug-submission.js` — New test script for validation

### **No Backend Changes Needed**
- Validation middleware (`validateBugReport`) — Already correct
- Bug controller (`reportBug`) — Already correct
- Bug service (`createBug`) — Already correct
- Bug model — Already correct

---

### **Debugging Checklist**

If bugs still aren't showing up:

1. **Check browser console** (F12 → Console)
   - Look for network errors (red text)
   - Should see "Bug report submitted successfully"

2. **Check backend logs** 
   - `docker compose logs api` 
   - Should see `POST /api/bugs` with status 201
   - If 422: validation error (check field names again)

3. **Check database directly**
   ```sql
   SELECT * FROM bugs ORDER BY created_at DESC LIMIT 5;
   ```
   - Should show newly submitted bugs

4. **Test GET /api/bugs endpoint**
   - Visit: http://localhost:3000/api/bugs?limit=10
   - Should return JSON array with bug records

5. **Verify test console fetches correctly**
   - Open DevTools (F12)
   - Watch Network tab
   - Click "Load Bugs Table" in TEST_CONSOLE
   - Should see `GET /api/bugs?limit=200` response with your bugs

---

### **Summary**
The issue was a **naming convention mismatch** between frontend (camelCase) and backend (snake_case). This caused form validation to fail silently. The fixes ensure consistent naming across the stack and provide clear testing mechanisms to verify the flow works end-to-end.

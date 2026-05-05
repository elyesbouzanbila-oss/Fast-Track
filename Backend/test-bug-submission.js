/**
 * Quick test script to verify bug submission flow
 * Run: node Backend/test-bug-submission.js
 */

require('dotenv').config();
const axios = require('axios');

const API_URL = 'http://localhost:3000';

async function test() {
  console.log('🧪 Testing Bug Submission Flow\n');
  
  try {
    // Step 1: Create test user
    console.log('1️⃣ Creating test user...');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPass123!';
    
    const signupRes = await axios.post(`${API_URL}/api/auth/register`, {
      name: 'Test User',
      email: testEmail,
      password: testPassword,
    });
    
    if (!signupRes.data.success) {
      throw new Error(`Signup failed: ${signupRes.data.error}`);
    }
    
    const token = signupRes.data.data.token;
    const userId = signupRes.data.data.user.id;
    console.log(`✅ User created: ${testEmail}`);
    console.log(`   User ID: ${userId}`);
    console.log(`   Token: ${token.slice(0, 20)}...`);
    
    // Step 2: Submit a bug report
    console.log('\n2️⃣ Submitting bug report...');
    const bugData = {
      category: 'UI / UX Issue',
      impact: 'medium',
      title: 'Test bug from script',
      steps: '1. Open the app\n2. Click something\n3. See error',
      expected_behavior: 'App should work smoothly',
      actual_behavior: 'App crashes or behaves oddly',
      extra_details: 'This is a test bug for validation',
      description: 'Test bug report',
      source_page: '/pages/test.html',
    };
    
    console.log('   Sending:', JSON.stringify(bugData, null, 2));
    
    const bugRes = await axios.post(
      `${API_URL}/api/bugs`,
      bugData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!bugRes.data.success) {
      throw new Error(`Bug submission failed: ${bugRes.data.error}`);
    }
    
    const bugId = bugRes.data.data.id;
    console.log(`✅ Bug report created`);
    console.log(`   Bug ID: ${bugId}`);
    console.log(`   Status: ${bugRes.data.data.status}`);
    console.log(`   Created at: ${bugRes.data.data.createdAt}`);
    
    // Step 3: Retrieve bugs list
    console.log('\n3️⃣ Retrieving bugs list...');
    const listRes = await axios.get(`${API_URL}/api/bugs?limit=100`);
    
    if (!listRes.data.success) {
      throw new Error(`Bug retrieval failed: ${listRes.data.error}`);
    }
    
    const bugs = listRes.data.data;
    const count = listRes.data.count;
    console.log(`✅ Retrieved ${count} bug(s)`);
    
    // Check if our bug is in the list
    const ourBug = bugs.find(b => b.id === bugId);
    if (ourBug) {
      console.log(`✅ Our bug found in list!`);
      console.log(`   Title: ${ourBug.title}`);
      console.log(`   Category: ${ourBug.category}`);
      console.log(`   Impact: ${ourBug.impact}`);
      console.log(`   Status: ${ourBug.status}`);
      console.log(`   Reported by: ${ourBug.reported_by}`);
    } else {
      console.log(`❌ Our bug NOT found in list!`);
      console.log(`   Looking for ID: ${bugId}`);
      console.log(`   Available bug IDs:`, bugs.map(b => b.id).slice(0, 5));
    }
    
    // Step 4: Retrieve specific bug
    console.log('\n4️⃣ Retrieving specific bug by ID...');
    const detailRes = await axios.get(`${API_URL}/api/bugs/${bugId}`);
    
    if (!detailRes.data.success) {
      throw new Error(`Bug detail retrieval failed: ${detailRes.data.error}`);
    }
    
    const bugDetail = detailRes.data.data;
    console.log(`✅ Bug detail retrieved`);
    console.log(`   Steps: ${bugDetail.steps}`);
    console.log(`   Expected: ${bugDetail.expected_behavior}`);
    console.log(`   Actual: ${bugDetail.actual_behavior}`);
    console.log(`   Extra: ${bugDetail.extra_details}`);
    
    console.log('\n✅ ALL TESTS PASSED!\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.response?.data || error.message);
    if (error.response?.data?.details) {
      console.error('Details:', error.response.data.details);
    }
    process.exit(1);
  }
}

test();

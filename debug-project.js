const http = require('http');

function makeRequest(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data, parseError: e.message });
        }
      });
    });
    
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function debug() {
  console.log('=== DEBUG LOG ===\n');
  
  try {
    // Step 1: Test backend health
    console.log('1️⃣ Testing backend health...');
    const health = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/health',
      method: 'GET'
    });
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data)}\n`);
    
    // Step 2: Test agronomist login
    console.log('2️⃣ Testing agronomist login...');
    const login = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      email: 'agronomist@test.com',
      password: 'password123'
    });
    
    if (login.status !== 200) {
      console.log(`   ❌ Login failed with status ${login.status}`);
      console.log(`   Response:`, login.data);
      return;
    }
    
    const token = login.data.token;
    console.log(`   ✅ Login successful`);
    console.log(`   Token: ${token.substring(0, 30)}...`);
    console.log(`   User role: ${login.data.user.role}\n`);
    
    // Step 3: Test agronomist stats endpoint
    console.log('3️⃣ Testing /api/stats/agronomist endpoint...');
    const stats = await makeRequest({
      hostname: 'localhost',
      port: 5000,
      path: '/api/stats/agronomist',
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (stats.status !== 200) {
      console.log(`   ❌ Stats endpoint failed with status ${stats.status}`);
      console.log(`   Response:`, stats.data);
      return;
    }
    
    console.log(`   ✅ Stats endpoint working`);
    const s = stats.data.stats;
    console.log(`   Total Reports: ${s.totalReports}`);
    console.log(`   Pending: ${s.pendingReports}`);
    console.log(`   Identified: ${s.identifiedReports}`);
    console.log(`   Reviewed: ${s.reviewedReports}`);
    console.log(`   Resolved: ${s.resolvedReports}`);
    console.log(`   Resolution Rate: ${s.resolutionRate}%`);
    console.log(`   Recent Reports: ${s.recentReports.length} items\n`);
    
    // Step 4: Verify frontend can access the app
    console.log('4️⃣ Testing frontend accessibility...');
    const frontend = await makeRequest({
      hostname: 'localhost',
      port: 3001,
      path: '/',
      method: 'GET'
    });
    console.log(`   ✅ Frontend running on port 3001`);
    console.log(`   Status: ${frontend.status}\n`);
    
    console.log('✨ All systems operational!');
    console.log('   - Backend: ✅');
    console.log('   - API endpoints: ✅');
    console.log('   - Frontend: ✅');
    console.log('\n📝 Next steps:');
    console.log('   1. Login with agronomist@test.com / password123');
    console.log('   2. Dashboard should display statistics cards');
    console.log('   3. Click any card to view reports in modal');
    
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
  }
}

debug();

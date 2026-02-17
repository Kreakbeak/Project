const http = require('http');

async function testAPI() {
  return new Promise((resolve) => {
    // First, login
    const loginData = JSON.stringify({
      email: 'agronomist@test.com',
      password: 'password123'
    });

    const loginReq = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const loginRes = JSON.parse(data);
          const token = loginRes.token;
          console.log('✓ Login successful');
          
          // Now test stats endpoint
          const statsReq = http.request({
            hostname: 'localhost',
            port: 5000,
            path: '/api/stats/agronomist',
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }, (res) => {
            let statsData = '';
            res.on('data', (chunk) => { statsData += chunk; });
            res.on('end', () => {
              try {
                const statsRes = JSON.parse(statsData);
                console.log('✓ Stats endpoint successful!');
                console.log('Stats:', JSON.stringify(statsRes.stats, null, 2));
              } catch (e) {
                console.error('✗ Failed to parse stats response:', statsData);
              }
              resolve();
            });
          });
          
          statsReq.on('error', (e) => {
            console.error('✗ Stats request error:', e.message);
            resolve();
          });
          statsReq.end();
        } catch (e) {
          console.error('✗ Failed to parse login response:', data);
          resolve();
        }
      });
    });

    loginReq.on('error', (e) => {
      console.error('✗ Login request error:', e.message);
      resolve();
    });

    loginReq.write(loginData);
    loginReq.end();
  });
}

testAPI();

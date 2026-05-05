const http = require('http');

function testHazardsAPI() {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/hazards?minLng=8&minLat=33&maxLng=12&maxLat=37',
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  };

  const req = http.request(options, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      const parsed = JSON.parse(data);
      console.log('Success:', parsed.success);
      console.log('Count:', parsed.count || parsed.data?.length);
      console.log('Sample hazard:', JSON.stringify(parsed.data?.[0], null, 2));
    });
  });

  req.on('error', (e) => console.error('Error:', e.message));
  req.end();
}

testHazardsAPI();

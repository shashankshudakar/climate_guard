/**
 * Simple Test Script for /api/test endpoint
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';

function makeRequest(endpoint) {
    return new Promise((resolve, reject) => {
        const url = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`);

        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        data: JSON.parse(data),
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        data: data,
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        req.end();
    });
}

async function testAPI() {
    console.log('\n═══════════════════════════════════════════');
    console.log('  ClimateGuard API Test Route');
    console.log('═══════════════════════════════════════════\n');

    try {
        console.log('Testing GET /api/test...\n');
        const response = await makeRequest('/api/test');

        console.log(`Status: ${response.status} ${response.statusText}`);
        console.log(`\nResponse Data:`);
        console.log(JSON.stringify(response.data, null, 2));

        if (response.status === 200 && response.data.status === 'success') {
            console.log('\n✓ Test PASSED');
            process.exit(0);
        } else {
            console.log('\n✗ Test FAILED');
            process.exit(1);
        }
    } catch (err) {
        console.error(`✗ Error: ${err.message}`);
        console.log('\nMake sure the server is running: npm start');
        process.exit(1);
    }
}

testAPI();

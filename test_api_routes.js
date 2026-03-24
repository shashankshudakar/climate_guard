/**
 * Test Script for New API Routes
 * Tests: /api/weather, /api/rainfall, /api/soil, /api/crop-recommendation
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'http://localhost:5000';
const USE_HTTPS = false;

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function makeRequest(endpoint, method = 'GET') {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`);
        const client = urlObj.protocol === 'https:' ? https : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        data: JSON.parse(data),
                        headers: res.headers,
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        statusText: res.statusMessage,
                        data: data,
                        headers: res.headers,
                    });
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(10000);
        req.end();
    });
}

async function testRoutes() {
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  ClimateGuard API Routes Test Suite${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════${colors.reset}\n`);

    const tests = [
        // Test 1: /api/weather (all districts)
        {
            name: '1. GET /api/weather (All Major Districts)',
            endpoint: '/api/weather',
            method: 'GET',
        },
        // Test 2: /api/weather with specific district
        {
            name: '2. GET /api/weather?district=Bengaluru Urban',
            endpoint: '/api/weather?district=Bengaluru Urban',
            method: 'GET',
        },
        // Test 3: /api/weather with days parameter
        {
            name: '3. GET /api/weather?district=Mysuru&days=5',
            endpoint: '/api/weather?district=Mysuru&days=5',
            method: 'GET',
        },
        // Test 4: /api/rainfall (all data)
        {
            name: '4. GET /api/rainfall (All Records)',
            endpoint: '/api/rainfall',
            method: 'GET',
        },
        // Test 5: /api/rainfall with district filter
        {
            name: '5. GET /api/rainfall?district=Bengaluru Urban&limit=5',
            endpoint: '/api/rainfall?district=Bengaluru Urban&limit=5',
            method: 'GET',
        },
        // Test 6: /api/rainfall with year filter
        {
            name: '6. GET /api/rainfall?year=2023&limit=10',
            endpoint: '/api/rainfall?year=2023&limit=10',
            method: 'GET',
        },
        // Test 7: /api/soil (all data)
        {
            name: '7. GET /api/soil (All Records)',
            endpoint: '/api/soil',
            method: 'GET',
        },
        // Test 8: /api/soil with district filter
        {
            name: '8. GET /api/soil?district=Mysuru&limit=5',
            endpoint: '/api/soil?district=Mysuru&limit=5',
            method: 'GET',
        },
        // Test 9: /api/soil with soil_type filter
        {
            name: '9. GET /api/soil?soil_type=black&limit=10',
            endpoint: '/api/soil?soil_type=black&limit=10',
            method: 'GET',
        },
        // Test 10: /api/crop-recommendation (all data)
        {
            name: '10. GET /api/crop-recommendation (All Records)',
            endpoint: '/api/crop-recommendation',
            method: 'GET',
        },
        // Test 11: /api/crop-recommendation with soil_type filter
        {
            name: '11. GET /api/crop-recommendation?soil_type=black&limit=10',
            endpoint: '/api/crop-recommendation?soil_type=black&limit=10',
            method: 'GET',
        },
        // Test 12: /api/crop-recommendation with rainfall_level filter
        {
            name: '12. GET /api/crop-recommendation?rainfall_level=high&limit=10',
            endpoint: '/api/crop-recommendation?rainfall_level=high&limit=10',
            method: 'GET',
        },
        // Test 13: Combined filters
        {
            name: '13. GET /api/crop-recommendation?soil_type=black&rainfall_level=high&limit=5',
            endpoint: '/api/crop-recommendation?soil_type=black&rainfall_level=high&limit=5',
            method: 'GET',
        },
        // Test 14: Invalid district test
        {
            name: '14. GET /api/weather?district=InvalidDistrict (Error Handling)',
            endpoint: '/api/weather?district=InvalidDistrict',
            method: 'GET',
        },
    ];

    let passed = 0;
    let failed = 0;

    for (const test of tests) {
        console.log(`${colors.cyan}${test.name}${colors.reset}`);
        console.log(`  Endpoint: ${test.endpoint}`);

        try {
            const response = await makeRequest(test.endpoint, test.method);
            const statusOk = response.status >= 200 && response.status < 300;
            
            console.log(`  Status: ${statusOk ? colors.green : colors.red}${response.status} ${response.statusText}${colors.reset}`);

            if (response.data) {
                if (typeof response.data === 'object') {
                    console.log(`  Response Keys: ${Object.keys(response.data).join(', ')}`);
                    
                    // Show specific data based on response
                    if (response.data.total_records !== undefined) {
                        console.log(`  Records Found: ${response.data.total_records}`);
                    }
                    if (response.data.status) {
                        console.log(`  Status Msg: ${response.data.status}`);
                    }
                    if (response.data.message) {
                        console.log(`  Message: ${response.data.message}`);
                    }
                    if (response.data.data && Array.isArray(response.data.data)) {
                        console.log(`  Data Array Length: ${response.data.data.length}`);
                        if (response.data.data.length > 0) {
                            console.log(`  First Record Keys: ${Object.keys(response.data.data[0]).join(', ')}`);
                        }
                    }
                } else {
                    console.log(`  Response: ${response.data.substring(0, 100)}`);
                }
            }

            if (statusOk) {
                passed++;
                console.log(`  ${colors.green}✓ PASSED${colors.reset}`);
            } else {
                failed++;
                console.log(`  ${colors.red}✗ FAILED${colors.reset}`);
            }
        } catch (err) {
            failed++;
            console.log(`  ${colors.red}✗ ERROR: ${err.message}${colors.reset}`);
        }

        console.log();
    }

    // Summary
    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Test Summary${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${failed}${colors.reset}`);
    console.log(`Total:  ${passed + failed}`);
    console.log(`Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%\n`);

    process.exit(failed > 0 ? 1 : 0);
}

// Check if server is running
async function checkServer() {
    try {
        await makeRequest('/api/health', 'GET');
        return true;
    } catch (err) {
        return false;
    }
}

async function main() {
    try {
        console.log(`\n${colors.yellow}Checking if server is running at ${BASE_URL}...${colors.reset}`);
        const serverRunning = await checkServer();

        if (!serverRunning) {
            console.log(`${colors.red}✗ Server is not running at ${BASE_URL}${colors.reset}`);
            console.log(`${colors.yellow}Please start the server first with: npm start${colors.reset}\n`);
            process.exit(1);
        }

        console.log(`${colors.green}✓ Server is running!${colors.reset}\n`);
        await testRoutes();
    } catch (err) {
        console.error(`${colors.red}Unexpected error: ${err.message}${colors.reset}`);
        process.exit(1);
    }
}

main();

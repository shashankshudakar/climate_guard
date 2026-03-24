/**
 * ML Integration Test Script
 * Tests the /api/rainfall-predict endpoint and Python integration
 */

const http = require('http');
const { exec, execFile, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';
const ML_DIR = path.join(__dirname, '..', 'ml_model');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
};

function log(type, message) {
    const types = {
        info: `${colors.cyan}ℹ${colors.reset}`,
        success: `${colors.green}✓${colors.reset}`,
        error: `${colors.red}✗${colors.reset}`,
        warning: `${colors.yellow}⚠${colors.reset}`,
    };
    console.log(`  ${types[type] || type} ${message}`);
}

function makeRequest(endpoint, method = 'POST', body = null) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`);
        const client = urlObj.protocol === 'https:' ? require('https') : http;

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname + urlObj.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000,
        };

        if (body) {
            const bodyStr = JSON.stringify(body);
            options.headers['Content-Length'] = Buffer.byteLength(bodyStr);
            options.bodyStr = bodyStr;
        }

        const req = client.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(data),
                    });
                } catch {
                    resolve({
                        status: res.statusCode,
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

        if (body && options.bodyStr) req.write(options.bodyStr);
        req.end();
    });
}

function checkPythonSetup() {
    console.log(`\n${colors.cyan}${colors.bright}Checking Python Setup${colors.reset}`);
    console.log('─'.repeat(50));

    // Check if model files exist
    const modelPath = path.join(ML_DIR, 'rainfall_model.pkl');
    const encoderPath = path.join(ML_DIR, 'label_encoder.pkl');
    const predictScript = path.join(ML_DIR, 'predict_server.py');

    let allOk = true;

    if (!fs.existsSync(modelPath)) {
        log('error', `Model file not found: ${modelPath}`);
        allOk = false;
    } else {
        log('success', `Model file exists`);
    }

    if (!fs.existsSync(encoderPath)) {
        log('error', `Encoder file not found: ${encoderPath}`);
        allOk = false;
    } else {
        log('success', `Encoder file exists`);
    }

    if (!fs.existsSync(predictScript)) {
        log('error', `Predict script not found: ${predictScript}`);
        allOk = false;
    } else {
        log('success', `Predict script exists`);
    }

    return allOk;
}

async function testPythonDirect() {
    console.log(`\n${colors.cyan}${colors.bright}Testing Python Predict Server (Port 5001)${colors.reset}`);
    console.log('─'.repeat(50));

    const testCases = [
        { temp: 28.5, humidity: 85, month: 7, name: 'July Monsoon' },
        { temp: 32.0, humidity: 55, month: 1, name: 'January Dry' },
        { temp: 30.0, humidity: 70, month: 5, name: 'May Summer' },
    ];

    let allPassed = true;

    for (const test of testCases) {
        try {
            const response = await makeRequest('http://127.0.0.1:5001/predict', 'POST', {
                temperature: test.temp,
                humidity: test.humidity,
                month: test.month
            });

            if (response.status === 200) {
                const data = response.data;
                if (data.error) {
                    log('error', `${test.name}: ${data.error}`);
                    allPassed = false;
                } else {
                    log('success', `${test.name} → ${data.level} (${data.confidence}%)`);
                }
            } else {
                log('error', `${test.name}: Server failed - ${JSON.stringify(response.data)}`);
                allPassed = false;
            }
        } catch (err) {
            log('error', `${test.name}: ${err.message} (Is Python server running?)`);
            allPassed = false;
        }
    }

    return allPassed;
}

async function testAPIEndpoint() {
    console.log(`\n${colors.cyan}${colors.bright}Testing Node.js API Endpoint${colors.reset}`);
    console.log('─'.repeat(50));

    const testCases = [
        { temperature: 28.5, humidity: 85, month: 7, name: 'July Monsoon' },
        { temperature: 32.0, humidity: 55, month: 1, name: 'January Dry' },
        { temperature: 30.0, humidity: 70, month: 5, name: 'May Summer' },
        { temperature: 25.0, humidity: 92, month: 8, name: 'August Peak' },
    ];

    let allPassed = true;

    for (const test of testCases) {
        try {
            const response = await makeRequest('/api/rainfall-predict', 'POST', {
                temperature: test.temperature,
                humidity: test.humidity,
                month: test.month,
            });

            if (response.status === 200 && response.data.prediction) {
                const conf = response.data.confidence;
                log('success', `${test.name} → ${response.data.prediction} (${conf}%)`);
            } else {
                log('error', `${test.name}: ${response.data.error || 'Unknown error'}`);
                allPassed = false;
            }
        } catch (err) {
            log('error', `${test.name}: ${err.message}`);
            allPassed = false;
        }
    }

    return allPassed;
}

async function testErrorHandling() {
    console.log(`\n${colors.cyan}${colors.bright}Testing Error Handling${colors.reset}`);
    console.log('─'.repeat(50));

    const errorCases = [
        { data: {}, name: 'Missing parameters' },
        { data: { temperature: 28, humidity: 80 }, name: 'Missing month' },
        { data: { temperature: 28, humidity: 80, month: 13 }, name: 'Invalid month' },
        { data: { temperature: 'invalid', humidity: 80, month: 5 }, name: 'Invalid temperature' },
    ];

    let allPassed = true;

    for (const test of errorCases) {
        try {
            const response = await makeRequest('/api/rainfall-predict', 'POST', test.data);

            if (response.status >= 400) {
                log('success', `${test.name} → properly rejected with error`);
            } else if (response.data.error) {
                log('success', `${test.name} → error response received`);
            } else {
                log('warning', `${test.name} → unexpected success`);
                allPassed = false;
            }
        } catch (err) {
            log('error', `${test.name}: ${err.message}`);
            allPassed = false;
        }
    }

    return allPassed;
}

async function runTests() {
    console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  ClimateGuard ML Integration Test Suite${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════${colors.reset}`);

    try {
        // Check server
        console.log(`\n${colors.yellow}Checking if server is running...${colors.reset}`);
        await makeRequest('/api/health', 'GET');
        log('success', 'Backend server is running');
    } catch (err) {
        log('error', 'Backend server is not running at ' + BASE_URL);
        log('info', 'Start it with: npm start');
        process.exit(1);
    }

    // Run tests
    const results = {
        pythonSetup: checkPythonSetup(),
        pythonDirect: await testPythonDirect(),
        apiEndpoint: await testAPIEndpoint(),
        errorHandling: await testErrorHandling(),
    };

    // Summary
    console.log(`\n${colors.bright}${colors.cyan}════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}Test Summary${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}════════════════════════════════════════════════════${colors.reset}`);

    const passed = Object.values(results).filter(r => r).length;
    const total = Object.keys(results).length;

    console.log('');
    console.log(`Python Setup:       ${results.pythonSetup ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);
    console.log(`Python Direct:      ${results.pythonDirect ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);
    console.log(`API Endpoint:       ${results.apiEndpoint ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);
    console.log(`Error Handling:     ${results.errorHandling ? colors.green + '✓ PASSED' : colors.red + '✗ FAILED'}${colors.reset}`);
    console.log('');
    console.log(`Total: ${colors.bright}${passed}/${total} passed${colors.reset}`);
    console.log(`Success Rate: ${Math.round((passed / total) * 100)}%\n`);

    process.exit(passed === total ? 0 : 1);
}

runTests();

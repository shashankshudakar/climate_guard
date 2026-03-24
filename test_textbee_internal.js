const axios = require('axios');
require('dotenv').config();

const apiKey = process.env.TEXTBEE_API_KEY;
const deviceId = process.env.TEXTBEE_DEVICE_ID;

async function testSMS() {
    console.log('Testing TextBee API...');
    console.log('API Key:', apiKey ? 'Present' : 'Missing');
    console.log('Device ID:', deviceId);

    if (!apiKey || !deviceId) {
        console.error('Credentials missing in backend/.env');
        return;
    }

    try {
        const response = await axios.post(
            `https://api.textbee.dev/api/v1/gateway/devices/${deviceId}/sendSMS`,
            {
                receivers: ['+919448952748'], 
                smsBody: 'ClimateGuard Test SMS from Internal Script'
            },
            {
                headers: {
                    'x-api-key': apiKey
                }
            }
        );
        console.log('Response Status:', response.status);
        console.log('Response Data:', response.data);
    } catch (error) {
        console.error('Error Status:', error.response?.status);
        console.error('Error Data:', error.response?.data || error.message);
    }
}

testSMS();

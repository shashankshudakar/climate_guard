const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const TEXTBEE_API_KEY = process.env.TEXTBEE_API_KEY;
const TEXTBEE_DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

async function testSMS() {
    console.log('Testing TextBee API...');
    console.log('API Key:', TEXTBEE_API_KEY ? 'Set' : 'Missing');
    console.log('Device ID:', TEXTBEE_DEVICE_ID);

    try {
        const response = await axios.post(
            `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/sendSMS`,
            {
                receivers: ["+919876543210"],
                smsBody: "Test SMS from ClimateGuard"
            },
            {
                headers: {
                    'x-api-key': TEXTBEE_API_KEY
                }
            }
        );
        console.log('Success!', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testSMS();

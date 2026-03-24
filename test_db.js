const mysql = require('mysql2/promise');
require('dotenv').config();

async function test() {
    console.log('Testing connection with:');
    console.log('Host:', process.env.DB_HOST);
    console.log('User:', process.env.DB_USER);
    console.log('Password:', process.env.DB_PASSWORD ? '********' : '(empty)');
    console.log('Port:', process.env.DB_PORT);

    try {
        const conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
        });
        console.log('✅ Success!');
        await conn.end();
    } catch (err) {
        console.error('❌ Connection Failed!');
        console.error('Error Code:', err.code);
        console.error('Error Message:', err.message);
    }
}
test();

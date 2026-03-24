/**
 * ClimateGuard — MySQL Database Setup
 * =====================================
 * Creates the climateguard database and tables, then populates from CSV files.
 *
 * Usage: node db_setup.js
 *
 * Prerequisites: MySQL server must be running
 */

require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DATASET_DIR = path.join(__dirname, '..', 'dataset');

function readCsv(filepath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filepath)
            .pipe(csv())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', reject);
    });
}

async function setup() {
    console.log('\n🗄️  ClimateGuard — Database Setup');
    console.log('='.repeat(45));

    // Connect without database first to create it
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        port: process.env.DB_PORT || 3306,
    });

    const dbName = process.env.DB_NAME || 'climateguard';

    // Create database
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await conn.query(`USE \`${dbName}\``);
    console.log(`  ✅ Database '${dbName}' ready`);

    // Create tables
    await conn.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE,
            email VARCHAR(150) DEFAULT '',
            phone VARCHAR(15) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            user_role ENUM('farmer', 'public') DEFAULT 'public',
            avatar LONGTEXT DEFAULT 'assets/user_avatar.png',
            district VARCHAR(100) DEFAULT '',
            alerts_enabled BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('  ✅ Table: users');

    await conn.query(`
        CREATE TABLE IF NOT EXISTS soil_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            district VARCHAR(100) NOT NULL,
            soil_type VARCHAR(50),
            ph_level DECIMAL(4,2),
            nitrogen INT,
            phosphorus INT,
            potassium INT
        )
    `);
    console.log('  ✅ Table: soil_data');

    await conn.query(`
        CREATE TABLE IF NOT EXISTS crop_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            soil_type VARCHAR(50),
            rainfall_level VARCHAR(50),
            temperature_range VARCHAR(20),
            recommended_crop VARCHAR(100)
        )
    `);
    console.log('  ✅ Table: crop_data');

    await conn.query(`
        CREATE TABLE IF NOT EXISTS forest_data (
            id INT AUTO_INCREMENT PRIMARY KEY,
            district VARCHAR(100) NOT NULL,
            forest_area_sqkm DECIMAL(10,2),
            forest_percentage DECIMAL(5,2),
            year INT
        )
    `);
    console.log('  ✅ Table: forest_data');

    // Populate from CSVs
    console.log('\n  📂 Populating tables from CSV files...');

    // Soil data
    const soilPath = path.join(DATASET_DIR, 'soil_dataset.csv');
    if (fs.existsSync(soilPath)) {
        const [existing] = await conn.query('SELECT COUNT(*) as cnt FROM soil_data');
        if (existing[0].cnt === 0) {
            const rows = await readCsv(soilPath);
            for (const r of rows) {
                await conn.query(
                    'INSERT INTO soil_data (district, soil_type, ph_level, nitrogen, phosphorus, potassium) VALUES (?,?,?,?,?,?)',
                    [r.district, r.soil_type, r.ph_level, r.nitrogen, r.phosphorus, r.potassium]
                );
            }
            console.log(`     soil_data: ${rows.length} records inserted`);
        } else {
            console.log(`     soil_data: ${existing[0].cnt} records already exist (skipped)`);
        }
    }

    // Crop recommendation
    const cropPath = path.join(DATASET_DIR, 'crop_recommendation.csv');
    if (fs.existsSync(cropPath)) {
        const [existing] = await conn.query('SELECT COUNT(*) as cnt FROM crop_data');
        if (existing[0].cnt === 0) {
            const rows = await readCsv(cropPath);
            for (const r of rows) {
                await conn.query(
                    'INSERT INTO crop_data (soil_type, rainfall_level, temperature_range, recommended_crop) VALUES (?,?,?,?)',
                    [r.soil_type, r.rainfall_level, r.temperature_range, r.recommended_crop]
                );
            }
            console.log(`     crop_data: ${rows.length} records inserted`);
        } else {
            console.log(`     crop_data: ${existing[0].cnt} records already exist (skipped)`);
        }
    }

    // Forest data
    const forestPath = path.join(DATASET_DIR, 'forest_dataset.csv');
    if (fs.existsSync(forestPath)) {
        const [existing] = await conn.query('SELECT COUNT(*) as cnt FROM forest_data');
        if (existing[0].cnt === 0) {
            const rows = await readCsv(forestPath);
            for (const r of rows) {
                await conn.query(
                    'INSERT INTO forest_data (district, forest_area_sqkm, forest_percentage, year) VALUES (?,?,?,?)',
                    [r.district, r.forest_area_sqkm, r.forest_percentage, r.year]
                );
            }
            console.log(`     forest_data: ${rows.length} records inserted`);
        } else {
            console.log(`     forest_data: ${existing[0].cnt} records already exist (skipped)`);
        }
    }

    await conn.end();
    console.log('\n  ✅ Database setup complete!\n');
}

setup().catch(err => {
    console.error('\n  ❌ Setup failed:', err.message);
    console.log('  Make sure MySQL is installed and running.\n');
    process.exit(1);
});

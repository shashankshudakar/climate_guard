/**
 * ClimateGuard Backend — Enhanced Express REST API Server (Database Optimized)
 * =========================================================
 * Features:
 *   - MySQL database with JSON file fallback
 *   - Role-based authentication (farmer / public) with JWT
 *   - Rainfall prediction via Python ML model (child_process)
 *   - REST APIs for soil, forest, crop, weather data
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const https = require('https');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const csv = require('csv-parser');
const axios = require('axios');
const { execFile } = require('child_process');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'climateguard_secret_key_2026';

// TextBee Config (Free SMS via Android)
const TEXTBEE_API_KEY = process.env.TEXTBEE_API_KEY;
const TEXTBEE_DEVICE_ID = process.env.TEXTBEE_DEVICE_ID;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── Paths ──────────────────────────────────────────────────────────────────
const PROJECT_ROOT = path.join(__dirname, '..');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const CROP_TRACKER_FILE = path.join(__dirname, 'data', 'crop_tracker.json');
const FRONTEND_DATA_DIR = path.join(PROJECT_ROOT, 'frontend', 'data');
const DATASET_DIR = path.join(PROJECT_ROOT, 'dataset');
const ML_MODEL_DIR = path.join(PROJECT_ROOT, 'ml_model');
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const DATA_GOV_API_KEY = process.env.DATA_GOV_API_KEY;
const DATA_GOV_RESOURCE_ID = process.env.DATA_GOV_RESOURCE_ID; // Default Mandi Price Resource ID


// ═════════════════════════════════════════════════════════════════════════════
//  MySQL Connection (with fallback)
// ═════════════════════════════════════════════════════════════════════════════

let db = null;
let useMySQL = false;

async function initDatabase() {
    try {
        const mysql = require('mysql2/promise');
        db = await mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'climateguard',
            port: Number(process.env.DB_PORT) || 3306,
            waitForConnections: true,
            connectionLimit: 10,
        });
        // Test connection
        await db.query('SELECT 1');

        // Ensure avatar column can store base64 images
        try {
            const [cols] = await db.query("SHOW COLUMNS FROM users LIKE 'avatar'");
            if (cols && cols.length > 0) {
                const colType = String(cols[0].Type || '').toLowerCase();
                if (colType !== 'longtext') {
                    await db.query('ALTER TABLE users MODIFY avatar LONGTEXT');
                    console.log('  âœ… Migrated users.avatar to LONGTEXT');
                }
            }
        } catch (migrateErr) {
            // If users table doesn't exist yet or migration fails, continue startup
            console.log(`  âš ï¸  Avatar migration skipped (${migrateErr.code || migrateErr.message})`);
        }

        // Ensure district column exists
        try {
            const [distCols] = await db.query("SHOW COLUMNS FROM users LIKE 'district'");
            if (!distCols || distCols.length === 0) {
                await db.query("ALTER TABLE users ADD COLUMN district VARCHAR(100) DEFAULT ''");
                console.log('  ✅ Migrated users table: added district column');
            }
        } catch (distErr) {
            console.log(`  ⚠️  District migration skipped (${distErr.code || distErr.message})`);
        }

        // Ensure alerts_enabled column exists
        try {
            const [alertCols] = await db.query("SHOW COLUMNS FROM users LIKE 'alerts_enabled'");
            if (!alertCols || alertCols.length === 0) {
                await db.query("ALTER TABLE users ADD COLUMN alerts_enabled BOOLEAN DEFAULT TRUE");
                console.log('  ✅ Migrated users table: added alerts_enabled column');
            }
        } catch (alertErr) {
            console.log(`  ⚠️  Alerts migration skipped (${alertErr.code || alertErr.message})`);
        }

        // Create tracked_crops table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS tracked_crops (
                id VARCHAR(50) PRIMARY KEY,
                username VARCHAR(100) NOT NULL,
                crop VARCHAR(50) NOT NULL,
                district VARCHAR(100),
                soilType VARCHAR(50),
                farmAcres DECIMAL(10,2),
                waterFacility VARCHAR(50),
                farmName VARCHAR(100),
                sowingDate DATE,
                maturityDays INT,
                createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_user (username)
            )
        `);

        useMySQL = true;
        console.log('  ✅ MySQL connected');
    } catch (err) {
        console.log(`  ⚠️  MySQL unavailable (${err.code || err.message})`);
        if (err.stack) console.log(err.stack);
        console.log('  📁 Using JSON file fallback');
        useMySQL = false;
    }
}


// ═════════════════════════════════════════════════════════════════════════════
//  Helper Functions
// ═════════════════════════════════════════════════════════════════════════════

function loadUsers() {
    try {
        if (!fs.existsSync(USERS_FILE)) return [];
        return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
    } catch { return []; }
}

function saveUsers(users) {
    const dir = path.dirname(USERS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

function loadJsonFile(filename) {
    const filepath = path.join(FRONTEND_DATA_DIR, filename);
    if (!fs.existsSync(filepath)) return null;
    return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

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

async function httpsGet(url, redirects = 0) {
    if (redirects > 5) throw new Error('Too many redirects');
    const response = await fetch(url, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ClimateGuard/2.0',
            'Accept': 'application/json'
        },
        redirect: 'follow'
    });
    if (!response.ok) {
        throw new Error(`Request Failed. Status Code: ${response.status}`);
    }
    return await response.json();
}

function findPython() {
    // Try common python paths on Windows
    const candidates = ['python', 'python3', 'py'];
    // Also check the PATH-refreshed location
    const localAppData = process.env.LOCALAPPDATA || '';
    if (localAppData) {
        candidates.push(path.join(localAppData, 'Programs', 'Python', 'Python312', 'python.exe'));
        candidates.push(path.join(localAppData, 'Programs', 'Python', 'Python311', 'python.exe'));
    }
    // Check Program Files
    candidates.push('C:\\Python312\\python.exe');
    candidates.push('C:\\Python311\\python.exe');
    return candidates;
}

// ─── Fetch Retry Helper for ML Server ───
async function fetchWithRetry(url, options, retries = 5, delay = 1500) {
    for (let i = 0; i < retries; i++) {
        try {
            return await fetch(url, options);
        } catch (error) {
            if (error.cause && error.cause.code === 'ECONNREFUSED' && i < retries - 1) {
                console.log(`  [ML-Server] Waiting to connect... retrying in ${delay}ms (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                throw error;
            }
        }
    }
}



// ═════════════════════════════════════════════════════════════════════════════
//  JWT Middleware
// ═════════════════════════════════════════════════════════════════════════════

function generateToken(user) {
    return jwt.sign(
        { name: user.name, role: user.user_role || user.role || 'public' },
        JWT_SECRET,
        { expiresIn: '24h' }
    );
}

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

function roleMiddleware(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                error: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user?.role || 'none'}`
            });
        }
        next();
    };
}


// ═════════════════════════════════════════════════════════════════════════════
//  District Data
// ═════════════════════════════════════════════════════════════════════════════

const DISTRICT_COORDS = {
    "Bagalkote": { lat: 16.18, lng: 75.69 },
    "Ballari": { lat: 15.14, lng: 76.92 },
    "Belagavi": { lat: 15.85, lng: 74.50 },
    "Bengaluru Rural": { lat: 13.22, lng: 77.71 },
    "Bengaluru Urban": { lat: 12.97, lng: 77.59 },
    "Bidar": { lat: 17.91, lng: 77.52 },
    "Chamarajanagar": { lat: 11.92, lng: 76.94 },
    "Chikballapur": { lat: 13.44, lng: 77.73 },
    "Chikmagalur": { lat: 13.32, lng: 75.77 },
    "Chitradurga": { lat: 14.23, lng: 76.40 },
    "Dakshina Kannada": { lat: 12.87, lng: 74.88 },
    "Davanagere": { lat: 14.47, lng: 75.92 },
    "Dharwad": { lat: 15.46, lng: 75.01 },
    "Gadag": { lat: 15.43, lng: 75.63 },
    "Hassan": { lat: 13.01, lng: 76.10 },
    "Haveri": { lat: 14.79, lng: 75.40 },
    "Kalaburagi": { lat: 17.33, lng: 76.83 },
    "Kodagu": { lat: 12.42, lng: 75.74 },
    "Kolar": { lat: 13.14, lng: 78.13 },
    "Koppal": { lat: 15.35, lng: 76.15 },
    "Mandya": { lat: 12.52, lng: 76.90 },
    "Mysuru": { lat: 12.30, lng: 76.66 },
    "Raichur": { lat: 16.21, lng: 77.36 },
    "Ramanagara": { lat: 12.72, lng: 77.28 },
    "Shimoga": { lat: 13.93, lng: 75.57 },
    "Tumakuru": { lat: 13.34, lng: 77.10 },
    "Udupi": { lat: 13.34, lng: 74.75 },
    "Uttara Kannada": { lat: 14.78, lng: 74.69 },
    "Vijayanagara": { lat: 15.34, lng: 76.47 },
    "Vijayapura": { lat: 16.83, lng: 75.71 },
    "Yadgir": { lat: 16.77, lng: 77.14 },
};

const DISTRICT_DATA = {
    "Bagalkote": { soil: "black", crops: ["maize", "sugarcane", "cotton"], rainfall: "Low to Moderate", temp: "32°C", humidity: "55%" },
    "Ballari": { soil: "black", crops: ["maize", "rice", "cotton"], rainfall: "Moderate", temp: "33°C", humidity: "50%" },
    "Belagavi": { soil: "black", crops: ["sugarcane", "maize", "rice"], rainfall: "High", temp: "28°C", humidity: "70%" },
    "Bengaluru Rural": { soil: "silty-loam", crops: ["rice", "maize", "ginger"], rainfall: "Moderate", temp: "27°C", humidity: "65%" },
    "Bengaluru Urban": { soil: "silty-loam", crops: ["rice", "ragi", "ginger"], rainfall: "Moderate", temp: "28°C", humidity: "60%" },
    "Bidar": { soil: "black", crops: ["maize", "pulses", "sugarcane"], rainfall: "Moderate", temp: "31°C", humidity: "58%" },
    "Chamarajanagar": { soil: "red", crops: ["maize", "sugarcane", "pulses"], rainfall: "Moderate", temp: "29°C", humidity: "62%" },
    "Chikballapur": { soil: "red", crops: ["maize", "sugarcane", "ginger"], rainfall: "Low", temp: "30°C", humidity: "52%" },
    "Chikmagalur": { soil: "laterite", crops: ["coffee", "tea", "ginger"], rainfall: "Very High", temp: "24°C", humidity: "82%" },
    "Chitradurga": { soil: "black", crops: ["maize", "cotton", "rice"], rainfall: "Low", temp: "31°C", humidity: "48%" },
    "Dakshina Kannada": { soil: "laterite", crops: ["coconut", "cocoa", "ginger"], rainfall: "Very High", temp: "30°C", humidity: "85%" },
    "Davanagere": { soil: "clay-loam", crops: ["maize", "rice", "sugarcane"], rainfall: "Moderate", temp: "30°C", humidity: "60%" },
    "Dharwad": { soil: "black", crops: ["maize", "cotton", "wheat"], rainfall: "Moderate", temp: "29°C", humidity: "58%" },
    "Gadag": { soil: "black", crops: ["maize", "cotton", "wheat"], rainfall: "Low", temp: "32°C", humidity: "45%" },
    "Hassan": { soil: "loam", crops: ["coffee", "ginger", "maize"], rainfall: "High", temp: "26°C", humidity: "75%" },
    "Haveri": { soil: "black", crops: ["maize", "sugarcane", "cotton"], rainfall: "Moderate", temp: "30°C", humidity: "58%" },
    "Kalaburagi": { soil: "black", crops: ["maize", "pulses", "sugarcane"], rainfall: "Low", temp: "34°C", humidity: "42%" },
    "Kodagu": { soil: "laterite", crops: ["coffee", "ginger", "cocoa"], rainfall: "Very High", temp: "22°C", humidity: "88%" },
    "Kolar": { soil: "red", crops: ["maize", "ragi", "ginger"], rainfall: "Low", temp: "30°C", humidity: "50%" },
    "Koppal": { soil: "black", crops: ["maize", "rice", "cotton"], rainfall: "Low", temp: "33°C", humidity: "45%" },
    "Mandya": { soil: "clay-loam", crops: ["rice", "sugarcane", "maize"], rainfall: "Moderate", temp: "28°C", humidity: "65%" },
    "Mysuru": { soil: "clay-loam", crops: ["rice", "sugarcane", "maize"], rainfall: "Moderate", temp: "27°C", humidity: "68%" },
    "Raichur": { soil: "black", crops: ["rice", "cotton", "maize"], rainfall: "Low", temp: "34°C", humidity: "40%" },
    "Ramanagara": { soil: "red", crops: ["ragi", "maize", "sugarcane"], rainfall: "Moderate", temp: "28°C", humidity: "62%" },
    "Shimoga": { soil: "laterite", crops: ["rice", "ginger", "maize"], rainfall: "High", temp: "26°C", humidity: "78%" },
    "Tumakuru": { soil: "red", crops: ["maize", "ragi", "sugarcane"], rainfall: "Low", temp: "30°C", humidity: "50%" },
    "Udupi": { soil: "laterite", crops: ["coconut", "cocoa", "ginger"], rainfall: "Very High", temp: "30°C", humidity: "86%" },
    "Uttara Kannada": { soil: "laterite", crops: ["rice", "coconut", "ginger"], rainfall: "Very High", temp: "28°C", humidity: "80%" },
    "Vijayanagara": { soil: "black", crops: ["rice", "maize", "cotton"], rainfall: "Moderate", temp: "31°C", humidity: "55%" },
    "Vijayapura": { soil: "black", crops: ["maize", "sugarcane", "pulses"], rainfall: "Low", temp: "33°C", humidity: "42%" },
    "Yadgir": { soil: "black", crops: ["maize", "rice", "cotton"], rainfall: "Low", temp: "34°C", humidity: "40%" },
};

const WAREHOUSE_DATA = [
    { id: "W001", name: "KSWC Warehouse - Bagalkote", type: "Government", lat: 16.182, lng: 75.697, capacity_total: 5000, capacity_used: 3500, price_per_unit: 2.5, unit: "kg/month", crops: ["Maize", "Sugarcane", "Cotton"] },
    { id: "W002", name: "Bellary Cold Storage", type: "Private", lat: 15.145, lng: 76.923, capacity_total: 2000, capacity_used: 1950, price_per_unit: 4.0, unit: "kg/month", crops: ["Rice", "Chilli"] },
    { id: "W003", name: "Central Warehouse - Bengaluru Rural", type: "Government", lat: 13.225, lng: 77.712, capacity_total: 8000, capacity_used: 2000, price_per_unit: 3.0, unit: "kg/month", crops: ["Rice", "Ginger", "Vegetables"] },
    { id: "W004", name: "Farmer Co-op Storage - Belagavi", type: "Private", lat: 15.852, lng: 74.505, capacity_total: 3500, capacity_used: 1000, price_per_unit: 2.2, unit: "kg/month", crops: ["Sugarcane", "Maize"] },
    { id: "W005", name: "Hassan Coffee & Spice Storage", type: "Private", lat: 13.012, lng: 76.105, capacity_total: 1500, capacity_used: 1450, price_per_unit: 5.5, unit: "kg/month", crops: ["Coffee", "Ginger", "Pepper"] },
    { id: "W006", name: "Bengaluru Urban Multi-Cold Storage", type: "Private", lat: 12.975, lng: 77.595, capacity_total: 10000, capacity_used: 8000, price_per_unit: 4.5, unit: "kg/month", crops: ["Fruits", "Vegetables", "Flowers"] },
    { id: "W007", name: "Bidar Pulses Storage Center", type: "Government", lat: 17.915, lng: 77.525, capacity_total: 4000, capacity_used: 3800, price_per_unit: 2.0, unit: "kg/month", crops: ["Pulses", "Maize", "Sugarcane"] },
    { id: "W050", name: "Bidar North-Zone Pulses Yard", type: "Government", lat: 17.908, lng: 77.518, capacity_total: 5000, capacity_used: 1000, price_per_unit: 1.8, unit: "kg/month", crops: ["Toor", "Moong", "Chana"] }
];


// ═════════════════════════════════════════════════════════════════════════════
//  API ROUTES
// ═════════════════════════════════════════════════════════════════════════════

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'ClimateGuard Backend is running 🌿',
        database: useMySQL ? 'MySQL' : 'JSON (fallback)',
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'ClimateGuard Backend is running 🌿',
        database: useMySQL ? 'MySQL' : 'JSON (fallback)',
    });
});

// ─── Test Route ────────────────────────────────────────────────────────────

app.get('/api/test', (req, res) => {
    res.json({
        status: 'success',
        message: 'API test successful',
        timestamp: new Date().toISOString(),
        server: 'ClimateGuard Backend v2.0',
        port: PORT,
        uptime: process.uptime(),
        node_version: process.version,
        environment: process.env.NODE_ENV || 'development'
    });
});

/**
 * GET /api/warehouses
 * Fetch all cold storage and warehouse facilities
 * (Simulates daily randomization for capacity updates)
 */
app.get('/api/warehouses', (req, res) => {
    // Generate a simple seed based on the current date (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    const seed = today.split('-').reduce((a, b) => parseInt(a) + parseInt(b), 0);

    const dynamicWarehouses = WAREHOUSE_DATA.map(w => {
        // Create a unique-ish random value for each warehouse based on its ID and the day's seed
        const idNum = parseInt(w.id.substring(1)) || 1;
        const hash = (seed * idNum) % w.capacity_total;
        
        // Randomly adjust capacity slightly (simulated updates)
        const randomizedUsed = Math.min(w.capacity_total, Math.max(0, hash));
        
        return {
            ...w,
            capacity_used: randomizedUsed,
            last_updated: new Date().toISOString()
        };
    });

    res.json({
        status: 'success',
        total: dynamicWarehouses.length,
        data: dynamicWarehouses,
        date_ref: today
    });
});

// ─── ML Model Status ────────────────────────────────────────────────────────

/**
 * GET /api/ml/status
 * Check the status of the ML model and Python integration
 */
app.get('/api/ml/status', (req, res) => {
    const modelPath = path.join(ML_MODEL_DIR, 'rainfall_model.pkl');
    const encoderPath = path.join(ML_MODEL_DIR, 'label_encoder.pkl');
    const predictScript = path.join(ML_MODEL_DIR, 'predict.py');

    const status = {
        model_trained: fs.existsSync(modelPath),
        encoder_exists: fs.existsSync(encoderPath),
        predict_script_exists: fs.existsSync(predictScript),
        python_candidates: findPython(),
        ml_dir: ML_MODEL_DIR,
        ready: fs.existsSync(modelPath) && fs.existsSync(encoderPath)
    };

    if (status.ready) {
        res.json({
            status: 'ready',
            message: 'ML model is trained and ready for predictions',
            details: status
        });
    } else {
        res.status(503).json({
            status: 'not_ready',
            message: 'ML model not properly configured',
            details: status,
            setup_command: 'python ml_model/setup.py'
        });
    }
});

// ─── Authentication ─────────────────────────────────────────────────────────

app.post('/api/register', async (req, res) => {
    const { name, email, phone, password, user_role, avatar, district } = req.body;

    if (!name || !phone || !password) {
        return res.status(400).json({ error: 'Name, phone, and password are required' });
    }

    const role = (user_role === 'farmer' || user_role === 'public') ? user_role : 'public';
    const hashedPassword = await bcrypt.hash(password, 10);

    if (useMySQL) {
        try {
            // Check duplicates
            const [existing] = await db.query(
                'SELECT id FROM users WHERE name = ? OR phone = ?', [name.trim(), phone.trim()]
            );
            if (existing.length > 0) {
                return res.status(409).json({ error: 'User with this name or phone already exists' });
            }

            await db.query(
                `INSERT INTO users (name, email, phone, password, user_role, avatar, district, alerts_enabled) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [name.trim(), (email || '').trim(), phone.trim(), hashedPassword, role,
                avatar || 'assets/user_avatar.png', (district || '').trim(), true]
            );

            const token = generateToken({ name: name.trim(), user_role: role });
            return res.status(201).json({
                message: 'Registration successful',
                user: { name: name.trim(), email: (email || '').trim(), phone: phone.trim(), user_role: role, avatar: avatar || 'assets/user_avatar.png', district: (district || '').trim() },
                token
            });
        } catch (err) {
            return res.status(500).json({ error: `Database error: ${err.message}` });
        }
    }

    // JSON fallback
    const users = loadUsers();
    if (users.some(u => u.name.toLowerCase() === name.trim().toLowerCase())) {
        return res.status(409).json({ error: 'A user with this name already exists' });
    }
    if (users.some(u => u.phone === phone.trim())) {
        return res.status(409).json({ error: 'This phone number is already registered' });
    }

    const newUser = {
        name: name.trim(),
        email: (email || '').trim(),
        phone: phone.trim(),
        password: hashedPassword,
        user_role: role,
        avatar: avatar || 'assets/user_avatar.png',
        district: (district || '').trim(),
        alerts_enabled: true,
    };
    users.push(newUser);
    saveUsers(users);

    const token = generateToken(newUser);
    const { password: _, ...safeUser } = newUser;
    res.status(201).json({ message: 'Registration successful', user: safeUser, token });
});


app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: 'Name and password are required' });
    }

    let user = null;

    if (useMySQL) {
        try {
            const [rows] = await db.query('SELECT * FROM users WHERE name = ?', [name.trim()]);
            if (rows.length > 0) user = rows[0];
        } catch (err) {
            return res.status(500).json({ error: `Database error: ${err.message}` });
        }
    } else {
        const users = loadUsers();
        user = users.find(u => u.name.toLowerCase() === name.trim().toLowerCase());
    }

    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user);
    const { password: _, ...safeUser } = user;
    res.json({ message: 'Login successful', user: safeUser, token });
});

// Keep old routes as aliases
app.post('/api/auth/register', (req, res, next) => { req.url = '/api/register'; next(); });
app.post('/api/auth/login', (req, res, next) => { req.url = '/api/login'; next(); });


// ─── SMS Service (TextBee) ─────────────────────────────────────────────────

app.post('/api/send-sms', async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Phone and message are required' });
    }

    if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID) {
        console.warn('TextBee credentials missing. Set TEXTBEE_API_KEY and TEXTBEE_DEVICE_ID in backend/.env');
        return res.status(503).json({ error: 'SMS service is not configured on the server.' });
    }

    // Format phone number, ensure standard E.164 without leading '+' sometimes isn't necessary, but TextBee normally handles generic lengths. It's safer to ensure +91 for Indian numbers if not provided.
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) {
        // Assume Indian number by default
        formattedPhone = '+91' + formattedPhone;
    }

    try {
        const response = await axios.post(
            `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/sendSMS`,
            {
                receivers: [formattedPhone],
                smsBody: message
            },
            {
                headers: {
                    'x-api-key': TEXTBEE_API_KEY
                }
            }
        );
        res.json({ message: 'SMS request sent successfully', details: response.data });
    } catch (error) {
        console.error('Error sending SMS via TextBee:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to send SMS' });
    }
});


// ─── Soil Data (farmers only when auth is used) ────────────────────────────

app.get('/api/soil-data', async (req, res) => {
    const { district, soil_type } = req.query;

    if (useMySQL) {
        try {
            let query = 'SELECT * FROM soil_data WHERE 1=1';
            const params = [];
            if (district) { query += ' AND district = ?'; params.push(district); }
            if (soil_type) { query += ' AND soil_type = ?'; params.push(soil_type); }
            const [rows] = await db.query(query, params);
            return res.json({ total: rows.length, data: rows, source: 'mysql' });
        } catch (err) {
            console.error('MySQL soil query failed, falling back to CSV:', err.message);
        }
    }

    // CSV fallback
    const csvPath = path.join(DATASET_DIR, 'soil_dataset.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Soil dataset not found' });

    try {
        let rows = await readCsv(csvPath);
        if (district) rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        if (soil_type) rows = rows.filter(r => r.soil_type && r.soil_type.toLowerCase() === soil_type.toLowerCase());
        res.json({ total: rows.length, data: rows, source: 'csv' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─── Forest Data (public users when auth is used) ──────────────────────────

app.get('/api/forest-data', async (req, res) => {
    const { district, year } = req.query;

    if (useMySQL) {
        try {
            let query = 'SELECT * FROM forest_data WHERE 1=1';
            const params = [];
            if (district) { query += ' AND district = ?'; params.push(district); }
            if (year) { query += ' AND year = ?'; params.push(year); }
            const [rows] = await db.query(query, params);
            return res.json({ total: rows.length, data: rows, source: 'mysql' });
        } catch (err) {
            console.error('MySQL forest query failed, falling back to CSV:', err.message);
        }
    }

    // CSV fallback
    const csvPath = path.join(DATASET_DIR, 'forest_dataset.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Forest dataset not found' });

    try {
        let rows = await readCsv(csvPath);
        if (district) rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        if (year) rows = rows.filter(r => r.year && r.year === year);
        res.json({ total: rows.length, data: rows, source: 'csv' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─── Rainfall Prediction (Python ML Model) ─────────────────────────────────
/**
 * POST /api/rainfall-predict
 * Predict rainfall level using Python ML model
 * 
 * Request body:
 *   - temperature (number): Temperature in °C (0-50)
 *   - humidity (number): Humidity percentage (0-100)
 *   - month (number): Month 1-12
 * 
 * Response:
 *   - prediction: Rainfall level (Low/Medium/Heavy)
 *   - confidence: Confidence percentage
 *   - probabilities: Probability for each level
 *   - input: Echo of input parameters
 */
app.post('/api/rainfall-predict', (req, res) => {
    const { temperature, humidity, month } = req.body;

    // Validate required parameters
    if (temperature == null || humidity == null || month == null) {
        return res.status(400).json({
            error: 'Missing required parameters',
            required: { temperature: 'number', humidity: 'number', month: 'number' }
        });
    }

    // Validate parameter types and ranges
    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const mon = parseInt(month);

    if (isNaN(temp) || isNaN(hum) || isNaN(mon)) {
        return res.status(400).json({
            error: 'Invalid parameter types. Expected: temperature (number), humidity (number), month (number)'
        });
    }

    // Validate ranges
    if (temp < 0 || temp > 50) {
        return res.status(400).json({
            error: 'Temperature must be between 0 and 50 °C'
        });
    }

    if (hum < 0 || hum > 100) {
        return res.status(400).json({
            error: 'Humidity must be between 0 and 100 %'
        });
    }

    if (mon < 1 || mon > 12) {
        return res.status(400).json({
            error: 'Month must be between 1 and 12'
        });
    }

    const predictScript = path.join(ML_MODEL_DIR, 'predict_server.py');
    if (!fs.existsSync(predictScript)) {
        return res.status(500).json({
            error: 'Prediction script not found',
            path: predictScript
        });
    }

    // Check if model files exist
    const modelPath = path.join(ML_MODEL_DIR, 'rainfall_model.pkl');
    const encoderPath = path.join(ML_MODEL_DIR, 'label_encoder.pkl');

    if (!fs.existsSync(modelPath) || !fs.existsSync(encoderPath)) {
        return res.status(503).json({
            error: 'ML model not trained. Run ml_model/train_model.py to initialize the model.',
            missing: {
                model: !fs.existsSync(modelPath),
                encoder: !fs.existsSync(encoderPath)
            }
        });
    }

    // Use the persistent Python HTTP Server for ultra-fast predictions
    fetchWithRetry('http://127.0.0.1:5001/predict', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ temperature: temp, humidity: hum, month: mon })
    })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                return res.status(400).json({
                    error: 'Model prediction failed',
                    details: result.error
                });
            }

            res.json({
                status: 'success',
                timestamp: new Date().toISOString(),
                prediction: result.level,
                confidence: result.confidence,
                probabilities: result.probabilities,
                input: {
                    temperature: temp,
                    humidity: hum,
                    month: mon,
                    month_name: ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'][mon - 1]
                }
            });
        })
        .catch(err => {
            console.error("Fetch to predict_server failed:", err);
            res.status(500).json({
                error: 'ML prediction server (port 5001) is unreachable or failed to respond',
                details: err.message
            });
        });
});

/**
 * POST /api/rainfall-predict-mm
 * Predict rainfall amount (mm) using regression ML model
 *
 * Request body:
 *   - temperature (number): Temperature in °C (0-50)
 *   - humidity (number): Humidity percentage (0-100)
 *   - month (number): Month 1-12
 */
app.post('/api/rainfall-predict-mm', (req, res) => {
    const { temperature, humidity, month } = req.body;

    if (temperature == null || humidity == null || month == null) {
        return res.status(400).json({
            error: 'Missing required parameters',
            required: { temperature: 'number', humidity: 'number', month: 'number' }
        });
    }

    const temp = parseFloat(temperature);
    const hum = parseFloat(humidity);
    const mon = parseInt(month);

    if (isNaN(temp) || isNaN(hum) || isNaN(mon)) {
        return res.status(400).json({
            error: 'Invalid parameter types. Expected: temperature (number), humidity (number), month (number)'
        });
    }

    if (temp < 0 || temp > 50) {
        return res.status(400).json({ error: 'Temperature must be between 0 and 50 °C' });
    }
    if (hum < 0 || hum > 100) {
        return res.status(400).json({ error: 'Humidity must be between 0 and 100 %' });
    }
    if (mon < 1 || mon > 12) {
        return res.status(400).json({ error: 'Month must be between 1 and 12' });
    }

    const predictScript = path.join(ML_MODEL_DIR, 'predict_server.py');
    if (!fs.existsSync(predictScript)) {
        return res.status(500).json({ error: 'Prediction script not found', path: predictScript });
    }

    const regModelPath = path.join(ML_MODEL_DIR, 'rainfall_model_reg.pkl');
    if (!fs.existsSync(regModelPath)) {
        return res.status(503).json({
            error: 'Regression model not trained. Run ml_model/train_regression.py to initialize the model.',
            missing: { model: true }
        });
    }

    fetchWithRetry('http://127.0.0.1:5001/predict-mm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temperature: temp, humidity: hum, month: mon })
    })
        .then(response => response.json())
        .then(result => {
            if (result.error) {
                return res.status(400).json({ error: 'Model prediction failed', details: result.error });
            }
            res.json({
                status: 'success',
                timestamp: new Date().toISOString(),
                rainfall_mm: result.rainfall_mm,
                input: { temperature: temp, humidity: hum, month: mon }
            });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

/**
 * GET /api/ml-status
 * Check availability of ML model files (classifier + regression)
 */
app.get('/api/ml-status', (req, res) => {
    const clfModel = path.join(ML_MODEL_DIR, 'rainfall_model.pkl');
    const clfEncoder = path.join(ML_MODEL_DIR, 'label_encoder.pkl');
    const regModel = path.join(ML_MODEL_DIR, 'rainfall_model_reg.pkl');
    res.json({
        status: 'success',
        timestamp: new Date().toISOString(),
        classifier: {
            model: fs.existsSync(clfModel),
            encoder: fs.existsSync(clfEncoder)
        },
        regressor: {
            model: fs.existsSync(regModel)
        }
    });
});

/**
 * GET /api/rainfall-predict-annual-mm
 * Predict rainfall amount (mm) for 12 months from current month
 *
 * Query params:
 *   - district (required): District name
 *   - years (optional): comma-separated list (default: 2024,2025,2026)
 */
app.get('/api/rainfall-predict-annual-mm', async (req, res) => {
    try {
        const district = (req.query.district || '').trim();
        if (!district) {
            return res.status(400).json({ error: 'Missing required parameter: district' });
        }

        const yearsParam = (req.query.years || '2024,2025,2026').toString();
        const years = yearsParam.split(',').map(y => y.trim()).filter(Boolean);

        const csvPath = path.join(DATASET_DIR, 'rainfall_dataset.csv');
        if (!fs.existsSync(csvPath)) {
            return res.status(404).json({ error: 'Rainfall dataset not found' });
        }

        let rows = await readCsv(csvPath);
        rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        if (years.length > 0) {
            rows = rows.filter(r => r.year && years.includes(String(r.year)));
        }
        if (rows.length === 0) {
            return res.status(404).json({ error: 'No rainfall data for district/years' });
        }

        const monthly = {};
        rows.forEach(r => {
            const month = parseInt(r.month, 10);
            const temp = parseFloat(r.temperature);
            const hum = parseFloat(r.humidity);
            if (!Number.isFinite(month) || !Number.isFinite(temp) || !Number.isFinite(hum)) return;
            if (!monthly[month]) monthly[month] = { tempSum: 0, humSum: 0, count: 0 };
            monthly[month].tempSum += temp;
            monthly[month].humSum += hum;
            monthly[month].count += 1;
        });

        const startMonth = new Date().getMonth() + 1;
        const predictions = [];
        for (let i = 0; i < 12; i++) {
            const m = ((startMonth - 1 + i) % 12) + 1;
            const agg = monthly[m];
            if (!agg || agg.count === 0) {
                predictions.push({ month: m, rainfall_mm: null, input: { month: m } });
                continue;
            }
            const temperature = Number((agg.tempSum / agg.count).toFixed(1));
            const humidity = Number((agg.humSum / agg.count).toFixed(1));
            // eslint-disable-next-line no-await-in-loop
            const resp = await fetchWithRetry('http://127.0.0.1:5001/predict-mm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ temperature, humidity, month: m })
            });
            // eslint-disable-next-line no-await-in-loop
            const result = await resp.json();
            if (result && result.error) {
                predictions.push({ month: m, rainfall_mm: null, input: { temperature, humidity, month: m }, error: result.error });
            } else {
                predictions.push({ month: m, rainfall_mm: result.rainfall_mm, input: { temperature, humidity, month: m } });
            }
        }

        res.json({
            status: 'success',
            district,
            years,
            timestamp: new Date().toISOString(),
            predictions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/rainfall-predict-annual
 * Predict rainfall levels for all 12 months using the same ML model.
 *
 * Query params:
 *   - district (required): District name
 *   - years (optional): comma-separated list (default: 2024,2025,2026)
 *
 * Response:
 *   - predictions: [{ month, prediction, confidence, probabilities, input, rainfall_mm }]
 */
app.get('/api/rainfall-predict-annual', async (req, res) => {
    try {
        const district = (req.query.district || '').trim();
        if (!district) {
            return res.status(400).json({
                error: 'Missing required parameter: district'
            });
        }

        const yearsParam = (req.query.years || '2024,2025,2026').toString();
        const years = yearsParam.split(',').map(y => y.trim()).filter(Boolean);

        const csvPath = path.join(DATASET_DIR, 'rainfall_dataset.csv');
        if (!fs.existsSync(csvPath)) {
            return res.status(404).json({ error: 'Rainfall dataset not found' });
        }

        let rows = await readCsv(csvPath);
        rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        if (years.length > 0) {
            rows = rows.filter(r => r.year && years.includes(String(r.year)));
        }

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No rainfall data for district/years' });
        }

        // Aggregate monthly averages
        const monthly = {};
        rows.forEach(r => {
            const month = parseInt(r.month, 10);
            const temp = parseFloat(r.temperature);
            const hum = parseFloat(r.humidity);
            const rain = parseFloat(r.rainfall_mm);
            if (!Number.isFinite(month) || !Number.isFinite(temp) || !Number.isFinite(hum)) return;
            if (!monthly[month]) monthly[month] = { tempSum: 0, humSum: 0, rainSum: 0, count: 0 };
            monthly[month].tempSum += temp;
            monthly[month].humSum += hum;
            if (Number.isFinite(rain)) monthly[month].rainSum += rain;
            monthly[month].count += 1;
        });

        const monthInputs = [];
        for (let m = 1; m <= 12; m++) {
            const agg = monthly[m];
            if (!agg || agg.count === 0) {
                monthInputs.push({ month: m, temperature: null, humidity: null, rainfall_avg: null });
                continue;
            }
            monthInputs.push({
                month: m,
                temperature: Number((agg.tempSum / agg.count).toFixed(1)),
                humidity: Number((agg.humSum / agg.count).toFixed(1)),
                rainfall_avg: Number((agg.rainSum / agg.count).toFixed(1))
            });
        }

        // Reuse single prediction endpoint by calling the local ML server for each month.
        const predictions = [];
        for (const input of monthInputs) {
            if (!Number.isFinite(input.temperature) || !Number.isFinite(input.humidity)) {
                predictions.push({
                    month: input.month,
                    prediction: null,
                    confidence: null,
                    probabilities: null,
                    input,
                    rainfall_mm: input.rainfall_avg
                });
                continue;
            }
            // Call ML server directly
            // eslint-disable-next-line no-await-in-loop
            const resp = await fetchWithRetry('http://127.0.0.1:5001/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    temperature: input.temperature,
                    humidity: input.humidity,
                    month: input.month
                })
            });
            // eslint-disable-next-line no-await-in-loop
            const result = await resp.json();
            if (result && result.error) {
                predictions.push({
                    month: input.month,
                    prediction: null,
                    confidence: null,
                    probabilities: null,
                    input,
                    rainfall_mm: input.rainfall_avg,
                    error: result.error
                });
            } else {
                predictions.push({
                    month: input.month,
                    prediction: result.level,
                    confidence: result.confidence,
                    probabilities: result.probabilities,
                    input: {
                        temperature: input.temperature,
                        humidity: input.humidity,
                        month: input.month
                    },
                    rainfall_mm: input.rainfall_avg
                });
            }
        }

        res.json({
            status: 'success',
            district,
            years,
            timestamp: new Date().toISOString(),
            predictions
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─── Crop Recommendation (ML Model Fallback) ─────────────────────────────────

app.post('/api/crop-recommend', async (req, res) => {
    const { temperature, humidity, rainfall, soil_type, month } = req.body;

    if (temperature == null || humidity == null || rainfall == null) {
        return res.status(400).json({ error: 'temperature, humidity, and rainfall are required' });
    }

    // ─── Determine current season from month ───
    const currentMonth = month || (new Date().getMonth() + 1); // 1-indexed
    function getSeason(m) {
        if (m >= 6 && m <= 10) return 'kharif';
        if (m >= 11 || m <= 2) return 'rabi';
        return 'summer'; // Mar-May (Zaid)
    }
    const currentSeason = getSeason(currentMonth);

    // ─── Crop-to-season suitability mapping ───
    const cropSeasons = {
        'rice': ['kharif'],
        'paddy': ['kharif'],
        'maize': ['kharif', 'rabi'],
        'sugarcane': ['kharif', 'rabi', 'summer'],
        'cotton': ['kharif'],
        'jute': ['kharif'],
        'ginger': ['kharif'],
        'turmeric': ['kharif'],
        'sorghum': ['kharif', 'rabi'],
        'bajra': ['kharif'],
        'millets': ['kharif'],
        'ragi': ['kharif'],
        'groundnut': ['kharif', 'rabi'],
        'sunflower': ['kharif', 'rabi'],
        'wheat': ['rabi'],
        'pulses': ['rabi', 'kharif'],
        'banana': ['kharif', 'rabi', 'summer'],
        'coconut': ['kharif', 'rabi', 'summer'],
        'coffee': ['kharif', 'rabi', 'summer'],
        'tea': ['kharif', 'rabi', 'summer'],
        'cocoa': ['kharif', 'rabi', 'summer'],
        'arecanut': ['kharif', 'rabi', 'summer'],
        'pepper': ['kharif'],
    };

    // ─── Season score for a crop ───
    function seasonScore(cropName) {
        const key = cropName.toLowerCase().trim();
        const seasons = cropSeasons[key];
        if (!seasons) return 0.5; // unknown crop — neutral
        if (seasons.includes(currentSeason)) return 1.0; // perfect match
        // Adjacent season gets partial credit
        const seasonOrder = ['summer', 'kharif', 'rabi'];
        const currentIdx = seasonOrder.indexOf(currentSeason);
        for (const s of seasons) {
            const idx = seasonOrder.indexOf(s);
            if (Math.abs(currentIdx - idx) === 1 || Math.abs(currentIdx - idx) === 2) return 0.4;
        }
        return 0.2;
    }

    // ─── Convert rainfall mm to level ───
    function rainfallMmToLevel(mm) {
        if (mm >= 40) return 'Very High';
        if (mm >= 20) return 'High';
        if (mm >= 8) return 'Moderate';
        if (mm >= 3) return 'Low to Moderate';
        if (mm >= 0.5) return 'Low';
        return 'Very Low';
    }

    // ─── Parse temp range string like "25-30" ───
    function parseTempRange(rangeStr) {
        const parts = String(rangeStr).split('-').map(s => parseFloat(s.trim()));
        if (parts.length === 2 && parts.every(Number.isFinite)) return { min: parts[0], max: parts[1] };
        return { min: 20, max: 35 };
    }

    // ─── Soil similarity scoring ───
    function soilSimilarity(inputSoil, csvSoil) {
        if (!inputSoil || !csvSoil) return 0.3;
        const a = inputSoil.toLowerCase().replace(/[\s\-_]/g, '');
        const b = csvSoil.toLowerCase().replace(/[\s\-_]/g, '');
        if (a === b) return 1.0;
        if (a.includes(b) || b.includes(a)) return 0.7;
        const affinities = {
            'black': ['clayloam', 'clay'],
            'clayloam': ['black', 'loam'],
            'red': ['laterite', 'sandyloam'],
            'laterite': ['red', 'sandyloam'],
            'loam': ['siltyloam', 'sandyloam', 'clayloam'],
            'siltyloam': ['loam', 'alluvial'],
            'sandyloam': ['loam', 'red'],
            'alluvial': ['siltyloam', 'loam', 'riverbasins'],
            'riverbasins': ['alluvial', 'siltyloam']
        };
        if (affinities[a] && affinities[a].includes(b)) return 0.5;
        return 0.15;
    }

    // ─── Rainfall level similarity ───
    const rainfallLevels = ['Very Low', 'Low', 'Low to Moderate', 'Moderate', 'High', 'Very High'];
    function rainfallSimilarity(inputLevel, csvLevel) {
        const idxA = rainfallLevels.indexOf(inputLevel);
        const idxB = rainfallLevels.indexOf(csvLevel);
        if (idxA === -1 || idxB === -1) return 0.3;
        const dist = Math.abs(idxA - idxB);
        return Math.max(0, 1.0 - dist * 0.25);
    }

    try {
        // Read the crop_recommendation.csv dataset
        const csvPath = path.join(DATASET_DIR, 'crop_recommendation.csv');
        let cropRows = [];
        if (fs.existsSync(csvPath)) {
            cropRows = await readCsv(csvPath);
        }

        const inputRainfallLevel = rainfallMmToLevel(rainfall);
        const inputTemp = parseFloat(temperature);
        const inputSoil = soil_type || '';

        // Score each crop row based on soil + rainfall + temperature + season + humidity
        const scored = cropRows.map(row => {
            const soilS = soilSimilarity(inputSoil, row.soil_type);
            const rainS = rainfallSimilarity(inputRainfallLevel, row.rainfall_level);

            const tempRange = parseTempRange(row.temperature_range);
            let tempS = 0;
            if (inputTemp >= tempRange.min && inputTemp <= tempRange.max) {
                tempS = 1.0;
            } else {
                const dist = inputTemp < tempRange.min
                    ? tempRange.min - inputTemp
                    : inputTemp - tempRange.max;
                tempS = Math.max(0, 1.0 - dist * 0.1);
            }

            const seasonS = seasonScore(row.recommended_crop);

            let humidityBonus = 0;
            if (humidity > 75 && ['Very High', 'High'].includes(row.rainfall_level)) humidityBonus = 0.1;
            if (humidity < 50 && ['Low', 'Very Low'].includes(row.rainfall_level)) humidityBonus = 0.1;

            // Weighted scoring: soil 30%, rainfall 25%, temp 20%, season 15%, humidity 10%
            const totalScore = (soilS * 0.30) + (rainS * 0.25) + (tempS * 0.20) + (seasonS * 0.15) + (humidityBonus * 0.10);

            return {
                crop: row.recommended_crop,
                score: totalScore,
                soilScore: soilS,
                rainScore: rainS,
                tempScore: tempS,
                seasonScore: seasonS
            };
        });

        // Sort by score descending, deduplicate by crop name, take top 6
        scored.sort((a, b) => b.score - a.score);
        const seen = new Set();
        const recommendations = [];
        for (const item of scored) {
            const key = item.crop.toLowerCase();
            if (!seen.has(key) && item.score > 0.2) {
                seen.add(key);
                recommendations.push(item.crop.toLowerCase());
                if (recommendations.length >= 6) break;
            }
        }

        // Fallback if dataset is empty or no good matches
        if (recommendations.length === 0) {
            if (currentSeason === 'kharif') {
                if (rainfall > 30 || humidity > 80) recommendations.push('rice', 'sugarcane', 'ginger', 'coconut');
                else recommendations.push('maize', 'cotton', 'ragi', 'sorghum', 'bajra');
            } else if (currentSeason === 'rabi') {
                recommendations.push('wheat', 'pulses', 'sunflower', 'maize', 'groundnut');
            } else {
                recommendations.push('sugarcane', 'banana', 'coconut', 'groundnut');
            }
        }

        const seasonLabels = { 'kharif': 'Kharif (Jun-Oct)', 'rabi': 'Rabi (Nov-Feb)', 'summer': 'Summer/Zaid (Mar-May)' };

        res.json({
            recommendations: recommendations.slice(0, 6),
            confidence: scored.length > 0 ? parseFloat((scored[0]?.score || 0.85).toFixed(2)) : 0.85,
            input: { temperature, humidity, rainfall, soil_type, month: currentMonth },
            rainfall_level: inputRainfallLevel,
            current_season: seasonLabels[currentSeason] || currentSeason
        });

    } catch (err) {
        console.error('Crop recommend error:', err.message);
        res.status(500).json({ error: `Crop recommendation error: ${err.message}` });
    }
});


// ─── Crop Growth Tracker ──────────────────────────────────────────────────

function loadCropTracker() {
    try {
        console.log('[CropTracker] Loading from:', CROP_TRACKER_FILE);
        if (fs.existsSync(CROP_TRACKER_FILE)) {
            const raw = fs.readFileSync(CROP_TRACKER_FILE, 'utf8');
            return JSON.parse(raw);
        }
    } catch (e) { console.error('[CropTracker] Load JSON error:', e); }
    return {};
}
function saveCropTracker(data) {
    fs.writeFileSync(CROP_TRACKER_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Crop Advisory SMS System ─────────────────────────────────────────────

const CROP_LIFECYCLE_FILE = path.join(PROJECT_ROOT, 'frontend', 'data', 'crop_lifecycle.json');
const CROP_ADVISORY_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function loadCropLifecycle() {
    try {
        if (fs.existsSync(CROP_LIFECYCLE_FILE)) {
            return JSON.parse(fs.readFileSync(CROP_LIFECYCLE_FILE, 'utf8'));
        }
    } catch (e) { console.error('[CropAdvisory] Failed to load crop lifecycle:', e.message); }
    return {};
}

/**
 * Generate a crop advisory SMS combining weekly guide tips + live weather
 * @param {object} cropEntry - tracked crop record {crop, district, sowingDate, maturityDays, ...}
 * @returns {Promise<{sms: string, weekNum: number, expired: boolean}>}
 */
async function generateCropAdvisorySms(cropEntry) {
    const lifecycle = loadCropLifecycle();
    const cropName = (cropEntry.crop || '').toLowerCase();
    const district = cropEntry.district || '';
    const sowingDate = new Date(cropEntry.sowingDate);
    const today = new Date();
    const daysSinceSowing = Math.floor((today - sowingDate) / (1000 * 60 * 60 * 24));
    const weekNum = Math.max(1, Math.ceil(daysSinceSowing / 7));
    const maturityWeeks = Math.ceil((cropEntry.maturityDays || 120) / 7);

    // Check if crop has passed maturity
    if (weekNum > maturityWeeks) {
        return { sms: null, weekNum, expired: true };
    }

    // Get weekly guide from lifecycle data
    const cropData = lifecycle[cropName];
    let activity = '';
    let tip = '';
    let stageName = '';
    if (cropData && cropData.weeklyGuide) {
        const guide = cropData.weeklyGuide[String(weekNum)];
        if (guide) {
            activity = guide.activity || '';
            tip = guide.tip || '';
        } else {
            // Find nearest available week guide (lifecycle may not have every week)
            const availableWeeks = Object.keys(cropData.weeklyGuide).map(Number).sort((a, b) => a - b);
            const nearest = availableWeeks.reduce((prev, curr) =>
                Math.abs(curr - weekNum) < Math.abs(prev - weekNum) ? curr : prev
            , availableWeeks[0]);
            const nearGuide = cropData.weeklyGuide[String(nearest)];
            if (nearGuide) {
                activity = nearGuide.activity || '';
                tip = nearGuide.tip || '';
            }
        }
        // Find current stage
        if (cropData.stages) {
            for (const stage of cropData.stages) {
                if (stage.weeks && stage.weeks.includes(weekNum)) {
                    stageName = `${stage.icon || ''} ${stage.name}`.trim();
                    break;
                }
            }
        }
    }

    // Fetch live weather for the district
    let weatherLine = '';
    if (district && DISTRICT_COORDS[district]) {
        try {
            const coords = DISTRICT_COORDS[district];
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${coords.lat},${coords.lng}&days=3&aqi=no&alerts=no`;
            const weatherData = await httpsGet(url);
            const current = weatherData.current;
            const forecast = weatherData.forecast?.forecastday?.[0]?.day;

            if (current) {
                weatherLine = `🌤 Weather: ${current.temp_c}°C, ${current.humidity}% humidity`;
                if (current.wind_kph > 30) weatherLine += `, wind ${current.wind_kph} km/h`;
            }
            if (forecast) {
                if (forecast.daily_chance_of_rain > 50) {
                    weatherLine += `. 🌧 ${forecast.daily_chance_of_rain}% rain chance (${forecast.totalprecip_mm}mm)`;
                    // Add weather-specific crop advice
                    if (forecast.totalprecip_mm > 20) {
                        weatherLine += '. ⚠ Heavy rain expected — delay fertilizer/spray.';
                    } else {
                        weatherLine += '. Hold off on irrigation.';
                    }
                } else if (current && current.temp_c > 38) {
                    weatherLine += '. ⚠ Extreme heat — irrigate early morning or evening.';
                } else if (current && current.temp_c > 35) {
                    weatherLine += '. Provide shade/mulch to reduce heat stress.';
                }
            }
        } catch (err) {
            console.error(`[CropAdvisory] Weather fetch failed for ${district}:`, err.message);
            weatherLine = '🌤 Weather: data unavailable';
        }
    }

    // Build SMS message
    const cropLabel = cropName.charAt(0).toUpperCase() + cropName.slice(1);
    let sms = `🌾 ClimateGuard — ${cropLabel} (Week ${weekNum}/${maturityWeeks}`;
    if (district) sms += `, ${district}`;
    sms += ')\n';
    if (stageName) sms += `📍 Stage: ${stageName}\n`;
    if (activity) sms += `📋 ${activity}\n`;
    if (tip) sms += `💡 ${tip}\n`;
    if (weatherLine) sms += `${weatherLine}`;

    return { sms, weekNum, expired: false };
}

/**
 * Send crop advisory SMS to a specific farmer
 * @param {string} username - farmer's username
 * @param {object} cropEntry - tracked crop record
 * @returns {Promise<{success: boolean, message: string}>}
 */
async function sendCropAdvisorySms(username, cropEntry) {
    if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID || TEXTBEE_API_KEY === 'your_textbee_api_key_here') {
        console.log('  [CropAdvisory] TextBee not configured, skipping SMS');
        return { success: false, message: 'TextBee not configured' };
    }

    // Look up farmer's phone number and alert preference
    let phone = null;
    let alertsEnabled = true;
    if (useMySQL) {
        try {
            const [rows] = await db.query('SELECT phone, alerts_enabled FROM users WHERE LOWER(name) = ?', [username.toLowerCase().trim()]);
            if (rows.length > 0) {
                phone = rows[0].phone;
                alertsEnabled = rows[0].alerts_enabled === 1 || rows[0].alerts_enabled === true;
            }
        } catch (err) {
            console.error(`[CropAdvisory] DB lookup failed for ${username}:`, err.message);
        }
    } else {
        const users = loadUsers();
        const user = users.find(u => u.name.toLowerCase() === username.toLowerCase().trim());
        if (user) {
            phone = user.phone;
            alertsEnabled = user.alerts_enabled !== false;
        }
    }

    if (!phone) {
        console.log(`  [CropAdvisory] No phone found for user "${username}"`);
        return { success: false, message: 'Phone not found' };
    }

    if (!alertsEnabled) {
        console.log(`  [CropAdvisory] Alerts disabled for user "${username}", skipping tip`);
        return { success: false, message: 'Alerts disabled by user' };
    }

    // Generate the advisory SMS
    const { sms, weekNum, expired } = await generateCropAdvisorySms(cropEntry);
    if (expired) {
        console.log(`  [CropAdvisory] ${cropEntry.crop} for ${username} has passed maturity (week ${weekNum}), skipping`);
        return { success: false, message: 'Crop past maturity' };
    }
    if (!sms) {
        return { success: false, message: 'No advisory generated' };
    }

    // Send SMS via TextBee
    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith('+')) formattedPhone = '+91' + formattedPhone;

    try {
        const url = `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/sendSMS`;
        const smsRes = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': TEXTBEE_API_KEY },
            body: JSON.stringify({ receivers: [formattedPhone], smsBody: sms })
        });
        if (smsRes.ok) {
            console.log(`  📩 Crop advisory SMS sent to ${username} (${formattedPhone}) — ${cropEntry.crop} Week ${weekNum}`);
            return { success: true, message: `SMS sent for ${cropEntry.crop} Week ${weekNum}` };
        } else {
            const errData = await smsRes.json().catch(() => ({}));
            console.error(`  ⚠️ Crop advisory SMS failed for ${username}: ${errData.message || smsRes.statusText}`);
            return { success: false, message: errData.message || 'SMS send failed' };
        }
    } catch (err) {
        console.error(`  ⚠️ Crop advisory SMS error for ${username}:`, err.message);
        return { success: false, message: err.message };
    }
}

/**
 * Run weekly crop advisory check — iterates all tracked crops and sends SMS
 */
async function runWeeklyCropAdvisory() {
    console.log(`\n  🌾 [${new Date().toLocaleTimeString()}] Running weekly crop advisory...`);

    let allCrops = []; // { username, ...cropEntry }

    if (useMySQL) {
        try {
            const [rows] = await db.query('SELECT * FROM tracked_crops ORDER BY username');
            allCrops = rows.map(r => ({ username: r.username, ...r }));
        } catch (err) {
            console.error('  [CropAdvisory] DB error fetching tracked crops:', err.message);
            return;
        }
    } else {
        const tracker = loadCropTracker();
        for (const [username, crops] of Object.entries(tracker)) {
            for (const crop of crops) {
                allCrops.push({ username, ...crop });
            }
        }
    }

    console.log(`  [CropAdvisory] Found ${allCrops.length} tracked crop(s) across all farmers`);
    let sentCount = 0;
    let skipCount = 0;
    let failCount = 0;

    for (const entry of allCrops) {
        const result = await sendCropAdvisorySms(entry.username, entry);
        if (result.success) sentCount++;
        else if (result.message === 'Crop past maturity') skipCount++;
        else failCount++;

        // Small delay between SMS to avoid rate limits
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`  [CropAdvisory] Done. Sent: ${sentCount}, Skipped: ${skipCount}, Failed: ${failCount}\n`);
}

// Manual trigger endpoint for crop advisory
app.get('/api/crop-advisory-check', async (req, res) => {
    console.log('  [CropAdvisory] Manual check triggered via API');
    try {
        await runWeeklyCropAdvisory();
        res.json({ success: true, message: 'Crop advisory check completed. See server console for details.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/api/crop-tracker/select', async (req, res) => {
    const { username, crop, district, soilType, farmAcres, waterFacility, farmName, sowingDate, maturityDays } = req.body;
    if (!username || !crop) return res.status(400).json({ error: 'username and crop are required' });

    const cleanUser = String(username).toLowerCase().trim();
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const parsedAcres = parseFloat(farmAcres) || 1;
    const sDate = sowingDate || new Date().toISOString().split('T')[0];
    const mDays = parseInt(maturityDays) || 120;

    if (useMySQL) {
        try {
            // Check for duplicates
            const [existing] = await db.query(
                'SELECT id FROM tracked_crops WHERE username = ? AND crop = ? AND district = ?',
                [cleanUser, crop.toLowerCase(), district || '']
            );
            if (existing.length > 0) return res.status(409).json({ error: 'This crop is already being tracked for this district' });

            await db.query(
                `INSERT INTO tracked_crops 
                (id, username, crop, district, soilType, farmAcres, waterFacility, farmName, sowingDate, maturityDays) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [id, cleanUser, crop.toLowerCase(), district || '', soilType || '', parsedAcres, waterFacility || 'rainfed', farmName || 'My Farm', sDate, mDays]
            );

            // Format entry for response to match old frontend expectations
            const entry = { id, crop: crop.toLowerCase(), district: district || '', soilType: soilType || '', farmAcres: parsedAcres, waterFacility: waterFacility || 'rainfed', farmName: farmName || 'My Farm', sowingDate: sDate, maturityDays: mDays, createdAt: new Date().toISOString() };

            // 🌾 Send first crop advisory SMS (fire-and-forget)
            sendCropAdvisorySms(cleanUser, entry).catch(err => console.error('[CropAdvisory] First SMS error:', err.message));

            return res.status(201).json({ message: 'Crop tracked successfully', entry });
        } catch (error) {
            console.error('[CropTracker Database Error]:', error);
            return res.status(500).json({ error: 'Database error saving crop record' });
        }
    } else {
        // Fallback to JSON
        const tracker = loadCropTracker();
        if (!tracker[cleanUser]) tracker[cleanUser] = [];
        if (tracker[cleanUser].some(c => c.crop === crop.toLowerCase() && c.district === district)) {
            return res.status(409).json({ error: 'This crop is already being tracked for this district' });
        }
        const entry = { id, crop: crop.toLowerCase(), district: district || '', soilType: soilType || '', farmAcres: parsedAcres, waterFacility: waterFacility || 'rainfed', farmName: farmName || 'My Farm', sowingDate: sDate, maturityDays: mDays, createdAt: new Date().toISOString() };
        tracker[cleanUser].push(entry);
        saveCropTracker(tracker);

        // 🌾 Send first crop advisory SMS (fire-and-forget)
        sendCropAdvisorySms(cleanUser, entry).catch(err => console.error('[CropAdvisory] First SMS error:', err.message));

        return res.status(201).json({ message: 'Crop tracked successfully (JSON fallback)', entry });
    }
});

app.get('/api/crop-tracker/:username', async (req, res) => {
    const cleanUser = String(req.params.username || '').toLowerCase().trim();

    if (useMySQL) {
        try {
            const [crops] = await db.query('SELECT * FROM tracked_crops WHERE username = ? ORDER BY createdAt DESC', [cleanUser]);
            console.log(`[CropTracker] GET cleanUser (MySQL): "${cleanUser}", found ${crops.length} crops`);
            return res.json({ crops });
        } catch (error) {
            console.error('[CropTracker Database Error]:', error);
            return res.status(500).json({ error: 'Database error fetching crops' });
        }
    } else {
        const tracker = loadCropTracker();
        const actualKey = Object.keys(tracker).find(k => k.toLowerCase().trim() === cleanUser);
        const crops = actualKey ? tracker[actualKey] : [];
        console.log(`[CropTracker] GET cleanUser (JSON): "${cleanUser}", found ${crops.length} crops`);
        return res.json({ crops });
    }
});

app.delete('/api/crop-tracker/:username/:cropId', async (req, res) => {
    const cleanUser = String(req.params.username || '').toLowerCase().trim();
    const cropId = req.params.cropId;

    if (useMySQL) {
        try {
            const [result] = await db.query('DELETE FROM tracked_crops WHERE username = ? AND id = ?', [cleanUser, cropId]);
            if (result.affectedRows === 0) return res.status(404).json({ error: 'Crop entry not found' });
            return res.json({ message: 'Crop removed successfully' });
        } catch (error) {
            console.error('[CropTracker Database Error]:', error);
            return res.status(500).json({ error: 'Database error deleting crop' });
        }
    } else {
        const tracker = loadCropTracker();
        const actualKey = Object.keys(tracker).find(k => k.toLowerCase().trim() === cleanUser);
        if (!actualKey || !tracker[actualKey]) return res.status(404).json({ error: 'No tracked crops found' });

        const before = tracker[actualKey].length;
        tracker[actualKey] = tracker[actualKey].filter(c => c.id !== cropId);
        if (tracker[actualKey].length === before) return res.status(404).json({ error: 'Crop entry not found' });

        saveCropTracker(tracker);
        return res.json({ message: 'Crop removed successfully (JSON fallback)' });
    }
});


// ─── Risk Prediction (ML Model Fallback) ─────────────────────────────────

app.post('/api/risk-predict', (req, res) => {
    const { temperature, humidity, rainfall, wind_speed } = req.body;

    if (temperature == null || rainfall == null || wind_speed == null) {
        return res.status(400).json({ error: 'temperature, rainfall, and wind_speed are required' });
    }

    // Mock ML output based on heuristics
    let riskScore = rainfall * 2;
    if (wind_speed > 40) riskScore += 30;
    else if (wind_speed > 20) riskScore += 15;
    if (temperature > 40) riskScore += 30; // heatwave
    else if (temperature > 35) riskScore += 15;
    if (humidity > 90) riskScore += 10;

    let liveRiskLevel;
    if (riskScore > 80) liveRiskLevel = "Flood/Extreme Risk";
    else if (riskScore > 50) liveRiskLevel = "High Risk";
    else if (riskScore > 20) liveRiskLevel = "Moderate Risk";
    else liveRiskLevel = "Low Risk";

    res.json({
        prediction: liveRiskLevel,
        score: riskScore,
        confidence: 0.90,
        input: { temperature, humidity, rainfall, wind_speed }
    });
});


// ─── Crop Suggestion ────────────────────────────────────────────────────────

app.get('/api/crop-suggestion', async (req, res) => {
    const { soil_type, rainfall_level, district } = req.query;

    if (useMySQL) {
        try {
            let query = 'SELECT * FROM crop_data WHERE 1=1';
            const params = [];
            if (soil_type) { query += ' AND soil_type = ?'; params.push(soil_type); }
            if (rainfall_level) { query += ' AND rainfall_level = ?'; params.push(rainfall_level); }
            const [rows] = await db.query(query, params);
            return res.json({ total: rows.length, data: rows, source: 'mysql' });
        } catch (err) {
            console.error('MySQL crop query failed, falling back to CSV:', err.message);
        }
    }

    // CSV fallback
    const csvPath = path.join(DATASET_DIR, 'crop_recommendation.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Crop recommendation dataset not found' });

    try {
        let rows = await readCsv(csvPath);
        if (soil_type) rows = rows.filter(r => r.soil_type && r.soil_type.toLowerCase() === soil_type.toLowerCase());
        if (rainfall_level) rows = rows.filter(r => r.rainfall_level && r.rainfall_level.toLowerCase() === rainfall_level.toLowerCase());

        // If district provided, find its soil type and filter
        if (district && !soil_type) {
            const distData = DISTRICT_DATA[district];
            if (distData) {
                rows = rows.filter(r => r.soil_type && r.soil_type.toLowerCase() === distData.soil.toLowerCase());
            }
        }

        res.json({ total: rows.length, data: rows, source: 'csv' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ─── Protected Routes (require JWT + role) ──────────────────────────────────

// Farmer-only: soil dashboard data
app.get('/api/farmer/soil', authMiddleware, roleMiddleware('farmer'), async (req, res) => {
    req.query = { ...req.query };
    const { district } = req.query;

    const csvPath = path.join(DATASET_DIR, 'soil_dataset.csv');
    let soilData = [];
    if (fs.existsSync(csvPath)) {
        soilData = await readCsv(csvPath);
        if (district) soilData = soilData.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
    }

    // Also get crop suggestions for this soil
    const cropPath = path.join(DATASET_DIR, 'crop_recommendation.csv');
    let cropData = [];
    if (fs.existsSync(cropPath) && soilData.length > 0) {
        cropData = await readCsv(cropPath);
        const soilType = soilData[0].soil_type;
        if (soilType) cropData = cropData.filter(r => r.soil_type && r.soil_type.toLowerCase() === soilType.toLowerCase());
    }

    res.json({
        role: 'farmer',
        soil: { total: soilData.length, data: soilData },
        crops: { total: cropData.length, data: cropData },
    });
});

// Farmer-only: crop dashboard data
app.get('/api/farmer/crops', authMiddleware, roleMiddleware('farmer'), (req, res) => {
    const data = loadJsonFile('crop_dataset.json');
    if (!data) return res.status(404).json({ error: 'Crop dataset not found' });
    res.json({ role: 'farmer', data });
});

// Public-only: weather alerts
app.get('/api/public/weather-alerts', authMiddleware, roleMiddleware('public'), async (req, res) => {
    const district = req.query.district || 'Bengaluru Urban';
    const coords = DISTRICT_COORDS[district];
    if (!coords) return res.status(404).json({ error: `District '${district}' not found` });

    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${coords.lat},${coords.lng}&days=3&aqi=yes&alerts=yes`;
        const data = await httpsGet(url);

        // Extract key alert info
        const alerts = [];
        if (data.alerts && data.alerts.alert) {
            data.alerts.alert.forEach(a => {
                alerts.push({ headline: a.headline, severity: a.severity, event: a.event, desc: a.desc });
            });
        }

        // Rain warnings from forecast
        const rainWarnings = [];
        if (data.forecast && data.forecast.forecastday) {
            data.forecast.forecastday.forEach(day => {
                if (day.day.daily_chance_of_rain > 60) {
                    rainWarnings.push({
                        date: day.date,
                        chance: day.day.daily_chance_of_rain,
                        precip_mm: day.day.totalprecip_mm,
                        condition: day.day.condition.text
                    });
                }
            });
        }

        res.json({ role: 'public', district, alerts, rainWarnings, weather: data });
    } catch (err) {
        res.status(502).json({ error: `Weather API error: ${err.message}` });
    }
});

// Public-only: forest dashboard
app.get('/api/public/forest', authMiddleware, roleMiddleware('public'), async (req, res) => {
    const { district } = req.query;
    const csvPath = path.join(DATASET_DIR, 'forest_dataset.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Forest dataset not found' });

    let rows = await readCsv(csvPath);
    if (district) rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
    res.json({ role: 'public', total: rows.length, data: rows });
});


app.get('/api/debug/sms', (req, res) => {
    res.json({
        apiKeyPresent: !!TEXTBEE_API_KEY,
        apiKeyPrefix: TEXTBEE_API_KEY ? TEXTBEE_API_KEY.substring(0, 4) : 'N/A',
        deviceId: TEXTBEE_DEVICE_ID,
        envPort: process.env.PORT,
        nodeVersion: process.version
    });
});

// ─── Custom SMS Alerts & OTP (TextBee - 100% Free via Android) ──────────────

// Multi-purpose SMS route (alerts & OTP)
app.post(['/api/send-alert', '/api/send-sms'], async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'phone and message are required' });
    }

    if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID || TEXTBEE_API_KEY === 'your_textbee_api_key_here') {
        return res.status(503).json({ error: 'TextBee is not configured. Please add API Key and Device ID to .env' });
    }

    try {
        // TextBee V1 Dashboard API for sending SMS
        const url = `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/sendSMS`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': TEXTBEE_API_KEY
            },
            body: JSON.stringify({
                receivers: [phone],
                smsBody: message
            }),
        });

        const result = await response.json();

        if (response.ok) {
            console.log(`  📩 SMS queued via TextBee to ${phone}. ID: ${result.data?._id || 'queued'}`);
            res.json({
                success: true,
                message: 'SMS queued successfully via your Android phone!',
                data: result.data
            });
        } else {
            console.error('  ⚠️  TextBee API Error:', result.message || response.statusText);
            res.status(response.status).json({
                error: `TextBee Error: ${result.message || 'Failed to queue SMS'}`,
                suggestion: 'Check if your Android phone is online and TextBee app is running.'
            });
        }

    } catch (err) {
        console.error('  ⚠️  TextBee Server Error:', err.message);
        res.status(500).json({ error: `Failed to communicate with TextBee: ${err.message}` });
    }
});


// ─── Send Alert to All Users in a District ─────────────────────────────────

app.post('/api/send-district-alert', async (req, res) => {
    const { district, message } = req.body;

    if (!district || !message) {
        return res.status(400).json({ error: 'district and message are required' });
    }

    if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID || TEXTBEE_API_KEY === 'your_textbee_api_key_here') {
        return res.status(503).json({ error: 'TextBee is not configured. Please add API Key and Device ID to .env' });
    }

    try {
        // Fetch all users in the given district with alerts enabled
        let users = [];
        if (useMySQL) {
            const [rows] = await db.query(
                'SELECT name, phone FROM users WHERE district = ? AND alerts_enabled = true',
                [district.trim()]
            );
            users = rows;
        } else {
            const allUsers = loadUsers();
            users = allUsers.filter(
                u => u.district && u.district.toLowerCase() === district.trim().toLowerCase() && u.alerts_enabled !== false
            );
        }

        if (users.length === 0) {
            return res.json({ success: true, message: `No users found in district "${district}" with alerts enabled.`, sent: 0 });
        }

        const url = `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/sendSMS`;
        let successCount = 0;
        let failCount = 0;
        const errors = [];

        for (const user of users) {
            let phone = user.phone.trim();
            if (!phone.startsWith('+')) phone = '+91' + phone;

            try {
                const smsRes = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'x-api-key': TEXTBEE_API_KEY },
                    body: JSON.stringify({ receivers: [phone], smsBody: message })
                });
                if (smsRes.ok) {
                    successCount++;
                    console.log(`  📩 District alert SMS sent to ${user.name} (${phone})`);
                } else {
                    failCount++;
                    errors.push(`${user.name}: ${smsRes.statusText}`);
                }
            } catch (smsErr) {
                failCount++;
                errors.push(`${user.name}: ${smsErr.message}`);
            }
        }

        res.json({
            success: true,
            message: `Alert sent to ${successCount} user(s) in "${district}"`,
            sent: successCount,
            failed: failCount,
            total: users.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (err) {
        res.status(500).json({ error: `Server error: ${err.message}` });
    }
});


// ─── User Profile & Settings ───────────────────────────────────────────────

app.get('/api/user/profile', authMiddleware, async (req, res) => {
    let user = null;
    if (useMySQL) {
        try {
            const [rows] = await db.query('SELECT name, email, phone, user_role, avatar, district, alerts_enabled FROM users WHERE name = ?', [req.user.name]);
            if (rows.length > 0) user = rows[0];
        } catch (err) {
            return res.status(500).json({ error: `Database error: ${err.message}` });
        }
    } else {
        const users = loadUsers();
        user = users.find(u => u.name === req.user.name);
    }

    if (!user) return res.status(404).json({ error: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json(safeUser);
});

app.post('/api/user/update', authMiddleware, async (req, res) => {
    const { name, email, phone, alerts_enabled, avatar, user_role, district, current_password, new_password } = req.body;
    const oldName = req.user.name;

    try {
        let user = null;
        if (useMySQL) {
            const [rows] = await db.query('SELECT * FROM users WHERE name = ?', [oldName]);
            if (rows.length > 0) user = rows[0];
        } else {
            const users = loadUsers();
            user = users.find(u => u.name === oldName);
        }

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Password change logic
        let hashedPassword = user.password;
        if (new_password) {
            if (!current_password) {
                return res.status(400).json({ error: 'Current password is required to set a new password' });
            }
            const valid = await bcrypt.compare(current_password, user.password);
            if (!valid) {
                return res.status(401).json({ error: 'Incorrect current password' });
            }
            hashedPassword = await bcrypt.hash(new_password, 10);
        }

        if (useMySQL) {
            await db.query(
                `UPDATE users SET name = ?, email = ?, phone = ?, user_role = ?, alerts_enabled = ?, avatar = ?, district = ?, password = ? 
                 WHERE name = ?`,
                [
                    name || oldName,
                    email || '',
                    phone || '',
                    user_role || user.user_role,
                    alerts_enabled ?? true,
                    avatar || 'assets/user_avatar.png',
                    district !== undefined ? district : (user.district || ''),
                    hashedPassword,
                    oldName
                ]
            );

            return res.json({
                message: 'Profile updated successfully',
                user: {
                    name: name || oldName,
                    email: email || '',
                    phone: phone || '',
                    alerts_enabled,
                    avatar,
                    district: district !== undefined ? district : (user.district || ''),
                    role: user_role || user.user_role
                }
            });
        } else {
            const users = loadUsers();
            const userIdx = users.findIndex(u => u.name === oldName);
            users[userIdx] = {
                ...users[userIdx],
                name: name || users[userIdx].name,
                email: email !== undefined ? email : users[userIdx].email,
                phone: phone || users[userIdx].phone,
                user_role: user_role || users[userIdx].user_role,
                alerts_enabled: alerts_enabled !== undefined ? alerts_enabled : users[userIdx].alerts_enabled,
                avatar: avatar || users[userIdx].avatar,
                district: district !== undefined ? district : (users[userIdx].district || ''),
                password: hashedPassword
            };
            saveUsers(users);
            const { password: _, ...safeUser } = users[userIdx];
            res.json({ message: 'Profile updated successfully', user: safeUser });
        }
    } catch (err) {
        return res.status(500).json({ error: `Server error: ${err.message}` });
    }
});


// ─── Existing Data Routes (kept for backward compatibility) ─────────────────

app.get('/api/districts', (req, res) => {
    const result = {};
    for (const [name, data] of Object.entries(DISTRICT_DATA)) {
        result[name] = { ...data, coordinates: DISTRICT_COORDS[name] || {} };
    }
    res.json(result);
});

app.get('/api/districts/:name', (req, res) => {
    const data = DISTRICT_DATA[req.params.name];
    if (!data) return res.status(404).json({ error: `District '${req.params.name}' not found` });
    res.json({ ...data, coordinates: DISTRICT_COORDS[req.params.name] || {} });
});

app.get('/api/weather/:district', async (req, res) => {
    const coords = DISTRICT_COORDS[req.params.district];
    if (!coords) return res.status(404).json({ error: `District '${req.params.district}' not found` });
    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${coords.lat},${coords.lng}&days=7&aqi=no&alerts=no`;
        const data = await httpsGet(url);
        res.json(data);
    } catch (err) {
        res.status(502).json({ error: `Weather API error: ${err.message}` });
    }
});

app.get('/api/crops', (req, res) => {
    const data = loadJsonFile('crop_dataset.json');
    if (!data) return res.status(404).json({ error: 'Crop dataset not found' });
    res.json(data);
});

app.get('/api/crops/:name', (req, res) => {
    const data = loadJsonFile('crop_dataset.json');
    if (!data) return res.status(404).json({ error: 'Crop dataset not found' });
    const crop = data[req.params.name.toLowerCase()];
    if (!crop) return res.status(404).json({ error: `Crop '${req.params.name}' not found` });
    res.json(crop);
});

app.get('/api/soil', (req, res) => {
    const data = loadJsonFile('soil_dataset.json');
    if (!data) return res.status(404).json({ error: 'Soil dataset not found' });
    res.json(data);
});

app.get('/api/forest', (req, res) => {
    const data = loadJsonFile('forestData.json');
    if (!data) return res.status(404).json({ error: 'Forest dataset not found' });
    res.json(data);
});

app.get('/api/dataset/seasons', async (req, res) => {
    const csvPath = path.join(DATASET_DIR, 'data_season.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Season dataset not found' });
    try {
        let rows = await readCsv(csvPath);
        const { location, crop, season, year, limit = 100 } = req.query;
        if (location) rows = rows.filter(r => r.Location && r.Location.toLowerCase() === location.toLowerCase());
        if (crop) rows = rows.filter(r => r.Crops && r.Crops.toLowerCase() === crop.toLowerCase());
        if (season) rows = rows.filter(r => r.Season && r.Season.toLowerCase() === season.toLowerCase());
        if (year) rows = rows.filter(r => r.Year && r.Year === year);
        rows = rows.slice(0, parseInt(limit));
        res.json({ total: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/dataset/seasons/summary', async (req, res) => {
    const csvPath = path.join(DATASET_DIR, 'data_season.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Season dataset not found' });
    try {
        const rows = await readCsv(csvPath);
        const unique = (key) => [...new Set(rows.map(r => r[key]).filter(Boolean))].sort();
        res.json({
            total_records: rows.length,
            years: unique('Year'), locations: unique('Location'),
            crops: unique('Crops'), seasons: unique('Season'),
            soil_types: unique('Soil type'), irrigation_methods: unique('Irrigation'),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/dataset/rainfall', async (req, res) => {
    const csvPath = path.join(DATASET_DIR, 'rainfall_dataset.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Rainfall dataset not found' });
    try {
        let rows = await readCsv(csvPath);
        const { district, month, year, limit = 500 } = req.query;
        if (district) rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        if (month) rows = rows.filter(r => r.month && r.month === month);
        if (year) rows = rows.filter(r => r.year && r.year === year);
        rows = rows.slice(0, parseInt(limit));
        res.json({ total: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/dataset/crop-recommendation', async (req, res) => {
    const csvPath = path.join(DATASET_DIR, 'crop_recommendation.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Crop recommendation dataset not found' });
    try {
        let rows = await readCsv(csvPath);
        const { soil_type, rainfall_level } = req.query;
        if (soil_type) rows = rows.filter(r => r.soil_type && r.soil_type.toLowerCase() === soil_type.toLowerCase());
        if (rainfall_level) rows = rows.filter(r => r.rainfall_level && r.rainfall_level.toLowerCase() === rainfall_level.toLowerCase());
        res.json({ total: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/dataset/soil', async (req, res) => {
    const csvPath = path.join(DATASET_DIR, 'soil_dataset.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Soil dataset not found' });
    try {
        let rows = await readCsv(csvPath);
        const { district, soil_type } = req.query;
        if (district) rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        if (soil_type) rows = rows.filter(r => r.soil_type && r.soil_type.toLowerCase() === soil_type.toLowerCase());
        res.json({ total: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/dataset/forest', async (req, res) => {
    const csvPath = path.join(DATASET_DIR, 'forest_dataset.csv');
    if (!fs.existsSync(csvPath)) return res.status(404).json({ error: 'Forest dataset not found' });
    try {
        let rows = await readCsv(csvPath);
        const { district, year } = req.query;
        if (district) rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        if (year) rows = rows.filter(r => r.year && r.year === year);
        res.json({ total: rows.length, data: rows });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ═════════════════════════════════════════════════════════════════════════════
//  NEW API ROUTES (Simplified Endpoints)
// ═════════════════════════════════════════════════════════════════════════════

// ─── Weather API ────────────────────────────────────────────────────────────
/**
 * GET /api/weather
 * Get weather data for a specific district or all districts
 * Query params: district (optional), days (optional, default 7)
 * Returns: weather forecast data
 */
app.get('/api/weather', async (req, res) => {
    try {
        const { district, days = 7 } = req.query;

        // If no district specified, return weather data for all major districts
        if (!district) {
            const majorDistricts = ['Bengaluru Urban', 'Mysuru', 'Belgaum', 'Mangalore'];
            const weatherData = {};

            for (const dist of majorDistricts) {
                const coords = DISTRICT_COORDS[dist];
                if (coords && WEATHER_API_KEY) {
                    try {
                        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${coords.lat},${coords.lng}&days=${Math.min(days, 10)}&aqi=no`;
                        weatherData[dist] = await httpsGet(url);
                    } catch (err) {
                        weatherData[dist] = { error: err.message };
                    }
                }
            }

            return res.json({
                status: 'success',
                message: 'Weather data for major districts',
                data: weatherData
            });
        }

        // Get weather for specific district
        const coords = DISTRICT_COORDS[district];
        if (!coords) {
            return res.status(404).json({
                status: 'error',
                message: `District '${district}' not found`,
                available_districts: Object.keys(DISTRICT_COORDS).sort()
            });
        }

        if (!WEATHER_API_KEY) {
            return res.status(503).json({
                status: 'error',
                message: 'Weather API key not configured'
            });
        }

        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${coords.lat},${coords.lng}&days=${Math.min(days, 10)}&aqi=yes`;
        const data = await httpsGet(url);

        res.json({
            status: 'success',
            district: district,
            timestamp: new Date().toISOString(),
            data: data
        });
    } catch (err) {
        res.status(502).json({
            status: 'error',
            message: `Weather API error: ${err.message}`
        });
    }
});

// ─── Market Prices API ──────────────────────────────────────────────────────
/**
 * GET /api/market-prices
 * Get daily updated market prices for crops
 */
app.get('/api/market-prices', async (req, res) => {
    // Prevent browser from caching market prices
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    const crops = [
        { name: "Rice (Sona Masuri)", market: "Mandya APMC", base: 2850, unit: "Quintal" },
        { name: "Ragi", market: "Hassan APMC", base: 3200, unit: "Quintal" },
        { name: "Maize", market: "Haveri", base: 1950, unit: "Quintal" },
        { name: "Cotton", market: "Raichur", base: 6500, unit: "Quintal" },
        { name: "Sugarcane", market: "Belagavi", base: 2900, unit: "Ton" },
        { name: "Coconut", market: "Tumakuru", base: 18000, unit: "1000 Nuts" },
        { name: "Arecanut", market: "Shivamogga", base: 45000, unit: "Quintal" },
        { name: "Turmeric", market: "Chamarajanagar", base: 7200, unit: "Quintal" },
        { name: "Groundnut", market: "Chitradurga", base: 5800, unit: "Quintal" },
        { name: "Sunflower", market: "Gadag", base: 4600, unit: "Quintal" },
        { name: "Jowar", market: "Vijayapura", base: 2400, unit: "Quintal" },
        { name: "Bajra", market: "Bagalkote", base: 2100, unit: "Quintal" },
        { name: "Green Gram", market: "Bidar", base: 7500, unit: "Quintal" },
        { name: "Black Gram", market: "Kalaburagi", base: 6800, unit: "Quintal" },
        { name: "Bengal Gram", market: "Dharwad", base: 5200, unit: "Quintal" },
        { name: "Tur Dal", market: "Yadgir", base: 8100, unit: "Quintal" },
        { name: "Soybean", market: "Belagavi", base: 4300, unit: "Quintal" },
        { name: "Chilli (Dry)", market: "Byadgi", base: 18000, unit: "Quintal" },
        { name: "Pepper", market: "Kodagu", base: 38000, unit: "Quintal" },
        { name: "Cardamom", market: "Sakleshpur", base: 1500, unit: "Kg" },
        { name: "Ginger", market: "Hassan", base: 3500, unit: "Quintal" },
        { name: "Onion", market: "Chitradurga", base: 1200, unit: "Quintal" },
        { name: "Potato", market: "Hassan", base: 1400, unit: "Quintal" },
        { name: "Tomato", market: "Kolar", base: 800, unit: "Quintal" },
        { name: "Banana", market: "Mysuru", base: 1800, unit: "Quintal" },
        { name: "Pomegranate", market: "Koppal", base: 6500, unit: "Quintal" },
        { name: "Mango", market: "Srinivaspur", base: 4500, unit: "Quintal" },
        { name: "Wheat", market: "Bidar APMC", base: 2600, unit: "Quintal" },
        { name: "Paddy (IR-64)", market: "Raichur APMC", base: 2200, unit: "Quintal" },
        { name: "Horse Gram", market: "Tumakuru", base: 4800, unit: "Quintal" },
        { name: "Cowpea", market: "Dharwad", base: 5600, unit: "Quintal" },
        { name: "Sesame (Til)", market: "Koppal", base: 11000, unit: "Quintal" },
        { name: "Castor Seed", market: "Raichur", base: 5400, unit: "Quintal" },
        { name: "Linseed", market: "Vijayapura", base: 5800, unit: "Quintal" },
        { name: "Coriander", market: "Gadag", base: 7200, unit: "Quintal" },
        { name: "Cumin", market: "Dharwad", base: 16000, unit: "Quintal" },
        { name: "Fenugreek", market: "Belagavi", base: 8500, unit: "Quintal" },
        { name: "Tamarind", market: "Tumakuru", base: 6000, unit: "Quintal" },
        { name: "Cashew Nut", market: "Dakshina Kannada", base: 75000, unit: "Quintal" },
        { name: "Coffee (Robusta)", market: "Chikkamagaluru", base: 22000, unit: "Quintal" },
        { name: "Rubber", market: "Dakshina Kannada", base: 15000, unit: "Quintal" },
        { name: "Mulberry Silk", market: "Ramanagara", base: 48000, unit: "Quintal" },
        { name: "Drumstick", market: "Belagavi", base: 2200, unit: "Quintal" },
        { name: "Cabbage", market: "Chikkaballapura", base: 600, unit: "Quintal" },
        { name: "Carrot", market: "Ooty/Hassan", base: 1600, unit: "Quintal" },
        { name: "Beetroot", market: "Kolar", base: 1100, unit: "Quintal" },
        { name: "Watermelon", market: "Mandya", base: 900, unit: "Quintal" },
        { name: "Papaya", market: "Mysuru", base: 1200, unit: "Quintal" },
        { name: "Guava", market: "Bengaluru Rural", base: 3200, unit: "Quintal" },
        { name: "Sapota (Chikoo)", market: "Dharwad", base: 2800, unit: "Quintal" },
        { name: "Jackfruit", market: "Tumakuru APMC", base: 2000, unit: "Quintal" },
        { name: "Grapes", market: "Vijayapura APMC", base: 4500, unit: "Quintal" },
        { name: "Custard Apple", market: "Chitradurga APMC", base: 3800, unit: "Quintal" },
        { name: "Fig (Anjeer)", market: "Bellary APMC", base: 8500, unit: "Quintal" },
        { name: "Lemon", market: "Davangere APMC", base: 2500, unit: "Quintal" },
        { name: "Sweet Orange", market: "Kolar APMC", base: 3200, unit: "Quintal" },
        { name: "Pineapple", market: "Shimoga APMC", base: 2800, unit: "Quintal" },
        { name: "Litchi", market: "Bengaluru APMC", base: 7500, unit: "Quintal" },
        { name: "Amla (Gooseberry)", market: "Tumakuru APMC", base: 3500, unit: "Quintal" },
        { name: "Curry Leaves", market: "Mysuru APMC", base: 4000, unit: "Quintal" },
        { name: "Moringa Leaves", market: "Belagavi APMC", base: 3200, unit: "Quintal" },
        { name: "Spinach", market: "Bengaluru APMC", base: 1500, unit: "Quintal" },
        { name: "Cauliflower", market: "Chikkaballapura APMC", base: 900, unit: "Quintal" },
        { name: "Green Peas", market: "Hassan APMC", base: 4500, unit: "Quintal" },
        { name: "Bitter Gourd", market: "Mysuru APMC", base: 1800, unit: "Quintal" },
        { name: "Bottle Gourd", market: "Mandya APMC", base: 800, unit: "Quintal" },
        { name: "Ridge Gourd", market: "Haveri APMC", base: 1200, unit: "Quintal" },
        { name: "Snake Gourd", market: "Shimoga APMC", base: 1000, unit: "Quintal" },
        { name: "Ash Gourd", market: "Tumakuru APMC", base: 700, unit: "Quintal" },
        { name: "Pumpkin", market: "Davangere APMC", base: 600, unit: "Quintal" },
        { name: "Lady Finger (Okra)", market: "Raichur APMC", base: 1500, unit: "Quintal" },
        { name: "Brinjal", market: "Mysuru APMC", base: 1200, unit: "Quintal" },
        { name: "Cucumber", market: "Bengaluru APMC", base: 800, unit: "Quintal" },
        { name: "Capsicum (Green)", market: "Chikkaballapura APMC", base: 2500, unit: "Quintal" },
        { name: "Red Chilli (Fresh)", market: "Byadgi APMC", base: 5500, unit: "Quintal" },
        { name: "Mint", market: "Bengaluru APMC", base: 3000, unit: "Quintal" },
        { name: "Methi (Fenugreek Leaves)", market: "Dharwad APMC", base: 2200, unit: "Quintal" },
        { name: "Cluster Beans (Guar)", market: "Kalaburagi APMC", base: 2800, unit: "Quintal" },
        { name: "Broad Beans (Avarekai)", market: "Mandya APMC", base: 3500, unit: "Quintal" },
        { name: "Sweet Potato", market: "Shimoga APMC", base: 1400, unit: "Quintal" },
        { name: "Radish", market: "Bengaluru APMC", base: 800, unit: "Quintal" },
        { name: "Garlic", market: "Gadag APMC", base: 8000, unit: "Quintal" },
        { name: "Mustard Seed", market: "Vijayapura APMC", base: 5500, unit: "Quintal" },
        { name: "Safflower", market: "Kalaburagi APMC", base: 4200, unit: "Quintal" },
        { name: "Niger Seed", market: "Dharwad APMC", base: 6500, unit: "Quintal" },
        { name: "Foxtail Millet", market: "Tumakuru APMC", base: 3800, unit: "Quintal" },
        { name: "Little Millet", market: "Ramanagara APMC", base: 4000, unit: "Quintal" },
        { name: "Barnyard Millet", market: "Hassan APMC", base: 3600, unit: "Quintal" },
        { name: "Kodo Millet", market: "Chitradurga APMC", base: 3900, unit: "Quintal" },
        { name: "Proso Millet", market: "Bellary APMC", base: 3700, unit: "Quintal" },
        { name: "Pearl Millet (Sajje)", market: "Raichur APMC", base: 2200, unit: "Quintal" },
        { name: "Vanilla", market: "Kodagu APMC", base: 35000, unit: "Kg" },
        { name: "Clove", market: "Shimoga APMC", base: 85000, unit: "Quintal" },
        { name: "Nutmeg", market: "Dakshina Kannada APMC", base: 55000, unit: "Quintal" },
        { name: "Cinnamon", market: "Kodagu APMC", base: 42000, unit: "Quintal" },
        { name: "Cocoa", market: "Dakshina Kannada APMC", base: 18000, unit: "Quintal" },
        { name: "Betel Leaf", market: "Shimoga APMC", base: 12000, unit: "Quintal" },
        { name: "Marigold", market: "Bengaluru APMC", base: 4500, unit: "Quintal" },
        { name: "Jasmine", market: "Mysuru APMC", base: 16000, unit: "Quintal" },
        { name: "Chrysanthemum", market: "Tumakuru APMC", base: 6000, unit: "Quintal" },
        { name: "Rose", market: "Bengaluru APMC", base: 8000, unit: "Quintal" }
    ];

    // Generate daily variation based on date
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    const simulatedPrices = crops.map((crop, index) => {
        const random = Math.sin(seed + index * 100) * 10000;
        const percentChange = ((random - Math.floor(random)) * 0.1) - 0.05;
        const currentPrice = Math.round(crop.base * (1 + percentChange));
        const trend = percentChange > 0 ? 'up' : (percentChange < 0 ? 'down' : 'stable');

        return {
            crop: crop.name,
            market: crop.market,
            price: currentPrice,
            unit: crop.unit,
            trend: trend,
            date: today.toISOString()
        };
    });

    // Try to overlay real data from data.gov.in on top of simulated data
    let realPrices = [];
    if (DATA_GOV_API_KEY) {
        try {
            const url = `https://api.data.gov.in/resource/${DATA_GOV_RESOURCE_ID}?api-key=${DATA_GOV_API_KEY}&format=json&filters[state]=Karnataka&limit=50`;
            const response = await httpsGet(url);

            if (response && response.records && response.records.length > 0) {
                realPrices = response.records.map(r => ({
                    crop: r.commodity || r.Commodity || 'Unknown Crop',
                    market: `${r.market || r.Market || 'Market'}, ${r.district || r.District || ''}`,
                    price: Number(r.modal_price || r.Modal_Price || 0),
                    unit: "Quintal",
                    trend: "stable",
                    date: r.arrival_date || today.toISOString(),
                    source: 'live'
                }));
            }
        } catch (err) {
            console.warn('⚠️ Failed to fetch from data.gov.in, using simulated data:', err.message);
        }
    }

    // Merge: real API prices first, then all simulated crops (skip duplicates)
    const realCropNames = new Set(realPrices.map(p => p.crop.toLowerCase()));
    const mergedPrices = [
        ...realPrices,
        ...simulatedPrices.filter(p => !realCropNames.has(p.crop.toLowerCase()))
    ];

    res.json({ data: mergedPrices, source: realPrices.length > 0 ? 'mixed' : 'simulated' });
});

// ─── Rainfall API ───────────────────────────────────────────────────────────
/**
 * GET /api/rainfall
 * Get rainfall data
 * Query params: district (optional), month (optional), year (optional), limit (default 100)
 * Returns: rainfall records
 */
app.get('/api/rainfall', async (req, res) => {
    try {
        const csvPath = path.join(DATASET_DIR, 'rainfall_dataset.csv');

        if (!fs.existsSync(csvPath)) {
            return res.status(404).json({
                status: 'error',
                message: 'Rainfall dataset not found'
            });
        }

        let rows = await readCsv(csvPath);
        const { district, month, year, limit = 100 } = req.query;

        // Apply filters
        if (district) {
            rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        }
        if (month) {
            rows = rows.filter(r => r.month && r.month.toString() === month.toString());
        }
        if (year) {
            rows = rows.filter(r => r.year && r.year.toString() === year.toString());
        }

        rows = rows.slice(0, parseInt(limit));

        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            filters_applied: { district: district || null, month: month || null, year: year || null },
            total_records: rows.length,
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: `Error fetching rainfall data: ${err.message}`
        });
    }
});

// ─── Soil API ───────────────────────────────────────────────────────────────
/**
 * GET /api/soil
 * Get soil data
 * Query params: district (optional), soil_type (optional), limit (default 100)
 * Returns: soil records
 */
app.get('/api/soil', async (req, res) => {
    try {
        const csvPath = path.join(DATASET_DIR, 'soil_dataset.csv');

        if (!fs.existsSync(csvPath)) {
            return res.status(404).json({
                status: 'error',
                message: 'Soil dataset not found'
            });
        }

        let rows = await readCsv(csvPath);
        const { district, soil_type, limit = 100 } = req.query;

        // Apply filters
        if (district) {
            rows = rows.filter(r => r.district && r.district.toLowerCase() === district.toLowerCase());
        }
        if (soil_type) {
            rows = rows.filter(r => r.soil_type && r.soil_type.toLowerCase() === soil_type.toLowerCase());
        }

        rows = rows.slice(0, parseInt(limit));

        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            filters_applied: { district: district || null, soil_type: soil_type || null },
            total_records: rows.length,
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: `Error fetching soil data: ${err.message}`
        });
    }
});

// ─── Crop Recommendation API ────────────────────────────────────────────────
/**
 * GET /api/crop-recommendation
 * Get crop recommendations based on soil type and rainfall level
 * Query params: soil_type (optional), rainfall_level (optional), limit (default 50)
 * Returns: recommended crops
 */
app.get('/api/crop-recommendation', async (req, res) => {
    try {
        const csvPath = path.join(DATASET_DIR, 'crop_recommendation.csv');

        if (!fs.existsSync(csvPath)) {
            return res.status(404).json({
                status: 'error',
                message: 'Crop recommendation dataset not found'
            });
        }

        let rows = await readCsv(csvPath);
        const { soil_type, rainfall_level, limit = 50 } = req.query;

        // Apply filters
        if (soil_type) {
            rows = rows.filter(r => r.soil_type && r.soil_type.toLowerCase() === soil_type.toLowerCase());
        }
        if (rainfall_level) {
            rows = rows.filter(r => r.rainfall_level && r.rainfall_level.toLowerCase() === rainfall_level.toLowerCase());
        }

        rows = rows.slice(0, parseInt(limit));

        res.json({
            status: 'success',
            timestamp: new Date().toISOString(),
            filters_applied: { soil_type: soil_type || null, rainfall_level: rainfall_level || null },
            total_records: rows.length,
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: `Error fetching crop recommendations: ${err.message}`
        });
    }
});


// ═════════════════════════════════════════════════════════════════════════════
//  AUTO WEATHER ALERT SCHEDULER
// ═════════════════════════════════════════════════════════════════════════════

const ALERT_CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
const ALERT_COOLDOWN_MS = 6 * 60 * 60 * 1000;   // 6 hours between same alerts
const alertCooldowns = new Map(); // key: "district|alertType" → lastSentTimestamp

/**
 * Check weather for a single district and return any severe conditions detected
 */
async function checkDistrictWeather(districtName) {
    const coords = DISTRICT_COORDS[districtName];
    if (!coords || !WEATHER_API_KEY) return [];

    try {
        const url = `https://api.weatherapi.com/v1/forecast.json?key=${WEATHER_API_KEY}&q=${coords.lat},${coords.lng}&days=1&aqi=no&alerts=yes`;
        const data = await httpsGet(url);
        const alerts = [];

        // Check current conditions
        const current = data.current;
        if (current) {
            if (current.temp_c > 35) {
                alerts.push({ type: 'extreme_heat', message: `⚠️ Extreme Heat Alert for ${districtName}! Temperature is ${current.temp_c}°C. Stay hydrated and avoid outdoor work during peak hours.` });
            }
            if (current.temp_c < 5) {
                alerts.push({ type: 'extreme_cold', message: `🥶 Cold Wave Alert for ${districtName}! Temperature is ${current.temp_c}°C. Protect crops and livestock from frost damage.` });
            }
            if (current.wind_kph > 60) {
                alerts.push({ type: 'strong_wind', message: `💨 Strong Wind Alert for ${districtName}! Wind speed is ${current.wind_kph} km/h. Secure loose objects and avoid open areas.` });
            }
        }

        // Check forecast for heavy rain
        if (data.forecast && data.forecast.forecastday && data.forecast.forecastday.length > 0) {
            const today = data.forecast.forecastday[0].day;
            if (today.daily_chance_of_rain > 70) {
                alerts.push({ type: 'heavy_rain', message: `🌧️ Heavy Rain Alert for ${districtName}! ${today.daily_chance_of_rain}% chance of rain with ${today.totalprecip_mm}mm expected. Take precautions for crops and travel.` });
            }
            if (today.totalprecip_mm > 50) {
                alerts.push({ type: 'flood_risk', message: `🌊 Flood Risk Alert for ${districtName}! Expected rainfall: ${today.totalprecip_mm}mm. Move livestock to higher ground and avoid low-lying areas.` });
            }
        }

        // Check official weather alerts from API
        if (data.alerts && data.alerts.alert && data.alerts.alert.length > 0) {
            data.alerts.alert.forEach(a => {
                alerts.push({ type: 'official_' + (a.event || 'warning').replace(/\s+/g, '_').toLowerCase(), message: `🚨 Official Weather Alert for ${districtName}: ${a.headline || a.event}. ${a.desc ? a.desc.substring(0, 120) : ''}` });
            });
        }

        return alerts;
    } catch (err) {
        console.error(`  [Weather-Alert] Failed to check ${districtName}: ${err.message}`);
        return [];
    }
}

/**
 * Send SMS alert to all users registered in a district
 */
async function sendDistrictAlertSms(districtName, message) {
    if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID || TEXTBEE_API_KEY === 'your_textbee_api_key_here') {
        console.log('  [Weather-Alert] TextBee not configured, skipping SMS');
        return { sent: 0, total: 0 };
    }

    let users = [];
    if (useMySQL) {
        try {
            const [rows] = await db.query(
                'SELECT name, phone FROM users WHERE district = ? AND alerts_enabled = true',
                [districtName.trim()]
            );
            users = rows;
        } catch (err) {
            console.error(`  [Weather-Alert] DB query failed: ${err.message}`);
            return { sent: 0, total: 0 };
        }
    } else {
        const allUsers = loadUsers();
        users = allUsers.filter(
            u => u.district && u.district.toLowerCase() === districtName.trim().toLowerCase() && u.alerts_enabled !== false
        );
    }

    if (users.length === 0) return { sent: 0, total: 0 };

    const url = `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/sendSMS`;
    let sent = 0;

    for (const user of users) {
        let phone = user.phone.trim();
        if (!phone.startsWith('+')) phone = '+91' + phone;
        try {
            const smsRes = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': TEXTBEE_API_KEY },
                body: JSON.stringify({ receivers: [phone], smsBody: message })
            });
            if (smsRes.ok) {
                sent++;
                console.log(`    📩 Alert SMS → ${user.name} (${phone})`);
            }
        } catch (e) {
            console.error(`    ⚠️ SMS failed for ${user.name}: ${e.message}`);
        }
    }
    return { sent, total: users.length };
}

/**
 * Main scheduler: check all districts that have registered users
 */
async function runWeatherAlertCheck() {
    console.log(`\n  ⏰ [${new Date().toLocaleTimeString()}] Running weather alert check...`);

    // Check ALL Karnataka districts (from DISTRICT_COORDS)
    const allDistricts = Object.keys(DISTRICT_COORDS);

    console.log(`  [Weather-Alert] Checking all ${allDistricts.length} Karnataka district(s)...`);
    let totalAlertsSent = 0;

    for (const district of allDistricts) {
        const alerts = await checkDistrictWeather(district);

        for (const alert of alerts) {
            const cooldownKey = `${district}|${alert.type}`;
            const lastSent = alertCooldowns.get(cooldownKey);
            const now = Date.now();

            if (lastSent && (now - lastSent) < ALERT_COOLDOWN_MS) {
                console.log(`    ⏸️ Cooldown active for ${district} (${alert.type}), skipping`);
                continue;
            }

            console.log(`    🚨 ALERT: ${district} — ${alert.type}`);
            const result = await sendDistrictAlertSms(district, alert.message);
            if (result.sent > 0) {
                alertCooldowns.set(cooldownKey, now);
                totalAlertsSent += result.sent;
            }
        }

        // Small delay between districts to avoid API rate limits
        await new Promise(r => setTimeout(r, 500));
    }

    console.log(`  [Weather-Alert] Check complete. ${totalAlertsSent} alert(s) sent.\n`);
}

// Manual trigger endpoint for testing
app.get('/api/weather-alert-check', async (req, res) => {
    console.log('  [Weather-Alert] Manual check triggered via API');
    try {
        await runWeatherAlertCheck();
        res.json({ success: true, message: 'Weather alert check completed. See server console for details.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ═════════════════════════════════════════════════════════════════════════════
//  START SERVER
// ═════════════════════════════════════════════════════════════════════════════

async function start() {
    console.log('\n🌿 ClimateGuard Backend Server v2.0');
    console.log('='.repeat(50));

    await initDatabase();

    // Start Python ML Predict Server
    const pythonCandidates = findPython();
    if (pythonCandidates.length > 0) {
        const pyCmd = pythonCandidates[0];
        const serverScript = path.join(ML_MODEL_DIR, 'predict_server.py');
        if (fs.existsSync(serverScript)) {
            console.log(`  🤖 Starting ML Predictor Service on port 5001 using ${pyCmd}...`);
            const mlProcess = execFile(pyCmd, [serverScript], { cwd: ML_MODEL_DIR });

            mlProcess.stdout.on('data', (data) => console.log(`  [ML-Server] ${data.trim()}`));
            mlProcess.stderr.on('data', (data) => console.error(`  [ML-Server Error] ${data.trim()}`));

            // Cleanup ML server on exit
            process.on('SIGINT', () => { mlProcess.kill(); process.exit(); });
            process.on('SIGTERM', () => { mlProcess.kill(); process.exit(); });
            process.on('exit', () => mlProcess.kill());
        } else {
            console.warn('  ⚠️ ML Predictor server script not found.');
        }
    } else {
        console.warn('  ⚠️ Python not found. ML Predict Server will not be started.');
    }

    console.log('='.repeat(50));

    app.listen(PORT, () => {
        console.log(`\n  🚀 Server running on http://localhost:${PORT}`);
        console.log('\n  📡 API Endpoints:');
        console.log('  ─────────────────────────────────────────');
        console.log('  AUTH:');
        console.log('    POST /api/register         (all)');
        console.log('    POST /api/login            (all)');
        console.log('  DATA:');
        console.log('    GET  /api/soil-data         (all | farmer*)');
        console.log('    GET  /api/forest-data       (all | public*)');
        console.log('    POST /api/rainfall-predict  (all)');
        console.log('    POST /api/crop-recommend    (all)');
        console.log('    POST /api/risk-predict      (all)');
        console.log('    GET  /api/crop-suggestion   (all | farmer*)');
        console.log('  ML MODEL:');
        console.log('    POST /api/rainfall-predict  (rainfall prediction)');
        console.log('    GET  /api/ml/status         (check ML model status)');
        console.log('  ROLE-PROTECTED:');
        console.log('    GET  /api/farmer/soil       (farmer only)');
        console.log('    GET  /api/farmer/crops      (farmer only)');
        console.log('    GET  /api/public/weather-alerts (public only)');
        console.log('    GET  /api/public/forest     (public only)');
        console.log('  GENERAL:');
        console.log('    GET  /api/health');
        console.log('    GET  /api/test              (connection test)');
        console.log('    GET  /api/districts');
        console.log('    GET  /api/weather           (get weather by district param)');
        console.log('    GET  /api/weather/:district (legacy)');
        console.log('    GET  /api/rainfall          (query: district, month, year)');
        console.log('    GET  /api/soil              (query: district, soil_type)');
        console.log('    GET  /api/crop-recommendation (query: soil_type, rainfall_level)');
        console.log('    GET  /api/crops');
        console.log('    GET  /api/dataset/seasons');
        console.log('    GET  /api/dataset/rainfall  (legacy)');
        console.log('    GET  /api/dataset/crop-recommendation (legacy)');
        console.log('    GET  /api/dataset/soil      (legacy)');
        console.log('    GET  /api/dataset/forest');
        console.log('  SMS:');
        console.log('    POST /api/send-alert        (all)');
        console.log('    POST /api/send-district-alert (send SMS to all users in a district)');
        console.log('  WEATHER ALERTS:');
        console.log('    GET  /api/weather-alert-check (manual trigger)');
        console.log('  CROP ADVISORY:');
        console.log('    GET  /api/crop-advisory-check (manual trigger for weekly SMS)');
        console.log('  ─────────────────────────────────────────');
        console.log('  * = protected when accessed via /api/farmer/ or /api/public/');
        console.log('\n  📚 Documentation: See ML_INTEGRATION_GUIDE.md');

        // Start the weather alert scheduler
        console.log('\n  ⏰ Weather Alert Scheduler: checking every 30 minutes');
        setTimeout(() => runWeatherAlertCheck(), 10000); // first check 10s after startup
        setInterval(() => runWeatherAlertCheck(), ALERT_CHECK_INTERVAL_MS);

        // Start the weekly crop advisory scheduler
        console.log('  🌾 Crop Advisory Scheduler: sending weekly tips every 7 days');
        setTimeout(() => runWeeklyCropAdvisory(), 30000); // first check 30s after startup
        setInterval(() => runWeeklyCropAdvisory(), CROP_ADVISORY_INTERVAL_MS);
        console.log('');
    });
}

start();

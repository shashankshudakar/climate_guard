#!/usr/bin/env node
/**
 * Quick Start Guide for ClimateGuard ML Integration
 * Run: node ml_quickstart.js
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
};

function section(title) {
    console.log(`\n${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}  ${title}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${'═'.repeat(60)}${colors.reset}\n`);
}

function log(type, message) {
    const types = {
        success: `${colors.green}✓${colors.reset}`,
        error: `${colors.red}✗${colors.reset}`,
        info: `${colors.cyan}ℹ${colors.reset}`,
        warning: `${colors.yellow}⚠${colors.reset}`,
        step: `${colors.blue}→${colors.reset}`,
    };
    console.log(`  ${types[type] || '•'} ${message}`);
}

function checkPython() {
    section('Step 1: Check Python Installation');
    
    const result = spawnSync('python', ['--version'], { encoding: 'utf-8' });
    
    if (result.error || result.status !== 0) {
        log('error', 'Python not found');
        log('info', 'Download from: https://www.python.org/downloads/');
        log('warning', 'Make sure to check "Add Python to PATH" during installation');
        return false;
    }
    
    const version = result.stdout || result.stderr;
    log('success', `Python found: ${version.trim()}`);
    return true;
}

function checkMLFiles() {
    section('Step 2: Check ML Model Files');
    
    const mlDir = path.join(__dirname, '..', 'ml_model');
    const modelFile = path.join(mlDir, 'rainfall_model.pkl');
    const encoderFile = path.join(mlDir, 'label_encoder.pkl');
    const predictScript = path.join(mlDir, 'predict.py');
    const requirementsFile = path.join(mlDir, 'requirements.txt');
    
    const checks = [
        { file: modelFile, name: 'Trained model' },
        { file: encoderFile, name: 'Label encoder' },
        { file: predictScript, name: 'Predict script' },
        { file: requirementsFile, name: 'Requirements file' },
    ];
    
    let allOk = true;
    for (const check of checks) {
        if (fs.existsSync(check.file)) {
            log('success', `${check.name} exists`);
        } else {
            log('error', `${check.name} missing`);
            allOk = false;
        }
    }
    
    return allOk;
}

function installDependencies() {
    section('Step 3: Install ML Dependencies');
    
    log('step', 'Installing pandas, scikit-learn, numpy...');
    
    const result = spawnSync('pip', ['install', '-q', 'pandas', 'scikit-learn', 'numpy'], {
        encoding: 'utf-8',
    });
    
    if (result.error || result.status !== 0) {
        log('error', 'Failed to install dependencies');
        return false;
    }
    
    log('success', 'Dependencies installed');
    return true;
}

function trainModel() {
    section('Step 4: Train ML Model');
    
    const mlDir = path.join(__dirname, '..', 'ml_model');
    const modelFile = path.join(mlDir, 'rainfall_model.pkl');
    
    if (fs.existsSync(modelFile)) {
        log('success', 'Model already trained');
        return true;
    }
    
    log('step', 'Training RandomForest model (this may take a minute)...');
    
    const result = spawnSync('python', [path.join(mlDir, 'train_model.py')], {
        cwd: mlDir,
        encoding: 'utf-8',
        stdio: 'pipe',
    });
    
    if (result.error || result.status !== 0) {
        log('error', `Training failed: ${result.stderr || result.error.message}`);
        return false;
    }
    
    log('success', 'Model trained successfully');
    return true;
}

function testPrediction() {
    section('Step 5: Test Prediction');
    
    const mlDir = path.join(__dirname, '..', 'ml_model');
    const predictScript = path.join(mlDir, 'predict.py');
    
    log('step', 'Testing prediction with sample data...');
    
    const result = spawnSync('python', [predictScript, '28.5', '85', '7'], {
        encoding: 'utf-8',
    });
    
    if (result.error || result.status !== 0) {
        log('error', `Prediction test failed: ${result.stderr || result.error.message}`);
        return false;
    }
    
    try {
        const data = JSON.parse(result.stdout);
        log('success', `Prediction successful: Level = ${data.level}, Confidence = ${data.confidence}%`);
        return true;
    } catch (e) {
        log('error', `Failed to parse prediction: ${e.message}`);
        return false;
    }
}

function summary(results) {
    section('Setup Summary');
    
    const steps = [
        { name: 'Python Installation', pass: results.python },
        { name: 'ML Model Files', pass: results.mlFiles },
        { name: 'Dependencies', pass: results.dependencies },
        { name: 'Model Training', pass: results.training },
        { name: 'Prediction Test', pass: results.prediction },
    ];
    
    let passed = 0;
    for (const step of steps) {
        if (step.pass) {
            log('success', step.name);
            passed++;
        } else {
            log('error', step.name);
        }
    }
    
    console.log('');
    
    if (passed === steps.length) {
        log('success', `All setup steps completed (${passed}/${steps.length})`);
        
        section('Next Steps');
        log('step', 'Start the backend server:');
        console.log(`    ${colors.cyan}cd backend && npm start${colors.reset}`);
        console.log('');
        log('step', 'Test the API in another terminal:');
        console.log(`    ${colors.cyan}node test_ml_integration.js${colors.reset}`);
        console.log('');
        log('step', 'View documentation:');
        console.log(`    ${colors.cyan}See ML_INTEGRATION_GUIDE.md${colors.reset}`);
        console.log('');
        
        return true;
    } else {
        log('warning', `Setup incomplete (${passed}/${steps.length} passed)`);
        
        section('Troubleshooting');
        
        if (!results.python) {
            log('step', 'Python not found:');
            console.log('    1. Download from https://www.python.org/downloads/');
            console.log('    2. Run installer with "Add Python to PATH" checked');
            console.log('    3. Restart your terminal\n');
        }
        
        if (!results.dependencies) {
            log('step', 'Dependencies installation failed:');
            console.log('    Try: pip install --upgrade pip');
            console.log('    Then: pip install pandas scikit-learn numpy\n');
        }
        
        if (!results.training) {
            log('step', 'Model training failed:');
            console.log('    Run: python ml_model/train_model.py');
            console.log('    Check for error messages\n');
        }
        
        return false;
    }
}

function main() {
    console.clear();
    console.log(`${colors.bright}${colors.cyan}`);
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║                                                            ║');
    console.log('║         🌧️  ClimateGuard ML Integration Setup 🌿           ║');
    console.log('║                                                            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`${colors.reset}\n`);
    
    const results = {
        python: checkPython(),
        mlFiles: checkMLFiles(),
        dependencies: true,
        training: true,
        prediction: true,
    };
    
    if (!results.python) {
        summary(results);
        process.exit(1);
    }
    
    if (results.dependencies) {
        results.dependencies = installDependencies();
    }
    
    if (results.dependencies && results.mlFiles) {
        results.training = trainModel();
    }
    
    if (results.training) {
        results.prediction = testPrediction();
    }
    
    const success = summary(results);
    process.exit(success ? 0 : 1);
}

main();

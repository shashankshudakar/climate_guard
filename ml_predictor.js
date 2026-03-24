/**
 * ml_predictor.js - ML Prediction Handler for ClimateGuard Frontend
 * Handles rainfall predictions from Python ML model and UI updates
 */

import api from './api.js';

const MLPredictor = {
    // Cache for predictions
    predictions: {},
    
    /**
     * Make a rainfall prediction request to the backend
     * @param {number} temperature - Temperature in °C
     * @param {number} humidity - Humidity in %
     * @param {number} month - Month (1-12)
     * @returns {Promise<object>} Prediction result with level, confidence, and probabilities
     */
    async predict(temperature, humidity, month) {
        try {
            // Validate inputs
            if (temperature == null || humidity == null || month == null) {
                throw new Error('Temperature, humidity, and month are required');
            }
            
            if (temperature < 0 || temperature > 50) {
                throw new Error('Temperature must be between 0 and 50°C');
            }
            
            if (humidity < 0 || humidity > 100) {
                throw new Error('Humidity must be between 0 and 100%');
            }
            
            if (month < 1 || month > 12) {
                throw new Error('Month must be between 1 and 12');
            }
            
            // Call API
            const result = await api.predictRainfall(temperature, humidity, month);
            
            // Cache the result
            const cacheKey = `${temperature}_${humidity}_${month}`;
            this.predictions[cacheKey] = result;
            
            return result;
        } catch (error) {
            console.error('ML Prediction Error:', error);
            throw error;
        }
    },
    
    /**
     * Get cached prediction or make a new one
     * @param {number} temperature
     * @param {number} humidity
     * @param {number} month
     * @returns {Promise<object>}
     */
    async getOrPredict(temperature, humidity, month) {
        const cacheKey = `${temperature}_${humidity}_${month}`;
        
        if (this.predictions[cacheKey]) {
            return this.predictions[cacheKey];
        }
        
        return this.predict(temperature, humidity, month);
    },
    
    /**
     * Get prediction for multiple scenarios and return the average
     * @param {array} scenarios - Array of {temperature, humidity, month} objects
     * @returns {Promise<object>} Average prediction result
     */
    async predictMultiple(scenarios) {
        try {
            const results = await Promise.all(
                scenarios.map(s => this.predict(s.temperature, s.humidity, s.month))
            );
            
            // Calculate average confidence
            const avgConfidence = (results.reduce((sum, r) => sum + r.confidence, 0) / results.length).toFixed(1);
            
            // Count prediction counts
            const predictions = {};
            results.forEach(r => {
                predictions[r.prediction] = (predictions[r.prediction] || 0) + 1;
            });
            
            // Get most common prediction
            const mostCommon = Object.keys(predictions).reduce((a, b) =>
                predictions[a] > predictions[b] ? a : b
            );
            
            return {
                status: 'success',
                prediction: mostCommon,
                confidence: parseFloat(avgConfidence),
                allPredictions: results,
                scenarioCount: scenarios.length,
                predictionCounts: predictions
            };
        } catch (error) {
            console.error('Multiple prediction error:', error);
            throw error;
        }
    },
    
    /**
     * Get the emoji icon for a rainfall level
     * @param {string} level - Rainfall level (Low/Medium/Heavy)
     * @returns {string}
     */
    getIcon(level) {
        const icons = {
            'Low': '☀️',
            'Medium': '🌤️',
            'Heavy': '⛈️'
        };
        return icons[level] || '🌧️';
    },
    
    /**
     * Get color class for a rainfall level
     * @param {string} level
     * @returns {string} Bootstrap color class
     */
    getColor(level) {
        const colors = {
            'Low': 'warning',
            'Medium': 'info',
            'Heavy': 'danger'
        };
        return colors[level] || 'secondary';
    },
    
    /**
     * Get description for a rainfall level
     * @param {string} level
     * @returns {string}
     */
    getDescription(level) {
        const descriptions = {
            'Low': 'Dry conditions - Consider irrigation',
            'Medium': 'Moderate rainfall - Normal farming',
            'Heavy': 'Heavy rainfall - Be prepared for flooding'
        };
        return descriptions[level] || 'Unknown condition';
    },
    
    /**
     * Update the UI with prediction results
     * @param {object} result - Prediction result from API
     * @param {string} containerId - HTML element ID to update
     */
    displayResult(result, containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.warn(`Container ${containerId} not found`);
            return;
        }
        
        const icon = this.getIcon(result.prediction);
        const color = this.getColor(result.prediction);
        const desc = this.getDescription(result.prediction);
        
        const confidenceAdjective = result.confidence >= 80 ? 'Very High' :
                                   result.confidence >= 60 ? 'High' :
                                   result.confidence >= 40 ? 'Moderate' : 'Low';
        
        const html = `
            <div class="alert alert-${color} border-0" style="border-radius: 12px;">
                <div class="row align-items-center">
                    <div class="col-md-2 text-center">
                        <div style="font-size: 3rem;">${icon}</div>
                    </div>
                    <div class="col-md-5">
                        <h5 class="fw-bold mb-1">
                            ${result.prediction} Rainfall
                        </h5>
                        <p class="mb-1 text-muted">${desc}</p>
                        <small class="text-muted">
                            Temperature: ${result.input.temperature}°C | 
                            Humidity: ${result.input.humidity}% | 
                            Month: ${result.input.month_name}
                        </small>
                    </div>
                    <div class="col-md-5">
                        <div class="text-center">
                            <p class="mb-1"><strong>Confidence</strong></p>
                            <div class="progress mb-2" style="height: 25px; border-radius: 8px;">
                                <div class="progress-bar bg-${color}" 
                                     style="width: ${result.confidence}%; font-weight: bold;">
                                    ${result.confidence}%
                                </div>
                            </div>
                            <small class="text-muted">${confidenceAdjective}</small>
                        </div>
                    </div>
                </div>
                <div class="mt-3">
                    <h6 class="fw-bold">Probability Distribution:</h6>
                    <div class="row g-2">
                        ${Object.entries(result.probabilities).map(([level, prob]) => `
                            <div class="col-md-4 col-6">
                                <div class="card border-0 text-center p-2" 
                                     style="background: rgba(0,0,0,0.05); border-radius: 8px;">
                                    <strong>${level}</strong>
                                    <p class="mb-0">${prob}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    /**
     * Create a mini prediction card for quick reference
     * @param {object} result
     * @returns {string} HTML
     */
    createMiniCard(result) {
        const icon = this.getIcon(result.prediction);
        const color = this.getColor(result.prediction);
        
        return `
            <div class="card border-0 shadow-sm" style="border-radius: 12px; background: linear-gradient(135deg, #f5f5f5, #ffffff);">
                <div class="card-body text-center p-3">
                    <div style="font-size: 2.5rem; margin-bottom: 10px;">${icon}</div>
                    <h6 class="fw-bold text-${color} mb-2">${result.prediction}</h6>
                    <div class="progress mb-2" style="height: 20px; border-radius: 6px;">
                        <div class="progress-bar bg-${color}" style="width: ${result.confidence}%;"></div>
                    </div>
                    <small class="text-muted d-block">${result.confidence}% confident</small>
                </div>
            </div>
        `;
    },
    
    /**
     * Check ML model status
     * @returns {Promise<object>}
     */
    async checkStatus() {
        try {
            const response = await fetch('http://localhost:5000/api/ml/status');
            return await response.json();
        } catch (error) {
            console.error('ML status check failed:', error);
            return { status: 'error', ready: false, error: error.message };
        }
    }
};

window.MLPredictor = MLPredictor;
export default MLPredictor;

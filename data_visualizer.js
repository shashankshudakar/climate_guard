/**
 * data_visualizer.js - Data Visualization Module for ClimateGuard
 * Handles chart creation with Chart.js and dataset visualization
 */

const DataVisualizer = {
    // Store chart instances for cleanup
    charts: {},
    
    /**
     * Create a rainfall distribution chart
     * @param {string} canvasId - Canvas element ID
     * @param {array} data - Array of rainfall values
     * @param {string} title - Chart title
     */
    createRainfallChart(canvasId, data, title = 'Rainfall Distribution') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            console.warn(`Canvas ${canvasId} not found`);
            return;
        }
        
        // Cleanup old chart
        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }
        
        const ctx = canvas.getContext('2d');
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map((_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Rainfall (mm)',
                    data: data,
                    backgroundColor: [
                        '#ffd89b',
                        '#ffc469',
                        '#ffb84d',
                        '#ffad33',
                        '#ff9e1b',
                        '#ff8f00',
                        '#ff7f00'
                    ].slice(0, data.length),
                    borderRadius: 8,
                    borderSkipped: false,
                    padding: 5
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: title,
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Rainfall (mm)' }
                    }
                }
            }
        });
    },
    
    /**
     * Create a temperature trend line chart
     * @param {string} canvasId
     * @param {array} temperatures
     * @param {string} title
     */
    createTemperatureChart(canvasId, temperatures, title = 'Temperature Trend') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        
        const ctx = canvas.getContext('2d');
        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: temperatures.map((_, i) => `Day ${i + 1}`),
                datasets: [{
                    label: 'Temperature (°C)',
                    data: temperatures,
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 6,
                    pointBackgroundColor: '#ff6b6b',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { display: true, text: title, font: { size: 14, weight: 'bold' } }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        title: { display: true, text: 'Temperature (°C)' }
                    }
                }
            }
        });
    },
    
    /**
     * Create a humidity and temperature doughnut chart
     * @param {string} canvasId
     * @param {number} humidity - 0-100
     * @param {number} temperature - In °C
     */
    createConditionChart(canvasId, humidity, temperature) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        
        const ctx = canvas.getContext('2d');
        
        // Categorize temperature
        const tempColor = temperature < 20 ? '#3498db' :
                         temperature < 30 ? '#2ecc71' :
                         temperature < 35 ? '#f39c12' : '#e74c3c';
        
        const tempLabel = temperature < 20 ? 'Cold' :
                         temperature < 30 ? 'Moderate' :
                         temperature < 35 ? 'Warm' : 'Hot';
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Humidity', 'Dry Air'],
                datasets: [{
                    data: [humidity, 100 - humidity],
                    backgroundColor: ['#3498db', '#ecf0f1'],
                    borderColor: '#fff',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'bottom' },
                    title: { 
                        display: true, 
                        text: `Humidity: ${humidity}% | Temp: ${temperature}°C (${tempLabel})`,
                        font: { size: 13, weight: 'bold' }
                    }
                }
            }
        });
    },
    
    /**
     * Create a soil composition radar chart
     * @param {string} canvasId
     * @param {object} soilData - {nitrogen, phosphorus, potassium, organic_matter, ph}
     */
    createSoilChart(canvasId, soilData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        
        const ctx = canvas.getContext('2d');
        this.charts[canvasId] = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['Nitrogen', 'Phosphorus', 'Potassium', 'Organic Matter', 'pH'],
                datasets: [{
                    label: 'Soil Nutrients',
                    data: [
                        soilData.nitrogen || 50,
                        soilData.phosphorus || 40,
                        soilData.potassium || 60,
                        soilData.organic_matter || 45,
                        soilData.ph ? soilData.ph * 10 : 70
                    ],
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.2)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointBackgroundColor: '#27ae60',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'bottom' },
                    title: { 
                        display: true,
                        text: 'Soil Health Analysis',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { stepSize: 20 }
                    }
                }
            }
        });
    },
    
    /**
     * Create a crop yield comparison bar chart
     * @param {string} canvasId
     * @param {object} crops - {cropName: yield}
     */
    createCropYieldChart(canvasId, crops) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        
        const ctx = canvas.getContext('2d');
        const cropNames = Object.keys(crops);
        const yields = Object.values(crops);
        
        // Generate colors
        const colors = [
            '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6',
            '#1abc9c', '#e67e22', '#34495e', '#16a085', '#c0392b'
        ];
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: cropNames,
                datasets: [{
                    label: 'Expected Yield (kg/hectare)',
                    data: yields,
                    backgroundColor: colors.slice(0, cropNames.length),
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { 
                        display: true,
                        text: 'Expected Crop Yields',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: 'Yield (kg)' }
                    }
                }
            }
        });
    },
    
    /**
     * Create a rainfall month distribution pie chart
     * @param {string} canvasId
     * @param {array} monthlyData - Array of 12 values for each month
     */
    createMonthlyRainfallChart(canvasId, monthlyData) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        if (this.charts[canvasId]) this.charts[canvasId].destroy();
        
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const ctx = canvas.getContext('2d');
        
        // Create gradient colors
        const colors = monthlyData.map(val => {
            if (val < 50) return '#ffd89b';     // Light yellow - low rainfall
            if (val < 100) return '#ffb347';    // Orange - moderate rainfall
            if (val < 150) return '#ff8c00';    // Dark orange - high rainfall
            return '#d9534f';                   // Red - very high rainfall
        });
        
        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Monthly Rainfall (mm)',
                    data: monthlyData,
                    backgroundColor: colors,
                    borderRadius: 6,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: { 
                        display: true,
                        text: 'Annual Rainfall Pattern',
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Rainfall (mm)' }
                    }
                }
            }
        });
    },
    
    /**
     * Create a simple forecast timeline
     * @param {string} containerId
     * @param {array} forecastData - Array of forecast objects
     */
    createForecastTimeline(containerId, forecastData) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const timelineHtml = `
            <div class="forecast-timeline">
                ${forecastData.map((item, index) => `
                    <div class="forecast-item">
                        <div class="forecast-icon" style="font-size: 2rem;">
                            ${this.getWeatherIcon(item.condition)}
                        </div>
                        <div class="forecast-content">
                            <h6 class="fw-bold mb-1">Day ${index + 1} - ${item.date || ''}</h6>
                            <p class="mb-1">
                                <strong>${item.condition}</strong>
                            </p>
                            <small class="text-muted">
                                ${item.tempHigh}°C / ${item.tempLow}°C
                                <br>
                                💧 ${item.humidity}% | 💨 ${item.wind} km/h
                            </small>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        container.innerHTML = timelineHtml;
        this.addTimelineStyles();
    },
    
    /**
     * Get weather icon for condition
     * @param {string} condition
     * @returns {string}
     */
    getWeatherIcon(condition) {
        const icons = {
            'sunny': '☀️',
            'cloudy': '☁️',
            'rainy': '🌧️',
            'stormy': '⛈️',
            'clear': '🌙',
            'snow': '❄️',
            'foggy': '🌫️',
            'windy': '💨'
        };
        
        const lower = condition.toLowerCase();
        for (const [key, icon] of Object.entries(icons)) {
            if (lower.includes(key)) return icon;
        }
        return '🌤️';
    },
    
    /**
     * Add CSS styles for timeline
     */
    addTimelineStyles() {
        if (document.getElementById('timelineStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'timelineStyles';
        style.innerHTML = `
            .forecast-timeline {
                display: flex;
                gap: 15px;
                overflow-x: auto;
                padding: 10px 0;
            }
            
            .forecast-item {
                flex: 0 0 150px;
                padding: 15px;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                border: 1px solid rgba(255,255,255,0.5);
            }
            
            .forecast-icon {
                margin-bottom: 10px;
            }
            
            .forecast-content h6 {
                color: #2c3e50;
                margin-bottom: 8px;
            }
            
            .forecast-content p {
                color: #34495e;
                font-size: 0.9rem;
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Cleanup all charts
     */
    cleanup() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.destroy();
        });
        this.charts = {};
    }
};

window.DataVisualizer = DataVisualizer;
export default DataVisualizer;

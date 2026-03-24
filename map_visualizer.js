/**
 * map_visualizer.js - Map and Geographical Data Visualization
 * Handles map creation and district-based data visualization
 */

const MapVisualizer = {
    // Store map instances
    maps: {},
    
    /**
     * Create a simple SVG-based district map
     * @param {string} containerId
     * @param {object} districtData - {districtName: {value, color, data}}
     * @param {string} title
     */
    createDistrictHeatmap(containerId, districtData, title = 'District Rainfall Distribution') {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const districts = Object.entries(districtData);
        const maxValue = Math.max(...districts.map(d => d[1].value || 0));
        
        const html = `
            <div class="district-heatmap">
                <h5 class="fw-bold mb-3">${title}</h5>
                <div class="row g-2">
                    ${districts.map(([name, data]) => {
                        const percentage = (data.value / maxValue) * 100;
                        const intensity = Math.min(percentage / 100, 1);
                        const color = this.getHeatmapColor(intensity);
                        
                        return `
                            <div class="col-md-3 col-6">
                                <div class="district-card" style="
                                    background: ${color};
                                    border-radius: 12px;
                                    padding: 15px;
                                    text-align: center;
                                    cursor: pointer;
                                    transition: transform 0.2s, box-shadow 0.2s;
                                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                                "
                                onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.2)';"
                                onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                                    <h6 class="fw-bold text-dark mb-2">${name}</h6>
                                    <p class="mb-1" style="font-size: 1.5rem; font-weight: bold;">
                                        ${data.value || 0}
                                    </p>
                                    <small class="text-muted">${data.unit || ''}</small>
                                    ${data.description ? `<p class="mt-2 small text-muted">${data.description}</p>` : ''}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    },
    
    /**
     * Get color for heatmap intensity (0-1)
     * @param {number} intensity - 0 to 1
     * @returns {string} RGB color
     */
    getHeatmapColor(intensity) {
        // Yellow (low) -> Orange (medium) -> Red (high)
        if (intensity < 0.33) {
            // Yellow range
            return `rgb(255, ${Math.round(200 - intensity * 300)}, 0)`;
        } else if (intensity < 0.66) {
            // Orange range
            return `rgb(255, ${Math.round(200 - (intensity - 0.33) * 300)}, 0)`;
        } else {
            // Red range
            return `rgb(255, ${Math.round(200 - (intensity - 0.66) * 300)}, ${Math.round((intensity - 0.66) * 150)})`;
        }
    },
    
    /**
     * Create a simple geographical comparison chart
     * @param {string} canvasId
     * @param {object} districtData - {name: value}
     * @param {string} metric
     */
    createDistrictComparisonChart(canvasId, districtData, metric = 'Rainfall (mm)') {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const names = Object.keys(districtData);
        const values = Object.values(districtData);
        
        // Cleanup old chart
        if (this.maps[canvasId]) {
            this.maps[canvasId].destroy();
        }
        
        const ctx = canvas.getContext('2d');
        
        // Generate colors based on region (North, South, East, West, Central)
        const regionColors = {
            'North': '#3498db',
            'South': '#e74c3c',
            'East': '#f39c12',
            'West': '#2ecc71',
            'Central': '#9b59b6'
        };
        
        const colors = names.map((name, index) => {
            const hueIndex = Math.floor((index / names.length) * 360);
            return `hsl(${hueIndex}, 70%, 60%)`;
        });
        
        this.maps[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: names,
                datasets: [{
                    label: metric,
                    data: values,
                    backgroundColor: colors,
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: true, position: 'top' },
                    title: {
                        display: true,
                        text: `District Comparison - ${metric}`,
                        font: { size: 14, weight: 'bold' }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        title: { display: true, text: metric }
                    }
                }
            }
        });
    },
    
    /**
     * Create an interactive district selector with stats
     * @param {string} containerId
     * @param {object} districtStats - {districtName: {rainfall, temp, humidity, crops}}
     */
    createDistrictSelector(containerId, districtStats) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const districtOptions = Object.entries(districtStats).map(([name, stats]) => `
            <option value="${name}">${name}</option>
        `).join('');
        
        const html = `
            <div class="district-selector">
                <label class="form-label fw-bold" data-i18n="select-district">Select District:</label>
                <select id="districtSelect" class="form-select mb-3">
                    <option value="">-- View All Districts --</option>
                    ${districtOptions}
                </select>
                <div id="districtStats" class="row g-3">
                    <!-- Stats populated by JavaScript -->
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        
        const selectEl = document.getElementById('districtSelect');
        selectEl.addEventListener('change', (e) => {
            const district = e.target.value;
            this.updateDistrictStats(districtStats, district);
        });
    },
    
    /**
     * Update district stats display
     * @param {object} districtStats
     * @param {string} selectedDistrict
     */
    updateDistrictStats(districtStats, selectedDistrict) {
        const statsContainer = document.getElementById('districtStats');
        if (!statsContainer) return;
        
        let display = [];
        
        if (!selectedDistrict) {
            // Show summary of all districts
            const avgRainfall = Object.values(districtStats).reduce((sum, s) => sum + (s.rainfall || 0), 0) / Object.keys(districtStats).length;
            const avgTemp = Object.values(districtStats).reduce((sum, s) => sum + (s.temp || 0), 0) / Object.keys(districtStats).length;
            
            display = [
                { title: 'Total Districts', icon: '🗺️', value: Object.keys(districtStats).length, unit: '' },
                { title: 'Avg Rainfall', icon: '🌧️', value: avgRainfall.toFixed(1), unit: 'mm' },
                { title: 'Avg Temperature', icon: '🌡️', value: avgTemp.toFixed(1), unit: '°C' }
            ];
        } else {
            const stats = districtStats[selectedDistrict];
            display = [
                { title: selectedDistrict, icon: '📍', value: '', unit: '' },
                { title: 'Rainfall', icon: '🌧️', value: stats.rainfall || 0, unit: 'mm' },
                { title: 'Temperature', icon: '🌡️', value: stats.temp || 0, unit: '°C' },
                { title: 'Humidity', icon: '💧', value: stats.humidity || 0, unit: '%' }
            ];
            
            if (stats.crops && stats.crops.length > 0) {
                display.push({
                    title: 'Recommended Crops',
                    icon: '🌾',
                    value: stats.crops.join(', '),
                    unit: ''
                });
            }
        }
        
        statsContainer.innerHTML = display.map(stat => `
            <div class="col-md-6 col-12">
                <div class="card border-0 shadow-sm" style="border-radius: 12px; background: linear-gradient(135deg, #f5f5f5, #ffffff);">
                    <div class="card-body">
                        <div class="d-flex align-items-center gap-3">
                            <div style="font-size: 2rem;">${stat.icon}</div>
                            <div class="flex-grow-1">
                                <h6 class="fw-bold mb-1">${stat.title}</h6>
                                <p class="mb-0">
                                    <strong style="font-size: 1.2rem;">${stat.value}</strong>
                                    <span class="text-muted ms-1">${stat.unit}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },
    
    /**
     * Create a rainfall intensity map (color-coded by intensity)
     * @param {string} containerId
     * @param {array} districtsByIntensity - [{name, intensity: 0-1}, ...]
     */
    createIntensityMap(containerId, districtsByIntensity) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const html = `
            <div class="intensity-map">
                <h5 class="fw-bold mb-3">Rainfall Intensity Map</h5>
                <div class="map-grid">
                    ${districtsByIntensity.map(district => {
                        const color = this.getHeatmapColor(district.intensity);
                        const intensityLabel = district.intensity > 0.66 ? 'High' :
                                             district.intensity > 0.33 ? 'Medium' : 'Low';
                        
                        return `
                            <div class="map-cell" style="
                                background: ${color};
                                border-radius: 8px;
                                padding: 12px;
                                text-align: center;
                                color: white;
                                text-shadow: 0 1px 3px rgba(0,0,0,0.3);
                                font-weight: bold;
                                min-height: 60px;
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                            ">
                                <div style="font-size: 0.9rem; opacity: 0.9;">${district.name}</div>
                                <div style="font-size: 1.1rem; margin-top: 5px;">${intensityLabel}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        this.addMapGridStyles();
    },
    
    /**
     * Add CSS styles for map grid
     */
    addMapGridStyles() {
        if (document.getElementById('mapGridStyles')) return;
        
        const style = document.createElement('style');
        style.id = 'mapGridStyles';
        style.innerHTML = `
            .map-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: 10px;
                padding: 10px 0;
            }
            
            .map-cell {
                transition: transform 0.2s, box-shadow 0.2s;
                cursor: pointer;
            }
            
            .map-cell:hover {
                transform: scale(1.05);
                box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            }
            
            @media (max-width: 768px) {
                .map-grid {
                    grid-template-columns: repeat(auto-fit, minmax(60px, 1fr));
                }
            }
        `;
        
        document.head.appendChild(style);
    },
    
    /**
     * Cleanup all maps
     */
    cleanup() {
        Object.values(this.maps).forEach(map => {
            if (map && typeof map.destroy === 'function') {
                map.destroy();
            }
        });
        this.maps = {};
    }
};

window.MapVisualizer = MapVisualizer;
export default MapVisualizer;

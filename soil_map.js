/**
 * js/soil_map.js
 * Interactive Karnataka Soil Map using Leaflet.js and GeoJSON
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Config
    const soilColors = {
        "red": "#d32f2f",
        "black": "#212121",
        "alluvial": "#1976d2",
        "laterite": "#795548",
        "loam": "#388e3c",
        "clay-loam": "#5d4037",
        "silty-loam": "#8d6e63",
        "saline-soil": "#78909c",
        "default": "#e0e0e0"
    };

    const districtNamingBridge = {
        "Bagalkot": "Bagalkote",
        "Gulbarga": "Kalaburagi",
        "Chikmagalur": "Chikmagalur",
        "Chikkamagaluru": "Chikmagalur",
        "Shimoga": "Shimoga",
        "Shivamogga": "Shimoga",
        "Mysore": "Mysuru",
        "Bangalore Rural": "Bengaluru Rural",
        "Bangalore Urban": "Bengaluru Urban",
        "Bengaluru": "Bengaluru Urban",
        "Belgaum": "Belagavi",
        "Bijapur": "Vijayapura",
        "Chickmagalur": "Chikmagalur",
        "Chamrajnagar": "Chamarajanagar",
        "Chamarajpete": "Chamarajanagar", // Approximate
        "Bellary": "Ballari",
        "Yadagiri": "Yadgir",
        "Dakshin Kannada": "Dakshina Kannada",
        "Dakshin Kannad": "Dakshina Kannada",
        "Uttar Kannada": "Uttara Kannada",
        "Uttar Kannand": "Uttara Kannada",
        "Tumkur": "Tumakuru",
        "Bangalore": "Bengaluru Urban",
        "Haveri": "Haveri",
        "Gadag": "Gadag"
        // Most other names in the GeoJSON should match or be close enough for .includes()
    };

    // 2. Map Initialization
    const map = L.map('soilMap').setView([15.3173, 75.7139], 7); // Center of Karnataka

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let geoJsonLayer;
    let selectedSoilType = null;
    window.apiSoilData = null;

    // Load API Soil Data
    fetch('http://localhost:5000/api/soil-data')
        .then(res => res.json())
        .then(result => {
            if (result.data) {
                window.apiSoilData = {};
                result.data.forEach(row => {
                    // Normalize the soil type to match the soilColors keys (e.g. 'Silty-Loam' -> 'silty-loam')
                    if (row.district && row.soil_type) {
                        window.apiSoilData[row.district] = row.soil_type.toLowerCase();
                    }
                });
            }
        })
        .catch(err => console.error("Error loading soil data from API:", err));

    // 3. Styling Logic
    function normalizeDistrictKey(name) {
        return String(name || '')
            .toLowerCase()
            .replace(/district/g, '')
            .replace(/[.\-]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function resolveDistrictName(rawName) {
        const mappedName = districtNamingBridge[rawName] || rawName;
        if (typeof districtData === 'undefined') return mappedName;
        if (districtData[mappedName]) return mappedName;

        const mappedKey = normalizeDistrictKey(mappedName);
        const found = Object.keys(districtData).find((district) => {
            const districtKey = normalizeDistrictKey(district);
            return districtKey === mappedKey || districtKey.includes(mappedKey) || mappedKey.includes(districtKey);
        });
        return found || mappedName;
    }

    // New logic: Check API data first, fallback to static dataset_explorer.js data
    function getSoilForDistrict(rawName) {
        const resolvedDistrict = resolveDistrictName(rawName);

        // 1. Try API Data first
        if (window.apiSoilData && window.apiSoilData[resolvedDistrict]) {
            return window.apiSoilData[resolvedDistrict];
        }

        // 2. Fallback to static data
        if (typeof districtData === 'undefined') return null;
        return districtData[resolvedDistrict] ? districtData[resolvedDistrict].soil : null;
    }

    function style(feature) {
        const soil = getSoilForDistrict(feature.properties.NAME_2);
        const color = soilColors[soil] || soilColors.default;

        let opacity = 0.7;
        let weight = 1;

        if (selectedSoilType && soil === selectedSoilType) {
            opacity = 0.9;
            weight = 3;
        } else if (selectedSoilType && soil !== selectedSoilType) {
            opacity = 0.2;
        }

        return {
            fillColor: color,
            weight: weight,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: opacity
        };
    }

    // 4. Interaction Logic
    function highlightFeature(e) {
        const layer = e.target;
        layer.setStyle({
            weight: 3,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.9
        });
        layer.bringToFront();
    }

    function resetHighlight(e) {
        geoJsonLayer.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
        const soilType = getSoilForDistrict(feature.properties.NAME_2);
        const districtName = feature.properties.NAME_2;
        const resolvedDistrict = resolveDistrictName(districtName);

        const t = typeof window.i18n !== 'undefined' ? window.i18n.t.bind(window.i18n) : (k) => k;
        const soilKey = soilType ? `soil-${soilType}-title` : '';
        const soilLabelHtml = soilType ? `<span data-i18n="${soilKey}">${t(soilKey)}</span>` : 'TBD';

        layer.bindTooltip(`<strong><span data-i18n="${resolvedDistrict}">${t(resolvedDistrict)}</span></strong><br><span data-i18n="stat-soil">${t('stat-soil')}</span>: ${soilLabelHtml}`, {
            sticky: true,
            className: 'custom-tooltip'
        });

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: (e) => {
                if (typeof showDistrictInfo === 'function') {
                    showDistrictInfo(resolvedDistrict); // From dataset_explorer.js
                }
            }
        });
    }

    // 5. Load GeoJSON
    fetch('data/karnataka.geojson')
        .then(res => res.json())
        .then(data => {
            geoJsonLayer = L.geoJson(data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);

            // Populate Legend after data loads
            const legend = document.getElementById('mapLegend');
            if (legend) {
                let legendHtml = '';
                const sortedSoils = Object.keys(soilColors).filter(s => s !== 'default').sort();
                const t = typeof window.i18n !== 'undefined' ? window.i18n.t.bind(window.i18n) : (k) => k;
                sortedSoils.forEach(s => {
                    legendHtml += `
                        <div class="d-flex align-items-center mb-1 legend-item" style="cursor: pointer" onclick="highlightSoilOnMap('${s}')">
                            <i style="background: ${soilColors[s]}; width: 12px; height: 12px; display: inline-block; border-radius: 2px; margin-right: 8px;"></i>
                            <span data-i18n="soil-${s}-title">${t(`soil-${s}-title`)}</span>
                        </div>
                    `;
                });
                legend.innerHTML = legendHtml;
            }
        })
        .catch(err => console.error("Error loading GeoJSON Map:", err));

    // 6. External Triggers (from Soil Cards)
    window.highlightSoilOnMap = function (soilType) {
        selectedSoilType = (selectedSoilType === soilType) ? null : soilType;
        if (geoJsonLayer) {
            geoJsonLayer.eachLayer(layer => {
                geoJsonLayer.resetStyle(layer);
            });
        }
    };

    // Add listeners to soil cards
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const soilId = card.getAttribute('data-soil-id');
            window.highlightSoilOnMap(soilId);
        });
        card.addEventListener('mouseleave', () => {
            window.highlightSoilOnMap(null);
        });

        // Populate Modal on Click
        card.addEventListener('click', () => {
            const soilId = card.getAttribute('data-soil-id');
            const data = window.soilDataset[soilId];
            if (data) {
                const t = typeof window.i18n !== 'undefined' ? window.i18n.t.bind(window.i18n) : (k) => k;
                // Helper: try the exact key first, then capitalized variant
                const tr = (val) => {
                    if (!val) return '-';
                    let result = t(val);
                    if (result === val) result = t(val.charAt(0).toUpperCase() + val.slice(1));
                    if (result === val.charAt(0).toUpperCase() + val.slice(1)) result = t(val.toLowerCase());
                    if (result === val.toLowerCase()) return val;
                    return result;
                };
                document.getElementById('modalSoilTitle').textContent = tr(data.title);
                document.getElementById('modalSoilImg').src = data.img;
                document.getElementById('modalSoilDesc').textContent = tr(data.desc);
                document.getElementById('modalSoilPh').textContent = data.ph || '-';
                document.getElementById('modalSoilTexture').textContent = tr(data.texture);
                document.getElementById('modalSoilWater').textContent = tr(data.water);
                document.getElementById('modalSoilDrainage').textContent = tr(data.drainage || '-');
                document.getElementById('modalSoilOrganicCarbon').textContent = data.organic_carbon || '-';
                const regionsList = (data.top_regions || '-').split(',').map(r => tr(r.trim())).join(', ');
                document.getElementById('modalSoilRegions').textContent = regionsList;
                
                const cropsList = (data.best_crops || '-').split(',').map(c => {
                    const rawC = c.trim();
                    return tr(rawC);
                }).join(', ');
                document.getElementById('modalSoilCrops').textContent = cropsList;
                
                document.getElementById('modalSoilTip').textContent = tr(data.management_tip || 'No specific tip available.');

                const getColorClass = (val) => {
                    const v = val.toLowerCase();
                    if (v.includes('low') || v.includes('deficient') || v.includes('poor')) return 'text-danger fw-bold';
                    if (v.includes('moderate') || v.includes('medium')) return 'text-warning fw-bold';
                    return 'text-success fw-bold';
                };

                const elN = document.getElementById('modalSoilN');
                elN.textContent = tr(data.n);
                elN.className = getColorClass(data.n);

                const elP = document.getElementById('modalSoilP');
                elP.textContent = tr(data.p);
                elP.className = getColorClass(data.p);

                const elK = document.getElementById('modalSoilK');
                elK.textContent = tr(data.k);
                elK.className = getColorClass(data.k);
            }
        });
    });
});

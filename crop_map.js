/**
 * js/crop_map.js
 * Interactive Karnataka Crop Map using Leaflet.js and GeoJSON
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core Config - Vibrant Crop Palette
    const cropColors = {
        "rice": "#2e7d32",        // Dark Green
        "maize": "#fbc02d",       // Mustard Yellow
        "coffee": "#4e342e",      // Brown
        "sugarcane": "#afb42b",   // Lime/Yellow-Green
        "cotton": "#546e7a",      // Blue Grey
        "coconut": "#ef6c00",     // Orange
        "ginger": "#d84315",      // Deep Orange
        "tea": "#1b5e20",         // Forest Green
        "cocoa": "#3e2723",       // Dark Brown
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
        "Chamarajpete": "Chamarajanagar",
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
    };

    // 2. Map Initialization
    const map = L.map('cropMap').setView([15.3173, 75.7139], 7);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    let geoJsonLayer;
    let selectedCropType = null;

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

    function getCropsForDistrict(rawName) {
        if (typeof districtData === 'undefined') return [];
        const resolvedDistrict = resolveDistrictName(rawName);
        return districtData[resolvedDistrict] ? districtData[resolvedDistrict].crops : [];
    }

    function style(feature) {
        const crops = getCropsForDistrict(feature.properties.NAME_2);
        const leadCrop = crops.length > 0 ? crops[0].toLowerCase() : null;
        const color = cropColors[leadCrop] || cropColors.default;

        let opacity = 0.7;
        let weight = 1;

        // If a specific crop is highlighted from a card
        if (selectedCropType) {
            const hasCrop = crops.some(c => c.toLowerCase().includes(selectedCropType.toLowerCase()));
            if (hasCrop) {
                opacity = 0.9;
                weight = 3;
            } else {
                opacity = 0.1;
            }
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
        const crops = getCropsForDistrict(feature.properties.NAME_2);
        const districtName = feature.properties.NAME_2;
        const resolvedDistrict = resolveDistrictName(districtName);

        const cropList = crops.length > 0 ? crops.join(", ") : "Diverse Crops";

        layer.bindTooltip(`<strong>${resolvedDistrict}</strong><br>Lead Crops: ${cropList}`, {
            sticky: true,
            className: 'custom-tooltip'
        });

        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: (e) => {
                if (typeof showDistrictInfo === 'function') {
                    showDistrictInfo(resolvedDistrict);
                }
            }
        });
    }

    // 5. Load GeoJSON & Populate Legend
    fetch('data/karnataka.geojson')
        .then(res => res.json())
        .then(data => {
            geoJsonLayer = L.geoJson(data, {
                style: style,
                onEachFeature: onEachFeature
            }).addTo(map);

            // Populate Legend
            const legend = document.getElementById('cropLegend');
            if (legend) {
                let legendHtml = '';
                const sortedCrops = Object.keys(cropColors).filter(c => c !== 'default').sort();
                sortedCrops.forEach(c => {
                    const label = c.charAt(0).toUpperCase() + c.slice(1);
                    legendHtml += `
                        <div class="d-flex align-items-center mb-1 legend-item" style="cursor: pointer" onclick="highlightCropOnMap('${c}')">
                            <i style="background: ${cropColors[c]}; width: 12px; height: 12px; display: inline-block; border-radius: 2px; margin-right: 8px;"></i>
                            <span>${label}</span>
                        </div>
                    `;
                });
                legend.innerHTML = legendHtml;
            }
        })
        .catch(err => console.error("Error loading GeoJSON Map:", err));

    // 6. External Triggers (Cards)
    window.highlightCropOnMap = function (cropId) {
        selectedCropType = (selectedCropType === cropId) ? null : cropId;
        if (geoJsonLayer) {
            geoJsonLayer.eachLayer(layer => {
                geoJsonLayer.resetStyle(layer);
            });
        }
    };

    // Add listeners to crop cards
    document.querySelectorAll('.clickable-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            const cropId = card.getAttribute('data-crop-id');
            window.highlightCropOnMap(cropId);
        });
        card.addEventListener('mouseleave', () => {
            window.highlightCropOnMap(null);
        });

        // Handle Modal Population on Click
        card.addEventListener('click', () => {
            const cropId = card.getAttribute('data-crop-id');
            const data = window.cropDataset[cropId];
            if (data) {
                document.getElementById('modalCropTitle').textContent = data.title;
                document.getElementById('modalCropImg').src = data.img;
                document.getElementById('modalCropDesc').textContent = data.desc;
                document.getElementById('modalCropTemp').textContent = data.temp;
                document.getElementById('modalCropWater').textContent = data.water;
                document.getElementById('modalCropYield').textContent = data.yield;
                document.getElementById('modalCropSowingWindow').textContent = data.sowing_window || '-';
                document.getElementById('modalCropMaturity').textContent = data.maturity || '-';

                const elPests = document.getElementById('modalCropPests');
                if (elPests) {
                    elPests.textContent = data.pests;
                    elPests.className = 'text-danger fw-bold';
                }

                const elDisease = document.getElementById('modalCropDisease');
                if (elDisease) {
                    elDisease.textContent = data.disease;
                    elDisease.className = 'text-warning text-dark fw-bold';
                }
            }
        });
    });
});

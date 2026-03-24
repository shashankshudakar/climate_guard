/* 
 * Cold Storage Finder Logic
 * ClamiteGuard - Premium Agricultural Ecosystem
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Leaflet Map centered on Karnataka
    const karnatakaCenter = [15.3173, 75.7139];
    const map = L.map('map').setView(karnatakaCenter, 7);

    // 2. Add OpenStreetMap Tiles (100% Free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    let allFacilities = [];
    let marketPrices = [];
    let dateRef = '';
    let markersLayer = L.layerGroup().addTo(map);

    // ─── Data Fetching ───────────────────────────────────────────────────

    async function fetchMarketData() {
        try {
            const response = await fetch('http://localhost:5000/api/market-prices');
            const result = await response.json();
            marketPrices = result.data || [];
        } catch (error) {
            console.error('Failed to fetch market prices:', error);
        }
    }
    async function fetchWarehouses() {
        try {
            const response = await fetch('http://localhost:5000/api/warehouses');
            const result = await response.json();
            if (result.status === 'success') {
                allFacilities = result.data;
                dateRef = result.date_ref || '';
                renderFacilities(allFacilities);
            }
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    }

    // Call both
    fetchMarketData();
    fetchWarehouses();

    // 4. Render Facility Cards & Markers
    function renderFacilities(facilities) {
        markersLayer.clearLayers();
        const listContainer = document.getElementById('facilityList');
        listContainer.innerHTML = '';

        if (facilities.length === 0) {
            listContainer.innerHTML = '<p class="text-center text-muted py-5">No facilities found matching your criteria.</p>';
            return;
        }

        facilities.forEach((f, index) => {
            // Calculate capacity percentage
            const capPercent = Math.round((f.capacity_used / f.capacity_total) * 100);
            const availableSpace = f.capacity_total - f.capacity_used;
            const isFull = capPercent >= 95;
            
            // Format last updated (mocking dynamic)
            const updateTime = f.last_updated ? new Date(f.last_updated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now';

            // Crop badges for sidebar
            const cropBadges = f.crops.map(c => `<span class="badge bg-light text-dark border me-1 mb-1" style="font-size: 0.7rem;">${c}</span>`).join('');
            
            // Add card to sidebar
            const card = document.createElement('div');
            card.className = `card shadow-sm border-0 p-3 mb-3 facility-card ${isFull ? 'opacity-75' : ''}`;
            card.innerHTML = `
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h6 class="fw-bold mb-0">${f.name}</h6>
                    <span class="badge ${f.type === 'Government' ? 'badge-gov' : 'badge-priv'} badge-sm">${f.type}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <div class="small text-muted">
                        <i class="bi bi-geo-alt-fill me-1 text-danger"></i>${f.lat.toFixed(3)}, ${f.lng.toFixed(3)}
                    </div>
                    <div class="small text-success fw-bold" style="font-size: 0.75rem;">
                        <i class="bi bi-clock-history me-1"></i>Updated ${updateTime}
                    </div>
                </div>
                <div class="d-flex justify-content-between small mb-1">
                    <span>${capPercent}% Occupied</span>
                    <span class="fw-bold text-success">₹${f.price_per_unit} / ${f.unit}</span>
                </div>
                <div class="progress capacity-bar bg-light mb-2">
                    <div class="progress-bar ${isFull ? 'bg-danger' : 'bg-success'}" role="progressbar" style="width: ${capPercent}%"></div>
                </div>
                <div class="mt-2">
                    <p class="small fw-bold mb-1"><i class="bi bi-box-fill me-1"></i>Compatible Crops:</p>
                    <div class="d-flex flex-wrap">${cropBadges}</div>
                </div>
                ${isFull ? '<p class="text-danger small fw-bold mb-0 mt-2"><i class="bi bi-exclamation-triangle-fill me-1"></i>No space left today</p>' : ''}
            `;
            
            card.onclick = () => {
                map.flyTo([f.lat, f.lng], 13);
                // Highlight active card
                document.querySelectorAll('.facility-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                
                // NEW: Show Market Prices for this district
                showMarketPrices(f.district);
            };

            listContainer.appendChild(card);

            // Add Marker to Map
            const markerColor = isFull ? '#dc3545' : (f.type === 'Government' ? '#0d6efd' : '#198754');
            
            const marker = L.circleMarker([f.lat, f.lng], {
                radius: 10,
                fillColor: markerColor,
                color: "#fff",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9
            }).addTo(markersLayer);

            // Enhanced Popup
            const popupContent = `
                <div class="p-2" style="min-width: 200px;">
                    <h6 class="fw-bold mb-1 border-bottom pb-1">${f.name}</h6>
                    <p class="small mb-2 text-primary fw-bold">${f.type} Logistic Hub</p>
                    
                    <div class="d-flex justify-content-between small mb-1">
                        <span>Space: <b>${availableSpace} kg left</b></span>
                        <span class="text-success"><b>₹${f.price_per_unit} / ${f.unit.split('/')[0]}</b></span>
                    </div>
                    <div class="progress mb-2" style="height: 6px;">
                        <div class="progress-bar ${isFull ? 'bg-danger' : 'bg-success'}" style="width: ${capPercent}%"></div>
                    </div>

                    <p class="small fw-bold mb-1">✅ Stores These Crops:</p>
                    <div class="d-flex flex-wrap gap-1 mb-2">
                        ${f.crops.map(c => `<span class="badge bg-success-subtle text-success border border-success-subtle" style="font-size:0.65rem;">${c}</span>`).join('')}
                    </div>

                    <div class="mt-2 pt-1 border-top d-flex justify-content-between align-items-center">
                        <span class="text-muted" style="font-size:0.6rem;">Ref: ${dateRef || 'Live'}</span>
                        <button class="btn btn-sm btn-success py-0 px-2" style="font-size:0.7rem;" onclick="alert('Book Space in ${f.name}? Feature coming soon!')">Book Space</button>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
            
            // Marker click also triggers market update
            marker.on('click', () => showMarketPrices(f.district));
        });
    }

    // ─── Market UI Update ────────────────────────────────────────────────

    function showMarketPrices(district) {
        const container = document.getElementById('marketPricesContainer');
        const badge = document.getElementById('marketDistrictBadge');
        
        if (!container || !badge) return;

        badge.textContent = district || 'Selected District';
        
        // Filter market prices
        // The market string usually looks like "APMC Name, District" or "District APMC"
        const filtered = marketPrices.filter(p => {
            const m = p.market.toLowerCase();
            const d = district.toLowerCase();
            return m.includes(d);
        });

        if (filtered.length === 0) {
            container.innerHTML = `<p class="text-muted text-center small my-3">No direct market matches for ${district}. Showing general trends...</p>`;
            // Show a few general crops if none found for district
            renderMarketList(marketPrices.slice(0, 5), container);
            return;
        }

        renderMarketList(filtered, container);
    }

    function renderMarketList(prices, container) {
        container.innerHTML = prices.map(p => `
            <div class="d-flex justify-content-between align-items-center mb-2 pb-1 border-bottom">
                <div>
                    <div class="fw-bold" style="font-size: 0.8rem;">${p.crop}</div>
                    <div class="text-muted" style="font-size: 0.7rem;">${p.market.split(',')[0]}</div>
                </div>
                <div class="text-end">
                    <div class="fw-bold text-success">₹${p.price}</div>
                    <div class="small ${p.trend === 'up' ? 'text-success' : 'text-danger'}" style="font-size: 0.65rem;">
                        <i class="bi bi-caret-${p.trend === 'up' ? 'up' : 'down'}-fill"></i> ${p.trend.toUpperCase()}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 5. Geolocation Logic
    document.getElementById('useMyLocation').onclick = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }
        
        const btn = document.getElementById('useMyLocation');
        btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';

        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            map.flyTo([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(map).bindPopup("You are here").openPopup();
            btn.innerHTML = '<i class="bi bi-crosshair"></i>';
        }, (err) => {
            alert("Unable to retrieve your location.");
            btn.innerHTML = '<i class="bi bi-crosshair"></i>';
        });
    };

    // 6. Filtering Logic
    document.getElementById('filterBtn').onclick = () => {
        const crop = document.getElementById('cropFilter').value.toLowerCase();
        const search = document.getElementById('locationSearch').value.toLowerCase();

        const filtered = allFacilities.filter(f => {
            const matchesCrop = crop === 'all' || f.crops.some(c => c.toLowerCase().includes(crop));
            const matchesSearch = !search || f.name.toLowerCase().includes(search);
            return matchesCrop && matchesSearch;
        });

        // Trigger market update if search term matches a known district
        if (locationTerm) {
            // Simple check: see if any facility in the filtered list belongs to a district that matches search
            const match = filtered.find(f => f.district.toLowerCase().includes(locationTerm));
            if (match) showMarketPrices(match.district);
        }

        renderFacilities(filtered);
    };

    // Initial Load
    fetchWarehouses();
});

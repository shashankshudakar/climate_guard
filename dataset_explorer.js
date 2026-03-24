/**
 * dataset_explorer.js
 * Comprehensive mapping of Karnataka districts to crop and soil data.
 */

const districtData = {
    "Bagalkote": { soil: "black", crops: ["maize", "sugarcane", "cotton"], rainfall: "Low to Moderate" },
    "Ballari": { soil: "black", crops: ["maize", "rice", "cotton"], rainfall: "Moderate" },
    "Belagavi": { soil: "black", crops: ["sugarcane", "maize", "rice"], rainfall: "High" },
    "Bengaluru Rural": { soil: "silty-loam", crops: ["rice", "maize", "ginger"], rainfall: "Moderate" },
    "Bengaluru Urban": { soil: "silty-loam", crops: ["rice", "ragi", "ginger"], rainfall: "Moderate" },
    "Bidar": { soil: "black", crops: ["maize", "pulses", "sugarcane"], rainfall: "Moderate" },
    "Chamarajanagar": { soil: "red", crops: ["maize", "sugarcane", "pulses"], rainfall: "Moderate" },
    "Chikballapur": { soil: "red", crops: ["maize", "sugarcane", "ginger"], rainfall: "Low" },
    "Chikmagalur": { soil: "laterite", crops: ["coffee", "tea", "ginger"], rainfall: "Very High" },
    "Chitradurga": { soil: "black", crops: ["maize", "cotton", "rice"], rainfall: "Low" },
    "Dakshina Kannada": { soil: "laterite", crops: ["coconut", "cocoa", "ginger"], rainfall: "Very High" },
    "Davanagere": { soil: "clay-loam", crops: ["maize", "rice", "sugarcane"], rainfall: "Moderate" },
    "Dharwad": { soil: "black", crops: ["maize", "cotton", "wheat"], rainfall: "Moderate" },
    "Gadag": { soil: "black", crops: ["maize", "cotton", "wheat"], rainfall: "Low" },
    "Hassan": { soil: "loam", crops: ["coffee", "ginger", "maize"], rainfall: "High" },
    "Haveri": { soil: "black", crops: ["maize", "sugarcane", "cotton"], rainfall: "Moderate" },
    "Kalaburagi": { soil: "black", crops: ["maize", "pulses", "sugarcane"], rainfall: "Low" },
    "Kodagu": { soil: "laterite", crops: ["coffee", "ginger", "cocoa"], rainfall: "Very High" },
    "Kolar": { soil: "red", crops: ["maize", "silt", "ginger"], rainfall: "Low" },
    "Koppal": { soil: "black", crops: ["maize", "rice", "cotton"], rainfall: "Low" },
    "Mandya": { soil: "clay-loam", crops: ["rice", "sugarcane", "maize"], rainfall: "Moderate" },
    "Mysuru": { soil: "clay-loam", crops: ["rice", "sugarcane", "maize"], rainfall: "Moderate" },
    "Raichur": { soil: "black", crops: ["rice", "cotton", "maize"], rainfall: "Low" },
    "Ramanagara": { soil: "red", crops: ["ragi", "maize", "sugarcane"], rainfall: "Moderate" },
    "Shimoga": { soil: "laterite", crops: ["rice", "ginger", "maize"], rainfall: "High" },
    "Tumakuru": { soil: "red", crops: ["maize", "ragi", "sugarcane"], rainfall: "Low" },
    "Udupi": { soil: "laterite", crops: ["coconut", "cocoa", "ginger"], rainfall: "Very High" },
    "Uttara Kannada": { soil: "laterite", crops: ["rice", "coconut", "ginger"], rainfall: "Very High" },
    "Vijayanagara": { soil: "black", crops: ["rice", "maize", "cotton"], rainfall: "Moderate" },
    "Vijayapura": { soil: "black", crops: ["maize", "sugarcane", "pulses"], rainfall: "Low" },
    "Yadgir": { soil: "black", crops: ["maize", "rice", "cotton"], rainfall: "Low" }
};

window.districtData = districtData;

// Global handles for map integration
window.cropDataset = {};
window.soilDataset = {};

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const t = new Date().getTime();
        const cropRes = await fetch(`data/crop_dataset.json?v=${t}`);
        window.cropDataset = await cropRes.json();
        const soilRes = await fetch(`data/soil_dataset.json?v=${t}`);
        window.soilDataset = await soilRes.json();
    } catch (e) {
        console.error("Failed to load datasets", e);
    }

    // Lazy Modal Initialization
    let modal = null;
    const initModal = () => {
        if (modal) return true;
        const modalEl = document.getElementById('districtInfoModal');
        if (modalEl && typeof bootstrap !== 'undefined') {
            modal = new bootstrap.Modal(modalEl);
            return true;
        }
        return false;
    };

    const modalTitle = document.getElementById('districtInfoTitle');
    const modalBody = document.getElementById('districtInfoBody');

    window.showDistrictInfo = (district) => {
        const data = districtData[district];
        if (!data || !modalBody || !modalTitle) return;

        modalTitle.textContent = `${i18n.t('dist-agri-profile')}: ${i18n.t(district)}`;

        const soilInfo = window.soilDataset[data.soil] || { title: data.soil, desc: "Information not available." };
        const cropsInfo = data.crops.map(c => window.cropDataset[c.toLowerCase()] || { title: c, desc: "Typical crop for this region." });

        let html = `
            <div class="row g-4">
                <div class="col-md-12 mb-2">
                    <div class="d-flex align-items-center">
                        <span class="fs-4 me-2">📍</span>
                        <h6 class="text-success fw-bold mb-0">${i18n.t(district)} ${i18n.t('region')}</h6>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 bg-light rounded shadow-sm h-100 border-start border-4 border-success">
                        <h6 class="fw-bold mb-2">${i18n.t('stat-soil')}: ${i18n.t(soilInfo.title)}</h6>
                        <p class="small text-muted mb-2">${i18n.t(soilInfo.desc ? soilInfo.desc.split('.')[0] : 'Suitable for various seasonal crops')}.</p>
                        ${soilInfo.ph ? `<span class="badge bg-success-subtle text-success border border-success-subtle">pH ${soilInfo.ph}</span>` : ''}
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="p-3 bg-light rounded shadow-sm h-100 border-start border-4 border-primary">
                        <h6 class="fw-bold mb-2" data-i18n="recommended-crops">🌾 Major Crops</h6>
                        <div class="d-flex flex-wrap gap-1">
                            ${cropsInfo.map(c => `<span class="badge bg-primary-subtle text-primary border border-primary-subtle small">${i18n.t(c.title)}</span>`).join('')}
                        </div>
                        <p class="small text-muted mt-2 mb-0">${i18n.t('stat-rainfall-mm')}: <strong>${i18n.t(data.rainfall)}</strong></p>
                    </div>
                </div>
            </div>
            <div class="mt-4 pt-3 border-top text-center d-flex flex-wrap justify-content-center gap-2">
                    <a href="farmer_dashboard.html?district=${encodeURIComponent(district)}" class="btn btn-success px-4 rounded-pill shadow-sm" data-i18n="go-to-farmer">
                    Open AgriGuard Dashboard
                </a>
                    <a href="public_dashboard.html?district=${encodeURIComponent(district)}" class="btn btn-primary px-4 rounded-pill shadow-sm" data-i18n="go-to-public">
                    Open Public Dashboard
                </a>
            </div>
        `;

        modalBody.innerHTML = html;
        if (initModal()) {
            modal.show();
        } else {
            console.error("Bootstrap Modal could not be initialized.");
            alert(`Profile for ${district}:\nSoil: ${data.soil}\nCrops: ${data.crops.join(', ')}`);
        }
    };

    // Live Time Badge Logic
    (function initLiveTimeBadge() {
        const timeBadge = document.getElementById('liveTimeBadge');
        if (!timeBadge) return;
        const update = () => {
            timeBadge.textContent = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
        };
        update();
        setInterval(update, 1000);
    })();

    // Dropdown Logic
    const districtSelect = document.getElementById('heroDistrictSelect');
    const exploreBtn = document.getElementById('exploreDistrictBtn');

    // Remove automatic modal popup on change - User requested no auto-open
    // (Old change listener was here, now removed to prevent any accidental triggers)

    if (exploreBtn && districtSelect) {
        exploreBtn.addEventListener('click', (e) => {
            const val = districtSelect.value;
            console.log("Explore Button Clicked. Value:", val);
            if (val && val !== 'Select District') {
                window.showDistrictInfo(val);
            } else {
                alert("Please select a district first.");
            }
        });
    }


    // Badge Listeners
    document.querySelectorAll('.district-badge').forEach(badge => {
        badge.style.cursor = 'pointer';
        badge.addEventListener('click', () => {
            // Use stable key so it works in both English and Kannada UI.
            const district = (badge.getAttribute('data-i18n') || badge.textContent || '').trim();
            if (districtData[district]) {
                window.showDistrictInfo(district);
            }
        });
    });
});

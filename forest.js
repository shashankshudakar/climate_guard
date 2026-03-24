// Map
const map = L.map('map').setView([15.3173, 75.7139], 7);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Bar Chart
const ctx1 = document.getElementById('forestChart');

let forestDistrictData = [];
let districtLabels = [];
let districtAreas = [];
let forestAreaByDistrict = {};

async function fetchForestDataAndInit() {
  try {
    const response = await fetch('http://localhost:5000/api/forest-data');
    const result = await response.json();

    if (result.data) {
      // We just need area data. In the CSV, it's typically 'area' and 'district'
      // We sum up areas if there are multiple entries per district, or just take the latest year 
      // The API might return multiple years. Default to year 2024 if available, otherwise sum.
      const year2024Data = result.data.filter(d => d.year == '2024' || !d.year);
      const workingData = year2024Data.length > 0 ? year2024Data : result.data;

      const areaMap = {};
      workingData.forEach(row => {
        if (!row.district) return;
        areaMap[row.district] = (areaMap[row.district] || 0) + parseFloat(row.forest_area_sqkm || 0);
      });

      forestDistrictData = Object.keys(areaMap).map(dist => ({
        district: dist,
        area: Math.round(areaMap[dist])
      }));

      // Re-generate mappings
      districtLabels = forestDistrictData.map((item) => item.district);
      districtAreas = forestDistrictData.map((item) => item.area);
      forestAreaByDistrict = Object.fromEntries(
        forestDistrictData.map((item) => [item.district, item.area])
      );
    }
  } catch (err) {
    console.error("Failed to fetch forest data from API:", err);
  }

  // Continue with rendering regardless of success (will render empty if failed)
  renderForestInsights();
  renderForestChart();
  loadForestMapGeoJson();
}


function renderForestInsights() {
  const totalDistricts = forestDistrictData.length;
  const highCover = forestDistrictData.filter((d) => d.area >= 2200).length;
  const mediumCover = forestDistrictData.filter((d) => d.area >= 800 && d.area < 2200).length;
  const lowCover = forestDistrictData.filter((d) => d.area < 800).length;

  const metricDistricts = document.getElementById('metricDistricts');
  const metricHighCover = document.getElementById('metricHighCover');
  const metricMediumCover = document.getElementById('metricMediumCover');
  const metricLowCover = document.getElementById('metricLowCover');

  if (metricDistricts) metricDistricts.textContent = String(totalDistricts);
  if (metricHighCover) metricHighCover.textContent = String(highCover);
  if (metricMediumCover) metricMediumCover.textContent = String(mediumCover);
  if (metricLowCover) metricLowCover.textContent = String(lowCover);

  const topForestDistrictsList = document.getElementById('topForestDistrictsList');
  if (topForestDistrictsList) {
    const topDistricts = [...forestDistrictData]
      .sort((a, b) => b.area - a.area)
      .slice(0, 5);

    topForestDistrictsList.innerHTML = topDistricts
      .map((item, idx) => `
        <li class="list-group-item bg-transparent d-flex justify-content-between align-items-center small">
          <span>${idx + 1}. ${t(item.district)}</span>
          <span class="badge bg-success-subtle text-success border border-success-subtle">${item.area} ${t('sq km')}</span>
        </li>
      `)
      .join('');
  }
}

const districtNamingBridge = {
  Bagalkot: 'Bagalkote',
  Belgaum: 'Belagavi',
  Bellary: 'Ballari',
  Bangalore: 'Bengaluru Urban',
  'Bangalore Rural': 'Bengaluru Rural',
  'Bangalore Urban': 'Bengaluru Urban',
  Bijapur: 'Vijayapura',
  Chamrajnagar: 'Chamarajanagar',
  'Dakshin Kannada': 'Dakshina Kannada',
  'Dakshin Kannad': 'Dakshina Kannada',
  Gulbarga: 'Kalaburagi',
  Mysore: 'Mysuru',
  Shimoga: 'Shivamogga',
  Chikmagalur: 'Chikkamagaluru',
  Chickmagalur: 'Chikkamagaluru',
  // Standardize on the spelling used in the dataset (likely the older spelling)
  // to ensure a match, similar to how soil_map.js and crop_map.js handle this.
  Shimoga: 'Shimoga', // Canonical name
  Shivamogga: 'Shimoga', // New name -> old name
  Chikmagalur: 'Chikmagalur', // Canonical name
  Chikkamagaluru: 'Chikmagalur', // New name -> old name
  Chickmagalur: 'Chikmagalur', // Alternate spelling -> old name
  Tumkur: 'Tumakuru',
  Yadagiri: 'Yadgir',
  'Uttar Kannada': 'Uttara Kannada',
  'Uttar Kannand': 'Uttara Kannada'
};

function normalizeDistrictKey(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/district/g, '')
    .replace(/[.\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDistrictName(rawName) {
  if (!rawName) return '';

  // 1. Try exact match with raw name first (handles cases where data uses old names like 'Chikmagalur')
  if (forestAreaByDistrict[rawName] !== undefined) return rawName;

  const direct = districtNamingBridge[rawName] || rawName;
  if (forestAreaByDistrict[direct] !== undefined) return direct;

  const cleaned = normalizeDistrictKey(direct);
  const found = Object.keys(forestAreaByDistrict).find((district) => {
    const d = normalizeDistrictKey(district);
    return d === cleaned || d.includes(cleaned) || cleaned.includes(d);
  });
  return found || direct;
}

function getForestColor(area) {
  if (area >= 3000) return '#00441b';
  if (area >= 2200) return '#1b7837';
  if (area >= 1400) return '#5aae61';
  if (area >= 800) return '#a6dba0';
  if (area >= 400) return '#d9f0d3';
  return '#f7fcf5';
}

function forestStyle(feature) {
  const rawName = feature?.properties?.NAME_2 || '';
  const districtName = normalizeDistrictName(rawName);
  const area = forestAreaByDistrict[districtName] ?? 0;

  return {
    fillColor: getForestColor(area),
    weight: 1,
    opacity: 1,
    color: '#ffffff',
    dashArray: '2',
    fillOpacity: 0.8
  };
}

function onEachForestFeature(feature, layer) {
  const rawName = feature?.properties?.NAME_2 || 'Unknown';
  const districtName = normalizeDistrictName(rawName);
  const area = forestAreaByDistrict[districtName];
  const areaText = typeof area === 'number' ? `${area} ${t('sq km')}` : t('Data unavailable');

  layer.bindTooltip(`<strong>${t(districtName)}</strong><br>${t('Forest Area')}: ${areaText}`, {
    sticky: true
  });

  layer.on({
    mouseover: function (e) {
      const target = e.target;
      target.setStyle({
        weight: 2.5,
        color: '#2f4f4f',
        fillOpacity: 0.95
      });
      target.bringToFront();
    },
    mouseout: function (e) {
      forestGeoJson.resetStyle(e.target);
    }
  });
}

// Wrapped geojson fetch in loadForestMapGeoJson
function loadForestMapGeoJson() {
  let forestGeoJson = null;

  fetch('data/karnataka.geojson')
    .then((res) => res.json())
    .then((geojson) => {
      forestGeoJson = L.geoJson(geojson, {
        style: forestStyle,
        onEachFeature: onEachForestFeature
      }).addTo(map);
    })
    .catch((err) => {
      console.error('Error loading Karnataka GeoJSON:', err);
    });
}

const legendControl = L.control({ position: 'bottomright' });
legendControl.onAdd = function () {
  const div = L.DomUtil.create('div', 'info-legend');
  div.innerHTML = `
    <div style="font-weight:700; margin-bottom:6px;">${t('Forest Density')}</div>
    <div><i style="background:#00441b"></i> 3000+ ${t('sq km')}</div>
    <div><i style="background:#1b7837"></i> 2200 - 2999</div>
    <div><i style="background:#5aae61"></i> 1400 - 2199</div>
    <div><i style="background:#a6dba0"></i> 800 - 1399</div>
    <div><i style="background:#d9f0d3"></i> 400 - 799</div>
    <div><i style="background:#f7fcf5"></i> 0 - 399</div>
  `;
  return div;
};
legendControl.addTo(map);

// Wrapped chart initialization in renderForestChart
function renderForestChart() {
  if (ctx1 && ctx1.parentElement) {
    // Expand chart area based on district count so all labels stay readable.
    ctx1.parentElement.style.height = `${Math.max(520, forestDistrictData.length * 26)}px`;
  }

  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels: districtLabels.map(d => t(d)),
      datasets: [{
        label: t('Forest Area (sq km)'),
        data: districtAreas,
        backgroundColor: '#27ae60'
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            autoSkip: false,
            font: {
              size: 11
            }
          }
        },
        x: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

const forestDetails = {
  bandipur: {
    title: 'Bandipur Forest',
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
    description: 'Bandipur is one of Karnataka\'s most important protected forest landscapes and a key part of the Nilgiri biosphere region.',
    districts: 'Chamarajanagar',
    status: 'National Park and Tiger Reserve',
    type: 'Dry deciduous and moist deciduous forests',
    area: 'Approx. 870 sq km',
    wildlife: 'Tiger, elephant, gaur, dhole, spotted deer, and rich birdlife.',
    conservation: 'Connected with Nagarhole, Mudumalai, and Wayanad landscapes, supporting large mammal movement corridors.'
  },
  nagarhole: {
    title: 'Nagarhole Forest',
    img: 'https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=1200&auto=format&fit=crop',
    description: 'Nagarhole is a biodiverse forest system with riverine belts, dense woodland, and long-term tiger conservation focus.',
    districts: 'Mysuru, Kodagu',
    status: 'Rajiv Gandhi National Park and Tiger Reserve',
    type: 'Tropical mixed, moist deciduous, and riparian forests',
    area: 'Approx. 640 sq km (core park area)',
    wildlife: 'Tiger, leopard, elephant, sloth bear, wild dog, and aquatic birds.',
    conservation: 'Part of a larger contiguous forest belt in southern India with strong wildlife protection value.'
  },
  kudremukh: {
    title: 'Kudremukh Forest',
    img: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop',
    description: 'Kudremukh represents Western Ghats high-rainfall ecology with montane grasslands and evergreen forest patches.',
    districts: 'Chikkamagaluru, Udupi',
    status: 'National Park (Western Ghats)',
    type: 'Evergreen forests, shola patches, and grassland mosaic',
    area: 'Approx. 600 sq km',
    wildlife: 'Lion-tailed macaque, leopard, gaur, sambar, and endemic amphibians.',
    conservation: 'Recognized for high endemism and watershed importance in the Western Ghats ecosystem.'
  },
  kali: {
    title: 'Kali Forest (Dandeli-Anshi)',
    img: 'https://images.unsplash.com/photo-1425913397330-cf8af2ff40a1?q=80&w=1200&auto=format&fit=crop',
    description: 'Kali landscape includes dense forests and river valleys and is among Karnataka\'s richest wildlife habitats.',
    districts: 'Uttara Kannada',
    status: 'Tiger Reserve',
    type: 'Evergreen and semi-evergreen forests',
    area: 'Approx. 1300+ sq km (landscape scale)',
    wildlife: 'Black panther sightings, tiger, hornbills, king cobra, and giant squirrel.',
    conservation: 'Important high-canopy forest zone with significant ecological connectivity and protected corridors.'
  },
  bhadra: {
    title: 'Bhadra Forest',
    img: 'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1200&auto=format&fit=crop',
    description: 'Bhadra combines mountain forests and river catchments and supports both biodiversity and water security.',
    districts: 'Chikkamagaluru, Shivamogga',
    status: 'Wildlife Sanctuary and Tiger Reserve',
    type: 'Moist deciduous with evergreen patches',
    area: 'Approx. 490 sq km (sanctuary area)',
    wildlife: 'Tiger, leopard, elephant, giant squirrel, and diverse raptors.',
    conservation: 'Known for conservation-led habitat recovery and tiger monitoring success.'
  },
  brt: {
    title: 'BRT Forest',
    img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop',
    description: 'BRT forest forms a unique ecological transition between Eastern and Western Ghats influence zones.',
    districts: 'Chamarajanagar',
    status: 'Biligiri Ranganathaswamy Tiger Reserve',
    type: 'Dry deciduous to montane shola transition',
    area: 'Approx. 540 sq km',
    wildlife: 'Elephant, tiger, leopard, grizzled giant squirrel, and endemic plant species.',
    conservation: 'A critical biogeographic transition forest with high conservation and habitat-linkage importance.'
  }
};

const t = (key) => window.i18n ? window.i18n.t(key) : key;

function populateForestModal(forestId) {
  const data = forestDetails[forestId];
  if (!data) return;

  document.getElementById('modalForestTitle').textContent = t(data.title);
  document.getElementById('modalForestImg').src = data.img;
  document.getElementById('modalForestDesc').textContent = t(data.description);

  const dists = data.districts.split(',').map(d => t(d.trim())).join(', ');
  document.getElementById('modalForestDistricts').textContent = dists;

  document.getElementById('modalForestStatus').textContent = t(data.status);
  document.getElementById('modalForestType').textContent = t(data.type);
  document.getElementById('modalForestArea').textContent = t(data.area);
  document.getElementById('modalForestWildlife').textContent = t(data.wildlife);
  document.getElementById('modalForestConservation').textContent = t(data.conservation);
}

const forestModalEl = document.getElementById('forestModal');
if (forestModalEl) {
  forestModalEl.addEventListener('show.bs.modal', (event) => {
    const trigger = event.relatedTarget;
    const forestId = trigger ? trigger.getAttribute('data-forest-id') : null;
    if (forestId) {
      populateForestModal(forestId);
    }
  });
}

fetchForestDataAndInit();

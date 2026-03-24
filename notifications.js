document.addEventListener('DOMContentLoaded', () => {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    // --- Simulation Logic ---
    // If no alerts exist in localStorage, create a base set for simulation
    let localAlerts = JSON.parse(localStorage.getItem('localAlerts')) || [];

    // Auto-generate a simulation alert if none exist after 5 seconds of session
    if (localAlerts.length === 0) {
        setTimeout(() => {
            const simulatedAlert = {
                id: Date.now(),
                message: "CRITICAL: Heavy rainfall and flood risk detected in your region. Move to higher ground.",
                level: "Critical",
                timestamp: new Date().toISOString(),
                is_read: false
            };
            localAlerts.push(simulatedAlert);
            localStorage.setItem('localAlerts', JSON.stringify(localAlerts));
            renderAlerts();
        }, 2000);
    }



    function renderAlerts() {
        let alerts = (JSON.parse(localStorage.getItem('localAlerts')) || []).filter(a => {
            // Only show if alerts are enabled for this user
            const currentU = JSON.parse(localStorage.getItem('currentUser'));
            return currentU && currentU.alerts_enabled;
        });

        // --- District Risk Filtering ---
        const urlParams = new URLSearchParams(window.location.search);
        const currentDistrict = urlParams.get('district');

        // If we are on a district page, check if the district actually has a risk
        if (currentDistrict && typeof window.districtData !== 'undefined' && window.districtData[currentDistrict]) {
            const riskLevel = window.districtData[currentDistrict].rainfall; // "Very High", "High", "Moderate", "Low"

            // Only show the alert if the district has a high risk
            if (riskLevel !== "Very High" && riskLevel !== "High") {
                alerts = []; // Clear alerts for safe districts
            }
        }



        // Update In-Page Alert Container Element
        const inPageContainer = document.getElementById('alertContainer');
        const notificationsCard = document.getElementById('climateNotificationsCard');

        if (inPageContainer) {
            if (alerts.length > 0) {
                inPageContainer.innerHTML = alerts.map(a => `
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex w-100 justify-content-between">
                            <h6 class="mb-1 ${a.level === 'Critical' ? 'text-danger' : 'text-warning'}">${a.level} Alert</h6>
                            <small>${new Date(a.timestamp).toLocaleTimeString()}</small>
                        </div>
                        <p class="mb-1 small">${a.message}</p>
                    </div>
                `).join('');
                if (notificationsCard) notificationsCard.style.display = 'block';
            } else {
                inPageContainer.innerHTML = ''; // Clear contents
                if (notificationsCard) notificationsCard.style.display = 'none'; // Hide whole section
            }
        }
    }

    // Sync Toggle
    const smsToggle = document.getElementById('smsAlertToggle');
    if (smsToggle) {
        smsToggle.checked = currentUser.alerts_enabled;
        smsToggle.addEventListener('change', () => {
            currentUser.alerts_enabled = smsToggle.checked;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));

            // Sync with global users list if it exists
            let users = JSON.parse(localStorage.getItem('users')) || [];
            let uIdx = users.findIndex(u => u.email === currentUser.email);
            if (uIdx !== -1) {
                users[uIdx].alerts_enabled = smsToggle.checked;
                localStorage.setItem('users', JSON.stringify(users));
            }

            renderAlerts();
        });
    }

    renderAlerts();
    setInterval(renderAlerts, 2000); // Pulse every 2 seconds to catch simulation
});

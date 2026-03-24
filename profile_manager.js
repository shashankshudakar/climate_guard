/**
 * Profile Manager
 * Handles avatar persistence and auth-based dropdown visibility across all ClimateGuard pages.
 * - Loads avatar from currentUser in localStorage
 * - Shows/hides dropdown items based on login status
 */

(function profileManager() {
    const AVATAR_SELECTOR = '.user-profile-img';

    function init() {
        applyUserAvatar();
        applyAuthState();
    }

    /**
     * Load the current user's avatar from localStorage and apply to all profile images.
     */
    function applyUserAvatar() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.avatar) {
            document.querySelectorAll(AVATAR_SELECTOR).forEach(img => {
                img.src = currentUser.avatar;
            });
        }
    }

    /**
     * Show/hide dropdown menu items based on login status.
     * - Logged in: show profileMenuItem, settingsMenuItem, logoutMenuItem; hide loginMenuItem, registerMenuItem
     * - Not logged in: show loginMenuItem, registerMenuItem; hide profileMenuItem, settingsMenuItem, logoutMenuItem
     */
    function applyAuthState() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isLoggedIn = !!currentUser;

        // Items to show only when logged in
        const loggedInItems = ['profileMenuItem', 'settingsMenuItem', 'logoutMenuItem', 'authDivider2'];
        // Items to show only when logged out
        const loggedOutItems = ['loginMenuItem', 'registerMenuItem'];
        // Items to show always
        const alwaysShowItems = ['switchRoleItem', 'authDivider'];

        loggedInItems.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = isLoggedIn ? '' : 'none';
        });

        loggedOutItems.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = isLoggedIn ? 'none' : '';
        });

        alwaysShowItems.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = '';
        });

        // Toggle SMS Alerts Checkbox
        const smsToggle = document.getElementById('smsAlertToggle');
        if (smsToggle) {
            smsToggle.disabled = !isLoggedIn;
            if (!isLoggedIn) {
                smsToggle.checked = false;
            }
            const label = smsToggle.nextElementSibling;
            if (label) {
                if (!isLoggedIn) {
                    if (!label.innerHTML.includes('(Login Required)')) {
                        label.innerHTML += ' <span style="font-size:0.8rem;color:#dc3545;" class="login-req-badge">(Login Required)</span>';
                    }
                } else {
                    const badge = label.querySelector('.login-req-badge');
                    if (badge) badge.remove();
                }
            }
        }
    }

    // Run on DOMContentLoaded or immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Listen for storage changes in other tabs
    window.addEventListener('storage', (e) => {
        if (e.key === 'currentUser') {
            init();
        }
    });

    // Global logout handler
    window.handleLogout = function () {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    };
})();

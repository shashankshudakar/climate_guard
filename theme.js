/**
 * theme.js — Dark / Light mode toggle for ClimateGuard
 * Persists preference in localStorage as 'cgTheme' = 'dark' | 'light'
 */
(function () {
    const STORAGE_KEY = 'cgTheme';
    const DARK_CLASS = 'cg-dark';

    /* Apply theme immediately to avoid flash */
    /* Apply theme immediately to avoid flash */
    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.classList.add(DARK_CLASS);
        } else {
            document.documentElement.classList.remove(DARK_CLASS);
        }

        // Update any toggle button on the page
        const btn = document.getElementById('themeToggleBtn');
        if (btn) updateIcon(btn, theme);
    }

    /* Read saved preference (default: light) */
    const saved = localStorage.getItem(STORAGE_KEY) || 'light';
    applyTheme(saved);

    /* Watch for theme changes in other tabs */
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            applyTheme(e.newValue || 'light');
        }
    });

    /* Once the DOM is ready, wire up the toggle button */
    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('themeToggleBtn');
        if (!btn) return;

        /* Set initial icon */
        updateIcon(btn, localStorage.getItem(STORAGE_KEY) || 'light');

        btn.addEventListener('click', () => {
            const current = localStorage.getItem(STORAGE_KEY) || 'light';
            const next = current === 'dark' ? 'light' : 'dark';
            localStorage.setItem(STORAGE_KEY, next);
            applyTheme(next);
        });
    });

    function updateIcon(btn, theme) {
        btn.textContent = theme === 'dark' ? '☀️' : '🌙';
        btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    }
})();

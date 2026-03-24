/**
 * navigation.js - Global Navigation & Persistence Service
 * Ensures the selected district persists across all application pages.
 */

(function () {
    const DEBUG = true;
    const log = (...args) => DEBUG && console.log('[NavPersistence]', ...args);

    // Get current state from URL or Session
    const urlParams = new URLSearchParams(window.location.search);
    let district = urlParams.get('district');

    // 1. Sync with Session Storage
    if (district) {
        log('District found in URL:', district);
        sessionStorage.setItem('selectedDistrict', district);
    } else {
        const savedDistrict = sessionStorage.getItem('selectedDistrict');
        if (savedDistrict) {
            log('District found in SessionStorage:', savedDistrict);
            district = savedDistrict;

            // Update URL to include district parameter without a full page reload
            // Using replaceState instead of window.location.href redirect to avoid
            // a double page load that causes the farmer dashboard to show defaults
            const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname.endsWith('clamiteguard/');
            if (!isIndex && district) {
                log('Restoring district parameter in URL via replaceState...');
                urlParams.set('district', district);
                const newUrl = window.location.pathname + '?' + urlParams.toString() + window.location.hash;
                window.history.replaceState(null, '', newUrl);
            }
        }
    }

    // Expose the resolved district globally so downstream module scripts
    // can reliably read it (modules run deferred, after all regular scripts)
    if (district) {
        window.__navDistrict = district;
    }


    /**
     * Updates all internal links to include the current district parameter
     */
    function updateAllLinks() {
        if (!district) return;

        const links = document.querySelectorAll('a');
        let updatedCount = 0;

        links.forEach(link => {
            const href = link.getAttribute('href');

            // Skip empty, anchors, external, or non-http links
            if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:')) {
                return;
            }

            try {
                // Construct absolute URL for checking origin
                const targetUrl = new URL(href, window.location.href);

                // Only modify internal links to the same origin
                if (targetUrl.origin === window.location.origin) {
                    const targetParams = new URLSearchParams(targetUrl.search);

                    if (!targetParams.has('district')) {
                        targetParams.set('district', district);
                        // Update the link
                        const newHref = targetUrl.pathname + '?' + targetParams.toString() + targetUrl.hash;
                        link.setAttribute('href', newHref);
                        updatedCount++;
                    }
                }
            } catch (e) {
                // Ignore parsing errors for complex links
            }
        });

        if (updatedCount > 0) log(`Updated ${updatedCount} links with district: ${district}`);
    }

    // Run on multiple events to catch dynamic content
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateAllLinks);
    } else {
        updateAllLinks();
    }

    // Secondary passes for content loaded via fetch (like tracked crops or charts)
    window.addEventListener('load', updateAllLinks);
    setTimeout(updateAllLinks, 1000);
    setTimeout(updateAllLinks, 3000);

    // Global helper to manually trigger link update if needed
    window.refreshNavLinks = updateAllLinks;

})();

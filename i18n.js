/**
 * ClimateGuard i18n Service
 * Handles multi-language support (English / Kannada)
 */

const TRANSLATIONS = {
    'kn': {
        // Navbar
        'nav-home': 'ಮುಖಪುಟ',
        'nav-agriguard': 'ಅಗ್ರಿ-ಗಾರ್ಡ್',
        'nav-soil': 'ಮಣ್ಣಿನ ಮಾಹಿತಿ',
        'nav-crop-info': '🌱 ಬೆಳೆ ಮಾಹಿತಿ',
        'nav-crop': 'ಬೆಳೆ ಮಾರ್ಗದರ್ಶನ',
        'nav-forest': 'ಅರಣ್ಯ ಮಾಹಿತಿ',
        'nav-public-safety': 'ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ',
        'nav-login': 'ಲಾಗಿನ್',
        'nav-register': 'ನೋಂದಣಿ',
        'nav-profile': 'ನನ್ನ ವಿವರ',
        'nav-settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        'nav-logout': 'ನಿರ್ಗಮಿಸು',

        // Hero Section
        'hero-title': 'ಕರ್ನಾಟಕ',
        'hero-main': 'AI-ಆಧಾರಿತ ಹವಾಮಾನ ಅಪಾಯ ಮುನ್ಸೂಚನೆ ವ್ಯವಸ್ಥೆ',
        'hero-subtitle': 'ಕೃಷಿ ರಕ್ಷಣೆ | ಬೆಳೆ ಮಾರ್ಗದರ್ಶನ | ಮಣ್ಣಿನ ಮಾಹಿತಿ | ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ | ಅರಣ್ಯ ಮಾಹಿತಿ',
        'select-district': '\u0c9c\u0cbf\u0cb2\u0ccd\u0cb2\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0c86\u0caf\u0ccd\u0c95\u0cc6 \u0cae\u0cbe\u0ca1\u0cbf',
        'public-subtitle': 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಸುರಕ್ಷತಾ ಮಾಹಿತಿ',
        'farmer-subtitle': 'ಜಿಲ್ಲಾ ಆಧಾರಿತ ಹವಾಮಾನ ಮತ್ತು ಬೆಳೆ ಸಲಹೆ',
        'i-am-farmer': 'ನಾನು ರೈತ',
        'farmer-desc': 'ಬೆಳೆ ಮಾರ್ಗದರ್ಶನ, ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮಾಹಿತಿ ಮತ್ತು ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ.',
        'go-to-farmer': 'ರೈತ ಪುಟಕ್ಕೆ ಹೋಗಿ',
        'public-safety': 'ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆ',
        'public-desc': 'React ಮೂಲಕ ಸುಧಾರಿತ ಹವಾಮಾನ ಒಳನೋಟಗಳು ಮತ್ತು 7 ದಿನಗಳ ಪ್ರವೃತ್ತಿಗಳು.',
        'go-to-public': 'ಸಾರ್ವಜನಿಕ ಸುರಕ್ಷತೆಗೆ ಹೋಗಿ',

        // Features
        'crop-guidance': 'ಬೆಳೆ ಮಾರ್ಗದರ್ಶನ',
        'crop-info': '🌱 ಬೆಳೆ ಮಾಹಿತಿ',
        'crop-desc': 'ಕರ್ನಾಟಕದ ವಿಶಿಷ್ಟ ಮಣ್ಣು ಮತ್ತು ಮಳೆ ಮಾದರಿಗಳಿಗೆ ಸೂಕ್ತವಾದ AI-ಆಧಾರಿತ ಬೆಳೆ ಶಿಫಾರಸುಗಳು.',
        'explore-advisory': 'ಸಲಹೆಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
        'explore-info': 'ಮಾಹಿತಿಯನ್ನು ಅನ್ವೇಷಿಸಿ',
        'soil-intelligence': 'ಮಣ್ಣಿನ ಬುದ್ಧಿವಂತಿಕೆ',
        'soil-desc': '31 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಮಣ್ಣಿನ ಆರೋಗ್ಯ, ಪೋಷಕಾಂಶಗಳ ಸಂಯೋಜನೆ ಮತ್ತು ನೈಜ-ಸಮಯದ ಮ್ಯಾಪಿಂಗ್ ಬಗ್ಗೆ ಆಳವಾದ ಒಳನೋಟಗಳು.',
        'analyze-soil': 'ಮಣ್ಣನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
        'forest-info': 'ಅರಣ್ಯ ಮಾಹಿತಿ',
        'forest-desc': '31 ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಅರಣ್ಯ ನೈಜ-ಸಮಯದ ಮ್ಯಾಪಿಂಗ್ ಆಧಾರಿತ ಮಾಹಿತಿ.',

        // Dashboards
        'temp': '🌡️ತಾಪಮಾನ',
        'humidity': '💧ಆರ್ದ್ರತೆ',
        'rainfall': '🌧️ಮಳೆ',
        'risk-level': 'ಅಪಾಯದ ಮಟ್ಟ',
        'live': 'ಲೈವ್',
        'low': 'ಕಡಿಮೆ',
        'medium': 'ಮಧ್ಯಮ',
        'high': 'ಹೆಚ್ಚು',
        'extreme': 'ತೀವ್ರ',

        // Auth & Profile
        'login-title': 'ಲಾಗಿನ್',
        'register-title': 'ನೋಂದಣಿ',
        'full-name': 'ಪೂರ್ಣ ಹೆಸರು',
        'password': 'ಪಾಸ್‌ವರ್ಡ್',
        'confirm-password': 'ಪಾಸ್‌ವರ್ಡ್ ಪ್ರಮಾಣೀಕರಿಸಿ',
        'email-opt': 'ಇಮೇಲ್ (ಐಚ್ಛಿಕ)',
        'mobile-number': 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ',
        'send-otp': 'OTP ಕಳುಹಿಸಿ',
        'verify-otp': 'ಪರಿಶೀಲಿಸಿ',
        'new-user': 'ಹೊಸಬರೇ?',
        'already-have-account': 'ಈಗಾಗಲೇ ಖಾತೆಯನ್ನು ಹೊಂದಿದ್ದೀರಾ?',
        'profile-details': 'ವಿವರಗಳು',
        'role': 'ಪಾತ್ರ',
        'edit-in-settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಬದಲಾಯಿಸಿ',
        'choose-avatar': 'ಅವತಾರ್ ಆಯ್ಕೆಮಾಡಿ',
        'upload-photo': 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
        'take-photo': 'ಫೋಟೋ ತೆಗೆದುಕೊಳ್ಳಿ',

        // Settings
        'settings-title': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        'settings-desc': 'ನಿಮ್ಮ ಖಾತೆಯ ಮತ್ತು ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
        'edit-profile': 'ಪ್ರೊಫೈಲ್ ತಿದ್ದಿ',
        'save-profile': 'ಉಳಿಸಿ',
        'cancel': 'ರದ್ದುಗೊಳಿಸಿ',
        'app-prefs': 'ಅಪ್ಲಿಕೇಶನ್ ಆದ್ಯತೆಗಳು',
        'enable-alerts': 'SMS/ಅಪ್ಲಿಕೇಶನ್ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
        'save-alerts': 'ಎಚ್ಚರಿಕೆಗಳನ್ನು ಉಳಿಸಿ',

        // Market Dashboard
        'market-prices': 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು',
        'market-dashboard-title': '💰 ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'market-dashboard-desc': 'ಸ್ಥಳೀಯ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳಿಂದ ನೈಜ-ಸಮಯದ ಬೆಳೆ ಬೆಲೆಗಳು',
        'live-updates': 'ಲೈವ್ ಅಪ್‌ಡೇಟ್‌ಗಳು',
        'loading-market-trends': 'ಮಾರುಕಟ್ಟೆ ಪ್ರವೃತ್ತಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        'profit-calculator': 'ಲಾಭದ ಲೆಕ್ಕಾಚಾರ',
        'enter-details': 'ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ',
        'select-crop': 'ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ',
        'select-a-crop': 'ಒಂದು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ...',
        'current-price-prefix': 'ಪ್ರಸ್ತುತ ಬೆಲೆ: ',
        'area-acres': 'ವಿಸ್ತೀರ್ಣ (ಎಕರೆಗಳು)',
        'yield-per-acre': 'ಎಕರೆಗೆ ಇಳುವರಿ (ಕ್ವಿಂಟಾಲ್)',
        'estimated-costs': 'ಅಂದಾಜು ವೆಚ್ಚಗಳು (ಎಕರೆಗೆ ₹)',
        'cost-seeds': 'ಬೀಜಗಳು',
        'cost-fertilizers': 'ರಸಗೊಬ್ಬರಗಳು',
        'cost-labor': 'ಕಾರ್ಮಿಕರು/ಯಂತ್ರೋಪಕರಣಗಳು',
        'gross-revenue': 'ಒಟ್ಟು ಆದಾಯ',
        'total-expenses': 'ಒಟ್ಟು ಖರ್ಚುಗಳು',
        'net-profit': 'ನಿವ್ವಳ ಲಾಭ',
        'crop-prices-table': 'ಬೆಳೆ ಬೆಲೆಗಳು',

        // Specialized Dashboards
        'rainfall-dashboard': 'ಮಳೆ ಮುನ್ಸೂಚನೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'rainfall-desc': 'ಕರ್ನಾಟಕದ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಮಾಸಿಕ ಮಳೆ ಮತ್ತು ಹವಾಮಾನ ಮಾದರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
        'annual-rainfall': 'ವಾರ್ಷಿಕ ಮಳೆ (mm)',
        'peak-month': 'ಗರಿಷ್ಠ ಮಳೆ ತಿಂಗಳು',
        'avg-temp': 'ಸರಾಸರಿ ತಾಪಮಾನ (°C)',
        'avg-humidity': 'ಸರಾಸರಿ ಆರ್ದ್ರತೆ (%)',
        'predicted-annual': 'ಮುನ್ಸೂಚನೆಯ ವಾರ್ಷಿಕ ಮಳೆ',
        'monthly-dist': 'ಮಾಸಿಕ ಮಳೆ ಹಂಚಿಕೆ',
        'temp-trend': 'ತಾಪಮಾನ ಪ್ರವೃತ್ತಿ (°C)',
        'humidity-trend': 'ಆರ್ದ್ರತೆ ಪ್ರವೃತ್ತಿ (%)',

        'soil-dashboard': 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಮಣ್ಣಿನ ವಿಧಗಳು',
        'soil-desc-long': 'ಕ್ಲೈಮೇಟ್‌ಗಾರ್ಡ್ ಡೇಟಾಸೆಟ್‌ನಿಂದ ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ',
        'state-soil-dist': 'ರಾಜ್ಯದ ಮಣ್ಣಿನ ಹಂಚಿಕೆ',
        'legend': 'ಸೂಚಿಕೆ',

        'crop-dashboard': 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಬೆಳೆಗಳು',
        'crop-desc-long': 'ಕೃಷಿ ಹಂಚಿಕೆ ಮತ್ತು ಉತ್ತಮ ಪದ್ಧತಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',

        'forest-dashboard': 'ಕರ್ನಾಟಕ ಅರಣ್ಯ ಮೇಲ್ವಿಚಾರಣೆ',
        'forest-desc-long': 'ಅರಣ್ಯ ವ್ಯಾಪ್ತಿ ಮತ್ತು ಜಿಲ್ಲಾ ಒಳನೋಟಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
        'forest-highlights': 'ಅರಣ್ಯ ಮುಖ್ಯಾಂಶಗಳು',
        'total-forest-area': 'ಒಟ್ಟು ಅರಣ್ಯ ಪ್ರದೇಶ',
        'forest-coverage': 'ಅರಣ್ಯ ವ್ಯಾಪ್ತಿ',
        'coverage-title': '🌍 ವ್ಯಾಪ್ತಿ: ಕರ್ನಾಟಕದ ಎಲ್ಲಾ 31 ಜಿಲ್ಲೆಗಳು',
        'coverage-desc': 'ರಾಜ್ಯಾದ್ಯಂತ ನೈಜ-ಸಮಯದ ಹವಾಮಾನ ಅಪಾಯದ ಮೇಲ್ವಿಚಾರಣೆ ಮತ್ತು ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ ಲಭ್ಯವಿದೆ.',
        'farmer-safety': 'ರೈತ ಸುರಕ್ಷತೆ',

        // Dashboard Stats
        'stat-temp': '🌡️ತಾಪಮಾನ',
        'stat-humidity': '💧ಆರ್ದ್ರತೆ',
        'stat-rainfall-mm': '🌧️ಮಳೆ (mm)',
        'stat-wind': '💨ಗಾಳಿಯ ವೇಗ',
        'stat-soil': '🧪ಮಣ್ಣಿನ ವಿಧ',
        'stat-season': '🌤️ಪ್ರಸ್ತುತ ಸೀಸನ್',
        'stat-condition': '☁️ಸ್ಥಿತಿ',
        'stat-risk': '⚠️ಅಪಾಯದ ಎಚ್ಚರಿಕೆ',
        'dist-agri-profile': '📍 ಜಿಲ್ಲಾ ಕೃಷಿ ವಿವರ',
        'dist-safety-profile': '🛡️ ಜಿಲ್ಲಾ ಸುರಕ್ಷತಾ ವಿವರ',

        // Advice Categories
        'advice-public': '🗣️ ಸಾರ್ವಜನಿಕರಿಗೆ ಸಲಹೆ',
        'health-wellness': '🏃 ಆರೋಗ್ಯ ಮತ್ತು ಕ್ಷೇಮ',
        'commute-travel': '🚗 ಪ್ರಯಾಣ ಮತ್ತು ಸಂಚಾರ',
        'household-outdoor': '🏠 ಮನೆ ಮತ್ತು ಹೊರಾಂಗಣ',
        'safety-tips': '🛡️ ಸುರಕ್ಷತಾ ಸಲಹೆಗಳು',
        'irrigation-advice': '💦 ನೀರಾವರಿ ಸಲಹೆ',
        'recommended-crops': '🌾 ಶಿಫಾರಸು ಮಾಡಿದ ಬೆಳೆಗಳು',

        // Footer & Branding
        'footer-desc': 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ AI-ಆಧಾರಿತ ಹವಾಮಾನ ಸಲಹಾ ವ್ಯವಸ್ಥೆ. ರೈತರು ಮತ್ತು ನಾಗರಿಕರಿಗೆ ನೈಜ-ಸಮಯದ ಅಪಾಯದ ಮುನ್ಸೂಚನೆಗಳು ಮತ್ತು ಕೃಷಿ ಬುದ್ಧಿವಂತಿಕೆಯೊಂದಿಗೆ ಸಬಲೀಕರಣ.',
        'services': 'ಸೇವೆಗಳು',
        'support': 'ಬೆಂಬಲ',
        'contact': 'ಸಂಪರ್ಕ',
        'help-center': 'ಸಹಾಯ ಕೇಂದ್ರ',
        'privacy-policy': 'ಗೌಪ್ಯತಾ ನೀತಿ',
        'terms-use': 'ಬಳಕೆಯ ನಿಯಮಗಳು',
        'made-with': 'ಪ್ರೀತಿಯಿಂದ ತಯಾರಿಸಲಾಗಿದೆ',
        'karnataka-caps': 'ಕರ್ನಾಟಕ',
        'all-rights': 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',

        // General
        'loading': 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...',
        'select-first': 'ದಯವಿಟ್ಟು ಮೊದಲು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ದುಕೊಳ್ಳಿ.',
        'loading-districts': 'ಜಿಲ್ಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        'search': 'ಹುಡುಕಿ',
        'no-alerts': 'ಯಾವುದೇ ಹೊಸ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ',
        'enable-alerts-btn': 'SMS/ಅಪ್ಲಿಕೇಶನ್ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',

        // Registration & Avatar
        'choose-avatar': 'ನಿಮ್ಮ ಅವತಾರವನ್ನು ಆರಿಸಿ',
        'upload-photo': '📁 ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
        'take-photo': '📸 ಫೋಟೋ ತೆಗಿಯಿರಿ',
        'send-otp': 'OTP ಕಳುಹಿಸಿ',
        'verify-otp': 'ದೃಢೀಕರಿಸಿ',
        'resend-otp': 'OTP ಮತ್ತೆ ಕಳುಹಿಸಿ',
        'otp-sent-label': 'ಮೊಬೈಲ್‌ಗೆ ಬಂದ OTP ನಮೂದಿಸಿ',

        // Profile & Settings
        'edit-profile': 'ವಿವರಗಳನ್ನು ಎಡಿಟ್ ಮಾಡಿ',
        'save-changes': 'ಬದಲಾವಣೆಗಳನ್ನು ಉಳಿಸಿ',
        'logout': 'ಲಾಗ್ ಔಟ್',
        'user-settings': 'ಬಳಕೆದಾರರ ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        'change-avatar': 'ಅವತಾರ ಬದಲಾಯಿಸಿ',
        'account-info': 'ಖಾತೆ ಮಾಹಿತಿ',
        'profile-details': '👤 ವೈಯಕ್ತಿಕ ವಿವರಗಳು',
        'edit-in-settings': '✏️ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಎಡಿಟ್ ಮಾಡಿ',
        'role': 'ಪಾತ್ರ',
        'settings-title': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        'settings-desc': 'ನಿಮ್ಮ ಖಾತೆಯ ಆದ್ಯತೆಗಳು ಮತ್ತು ಪ್ರೊಫೈಲ್ ವಿವರಗಳನ್ನು ನಿರ್ವಹಿಸಿ.',
        'save-profile': 'ಪ್ರೊಫೈಲ್ ಉಳಿಸಿ',
        'cancel': 'ರದ್ದುಮಾಡಿ',
        'btn-edit': '✏️ ಎಡಿಟ್',
        'save-alerts': 'ಎಚ್ಚರಿಕೆ ಮಾಹಿತಿಯನ್ನು ಉಳಿಸಿ',
        'enable-alerts': 'SMS/ಅಪ್ಲಿಕೇಶನ್ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಸಕ್ರಿಯಗೊಳಿಸಿ',
        'app-preferences': 'ಅಪ್ಲಿಕೇಶನ್ ಆದ್ಯತೆಗಳು',
        'nav-profile': 'ಪ್ರೊಫೈಲ್',
        'nav-settings': 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
        'nav-logout': 'ಲಾಗ್ ಔಟ್',
        // Rainfall Dashboard
        'rainfall-dashboard': '🌧️ ಮಳೆ ಮುನ್ಸೂಚನೆ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
        'rainfall-desc': 'ಕರ್ನಾಟಕದ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಮಾಸಿಕ ಮಳೆ, ತಾಪಮಾನ ಮತ್ತು ಆರ್ದ್ರತೆಯ ಮಾದರಿಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ',
        'annual-rainfall': 'ವಾರ್ಷಿಕ ಮಳೆ (ಮಿಮೀ)',
        'peak-month': 'ಅತಿ ಹೆಚ್ಚು ಮಳೆಯಾಗುವ ತಿಂಗಳು',
        'avg-temp': 'ಸರಾಸರಿ ತಾಪಮಾನ (°C)',
        'avg-humidity': 'ಸರಾಸರಿ ಆರ್ದ್ರತೆ (%)',
        'predicted-annual': 'ಮುನ್ಸೂಚಿತ ವಾರ್ಷಿಕ ಮಳೆ',
        'monthly-dist': 'ಮಾಸಿಕ ಮಳೆ ಹಂಚಿಕೆ',
        'temp-trend': 'ತಾಪಮಾನದ ಪ್ರವೃತ್ತಿ (°C)',
        'humidity-trend': 'ಆರ್ದ್ರತೆಯ ಪ್ರವೃತ್ತಿ (%)',
        'mm-year': 'ಮಿಮೀ / ವರ್ಷ',
        // Soil Dashboard
        'soil-dashboard': '🌱 ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಮಣ್ಣಿನ ವಿಧಗಳು',
        'soil-desc-long': 'ಕ್ಲೈಮೇಟ್‌ಗಾರ್ಡ್ ಡೇಟಾಸೆಟ್‌ನಿಂದ ವಿಶ್ಲೇಷಿಸಲಾಗಿದೆ',
        'state-soil-dist': 'ರಾಜ್ಯ ಮಣ್ಣಿನ ಹಂಚಿಕೆ',
        'npk-profile': '🧪 NPK ಪೋಷಕಾಂಶದ ಪ್ರೊಫೈಲ್',
        'management-tip': '💡 ನಿರ್ವಹಣಾ ಸಲಹೆ',
        'top-regions': '📍 ಪ್ರಮುಖ ಪ್ರದೇಶಗಳು',
        'best-crops-label': '🌾 ಅತ್ಯುತ್ತಮ ಬೆಳೆಗಳು',
        'legend': 'ಸೂಚಕ',
        // Forest Dashboard
        'forest-dashboard': '🌲 ಕರ್ನಾಟಕ ಅರಣ್ಯ ಮಾನಿಟರಿಂಗ್',
        'forest-desc-long': 'ಅರಣ್ಯ ವ್ಯಾಪ್ತಿ ಮತ್ತು ಜಿಲ್ಲಾ ಒಳನೋಟಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
        'forest-highlights': 'ಅರಣ್ಯ ಮುಖ್ಯಾಂಶಗಳು',
        'total-forest-area': 'ಒಟ್ಟು ಅರಣ್ಯ ಪ್ರದೇಶ',
        'forest-coverage': 'ಅರಣ್ಯ ವ್ಯಾಪ್ತಿ',
        'coverage-snapshot': 'ವ್ಯಾಪ್ತಿಯ ಸ್ನ್ಯಾಪ್‌ಶಾಟ್',
        'peak-fire-risk': 'ಗರಿಷ್ಠ ಬೆಂಕಿಯ ಅಪಾಯದ ಅವಧಿ',
        'top-forest-dist': 'ಪ್ರದೇಶದ ಪ್ರಕಾರ ಪ್ರಮುಖ ಅರಣ್ಯ ಜಿಲ್ಲೆಗಳು',
        'all-forest-dist-title': 'ಎಲ್ಲಾ ಅರಣ್ಯ ಜಿಲ್ಲೆಗಳು',
        'state-forest-desc': 'ಪೂರಕ ಅನಾಲಿಟಿಕ್ಸ್‌ನೊಂದಿಗೆ ಸಂವಾದಾತ್ಮಕ ಜಿಲ್ಲಾ ಮಟ್ಟದ ಅರಣ್ಯ ವೀಕ್ಷಣೆ.',
        'forest-insights-desc': 'ಜಾಗೃತಿ, ಯೋಜನೆ ಮತ್ತು ಜಿಲ್ಲಾ ಮಟ್ಟದ ಮೇಲ್ವಿಚಾರಣೆಯನ್ನು ಬೆಂಬಲಿಸಲು ಹೆಚ್ಚುವರಿ ಸೂಚಕಗಳು.',
        // Crop Dashboard
        'crop-dashboard': '🌾 ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಬೆಳೆಗಳು',
        'crop-desc-long': 'ಕೃಷಿ ಹಂಚಿಕೆ ಮತ್ತು ಉತ್ತಮ ಪದ್ಧತಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ',
        'state-crop-desc': 'ಕರ್ನಾಟಕದ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಬೆಳೆಯುವ ಪ್ರಾಥಮಿಕ ಬೆಳೆಗಳನ್ನು ದೃಶ್ಯೀಕರಿಸುವುದು. ಹಂಚಿಕೆಯನ್ನು ನೋಡಲು ಜಿಲ್ಲೆಯ ಅಥವಾ ಬೆಳೆ ಕಾರ್ಡ್‌ನ ಮೇಲೆ ಸುಳಿದಾಡಿ.',
        'crop-legend': 'ಬೆಳೆ ಸೂಚಕ',
        'growing-season': 'ಬೆಳೆಯುವ ಋತು',
        'ideal-soils': 'ಸೂಕ್ತವಾದ ಮಣ್ಣು',
        'risks-mgmt': 'ಅಪಾಯಗಳು ಮತ್ತು ನಿರ್ವಹಣೆ',
        'footer-rainfall': '© 2026 ಕ್ಲೈಮೇಟ್‌ಗಾರ್ಡ್ | ಮಳೆ ವಿಶ್ಲೇಷಣೆ',
        'footer-soil': '© 2026 ಕ್ಲೈಮೇಟ್‌ಗಾರ್ಡ್ | ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ',
        'footer-forest': '© 2026 ಕ್ಲೈಮೇಟ್‌ಗಾರ್ಡ್ | ಅರಣ್ಯ ಮಾನಿಟರಿಂಗ್',
        'footer-crop': '© 2026 ಕ್ಲೈಮೇಟ್‌ಗಾರ್ಡ್ | ಬೆಳೆ ಸಲಹೆ',
        'loading-districts': 'ಜಿಲ್ಲೆಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        'ph': 'ಸಾಮಾನ್ಯ pH',
        'texture': 'ವಿನ್ಯಾಸ',
        'water-capacity': 'ನೀರಿನ ಸಾಮರ್ಥ್ಯ',
        'drainage': 'ಒಳಚರಂಡಿ',
        'organic-carbon': 'ಸಾವಯವ ಇಂಗಾಲ',
        'wildlife-sanctuaries': 'ವನ್ಯಜೀವಿ ಅಭಯಾರಣ್ಯಗಳು',
        'fire-risk-index': 'ಬೆಂಕಿ ಅಪಾಯದ ಸೂಚ್ಯಂಕ',
        'moderate': 'ಮಧ್ಯಮ',
        'districts-tracked': 'ಟ್ರ್ಯಾಕ್ ಮಾಡಲಾದ ಜಿಲ್ಲೆಗಳು',
        'high-cover': 'ಹೆಚ್ಚಿನ ವ್ಯಾಪ್ತಿಯ ಜಿಲ್ಲೆಗಳು (2200+)',
        'medium-cover': 'ಮಧ್ಯಮ ವ್ಯಾಪ್ತಿಯ ಜಿಲ್ಲೆಗಳು (800-2199)',
        'low-cover': 'ಕಡಿಮೆ ವ್ಯಾಪ್ತಿಯ ಜಿಲ್ಲೆಗಳು (<800)',
        'temp': 'ತಾಪಮಾನ',
        'water-need': 'ನೀರಿನ ಅವಶ್ಯಕತೆ',
        'avg-yield': 'ಸರಾಸರಿ ಇಳುವರಿ/ಎಕರೆ',
        'sowing-window': 'ಬತ್ತ ಬಿತ್ತನೆ ಸಮಯ',
        'maturity': 'ಪಕ್ವತೆ',
        'common-pests': 'ಸಾಮಾನ್ಯ ಕೀಟಗಳು',
        'diseases': 'ರೋಗಗಳು',
        'status': 'ಸ್ಥಿತಿ',
        'approx-area': 'ಅಂದಾಜು ಪ್ರದೇಶ',

        // Districts Mapping
        'Bagalkote': 'ಬಾಗಲಕೋಟೆ',
        'Ballari': 'ಬಳ್ಳಾರಿ',
        'Belagavi': 'ಬೆಳಗಾವಿ',
        'Bengaluru Rural': 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
        'Bengaluru Urban': 'ಬೆಂಗಳೂರು ನಗರ',
        'Bidar': 'ಬೀದರ್',
        'Chamarajanagar': 'ಚಾಮರಾಜನಗರ',
        'Chikballapur': 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ',
        'Chikmagalur': 'ಚಿಕ್ಕಮಗಳೂರು',
        'Chitradurga': 'ಚಿತ್ರದುರ್ಗ',
        'Dakshina Kannada': 'ದಕ್ಷಿಣ ಕನ್ನಡ',
        'Davanagere': 'ದಾವಣಗೆರೆ',
        'Dharwad': 'ಧಾರವಾಡ',
        'Gadag': 'ಗದಗ',
        'Hassan': 'ಹಾಸನ',
        'Haveri': 'ಹಾವೇರಿ',
        'Kalaburagi': 'ಕಲಬುರಗಿ',
        'Kodagu': 'ಕೊಡಗು',
        'Kolar': 'ಕೋಲಾರ',
        'Koppal': 'ಕೊಪ್ಪಳ',
        'Mandya': 'ಮಂಡ್ಯ',
        'Mysuru': 'ಮೈಸೂರು',
        'Raichur': 'ರಾಯಚೂರು',
        'Ramanagara': 'ರಾಮನಗರ',
        'Shimoga': 'ಶಿವಮೊಗ್ಗ',
        'Tumakuru': 'ತುಮಕೂರು',
        'Tumkur': 'ತುಮಕೂರು',
        'Bangalore City': 'ಬೆಂಗಳೂರು ನಗರ',
        'Bangalore Rural': 'ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ',
        'Udupi': 'ಉಡುಪಿ',
        'Uttara Kannada': 'ಉತ್ತರ ಕನ್ನಡ',
        'Vijayanagara': 'ವಿಜಯನಗರ',
        'Vijayapura': 'ವಿಜಯಪುರ',
        'Yadgir': 'ಯಾದಗಿರಿ',

        // Crops Mapping
        'maize': 'ಮೆಕ್ಕೆಜೋಳ',
        'sugarcane': 'ಕಬ್ಬು',
        'cotton': 'ಹತ್ತಿ',
        'rice': 'ಭತ್ತ',
        'ragi': 'ರಾಗಿ',
        'pulses': 'ಬೇಳೆಕಾಳುಗಳು',
        'ginger': 'ಶುಂಠಿ',
        'coffee': 'ಕಾಫಿ',
        'tea': 'ಚಹಾ',
        'coconut': 'ತೆಂಗಿನಕಾಯಿ',
        'cocoa': 'ಕೋಕೋ',
        'wheat': 'ಗೋಧಿ',
        'arecanut': 'ಅಡಿಕೆ',
        'pepper': 'ಮೆಣಸು',
        'banana': 'ಬಾಳೆಹಣ್ಣು',
        'paddy': 'ಭತ್ತ',
        'groundnut': 'ಕಡಲೆಕಾಯಿ',
        'sunflower': 'ಸೂರ್ಯಕಾಂತಿ',
        'turmeric': 'ಅರಿಶಿನ',
        'sorghum': 'ಜೋಳ',
        'millets': 'ಸಿರಿಧಾನ್ಯಗಳು',
        'bajra': 'ಸಜ್ಜೆ',
        'jute': 'ಸೆಣಬು',
        'fruits': 'ಹಣ್ಣುಗಳು',
        'vegetables': 'ತರಕಾರಿಗಳು',
        'cashew': 'ಗೋಡಂಬಿ',
        'rubber': 'ರಬ್ಬರ್',
        'barley': 'ಬಾರ್ಲಿ',
        'mustard': 'ಸಾಸಿವೆ',
        'Coastal Karnataka': 'ಕರಾವಳಿ ಕರ್ನಾಟಕ',
        'Coastal belts': 'ಕರಾವಳಿ ತೀರಗಳು',
        'low-lying plains': 'ತಗ್ಗು ಪ್ರದೇಶಗಳು',
        'Coastal belts, low-lying plains': 'ಕರಾವಳಿ ತೀರಗಳು ತಗ್ಗು ಪ್ರದೇಶಗಳು',

        // Soil Types Mapping
        'black': 'ಕಪ್ಪು ಮಣ್ಣು',
        'red': 'ಕೆಂಪು ಮಣ್ಣು',
        'laterite': 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
        'silty-loam': 'ಹೂಳು ಮಣ್ಣು',
        'clay-loam': 'ಜೇಡಿ ಮಣ್ಣು',
        'mixed': 'ಮಿಶ್ರ ಮಣ್ಣು',
        'Sandy Loam': 'ಮರಳು ಗೋಡು ಮಣ್ಣು',
        'Alluvial Soil': 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
        'Loam Soil': 'ಲೋಮ್ ಮಣ್ಣು',
        'Laterite Soil': 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
        'Black Cotton Soil': 'ಕಪ್ಪು ಎರೆಮಣ್ಣು',
        'Red Soil': 'ಕೆಂಪು ಮಣ್ಣು',
        'Clay Loam': 'ಜೇಡಿ ಗೋಡು ಮಣ್ಣು',
        'Silty Loam': 'ಹೂಳು ಗೋಡು ಮಣ್ಣು',
        'Saline Soil': 'ಕ್ಷಾರ ಮಣ್ಣು',
        'soil-red-title': 'ಕೆಂಪು ಮಣ್ಣು',
        'soil-black-title': 'ಕಪ್ಪು ಎರೆಮಣ್ಣು',
        'soil-alluvial-title': 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
        'soil-laterite-title': 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
        'soil-loam-title': 'ಲೋಮ್ ಮಣ್ಣು',
        'soil-clay-loam-title': 'ಜೇಡಿ ಗೋಡು ಮಣ್ಣು',
        'soil-silty-loam-title': 'ಹೂಳು ಗೋಡು ಮಣ್ಣು',
        'soil-saline-soil-title': 'ಕ್ಷಾರ ಮಣ್ಣು',
        'soil-sandy-loam-title': 'ಮರಳು ಗೋಡು ಮಣ್ಣು',
        'soil-legend': '🗺️ ಮಣ್ಣಿನ ವಿಧಗಳ ಸೂಚಿಕೆ',
        'soil-distribution': '📊 ಮಣ್ಣಿನ ಹಂಚಿಕೆ',
        'npk-by-soil-type': '🧪 ಮಣ್ಣಿನ ಪ್ರಕಾರ NPK',
        'npk-radar': '🕸️ NPK ರೇಡಾರ್',
        'ph': 'pH ಮೌಲ್ಯ',
        'texture': 'ಮಣ್ಣಿನ ವಿನ್ಯಾಸ',
        'water-capacity': 'ನೀರು ಹಿಡಿದಿಡುವ ಸಾಮರ್ಥ್ಯ',
        'drainage': 'ಒಳಚರಂಡಿ',
        'organic-carbon': 'ಸಾವಯವ ಇಂಗಾಲ',
        'regions': 'ಪ್ರದೇಶಗಳು',
        'crops': 'ಬೆಳೆಗಳು',
        'tip': 'ಸಲಹೆ',
        'total-yield': 'ಒಟ್ಟು ಇಳುವರಿ',
        'units': 'ಘಟಕಗಳು',
        'top-districts': 'ಪ್ರಮುಖ ಜಿಲ್ಲೆಗಳು',
        'major-crop-karnataka': 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಬೆಳೆ.',
        'check-map-filter': 'ಬದಲಾಗಬಹುದು (ಮ್ಯಾಪ್ ಫಿಲ್ಟರ್ ಪರಿಶೀಲಿಸಿ)',
        'Sandy soil': 'ಮರಳು ಮಣ್ಣು',
        'Less': 'ಕಡಿಮೆ',
        'Medium to fast': 'ಮಧ್ಯಮದಿಂದ ವೇಗ',
        'Tumkur, Kolar, Bangalore City': 'ತುಮಕೂರು, ಕೋಲಾರ, ಬೆಂಗಳೂರು ನಗರ',
        'millet': 'ಸಿರಿಧಾನ್ಯ',
        'maize': 'ಮೆಕ್ಕೆಜೋಳ',
        'peanuts': 'ಕಡಲೆಕಾಯಿ',
        'pulses': 'ಬೇಳೆಕಾಳುಗಳು',
        'Millet': 'ಸಿರಿಧಾನ್ಯ',
        'Maize': 'ಮೆಕ್ಕೆಜೋಳ',
        'Peanuts': 'ಕಡಲೆಕಾಯಿ',
        'Pulses': 'ಬೇಳೆಕಾಳುಗಳು',
        'Intensive use of inorganic fertilizers and organic matter is required.': 'ಅಜೈವಿಕ ರಸಗೊಬ್ಬರಗಳು ಮತ್ತು ಸಾವಯವ ವಸ್ತುಗಳ ತೀವ್ರ ಬಳಕೆಯ ಅಗತ್ಯವಿದೆ.',
        'Low': 'ಕಡಿಮೆ',
        'Moderate': 'ಮಧ್ಯಮ',
        'Medium': 'ಮಧ್ಯಮ',
        'High': 'ಹೆಚ್ಚು',
        'Very High': 'ಅತ್ಯಂತ ಹೆಚ್ಚು',
        'Low to Medium': 'ಕಡಿಮೆಯಿಂದ ಮಧ್ಯಮ',
        'Moderate to High': 'ಮಧ್ಯಮದಿಂದ ಹೆಚ್ಚು',
        'Low to Moderate': 'ಕಡಿಮೆಯಿಂದ ಮಧ್ಯಮ',
        'Unknown': 'ಗೊತ್ತಿಲ್ಲ',
        '10-12 months': '10-12 ತಿಂಗಳು',
        '10-14 months': '10-14 ತಿಂಗಳು',
        '5-7 years': '5-7 ವರ್ಷಗಳು',
        '3-4 months': '3-4 ತಿಂಗಳು',
        '5-6 months': '5-6 ತಿಂಗಳು',
        '4-5 months': '4-5 ತಿಂಗಳು',
        '3-4 years': '3-4 ವರ್ಷಗಳು',
        '2-3 months': '2-3 ತಿಂಗಳು',
        '7-8 months': '7-8 ತಿಂಗಳು',
        '3+ years': '3+ ವರ್ಷಗಳು',
        'Plant ratoon crop after harvest.': 'ಕಟಾವಿನ ನಂತರ ಕೂಳೆ ಬೆಳೆಯಿರಿ.',
        'Desuckering and propping are critical.': 'ಕಂದು ತೆಗೆಯುವುದು ಮತ್ತು ಆಸರೆ ನೀಡುವುದು ಅತ್ಯಗತ್ಯ.',
        'Regular irrigation during dry months.': 'ಒಣ ತಿಂಗಳುಗಳಲ್ಲಿ ನಿಯಮಿತ ನೀರಾವರಿ ಒದಗಿಸಿ.',
        'Maintain 5cm water in paddy field.': 'ಭತ್ತದ ಗದ್ದೆಯಲ್ಲಿ 5 ಸೆಂ.ಮೀ ನೀರು ನಿಲ್ಲಿಸಿ.',
        'Same as rice cultivation.': 'ಭತ್ತದ ಕೃಷಿಯಂತೆಯೇ.',
        'Earthing up prevents lodging.': 'ಮಣ್ಣು ಏರಿಸುವುದರಿಂದ ಸಸ್ಯ ಬೀಳುವುದನ್ನು ತಪ್ಪಿಸಬಹುದು.',
        'Monitor for bollworm.': 'ಕಾಯಿಕೊರಕ ಹುಳುವಿನ ಬಗ್ಗೆ ನಿಗಾವಹಿಸಿ.',
        'First irrigation at crown root stage.': 'ಕ್ರೌನ್ ರೂಟ್ ಹಂತದಲ್ಲಿ ಮೊದಲ ನೀರಾವರಿ.',
        'Drought tolerant millet crop.': 'ಬರ ಸಹಿಷ್ಣು ಸಿರಿಧಾನ್ಯ ಬೆಳೆ.',
        'Apply gypsum at flowering.': 'ಹೂಬಿಡುವ ಹಂತದಲ್ಲಿ ಜಿಪ್ಸಂ ಸೇರಿಸಿ.',
        '50% shade is ideal for arabica.': 'ಅರೇಬಿಕಾಗೆ 50% ನೆರಳು ಸೂಕ್ತ.',
        'Pulses fix their own nitrogen.': 'ಬೇಳೆಕಾಳುಗಳು ಸ್ವತಃ ಸಾರಜನಕವನ್ನು ಹೀರಿಕೊಳ್ಳುತ್ತವೆ.',
        'Mulch heavily for best results.': 'ಉತ್ತಮ ಫಲಿತಾಂಶಕ್ಕಾಗಿ ಒಣಹುಲ್ಲಿನ ಹೊದಿಕೆ ಬಳಸಿ.',
        'Bee pollination improves seed set.': 'ಜೇನುನೊಣಗಳಿಂದ ಪರಾಗಸ್ಪರ್ಶವಾದರೆ ಬೀಜ ಕಟ್ಟುವಿಕೆ ಉತ್ತಮವಾಗುತ್ತದೆ.',
        'Rotate with legumes after turmeric.': 'ಅರಿಶಿನದ ನಂತರ ದ್ವಿದಳ ಧಾನ್ಯಗಳನ್ನು ಬೆಳೆ ಪರಿವರ್ತನೆ ಮಾಡಿ.',
        'Excellent drought-tolerant crop.': 'ಉತ್ತಮ ಬರ ಸಹಿಷ್ಣು ಬೆಳೆ.',
        'Train on support standards.': 'ಆಸರೆ ಕಂಬಗಳ ಮೇಲೆ ಬಳ್ಳಿ ಹಬ್ಬಿಸಿ.',
        'Prune for best leaf quality.': 'ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಎಲೆಗಳಿಗಾಗಿ ಕತ್ತರಿಸಿ.',
        'Needs 50% shade.': '50% ನೆರಳು ಬೇಕು.',
        'Hardy crops needing minimal water.': 'ಕಡಿಮೆ ನೀರಿನ ಅಗತ್ಯವಿರುವ ಗಟ್ಟಿಮುಟ್ಟಾದ ಬೆಳೆಗಳು.',
        'Excellent for arid regions.': 'ಒಣ ಪ್ರದೇಶಗಳಿಗೆ ಅತ್ಯುತ್ತಮ.',
        'Needs warm humid climate.': 'ಬೆಚ್ಚಗಿನ ಆರ್ದ್ರ ಹವಾಮಾನದ ಅಗತ್ಯವಿದೆ.',
        'nitrogen': 'ಸಾರಜನಕ (N)',
        'phosphorus': 'ರಂಜಕ (P)',
        'potassium': 'ಪೊಟ್ಯಾಸಿಯಮ್ (K)',
        'Sandy loam is made up of sand with silt and clay and is good for drainage.': 'ಮರಳು, ಹೂಳು ಮತ್ತು ಜೇಡಿಮಣ್ಣಿನಿಂದ ಕೂಡಿದ ಮರಳು ಗೋಡು ಮಣ್ಣು ಉತ್ತಮ ಒಳಚರಂಡಿಗೆ ಸೂಕ್ತವಾಗಿದೆ.',
        'Alluvial soil is fertile and common in river and coastal areas.': 'ಮೆಕ್ಕಲು ಮಣ್ಣು ಫಲವತ್ತಾಗಿದ್ದು, ನದಿ ಮತ್ತು ಕರಾವಳಿ ಪ್ರದೇಶಗಳಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿದೆ.',
        'Loam is balanced in sand, silt, and clay and is ideal for farming.': 'ಲೋಮ್ ಮಣ್ಣಿನಲ್ಲಿ ಮರಳು, ಹೂಳು ಮತ್ತು ಜೇಡಿಮಣ್ಣಿನ ಸಮತೋಲನವಿದ್ದು, ಕೃಷಿಗೆ ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ.',
        'Laterite soil is rich in iron and aluminium and generally nutrient-poor.': 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು ಕಬ್ಬಿಣ ಮತ್ತು ಅಲ್ಯೂಮಿನಿಯಂನಿಂದ ಸಮೃದ್ಧವಾಗಿದ್ದರೂ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆ ಹೊಂದಿದೆ.',
        'Black soil has high moisture retention and supports many cash crops.': 'ಕಪ್ಪು ಮಣ್ಣು ಹೆಚ್ಚಿನ ತೇವಾಂಶವನ್ನು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುತ್ತದೆ ಮತ್ತು ಅನೇಕ ವಾಣಿಜ್ಯ ಬೆಳೆಗಳನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ.',
        'Red soil is usually low in nutrients and needs proper fertilization.': 'ಕೆಂಪು ಮಣ್ಣಿನಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಪೋಷಕಾಂಶಗಳ ಕೊರತೆಯಿದ್ದು, ಸೂಕ್ತ ರಸಗೊಬ್ಬರದ ಅಗತ್ಯವಿದೆ.',
        'Clay loam is fertile and moisture-retentive, suited for field crops with good nutrient supply and proper drainage management.': 'ಜೇಡಿ ಗೋಡು ಮಣ್ಣು ಫಲವತ್ತಾಗಿದ್ದು, ಉತ್ತಮ ಪೋಷಕಾಂಶಗಳನ್ನು ಹೊಂದಿರುವ ಬೆಳೆಗಳಿಗೆ ಸೂಕ್ತವಾಗಿದೆ.',
        'Silty loam provides good fertility and root penetration, making it suitable for cereals, pulses, and vegetable cultivation.': 'ಹೂಳು ಗೋಡು ಮಣ್ಣು ಉತ್ತಮ ಫಲವತ್ತತೆ ನೀಡಲಿದ್ದು, ಏಕದಳ, ದ್ವಿದಳ ಮತ್ತು ತರಕಾರಿ ಕೃಷಿಗೆ ಸೂಕ್ತವಾಗಿದೆ.',
        'Saline soils contain excess soluble salts and need reclamation methods to improve productivity and root health.': 'ಕ್ಷಾರ ಮಣ್ಣು ಹೆಚ್ಚುವರಿ ಲವಣಗಳನ್ನು ಒಳಗೊಂಡಿದ್ದು, ಫಸಲು ಸುಧಾರಿಸಲು ಪರಿಹಾರ ಕ್ರಮಗಳ ಅಗತ್ಯವಿದೆ.',
        'Apply organic mulch to retain moisture and use split fertilizer applications.': 'ತೇವಾಂಶವನ್ನು ಉಳಿಸಿಕೊಳ್ಳಲು ಸಾವಯವ ಹೊದಿಕೆಯನ್ನು ಬಳಸಿ ಮತ್ತು ರಸಗೊಬ್ಬರವನ್ನು ಹಂತ-ಹಂತವಾಗಿ ನೀಡಿ.',
        'Maintain proper drainage systems to prevent waterlogging during monsoons.': 'ಮಳೆಗಾಲದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ತಪ್ಪಿಸಲು ಸರಿಯಾದ ಒಳಚರಂಡಿ ವ್ಯವಸ್ಥೆಯನ್ನು ನಿರ್ವಹಿಸಿ.',
        'Standard crop rotation and minimal tilling to maintain its natural structure.': 'ನೈಸರ್ಗಿಕ ವಿನ್ಯಾಸವನ್ನು ಕಾಪಾಡಿಕೊಳ್ಳಲು ಬೆಳೆ ತಿರುಗುವಿಕೆ ಮತ್ತು ಕನಿಷ್ಠ ಉಳುಮೆ ಅನುಸರಿಸಿ.',
        'Heavy application of organic manure and lime to balance high acidity.': 'ಹೆಚ್ಚಿನ ಆಮ್ಲೀಯತೆಯನ್ನು ಸಮತೋಲನಗೊಳಿಸಲು ಸಾವಯವ ಗೊಬ್ಬರ ಮತ್ತು ಸುಣ್ಣವನ್ನು ಹೆಚ್ಚಿನ ಪ್ರಮಾಣದಲ್ಲಿ ಸೇರಿಸಿ.',
        'Avoid heavy machinery when wet to prevent compaction; use deep plowing in summer.': 'ತೇವವಿರುವಾಗ ಭಾರೀ ಯಂತ್ರಗಳನ್ನು ಬಳಸಬೇಡಿ; ಬೇಸಿಗೆಯಲ್ಲಿ ಆಳವಾದ ಉಳುಮೆ ಮಾಡಿ.',
        'Requires intensive application of inorganic fertilizers and organic matter.': 'ಅಜೈವಿಕ ರಸಗೊಬ್ಬರ ಮತ್ತು ಸಾವಯವ ವಸ್ತುಗಳ ತೀವ್ರ ಬಳಕೆಯ ಅಗತ್ಯವಿದೆ.',
        'Use raised beds and avoid over-irrigation in heavy rain periods.': 'ಎತ್ತರದ ಬೆಡ್‌ಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಅತಿಯಾದ ನೀರು ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಿ.',
        'Mulching helps reduce surface crusting and improves moisture retention.': 'ಮೇಲ್ಮೈ ಕವಚ ಕಡಿಮೆ ಮಾಡಲು ಮತ್ತು ತೇವಾಂಶ ಉಳಿಸಲು ಹೊದಿಕೆ ಮಾಡುವುದು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
        'Apply gypsum and ensure good drainage with periodic leaching.': 'ಜಿಪ್ಸಂ ಅನ್ವಯಿಸಿ ಮತ್ತು ಆಗಾಗ್ಗೆ ನೀರು ಹಾಯಿಸಿ ಉಪ್ಪು ತೊಳೆಯುವಿಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        'Gritty and crumbly': 'ಒರಟು ಮತ್ತು ಪುಡಿಪುಡಿಯಾದ',
        'Silty to loamy': 'ಹೂಳು ಮಿಶ್ರಿತ ಗೋಡು',
        'Soft and balanced': 'ಮೃದು ಮತ್ತು ಸಮತೋಲಿತ',
        'Coarse to clayey': 'ಒರಟಾದ ಜೇಡಿಮಣ್ಣು',
        'Clayey': 'ಜೇಡಿಮಣ್ಣು',
        'Sandy to loamy': 'ಮರಳು ಮಿಶ್ರಿತ ಗೋಡು',
        'Fine and sticky': 'ಸೂಕ್ಷ್ಮ ಮತ್ತು ಜಿಗುಟಾದ',
        'Smooth and soft': 'ನಯವಾದ ಮತ್ತು ಮೃದುವಾದ',
        'Variable': 'ಬದಲಾಗುವ',
        'Low to Moderate': 'ಮಧ್ಯಮದಿಂದ ಕಡಿಮೆ',
        'Moderate to Low': 'ಮಧ್ಯಮದಿಂದ ಕಡಿಮೆ',
        'Adequate': 'ಸಾಕಷ್ಟು',
        'Medium to High': 'ಮಧ್ಯಮದಿಂದ ಹೆಚ್ಚು',
        'Deficient': 'ಕೊರತೆ',
        'Poor': 'ಕಳಪೆ',
        'Moderate to Fast': 'ಮಧ್ಯಮದಿಂದ ವೇಗ',
        'Moderate to Slow': 'ಮಧ್ಯಮದಿಂದ ನಿಧಾನ',
        'Fast': 'ವೇಗ',
        'Slow': 'ನಿಧಾನ',

        // Additional soil/crop/forest dynamic text
        'Black soil': 'ಕಪ್ಪು ಮಣ್ಣು',
        'Red soil': 'ಕೆಂಪು ಮಣ್ಣು',
        'Laterite soil': 'ಲ್ಯಾಟರೈಟ್ ಮಣ್ಣು',
        'Loam soil': 'ಲೋಮ್ ಮಣ್ಣು',
        'Alluvial soil': 'ಮೆಕ್ಕಲು ಮಣ್ಣು',
        'Sandy loam': 'ಮರಳು ಗೋಡು ಮಣ್ಣು',
        'Clay loam': 'ಜೇಡಿ ಗೋಡು ಮಣ್ಣು',
        'Silty loam': 'ಹೂಳು ಗೋಡು ಮಣ್ಣು',
        'Saline soil': 'ಕ್ಷಾರ ಮಣ್ಣು',
        'Clay': 'ಜೇಡಿಮಣ್ಣು',
        'Sandy': 'ಮರಳು',
        'Loamy': 'ಗೋಡು',
        'Silty': 'ಹೂಳು',
        'Very high': 'ಅತ್ಯಂತ ಹೆಚ್ಚು',
        'Belgaum': 'ಬೆಳಗಾವಿ',
        'Bellary': 'ಬಳ್ಳಾರಿ',
        'Tumkur': 'ತುಮಕೂರು',
        'Mysore': 'ಮೈಸೂರು',
        'Bangalore': 'ಬೆಂಗಳೂರು',
        'Shimoga': 'ಶಿವಮೊಗ್ಗ',
        'Shivamogga': 'ಶಿವಮೊಗ್ಗ',
        'Chikkamagaluru': 'ಚಿಕ್ಕಮಗಳೂರು',
        'Forest Area': 'ಅರಣ್ಯ ಪ್ರದೇಶ',
        'Forest Density': 'ಅರಣ್ಯ ಸಾಂದ್ರತೆ',
        'Forest Area (sq km)': 'ಅರಣ್ಯ ಪ್ರದೇಶ (ಚ.ಕಿ.ಮೀ)',
        'sq km': 'ಚ.ಕಿ.ಮೀ',
        'Data unavailable': 'ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ',
        'Yield': 'ಇಳುವರಿ',
        'Area': 'ಪ್ರದೇಶ',
        'Top Crop': 'ಪ್ರಮುಖ ಬೆಳೆ',
        'units': 'ಘಟಕಗಳು',
        'hectares': 'ಹೆಕ್ಟೇರ್',
        'None': 'ಯಾವುದೂ ಇಲ್ಲ',
        'Crop Yield (Units)': 'ಬೆಳೆ ಇಳುವರಿ (ಘಟಕಗಳು)',
        'Total Yield by District': 'ಜಿಲ್ಲೆಯ ಪ್ರಕಾರ ಒಟ್ಟು ಇಳುವರಿ',
        'No data for selection.': 'ಆಯ್ಕೆಗೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.',
        'No crop data available to display.': 'ಪ್ರದರ್ಶಿಸಲು ಬೆಳೆ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ.',
        'Various': 'ವಿವಿಧ',
        'Not available.': 'ಲಭ್ಯವಿಲ್ಲ.',
        'No specific tip available.': 'ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಸಲಹೆ ಲಭ್ಯವಿಲ್ಲ.',
        'Rice': 'ಭತ್ತ',
        'Wheat': 'ಗೋಧಿ',
        'Sugarcane': 'ಕಬ್ಬು',
        'Cotton': 'ಹತ್ತಿ',
        'Maize': 'ಮೆಕ್ಕೆಜೋಳ',
        'Ragi': 'ರಾಗಿ',
        'Coffee': 'ಕಾಫಿ',
        'Tea': 'ಚಹಾ',
        'Coconut': 'ತೆಂಗಿನಕಾಯಿ',
        'Ginger': 'ಶುಂಠಿ',
        'Groundnut': 'ಕಡಲೆಕಾಯಿ',
        'Sunflower': 'ಸೂರ್ಯಕಾಂತಿ',
        'Turmeric': 'ಅರಿಶಿನ',
        'Sorghum': 'ಜೋಳ',
        'Arecanut': 'ಅಡಿಕೆ',
        'Pepper': 'ಮೆಣಸು',
        'Banana': 'ಬಾಳೆಹಣ್ಣು',
        'Cocoa': 'ಕೋಕೋ',
        'Cashew': 'ಗೋಡಂಬಿ',
        'Rubber': 'ರಬ್ಬರ್',
        'Barley': 'ಬಾರ್ಲಿ',
        'Mustard': 'ಸಾಸಿವೆ',
        'Jute': 'ಸೆಣಬು',
        'Paddy': 'ಭತ್ತ',
        'Fruits': 'ಹಣ್ಣುಗಳು',
        'Vegetables': 'ತರಕಾರಿಗಳು',
        'Millets': 'ಸಿರಿಧಾನ್ಯಗಳು',
        'Bajra': 'ಸಜ್ಜೆ',

        // Crop Info Dashboard Mapping
        'seasonal-focus': 'ಋತುಮಾನದ ಗಮನ',
        'typical-farming-periods': 'ಕರ್ನಾಟಕದಲ್ಲಿ ಪ್ರಮುಖ ಕೃಷಿ ಅವಧಿಗಳು:',
        'kharif-monsoon': 'ಖಾರಿಫ್ (ಮುಂಗಾರು):',
        'kharif-desc': 'ಜೂನ್‌ನಿಂದ ಅಕ್ಟೋಬರ್. ಪ್ರಮುಖ ಬೆಳೆಗಳು: ಭತ್ತ, ಮೆಕ್ಕೆಜೋಳ, ಹತ್ತಿ, ರಾಗಿ.',
        'rabi-winter': 'ರಬಿ (ಹಿಂಗಾರು):',
        'rabi-desc': 'ಅಕ್ಟೋಬರ್‌ನಿಂದ ಮಾರ್ಚ್. ಪ್ರಮುಖ ಬೆಳೆಗಳು: ಗೋಧಿ, ಜೋಳ, ಕಡಲೆ.',
        'summer-focus': 'ಬೇಸಿಗೆ:',
        'summer-desc': 'ಮಾರ್ಚ್‌ನಿಂದ ಜೂನ್. ನೀರಾವರಿಯಾಶ್ರಿತ ಬೆಳೆಗಳು.',
        'note': 'ಸೂಚನೆ:',
        'rainfall-crucial': 'ಖಾರಿಫ್ ಋತುವಿನಲ್ಲಿ ಮಳೆಯ ಪಾತ್ರ ಅತ್ಯಂತ ನಿರ್ಣಾಯಕವಾಗಿದೆ.',
        'loading-district': 'ಜಿಲ್ಲೆಗಳ ಶ್ರೇಯಾಂಕವನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        'major-crops-overview': 'ಪ್ರಮುಖ ಬೆಳೆಗಳ ಅವಲೋಕನ',
        'key-crops-cultivated': 'ಕರ್ನಾಟಕದಾದ್ಯಂತ ಬೆಳೆಯುವ ಪ್ರಮುಖ ಬೆಳೆಗಳು ಮತ್ತು ಅವುಗಳ ವಿವರಗಳು.',
        'crop-details': 'ಬೆಳೆಯ ವಿವರಗಳು',
        'farming-tip': 'ಕೃಷಿ ಸಲಹೆ',
        'All Seasons': 'ಎಲ್ಲಾ ಋತುಗಳು',
        'Kharif': 'ಖಾರಿಫ್',
        'Rabi': 'ರಬಿ',
        'Summer': 'ಬೇಸಿಗೆ',
        'Whole Year': 'ಇಡೀ ವರ್ಷ',
        'All Crops': 'ಎಲ್ಲಾ ಬೆಳೆಗಳು',

        // Forest Dashboard Mapping
        'bandipur-title': 'ಬಂಡೀಪುರ ಅರಣ್ಯ',
        'Bandipur Forest': 'ಬಂಡೀಪುರ ಅರಣ್ಯ',
        'Bandipur is one of Karnataka\'s most important protected forest landscapes and a key part of the Nilgiri biosphere region.': 'ಬಂಡೀಪುರವು ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ಸಂರಕ್ಷಿತ ಅರಣ್ಯ ಪ್ರದೇಶಗಳಲ್ಲಿ ಒಂದಾಗಿದ್ದು, ನೀಲಗಿರಿ ಜೀವಗೋಳದ ಪ್ರಮುಖ ಭಾಗವಾಗಿದೆ.',
        'National Park and Tiger Reserve': 'ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಮತ್ತು ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'bandipur-status': 'ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಮತ್ತು ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'Dry deciduous and moist deciduous forests': 'ಒಣ-ಎಲೆ ಉದುರುವ ಮತ್ತು ತೇವಾಂಶವುಳ್ಳ ಎಲೆ ಉದುರುವ ಕಾಡುಗಳು',
        'Dry deciduous and moist deciduous': 'ಒಣ-ಎಲೆ ಉದುರುವ ಮತ್ತು ತೇವಾಂಶವುಳ್ಳ ಎಲೆ ಉದುರುವ ಕಾಡುಗಳು',
        'bandipur-type': 'ಒಣ-ಎಲೆ ಉದುರುವ ಮತ್ತು ತೇವಾಂಶವುಳ್ಳ ಎಲೆ ಉದುರುವ ಕಾಡುಗಳು',
        'Approx. 870 sq km': 'ಅಂದಾಜು 870 ಚದರ ಕಿ.ಮೀ',
        'Tiger, elephant, gaur, dhole, spotted deer, and rich birdlife.': 'ಹುಲಿ, ಆನೆ, ಕಾಡೆಮ್ಮೆ, ಸೀಳುನಾಯಿ, ಚುಕ್ಕೆ ಜಿಂಕೆ ಮತ್ತು ಸಮೃದ್ಧ ಪಕ್ಷಿಸಂಕುಲ.',
        'Connected with Nagarhole, Mudumalai, and Wayanad landscapes, supporting large mammal movement corridors.': 'ನಾಗರಹೊಳೆ, ಮುದುಮಲೈ ಮತ್ತು ವಯನಾಡ್ ಪ್ರದೇಶಗಳಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಿದ್ದು, ಪ್ರಾಣಿಗಳ ಓಡಾಟವನ್ನು ಬೆಂಬಲಿಸುತ್ತದೆ.',

        'nagarhole-title': 'ನಾಗರಹೊಳೆ ಅರಣ್ಯ',
        'Nagarhole Forest': 'ನಾಗರಹೊಳೆ ಅರಣ್ಯ',
        'Mysuru, Kodagu': 'ಮೈಸೂರು, ಕೊಡಗು',
        'Nagarhole is a biodiverse forest system with riverine belts, dense woodland, and long-term tiger conservation focus.': 'ನಾಗರಹೊಳೆ ನದೀತೀರಗಳು, ದಟ್ಟವಾದ ಕಾಡು ಮತ್ತು ಹುಲಿ ಸಂರಕ್ಷಣೆಗೆ ಹೆಸರುವಾಸಿಯಾಗಿದೆ.',
        'Rajiv Gandhi National Park and Tiger Reserve': 'ರಾಜೀವ್ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಮತ್ತು ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'nagarhole-status': 'ರಾಜೀವ್ ಗಾಂಧಿ ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ ಮತ್ತು ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'Tropical mixed, moist deciduous, and riparian forests': 'ಉಷ್ಣವಲಯದ ಮಿಶ್ರ, ತೇವಾಂಶವುಳ್ಳ ಎಲೆ ಉದುರುವ ಮತ್ತು ನದೀತೀರದ ಕಾಡುಗಳು',
        'Tropical mixed and deciduous forests': 'ಉಷ್ಣವಲಯದ ಮಿಶ್ರ ಮತ್ತು ಎಲೆ ಉದುರುವ ಕಾಡುಗಳು',
        'nagarhole-type': 'ಉಷ್ಣವಲಯದ ಮಿಶ್ರ ಮತ್ತು ಎಲೆ ಉದುರುವ ಕಾಡುಗಳು',
        'Approx. 640 sq km (core park area)': 'ಅಂದಾಜು 640 ಚದರ ಕಿ.ಮೀ (ಪ್ರಮುಖ ಉದ್ಯಾನವನ ಪ್ರದೇಶ)',
        'Tiger, leopard, elephant, sloth bear, wild dog, and aquatic birds.': 'ಹುಲಿ, ಚಿರತೆ, ಆನೆ, ಕರಡಿ, ಕಾಡುನಾಯಿ, ಮತ್ತು ಜಲಪಕ್ಷಿಗಳು.',
        'Part of a larger contiguous forest belt in southern India with strong wildlife protection value.': 'ದಕ್ಷಿಣ ಭಾರತದಲ್ಲಿ ಬಲವಾದ ವನ್ಯಜೀವಿ ಸಂರಕ್ಷಣಾ ಮೌಲ್ಯವನ್ನು ಹೊಂದಿರುವ ದೊಡ್ಡ ಕಾಡಿನ ಭಾಗವಾಗಿದೆ.',

        'kudremukh-title': 'ಕುದುರೆಮುಖ ಅರಣ್ಯ',
        'Kudremukh Forest': 'ಕುದುರೆಮುಖ ಅರಣ್ಯ',
        'Chikkamagaluru, Udupi': 'ಚಿಕ್ಕಮಗಳೂರು, ಉಡುಪಿ',
        'Kudremukh represents Western Ghats high-rainfall ecology with montane grasslands and evergreen forest patches.': 'ಕುದುರೆಮುಖವು ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಅಧಿಕ-ಮಳೆಯ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯನ್ನು ಹುಲ್ಲುಗಾವಲುಗಳು ಮತ್ತು ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡುಗಳೊಂದಿಗೆ ಪ್ರತಿನಿಧಿಸುತ್ತದೆ.',
        'National Park (Western Ghats)': 'ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ (ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು)',
        'kudremukh-status': 'ರಾಷ್ಟ್ರೀಯ ಉದ್ಯಾನವನ (ಪಶ್ಚಿಮ ಘಟ್ಟಗಳು)',
        'Evergreen forests, shola patches, and grassland mosaic': 'ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡುಗಳು, ಶೋಲಾ ಕವಚಗಳು ಮತ್ತು ಹುಲ್ಲುಗಾವಲು ಸಂಪರ್ಕ',
        'Evergreen, shola and grassland mosaic': 'ನಿತ್ಯಹರಿದ್ವರ್ಣ, ಶೋಲಾ ಮತ್ತು ಹುಲ್ಲುಗಾವಲು ಸಂಪರ್ಕ',
        'kudremukh-type': 'ನಿತ್ಯಹರಿದ್ವರ್ಣ, ಶೋಲಾ ಮತ್ತು ಹುಲ್ಲುಗಾವಲು ಸಂಪರ್ಕ',
        'Approx. 600 sq km': 'ಅಂದಾಜು 600 ಚದರ ಕಿ.ಮೀ',
        'Lion-tailed macaque, leopard, gaur, sambar, and endemic amphibians.': 'ಸಿಂಗಲೀಕ, ಚಿರತೆ, ಕಾಡೆಮ್ಮೆ, ಸಾಂಬಾರ್, ಮತ್ತು ಸ್ಥಳೀಯ ಉಭಯಚರಗಳು.',
        'Recognized for high endemism and watershed importance in the Western Ghats ecosystem.': 'ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ಪರಿಸರ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಜಲಾನಯನ ಮಹತ್ವಕ್ಕಾಗಿ ಗುರುತಿಸಲ್ಪಟ್ಟಿದೆ.',

        'kali-title': 'ಕಾಳಿ ಅರಣ್ಯ (ದಾಂಡೇಲಿ-ಅಣಶಿ)',
        'Kali Forest (Dandeli-Anshi)': 'ಕಾಳಿ ಅರಣ್ಯ (ದಾಂಡೇಲಿ-ಅಣಶಿ)',
        'Kali landscape includes dense forests and river valleys and is among Karnataka\'s richest wildlife habitats.': 'ಕಾಳಿ ಭೂದೃಶ್ಯವು ಕರ್ನಾಟಕದ ಅತ್ಯಂತ ಶ್ರೀಮಂತ ವನ್ಯಜೀವಿ ಆವಾಸಸ್ಥಾನಗಳಲ್ಲಿ ಒಂದಾಗಿದೆ.',
        'Tiger Reserve': 'ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'kali-status': 'ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'Evergreen and semi-evergreen forests': 'ನಿತ್ಯಹರಿದ್ವರ್ಣ ಮತ್ತು ಅರೆ-ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡುಗಳು',
        'Dense evergreen and semi-evergreen forests': 'ದಟ್ಟ ನಿತ್ಯಹರಿದ್ವರ್ಣ ಮತ್ತು ಅರೆ-ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡುಗಳು',
        'kali-type': 'ದಟ್ಟ ನಿತ್ಯಹರಿದ್ವರ್ಣ ಮತ್ತು ಅರೆ-ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡುಗಳು',
        'Approx. 1300+ sq km (landscape scale)': 'ಅಂದಾಜು 1300+ ಚದರ ಕಿ.ಮೀ (ಭೂದೃಶ್ಯದ ಪ್ರಮಾಣ)',
        'Black panther sightings, tiger, hornbills, king cobra, and giant squirrel.': 'ಕಪ್ಪು ಚಿರತೆ ದರ್ಶನ, ಹುಲಿ, ಹಾರ್ನ್‌ಬಿಲ್‌ಗಳು, ಕಾಳಿಂಗ ಸರ್ಪ, ಮತ್ತು ಮಲಬಾರ್ ಅಳಿಲು.',
        'Important high-canopy forest zone with significant ecological connectivity and protected corridors.': 'ಗುವನಾರ್ಹ ಪರಿಸರ ಸಂಪರ್ಕ ಮತ್ತು ಸಂರಕ್ಷಿತ ಕಾರಿಡಾರ್‌ಗಳೊಂದಿಗೆ ಪ್ರಮುಖ ಎತ್ತರದ ಮೇಲಾವರಣ ಅರಣ್ಯ ವಲಯ.',

        'bhadra-title': 'ಭದ್ರಾ ಅರಣ್ಯ',
        'Bhadra Forest': 'ಭದ್ರಾ ಅರಣ್ಯ',
        'Chikkamagaluru, Shivamogga': 'ಚಿಕ್ಕಮಗಳೂರು, ಶಿವಮೊಗ್ಗ',
        'Bhadra combines mountain forests and river catchments and supports both biodiversity and water security.': 'ಭದ್ರಾ ಪರ್ವತ ಕಾಡುಗಳು ಮತ್ತು ನದಿ ಜಲಾನಯನ ಪ್ರದೇಶಗಳನ್ನು ಸಂಯೋಜಿಸುತ್ತದೆ.',
        'Wildlife Sanctuary and Tiger Reserve': 'ವನ್ಯಜೀವಿ ಅಭಯಾರಣ್ಯ ಮತ್ತು ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'bhadra-status': 'ವನ್ಯಜೀವಿ ಅಭಯಾರಣ್ಯ ಮತ್ತು ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'Moist deciduous with evergreen patches': 'ನಿತ್ಯಹರಿದ್ವರ್ಣ ಸಂಪರ್ಕಗಳೊಂದಿಗೆ ತೇವಾಂಶವುಳ್ಳ ಎಲೆ ಉದುರುವ ಕಾಡುಗಳು',
        'Moist deciduous and evergreen patches': 'ತೇವಾಂಶವುಳ್ಳ ಎಲೆ ಉದುರುವ ಮತ್ತು ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡುಗಳು',
        'bhadra-type': 'ತೇವಾಂಶವುಳ್ಳ ಎಲೆ ಉದುರುವ ಮತ್ತು ನಿತ್ಯಹರಿದ್ವರ್ಣ ಕಾಡುಗಳು',
        'Approx. 490 sq km (sanctuary area)': 'ಅಂದಾಜು 490 ಚದರ ಕಿ.ಮೀ (ಅಭಯಾರಣ್ಯ ಪ್ರದೇಶ)',
        'Tiger, leopard, elephant, giant squirrel, and diverse raptors.': 'ಹುಲಿ, ಚಿರತೆ, ಆನೆ, ಮಲಬಾರ್ ಅಳಿಲು, ಮತ್ತು ವಿವಿಧ ಹಕ್ಕಿಗಳು.',
        'Known for conservation-led habitat recovery and tiger monitoring success.': 'ಸಂರಕ್ಷಣಾ-ನೇತೃತ್ವದ ಆವಾಸಸ್ಥಾನ ಚೇತರಿಕೆ ಮತ್ತು ಹುಲಿ ಮೇಲ್ವಿಚಾರಣೆಯ ಯಶಸ್ಸಿಗೆ ಹೆಸರುವಾಸಿಯಾಗಿದೆ.',

        'brt-title': 'ಬಿ.ಆರ್.ಟಿ ಅರಣ್ಯ',
        'BRT Forest': 'ಬಿ.ಆರ್.ಟಿ ಅರಣ್ಯ',
        'BRT forest forms a unique ecological transition between Eastern and Western Ghats influence zones.': 'ಬಿ.ಆರ್.ಟಿ ಅರಣ್ಯವು ಪೂರ್ವ ಮತ್ತು ಪಶ್ಚಿಮ ಘಟ್ಟಗಳ ನಡುವೆ ವಿಶಿಷ್ಟವಾದ ಪರಿಸರ ಪರಿವರ್ತನೆಯನ್ನು ರೂಪಿಸುತ್ತದೆ.',
        'Biligiri Ranganathaswamy Tiger Reserve': 'ಬಿಳಿಗಿರಿ ರಂಗನಾಥಸ್ವಾಮಿ ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'brt-status': 'ಬಿಳಿಗಿರಿ ರಂಗನಾಥಸ್ವಾಮಿ ಹುಲಿ ಸಂರಕ್ಷಿತ ಪ್ರದೇಶ',
        'Dry deciduous to montane shola transition': 'ಒಣ-ಎಲೆ ಉದುರುವ ಕಾಡಿನಿಂದ ಪರ್ವತ ಶೋಲಾ ಪರಿವರ್ತನೆ',
        'brt-type': 'ಒಣ-ಎಲೆ ಉದುರುವ ಕಾಡಿನಿಂದ ಪರ್ವತ ಶೋಲಾ ಪರಿವರ್ತನೆ',
        'Approx. 540 sq km': 'ಅಂದಾಜು 540 ಚದರ ಕಿ.ಮೀ',
        'Elephant, tiger, leopard, grizzled giant squirrel, and endemic plant species.': 'ಆನೆ, ಹುಲಿ, ಚಿರತೆ, ಗ್ರಿಜ್ಲ್ಡ್ ದೈತ್ಯ ಅಳಿಲು, ಮತ್ತು ಸ್ಥಳೀಯ ಸಸ್ಯ ಪ್ರಭೇದಗಳು.',
        'A critical biogeographic transition forest with high conservation and habitat-linkage importance.': 'ಹೆಚ್ಚಿನ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಆವಾಸಸ್ಥಾನ-ಸಂಪರ್ಕ ಪ್ರಾಮುಖ್ಯತೆಯನ್ನು ಹೊಂದಿರುವ ನಿರ್ಣಾಯಕ ಜೈವಿಕ ಭೌಗೋಳಿಕ ಪರಿವರ್ತನಾ ಅರಣ್ಯ.',

        // Weather Conditions Mapping
        'Clear sky': 'ಸ್ಪಷ್ಟ ಆಕಾಶ',
        'Mainly clear': 'ಮುಖ್ಯವಾಗಿ ಸ್ಪಷ್ಟ',
        'Partly cloudy': 'ಭಾಗಶಃ ಮೋಡ',
        'Overcast': 'ಮೋಡ ಕವಿದ',
        'Foggy': 'ಮಂಜು',
        'Rime fog': 'ಮಂಜು ಮುಸುಕಿದ',
        'Light drizzle': 'ತಿಳಿ ಹನಿಮಳೆ',
        'Moderate drizzle': 'ಸಾಧಾರಣ ಹನಿಮಳೆ',
        'Dense drizzle': 'ದಟ್ಟ ಹನಿಮಳೆ',
        'Slight rain': 'ಲಘು ಮಳೆ',
        'Moderate rain': 'ಸಾಧಾರಣ ಮಳೆ',
        'Heavy rain': 'ಭಾರಿ ಮಳೆ',
        'Slight snow': 'ಲಘು ಹಿಮ',
        'Moderate snow': 'ಸಾಧಾರಣ ಹಿಮ',
        'Heavy snow': 'ದಟ್ಟ ಹಿಮ',
        'Slight showers': 'ಲಘು ವರ್ಷಧಾರೆ',
        'Moderate showers': 'ಸಾಧಾರಣ ವರ್ಷಧಾರೆ',
        'Violent showers': 'ತೀವ್ರ ವರ್ಷಧಾರೆ',
        'Thunderstorm': 'ಸಿಡಿಲು ಸಹಿತ ಮಳೆ',
        'Thunderstorm + hail': 'ಸಿಡಿಲು ಮತ್ತು ಆಲಿಕಲ್ಲು ಮಳೆ',
        'Patchy rain nearby': 'ಹತ್ತಿರದಲ್ಲಿ ಅಲ್ಲಲ್ಲಿ ಮಳೆ',
        'Sunny': 'ಬಿಸಿಲು',
        'Cloudy': 'ಮೋಡ',

        // Safety Tips
        '🌡️ <strong>High Heat Emergency:</strong> Avoid direct sunlight and stay hydrated.': '🌡️ <strong>ತೀವ್ರ ತಾಪಮಾನ ತುರ್ತು:</strong> ನೇರ ಸೂರ್ಯನ ಬೆಳಕನ್ನು ತಪ್ಪಿಸಿ ಮತ್ತು ಹೈಡ್ರೀಕರಿಸಿದ ಸ್ಥಿತಿಯಲ್ಲಿರಿ.',
        '😰 <strong>High Heat Index:</strong> High humidity and heat. Watch for heat exhaustion.': '😰 <strong>ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಸೂಚ್ಯಂಕ:</strong> ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ ಮತ್ತು ಶಾಖ. ಶಾಖದ ಬಳಲಿಕೆಯ ಬಗ್ಗೆ ಎಚ್ಚರವಿರಲಿ.',
        '❄️ <strong>Cold Alert:</strong> Wear warm layers and shelter sensitive crops/livestock.': '❄️ <strong>ಶೀತ ಎಚ್ಚರಿಕೆ:</strong> ಬೆಚ್ಚಗಿನ ಬಟ್ಟೆಗಳನ್ನು ಧರಿಸಿ ಮತ್ತು ಸೂಕ್ಷ್ಮ ಬೆಳೆಗಳು/ಜಾನುವಾರುಗಳಿಗೆ ಆಶ್ರಯ ನೀಡಿ.',
        '💨 <strong>Dangerous Winds:</strong> Stay indoors. Secure loose objects and avoid driving.': '💨 <strong>ಅಪಾಯಕಾರಿ ಗಾಳಿ:</strong> ಮನೆಯೊಳಗೆ ಇರಿ. ಸಡಿಲವಾದ ವಸ್ತುಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿ ಮತ್ತು ಚಾಲನೆಯನ್ನು ತಪ್ಪಿಸಿ.',
        '🌬️ <strong>High Winds:</strong> Drive carefully and secure lightweight outdoor items.': '🌬️ <strong>ಬಲವಾದ ಗಾಳಿ:</strong> ಎಚ್ಚರಿಕೆಯಿಂದ ಚಾಲನೆ ಮಾಡಿ ಮತ್ತು ಹಗುರವಾದ ವಸ್ತುಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿ.',
        '🚨 <strong>SEVERE FLOOD RISK:</strong> Evacuate low-lying areas immediately. Do NOT cross flooded roads.': '🚨 <strong>ತೀವ್ರ ಪ್ರವಾಹದ ಅಪಾಯ:</strong> ತಗ್ಗು ಪ್ರದೇಶಗಳನ್ನು ಕೂಡಲೇ ಖಾಲಿ ಮಾಡಿ. ಪ್ರವಾಹ ಪೀಡಿತ ರಸ್ತೆಗಳನ್ನು ದಾಟಬೇಡಿ.',
        '📱 Keep emergency NDRF contacts ready and stay tuned to local news.': '📱 ತುರ್ತು NDRF ಸಂಪರ್ಕಗಳನ್ನು ಸಿದ್ಧವಾಗಿಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ಸ್ಥಳೀಯ ಸುದ್ದಿಗಳ ಮೇಲೆ ನಿಗಾ ಇರಿಸಿ.',
        '⚠️ <strong>Heavy Rain Warning:</strong> Avoid unnecessary travel. Clear local drainage.': '⚠️ <strong>ಭಾರಿ ಮಳೆ ಮುನ್ನೆಚ್ಚರಿಕೆ:</strong> ಅನಗತ್ಯ ಪ್ರಯಾಣ ತಪ್ಪಿಸಿ. ಸ್ಥಳೀಯ ಚರಂಡಿಗಳನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
        '🌧️ <strong>Moderate Rain:</strong> Roads may be slick. Drive carefully and carry an umbrella.': '🌧️ <strong>ಸಾಧಾರಣ ಮಳೆ:</strong> ರಸ್ತೆಗಳು ಜಾರುವ ಸಾಧ್ಯತೆ ಇದೆ. ಎಚ್ಚರಿಕೆಯಿಂದ ಚಾಲನೆ ಮಾಡಿ ಮತ್ತು ಛತ್ರಿ ಒಯ್ಯಿರಿ.',
        '☀️ <strong>Pleasant Weather:</strong> Conditions are currently calm and safe for outdoor activities.': '☀️ <strong>ಆಹ್ಲಾದಕರ ಹವಾಮಾನ:</strong> ಪ್ರಸ್ತುತ ಹವಾಮಾನವು ಶಾಂತವಾಗಿದೆ ಮತ್ತು ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸುರಕ್ಷಿತವಾಗಿದೆ.',
        '🌤️ <strong>Stable Conditions:</strong> No extreme weather alerts at this time.': '🌤️ <strong>ಸ್ಥಿರ ಪರಿಸ್ಥಿತಿ:</strong> ಈ ಸಮಯದಲ್ಲಿ ಯಾವುದೇ ತೀವ್ರ ಹವಾಮಾನ ಎಚ್ಚರಿಕೆಗಳಿಲ್ಲ.',
        '💧 Continue regular water conservation and crop scheduling.': '💧 ನಿಯಮಿತ ನೀರಿನ ಸಂರಕ್ಷಣೆ ಮತ್ತು ಬೆಳೆ ವೇಳಾಪಟ್ಟಿಯನ್ನು ಮುಂದುವರಿಸಿ.',

        // Public Advice
        'High heat: Avoid outdoor activities between 11 AM - 3 PM.': 'ಹೆಚ್ಚಿನ ತಾಪಮಾನ: ಬೆಳಿಗ್ಗೆ 11 ರಿಂದ ಸಂಜೆ 3 ರ ನಡುವೆ ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳನ್ನು ತಪ್ಪಿಸಿ.',
        'Drink at least 3-4 liters of water/electrolytes today.': 'ಇಂದು ಕನಿಷ್ಠ 3-4 ಲೀಟರ್ ನೀರು/ಎಲೆಕ್ಟ್ರೋಲೈಟ್‌ಗಳನ್ನು ಕುಡಿಯಿರಿ.',
        'Severe Heat Index: High risk of heatstroke due to humidity.': 'ತೀವ್ರ ತಾಪಮಾನ ಸೂಚ್ಯಂಕ: ಆರ್ದ್ರತೆಯಿಂದಾಗಿ ಹೀಟ್ ಸ್ಟ್ರೋಕ್ ಸಂಭವಿಸುವ ಹೆಚ್ಚಿನ ಅಪಾಯವಿದೆ.',
        'Cold temperatures: Dress in warm, thick layers.': 'ಕಡಿಮೆ ತಾಪಮಾನ: ಬೆಚ್ಚಗಿನ, ದಪ್ಪ ಬಟ್ಟೆಗಳನ್ನು ಧರಿಸಿ.',
        'Check on elderly neighbors who may be susceptible to the cold.': 'ಶೀತಕ್ಕೆ ಒಳಗಾಗುವ ವಯಸ್ಸಾದ ನೆರೆಹೊರೆಯವರ ಬಗ್ಗೆ ಕಾಳಜಿ ವಹಿಸಿ.',
        'Temperatures are moderate and generally safe for outdoor exercise.': 'ತಾಪಮಾನವು ಸಾಧಾರಣವಾಗಿದೆ ಮತ್ತು ಸಾಮಾನ್ಯವಾಗಿ ಹೊರಾಂಗಣ ವ್ಯಾಯಾಮಕ್ಕೆ ಸುರಕ್ಷಿತವಾಗಿದೆ.',
        'Maintain normal daily hydration.': 'ಸಾಮಾನ್ಯ ದೈನಂದಿನ ಹೈಡ್ರೇಶನ್ ಕಾಯ್ದುಕೊಳ್ಳಿ.',
        'High risk of urban flooding. Do NOT drive through flooded underpasses.': 'ನಗರ ಪ್ರದೇಶಗಳಲ್ಲಿ ಪ್ರವಾಹದ ಹೆಚ್ಚಿನ ಅಪಾಯ. ಪ್ರವಾಹ ಪೀಡಿತ ಅಂಡರ್ ಪಾಸ್ ಮೂಲಕ ಚಾಲನೆ ಮಾಡಬೇಡಿ.',
        'Expect severe traffic delays; use public transit tracks if available.': 'ತೀವ್ರ ಸಂಚಾರ ವಿಳಂಬ ನಿರೀಕ್ಷಿಸಿ; ಲಭ್ಯವಿದ್ದಲ್ಲಿ ಸಾರ್ವಜನಿಕ ಸಾರಿಗೆ ಬಳಸಿ.',
        'Roads are slick. Reduce driving speed by 20% and increase following distance.': 'ರಸ್ತೆಗಳು ಜಾರಿವೆ. ಚಾಲನಾ ವೇಗವನ್ನು 20% ಕಡಿಮೆ ಮಾಡಿ ಮತ್ತು ಅಂತರ ಕಾಯ್ದುಕೊಳ್ಳಿ.',
        'Two-wheelers should avoid sudden braking on wet roads.': 'ದ್ವಿಚಕ್ರ ವಾಹನ ಸವಾರರು ಒದ್ದೆ ರಸ್ತೆಗಳಲ್ಲಿ ಹಠಾತ್ ಬ್ರೇಕ್ ಹಾಕುವುದನ್ನು ತಪ್ಪಿಸಬೇಕು.',
        'Dangerous crosswinds. High-profile vehicles must drive with extreme caution.': 'ಅಪಾಯಕಾರಿ ಅಡ್ಡಗಾಳಿ. ಎತ್ತರದ ವಾಹನಗಳು ಅತ್ಯಂತ ಜಾಗರೂಕತೆಯಿಂದ ಚಾಲನೆ ಮಾಡಬೇಕು.',
        'Clear roads expected. Standard normal commute conditions.': 'ರಸ್ತೆಗಳು ಮುಕ್ತವಾಗಿರುವ ನಿರೀಕ್ಷೆಯಿದೆ. ಸಾಮಾನ್ಯ ಸಂಚಾರ ಪರಿಸ್ಥಿತಿಗಳು ಇರುತ್ತವೆ.',
        'Strong winds detected: Bring patio furniture, trash cans, and light objects indoors.': 'ಬಲವಾದ ಗಾಳಿ ಪತ್ತೆಯಾಗಿದೆ: ಪೀಠೋಪಕರಣಗಳು ಮತ್ತು ಹಗುರವಾದ ವಸ್ತುಗಳನ್ನು ಮನೆಯೊಳಗೆ ತನ್ನಿ.',
        'Keep doors and windows securely latched.': 'ಬಾಗಿಲು ಮತ್ತು ಕಿಟಕಿಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿ ಹಾಕಿ.',
        'Ensure gutters and street drains near your house are clear of debris.': 'ನಿಮ್ಮ ಮನೆಯ ಹತ್ತಿರದ ಚರಂಡಿಗಳು ಕಸಕಡ್ಡಿಗಳಿಂದ ಮುಕ್ತವಾಗಿವೆಯೇ ಎಂದು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        'Turn off electrical appliances if water approaches your property level.': 'ನೀರು ನಿಮ್ಮ ಆವರಣಕ್ಕೆ ಬಂದರೆ ವಿದ್ಯುತ್ ಉಪಕರಣಗಳನ್ನು ಆಫ್ ಮಾಡಿ.',
        'Keep blinds closed during peak sun to reduce indoor heating.': 'ಒಳಾಂಗಣ ತಾಪಮಾನ ಕಡಿಮೆ ಮಾಡಲು ಕಿಟಕಿ ಪರದೆಯನ್ನು ಹಾಕಿ.',
        'Delay heavy-appliance usage (ovens, dryers) to the evening.': 'ಹೆಚ್ಚಿನ ವಿದ್ಯುತ್ ಬಳಸುವ ಉಪಕರಣಗಳ ಬಳಕೆಯನ್ನು ಸಂಜೆಯವರೆಗೆ ಮುಂದೂಡಿ.',
        'Good weather to open windows and naturally ventilate the house.': 'ಮನೆಯನ್ನು ನೈಸರ್ಗಿಕವಾಗಿ ಗಾಳಿ ಆಡಲು ಬಿಡಲು ಇದು ಒಳ್ಳೆಯ ಹವಾಮಾನ.',
        'Safe to schedule outdoor maintenance or gardening.': 'ಹೊರಾಂಗಣ ನಿರ್ವಹಣೆ ಅಥವಾ ತೋಟಗಾರಿಕೆಗೆ ಇದು ಸುರಕ್ಷಿತ ಸಮಯ.',

        // Risk Levels
        '🔴 Flood Risk': '🔴 ಪ್ರವಾಹದ ಅಪಾಯ',
        '🟠 High Risk': '🟠 ಹೆಚ್ಚಿನ ಅಪಾಯ',
        '🟡 Moderate Risk': '🟡 ಸಾಧಾರಣ ಅಪಾಯ',
        '🟢 Low Risk': '🟢 ಕಡಿಮೆ ಅಪಾಯ',
        'Heavy Rain & Storms': 'ಭಾರಿ ಮಳೆ ಮತ್ತು ಬಿರುಗಾಳಿ',
        'Heavy Rain': 'ಭಾರಿ ಮಳೆ',
        'Moderate Rain': 'ಸಾಧಾರಣ ಮಳೆ',
        'Light Showers': 'ಲಘು ತುಂತುರು ಮಳೆ',
        'Variable': 'ಬದಲಾಗುವ ಹವಾಮಾನ',
        'Extreme Risk': 'ತೀವ್ರ ಅಪಾಯ',
        'Flood/Extreme Risk': 'ಪ್ರವಾಹ / ತೀವ್ರ ಅಪಾಯ',

        // Farmer Dashboard
        'Irrigation Required': 'ನೀರಾವರಿ ಅಗತ್ಯವಿದೆ',
        'No Irrigation Needed': 'ನೀರಾವರಿ ಅಗತ್ಯವಿಲ್ಲ',
        'Light Watering Sufficient': 'ಲಘು ನೀರುಣಿಸುವಿಕೆ ಸಾಕು',
        'Heavy Watering Recommended': 'ಹೆಚ್ಚಿನ ನೀರುಣಿಸುವಿಕೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ',
        'Due to high temperature and low humidity, soil evaporates water faster. Increase frequency.': 'ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಮತ್ತು ಕಡಿಮೆ ಆರ್ದ್ರತೆಯಿಂದಾಗಿ, ಮಣ್ಣಿನ ನೀರು ಬೇಗ ಆವಿಯಾಗುತ್ತದೆ. ನೀರುಣಿಸುವಿಕೆಯನ್ನು ಹೆಚ್ಚಿಸಿ.',
        'High humidity and recent rainfall. Natural moisture is sufficient. Keep drainage clear.': 'ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ ಮತ್ತು ಇತ್ತೀಚಿನ ಮಳೆ. ನೈಸರ್ಗಿಕ ತೇವಾಂಶ ಸಾಕು. ಚರಂಡಿಯನ್ನು ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
        'Moderate conditions. Standard irrigation cycle should be maintained twice daily.': 'ಸಾಧಾರಣ ಪರಿಸ್ಥಿತಿ. ದಿನಕ್ಕೆ ಎರಡು ಬಾರಿ ಸಾಮಾನ್ಯ ನೀರಾವರಿ ಚಕ್ರವನ್ನು ಅನುಸರಿಸಿ.',
        'Forecast shows heavy rain. Suspend irrigation to avoid waterlogging and root rot.': 'ಭಾರಿ ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇದೆ. ಬೇರು ಕೊಳೆತವನ್ನು ತಪ್ಪಿಸಲು ನೀರಾವರಿಯನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಿ.',
        'Slightly warm. Ensure soil moisture is checked before watering.': 'ಸ್ವಲ್ಪ ಬೆಚ್ಚಗಿನ ವಾತಾವರಣ. ನೀರುಣಿಸುವ ಮೊದಲು ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಪರೀಕ್ಷಿಸಿ.',
        'High Heatwave warning! Water heavily in early morning or late evening.': 'ತೀವ್ರ ಶಾಖದ ಅಲೆಯ ಎಚ್ಚರಿಕೆ! ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ತಡವಾಗಿ ಹೆಚ್ಚು ನೀರುಣಿಸಿ.',

        // Farmer Dashboard UI
        'Best Match': 'ಅತ್ಯುತ್ತಮ ಹೊಂದಾಣಿಕೆ',
        'Good': 'ಉತ್ತಮ',
        'Fair': 'ಸಾಧಾರಣ',
        'SEASON': 'ಸೀಸನ್',
        'WATER': 'ನೀರು',
        'MATURITY': 'ಪಕ್ವತೆ',
        'ML RAIN DATA': 'ML ಮಳೆ ಮಾಹಿತಿ',
        'TIP': 'ಸಲಹೆ',
        'Best suited for growing': 'ಬೆಳೆಯಲು ಅತ್ಯಂತ ಸೂಕ್ತವಾಗಿದೆ',
        'conditions-farmer': 'ಪರಿಸ್ಥಿತಿಯೊಂದಿಗೆ ಮಣ್ಣನ್ನು ಹೊಂದಿದೆ',
        'currently-predicts': 'ಮತ್ತು ಪ್ರಸ್ತುತ ಮುನ್ಸೂಚನೆ ನೀಡುತ್ತದೆ',
        'rainfall-level': 'ಮಟ್ಟದ ಮಳೆ',
        'ML Model Prediction': 'ML ಮಾಡೆಲ್ ಮುನ್ಸೂಚನೆ',
        'level': 'ಮಟ್ಟ',
        'Predicted from live data': 'ನೈಜ-ಸಮಯದ ದತ್ತಾಂಶದಿಂದ ಮುನ್ಸೂಚನೆ',
        'Loading smart recommendations...': 'ಸ್ಮಾರ್ಟ್ ಶಿಫಾರಸುಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...',
        'No specific crop recommendations for these extreme conditions.': 'ಈ ತೀವ್ರ ಪರಿಸ್ಥಿತಿಗಳಿಗೆ ಯಾವುದೇ ನಿರ್ದಿಷ್ಟ ಬೆಳೆ ಶಿಫಾರಸುಗಳಿಲ್ಲ.',
        'Recommended by ML Model for': 'ML ಮಾಡೆಲ್ ಶಿಫಾರಸು ಮಾಡಿದೆ - ',
        'soil at': 'ಮಣ್ಣು ಮತ್ತು',
        'soil is': 'ಮಣ್ಣು ಹೊಂದಿದೆ',
        'receives': 'ಮತ್ತು ಪಡೆಯುತ್ತದೆ',
        'Current temperature is approximately': 'ಪ್ರಸ್ತುತ ತಾಪಮಾನವು ಅಂದಾಜು',

        // Irrigation Advice Details
        'select-district': '\u0c9c\u0cbf\u0cb2\u0ccd\u0cb2\u0cc6\u0caf\u0ca8\u0ccd\u0ca8\u0cc1 \u0c86\u0caf\u0ccd\u0c95\u0cc6 \u0cae\u0cbe\u0ca1\u0cbf',
        '🚫 <strong>Reduce irrigation significantly.</strong> Heavy rainfall detected — natural water supply is sufficient. Focus on drainage.': '🚫 <strong>ನೀರಾವರಿಯನ್ನು ಗಣನೀಯವಾಗಿ ಕಡಿಮೆ ಮಾಡಿ.</strong> ಭಾರಿ ಮಳೆ ಪತ್ತೆಯಾಗಿದೆ — ನೈಸರ್ಗಿಕ ನೀರಿನ ಪೂರೈಕೆ ಸಾಕಷ್ಟಿದೆ. ಚರಂಡಿ ವ್ಯವಸ್ಥೆಯತ್ತ ಗಮನ ಹರಿಸಿ.',
        'No artificial irrigation needed. Set up proper drainage channels.': 'ಕೃತಕ ನೀರಾವರಿಯ ಅಗತ್ಯವಿಲ್ಲ. ಸರಿಯಾದ ಚರಂಡಿ ಕಾಲುವೆಗಳನ್ನು ನಿರ್ಮಿಸಿ.',
        'Skip irrigation for the next 3–4 days. Monitor soil moisture.': 'ಮುಂದಿನ 3-4 ದಿನಗಳವರೆಗೆ ನೀರಾವರಿಯನ್ನು ಸ್ಥಗಿತಗೊಳಿಸಿ. ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಗಮನಿಸಿ.',
        'Not applicable — focus on drainage during daylight hours.': 'ಅನ್ವಯಿಸುವುದಿಲ್ಲ — ಹಗಲಿನಲ್ಲಿ ಚರಂಡಿ ವ್ಯವಸ್ಥೆಯತ್ತ ಗಮನ ಹರಿಸಿ.',
        'Rice: Drain excess water if standing above 5cm for > 48hrs.': 'ಭತ್ತ: 48 ಗಂಟೆಗಳಿಗಿಂತ ಹೆಚ್ಚು ಕಾಲ 5 ಸೆಂ.ಮೀ ಮೇಲೆ ನೀರು ನಿಂತಿದ್ದರೆ ಹೆಚ್ಚುವರಿ ನೀರನ್ನು ಹೊರಹಾಕಿ.',
        'General: Ensure root zones are not waterlogged to prevent fungal diseases.': 'ಸಾಮಾನ್ಯ: ಶಿಲೀಂಧ್ರ ರೋಗಗಳನ್ನು ತಡೆಗಟ್ಟಲು ಬೇರು ವಲಯಗಳಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ.',
        'Build bunds and check dams to harvest excess rainwater.': 'ಹೆಚ್ಚುವರಿ ಮಳೆನೀರನ್ನು ಕೊಯ್ಲು ಮಾಡಲು ಬದುಗಳನ್ನು ಮತ್ತು ಚೆಕ್ ಡ್ಯಾಂಗಳನ್ನು ನಿರ್ಮಿಸಿ.',
        'Redirect runoff to farm ponds for dry season use.': 'ಬರಗಾಲದ ಬಳಕೆಗಾಗಿ ಹರಿಯುವ ನೀರನ್ನು ಕೃಷಿ ಹೊಂಡಗಳಿಗೆ ತಿರುಗಿಸಿ.',
        '🔴 <strong>Increase irrigation frequency.</strong> High heat or low humidity detected — ensure consistent water supply to prevent wilting.': '🔴 <strong>ನೀರಾವರಿ ಆವರ್ತನವನ್ನು ಹೆಚ್ಚಿಸಿ.</strong> ಹೆಚ್ಚಿನ ತಾಪಮಾನ ಅಥವಾ ಕಡಿಮೆ ಆರ್ದ್ರತೆ ಪತ್ತೆಯಾಗಿದೆ — ಬಾಡುವಿಕೆಯನ್ನು ತಡೆಯಲು ಸ್ಥಿರವಾದ ನೀರಿನ ಪೂರೈಕೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ.',
        'Drip irrigation is essential to minimize evaporation. Use micro-sprinklers for wider coverage.': 'ಆವಿಯಾಗುವಿಕೆಯನ್ನು ಕಡಿಮೆ ಮಾಡಲು ಹನಿ ನೀರಾವರಿ ಅತ್ಯಗತ್ಯ. ವಿಶಾಲ ವ್ಯಾಪ್ತಿಗಾಗಿ ಮೈಕ್ರೋ-ಸ್ಪ್ರಿಂಕ್ಲರ್ಗಳನ್ನು ಬಳಸಿ.',
        'Irrigate daily or every alternate day. Apply 30–35mm per session.': 'ಪ್ರತಿದಿನ ಅಥವಾ ದಿನಬಿಟ್ಟು ದಿನ ನೀರುಣಿಸಿ. ಪ್ರತಿ ಬಾರಿ 30–35 ಮಿ.ಮೀ ನೀರನ್ನು ಅನ್ವಯಿಸಿ.',
        'Extreme early morning (4–6 AM) before heat rises. Never irrigate mid-day.': 'ತಾಪಮಾನ ಏರುವ ಮೊದಲು ಹೈದ್ರಾಬಾದ್ ಮುಂಜಾನೆ (4-6 AM). ಮಧ್ಯಾಹ್ನ ಎಂದಿಗೂ ನೀರುಣಿಸಬೇಡಿ.',
        'Maize: Critical irrigation required; never skip during heatwaves.': 'ಮೆಕ್ಕೆಜೋಳ: ನಿರ್ಣಾಯಕ ನೀರಾವರಿ ಅಗತ್ಯವಿದೆ; ಶಾಖದ ಅಲೆಯ ಸಮಯದಲ್ಲಿ ಎಂದಿಗೂ ನಿಲ್ಲಿಸಬೇಡಿ.',
        'Vegetables: High risk of wilting; consider shade netting if possible.': 'ತರಕಾರಿಗಳು: ಬಾಡುವ ಹೆಚ್ಚಿನ ಅಪಾಯ; ಸಾಧ್ಯವಾದರೆ ನೆರಳು ಪರದೆಯನ್ನು ಬಳಸಿ.',
        'Apply mulch (5–8cm thick) to roots to retain moisture and keep soil cool.': 'ತೇವಾಂಶವನ್ನು ಉಳಿಸಿಕೊಳ್ಳಲು ಮತ್ತು ಮಣ್ಣನ್ನು ತಂಪಾಗಿಡಲು ಬೇರುಗಳಿಗೆ ಮಲ್ಚ್ (5-8 ಸೆಂ.ಮೀ ದಪ್ಪ) ಅನ್ವಯಿಸಿ.',
        'Install drip irrigation to save 40–60% water vs flood method.': 'ಸಾಂಪ್ರದಾಯಿಕ ವಿಧಾನಕ್ಕೆ ಹೋಲಿಸಿದರೆ 40-60% ನೀರನ್ನು ಉಳಿಸಲು ಹನಿ ನೀರಾವರಿಯನ್ನು ಅಳವಡಿಸಿ.',
        '💧 <strong>Moderate irrigation schedule.</strong> Light to moderate rain detected — supplement with irrigation only during dry gaps.': '💧 <strong>ಸಾಧಾರಣ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ.</strong> ಲಘುವಿನಿಂದ ಸಾಧಾರಣ ಮಳೆ ಪತ್ತೆಯಾಗಿದೆ — ಕೇವಲ ಒಣ ಅವಧಿಗಳಲ್ಲಿ ಮಾತ್ರ ನೀರಾವರಿಯನ್ನು ನೀಡಿ.',
        'Sprinkler or drip recommended. Let natural rain do most of the work.': 'ಸ್ಪ್ರಿಂಕ್ಲರ್ ಅಥವಾ ಹನಿ ನೀರಾವರಿ ಶಿಫಾರಸು ಮಾಡಲಾಗಿದೆ. ನೈಸರ್ಗಿಕ ಮಳೆಯೇ ಹೆಚ್ಚಿನ ಕೆಲಸವನ್ನು ಮಾಡಲಿ.',
        'Irrigate every 4–5 days if soil feels dry at 5cm depth.': '5 ಸೆಂ.ಮೀ ಆಳದಲ್ಲಿ ಮಣ್ಣು ಒಣಗಿದ್ದರೆ ಪ್ರತಿ 4-5 ದಿನಗಳಿಗೊಮ್ಮೆ ನೀರುಣಿಸಿ.',
        'Early morning (5–7 AM) on dry days to maximize absorption.': 'ನೀರು ಹೀರಿಕೊಳ್ಳುವಿಕೆಯನ್ನು ಹೆಚ್ಚಿಸಲು ಒಣ ದಿನಗಳಲ್ಲಿ ಮುಂಜಾನೆ (5-7 AM).',
        'Sugarcane: Furrow irrigation only if extended dry spells occur.': 'ಕಬ್ಬು: ಹೆಚ್ಚಿನ ಒಣ ಅವಧಿ ಸಂಭವಿಸಿದರೆ ಮಾತ್ರ ಹರಿ ನೀರಾವರಿ ಬಳಸಿ.',
        'Cotton: Light irrigation; avoid waterlogging at flowering.': 'ಹತ್ತಿ: ಲಘು ನೀರಾವರಿ; ಹೂಬಿಡುವ ಸಮಯದಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ತಪ್ಪಿಸಿ.',
        'Use rain gauges to track actual rainfall and avoid over-watering.': 'ನೈಜ ಮಳೆಯನ್ನು ಪತ್ತೆಹಚ್ಚಲು ಮಳೆ ಮಾಪಕಗಳನ್ನು ಬಳಸಿ ಮತ್ತು ಹೆಚ್ಚಿನ ನೀರುಣಿಸುವುದನ್ನು ತಪ್ಪಿಸಿ.',
        'Group crops with similar water needs together.': 'ಒಂದೇ ರೀತಿಯ ನೀರಿನ ಅಗತ್ಯವಿರುವ ಬೆಳೆಗಳನ್ನು ಒಟ್ಟಿಗೆ ಗುಂಪು ಮಾಡಿ.',
        '🌤️ <strong>Standard irrigation schedule.</strong> Normal weather conditions — adapt irrigation to crop growth stages.': '🌤️ <strong>ಸಾಮಾನ್ಯ ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿ.</strong> ಸಾಮಾನ್ಯ ಹವಾಮಾನ ಪರಿಸ್ಥಿತಿಗಳು — ಬೆಳೆ ಬೆಳೆಯುವ ಹಂತಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ನೀರಾವರಿಯನ್ನು ಅಳವಡಿಸಿಕೊಳ್ಳಿ.',
        'Sprinkler or drip irrigation. Alternate based on crop type.': 'ಸ್ಪ್ರಿಂಕ್ಲರ್ ಅಥವಾ ಹನಿ ನೀರಾವರಿ. ಬೆಳೆ ಪ್ರಕಾರಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಬದಲಾಯಿಸಿ.',
        'Irrigate every 3 days. Apply 20–25mm per session.': 'ಪ್ರತಿ 3 ದಿನಗಳಿಗೊಮ್ಮೆ ನೀರುಣಿಸಿ. ಪ್ರತಿ ಬಾರಿ 20–25 ಮಿ.ಮೀ ನೀರನ್ನು ಅನ್ವಯಿಸಿ.',
        'Early morning (6–8 AM) or late evening (5–7 PM).': 'ಮುಂಜಾನೆ (6-8 AM) ಅಥವಾ ತಡರಾತ್ರಿ (5-7 PM).',
        'Rice: Maintain 2–3cm water during vegetative phase.': 'ಭತ್ತ: ಬೆಳೆಯುವ ಹಂತದಲ್ಲಿ 2-3 ಸೆಂ.ಮೀ ನೀರನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ.',
        'Pulses: Light irrigation every 10–12 days; excess water reduces nitrogen.': 'ಬೇಳೆಕಾಳುಗಳು: ಪ್ರತಿ 10-12 ದಿನಗಳಿಗೊಮ್ಮೆ ಲಘು ನೀರಾವರಿ; ಹೆಚ್ಚಿನ ನೀರು ಸಾರಜನಕವನ್ನು ಕಡಿಮೆ ಮಾಡುತ್ತದೆ.',
        'Use tensiometers or soil moisture sensors for data-driven irrigation.': 'ದತ್ತಾಂಶ ಆಧರಿತ ನೀರಾವರಿಗಾಗಿ ಮಣ್ಣಿನ ತೇವಾಂಶ ಸಂವೇದಕಗಳನ್ನು ಬಳಸಿ.',
        'Rotate between drip and sprinkler based on crop state.': 'ಬೆಳೆಯ ಹಂತಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಹನಿ ಮತ್ತು ಸ್ಪ್ರಿಂಕ್ಲರ್ ನಡುವೆ ಬದಲಾಯಿಸಿ.'
    },
    'en': {
        // English is the default in HTML, but we keep keys for toggle consistency
        'nav-home': 'Home',
        'nav-agriguard': 'AgriGuard',
        'nav-soil': 'Soil Info',
        'nav-crop': 'Crop Guidance',
        'nav-crop-info': '🌱 Crop Info',
        'crop-info': '🌱 Crop Info',
        'explore-info': 'Explore Info',
        'nav-forest': 'Forest Info',
        'soil-red-title': 'Red Soil',
        'soil-black-title': 'Black Soil',
        'soil-alluvial-title': 'Alluvial Soil',
        'soil-laterite-title': 'Laterite Soil',
        'soil-loam-title': 'Loam Soil',
        'soil-clay-loam-title': 'Clay Loam Soil',
        'soil-silty-loam-title': 'Silty Loam Soil',
        'soil-saline-soil-title': 'Saline Soil',
        'soil-sandy-loam-title': 'Sandy Loam Soil',
        'soil-legend': '🗺️ Soil Legend',
        'soil-distribution': '📊 Soil Distribution',
        'npk-by-soil-type': '🧪 NPK by Soil Type',
        'npk-radar': '🕸️ NPK Radar',
        'ph': 'pH',
        'texture': 'Texture',
        'water-capacity': 'Water Capacity',
        'drainage': 'Drainage',
        'organic-carbon': 'Organic Carbon',
        'regions': 'Regions',
        'crops': 'Crops',
        'tip': 'Tip',
        'total-yield': 'Total Yield',
        'units': 'units',
        'top-districts': 'Top Districts',
        'major-crop-karnataka': 'Major crop in Karnataka.',
        'check-map-filter': 'Varies (Check map filter)',
        'nitrogen': 'Nitrogen',
        'phosphorus': 'Phosphorus',
        'potassium': 'Potassium',
        'nav-login': 'Login',
        'nav-register': 'Register',
        'nav-profile': 'My Profile',
        'nav-settings': 'Settings',
        'nav-logout': 'Logout',
        'hero-title': 'KARNATAKA',
        'hero-main': 'AI-Based Climate Risk Prediction System',
        'hero-subtitle': 'AgriGuard | Crop Guidance | Soil Information | Public Safety | Forest Information',
        'select-district': 'Select District',
        'public-subtitle': 'Climate alerts and safety information',
        'farmer-subtitle': 'District-based climate and crop advisory'
    }
};

const i18n = {
    currentLang: localStorage.getItem('appLang') || 'en',
    _observer: null,
    _translatableNodes: [],
    _applyScheduled: false,
    _isApplying: false,

    init() {
        this.cacheTranslatableNodes();
        this.applyTranslations();
        this.addToggleListeners();
        this.observeDOM();
    },

    t(key) {
        if (!key) return '';
        const translations = TRANSLATIONS[this.currentLang];
        return (translations && translations[key]) ? translations[key] : key;
    },

    toggle() {
        this.currentLang = this.currentLang === 'en' ? 'kn' : 'en';
        localStorage.setItem('appLang', this.currentLang);

        // Dashboard pages contain dynamic runtime text/charts.
        // Force full navigation with cache-busting to avoid mixed-language UI.
        const path = (window.location.pathname || '').toLowerCase();
        if (path.includes('dashboard.html')) {
            const url = new URL(window.location.href);
            url.searchParams.set('_lang', this.currentLang);
            url.searchParams.set('_ts', String(Date.now()));
            window.location.replace(url.toString());
            return;
        }

        this.applyTranslations();
        this.updateToggleButton();
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { lang: this.currentLang }
        }));
    },

    cacheTranslatableNodes() {
        this._translatableNodes = Array.from(document.querySelectorAll('[data-i18n]'));
        this._translatableNodes.forEach(el => {
            if (el.dataset.i18nDefault) return;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.dataset.i18nDefault = el.placeholder || '';
            } else {
                el.dataset.i18nDefault = el.textContent || '';
            }
        });
    },

    applyTranslations() {
        if (this._isApplying) return;
        const translations = TRANSLATIONS[this.currentLang];
        const enTranslations = TRANSLATIONS['en'] || {};
        if (!translations) return;

        this._isApplying = true;
        if (this._observer) this._observer.disconnect();
        this._translatableNodes.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const value = translations[key]
                || enTranslations[key]
                || (el.dataset.i18nDefault || '')
                || key
                || '';
            if (!value) return;

            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.placeholder !== value) el.placeholder = value;
            } else {
                if (el.textContent !== value) el.textContent = value;
            }
        });

        document.documentElement.lang = this.currentLang;
        if (this._observer) this._observer.observe(document.body, { childList: true, subtree: true });
        this._isApplying = false;
    },

    scheduleApply() {
        if (this._applyScheduled) return;
        this._applyScheduled = true;

        requestAnimationFrame(() => {
            this._applyScheduled = false;
            this.cacheTranslatableNodes();
            this.applyTranslations();
        });
    },

    observeDOM() {
        if (this._observer) return;
        this._observer = new MutationObserver(() => {
            if (this._isApplying) return;
            this.scheduleApply();
        });
        this._observer.observe(document.body, { childList: true, subtree: true });
    },

    updateToggleButton() {
        const btn = document.getElementById('langToggleBtn');
        if (btn) {
            btn.textContent = this.currentLang === 'en' ? '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1' : 'English';
        }
    },

    addToggleListeners() {
        const btn = document.getElementById('langToggleBtn');
        if (btn) {
            btn.onclick = (e) => {
                e.preventDefault();
                this.toggle();
            };
            this.updateToggleButton();
        }
    }
};

// Auto-init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
} else {
    i18n.init();
}

window.i18n = i18n;
export default i18n;

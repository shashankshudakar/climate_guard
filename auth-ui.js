/* 
   ClimateGuard Auth UI Logic
   Handles visual enhancements like loading spinners and background interactions.
*/

document.addEventListener('DOMContentLoaded', () => {
    // Add background animation container if it doesn't exist
    if (!document.querySelector('.auth-bg-animation')) {
        const bg = document.createElement('div');
        bg.className = 'auth-bg-animation';
        document.body.prepend(bg);
    }

    // Wrap buttons in a visual loading state on click
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');

    const addSpinner = (btn) => {
        if (!btn) return;
        const originalText = btn.innerHTML;
        btn.addEventListener('click', () => {
            // Only add spinner if validation (handled in main scripts) would likely pass
            // or just show it briefly for visual feedback as requested.
            const spinner = document.createElement('span');
            spinner.className = 'visual-spinner';
            btn.prepend(spinner);

            // Remove spinner after 2 seconds (visual only)
            setTimeout(() => {
                const s = btn.querySelector('.visual-spinner');
                if (s) s.remove();
            }, 2000);
        });
    };

    addSpinner(loginBtn);
    addSpinner(registerBtn);

    // Floating label logic (if we want to enhance the inputs)
    // We can add a class on focus/blur to help with any additional CSS
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('input-focused');
        });
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('input-focused');
            }
        });
    });
});

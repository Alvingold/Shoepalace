// Preloader functionality
const PreloaderManager = {
    preloader: null,
    timeoutId: null,
    maxWaitTime: 5000, // Maximum time to wait before forcing preloader removal (5 seconds)

    init() {
        this.preloader = document.querySelector('.preloader');
        if (!this.preloader) return;

        // Set a maximum wait time
        this.timeoutId = setTimeout(() => {
            this.removePreloader();
        }, this.maxWaitTime);

        // Add event listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                window.addEventListener('load', () => this.removePreloader());
            });
        } else {
            window.addEventListener('load', () => this.removePreloader());
        }

        // Fallback: If window.load doesn't fire
        window.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => this.removePreloader(), 1000);
        });
    },

    removePreloader() {
        if (!this.preloader || this.preloader.classList.contains('fade-out')) return;

        // Clear the timeout if preloader is being removed
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }

        // Add the fade-out class
        this.preloader.classList.add('fade-out');

        // Remove the preloader after animation
        setTimeout(() => {
            this.preloader.style.display = 'none';
            document.body.style.overflow = '';
        }, 500);
    }
};

// Initialize preloader
PreloaderManager.init(); 
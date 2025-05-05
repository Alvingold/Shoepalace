const shop = {
    products: [],
    currentSort: 'default',
    currentFilter: 'all',
    initialized: false,
    productGrid: null,

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.productGrid = document.getElementById('productGrid');
        if (!this.productGrid) return;

        this.loadFromUrl();
        this.setupEventListeners();
        this.updateProductCount();
    },

    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                this.filterByCategory(category);
                this.updateUrl('category', category);
            });
        });

        // Brand checkboxes
        document.querySelectorAll('.brand-filter input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Color checkboxes
        document.querySelectorAll('.color-filter input').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    },

    filterByCategory(category) {
        if (!this.productGrid) return;
        
        const products = this.productGrid.children;
        let visibleCount = 0;

        Array.from(products).forEach(product => {
            const shouldShow = category === 'all' || product.dataset.category === category;
            product.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount++;
        });

        // Update active states on category buttons
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        this.updateProductCount(visibleCount);
    },

    applyFilters() {
        if (!this.productGrid) return;

        const selectedBrands = Array.from(document.querySelectorAll('.brand-filter input:checked')).map(cb => cb.value);
        const selectedColors = Array.from(document.querySelectorAll('.color-filter input:checked')).map(cb => cb.value);
        let visibleCount = 0;

        Array.from(this.productGrid.children).forEach(product => {
            const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.dataset.brand);
            const matchesColor = selectedColors.length === 0 || selectedColors.includes(product.dataset.color);
            const shouldShow = matchesBrand && matchesColor;
            
            product.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount++;
        });

        this.updateProductCount(visibleCount);
    },

    updateProductCount(count) {
        const countElement = document.querySelector('.product-count');
        if (countElement) {
            countElement.textContent = count || Array.from(this.productGrid.children)
                .filter(product => product.style.display !== 'none').length;
        }
    },

    loadFromUrl() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        if (category) {
            this.filterByCategory(category);
        }
    }
};

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => shop.init());
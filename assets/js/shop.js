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
            btn.addEventListener('click', (e) => {
                // Only handle clicks on category buttons, not product cards
                if (!e.target.closest('.product-card')) {
                    const category = btn.dataset.category;
                    this.filterByCategory(category);
                    this.updateUrl('category', category);
                }
            });
        });

        // Product click handling
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Stop event from bubbling up to category handlers
                e.stopPropagation();
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

        // Quick View Functionality
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = btn.closest('.product-card');
                if (!productCard) return;

                const modal = document.getElementById('quickViewModal');
                if (!modal) return;

                const product = {
                    id: productCard.dataset.productId,
                    title: productCard.querySelector('.product-title').textContent,
                    price: productCard.querySelector('.product-price').textContent,
                    image: productCard.querySelector('.product-image img').src
                };

                // Update modal content
                modal.querySelector('.product-title').textContent = product.title;
                modal.querySelector('.product-price').textContent = product.price;
                modal.querySelector('.product-image').src = product.image;

                // Setup quantity input
                const quantityInput = modal.querySelector('.quantity-input');
                if (quantityInput) {
                    quantityInput.value = 1;
                }

                // Setup add to cart button
                const addToCartBtn = modal.querySelector('.add-to-cart-btn');
                if (addToCartBtn) {
                    addToCartBtn.onclick = function() {
                        const quantity = parseInt(quantityInput.value) || 1;
                        const selectedColor = modal.querySelector('.color-btn.active')?.style.backgroundColor;
                        
                        const productToAdd = {
                            ...product,
                            quantity: quantity,
                            color: selectedColor
                        };
                        
                        if (typeof cart !== 'undefined') {
                            cart.addItem(productToAdd);
                        }
                        bootstrap.Modal.getInstance(modal).hide();
                    };
                }
            });
        });

        // Color selection in modal
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                colorBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
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
        this.updateShopTitle(category);
    },

    updateShopTitle(category) {
        const shopTitle = document.querySelector('.shop-title');
        if (!shopTitle) return;

        if (!category || category === 'all') {
            shopTitle.textContent = 'Our Collection';
        } else {
            const titles = {
                'men': "Men's Collection",
                'women': "Women's Collection",
                'kids': "Kids Collection",
                'new': 'New Arrivals',
                'sale': 'Sale Items'
            };
            shopTitle.textContent = titles[category] || 'Our Collection';
        }

        // Also update breadcrumb
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbActive) {
            breadcrumbActive.textContent = category === 'all' ? 'Shop' : (titles[category] || 'Shop');
        }
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
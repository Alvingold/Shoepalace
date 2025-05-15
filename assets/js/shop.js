const shop = {
    products: [],
    currentSort: 'default',
    currentFilter: 'all',
    initialized: false,
    productGrid: null,
    notificationInterval: null,

    init() {
        if (this.initialized) return;
        this.initialized = true;

        this.productGrid = document.getElementById('productGrid');
        if (!this.productGrid) return;

        this.loadFromUrl();
        this.setupEventListeners();
        this.updateProductCount();
        this.startProductNotification();
    },

    startProductNotification() {
        // Show notification every 30 seconds
        this.notificationInterval = setInterval(() => {
            this.showNotification('Tap on the product for more information', 'info');
        }, 30000); // 30 seconds

        // Show first notification after 5 seconds
        setTimeout(() => {
            this.showNotification('Tap on the product for more information', 'info');
        }, 5000);
    },

    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.shop-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `shop-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-info-circle"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Add show class after a small delay for animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Add click handler to close button
        const closeBtn = notification.querySelector('.notification-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                // Clear the interval if it exists
                if (this.notificationInterval) {
                    clearInterval(this.notificationInterval);
                }
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        }

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    },

    setupEventListeners() {
        // Category buttons
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Remove active class from all category buttons
                document.querySelectorAll('[data-category]').forEach(b => {
                    b.classList.remove('active');
                });
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                    const category = btn.dataset.category;
                    this.filterByCategory(category);
                    this.updateUrl('category', category);
            });
        });

        // Reset filter buttons
        document.querySelectorAll('.reset-filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.resetFilters();
            });
        });

        // Product click handling
        document.querySelectorAll('.product-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Stop event from bubbling up to category handlers
                e.stopPropagation();
            });
        });

        // Add to cart button handlers
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = this.closest('.product-card');
                if (!productCard) return;

                const product = {
                    id: productCard.dataset.productId,
                    title: productCard.querySelector('.product-title')?.textContent,
                    price: productCard.querySelector('.product-price')?.textContent,
                    image: productCard.querySelector('.product-image img')?.src
                };

                if (product.id && product.title && product.price && product.image && typeof cart !== 'undefined') {
                    cart.addItem(product);
                }
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

        // Wishlist button functionality
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = this.closest('.product-card');
                if (!productCard || typeof wishlist === 'undefined') return;
                
                const product = {
                    id: productCard.dataset.productId,
                    title: productCard.querySelector('.product-title')?.textContent,
                    price: productCard.querySelector('.product-price')?.textContent,
                    image: productCard.querySelector('.product-image img')?.src
                };
                
                if (product.id && product.title && product.price && product.image) {
                    wishlist.toggleItem(product);
                    
                    // Toggle heart icon
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('far');
                        icon.classList.toggle('fas');
                        icon.classList.toggle('text-danger');
                    }
                }
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
            // Update active state on category links
            document.querySelectorAll('.category-buttons a').forEach(link => {
                if (link.getAttribute('href').includes(`category=${category}`)) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
            
            // Filter products
            this.filterByCategory(category);
            
            // Update shop title
            this.updateShopTitle(category);
        }
    },

    resetFilters() {
        // Reset category filters
        document.querySelectorAll('[data-category]').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Reset brand checkboxes
        document.querySelectorAll('.brand-filter input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset color checkboxes
        document.querySelectorAll('.color-filter input').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Reset price range if it exists
        const priceRange = document.getElementById('priceRange');
        if (priceRange) {
            priceRange.value = priceRange.max;
            const priceOutput = document.getElementById('priceOutput');
            if (priceOutput) {
                priceOutput.textContent = priceRange.value;
            }
        }
        
        // Reset sort select to default
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.value = 'popularity';
            this.sortProducts('popularity');
        }
        
        // Show all products
        if (this.productGrid) {
            Array.from(this.productGrid.children).forEach(product => {
                product.style.display = '';
            });
        }
        
        // Update the URL to remove all parameters
        window.history.replaceState({}, '', window.location.pathname);
        
        // Update product count
        this.updateProductCount();
        
        // Update shop title
        this.updateShopTitle('all');
        
        // Close mobile offcanvas if open
        const offcanvas = document.getElementById('filterOffcanvas');
        if (offcanvas) {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
            if (bsOffcanvas) {
                bsOffcanvas.hide();
            }
        }
    },

    updateUrl(param, value) {
        // Get current URL parameters
        const url = new URL(window.location);
        
        // Update, add or remove the parameter
        if (value === null) {
            url.searchParams.delete(param);
        } else {
            url.searchParams.set(param, value);
        }
        
        // Update the URL without reloading the page
        window.history.pushState({}, '', url);
    },

    sortProducts(sortBy) {
        if (!this.productGrid) return;

        const products = Array.from(this.productGrid.children);
        products.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return parseInt(a.getAttribute('data-price')) - parseInt(b.getAttribute('data-price'));
                case 'price-high':
                    return parseInt(b.getAttribute('data-price')) - parseInt(a.getAttribute('data-price'));
                case 'newest':
                    return parseInt(b.getAttribute('data-date')) - parseInt(a.getAttribute('data-date'));
                case 'rating':
                    return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
                default: // popularity
                    return parseInt(b.getAttribute('data-reviews')) - parseInt(a.getAttribute('data-reviews'));
            }
        });

        // Clear and reappend sorted products
        this.productGrid.innerHTML = '';
        products.forEach(product => this.productGrid.appendChild(product));

        this.updateProductCount(products.length);
    }
};

// Initialize shop when DOM is loaded
document.addEventListener('DOMContentLoaded', () => shop.init());
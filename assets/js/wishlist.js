// Wishlist Functionality
const wishlist = {
    items: [],
    initialized: false,

    init() {
        if (this.initialized) return;
        this.initialized = true;
        
        try {
            const savedItems = localStorage.getItem('wishlist');
            this.items = savedItems ? JSON.parse(savedItems) : [];
        } catch (error) {
            console.error('Error loading wishlist:', error);
            this.items = [];
        }
        
        this.updateWishlistButtons();
        this.loadWishlist();
        this.setupEventListeners();
    },

    setupEventListeners() {
        // Setup event delegation for wishlist items container
        const wishlistGrid = document.querySelector('.wishlist-grid');
        if (wishlistGrid) {
            wishlistGrid.addEventListener('click', this.handleWishlistItemClick.bind(this));
        }

        // Setup wishlist button event listeners
        document.addEventListener('click', (e) => {
            const wishlistBtn = e.target.closest('.wishlist-btn');
            if (wishlistBtn) {
                e.preventDefault();
                const productCard = wishlistBtn.closest('.product-card');
                if (!productCard) return;

                const product = {
                    id: productCard.dataset.productId,
                    title: productCard.querySelector('.product-title')?.textContent,
                    price: parseFloat(productCard.querySelector('.current-price')?.textContent.replace(/[^\d.]/g, '')) || 0,
                    image: productCard.querySelector('.product-image img')?.src
                };

                if (product.id && product.title && product.price && product.image) {
                    this.toggleItem(product);
                }
            }
        });
    },

    handleWishlistItemClick(e) {
        const removeBtn = e.target.closest('.remove-from-wishlist');
        if (removeBtn) {
            const productId = removeBtn.dataset.id;
            this.removeItem(productId);
        }

        const addToCartBtn = e.target.closest('.add-to-cart');
        if (addToCartBtn) {
            const productId = addToCartBtn.dataset.id;
            const item = this.items.find(item => item.id === productId);
            if (item && typeof cart !== 'undefined') {
                cart.addItem(item);
            }
        }
    },

    toggleItem(product) {
        const index = this.items.findIndex(item => item.id === product.id);
        const wishlistBtn = document.querySelector(`.wishlist-btn[data-product-id="${product.id}"]`);
        
        if (index === -1) {
            // Add to wishlist
            this.items.push(product);
            if (wishlistBtn) {
                const icon = wishlistBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
                wishlistBtn.classList.add('active');
            }
            this.showWishlistNotification('Added to wishlist');
        } else {
            // Remove from wishlist
            this.items.splice(index, 1);
            if (wishlistBtn) {
                const icon = wishlistBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                }
                wishlistBtn.classList.remove('active');
            }
            this.showWishlistNotification('Removed from wishlist');
        }

        this.saveWishlist();
        this.loadWishlist();
    },

    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveWishlist();
            this.loadWishlist();
            this.updateWishlistButtons();
            this.showWishlistNotification('Removed from wishlist');
        }
    },

    updateWishlistButtons() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = btn.dataset.productId;
            const icon = btn.querySelector('i');
            const isInWishlist = this.items.some(item => item.id === productId);
            
            if (icon) {
                if (isInWishlist) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    btn.classList.add('active');
                } else {
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                    btn.classList.remove('active');
                }
            }
        });
    },

    loadWishlist() {
        const wishlistGrid = document.querySelector('.wishlist-grid');
        if (!wishlistGrid) return;

        try {
            if (this.items.length === 0) {
                wishlistGrid.innerHTML = `
                    <div class="empty-wishlist">
                        <i class="far fa-heart"></i>
                        <p>Your wishlist is empty</p>
                    </div>
                `;
                return;
            }

            wishlistGrid.innerHTML = this.items.map(item => {
                const price = typeof item.price === 'string' ? 
                    parseFloat(item.price.replace(/[^\d.]/g, '')) : 
                    item.price || 0;

                return `
                    <div class="wishlist-item">
                        <div class="wishlist-item-image">
                            <img src="${this.sanitizeUrl(item.image)}" alt="${this.sanitizeHtml(item.title)}">
                        </div>
                        <div class="wishlist-item-details">
                            <h4>${this.sanitizeHtml(item.title)}</h4>
                            <div class="wishlist-item-price">₦${price.toLocaleString()}</div>
                            <div class="wishlist-item-actions">
                                <button class="btn btn-primary add-to-cart" data-id="${item.id}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                                <button class="btn btn-danger remove-from-wishlist" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error rendering wishlist:', error);
            wishlistGrid.innerHTML = '<div class="error">Error loading wishlist</div>';
        }
    },

    sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    sanitizeUrl(url) {
        try {
            const parsed = new URL(url);
            return parsed.toString();
        } catch (e) {
            return '#';
        }
    },

    saveWishlist() {
        try {
            localStorage.setItem('wishlist', JSON.stringify(this.items));
        } catch (error) {
            console.error('Error saving wishlist:', error);
        }
    },

    showWishlistNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'wishlist-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after animation
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
};

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    wishlist.init();
});
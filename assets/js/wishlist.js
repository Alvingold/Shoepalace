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
            this.setupEventListeners();
            this.updateWishlistBtns();
        } catch (error) {
            console.error('Error initializing wishlist:', error);
            this.items = [];
            this.saveWishlist();
        }
    },

    setupEventListeners() {
        // Setup wishlist buttons on product cards
        document.querySelectorAll('.wishlist-btn:not(.related-wishlist-btn)').forEach(btn => {
            // Skip already initialized buttons
            if (btn.dataset.initialized === 'true') return;
            
            btn.dataset.initialized = 'true';
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const productCard = btn.closest('.product-card');
                if (!productCard) return;
                
                const productId = productCard.dataset.productId;
                const productTitle = productCard.querySelector('.product-title')?.textContent;
                const productPrice = productCard.querySelector('.product-price')?.textContent;
                const productImage = productCard.querySelector('.product-image img')?.src;
                const productBrand = productCard.querySelector('.product-brand')?.textContent;
                
                if (!productId || !productTitle || !productPrice || !productImage) {
                    console.error('Missing product data for wishlist');
                    return;
                }
                
                const product = {
                    id: productId,
                    title: productTitle,
                    price: productPrice,
                    image: productImage,
                    brand: productBrand || 'ShoePalace'
                };
                
                this.toggleItem(product);
                
                // Toggle heart icon
                const icon = btn.querySelector('i');
                if (icon) {
                    icon.classList.toggle('far');
                    icon.classList.toggle('fas');
                    icon.classList.toggle('text-danger');
                }
            });
        });
        
        // Setup wishlist nav button if present
        const wishlistNavBtn = document.querySelector('.wishlist-nav-btn');
        if (wishlistNavBtn) {
            wishlistNavBtn.addEventListener('click', () => {
                window.location.href = 'account.html#wishlist';
            });
        }
    },

    toggleItem(product) {
        if (!product || !product.id) return;
        
        const index = this.findItemIndex(product.id);
        
        if (index !== -1) {
            // Remove from wishlist
            this.items.splice(index, 1);
            this.showWishlistNotification('Removed from wishlist');
        } else {
            // Add to wishlist
            this.items.push({
                id: product.id,
                title: product.title,
                price: this.extractPrice(product.price),
                image: product.image,
                brand: product.brand || '',
                addedAt: new Date().toISOString()
            });
            this.showWishlistNotification('Added to wishlist');
        }
        
        this.saveWishlist();
        this.updateWishlistBtns();
    },

    findItemIndex(productId) {
        return this.items.findIndex(item => item.id === productId);
    },

    isInWishlist(productId) {
        return this.findItemIndex(productId) !== -1;
    },

    extractPrice(price) {
        // Handle price - could be a number or string with currency symbol
        if (typeof price === 'number') {
            return price;
        } else if (typeof price === 'string') {
            // Remove currency symbol and parse
            const parsedPrice = parseFloat(price.replace(/[^\d.]/g, ''));
            return isNaN(parsedPrice) ? 0 : parsedPrice;
        }
        return 0;
    },

    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    },

    updateWishlistBtns() {
        // Update all wishlist buttons to reflect current state
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (!productCard) return;
            
            const productId = productCard.dataset.productId;
            if (!productId) return;
            
            const isInWishlist = this.isInWishlist(productId);
            const icon = btn.querySelector('i');
            
            if (icon) {
                if (isInWishlist) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    icon.classList.add('text-danger');
                } else {
                    icon.classList.add('far');
                    icon.classList.remove('fas');
                    icon.classList.remove('text-danger');
                }
            }
        });
    },

    showWishlistNotification(message) {
        // Check if we already have the product-notification function from product-detail.js
        if (typeof showNotification === 'function') {
            showNotification(message, 'success');
            return;
        }
        
        // Otherwise implement our own notification
        const notification = document.createElement('div');
        notification.className = 'product-notification success';
        notification.textContent = message;
        
        // Remove any existing notifications
        document.querySelectorAll('.product-notification').forEach(el => el.remove());
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    getWishlistItems() {
        return [...this.items];
    },

    clearWishlist() {
        this.items = [];
        this.saveWishlist();
        this.updateWishlistBtns();
    }
};

// Initialize wishlist when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    wishlist.init();
});
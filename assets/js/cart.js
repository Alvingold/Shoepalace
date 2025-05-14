// Cart Functionality
const cart = {
    items: [],
    initialized: false,

    init() {
        if (this.initialized) return;
        this.initialized = true;
        
        try {
            const savedItems = localStorage.getItem('cart');
            this.items = savedItems ? JSON.parse(savedItems) : [];
            this.updateCartCount();
            this.updateCartSidebar();
            this.setupEventListeners();
            this.setupCartSidebar();
        } catch (error) {
            console.error('Error initializing cart:', error);
            this.items = [];
            this.saveCart();
        }
    },

    setupEventListeners() {
        // Setup event delegation for cart items container
        const cartItems = document.querySelector('.cart-items');
        if (cartItems) {
            const handler = this.handleCartItemClick.bind(this);
            cartItems.addEventListener('click', handler);
        }

        // Setup add to cart buttons
        this.setupAddToCartListeners();
    },

    setupAddToCartListeners() {
        // Get all add to cart buttons (both in overlay and dedicated buttons)
        const addToCartButtons = document.querySelectorAll('.product-actions .add-to-cart-btn, .product-info .add-to-cart-btn');
        
        if (addToCartButtons.length > 0) {
            addToCartButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const productCard = button.closest('.product-card');
                    
                    if (productCard) {
                        const productId = productCard.dataset.productId || productCard.getAttribute('data-product-id') || 'product-' + Math.random().toString(36).substr(2, 9);
                        const title = productCard.querySelector('.product-title').textContent;
                        const priceEl = productCard.querySelector('.product-price');
                        const price = priceEl.querySelector('.current-price') ? 
                            priceEl.querySelector('.current-price').textContent : 
                            priceEl.textContent;
                        const image = productCard.querySelector('.product-image img').src;
                        const brand = productCard.querySelector('.product-brand')?.textContent || '';
                        
                        const productData = {
                            id: productId,
                            title: title,
                            price: price,
                            image: image,
                            brand: brand,
                            quantity: 1
                        };
                        
                        this.addItem(productData);
                    } else {
                        console.error('Could not find product card');
                    }
                });
            });
        }
    },

    setupCartSidebar() {
        const cartBtn = document.querySelector('.cart-btn');
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        const closeCart = document.querySelector('.close-cart');
        const checkoutBtn = document.querySelector('.checkout-btn');

        if (cartBtn && cartSidebar && cartOverlay && closeCart && checkoutBtn) {
            const openCart = () => {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            };

            const closeCartSidebar = () => {
                cartSidebar.classList.remove('active');
                cartOverlay.classList.remove('active');
                document.body.style.overflow = '';
            };

            cartBtn.addEventListener('click', openCart);
            closeCart.addEventListener('click', closeCartSidebar);
            cartOverlay.addEventListener('click', closeCartSidebar);
            checkoutBtn.addEventListener('click', () => this.checkoutCart());
        }
    },

    handleCartItemClick(e) {
        // Handle remove button clicks
        if (e.target.classList.contains('fa-trash') || e.target.closest('.remove-item')) {
            const button = e.target.closest('.remove-item');
            if (button) {
                const productId = button.getAttribute('data-id');
                const color = button.getAttribute('data-color') || '';
                this.removeItem(productId, color);
                return;
            }
        }

        // Handle quantity button clicks
        const quantityBtn = e.target.closest('.quantity-btn');
        if (quantityBtn) {
            const productId = quantityBtn.getAttribute('data-id');
            const color = quantityBtn.getAttribute('data-color') || '';
            const item = this.items.find(item => item.id === productId && (item.color || '') === color);
            if (item) {
                if (quantityBtn.classList.contains('minus')) {
                    this.updateQuantity(productId, color, Math.max(1, item.quantity - 1));
                } else {
                    this.updateQuantity(productId, color, item.quantity + 1);
                }
            }
        }
    },

    addItem(product) {
        try {
            if (!product || !product.id) {
                console.error('Invalid product data:', product);
                this.showCartNotification('Error adding item to cart: Invalid product data');
                return;
            }

            // Create standardized product object
            const cartItem = {
                id: product.id,
                title: product.title || product.name || 'Unknown Product',
                price: this.extractPrice(product.price),
                image: product.image || '',
                color: product.color || '',
                quantity: product.quantity || 1
            };

            // Check for existing item
            const existingItem = this.items.find(item => 
                item.id === cartItem.id && 
                (item.color || '') === (cartItem.color || '')
            );

            if (existingItem) {
                existingItem.quantity += cartItem.quantity;
            } else {
                this.items.push(cartItem);
            }

            this.saveCart();
            this.updateCartCount();
            this.updateCartSidebar();
            this.showCartNotification('Added to cart');
        } catch (error) {
            console.error('Error adding item to cart:', error);
            this.showCartNotification('Error adding item to cart');
        }
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

    removeItem(productId, color) {
        const index = this.items.findIndex(item => 
            item.id === productId && 
            (item.color || '') === (color || '')
        );
        
        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveCart();
            this.updateCartCount();
            this.updateCartSidebar();
            this.showCartNotification('Removed from cart');
        }
    },

    updateQuantity(productId, color, quantity) {
        const item = this.items.find(item => 
            item.id === productId && 
            (item.color || '') === (color || '')
        );
        
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartCount();
            this.updateCartSidebar();
        }
    },

    getTotal() {
        return this.items.reduce((total, item) => 
            total + (item.price * item.quantity), 0
        );
    },

    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const count = this.getCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
            
            // Update cart button state
            const cartBtn = document.querySelector('.cart-btn');
            if (cartBtn) {
                cartBtn.classList.toggle('has-items', count > 0);
            }
        }
    },

    updateCartSidebar() {
        const cartItems = document.querySelector('.cart-items');
        const totalAmount = document.querySelector('.total-amount');
        
        if (!cartItems || !totalAmount) return;

        cartItems.innerHTML = '';

        if (this.items.length === 0) {
            const emptyCart = document.createElement('div');
            emptyCart.className = 'empty-cart';
            emptyCart.innerHTML = `
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            `;
            cartItems.appendChild(emptyCart);
        } else {
            this.items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.title}</h4>
                        <div class="cart-item-price">₦ ${item.price.toLocaleString()}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}" data-color="${item.color || ''}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" data-color="${item.color || ''}">
                            <button class="quantity-btn plus" data-id="${item.id}" data-color="${item.color || ''}">+</button>
                        </div>
                        <button class="btn btn-danger remove-item" data-id="${item.id}" data-color="${item.color || ''}">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                `;
                cartItems.appendChild(itemElement);
            });

            // Handle quantity input changes
            cartItems.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const quantity = parseInt(e.target.value);
                    if (!isNaN(quantity)) {
                        this.updateQuantity(e.target.getAttribute('data-id'), e.target.getAttribute('data-color') || '', quantity);
                    }
                });
            });
        }

        totalAmount.textContent = `₦ ${this.getTotal().toLocaleString()}`;
    },

    showCartNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Remove any existing notifications
        document.querySelectorAll('.cart-notification').forEach(el => el.remove());
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    checkoutCart() {
        if (this.items.length === 0) {
            this.showCartNotification('Your cart is empty');
            return;
        }

        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn) {
            this.showCartNotification('Please log in to complete your purchase');
            
            // Close cart sidebar
            const cartSidebar = document.querySelector('.cart-sidebar');
            const cartOverlay = document.querySelector('.cart-overlay');
            if (cartSidebar) cartSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
            
            // Redirect to account page after a brief delay
            setTimeout(() => {
                window.location.href = 'account.html';
            }, 1500);
            return;
        }

        // Close cart sidebar
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartOverlay = document.querySelector('.cart-overlay');
        if (cartSidebar) cartSidebar.classList.remove('active');
        if (cartOverlay) cartOverlay.classList.remove('active');
        
        // Redirect to checkout page
        window.location.href = 'checkout.html';
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});
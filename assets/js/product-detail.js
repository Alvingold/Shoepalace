document.addEventListener('DOMContentLoaded', function() {
    // Get product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        window.location.href = 'shop.html';
        return;
    }

    // Function to load product details
    async function loadProductDetails() {
        try {
            // In a real app, you would fetch this from an API
            // For demo, we'll use mock data with more complete information
            const product = {
                id: productId,
                title: 'Premium Comfort Running Shoes',
                price: 149.99,
                originalPrice: 199.99,
                discount: 25,
                rating: 4.5,
                reviewCount: 128,
                brand: 'ShoePalace',
                sku: 'SP-' + productId,
                category: productId.split('-')[0] || 'men',
                description: 'Experience ultimate comfort with our premium running shoes. Designed with cutting-edge technology to provide maximum support and cushioning for every stride. The breathable mesh upper ensures your feet stay cool, while the responsive midsole returns energy to keep you moving forward.',
                longDescription: `
                    <p>These premium running shoes represent the pinnacle of athletic footwear technology. Designed with performance and comfort as the highest priorities, they feature:</p>
                    <ul>
                        <li>Lightweight, breathable mesh upper that adapts to your foot</li>
                        <li>Responsive cushioning that returns energy with each step</li>
                        <li>Reinforced heel counter for added stability</li>
                        <li>Durable rubber outsole with enhanced traction pattern</li>
                        <li>Removable foam insole for customized comfort</li>
                    </ul>
                    <p>Whether you're training for a marathon or enjoying casual runs, these shoes provide the perfect balance of support, durability, and style.</p>
                `,
                images: [
                    'assets/images/products/product-1.jpg',
                    'assets/images/products/product-2.jpg',
                    'assets/images/products/product-3.jpg',
                    'assets/images/products/product-4.jpg'
                ],
                sizes: ['6', '7', '8', '9', '10', '11', '12'],
                colors: [
                    { name: 'Black', code: '#000000' },
                    { name: 'White', code: '#FFFFFF' },
                    { name: 'Red', code: '#FF0000' },
                    { name: 'Blue', code: '#0000FF' }
                ],
                specifications: {
                    material: 'Synthetic Mesh',
                    sole: 'Rubber',
                    closure: 'Lace-up',
                    weight: '280g (Size 9)',
                    cushioning: 'Responsive EVA',
                    arch: 'Neutral',
                    terrain: 'Road',
                    warranty: '1 Year'
                },
                featured: true,
                inStock: true,
                reviews: [
                    { 
                        name: 'John D.', 
                        rating: 5, 
                        date: '2024-01-10', 
                        title: 'Best running shoes I\'ve owned',
                        comment: 'These shoes are incredibly comfortable right out of the box. No break-in period needed!' 
                    },
                    { 
                        name: 'Sarah M.', 
                        rating: 4, 
                        date: '2024-02-15', 
                        title: 'Great for long distances',
                        comment: 'I\'ve run two marathons in these and they\'ve held up great. Could use a bit more arch support though.' 
                    },
                    { 
                        name: 'Michael P.', 
                        rating: 5, 
                        date: '2024-03-05', 
                        title: 'Worth every penny',
                        comment: 'The cushioning is amazing and they look stylish too. Will definitely buy again.' 
                    }
                ],
                relatedProducts: [
                    {
                        id: 'men-training-shoes',
                        title: 'Elite Training Shoes',
                        price: 129.99,
                        image: 'assets/images/products/product-2.jpg',
                        brand: 'ShoePalace'
                    },
                    {
                        id: 'women-running-shoes',
                        title: 'Women\'s Performance Runner',
                        price: 139.99,
                        image: 'assets/images/products/product-3.jpg',
                        brand: 'ShoePalace'
                    },
                    {
                        id: 'casual-sneakers',
                        title: 'Everyday Comfort Sneakers',
                        price: 89.99,
                        image: 'assets/images/products/product-4.jpg',
                        brand: 'ShoePalace'
                    }
                ]
            };

            // Update the UI with product details
            updateProductUI(product);
            
        } catch (error) {
            console.error('Error loading product details:', error);
            // Show error message to user
            document.querySelector('.product-detail-section').innerHTML = `
                <div class="container text-center py-5">
                    <h2>Oops! Something went wrong</h2>
                    <p>We couldn't load the product details. Please try again later.</p>
                    <a href="shop.html" class="btn btn-primary mt-3">Back to Shop</a>
                </div>
            `;
        }
    }

    // Function to update UI with product details
    function updateProductUI(product) {
        // Update title and metadata
        document.title = `${product.title} - ShoePalace`;
        document.querySelector('.product-title').textContent = product.title;
        document.querySelector('.product-brand span').textContent = product.brand;
        document.querySelector('.product-sku span').textContent = product.sku;
        
        // Update breadcrumb
        const categoryLink = document.querySelector('.product-category');
        if (categoryLink) {
            const category = product.category.charAt(0).toUpperCase() + product.category.slice(1);
            categoryLink.textContent = category;
        }

        // Update images
        const mainImage = document.getElementById('mainImage');
        const thumbnailTrack = document.getElementById('thumbnailTrack');
        
        if (mainImage && thumbnailTrack) {
            thumbnailTrack.innerHTML = ''; // Clear existing thumbnails
            
            mainImage.src = product.images[0];
            mainImage.alt = product.title;
            
            // Setup image zoom effect
            setupImageZoom(mainImage);

            product.images.forEach((image, index) => {
                const thumbnail = document.createElement('img');
                thumbnail.src = image;
                thumbnail.alt = `${product.title} - Image ${index + 1}`;
                thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
                thumbnail.addEventListener('click', () => {
                    mainImage.src = image;
                    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
                    thumbnail.classList.add('active');
                });
                thumbnailTrack.appendChild(thumbnail);
            });
        }

        // Update price
        const currentPrice = document.querySelector('.current-price');
        const originalPrice = document.querySelector('.original-price');
        const discountBadge = document.querySelector('.discount-badge');
        
        if (currentPrice) {
            currentPrice.textContent = `₦${product.price.toLocaleString()}`;
        }
        
        if (originalPrice && product.originalPrice) {
            originalPrice.textContent = `₦${product.originalPrice.toLocaleString()}`;
            originalPrice.style.display = 'inline-block';
        } else if (originalPrice) {
            originalPrice.style.display = 'none';
        }
        
        if (discountBadge && product.discount) {
            discountBadge.textContent = `-${product.discount}%`;
            discountBadge.style.display = 'inline-block';
        } else if (discountBadge) {
            discountBadge.style.display = 'none';
        }

        // Update description
        const shortDesc = document.querySelector('.product-description');
        if (shortDesc) {
            shortDesc.textContent = product.description;
        }

        // Update tab content
        const descriptionTab = document.getElementById('description');
        if (descriptionTab) {
            descriptionTab.innerHTML = product.longDescription || product.description;
        }

        // Update specifications tab
        const specificationsTab = document.getElementById('specifications');
        if (specificationsTab && product.specifications) {
            let specsHTML = '<table class="table specifications-table">';
            
            for (const [key, value] of Object.entries(product.specifications)) {
                // Convert camelCase to Title Case
                const formattedKey = key.replace(/([A-Z])/g, ' $1')
                    .replace(/^./, str => str.toUpperCase());
                
                specsHTML += `
                    <tr>
                        <th>${formattedKey}</th>
                        <td>${value}</td>
                    </tr>
                `;
            }
            
            specsHTML += '</table>';
            specificationsTab.innerHTML = specsHTML;
        }

        // Update reviews tab
        const reviewsTab = document.getElementById('reviews');
        if (reviewsTab) {
            if (product.reviews && product.reviews.length > 0) {
                let reviewsHTML = `
                    <div class="overall-rating mb-4">
                        <div class="d-flex align-items-center">
                            <div class="large-rating me-3">
                                ${product.rating.toFixed(1)}
                            </div>
                            <div>
                                <div class="stars large-stars">
                                    ${generateStarRating(product.rating)}
                                </div>
                                <div class="text-muted">Based on ${product.reviewCount} reviews</div>
                            </div>
                        </div>
                    </div>
                    <div class="review-list">
                `;
                
                product.reviews.forEach(review => {
                    reviewsHTML += `
                        <div class="review-item">
                            <div class="review-header">
                                <div class="reviewer-name">${review.name}</div>
                                <div class="review-date">${formatDate(review.date)}</div>
                            </div>
                            <div class="stars">
                                ${generateStarRating(review.rating)}
                            </div>
                            <h5 class="review-title">${review.title}</h5>
                            <p class="review-content">${review.comment}</p>
                        </div>
                    `;
                });
                
                reviewsHTML += `
                    </div>
                    <div class="write-review-section mt-4">
                        <h4>Write a Review</h4>
                        <form id="reviewForm" class="review-form">
                            <div class="mb-3">
                                <label for="reviewName" class="form-label">Your Name</label>
                                <input type="text" class="form-control" id="reviewName" required>
                            </div>
                            <div class="mb-3">
                                <label for="reviewTitle" class="form-label">Review Title</label>
                                <input type="text" class="form-control" id="reviewTitle" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Rating</label>
                                <div class="rating-input">
                                    <div class="rating-stars">
                                        <i class="far fa-star" data-rating="1"></i>
                                        <i class="far fa-star" data-rating="2"></i>
                                        <i class="far fa-star" data-rating="3"></i>
                                        <i class="far fa-star" data-rating="4"></i>
                                        <i class="far fa-star" data-rating="5"></i>
                                    </div>
                                    <input type="hidden" id="ratingValue" value="0" required>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label for="reviewComment" class="form-label">Your Review</label>
                                <textarea class="form-control" id="reviewComment" rows="4" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-primary">Submit Review</button>
                        </form>
                    </div>
                `;
                
                reviewsTab.innerHTML = reviewsHTML;
                
                // Set up rating stars functionality
                setupRatingStars();
                setupReviewForm(product.id);
            } else {
                reviewsTab.innerHTML = `
                    <div class="no-reviews">
                        <p>There are no reviews yet for this product.</p>
                        <div class="write-review-section mt-4">
                            <h4>Be the First to Write a Review</h4>
                            <form id="reviewForm" class="review-form">
                                <div class="mb-3">
                                    <label for="reviewName" class="form-label">Your Name</label>
                                    <input type="text" class="form-control" id="reviewName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="reviewTitle" class="form-label">Review Title</label>
                                    <input type="text" class="form-control" id="reviewTitle" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Rating</label>
                                    <div class="rating-input">
                                        <div class="rating-stars">
                                            <i class="far fa-star" data-rating="1"></i>
                                            <i class="far fa-star" data-rating="2"></i>
                                            <i class="far fa-star" data-rating="3"></i>
                                            <i class="far fa-star" data-rating="4"></i>
                                            <i class="far fa-star" data-rating="5"></i>
                                        </div>
                                        <input type="hidden" id="ratingValue" value="0" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="reviewComment" class="form-label">Your Review</label>
                                    <textarea class="form-control" id="reviewComment" rows="4" required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Submit Review</button>
                            </form>
                        </div>
                    </div>
                `;
                
                // Set up rating stars functionality
                setupRatingStars();
                setupReviewForm(product.id);
            }
        }

        // Add size options
        const sizeOptions = document.querySelector('.size-options');
        if (sizeOptions && product.sizes) {
            sizeOptions.innerHTML = ''; // Clear existing sizes
            
            product.sizes.forEach(size => {
                const sizeBtn = document.createElement('button');
                sizeBtn.className = 'size-option';
                sizeBtn.textContent = size;
                sizeBtn.addEventListener('click', () => {
                    document.querySelectorAll('.size-option').forEach(btn => btn.classList.remove('active'));
                    sizeBtn.classList.add('active');
                });
                sizeOptions.appendChild(sizeBtn);
            });
        }

        // Add color options
        const colorOptions = document.querySelector('.color-options');
        if (colorOptions && product.colors) {
            colorOptions.innerHTML = ''; // Clear existing colors
            
            product.colors.forEach(color => {
                const colorBtn = document.createElement('button');
                colorBtn.className = 'color-option';
                colorBtn.style.backgroundColor = color.code;
                colorBtn.setAttribute('title', color.name);
                colorBtn.setAttribute('data-color', color.name);
                
                // Add tooltips if Bootstrap's tooltip is available
                if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
                    new bootstrap.Tooltip(colorBtn);
                }
                
                colorBtn.addEventListener('click', () => {
                    document.querySelectorAll('.color-option').forEach(btn => btn.classList.remove('active'));
                    colorBtn.classList.add('active');
                });
                colorOptions.appendChild(colorBtn);
            });
        }

        // Update product rating stars
        const starsContainer = document.querySelector('.product-meta .stars');
        if (starsContainer) {
            starsContainer.innerHTML = generateStarRating(product.rating);
        }
        
        // Update review count
        const ratingCount = document.querySelector('.rating-count');
        if (ratingCount) {
            ratingCount.textContent = `(${product.reviewCount} Reviews)`;
        }

        // Setup add to cart button
        const addToCartBtn = document.querySelector('.add-to-cart-btn');
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function() {
                const selectedSize = document.querySelector('.size-option.active');
                const selectedColor = document.querySelector('.color-option.active');
                const quantity = parseInt(document.querySelector('.quantity-input').value) || 1;
                
                if (!selectedSize) {
                    showNotification('Please select a size', 'warning');
                    return;
                }
                
                if (!selectedColor) {
                    showNotification('Please select a color', 'warning');
                    return;
                }
                
                const productToAdd = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.images[0],
                    brand: product.brand,
                    size: selectedSize.textContent,
                    color: selectedColor.getAttribute('data-color'),
                    quantity: quantity
                };
                
                if (typeof cart !== 'undefined') {
                    cart.addItem(productToAdd);
                } else {
                    console.error('Cart functionality not available');
                    showNotification('Could not add to cart. Please try again later.', 'error');
                }
            });
        }

        // Setup wishlist button
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            // Check if product is already in wishlist
            let isInWishlist = false;
            if (typeof wishlist !== 'undefined') {
                isInWishlist = wishlist.isInWishlist(product.id);
                
                // Update button state based on wishlist status
                const icon = wishlistBtn.querySelector('i');
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
            }
            
            wishlistBtn.addEventListener('click', function() {
                const productToAdd = {
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: product.images[0],
                    brand: product.brand
                };
                
                if (typeof wishlist !== 'undefined') {
                    wishlist.toggleItem(productToAdd);
                    
                    // Toggle heart icon
                    const icon = this.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('far');
                        icon.classList.toggle('fas');
                        icon.classList.toggle('text-danger');
                    }
                    
                    showNotification(
                        icon.classList.contains('fas') ? 'Added to wishlist' : 'Removed from wishlist',
                        'success'
                    );
                } else {
                    console.error('Wishlist functionality not available');
                    showNotification('Could not update wishlist. Please try again later.', 'error');
                }
            });
        }

        // Setup quantity buttons
        initQuantityButtons();

        // Load related products
        loadRelatedProducts(product.relatedProducts);
    }

    function setupImageZoom(image) {
        const container = image.parentElement;
        
        if (!container) return;
        
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        
        image.addEventListener('mousemove', function(e) {
            const { left, top, width, height } = container.getBoundingClientRect();
            const x = (e.clientX - left) / width;
            const y = (e.clientY - top) / height;
            
            this.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        });
        
        container.addEventListener('mouseenter', function() {
            image.style.transform = 'scale(1.5)';
        });
        
        container.addEventListener('mouseleave', function() {
            image.style.transform = 'scale(1)';
        });
    }

    function initQuantityButtons() {
        const minusBtn = document.querySelector('.qty-btn.minus');
        const plusBtn = document.querySelector('.qty-btn.plus');
        const quantityInput = document.querySelector('.quantity-input');

        if (!minusBtn || !plusBtn || !quantityInput) return;

        minusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });

        quantityInput.addEventListener('change', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            }
        });
    }

    function generateStarRating(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        
        let stars = '';
        
        // Add full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        
        // Add half star if needed
        if (halfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Add empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }
        
        return stars;
    }

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function setupRatingStars() {
        const stars = document.querySelectorAll('.rating-stars .fa-star');
        const ratingInput = document.getElementById('ratingValue');
        
        if (!stars.length || !ratingInput) return;
        
        stars.forEach(star => {
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
            
            star.addEventListener('mouseout', function() {
                const currentRating = parseInt(ratingInput.value);
                highlightStars(currentRating);
            });
            
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                ratingInput.value = rating;
                highlightStars(rating);
            });
        });
        
        function highlightStars(rating) {
            stars.forEach(star => {
                const starRating = parseInt(star.getAttribute('data-rating'));
                if (starRating <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.add('far');
                    star.classList.remove('fas');
                }
            });
        }
    }

    function setupReviewForm(productId) {
        const reviewForm = document.getElementById('reviewForm');
        if (!reviewForm) return;
        
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('reviewName').value;
            const title = document.getElementById('reviewTitle').value;
            const rating = parseInt(document.getElementById('ratingValue').value);
            const comment = document.getElementById('reviewComment').value;
            
            if (!name || !title || !rating || !comment) {
                showNotification('Please fill out all fields and provide a rating', 'warning');
                return;
            }
            
            // Normally you would send this to your backend
            console.log('Review submitted:', { productId, name, title, rating, comment });
            
            // For demo purposes, we'll just show a success message and reset the form
            showNotification('Thank you for your review!', 'success');
            reviewForm.reset();
            document.querySelectorAll('.rating-stars .fa-star').forEach(star => {
                star.classList.add('far');
                star.classList.remove('fas');
            });
            document.getElementById('ratingValue').value = 0;
        });
    }

    function loadRelatedProducts(products) {
        const relatedProductsContainer = document.getElementById('relatedProducts');
        if (!relatedProductsContainer || !products || !products.length) return;
        
        relatedProductsContainer.innerHTML = '';
        
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'col-md-4';
            productCard.innerHTML = `
                <div class="product-card" data-product-id="${product.id}">
                    <a href="product.html?id=${product.id}" class="product-link">
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.title}" class="img-fluid">
                            <div class="product-actions">
                                <button class="wishlist-btn related-wishlist-btn" data-product-id="${product.id}" style="--i:0">
                                    <i class="far fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </a>
                    <div class="product-details">
                        <a href="product.html?id=${product.id}" class="product-title">
                            <span class="product-brand">${product.brand}</span>
                            <h5 class="product-title">${product.title}</h5>
                        </a>
                        <div class="product-price">₦${product.price.toLocaleString()}</div>
                        <button class="btn btn-primary related-add-to-cart-btn" data-product-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            
            relatedProductsContainer.appendChild(productCard);
        });
        
        // Set up related products' add to cart buttons
        document.querySelectorAll('.related-add-to-cart-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = this.getAttribute('data-product-id');
                const productCard = this.closest('.product-card');
                
                if (!productCard) return;
                
                const productData = {
                    id: productId,
                    title: productCard.querySelector('.product-title').textContent,
                    price: productCard.querySelector('.product-price').textContent,
                    image: productCard.querySelector('.product-image img').src,
                    brand: productCard.querySelector('.product-brand').textContent,
                    quantity: 1
                };
                
                if (typeof cart !== 'undefined') {
                    cart.addItem(productData);
                }
            });
        });
        
        // Set up related products' wishlist buttons
        document.querySelectorAll('.related-wishlist-btn').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = this.getAttribute('data-product-id');
                const productCard = this.closest('.product-card');
                
                if (!productCard || typeof wishlist === 'undefined') return;
                
                const productData = {
                    id: productId,
                    title: productCard.querySelector('.product-title').textContent,
                    price: productCard.querySelector('.product-price').textContent,
                    image: productCard.querySelector('.product-image img').src,
                    brand: productCard.querySelector('.product-brand').textContent
                };
                
                wishlist.toggleItem(productData);
                
                // Toggle heart icon
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('far');
                    icon.classList.toggle('fas');
                    icon.classList.toggle('text-danger');
                }
            });
        });
    }

    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `product-notification ${type}`;
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
    }

    // Load product details when page loads
    loadProductDetails();
});

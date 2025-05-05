// Handle carousels
document.addEventListener('DOMContentLoaded', () => {
    // Global carousel pause/resume handlers
    window.addEventListener('blur', () => {
        document.querySelectorAll('.carousel').forEach(carousel => {
            bootstrap.Carousel.getInstance(carousel)?.pause();
        });
    });

    window.addEventListener('focus', () => {
        document.querySelectorAll('.carousel').forEach(carousel => {
            bootstrap.Carousel.getInstance(carousel)?.cycle();
        });
    });

    initializeProductSlider();

    // Initialize wishlist first so its functions are available
    if (typeof wishlist !== 'undefined') {
        wishlist.init();
    }

    // Add to cart button click handlers
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const product = {
                id: productCard.dataset.productId,
                title: productCard.querySelector('.product-title')?.textContent,
                price: parseFloat(productCard.querySelector('.current-price')?.textContent.replace(/[^\d.]/g, '')) || 0,
                image: productCard.querySelector('.product-image img')?.src
            };

            if (product.id && product.title && product.price && product.image) {
                cart.addItem(product);
            }
        });
    });

    // Wishlist button click handlers
    document.querySelectorAll('.wishlist-btn').forEach(button => {
        // Set initial state based on wishlist
        if (typeof wishlist !== 'undefined' && wishlist.items) {
            const productCard = button.closest('.product-card');
            if (productCard) {
                const productId = productCard.dataset.productId;
                const isInWishlist = wishlist.items.some(item => item.id === productId);
                const icon = button.querySelector('i');
                
                if (isInWishlist && icon) {
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                    button.classList.add('active');
                }
            }
        }
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const productCard = this.closest('.product-card');
            if (!productCard) return;

            const product = {
                id: productCard.dataset.productId,
                title: productCard.querySelector('.product-title')?.textContent,
                price: parseFloat(productCard.querySelector('.current-price')?.textContent.replace(/[^\d.]/g, '')) || 0,
                image: productCard.querySelector('.product-image img')?.src
            };

            if (product.id && product.title && product.price && product.image) {
                if (typeof wishlist !== 'undefined') {
                    wishlist.toggleItem(product);
                    
                    // Update button state immediately
                    const icon = this.querySelector('i');
                    const isInWishlist = wishlist.items.some(item => item.id === product.id);
                    
                    if (icon) {
                        if (isInWishlist) {
                            icon.classList.remove('far');
                            icon.classList.add('fas');
                            this.classList.add('active');
                        } else {
                            icon.classList.remove('fas');
                            icon.classList.add('far');
                            this.classList.remove('active');
                        }
                    }
                }
            }
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// Product Showcase Slider functionality
function initializeProductSlider() {
    const productTabs = document.querySelectorAll('.tab-pane');
    
    productTabs.forEach(tab => {
        const slider = tab.querySelector('.products-slider');
        if (!slider) return;

        const content = slider.querySelector('.slider-content');
        const prevBtn = document.querySelector('.prev-btn');
        const nextBtn = document.querySelector('.next-btn');
        
        if (!content || !prevBtn || !nextBtn) return;
        
        let currentIndex = 0;
        const items = content.querySelectorAll('.col-lg-3');
        const maxIndex = Math.max(0, items.length - 1);
        
        // Reset function
        function resetSlider() {
            currentIndex = 0;
            content.style.transform = 'translateX(0)';
            updateButtons();
        }
        
        // Update buttons state
        function updateButtons() {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }
        
        // Slide to index
        function slideTo(index) {
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            content.style.transform = `translateX(-${currentIndex * 100}%)`;
            updateButtons();
        }
        
        // Event listeners
        prevBtn.addEventListener('click', () => {
            slideTo(currentIndex - 1);
        });

        nextBtn.addEventListener('click', () => {
            slideTo(currentIndex + 1);
        });

        // Listen for tab changes
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tabEl => {
            tabEl.addEventListener('shown.bs.tab', () => {
                resetSlider();
            });
        });
        
        // Initialize
        resetSlider();
    });
}

// Account Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const formContents = document.querySelectorAll('.form-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab') + 'Form';
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            formContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // Password visibility toggle
    const toggleBtns = document.querySelectorAll('.toggle-password');
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input[type="password"], input[type="text"]');
            const icon = btn.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Form submission
    const loginForm = document.getElementById('loginFormElement');
    const registerForm = document.getElementById('registerFormElement');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);
            const data = Object.fromEntries(formData.entries());
            simulateLogin(data);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = Object.fromEntries(formData.entries());
            simulateRegister(data);
        });
    }

    // Check login status on page load
    checkLoginStatus();
});

// Simulate login (replace with actual API call)
function simulateLogin(data) {
    // Simulate API delay
    setTimeout(() => {
        // For demo, just check if email contains "@" and password length > 6
        if (data.email?.includes('@') && data.password?.length > 6) {
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
                name: 'Demo User',
                email: data.email
            }));
            showDashboard();
        } else {
            alert('Invalid credentials. Please try again.');
        }
    }, 1000);
}

// Simulate register (replace with actual API call)
function simulateRegister(data) {
    // Simulate API delay
    setTimeout(() => {
        // Check if all required fields are present
        if (!data.fullName || !data.email || !data.password || !data.confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Check password length
        if (data.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        // Check if email is valid
        if (!data.email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        // Check if terms are accepted
        if (!data.terms) {
            alert('Please accept the Terms of Service and Privacy Policy.');
            return;
        }

        // If all validations pass, proceed with registration
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({
            name: data.fullName,
            email: data.email
        }));
        
        // Show success message and redirect to dashboard
        alert('Registration successful! Welcome to ShoePalace.');
        showDashboard();
    }, 1000);
}

// Handle logout
function handleLogout() {
    // Clear user-related data
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('profileImage');
    
    // Clear cart and wishlist data
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    
    // Reset cart UI
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = '0';
        cartCount.style.display = 'none';
    }
    
    // Reset wishlist UI
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const icon = btn.querySelector('i');
        if (icon) {
            icon.classList.remove('fas');
            icon.classList.add('far');
        }
        btn.classList.remove('active');
    });

    // Redirect to home page
    window.location.href = 'index.html';
}

// Check login status
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Show/hide appropriate sections
    const authForms = document.getElementById('authForms');
    const profileDashboard = document.getElementById('profileDashboard');
    
    if (authForms && profileDashboard) {
        if (isLoggedIn) {
            authForms.style.display = 'none';
            profileDashboard.style.display = 'block';
            updateDashboardInfo();
        } else {
            authForms.style.display = 'block';
            profileDashboard.style.display = 'none';
        }
    }

    // Update navigation menu
    const accountDropdown = document.querySelector('.nav-item.dropdown:nth-child(4)');
    if (accountDropdown) {
        const dropdownMenu = accountDropdown.querySelector('.dropdown-menu');
        if (isLoggedIn && dropdownMenu) {
            dropdownMenu.innerHTML = `
                <li><a class="dropdown-item" href="account.html#profile">Profile</a></li>
                <li><a class="dropdown-item" href="account.html#orders">Orders</a></li>
                <li><a class="dropdown-item" href="account.html#wishlist">Wishlist</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="account.html#settings">Settings</a></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            `;
            
            const newLogoutBtn = document.getElementById('logoutBtn');
            if (newLogoutBtn) {
                newLogoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    handleLogout();
                });
            }
        } else if (dropdownMenu) {
            dropdownMenu.innerHTML = `
                <li><a class="dropdown-item" href="account.html">Login / Register</a></li>
            `;
        }
    }
}

// Handle dashboard visibility and navigation
function showDashboard() {
    const authForms = document.getElementById('authForms');
    const profileDashboard = document.getElementById('profileDashboard');
    
    if (authForms && profileDashboard) {
        authForms.style.display = 'none';
        profileDashboard.style.display = 'block';
        updateDashboardInfo();
    }
}

function hideDashboard() {
    const authForms = document.getElementById('authForms');
    const profileDashboard = document.getElementById('profileDashboard');
    
    if (authForms && profileDashboard) {
        authForms.style.display = 'block';
        profileDashboard.style.display = 'none';
    }
}

function updateDashboardInfo() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const profileName = document.getElementById('profileName');
    const profileEmail = document.getElementById('profileEmail');
    
    if (user.name && profileName && profileEmail) {
        profileName.textContent = user.name;
        profileEmail.textContent = user.email;
    }
}

// Dashboard navigation
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in and on account page
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn && window.location.pathname.includes('account.html')) {
        showDashboard();
    } else if (window.location.pathname.includes('account.html')) {
        hideDashboard();
    }

    // Handle dashboard navigation
    const dashboardNav = document.querySelector('.dashboard-nav');
    if (dashboardNav) {
        dashboardNav.addEventListener('click', function(e) {
            if (e.target.closest('a')) {
                e.preventDefault();
                const navItems = dashboardNav.querySelectorAll('li');
                navItems.forEach(item => item.classList.remove('active'));
                e.target.closest('li').classList.add('active');

                // Handle logout
                if (e.target.closest('#dashboardLogout')) {
                    handleLogout();
                }
            }
        });
    }

    // Handle profile image change
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            // Create a file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.getElementById('profileImage').src = event.target.result;
                        // Store the image in localStorage (in production, you'd upload to a server)
                        localStorage.setItem('profileImage', event.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            };
            
            input.click();
        });
    }

    // Load saved profile image if exists
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
        document.getElementById('profileImage').src = savedImage;
    }

    // Handle edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            // Implement edit profile functionality
            alert('Edit profile functionality will be implemented here');
        });
    }
});

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            // Validate form data
            if (!validateContactForm(data)) {
                return;
            }
            
            // Simulate form submission
            submitContactForm(data);
        });
    }
});

function validateContactForm(data) {
    // Check name (at least 2 words)
    if (!data.name || data.name.trim().split(' ').filter(word => word.length > 0).length < 2) {
        alert('Please enter your full name (first and last name)');
        return false;
    }
    
    // Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Check subject (minimum 5 characters)
    if (!data.subject || data.subject.trim().length < 5) {
        alert('Please enter a subject (minimum 5 characters)');
        return false;
    }
    
    // Check message (minimum 20 characters)
    if (!data.message || data.message.trim().length < 20) {
        alert('Please enter a detailed message (minimum 20 characters)');
        return false;
    }
    
    return true;
}

function submitContactForm(data) {
    // Show loading state
    const submitBtn = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Simulate API delay
    setTimeout(() => {
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Show success message
        alert('Thank you for your message! We will get back to you soon.');
        
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }, 1500);
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    
    accordionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const isCollapsed = this.classList.contains('collapsed');
            
            // Add animation class
            if (isCollapsed) {
                this.closest('.accordion-item').classList.add('active');
            } else {
                this.closest('.accordion-item').classList.remove('active');
            }
        });
    });
});

// Shop Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize price range slider
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        noUiSlider.create(priceRange, {
            start: [0, 500],
            connect: true,
            range: {
                'min': 0,
                'max': 500
            },
            format: {
                to: function(value) {
                    return Math.round(value);
                },
                from: function(value) {
                    return Number(value);
                }
            }
        });

        // Update price inputs
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');

        priceRange.noUiSlider.on('update', function(values, handle) {
            if (handle === 0) {
                priceMin.innerHTML = values[0];
            } else {
                priceMax.innerHTML = values[1];
            }
        });
    }

    // Grid/List View Toggle
    const viewBtns = document.querySelectorAll('.view-btn');
    const productGrid = document.querySelector('.product-grid');
    
    if (viewBtns.length && productGrid) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                viewBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Toggle grid/list view
                if (this.dataset.view === 'list') {
                    productGrid.classList.add('list-view');
                } else {
                    productGrid.classList.remove('list-view');
                }
            });
        });
    }

    // Filter Buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    const colorButtons = document.querySelectorAll('.color-btn');

    // Size buttons
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // If in single selection mode
            sizeButtons.forEach(b => b.classList.remove('active'));
            
            // Toggle current button
            if (!isActive) {
                this.classList.add('active');
            }
        });
    });

    // Color buttons
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const isActive = this.classList.contains('active');
            
            // If in single selection mode
            colorButtons.forEach(b => b.classList.remove('active'));
            
            // Toggle current button
            if (!isActive) {
                this.classList.add('active');
            }
        });
    });

    // Quick View Functionality
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const quickViewModal = document.getElementById('quickViewModal');

    if (quickViewBtns.length && quickViewModal) {
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const product = {
                    id: productCard.dataset.productId,
                    title: productCard.querySelector('.product-title').textContent,
                    price: productCard.querySelector('.current-price').textContent,
                    rating: productCard.querySelector('.product-rating').innerHTML,
                    image: productCard.querySelector('.product-image img').src
                };

                // Update modal content
                const modal = quickViewModal;
                modal.querySelector('.product-gallery img').src = product.image;
                modal.querySelector('.product-title').textContent = product.title;
                modal.querySelector('.current-price').textContent = product.price;
                modal.querySelector('.product-rating').innerHTML = product.rating;

                // Reset quantity
                const quantityInput = modal.querySelector('.quantity-selector input');
                if (quantityInput) {
                    quantityInput.value = 1;
                }

                // Add to cart handler in modal
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
                        
                        cart.addItem(productToAdd);
                        bootstrap.Modal.getInstance(modal).hide();
                    };
                }
            });
        });

        // Color selection in modal
        const colorBtns = quickViewModal.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                colorBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // Wishlist Toggle
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                // Add to wishlist functionality here
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                // Remove from wishlist functionality here
            }
        });
    });

    // Sort Products
    const sortSelect = document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            // Here you would implement the sorting logic
            const sortBy = this.value;
            console.log('Sort by:', sortBy);
            // Implement sorting functionality
        });
    }

    // Category Filter
    const categoryLinks = document.querySelectorAll('.category-filter a');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            // Implement category filter functionality
        });
    });

    // Clear All Filters
    const clearFiltersBtn = document.querySelector('.shop-sidebar .btn-outline-primary');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            // Reset price range
            if (priceRange && priceRange.noUiSlider) {
                priceRange.noUiSlider.reset();
            }

            // Reset size buttons
            sizeButtons.forEach(btn => btn.classList.remove('active'));

            // Reset color buttons
            colorButtons.forEach(btn => btn.classList.remove('active'));

            // Reset brand checkboxes
            document.querySelectorAll('.brand-filter input[type="checkbox"]')
                .forEach(checkbox => checkbox.checked = false);

            // Reset category filter
            categoryLinks.forEach(link => link.classList.remove('active'));
            categoryLinks[0]?.classList.add('active');
        });
    }

    // Initialize tooltips for color buttons
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[title]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Handle URL parameters for category filtering
    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            // Update breadcrumb
            const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
            if (breadcrumbActive) {
                breadcrumbActive.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Collection';
            }

            // Update title
            const shopTitle = document.querySelector('.shop-title');
            if (shopTitle) {
                shopTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1) + ' Collection';
            }

            // Update active category in sidebar
            categoryLinks.forEach(link => {
                if (link.textContent.toLowerCase().includes(category.toLowerCase())) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }

    handleURLParameters();
});

// Mobile Filter and Sort Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile price range slider
    if (document.getElementById('mobilePriceRange')) {
        noUiSlider.create(document.getElementById('mobilePriceRange'), {
            start: [0, 50000],
            connect: true,
            range: {
                'min': 0,
                'max': 50000
            },
            format: {
                to: function(value) {
                    return Math.round(value);
                },
                from: function(value) {
                    return value;
                }
            }
        });

        // Update price inputs when slider changes
        const minPriceInput = document.querySelector('.min-price');
        const maxPriceInput = document.querySelector('.max-price');
        const priceRange = document.getElementById('mobilePriceRange');

        priceRange.noUiSlider.on('update', function(values, handle) {
            if (handle === 0) {
                minPriceInput.value = values[0];
            } else {
                maxPriceInput.value = values[1];
            }
        });

        // Update slider when inputs change
        minPriceInput.addEventListener('change', function() {
            priceRange.noUiSlider.set([this.value, null]);
        });

        maxPriceInput.addEventListener('change', function() {
            priceRange.noUiSlider.set([null, this.value]);
        });
    }

    // Sort options functionality
    const sortOptions = document.querySelectorAll('.sort-option');
    sortOptions.forEach(option => {
        option.addEventListener('click', function() {
            sortOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Filter options functionality
    const filterOptions = document.querySelectorAll('.filter-option');
    filterOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
        });
    });

    // Clear filters
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            // Reset price range
            if (document.getElementById('mobilePriceRange')) {
                document.getElementById('mobilePriceRange').noUiSlider.set([0, 50000]);
            }
            
            // Uncheck all checkboxes
            document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
                checkbox.checked = false;
            });

            // Remove selected state from filter options
            document.querySelectorAll('.filter-option').forEach(option => {
                option.classList.remove('selected');
            });
        });
    }

    // Apply filters
    const applyBtn = document.querySelector('.apply-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            // Get selected filters
            const selectedFilters = {
                categories: Array.from(document.querySelectorAll('.filter-option.selected')).map(opt => opt.textContent.trim()),
                priceRange: document.getElementById('mobilePriceRange') ? 
                    document.getElementById('mobilePriceRange').noUiSlider.get() : [],
                brands: Array.from(document.querySelectorAll('.filter-checkbox input:checked')).map(cb => cb.parentElement.textContent.trim())
            };

            // Apply filters to products (implement your filtering logic here)
            console.log('Applying filters:', selectedFilters);
            
            // Close the modal
            const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
            if (filterModal) {
                filterModal.hide();
            }
        });
    }
});

// Category filtering functionality
document.addEventListener('DOMContentLoaded', function() {
    // Desktop category links
    const desktopCategoryLinks = document.querySelectorAll('.category-filter a[data-category]');
    // Mobile category buttons
    const mobileCategoryButtons = document.querySelectorAll('.filter-options .filter-option[data-category]');

    function updateCategoryUI(category) {
        // Update breadcrumb
        const breadcrumbActive = document.querySelector('.breadcrumb-item.active');
        if (breadcrumbActive) {
            breadcrumbActive.textContent = category === 'all' ? 'All Products' : 
                category.charAt(0).toUpperCase() + category.slice(1) + "'s Collection";
        }

        // Update title
        const shopTitle = document.querySelector('.shop-title');
        if (shopTitle) {
            shopTitle.textContent = category === 'all' ? 'Our Collection' : 
                category.charAt(0).toUpperCase() + category.slice(1) + "'s Collection";
        }

        // Update active states for desktop
        desktopCategoryLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.category === category);
        });

        // Update active states for mobile
        mobileCategoryButtons.forEach(button => {
            button.classList.toggle('selected', button.dataset.category === category);
        });

        // Filter products
        const productCards = document.querySelectorAll('.col-6[data-category]');
        productCards.forEach(card => {
            if (category === 'all') {
                card.style.display = '';
            } else {
                card.style.display = card.dataset.category === category ? '' : 'none';
            }
        });

        // Close mobile filter modal if open
        const filterModal = bootstrap.Modal.getInstance(document.getElementById('filterModal'));
        if (filterModal) {
            filterModal.hide();
        }

        // Update URL without reloading the page
        const url = new URL(window.location.href);
        if (category === 'all') {
            url.searchParams.delete('category');
        } else {
            url.searchParams.set('category', category);
        }
        window.history.pushState({}, '', url);
    }

    // Handle desktop category clicks
    desktopCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.dataset.category;
            updateCategoryUI(category);
        });
    });

    // Handle mobile category clicks
    mobileCategoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            updateCategoryUI(category);
        });
    });

    // Handle initial category from URL
    function handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category') || 'all';
        updateCategoryUI(category);
    }

    // Initialize category from URL
    handleURLParameters();
});

// Checkout Functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!window.location.pathname.includes('checkout.html')) return;

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        window.location.href = 'account.html';
        return;
    }

    const progressBar = document.querySelector('.progress-bar');
    const steps = document.querySelectorAll('.step');
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    const shippingForm = document.getElementById('shippingForm');
    const summaryItems = document.querySelector('.summary-items');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const shippingAmount = document.querySelector('.shipping-amount');
    const totalAmount = document.querySelector('.total-amount');

    let currentStep = 1;
    const shippingFee = 1500; // ₦1,500 shipping fee

    // Initialize order summary
    function initializeOrderSummary() {
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        
        if (cartItems.length === 0) {
            window.location.href = 'shop.html';
            return;
        }

        let subtotal = 0;
        summaryItems.innerHTML = cartItems.map(item => {
            subtotal += item.price * item.quantity;
            return `
                <div class="summary-item">
                    <div class="summary-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="summary-item-details">
                        <h6 class="summary-item-title">${item.title}</h6>
                        <div class="summary-item-price">₦ ${item.price.toLocaleString()}</div>
                        <div class="summary-item-quantity">Quantity: ${item.quantity}</div>
                    </div>
                </div>
            `;
        }).join('');

        subtotalAmount.textContent = `₦ ${subtotal.toLocaleString()}`;
        shippingAmount.textContent = `₦ ${shippingFee.toLocaleString()}`;
        totalAmount.textContent = `₦ ${(subtotal + shippingFee).toLocaleString()}`;
    }

    // Update progress bar and steps
    function updateProgress(step) {
        const percent = ((step - 1) / 2) * 100;
        progressBar.style.width = `${percent}%`;
        
        steps.forEach((stepEl, index) => {
            if (index + 1 === step) {
                stepEl.classList.add('active');
            } else if (index + 1 < step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });

        checkoutSteps.forEach((stepEl, index) => {
            if (index + 1 === step) {
                stepEl.classList.add('active');
            } else {
                stepEl.classList.remove('active');
            }
        });

        currentStep = step;
    }

    // Handle shipping form submission
    if (shippingForm) {
        shippingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const shippingData = {};
            formData.forEach((value, key) => {
                shippingData[key] = value;
            });
            localStorage.setItem('shippingInfo', JSON.stringify(shippingData));
            updateProgress(2);
        });
    }

    // Handle payment method selection
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            const paymentForm = document.querySelector('.payment-form');
            if (this.id === 'card') {
                paymentForm.style.display = 'block';
            } else {
                paymentForm.style.display = 'none';
            }
        });
    });

    // Handle navigation buttons
    document.querySelectorAll('.navigation-buttons').forEach(nav => {
        nav.addEventListener('click', function(e) {
            if (e.target.classList.contains('back-btn')) {
                updateProgress(currentStep - 1);
            } else if (e.target.classList.contains('continue-btn')) {
                if (currentStep === 2) {
                    // Save payment info
                    const paymentMethod = document.querySelector('input[name="payment"]:checked').id;
                    localStorage.setItem('paymentMethod', paymentMethod);
                    
                    // Update review step
                    const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo'));
                    document.querySelector('.shipping-address').textContent = `${shippingInfo.firstName} ${shippingInfo.lastName}, ${shippingInfo.streetAddress}, ${shippingInfo.city}, ${shippingInfo.state}`;
                    document.querySelector('.payment-method').textContent = 
                        paymentMethod === 'card' ? 'Credit/Debit Card' : 'PayPal';
                }
                updateProgress(currentStep + 1);
            }
        });
    });

    // Handle place order button
    document.querySelector('.place-order-btn').addEventListener('click', function() {
        // Show loading state
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Simulate order processing
        setTimeout(() => {
            // Clear cart
            localStorage.removeItem('cart');
            
            // Show success message
            const successMessage = document.createElement('div');
            successMessage.className = 'alert alert-success';
            successMessage.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Order placed successfully! Thank you for shopping with us.
                <br>
                Redirecting to homepage...
            `;
            document.querySelector('.checkout-form').prepend(successMessage);

            // Redirect to homepage after 3 seconds
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }, 2000);
    });

    // Handle edit buttons in review step
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.review-section');
            if (section.querySelector('h4').textContent.includes('Shipping')) {
                updateProgress(1);
            } else {
                updateProgress(2);
            }
        });
    });

    // Initialize order summary
    initializeOrderSummary();
});

// Profile Dashboard Functionality
function initializeDashboard() {
    const dashboardNav = document.querySelector('.dashboard-nav');
    const dashboardSections = document.querySelectorAll('.dashboard-section');
    const photoInput = document.getElementById('photoInput');
    const profileImage = document.getElementById('profileImage');
    const addAddressBtn = document.querySelector('.add-address-btn');
    const addressModalElement = document.getElementById('addressModal');
    
    let addressModal = null;
    
    // Only initialize modal if element exists
    if (addressModalElement) {
        try {
            addressModal = new bootstrap.Modal(addressModalElement);
        } catch (error) {
            console.warn('Modal initialization failed:', error);
        }
    }

    // Navigation
    if (dashboardNav) {
        dashboardNav.addEventListener('click', (e) => {
            const link = e.target.closest('a[data-section]');
            if (!link) return;

            e.preventDefault();
            const targetSection = link.getAttribute('data-section');

            // Update active states
            dashboardNav.querySelectorAll('li').forEach(li => li.classList.remove('active'));
            link.parentElement.classList.add('active');

            // Show target section
            dashboardSections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetSection) {
                    section.classList.add('active');
                }
            });

            // Update URL hash
            window.location.hash = targetSection;
        });

        // Handle initial load based on URL hash
        const hash = window.location.hash.slice(1);
        if (hash) {
            const activeLink = dashboardNav.querySelector(`a[data-section="${hash}"]`);
            if (activeLink) {
                activeLink.click();
            }
        }
    }

    // Profile Image Upload
    if (photoInput && profileImage) {
        const changePhotoBtn = document.querySelector('.change-photo-btn');
        
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', () => {
                photoInput.click();
            });

            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        profileImage.src = e.target.result;
                        // Save to localStorage
                        localStorage.setItem('profileImage', e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });

            // Load saved profile image
            const savedImage = localStorage.getItem('profileImage');
            if (savedImage) {
                profileImage.src = savedImage;
            }
        }
    }

    // Orders Section
    function loadOrders() {
        const ordersList = document.querySelector('.orders-list');
        if (!ordersList) return;

        // Get orders from localStorage or use sample data
        const orders = JSON.parse(localStorage.getItem('orders')) || [
            {
                id: 'ORD-2024-001',
                date: 'Feb 15, 2024',
                status: 'delivered',
                total: '₦27,150',
                products: [
                    {
                        image: 'assets/images/products/men-1.jpg',
                        name: "Men's Glossy Tassel Brogue Shoes",
                        price: '₦27,150'
                    }
                ]
            }
        ];

        ordersList.innerHTML = orders.map(order => `
            <div class="order-item">
                <div class="order-header">
                    <div>
                        <span class="order-id">${order.id}</span>
                        <span class="order-date">${order.date}</span>
                    </div>
                    <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-products">
                    ${order.products.map(product => `
                        <div class="order-product">
                            <div class="order-product-image">
                                <img src="${product.image}" alt="${product.name}">
                            </div>
                            <div class="order-product-details">
                                <h4>${product.name}</h4>
                                <span class="order-product-price">${product.price}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-total">
                    Total: ${order.total}
                </div>
            </div>
        `).join('');
    }

    // Wishlist Section
    function loadWishlist() {
        const wishlistGrid = document.querySelector('.wishlist-grid');
        if (!wishlistGrid) return;

        if (wishlist.items.length === 0) {
            wishlistGrid.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-heart" style="font-size: 3rem; color: #ddd;"></i>
                    <p class="mt-3">Your wishlist is empty</p>
                </div>
            `;
            return;
        }

        wishlistGrid.innerHTML = wishlist.items.map(item => {
            // Handle different price formats and ensure a default value
            let price = 0;
            if (item.price) {
                if (typeof item.price === 'string') {
                    // Remove any non-numeric characters except dots
                    price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
                } else if (typeof item.price === 'number') {
                    price = item.price;
                }
            }

            return `
                <div class="wishlist-item">
                    <div class="wishlist-item-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="wishlist-item-details">
                        <h4 class="wishlist-item-title">${item.title}</h4>
                        <div class="wishlist-item-price">₦ ${item.price.toLocaleString()}</div>
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
    }
};
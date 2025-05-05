// Account Management
const account = {
    init() {
        this.setupEventListeners();
        this.checkLoginStatus();
        this.initializeDashboard();
        this.updateNavigation();
    },

    setupEventListeners() {
        // Login form submission
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const data = Object.fromEntries(formData.entries());
                this.login(data);
            });
        }

        // Register form submission
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const data = Object.fromEntries(formData.entries());
                this.register(data);
            });
        }

        // Logout buttons
        const logoutBtns = document.querySelectorAll('#logoutBtn, #dashboardLogout');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });

        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        if (tabBtns.length > 0) {
            tabBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        const tab = btn.dataset.tab;
                        if (tab) {
                            this.switchTab(tab);
                        }
                    });
                }
            });
        }

        // Password visibility toggle
        const toggleBtns = document.querySelectorAll('.toggle-password');
        if (toggleBtns.length > 0) {
            toggleBtns.forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        const input = e.target.closest('.input-group')?.querySelector('input');
                        const icon = e.target.querySelector('i');
                        if (input && icon) {
                            if (input.type === 'password') {
                                input.type = 'text';
                                icon.classList.remove('fa-eye');
                                icon.classList.add('fa-eye-slash');
                            } else {
                                input.type = 'password';
                                icon.classList.remove('fa-eye-slash');
                                icon.classList.add('fa-eye');
                            }
                        }
                    });
                }
            });
        }
    },

    initializeDashboard() {
        const dashboardNav = document.querySelector('.dashboard-nav');
        const dashboardSections = document.querySelectorAll('.dashboard-section');
        
        if (dashboardNav) {
            // Handle navigation clicks
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

                // Handle logout
                if (targetSection === 'logout') {
                    this.logout();
                    return;
                }

                // Update URL hash
                window.location.hash = targetSection;
            });

            // Handle initial load based on URL hash
            const hash = window.location.hash.slice(1);
            if (hash) {
                const activeLink = dashboardNav.querySelector(`a[data-section="${hash}"]`);
                if (activeLink) {
                    activeLink.click();
                } else {
                    // Default to orders section if hash is invalid
                    dashboardNav.querySelector('a[data-section="orders"]').click();
                }
            } else {
                // Default to orders section if no hash
                dashboardNav.querySelector('a[data-section="orders"]').click();
            }
        }

        // Handle profile image change
        const changePhotoBtn = document.querySelector('.change-photo-btn');
        if (changePhotoBtn) {
            changePhotoBtn.addEventListener('click', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            document.getElementById('profileImage').src = event.target.result;
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
            const profileImage = document.getElementById('profileImage');
            if (profileImage) {
                profileImage.src = savedImage;
            }
        }
    },

    login(data) {
        // Simple validation
        if (!data.email?.includes('@') || !data.password || data.password.length < 6) {
            alert('Please enter a valid email and password (minimum 6 characters)');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
                name: 'Demo User',
                email: data.email
            }));
            this.showDashboard();
            this.updateNavigation();
            window.location.href = 'account.html';
        }, 1000);
    },

    register(data) {
        // Validation
        if (!data.fullName || !data.email || !data.password || !data.confirmPassword) {
            alert('Please fill in all required fields.');
            return;
        }

        if (data.password !== data.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        if (data.password.length < 6) {
            alert('Password must be at least 6 characters long.');
            return;
        }

        if (!data.email.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }

        if (!data.terms) {
            alert('Please accept the Terms of Service and Privacy Policy.');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify({
                name: data.fullName,
                email: data.email
            }));
            alert('Registration successful! Welcome to ShoePalace.');
            this.showDashboard();
            this.updateNavigation();
            window.location.href = 'account.html';
        }, 1000);
    },

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        this.hideDashboard();
        this.updateNavigation();
        window.location.href = 'index.html';
    },

    checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn && window.location.pathname.includes('account.html')) {
            this.showDashboard();
        } else if (window.location.pathname.includes('account.html')) {
            this.hideDashboard();
        }
    },

    showDashboard() {
        const authForms = document.getElementById('authForms');
        const profileDashboard = document.getElementById('profileDashboard');
        
        if (authForms && profileDashboard) {
            authForms.style.display = 'none';
            profileDashboard.style.display = 'block';
            this.updateDashboardInfo();
        }
    },

    hideDashboard() {
        const authForms = document.getElementById('authForms');
        const profileDashboard = document.getElementById('profileDashboard');
        
        if (authForms && profileDashboard) {
            authForms.style.display = 'block';
            profileDashboard.style.display = 'none';
        }
    },

    updateDashboardInfo() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const settingsName = document.getElementById('settingsName');
        const settingsEmail = document.getElementById('settingsEmail');
        
        if (profileName && profileEmail) {
            profileName.textContent = user.name || 'User';
            profileEmail.textContent = user.email || '';
        }

        if (settingsName && settingsEmail) {
            settingsName.value = user.name || '';
            settingsEmail.value = user.email || '';
        }
    },

    switchTab(tab) {
        const tabs = document.querySelectorAll('.tab-btn');
        const forms = document.querySelectorAll('.form-content');
        
        tabs.forEach(t => {
            if (t) {
                t.classList.remove('active');
                if (t.dataset.tab === tab) {
                    t.classList.add('active');
                }
            }
        });
        
        forms.forEach(f => {
            if (f) {
                f.classList.remove('active');
                if (f.id === `${tab}Form`) {
                    f.classList.add('active');
                }
            }
        });
    },

    updateNavigation() {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        // Find the My Account dropdown by looking for its parent
        const accountDropdownParent = Array.from(document.querySelectorAll('.nav-item.dropdown'))
            .find(item => item.textContent.trim().includes('My Account'));
        const accountDropdown = accountDropdownParent?.querySelector('.dropdown-menu');
        
        if (accountDropdown) {
            if (isLoggedIn) {
                accountDropdown.innerHTML = `
                    <li><a class="dropdown-item" href="account.html#profile">Profile</a></li>
                    <li><a class="dropdown-item" href="account.html#orders">Orders</a></li>
                    <li><a class="dropdown-item" href="account.html#wishlist">Wishlist</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="account.html#settings">Settings</a></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
                `;
                // Re-attach logout event listener
                const logoutBtn = accountDropdown.querySelector('#logoutBtn');
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.logout();
                    });
                }
            } else {
                accountDropdown.innerHTML = `
                    <li><a class="dropdown-item" href="account.html">Login / Register</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item disabled" href="#">Profile</a></li>
                    <li><a class="dropdown-item disabled" href="#">Orders</a></li>
                    <li><a class="dropdown-item disabled" href="#">Wishlist</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item disabled" href="#">Settings</a></li>
                `;
            }
        }
    },
}
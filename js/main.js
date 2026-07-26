/**
 * ============================================
 * MAIN.JS - Core Functionality
 * Foodie's Delight - Restaurant Food Order Website
 * ============================================
 * 
 * This file handles all core functionality including:
 * - Navigation (mobile menu, scroll effects)
 * - Smooth scrolling
 * - Cart badge updates
 * - Form handling
 * - Theme customization
 * - Utility functions
 * ============================================
 */

// ============================================
// MAIN APPLICATION - The heart of the website
// ============================================

class MainApp {
    constructor() {
        this.isMobileMenuOpen = false;
        this.isScrolled = false;
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        // Setup navigation
        this.setupNavigation();

        // Setup scroll effects
        this.setupScrollEffects();

        // Setup smooth scrolling
        this.setupSmoothScrolling();

        // Setup cart badge
        this.setupCartBadge();

        // Setup form handling
        this.setupForms();

        // Setup image lazy loading
        this.setupLazyLoading();

        // Setup intersection observer for animations
        this.setupIntersectionObserver();

        // Log a friendly welcome message
        this.logWelcomeMessage();

        console.log('🚀 MainApp initialized successfully!');
    }

    // ============================================
    // NAVIGATION - Your friendly guide
    // ============================================

    setupNavigation() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Hamburger menu toggle
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                this.toggleMobileMenu(hamburger, navMenu);
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (this.isMobileMenuOpen &&
                    !navMenu.contains(e.target) &&
                    !hamburger.contains(e.target)) {
                    this.closeMobileMenu(hamburger, navMenu);
                }
            });

            // Close menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (this.isMobileMenuOpen) {
                        this.closeMobileMenu(hamburger, navMenu);
                    }
                });
            });

            // Handle window resize
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(() => {
                    if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                        this.closeMobileMenu(hamburger, navMenu);
                    }
                }, 250);
            });
        }

        // Highlight active navigation link
        this.highlightActiveLink();
    }

    toggleMobileMenu(hamburger, navMenu) {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu(hamburger, navMenu) {
        this.isMobileMenuOpen = false;
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = document.querySelectorAll('.nav-link');

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath ||
                (currentPath === '/' && href === 'index.html') ||
                (currentPath.endsWith('/') && href === 'index.html')) {
                link.classList.add('active');
            } else if (currentPath.includes(href) && href !== 'index.html') {
                link.classList.add('active');
            }
        });
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().split('.')[0] || 'index';
        return page;
    }

    // ============================================
    // SCROLL EFFECTS - Smooth and elegant
    // ============================================

    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');

        if (!navbar) return;

        // Throttled scroll handler
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(() => {
                this.handleScroll(navbar);
                scrollTimeout = null;
            }, 10);
        });

        // Initial check
        this.handleScroll(navbar);
    }

    handleScroll(navbar) {
        const scrollY = window.scrollY;
        const shouldBeScrolled = scrollY > 50;

        if (shouldBeScrolled !== this.isScrolled) {
            this.isScrolled = shouldBeScrolled;
            navbar.classList.toggle('scrolled', shouldBeScrolled);
        }

        // Update progress bar if exists
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;

        progressBar.style.width = `${progress}%`;
    }

    // ============================================
    // SMOOTH SCROLLING - A gentle journey
    // ============================================

    setupSmoothScrolling() {
        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Smooth scroll for "Back to Top" buttons
        document.querySelectorAll('.back-to-top').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ============================================
    // CART BADGE - Keeping you informed
    // ============================================

    setupCartBadge() {
        this.updateCartBadge();

        // Listen for cart updates
        window.addEventListener('storage', (e) => {
            if (e.key === 'foodieCart') {
                this.updateCartBadge();
            }
        });

        // Listen for custom cart update events
        document.addEventListener('cartUpdated', () => {
            this.updateCartBadge();
        });
    }

    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        let itemCount = 0;

        try {
            const savedCart = localStorage.getItem('foodieCart');
            if (savedCart) {
                const cartData = JSON.parse(savedCart);
                if (cartData.items) {
                    itemCount = cartData.items.reduce((total, item) => total + item.quantity, 0);
                }
            }
        } catch (error) {
            console.warn('Unable to read cart data:', error);
        }

        badges.forEach(badge => {
            badge.textContent = itemCount;
            badge.style.display = itemCount > 0 ? 'inline' : 'none';
        });
    }

    // ============================================
    // FORM HANDLING - Making connections
    // ============================================

    setupForms() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleContactForm(contactForm);
            });
        }

        // Newsletter form
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleNewsletterForm(form);
            });
        });

        // Search form
        const searchForms = document.querySelectorAll('.search-form');
        searchForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSearchForm(form);
            });
        });
    }

    handleContactForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Simulate form submission
        setTimeout(() => {
            // Show success message
            const successDiv = form.querySelector('.form-success');
            if (successDiv) {
                successDiv.style.display = 'block';
            }

            // Reset form
            form.reset();

            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;

            // Show notification
            this.showNotification('📨 Message sent successfully! We\'ll get back to you soon.', 'success');

            // Hide success message after 5 seconds
            setTimeout(() => {
                if (successDiv) {
                    successDiv.style.display = 'none';
                }
            }, 5000);
        }, 2000);
    }

    handleNewsletterForm(form) {
        const input = form.querySelector('input[type="email"]');
        if (!input) return;

        const email = input.value.trim();
        if (!this.validateEmail(email)) {
            this.showNotification('Please enter a valid email address', 'warning');
            input.focus();
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        // Simulate subscription
        setTimeout(() => {
            this.showNotification('🎉 Thank you for subscribing!', 'success');
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1000);
    }

    handleSearchForm(form) {
        const input = form.querySelector('input[type="search"]');
        if (!input) return;

        const query = input.value.trim();
        if (!query) {
            this.showNotification('Please enter a search term', 'warning');
            input.focus();
            return;
        }

        // Redirect to menu page with search query
        window.location.href = `menu.html?search=${encodeURIComponent(query)}`;
    }

    // ============================================
    // IMAGE LAZY LOADING - Performance matters
    // ============================================

    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px',
                threshold: 0.1
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.getAttribute('data-src');
                img.removeAttribute('data-src');
            });
        }
    }

    // ============================================
    // INTERSECTION OBSERVER - Animations on scroll
    // ============================================

    setupIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.getAttribute('data-animation') || 'fadeInUp';
                        element.classList.add(`animate-${animation}`);
                        element.style.opacity = '1';
                        animationObserver.unobserve(element);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            document.querySelectorAll('[data-animate]').forEach(element => {
                element.style.opacity = '0';
                animationObserver.observe(element);
            });
        } else {
            // Fallback for older browsers
            document.querySelectorAll('[data-animate]').forEach(element => {
                element.style.opacity = '1';
                element.classList.add('animate-fadeInUp');
            });
        }
    }

    // ============================================
    // NOTIFICATIONS - Friendly feedback
    // ============================================

    showNotification(message, type = 'info') {
        // Check if there's a notification container
        let container = document.getElementById('notificationContainer');

        if (!container) {
            container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 9999;
                max-width: 350px;
                width: 100%;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        // Create the notification
        const notification = document.createElement('div');
        let icon = 'ℹ️';
        let borderColor = '#667eea';

        switch (type) {
            case 'success':
                icon = '✅';
                borderColor = '#56ab2f';
                break;
            case 'error':
                icon = '❌';
                borderColor = '#f5576c';
                break;
            case 'warning':
                icon = '⚠️';
                borderColor = '#ffd93d';
                break;
            default:
                icon = 'ℹ️';
                borderColor = '#667eea';
        }

        notification.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 10px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.15);
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            pointer-events: auto;
            display: flex;
            align-items: center;
            gap: 12px;
            border-left: 4px solid ${borderColor};
        `;

        notification.innerHTML = `
            <span style="font-size:1.5rem;">${icon}</span>
            <span style="flex:1;font-size:0.95rem;color:#2d3436;">${message}</span>
            <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#b0b0b0;cursor:pointer;font-size:1.1rem;">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(notification);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

        // Auto-remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 400);
        }, 4000);
    }

    // ============================================
    // UTILITY FUNCTIONS - Helpers
    // ============================================

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^[\+\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // ============================================
    // WELCOME MESSAGE - A friendly hello
    // ============================================

    logWelcomeMessage() {
        const page = this.currentPage;
        const messages = {
            'index': '🏠 Welcome to Foodie\'s Delight! Ready to order?',
            'menu': '📖 Explore our delicious menu!',
            'cart': '🛒 Review your order!',
            'checkout': '📝 Almost there! Let\'s complete your order.',
            'about': '📖 Learn our story!',
            'contact': '📬 We\'d love to hear from you!'
        };

        const message = messages[page] || '🍽️ Welcome to Foodie\'s Delight!';
        console.log(message);
        console.log('❤️ Made with love by the Foodie\'s Delight team');
    }

    // ============================================
    // DARK MODE TOGGLE (optional feature)
    // ============================================

    setupDarkMode() {
        const toggle = document.querySelector('.dark-mode-toggle');
        if (!toggle) return;

        // Check for saved preference
        const isDark = localStorage.getItem('darkMode') === 'true';
        if (isDark) {
            document.body.classList.add('dark-mode');
            toggle.checked = true;
        }

        toggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
            this.showNotification(
                document.body.classList.contains('dark-mode') ?
                    '🌙 Dark mode activated' :
                    '☀️ Light mode activated',
                'info'
            );
        });
    }

    // ============================================
    // COOKIE CONSENT (optional feature)
    // ============================================

    setupCookieConsent() {
        const consent = localStorage.getItem('cookieConsent');
        if (consent) return;

        const banner = document.querySelector('.cookie-consent');
        if (!banner) return;

        const acceptBtn = banner.querySelector('.accept-cookies');
        const declineBtn = banner.querySelector('.decline-cookies');

        banner.style.display = 'block';

        if (acceptBtn) {
            acceptBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'true');
                banner.style.display = 'none';
                this.showNotification('🍪 Thanks for accepting cookies!', 'success');
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', () => {
                localStorage.setItem('cookieConsent', 'false');
                banner.style.display = 'none';
                this.showNotification('You can change cookie preferences anytime.', 'info');
            });
        }
    }
}

// ============================================
// GLOBAL FUNCTIONS - For use in HTML
// ============================================

/**
 * Show a notification (global function)
 * @param {string} message - The message to show
 * @param {string} type - The type of notification
 */
function showNotification(message, type = 'info') {
    if (window.mainApp) {
        window.mainApp.showNotification(message, type);
    } else {
        console.log(`${type}: ${message}`);
    }
}

/**
 * Format currency (global function)
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
    if (window.mainApp) {
        return window.mainApp.formatCurrency(amount);
    }
    return `$${amount.toFixed(2)}`;
}

/**
 * Get a query parameter from the URL
 * @param {string} param - The parameter name
 * @returns {string|null} The parameter value
 */
function getQueryParam(param) {
    if (window.mainApp) {
        return window.mainApp.getQueryParam(param);
    }
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ============================================
// DOM READY - Initialize the application
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    // Create the main application instance
    if (typeof window.mainApp === 'undefined') {
        window.mainApp = new MainApp();
        console.log('🚀 MainApp initialized successfully!');

        // Dispatch a custom event
        document.dispatchEvent(new CustomEvent('appReady'));
    }
});

// ============================================
// PAGE LOAD - Additional setup
// ============================================

window.addEventListener('load', function () {
    // Remove loading class if exists
    document.body.classList.remove('loading');

    // Add loaded class
    document.body.classList.add('loaded');

    // Trigger animations for elements that need them
    document.querySelectorAll('[data-animate]').forEach(element => {
        if (!element.classList.contains('animate-fadeInUp') &&
            !element.classList.contains('animate-fadeInDown') &&
            !element.classList.contains('animate-fadeInLeft') &&
            !element.classList.contains('animate-fadeInRight')) {
            element.classList.add('animate-fadeInUp');
        }
    });

    console.log('📄 Page fully loaded');
});

// ============================================
// ERROR HANDLING - Graceful fallbacks
// ============================================

window.addEventListener('error', function (e) {
    console.error('An error occurred:', e.message);
    // You could show a friendly error message here
});

// ============================================
// NETWORK STATUS - Inform the user
// ============================================

window.addEventListener('online', function () {
    showNotification('🌐 You\'re back online!', 'success');
});

window.addEventListener('offline', function () {
    showNotification('📡 You\'re offline. Some features may be limited.', 'warning');
});

// ============================================
// BEFORE UNLOAD - Save state
// ============================================

window.addEventListener('beforeunload', function () {
    // Save any pending data
    console.log('💾 Saving application state...');
});

// ============================================
// EXPORT (for module bundlers if needed)
// ============================================

// If using ES modules
// export default MainApp;
// export { MainApp, showNotification, formatCurrency, getQueryParam };

console.log('📄 Main.js loaded successfully!');
console.log('❤️ Thank you for visiting Foodie\'s Delight!');
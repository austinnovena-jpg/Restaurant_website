/**
 * ============================================
 * MENU.JS - Menu Browsing and Filtering
 * Foodie's Delight - Restaurant Food Order Website
 * ============================================
 * 
 * This file handles all menu functionality including:
 * - Loading menu items
 * - Category filtering
 * - Grid/List view toggling
 * - Search functionality
 * - Add to cart
 * - Chef's special display
 * ============================================
 */

// ============================================
// MENU CLASS - Your culinary guide
// ============================================

class Menu {
    constructor() {
        this.items = [];
        this.filteredItems = [];
        this.currentCategory = 'all';
        this.currentView = 'grid';
        this.searchQuery = '';
        this.cart = window.cart || null;
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        // Load menu items
        this.loadMenuItems();

        // Setup event listeners
        this.setupEventListeners();

        // Check for search query in URL
        this.handleSearchQuery();

        // Setup chef's special
        this.setupChefSpecial();

        // Log a friendly welcome message
        console.log('📖 Menu loaded successfully!');
        console.log(`🍽️ ${this.items.length} delicious items available`);

        // Show menu loaded notification
        this.showNotification('🍽️ Our menu is ready! What looks good today?', 'info');
    }

    // ============================================
    // LOAD MENU ITEMS - The delicious data
    // ============================================

    loadMenuItems() {
        // Sample menu data - In a real app, this would come from an API or JSON file
        this.items = [
            // Appetizers
            {
                id: 1,
                name: 'Truffle Mushroom Bruschetta',
                category: 'appetizers',
                price: 12.99,
                description: 'Toasted artisan bread topped with wild mushrooms, truffle oil, and fresh herbs',
                badge: 'chef-recommend',
                image: 'assets/images/rayan-amarasekara-qc4M_jr-qC0-unsplash.jpg',
                variant: 'Vegetarian',
                chefNote: 'My grandmother\'s secret recipe - the truffle oil makes all the difference!'
            },
            {
                id: 2,
                name: 'Crispy Calamari',
                category: 'appetizers',
                price: 14.99,
                description: 'Lightly breaded calamari rings served with zesty marinara sauce and lemon aioli',
                badge: 'bestseller',
                image: 'assets/images/joanie-simon-COtv-D5osKA-unsplash.jpg',
                variant: 'Seafood',
                chefNote: 'Perfectly crispy every time - a customer favorite!'
            },
            {
                id: 3,
                name: 'Spinach & Artichoke Dip',
                category: 'appetizers',
                price: 11.99,
                description: 'Creamy blend of spinach, artichokes, and three cheeses served with crispy tortilla chips',
                badge: 'vegetarian',
                image: 'assets/images/kajetan-sumila-6LVresZZ13Y-unsplash.jpg',
                variant: 'Vegetarian',
                chefNote: 'The perfect shareable starter for any gathering!'
            },

            // Main Course
            {
                id: 4,
                name: 'Grilled Salmon Fillet',
                category: 'main-course',
                price: 28.99,
                description: 'Perfectly grilled Atlantic salmon with lemon herb butter, served with seasonal vegetables',
                badge: 'chef-recommend',
                image: 'assets/images/nhathuy-duong-hKneg1iuj2A-unsplash.jpg',
                variant: 'Gluten-Free',
                chefNote: 'Fresh salmon delivered daily - it\'s our signature dish!'
            },
            {
                id: 5,
                name: 'Herb-Crusted Rack of Lamb',
                category: 'main-course',
                price: 34.99,
                description: 'Australian lamb rack with rosemary crust, served with mint sauce and roasted potatoes',
                badge: 'bestseller',
                image: 'assets/images/pesce-huang-iNXC9Ti1M1M-unsplash.jpg',
                variant: 'Premium',
                chefNote: 'A special occasion favorite - cooked to perfection every time!'
            },
            {
                id: 6,
                name: 'Wild Mushroom Risotto',
                category: 'main-course',
                price: 24.99,
                description: 'Creamy Arborio rice with wild mushrooms, truffle oil, and aged Parmesan cheese',
                badge: 'vegetarian',
                image: 'assets/images/inna-safa-MHLjZDW-Bjk-unsplash.jpg',
                variant: 'Vegetarian',
                chefNote: 'This risotto is like a warm hug on a plate!'
            },

            // Pasta
            {
                id: 7,
                name: 'Homemade Linguine Carbonara',
                category: 'pasta',
                price: 22.99,
                description: 'Fresh linguine with pancetta, egg yolk, and Pecorino Romano cheese',
                badge: 'bestseller',
                image: 'assets/images/rob-wicks-fDLBn8X_IlU-unsplash.jpg',
                variant: 'Classic',
                chefNote: 'Made fresh daily - just like Nonna used to make!'
            },
            {
                id: 8,
                name: 'Spaghetti alla Puttanesca',
                category: 'pasta',
                price: 20.99,
                description: 'Spaghetti with tomatoes, olives, capers, and anchovies in a garlic-olive oil sauce',
                badge: 'spicy',
                image: 'assets/images/homescreenify-sA3wymYqyaI-unsplash.jpg',
                variant: 'Spicy',
                chefNote: 'Bold flavors that transport you straight to Italy!'
            },
            {
                id: 9,
                name: 'Fettuccine Alfredo',
                category: 'pasta',
                price: 21.99,
                description: 'Fresh fettuccine in a rich, creamy Parmesan cheese sauce',
                badge: 'vegetarian',
                image: 'assets/images/karolina-bobek-abi8eXOlUUg-unsplash.jpg',
                variant: 'Vegetarian',
                chefNote: 'Simple, elegant, and absolutely delicious!'
            },

            // Seafood
            {
                id: 10,
                name: 'Seafood Paella',
                category: 'seafood',
                price: 32.99,
                description: 'Saffron rice with shrimp, mussels, clams, and calamari, Spanish-style',
                badge: 'chef-recommend',
                image: 'assets/images/ines-iachelini-WWtbDSXmjz0-unsplash.jpg',
                variant: 'Seafood',
                chefNote: 'A taste of Spain right in your neighborhood!'
            },
            {
                id: 11,
                name: 'Lobster Thermidor',
                category: 'seafood',
                price: 39.99,
                description: 'Lobster in creamy brandy sauce with mushrooms, topped with Parmesan',
                badge: 'bestseller',
                image: 'assets/images/hls-44-ZfNzy3tx0bI-unsplash.jpg',
                variant: 'Premium',
                chefNote: 'Celebrate something special with this luxurious dish!'
            },
            {
                id: 12,
                name: 'Grilled Swordfish',
                category: 'seafood',
                price: 29.99,
                description: 'Grilled swordfish steak with citrus-garlic butter and roasted vegetables',
                badge: 'gluten-free',
                image: 'assets/images/federico-ramirez-4GrI_1tg2B4-unsplash.jpg',
                variant: 'Gluten-Free',
                chefNote: 'Fresh, healthy, and bursting with flavor!'
            },

            // Desserts
            {
                id: 13,
                name: 'Tiramisu',
                category: 'desserts',
                price: 9.99,
                description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone cream',
                badge: 'bestseller',
                image: 'assets/images/serghey-savchuk-laR96zKlwvU-unsplash.jpg',
                variant: 'Classic',
                chefNote: 'Our pastry chef\'s masterpiece - you\'ll dream about this!'
            },
            {
                id: 14,
                name: 'Chocolate Lava Cake',
                category: 'desserts',
                price: 10.99,
                description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
                badge: 'chef-recommend',
                image: 'assets/images/kouji-tsuru-GqIOOPV_ung-unsplash.jpg',
                variant: 'Decadent',
                chefNote: 'The perfect ending to any meal - pure chocolate heaven!'
            },
            {
                id: 15,
                name: 'Crème Brûlée',
                category: 'desserts',
                price: 9.99,
                description: 'Rich vanilla custard with caramelized sugar topping, served with fresh berries',
                badge: 'vegetarian',
                image: 'assets/images/orkun-orcan-xQFLBRdch_k-unsplash.jpg',
                variant: 'Classic',
                chefNote: 'The satisfying crack of the caramelized top is pure joy!'
            },

            // Beverages
            {
                id: 16,
                name: 'Espresso Martini',
                category: 'beverages',
                price: 12.99,
                description: 'Premium vodka, fresh espresso, and coffee liqueur, shaken to perfection',
                badge: 'chef-recommend',
                image: 'assets/images/coffee_square_crop.jpg',
                variant: 'Alcoholic',
                chefNote: 'The perfect pick-me-up after a delicious meal!'
            },
            {
                id: 17,
                name: 'Fresh Lemonade',
                category: 'beverages',
                price: 5.99,
                description: 'Hand-squeezed lemonade with mint and a hint of honey',
                badge: 'vegetarian',
                image: 'assets/images/juliet-frias-WDgN0XclV_w-unsplash.jpg',
                variant: 'Non-Alcoholic',
                chefNote: 'Refreshment in a glass - just like summer!'
            },
            {
                id: 18,
                name: 'Signature Sangria',
                category: 'beverages',
                price: 10.99,
                description: 'Red wine with fresh fruit, brandy, and a touch of cinnamon',
                badge: 'bestseller',
                image: 'assets/images/roberta-sorge-IywM7AQTZcM-unsplash.jpg',
                variant: 'Alcoholic',
                chefNote: 'Our house sangria - the perfect companion to any meal!'
            }
        ];

        // If there's a search query, filter items
        if (this.searchQuery) {
            this.filterItems(this.searchQuery);
        } else {
            this.filteredItems = [...this.items];
        }

        // Render the menu
        this.renderMenu();
        this.updateCategoryCounts();
    }

    // ============================================
    // RENDER MENU - Show the deliciousness
    // ============================================

    renderMenu() {
        const menuGrid = document.getElementById('menuItems');
        if (!menuGrid) return;

        const items = this.getCurrentItems();

        if (items.length === 0) {
            menuGrid.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:#636e72;">
                    <i class="fas fa-utensils" style="font-size:3rem;display:block;margin-bottom:15px;color:#d0d0d0;"></i>
                    <h3 style="color:#2d3436;margin-bottom:10px;">No items found</h3>
                    <p>Try adjusting your search or filter to find what you're craving</p>
                    <button onclick="menu.clearFilters()" class="btn btn-primary" style="margin-top:15px;display:inline-flex;align-items:center;gap:8px;">
                        <i class="fas fa-undo"></i> Show All Items
                    </button>
                </div>
            `;
            return;
        }

        let html = '';
        items.forEach(item => {
            const badgeHtml = item.badge ?
                `<span class="menu-item-badge ${item.badge}">${this.getBadgeLabel(item.badge)}</span>` : '';

            html += `
                <div class="menu-item-card" data-item-id="${item.id}" data-category="${item.category}">
                    <div class="menu-item-image">
                        <img src="${item.image || 'assets/images/default-food.jpg'}" alt="${item.name}" loading="lazy">
                        ${badgeHtml}
                        <div class="menu-item-story-badge">
                            <i class="fas fa-heart"></i>
                            <span>${item.variant || 'Classic'}</span>
                        </div>
                    </div>
                    <div class="menu-item-content">
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-story-note">
                            <i class="fas fa-quote-left"></i>
                            ${item.chefNote || 'Made with love every day!'}
                        </div>
                        <div class="menu-item-footer">
                            <div class="menu-item-price">
                                $${item.price.toFixed(2)}
                                <span class="price-story">per serving</span>
                            </div>
                            <button class="add-to-cart-btn" onclick="menu.addToCart('${item.id}')">
                                <i class="fas fa-plus"></i>
                                <span>Add to Cart</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        menuGrid.innerHTML = html;

        // Apply view class
        menuGrid.classList.toggle('list-view', this.currentView === 'list');
    }

    // ============================================
    // GET CURRENT ITEMS - Filter logic
    // ============================================

    getCurrentItems() {
        let items = [...this.items];

        // Filter by category
        if (this.currentCategory !== 'all') {
            items = items.filter(item => item.category === this.currentCategory);
        }

        // Filter by search query
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            items = items.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        this.filteredItems = items;
        return items;
    }

    // ============================================
    // CATEGORY FILTERING - Browse by type
    // ============================================

    filterByCategory(category) {
        this.currentCategory = category;

        // Update active button state
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === category);
        });

        // Update category title
        this.updateCategoryTitle(category);

        // Render items
        this.renderMenu();

        // Show notification
        const categoryNames = {
            'all': 'All Delights',
            'appetizers': 'Appetizers 🍤',
            'main-course': 'Main Course 🥩',
            'pasta': 'Pasta 🍝',
            'seafood': 'Seafood 🦞',
            'desserts': 'Desserts 🍰',
            'beverages': 'Beverages 🍷'
        };

        this.showNotification(
            `📖 Showing ${categoryNames[category] || category}`,
            'info'
        );

        // Smooth scroll to menu
        document.querySelector('.menu-items-section')?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    updateCategoryTitle(category) {
        const titleElement = document.getElementById('categoryTitle');
        const descElement = document.getElementById('categoryDescription');

        if (!titleElement) return;

        const categoryNames = {
            'all': 'All Delights',
            'appetizers': 'Appetizers & Starters',
            'main-course': 'Main Course',
            'pasta': 'Pasta Creations',
            'seafood': 'Fresh Seafood',
            'desserts': 'Sweet Endings',
            'beverages': 'Refreshing Beverages'
        };

        const categoryDescriptions = {
            'all': 'Every dish crafted with passion and served with a smile',
            'appetizers': 'The perfect way to start your culinary journey',
            'main-course': 'Hearty dishes made with love and quality ingredients',
            'pasta': 'Handcrafted pasta that tastes like Italy',
            'seafood': 'Fresh catches prepared with care',
            'desserts': 'Sweet treats to end your meal perfectly',
            'beverages': 'The perfect accompaniment to any dish'
        };

        titleElement.textContent = categoryNames[category] || 'All Delights';
        if (descElement) {
            descElement.textContent = categoryDescriptions[category] || '';
        }
    }

    updateCategoryCounts() {
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            const category = btn.dataset.category;
            const count = this.items.filter(item =>
                category === 'all' || item.category === category
            ).length;
            // You could display counts if desired
        });
    }

    // ============================================
    // SEARCH FUNCTIONALITY - Find your craving
    // ============================================

    search(query) {
        this.searchQuery = query.trim();

        // Reset category to all when searching
        this.currentCategory = 'all';
        this.updateCategoryTitle('all');

        // Update active category button
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });

        this.renderMenu();

        const items = this.getCurrentItems();
        if (items.length === 0) {
            this.showNotification('😅 No items found matching your search', 'warning');
        } else {
            this.showNotification(`🔍 Found ${items.length} items matching "${this.searchQuery}"`, 'success');
        }
    }

    clearFilters() {
        this.currentCategory = 'all';
        this.searchQuery = '';

        // Reset category buttons
        const buttons = document.querySelectorAll('.category-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.category === 'all');
        });

        // Clear search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.value = '';
        }

        this.updateCategoryTitle('all');
        this.renderMenu();

        this.showNotification('🔄 Showing all menu items', 'info');
    }

    handleSearchQuery() {
        const query = getQueryParam('search');
        if (query) {
            this.searchQuery = query;
            this.filterByCategory('all');

            // Set search input value
            const searchInput = document.querySelector('.search-input');
            if (searchInput) {
                searchInput.value = query;
            }
        }
    }

    // ============================================
    // VIEW TOGGLES - Grid or list
    // ============================================

    toggleView(view) {
        this.currentView = view;

        // Update button states
        const buttons = document.querySelectorAll('.view-btn');
        buttons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update grid class
        const menuGrid = document.getElementById('menuItems');
        if (menuGrid) {
            menuGrid.classList.toggle('list-view', view === 'list');
        }

        const viewNames = {
            'grid': 'Grid View',
            'list': 'List View'
        };

        this.showNotification(`👁️ Switched to ${viewNames[view]}`, 'info');
    }

    // ============================================
    // ADD TO CART - Start your order
    // ============================================

    addToCart(itemId) {
        const item = this.items.find(i => i.id == itemId);
        if (!item) {
            this.showNotification('❌ Item not found', 'error');
            return;
        }

        // Check if cart exists
        if (this.cart) {
            this.cart.addItem(item, 1);

            // Animate the button
            const btn = document.querySelector(`[data-item-id="${itemId}"] .add-to-cart-btn`);
            if (btn) {
                btn.classList.add('added');
                btn.innerHTML = '<i class="fas fa-check"></i> Added!';
                setTimeout(() => {
                    btn.classList.remove('added');
                    btn.innerHTML = '<i class="fas fa-plus"></i> <span>Add to Cart</span>';
                }, 2000);
            }

            // Update cart badge
            this.updateCartBadge();
        } else {
            // Fallback if cart is not available
            this.showNotification(`✅ Added ${item.name} to cart!`, 'success');

            // Store in localStorage directly
            try {
                let cartData = JSON.parse(localStorage.getItem('foodieCart') || '{"items":[]}');
                const existing = cartData.items.find(i => i.id === item.id);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cartData.items.push({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: 1,
                        image: item.image,
                        variant: item.variant
                    });
                }
                localStorage.setItem('foodieCart', JSON.stringify(cartData));

                // Dispatch custom event
                document.dispatchEvent(new CustomEvent('cartUpdated'));

                // Update badge
                this.updateCartBadge();
            } catch (error) {
                console.warn('Unable to save to cart:', error);
            }
        }
    }

    updateCartBadge() {
        const badges = document.querySelectorAll('.cart-badge');
        let count = 0;

        try {
            const cartData = JSON.parse(localStorage.getItem('foodieCart') || '{"items":[]}');
            count = cartData.items.reduce((total, item) => total + item.quantity, 0);
        } catch (error) {
            console.warn('Unable to read cart:', error);
        }

        badges.forEach(badge => {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        });
    }

    // ============================================
    // CHEF'S SPECIAL - The featured dish
    // ============================================

    setupChefSpecial() {
        const specialContainer = document.getElementById('chefSpecial');
        if (!specialContainer) return;

        // Find a chef's special item
        const specialItem = this.items.find(item => item.badge === 'chef-recommend');
        if (!specialItem) return;

        specialContainer.innerHTML = `
            <div class="chef-special-item" style="display:flex;gap:20px;align-items:center;padding:20px;background:rgba(255,255,255,0.05);border-radius:12px;margin-bottom:20px;flex-wrap:wrap;">
                <div style="flex:1;min-width:200px;">
                    <h3 style="font-size:1.3rem;margin-bottom:5px;color:#ffd93d;">${specialItem.name}</h3>
                    <p style="opacity:0.8;font-size:0.95rem;margin-bottom:8px;">${specialItem.description}</p>
                    <div style="display:flex;gap:15px;flex-wrap:wrap;align-items:center;">
                        <span style="font-size:1.2rem;font-weight:700;color:#ffd93d;">$${specialItem.price.toFixed(2)}</span>
                        <button onclick="menu.addToCart('${specialItem.id}')" class="btn btn-primary" style="padding:8px 20px;font-size:0.9rem;">
                            <i class="fas fa-plus"></i> Add to Order
                        </button>
                    </div>
                </div>
                <div style="font-style:italic;opacity:0.7;font-size:0.95rem;border-left:2px solid #ffd93d;padding-left:20px;">
                    "${specialItem.chefNote || 'Made with love!'}"
                </div>
            </div>
        `;
    }

    // ============================================
    // BADGE LABELS - Friendly badges
    // ============================================

    getBadgeLabel(badge) {
        const labels = {
            'chef-recommend': '👨‍🍳 Chef\'s Pick',
            'bestseller': '⭐ Bestseller',
            'vegetarian': '🌱 Vegetarian',
            'spicy': '🔥 Spicy',
            'gluten-free': '🌾 Gluten-Free',
            'premium': '💎 Premium'
        };
        return labels[badge] || badge;
    }

    // ============================================
    // NOTIFICATIONS - Friendly feedback
    // ============================================

    showNotification(message, type = 'info') {
        // Check if mainApp has notification system
        if (window.mainApp) {
            window.mainApp.showNotification(message, type);
            return;
        }

        // Fallback notification system
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

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        });

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
    // EVENT LISTENERS - Interactive magic
    // ============================================

    setupEventListeners() {
        // Category filter buttons
        const categoryButtons = document.querySelectorAll('.category-btn');
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                if (category) {
                    this.filterByCategory(category);
                }
            });
        });

        // View toggle buttons
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                if (view) {
                    this.toggleView(view);
                }
            });
        });

        // Search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', () => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.search(query);
                    } else {
                        this.clearFilters();
                    }
                }, 300);
            });

            // Handle Enter key
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        this.search(query);
                    }
                }
            });
        }

        // Listen for cart updates
        document.addEventListener('cartUpdated', () => {
            this.updateCartBadge();
        });

        // Listen for storage changes (cart from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'foodieCart') {
                this.updateCartBadge();
            }
        });

        console.log('🎯 Menu event listeners initialized');
    }
}

// ============================================
// GLOBAL FUNCTIONS - For use in HTML
// ============================================

/**
 * Get a query parameter from the URL
 * @param {string} param - The parameter name
 * @returns {string|null} The parameter value
 */
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ============================================
// INITIALIZATION - Let's get started!
// ============================================

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Create the menu instance
    if (typeof window.menu === 'undefined') {
        window.menu = new Menu();
        console.log('📖 Menu initialized successfully!');
    }
});

// Make menu available globally
window.Menu = Menu;

// ============================================
// EXPORT (for module bundlers if needed)
// ============================================

// If using ES modules
// export default Menu;
// export { Menu, getQueryParam };

console.log('📖 Menu.js loaded successfully!');
console.log('🍽️ Time to explore our delicious menu!');
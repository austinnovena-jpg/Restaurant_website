/**
 * ============================================
 * CART.JS - Shopping Cart Functionality
 * Foodie's Delight - Restaurant Food Order Website
 * ============================================
 * 
 * This file handles all cart operations including:
 * - Adding/removing items
 * - Updating quantities
 * - Calculating totals
 * - Applying promo codes
 * - Local storage persistence
 * - UI updates
 * ============================================
 */

// ============================================
// CART CLASS - The heart of our shopping experience
// ============================================

class Cart {
    constructor() {
        this.items = [];
        this.promoCode = null;
        this.discount = 0;
        this.deliveryFee = 5.00;
        this.freeDeliveryThreshold = 25.00;
        this.loadFromStorage();
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        this.updateUI();
        this.setupEventListeners();
        this.updateCartCount();

        // Log a friendly welcome message
        console.log('🍽️ Welcome to Foodie\'s Delight Cart!');
        console.log(`🛒 You have ${this.getTotalItems()} items in your cart`);
    }

    // ============================================
    // LOCAL STORAGE - Save your cart for later
    // ============================================

    saveToStorage() {
        try {
            const cartData = {
                items: this.items,
                promoCode: this.promoCode,
                discount: this.discount
            };
            localStorage.setItem('foodieCart', JSON.stringify(cartData));
        } catch (error) {
            console.warn('Unable to save cart to localStorage:', error);
        }
    }

    loadFromStorage() {
        try {
            const saved = localStorage.getItem('foodieCart');
            if (saved) {
                const cartData = JSON.parse(saved);
                this.items = cartData.items || [];
                this.promoCode = cartData.promoCode || null;
                this.discount = cartData.discount || 0;
            }
        } catch (error) {
            console.warn('Unable to load cart from localStorage:', error);
            this.items = [];
        }
    }

    // ============================================
    // CART OPERATIONS - Add, Remove, Update
    // ============================================

    /**
     * Add an item to the cart
     * @param {Object} item - The item to add
     * @param {number} quantity - Quantity to add
     * @returns {Object} The updated cart
     */
    addItem(item, quantity = 1) {
        if (!item || !item.id) {
            console.warn('Invalid item provided to addItem');
            return this;
        }

        // Check if item already exists in cart
        const existingItem = this.items.find(i => i.id === item.id);

        if (existingItem) {
            // Update quantity of existing item
            existingItem.quantity += quantity;

            // Show a friendly notification
            this.showNotification(
                `✨ Added another ${item.name} to your cart!`,
                'success'
            );
        } else {
            // Add new item with default properties
            this.items.push({
                id: item.id,
                name: item.name || 'Unknown Item',
                price: item.price || 0,
                quantity: quantity,
                image: item.image || 'assets/images/default-food.jpg',
                variant: item.variant || 'Classic',
                badge: item.badge || null,
                maxQuantity: item.maxQuantity || 10
            });

            // Show a friendly notification
            this.showNotification(
                `🎉 ${item.name} added to your cart!`,
                'success'
            );
        }

        this.saveToStorage();
        this.updateUI();
        this.updateCartCount();
        this.updateFrequentlyBought();

        return this;
    }

    /**
     * Remove an item from the cart
     * @param {number|string} itemId - The ID of the item to remove
     * @returns {Object} The updated cart
     */
    removeItem(itemId) {
        const itemIndex = this.items.findIndex(i => i.id === itemId);

        if (itemIndex === -1) {
            console.warn(`Item with ID ${itemId} not found in cart`);
            return this;
        }

        const removedItem = this.items[itemIndex];

        // Remove the item
        this.items.splice(itemIndex, 1);

        // Show a friendly notification
        this.showNotification(
            `🗑️ Removed ${removedItem.name} from your cart`,
            'info'
        );

        this.saveToStorage();
        this.updateUI();
        this.updateCartCount();
        this.updateFrequentlyBought();

        // If cart is empty, show empty state
        if (this.items.length === 0) {
            this.showEmptyCartMessage();
        }

        return this;
    }

    /**
     * Update the quantity of an item
     * @param {number|string} itemId - The ID of the item
     * @param {number} quantity - New quantity
     * @returns {Object} The updated cart
     */
    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);

        if (!item) {
            console.warn(`Item with ID ${itemId} not found in cart`);
            return this;
        }

        // Validate quantity
        if (quantity < 1) {
            this.removeItem(itemId);
            return this;
        }

        if (quantity > (item.maxQuantity || 10)) {
            this.showNotification(
                `😅 We can only add up to ${item.maxQuantity || 10} of this item`,
                'warning'
            );
            return this;
        }

        // Update quantity
        const oldQuantity = item.quantity;
        item.quantity = quantity;

        // Show notification for significant changes
        if (quantity > oldQuantity) {
            this.showNotification(
                `👍 Added more ${item.name} to your cart!`,
                'success'
            );
        } else if (quantity < oldQuantity) {
            this.showNotification(
                `👌 Reduced quantity of ${item.name}`,
                'info'
            );
        }

        this.saveToStorage();
        this.updateUI();
        this.updateCartCount();

        return this;
    }

    /**
     * Clear all items from the cart
     * @returns {Object} The updated cart
     */
    clearCart() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is already empty!', 'info');
            return this;
        }

        // Ask for confirmation
        if (confirm('🤔 Are you sure you want to clear your cart?')) {
            this.items = [];
            this.promoCode = null;
            this.discount = 0;

            this.saveToStorage();
            this.updateUI();
            this.updateCartCount();
            this.showEmptyCartMessage();

            this.showNotification('🧹 Cart cleared successfully!', 'info');
        }

        return this;
    }

    // ============================================
    // PROMO CODE SYSTEM - Save money, spread joy
    // ============================================

    /**
     * Apply a promo code
     * @param {string} code - The promo code to apply
     * @returns {Object} Result of the operation
     */
    applyPromoCode(code) {
        if (!code || code.trim() === '') {
            return {
                success: false,
                message: 'Please enter a promo code'
            };
        }

        // Normalize the code
        const normalizedCode = code.trim().toUpperCase();

        // Check if already applied
        if (this.promoCode === normalizedCode) {
            return {
                success: false,
                message: 'This promo code is already applied!'
            };
        }

        // List of valid promo codes
        const validPromos = {
            'WELCOME10': { discount: 0.10, message: '🎉 10% off your first order!' },
            'FAMILY20': { discount: 0.20, message: '👨‍👩‍👧‍👦 20% off for families!' },
            'FREEDELIVERY': { discount: 0, message: '🚚 Free delivery!', freeDelivery: true },
            'FOODIE15': { discount: 0.15, message: '✨ 15% off - You deserve it!' },
            'THANKYOU5': { discount: 0.05, message: '❤️ 5% off - Thank you for being awesome!' },
            'SUMMER25': { discount: 0.25, message: '☀️ 25% off summer special!' }
        };

        // Check if promo code is valid
        const promo = validPromos[normalizedCode];

        if (!promo) {
            return {
                success: false,
                message: '❌ Invalid promo code. Please try again.'
            };
        }

        // Apply the promo code
        this.promoCode = normalizedCode;

        // Calculate discount
        const subtotal = this.getSubtotal();

        if (promo.freeDelivery) {
            this.deliveryFee = 0;
            this.discount = 0;
        } else {
            this.discount = subtotal * promo.discount;
            this.deliveryFee = this.getDeliveryFee();
        }

        this.saveToStorage();
        this.updateUI();

        return {
            success: true,
            message: promo.message,
            discount: this.discount
        };
    }

    /**
     * Remove the applied promo code
     * @returns {Object} Result of the operation
     */
    removePromoCode() {
        if (!this.promoCode) {
            return {
                success: false,
                message: 'No promo code applied'
            };
        }

        this.promoCode = null;
        this.discount = 0;
        this.deliveryFee = 5.00;

        this.saveToStorage();
        this.updateUI();

        this.showNotification('Promo code removed', 'info');

        return {
            success: true,
            message: 'Promo code removed successfully'
        };
    }

    // ============================================
    // CALCULATIONS - The numbers that matter
    // ============================================

    /**
     * Get the subtotal of all items
     * @returns {number} The subtotal
     */
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    /**
     * Get the total number of items in the cart
     * @returns {number} Total item count
     */
    getTotalItems() {
        return this.items.reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    }

    /**
     * Get the delivery fee
     * @returns {number} The delivery fee
     */
    getDeliveryFee() {
        const subtotal = this.getSubtotal();
        // Free delivery if subtotal exceeds threshold or promo applied
        if (subtotal >= this.freeDeliveryThreshold || this.promoCode === 'FREEDELIVERY') {
            return 0;
        }
        return this.deliveryFee;
    }

    /**
     * Get the total amount including delivery and discount
     * @returns {number} The total
     */
    getTotal() {
        const subtotal = this.getSubtotal();
        const delivery = this.getDeliveryFee();
        return Math.max(0, subtotal - this.discount + delivery);
    }

    /**
     * Get the savings from discounts
     * @returns {number} The savings amount
     */
    getSavings() {
        return this.discount;
    }

    /**
     * Check if the cart qualifies for free delivery
     * @returns {boolean} True if free delivery applies
     */
    qualifiesForFreeDelivery() {
        return this.getSubtotal() >= this.freeDeliveryThreshold ||
            this.promoCode === 'FREEDELIVERY';
    }

    /**
     * Get the amount needed for free delivery
     * @returns {number} The amount needed
     */
    getAmountForFreeDelivery() {
        const subtotal = this.getSubtotal();
        if (subtotal >= this.freeDeliveryThreshold) {
            return 0;
        }
        return Math.round((this.freeDeliveryThreshold - subtotal) * 100) / 100;
    }

    // ============================================
    // UI UPDATES - Making the cart come alive
    // ============================================

    /**
     * Update all UI elements
     */
    updateUI() {
        this.updateCartItems();
        this.updateSummary();
        this.updateTotals();
        this.updateCheckoutButton();
        this.updateCartCount();
        this.updateFreeDeliveryMessage();
        this.updatePromoCodeDisplay();
    }

    /**
     * Update the cart items display
     */
    updateCartItems() {
        const cartContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');

        if (!cartContainer) return;

        if (this.items.length === 0) {
            this.showEmptyCartMessage();
            return;
        }

        // Hide empty cart message
        if (emptyCart) {
            emptyCart.style.display = 'none';
        }

        // Build the cart items HTML
        let html = '';
        this.items.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            const badgeHtml = item.badge ?
                `<span class="cart-item-badge ${item.badge}">${item.badge}</span>` : '';

            html += `
                <div class="cart-item" data-item-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-header">
                            <div>
                                <span class="cart-item-name">${item.name}</span>
                                ${badgeHtml}
                                <div class="cart-item-variant">${item.variant}</div>
                            </div>
                            <button class="cart-item-remove" onclick="cart.removeItem('${item.id}')" aria-label="Remove item">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="cart-item-footer">
                            <div class="cart-item-price">
                                $${itemTotal}
                                <span class="price-unit">/ ${item.quantity} ${item.quantity === 1 ? 'item' : 'items'}</span>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" onclick="cart.decreaseQuantity('${item.id}')" aria-label="Decrease quantity">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="quantity-display">${item.quantity}</span>
                                <button class="quantity-btn increase" onclick="cart.increaseQuantity('${item.id}')" aria-label="Increase quantity">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        cartContainer.innerHTML = html;
    }

    /**
     * Update the cart summary
     */
    updateSummary() {
        const itemCount = document.getElementById('summaryItemCount');
        const summaryList = document.getElementById('summaryItemsList');
        const countDisplay = document.getElementById('cartItemCount');

        if (itemCount) {
            itemCount.textContent = this.getTotalItems();
        }

        if (countDisplay) {
            countDisplay.textContent = this.getTotalItems();
        }

        // Update mini items list in summary
        if (summaryList) {
            if (this.items.length === 0) {
                summaryList.innerHTML = '<div style="text-align:center;color:#636e72;padding:10px 0;">Your cart is empty</div>';
                return;
            }

            let html = '';
            this.items.forEach(item => {
                html += `
                    <div class="summary-mini-item">
                        <span class="mini-name">
                            <span class="qty">${item.quantity}×</span>
                            ${item.name}
                        </span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });
            summaryList.innerHTML = html;
        }
    }

    /**
     * Update all totals
     */
    updateTotals() {
        const subtotal = this.getSubtotal();
        const delivery = this.getDeliveryFee();
        const discount = this.getSavings();
        const total = this.getTotal();

        // Update subtotal
        const subtotalElement = document.getElementById('subtotal');
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }

        // Update delivery fee
        const deliveryElement = document.getElementById('deliveryFee');
        if (deliveryElement) {
            if (delivery === 0) {
                deliveryElement.textContent = 'Free';
                deliveryElement.style.color = '#56ab2f';
            } else {
                deliveryElement.textContent = `$${delivery.toFixed(2)}`;
                deliveryElement.style.color = '';
            }
        }

        // Update discount
        const discountRow = document.getElementById('discountRow');
        const discountElement = document.getElementById('discountAmount');
        if (discountRow && discountElement) {
            if (discount > 0) {
                discountRow.style.display = 'flex';
                discountElement.textContent = `-$${discount.toFixed(2)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }

        // Update total
        const totalElement = document.getElementById('totalAmount');
        const finalPriceElement = document.querySelector('.final-price');
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
        if (finalPriceElement) {
            finalPriceElement.textContent = `$${total.toFixed(2)}`;
        }
    }

    /**
     * Update the checkout button state
     */
    updateCheckoutButton() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (!checkoutBtn) return;

        const hasItems = this.items.length > 0;
        checkoutBtn.disabled = !hasItems;

        if (hasItems) {
            checkoutBtn.innerHTML = `
                <i class="fas fa-lock"></i> 
                Proceed to Checkout
                <span class="btn-arrow"><i class="fas fa-arrow-right"></i></span>
            `;
        } else {
            checkoutBtn.innerHTML = `
                <i class="fas fa-lock"></i> 
                Add Items to Checkout
            `;
        }
    }

    /**
     * Update the cart count badge
     */
    updateCartCount() {
        const badges = document.querySelectorAll('.cart-badge');
        const count = this.getTotalItems();

        badges.forEach(badge => {
            badge.textContent = count;
            if (count === 0) {
                badge.style.display = 'none';
            } else {
                badge.style.display = 'inline';
            }
        });
    }

    /**
     * Update the free delivery message
     */
    updateFreeDeliveryMessage() {
        const messageElement = document.querySelector('.cart-savings');
        if (!messageElement) return;

        if (this.items.length === 0) {
            messageElement.innerHTML = `
                <i class="fas fa-gift"></i>
                <span>Add items to get free delivery!</span>
            `;
            return;
        }

        const amountNeeded = this.getAmountForFreeDelivery();
        const qualifies = this.qualifiesForFreeDelivery();

        if (qualifies) {
            messageElement.innerHTML = `
                <i class="fas fa-gift"></i>
                <span>🎉 You qualify for <strong>FREE DELIVERY</strong>!</span>
            `;
            messageElement.style.color = '#56ab2f';
        } else {
            messageElement.innerHTML = `
                <i class="fas fa-gift"></i>
                <span>Add <strong>$${amountNeeded.toFixed(2)}</strong> more for free delivery!</span>
            `;
            messageElement.style.color = '';
        }
    }

    /**
     * Update promo code display
     */
    updatePromoCodeDisplay() {
        const promoInput = document.querySelector('.promo-input input');
        const applyBtn = document.querySelector('.btn-promo, .btn-promo-small');
        const promoMessage = document.querySelector('.promo-message');

        if (!promoInput) return;

        if (this.promoCode) {
            promoInput.value = this.promoCode;
            promoInput.disabled = true;
            if (applyBtn) {
                applyBtn.textContent = 'Applied ✓';
                applyBtn.style.background = '#56ab2f';
            }
            if (promoMessage) {
                promoMessage.textContent = `✅ Promo code "${this.promoCode}" applied!`;
                promoMessage.className = 'promo-message success';
            }
        } else {
            promoInput.value = '';
            promoInput.disabled = false;
            if (applyBtn) {
                applyBtn.textContent = 'Apply';
                applyBtn.style.background = '';
            }
            if (promoMessage) {
                promoMessage.textContent = '';
                promoMessage.className = 'promo-message';
            }
        }
    }

    /**
     * Show empty cart message
     */
    showEmptyCartMessage() {
        const cartContainer = document.getElementById('cartItems');
        const emptyCart = document.getElementById('emptyCart');

        if (!cartContainer) return;

        if (emptyCart) {
            emptyCart.style.display = 'block';
            cartContainer.innerHTML = '';
            if (emptyCart) {
                // The empty cart HTML is already in the page
            }
        }
    }

    // ============================================
    // QUANTITY CONTROLS - Easy adjustments
    // ============================================

    /**
     * Increase the quantity of an item
     * @param {number|string} itemId - The ID of the item
     */
    increaseQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            const newQuantity = item.quantity + 1;
            this.updateQuantity(itemId, newQuantity);

            // Animate the quantity display
            const display = document.querySelector(`[data-item-id="${itemId}"] .quantity-display`);
            if (display) {
                display.classList.add('pop');
                setTimeout(() => display.classList.remove('pop'), 200);
            }
        }
    }

    /**
     * Decrease the quantity of an item
     * @param {number|string} itemId - The ID of the item
     */
    decreaseQuantity(itemId) {
        const item = this.items.find(i => i.id === itemId);
        if (item && item.quantity > 1) {
            const newQuantity = item.quantity - 1;
            this.updateQuantity(itemId, newQuantity);

            // Animate the quantity display
            const display = document.querySelector(`[data-item-id="${itemId}"] .quantity-display`);
            if (display) {
                display.classList.add('pop');
                setTimeout(() => display.classList.remove('pop'), 200);
            }
        } else if (item && item.quantity === 1) {
            this.removeItem(itemId);
        }
    }

    // ============================================
    // FREQUENTLY BOUGHT TOGETHER - Recommendations
    // ============================================

    /**
     * Update the frequently bought together section
     */
    updateFrequentlyBought() {
        const grid = document.getElementById('frequentlyGrid');
        if (!grid) return;

        // Sample frequently bought items (in a real app, this would come from analytics)
        const recommendations = [
            {
                id: 'rec1',
                name: 'Garlic Bread',
                price: 6.99,
                image: 'assets/images/garlic-bread.jpg',
                description: 'Perfect with pasta'
            },
            {
                id: 'rec2',
                name: 'Side Salad',
                price: 5.99,
                image: 'assets/images/side-salad.jpg',
                description: 'Fresh and healthy'
            },
            {
                id: 'rec3',
                name: 'Tiramisu',
                price: 7.99,
                image: 'assets/images/tiramisu.jpg',
                description: 'Classic Italian dessert'
            },
            {
                id: 'rec4',
                name: 'Mineral Water',
                price: 2.99,
                image: 'assets/images/water.jpg',
                description: 'Still or sparkling'
            }
        ];

        // Show recommendations only if cart has items
        if (this.items.length === 0) {
            grid.innerHTML = `
                <div style="text-align:center;color:#636e72;grid-column:1/-1;padding:40px 0;">
                    <i class="fas fa-shopping-bag" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
                    <p>Add items to see recommendations</p>
                </div>
            `;
            return;
        }

        // Show recommendations
        let html = '';
        recommendations.forEach(item => {
            html += `
                <div class="frequent-item">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    <h4>${item.name}</h4>
                    <p>${item.description}</p>
                    <div class="price">$${item.price.toFixed(2)}</div>
                    <button class="btn-add" onclick="addRecommendedItem('${item.id}')">
                        <i class="fas fa-plus"></i> Add
                    </button>
                </div>
            `;
        });

        grid.innerHTML = html;
    }

    // ============================================
    // NOTIFICATIONS - Friendly feedback
    // ============================================

    /**
     * Show a notification to the user
     * @param {string} message - The message to show
     * @param {string} type - The type of notification (success, error, info, warning)
     */
    showNotification(message, type = 'info') {
        // Check if there's a notification container
        let container = document.getElementById('notificationContainer');

        if (!container) {
            // Create the container if it doesn't exist
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
            border-left: 4px solid #667eea;
        `;

        // Set colors based on type
        let icon = 'ℹ️';
        let borderColor = '#667eea';
        let bgColor = 'white';

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

        notification.style.borderLeftColor = borderColor;

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
    // EVENT LISTENERS - Interactive magic
    // ============================================

    setupEventListeners() {
        // Clear cart button
        const clearBtn = document.getElementById('clearCart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearCart();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                if (this.items.length > 0) {
                    window.location.href = 'checkout.html';
                } else {
                    this.showNotification('Your cart is empty! Add some delicious items first.', 'warning');
                }
            });
        }

        // Promo code - Summary
        const promoBtn = document.getElementById('summaryApplyPromo');
        const promoInput = document.getElementById('summaryPromoCode');
        if (promoBtn && promoInput) {
            promoBtn.addEventListener('click', () => {
                this.handlePromoCode(promoInput.value);
            });
            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handlePromoCode(promoInput.value);
                }
            });
        }

        // Promo code - Main (if exists)
        const mainPromoBtn = document.getElementById('applyPromo');
        const mainPromoInput = document.getElementById('promoCode');
        if (mainPromoBtn && mainPromoInput) {
            mainPromoBtn.addEventListener('click', () => {
                this.handlePromoCode(mainPromoInput.value);
            });
            mainPromoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handlePromoCode(mainPromoInput.value);
                }
            });
        }

        // Listen for cart updates from other pages
        window.addEventListener('storage', (e) => {
            if (e.key === 'foodieCart') {
                this.loadFromStorage();
                this.updateUI();
                this.updateCartCount();
            }
        });

        // Handle page visibility change to refresh cart
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.loadFromStorage();
                this.updateUI();
                this.updateCartCount();
            }
        });

        console.log('🎯 Cart event listeners initialized');
    }

    // ============================================
    // HELPER METHODS - Behind the scenes
    // ============================================

    /**
     * Handle promo code application
     * @param {string} code - The promo code
     */
    handlePromoCode(code) {
        const result = this.applyPromoCode(code);

        // Show the result message
        const messageElement = document.querySelector('.promo-message');
        if (messageElement) {
            messageElement.textContent = result.message;
            messageElement.className = 'promo-message ' + (result.success ? 'success' : 'error');
        }

        // Clear the input if it was invalid
        if (!result.success) {
            const input = document.querySelector('.promo-input input, #summaryPromoCode');
            if (input) {
                input.value = '';
                input.focus();
            }
        } else {
            // Update UI for applied promo
            this.updatePromoCodeDisplay();
            this.showNotification(result.message, 'success');
        }
    }

    /**
     * Get the cart data for checkout
     * @returns {Object} Cart data
     */
    getCheckoutData() {
        return {
            items: this.items,
            subtotal: this.getSubtotal(),
            deliveryFee: this.getDeliveryFee(),
            discount: this.getSavings(),
            total: this.getTotal(),
            promoCode: this.promoCode,
            itemCount: this.getTotalItems()
        };
    }

    /**
     * Validate the cart before checkout
     * @returns {Object} Validation result
     */
    validateCart() {
        if (this.items.length === 0) {
            return {
                valid: false,
                message: 'Your cart is empty. Add some items to order!'
            };
        }

        // Check for any invalid items
        const invalidItems = this.items.filter(item => !item.id || !item.name || item.price < 0);
        if (invalidItems.length > 0) {
            return {
                valid: false,
                message: 'Some items in your cart are invalid. Please remove them and try again.'
            };
        }

        return {
            valid: true,
            message: 'Cart is ready for checkout!'
        };
    }
}

// ============================================
// GLOBAL FUNCTIONS - For use in HTML
// ============================================

/**
 * Add a recommended item to the cart
 * @param {string} itemId - The ID of the item to add
 */
function addRecommendedItem(itemId) {
    // This would typically fetch the item from a data source
    // For demo purposes, we'll use a sample item
    const sampleItems = {
        'rec1': { id: 'rec1', name: 'Garlic Bread', price: 6.99, image: 'assets/images/garlic-bread.jpg', variant: 'Classic' },
        'rec2': { id: 'rec2', name: 'Side Salad', price: 5.99, image: 'assets/images/side-salad.jpg', variant: 'Fresh' },
        'rec3': { id: 'rec3', name: 'Tiramisu', price: 7.99, image: 'assets/images/tiramisu.jpg', variant: 'Classic' },
        'rec4': { id: 'rec4', name: 'Mineral Water', price: 2.99, image: 'assets/images/water.jpg', variant: 'Still' }
    };

    const item = sampleItems[itemId];
    if (item && typeof cart !== 'undefined') {
        cart.addItem(item, 1);
    }
}

// ============================================
// INITIALIZATION - Let's get started!
// ============================================

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Create the cart instance
    if (typeof window.cart === 'undefined') {
        window.cart = new Cart();
        console.log('🛒 Cart initialized successfully!');
        console.log(`📦 ${window.cart.items.length} items in cart`);
    }
});

// Make cart available globally
window.Cart = Cart;

// ============================================
// EXPORT (for module bundlers if needed)
// ============================================

// If using ES modules
// export default Cart;
// export { Cart, addRecommendedItem };

console.log('📦 Cart.js loaded successfully!');
console.log('🍽️ Happy ordering from Foodie\'s Delight!');
/**
 * ============================================
 * CHECKOUT.JS - Checkout Process Functionality
 * Foodie's Delight - Restaurant Food Order Website
 * ============================================
 * 
 * This file handles all checkout operations including:
 * - Form validation
 * - Payment processing
 * - Order placement
 * - Success confirmation
 * - Error handling
 * ============================================
 */

// ============================================
// CHECKOUT CLASS - The final step to deliciousness
// ============================================

class Checkout {
    constructor() {
        this.cart = window.cart || null;
        this.orderData = null;
        this.isProcessing = false;
        this.form = document.getElementById('checkoutForm');
        this.init();
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    init() {
        // Load cart data
        this.loadCartData();

        // Setup event listeners
        this.setupEventListeners();

        // Setup payment method toggles
        this.setupPaymentMethods();

        // Setup delivery options
        this.setupDeliveryOptions();

        // Setup promo code
        this.setupPromoCode();

        // Log a friendly welcome message
        console.log('📝 Checkout initialized!');
        console.log('🍽️ Let\'s get your order ready!');

        // Update order summary
        this.updateOrderSummary();
    }

    // ============================================
    // CART DATA LOADING
    // ============================================

    loadCartData() {
        // If cart is not available globally, try to load from localStorage
        if (!this.cart) {
            try {
                const savedCart = localStorage.getItem('foodieCart');
                if (savedCart) {
                    const cartData = JSON.parse(savedCart);
                    // Create a temporary cart object
                    this.cart = {
                        items: cartData.items || [],
                        getSubtotal: function () {
                            return this.items.reduce((total, item) => {
                                return total + (item.price * item.quantity);
                            }, 0);
                        },
                        getTotalItems: function () {
                            return this.items.reduce((total, item) => {
                                return total + item.quantity;
                            }, 0);
                        },
                        getDeliveryFee: function () {
                            const subtotal = this.getSubtotal();
                            return subtotal >= 25 ? 0 : 5;
                        },
                        getTotal: function () {
                            const subtotal = this.getSubtotal();
                            const delivery = this.getDeliveryFee();
                            return subtotal + delivery;
                        }
                    };
                }
            } catch (error) {
                console.warn('Unable to load cart data:', error);
            }
        }

        // Check if cart has items
        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
            this.showEmptyCartMessage();
            return;
        }

        // Update the order summary
        this.updateOrderSummary();
    }

    // ============================================
    // ORDER SUMMARY UPDATES
    // ============================================

    updateOrderSummary() {
        if (!this.cart || !this.cart.items) return;

        const items = this.cart.items;
        const orderItems = document.getElementById('orderItems');
        const orderCount = document.getElementById('orderCount');

        // Update order count
        if (orderCount) {
            const totalItems = this.cart.getTotalItems();
            orderCount.textContent = `${totalItems} ${totalItems === 1 ? 'item' : 'items'}`;
        }

        // Update order items
        if (orderItems) {
            if (items.length === 0) {
                orderItems.innerHTML = `
                    <div style="text-align:center;padding:20px 0;color:#636e72;">
                        <i class="fas fa-shopping-bag" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
                return;
            }

            let html = '';
            items.forEach(item => {
                const itemTotal = (item.price * item.quantity).toFixed(2);
                html += `
                    <div class="order-item" data-item-id="${item.id}">
                        <div class="item-image">
                            <img src="${item.image || 'assets/images/default-food.jpg'}" alt="${item.name}" loading="lazy">
                        </div>
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p class="item-variant">${item.variant || 'Classic'}</p>
                            <div class="item-meta">
                                <span class="item-quantity">×${item.quantity}</span>
                                <span class="item-price">$${itemTotal}</span>
                            </div>
                        </div>
                        <button class="remove-item" onclick="checkout.removeItem('${item.id}')" aria-label="Remove item">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                `;
            });
            orderItems.innerHTML = html;
        }

        // Update totals
        this.updateTotals();
    }

    updateTotals() {
        const subtotal = this.cart.getSubtotal();
        const delivery = this.cart.getDeliveryFee();
        const total = this.cart.getTotal();
        const discount = this.cart.getSavings ? this.cart.getSavings() : 0;

        // Update subtotal
        const subtotalElement = document.querySelector('.total-row:first-child span:last-child');
        if (subtotalElement) {
            subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        }

        // Update delivery fee
        const deliveryRow = document.querySelector('.total-row:nth-child(2)');
        const deliveryElement = deliveryRow ? deliveryRow.querySelector('span:last-child') : null;
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
        const discountRow = document.querySelector('.total-row.discount-row');
        const discountElement = discountRow ? discountRow.querySelector('.discount-amount') : null;
        if (discountRow && discountElement) {
            if (discount > 0) {
                discountRow.style.display = 'flex';
                discountElement.textContent = `-$${discount.toFixed(2)}`;
            } else {
                discountRow.style.display = 'none';
            }
        }

        // Update total
        const totalElement = document.querySelector('.total-row.total-final .final-price');
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }

    // ============================================
    // REMOVE ITEM FROM CHECKOUT
    // ============================================

    removeItem(itemId) {
        if (!this.cart) return;

        // Find and remove the item
        const itemIndex = this.cart.items.findIndex(i => i.id === itemId);
        if (itemIndex !== -1) {
            this.cart.items.splice(itemIndex, 1);

            // Save to localStorage
            try {
                const cartData = localStorage.getItem('foodieCart');
                if (cartData) {
                    const parsed = JSON.parse(cartData);
                    parsed.items = this.cart.items;
                    localStorage.setItem('foodieCart', JSON.stringify(parsed));
                }
            } catch (error) {
                console.warn('Unable to update cart:', error);
            }

            // Update the UI
            this.updateOrderSummary();

            // If cart is empty, show message
            if (this.cart.items.length === 0) {
                this.showEmptyCartMessage();
            }

            // Show notification
            this.showNotification('🗑️ Item removed from your order', 'info');
        }
    }

    // ============================================
    // EMPTY CART MESSAGE
    // ============================================

    showEmptyCartMessage() {
        const orderItems = document.getElementById('orderItems');
        if (orderItems) {
            orderItems.innerHTML = `
                <div style="text-align:center;padding:40px 20px;color:#636e72;">
                    <i class="fas fa-shopping-bag" style="font-size:3rem;display:block;margin-bottom:15px;color:#d0d0d0;"></i>
                    <h3 style="color:#2d3436;margin-bottom:10px;">Your cart is empty</h3>
                    <p style="margin-bottom:20px;">Looks like you haven't added any items yet.</p>
                    <a href="menu.html" class="btn btn-primary" style="display:inline-flex;align-items:center;gap:8px;">
                        <i class="fas fa-utensils"></i> Browse Menu
                    </a>
                </div>
            `;
        }

        // Disable checkout button
        const submitBtn = document.querySelector('.btn-place-order');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Add Items to Order';
        }
    }

    // ============================================
    // FORM VALIDATION - Making sure everything is perfect
    // ============================================

    validateForm() {
        const form = this.form;
        if (!form) return false;

        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            const errorElement = field.parentElement.querySelector('.form-error');

            if (!field.value.trim()) {
                field.classList.add('error');
                field.classList.remove('success');
                if (errorElement) {
                    errorElement.style.display = 'flex';
                }
                isValid = false;
            } else {
                field.classList.remove('error');
                field.classList.add('success');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }

            // Special validation for email
            if (field.type === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    field.classList.add('error');
                    field.classList.remove('success');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid email address';
                        errorElement.style.display = 'flex';
                    }
                    isValid = false;
                }
            }

            // Special validation for phone
            if (field.type === 'tel' && field.value.trim()) {
                const phoneRegex = /^[\+\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(field.value.trim())) {
                    field.classList.add('error');
                    field.classList.remove('success');
                    if (errorElement) {
                        errorElement.textContent = 'Please enter a valid phone number';
                        errorElement.style.display = 'flex';
                    }
                    isValid = false;
                }
            }
        });

        // Check if terms are accepted
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox && !termsCheckbox.checked) {
            isValid = false;
            const termsLabel = termsCheckbox.closest('.checkbox-label');
            if (termsLabel) {
                termsLabel.style.border = '2px solid #f5576c';
                termsLabel.style.borderRadius = '8px';
                termsLabel.style.padding = '10px';
                termsLabel.style.background = 'rgba(245,87,108,0.05)';
            }
        } else if (termsCheckbox) {
            const termsLabel = termsCheckbox.closest('.checkbox-label');
            if (termsLabel) {
                termsLabel.style.border = 'none';
                termsLabel.style.padding = '0';
                termsLabel.style.background = 'transparent';
            }
        }

        if (!isValid) {
            this.showNotification('⚠️ Please fill in all required fields correctly', 'warning');

            // Scroll to the first error
            const firstError = form.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }

        return isValid;
    }

    // ============================================
    // PAYMENT PROCESSING - Secure and friendly
    // ============================================

    async processPayment(paymentData) {
        // Simulate payment processing
        return new Promise((resolve, reject) => {
            // Show processing state
            this.setProcessingState(true);

            // Simulate API call delay
            setTimeout(() => {
                // 90% success rate for demo
                const isSuccess = Math.random() < 0.9;

                if (isSuccess) {
                    resolve({
                        success: true,
                        transactionId: 'TXN-' + Date.now().toString().slice(-8),
                        message: 'Payment processed successfully!'
                    });
                } else {
                    reject({
                        success: false,
                        message: 'Payment processing failed. Please try again.'
                    });
                }
            }, 2000);
        });
    }

    // ============================================
    // ORDER PLACEMENT - The moment of truth
    // ============================================

    async placeOrder() {
        if (this.isProcessing) return;

        // Validate form first
        if (!this.validateForm()) {
            return;
        }

        // Check if cart has items
        if (!this.cart || !this.cart.items || this.cart.items.length === 0) {
            this.showNotification('Your cart is empty!', 'warning');
            return;
        }

        // Get form data
        const formData = this.getFormData();

        // Prepare order data
        const orderData = {
            ...formData,
            items: this.cart.items,
            subtotal: this.cart.getSubtotal(),
            deliveryFee: this.cart.getDeliveryFee(),
            total: this.cart.getTotal(),
            discount: this.cart.getSavings ? this.cart.getSavings() : 0,
            orderDate: new Date().toISOString(),
            orderNumber: 'FOOD-' + Date.now().toString().slice(-8)
        };

        try {
            // Process payment
            this.showNotification('💳 Processing your payment...', 'info');

            const paymentResult = await this.processPayment({
                method: formData.paymentMethod,
                amount: orderData.total
            });

            if (paymentResult.success) {
                // Order placed successfully
                this.orderData = {
                    ...orderData,
                    transactionId: paymentResult.transactionId,
                    status: 'confirmed'
                };

                // Show success message
                this.showSuccessMessage(this.orderData);

                // Clear cart
                this.clearCart();

                // Log success
                console.log('✅ Order placed successfully!');
                console.log(`📦 Order #${this.orderData.orderNumber}`);
                console.log(`💰 Total: $${this.orderData.total.toFixed(2)}`);
            }
        } catch (error) {
            // Handle payment failure
            this.showNotification(`❌ ${error.message}`, 'error');
            this.setProcessingState(false);

            console.error('Payment failed:', error);
        }
    }

    // ============================================
    // FORM DATA COLLECTION
    // ============================================

    getFormData() {
        const form = this.form;
        if (!form) return null;

        const formData = new FormData(form);
        const data = {
            fullName: formData.get('fullName') || '',
            phone: formData.get('phone') || '',
            email: formData.get('email') || '',
            address: formData.get('address') || '',
            city: formData.get('city') || '',
            zipCode: formData.get('zipCode') || '',
            deliveryInstructions: formData.get('deliveryInstructions') || '',
            deliveryType: formData.get('deliveryType') || 'delivery',
            paymentMethod: formData.get('paymentMethod') || 'card',
            orderNotes: document.getElementById('orderNotes') ? document.getElementById('orderNotes').value : '',
            terms: formData.get('terms') === 'on'
        };

        // Payment details
        if (data.paymentMethod === 'card') {
            data.cardNumber = document.getElementById('cardNumber') ? document.getElementById('cardNumber').value : '';
            data.expiryDate = document.getElementById('expiryDate') ? document.getElementById('expiryDate').value : '';
            data.cvv = document.getElementById('cvv') ? document.getElementById('cvv').value : '';
        }

        return data;
    }

    // ============================================
    // UI STATE MANAGEMENT
    // ============================================

    setProcessingState(isProcessing) {
        this.isProcessing = isProcessing;
        const submitBtn = document.querySelector('.btn-place-order');
        if (!submitBtn) return;

        if (isProcessing) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i> 
                Processing Your Order...
            `;
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <i class="fas fa-check-circle"></i> 
                Place Order
                <span class="btn-loader" style="display: none;">
                    <i class="fas fa-spinner fa-spin"></i> Processing...
                </span>
            `;
        }
    }

    showSuccessMessage(orderData) {
        const form = this.form;
        if (!form) return;

        // Hide the form
        const formSections = form.querySelectorAll('.form-section');
        formSections.forEach(section => {
            section.style.display = 'none';
        });

        // Hide the submit button
        const submitBtn = form.querySelector('.btn-place-order');
        if (submitBtn) {
            submitBtn.style.display = 'none';
        }

        // Hide the terms checkbox
        const termsGroup = form.querySelector('.checkbox-label');
        if (termsGroup) {
            termsGroup.style.display = 'none';
        }

        // Show success message
        const successDiv = form.querySelector('.form-success');
        if (successDiv) {
            successDiv.style.display = 'block';

            // Update order number
            const orderNumberSpan = successDiv.querySelector('#orderNumber');
            if (orderNumberSpan) {
                orderNumberSpan.textContent = orderData.orderNumber;
            }

            // Update the success message with items
            const itemsList = successDiv.querySelector('.order-items-summary');
            if (itemsList && orderData.items) {
                let itemsHtml = '';
                orderData.items.forEach(item => {
                    itemsHtml += `
                        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.9rem;">
                            <span>${item.quantity}× ${item.name}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `;
                });
                itemsList.innerHTML = itemsHtml;
            }

            // Update total
            const totalSpan = successDiv.querySelector('.order-total-amount');
            if (totalSpan) {
                totalSpan.textContent = `$${orderData.total.toFixed(2)}`;
            }

            // Scroll to success message
            successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Show notification
        this.showNotification('🎉 Order placed successfully! Thank you for choosing us!', 'success');
    }

    // ============================================
    // CLEAR CART AFTER SUCCESSFUL ORDER
    // ============================================

    clearCart() {
        // Clear the cart from localStorage
        try {
            localStorage.removeItem('foodieCart');

            // Update the global cart if it exists
            if (window.cart) {
                window.cart.items = [];
                window.cart.saveToStorage();
                window.cart.updateUI();
                window.cart.updateCartCount();
            }
        } catch (error) {
            console.warn('Unable to clear cart:', error);
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
    // EVENT LISTENERS - Interactive magic
    // ============================================

    setupEventListeners() {
        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.placeOrder();
            });
        }

        // Input validation on blur
        const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.required && input.value.trim()) {
                    input.classList.remove('error');
                    input.classList.add('success');
                    const errorElement = input.parentElement.querySelector('.form-error');
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                }
            });

            input.addEventListener('focus', () => {
                input.classList.remove('error');
                const errorElement = input.parentElement.querySelector('.form-error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            });
        });

        // Real-time validation for email and phone
        const emailInput = document.getElementById('email');
        if (emailInput) {
            emailInput.addEventListener('input', () => {
                if (emailInput.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(emailInput.value.trim())) {
                        emailInput.classList.remove('error');
                        emailInput.classList.add('success');
                    }
                }
            });
        }

        const phoneInput = document.getElementById('phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                if (phoneInput.value.trim()) {
                    const phoneRegex = /^[\+\d\s\-\(\)]{10,}$/;
                    if (phoneRegex.test(phoneInput.value.trim())) {
                        phoneInput.classList.remove('error');
                        phoneInput.classList.add('success');
                    }
                }
            });
        }

        // Terms checkbox validation clear
        const termsCheckbox = document.getElementById('terms');
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', () => {
                const termsLabel = termsCheckbox.closest('.checkbox-label');
                if (termsLabel) {
                    if (termsCheckbox.checked) {
                        termsLabel.style.border = 'none';
                        termsLabel.style.padding = '0';
                        termsLabel.style.background = 'transparent';
                    }
                }
            });
        }

        // Order notes character counter
        const notesTextarea = document.getElementById('orderNotes');
        if (notesTextarea) {
            notesTextarea.addEventListener('input', () => {
                const count = notesTextarea.value.length;
                const maxLength = 500;
                if (count > maxLength) {
                    notesTextarea.value = notesTextarea.value.slice(0, maxLength);
                }
            });
        }

        console.log('🎯 Checkout event listeners initialized');
    }

    // ============================================
    // PAYMENT METHOD TOGGLES
    // ============================================

    setupPaymentMethods() {
        const paymentOptions = document.querySelectorAll('.payment-option input[type="radio"]');
        const cardDetails = document.getElementById('cardDetails');

        paymentOptions.forEach(option => {
            option.addEventListener('change', () => {
                // Update active state
                const parent = option.closest('.payment-option');
                const siblings = parent.closest('.payment-options').querySelectorAll('.payment-option');
                siblings.forEach(sib => sib.classList.remove('active'));
                parent.classList.add('active');

                // Show/hide card details
                if (cardDetails) {
                    if (option.value === 'card') {
                        cardDetails.style.display = 'block';
                    } else {
                        cardDetails.style.display = 'none';
                    }
                }

                // Update payment method display
                this.updatePaymentMethodDisplay(option.value);
            });
        });
    }

    updatePaymentMethodDisplay(method) {
        const methodLabels = {
            'card': 'Credit/Debit Card',
            'paypal': 'PayPal',
            'cash': 'Cash on Delivery'
        };

        const display = document.querySelector('.payment-method-display');
        if (display && methodLabels[method]) {
            display.textContent = methodLabels[method];
        }
    }

    // ============================================
    // DELIVERY OPTIONS TOGGLES
    // ============================================

    setupDeliveryOptions() {
        const deliveryOptions = document.querySelectorAll('.delivery-option input[type="radio"]');
        const addressSection = document.getElementById('addressSection');

        deliveryOptions.forEach(option => {
            option.addEventListener('change', () => {
                // Update active state
                const parent = option.closest('.delivery-option');
                const siblings = parent.closest('.delivery-options').querySelectorAll('.delivery-option');
                siblings.forEach(sib => sib.classList.remove('active'));
                parent.classList.add('active');

                // Show/hide address section
                if (addressSection) {
                    if (option.value === 'delivery') {
                        addressSection.style.display = 'block';
                        // Make address fields required
                        const addressFields = addressSection.querySelectorAll('[required]');
                        addressFields.forEach(field => field.required = true);
                    } else {
                        addressSection.style.display = 'none';
                        // Make address fields not required
                        const addressFields = addressSection.querySelectorAll('[required]');
                        addressFields.forEach(field => field.required = false);
                    }
                }

                // Update delivery type display
                this.updateDeliveryTypeDisplay(option.value);
            });
        });
    }

    updateDeliveryTypeDisplay(type) {
        const typeLabels = {
            'delivery': 'Delivery to your door',
            'pickup': 'Pick up at restaurant'
        };

        const display = document.querySelector('.delivery-type-display');
        if (display && typeLabels[type]) {
            display.textContent = typeLabels[type];
        }
    }

    // ============================================
    // PROMO CODE SETUP
    // ============================================

    setupPromoCode() {
        const promoInput = document.querySelector('.promo-input input');
        const promoBtn = document.querySelector('.btn-promo');

        if (promoBtn && promoInput) {
            promoBtn.addEventListener('click', () => {
                this.applyPromoCode(promoInput.value);
            });

            promoInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyPromoCode(promoInput.value);
                }
            });
        }
    }

    applyPromoCode(code) {
        if (!code || code.trim() === '') {
            this.showNotification('Please enter a promo code', 'warning');
            return;
        }

        // Use the cart's promo code system if available
        if (this.cart && this.cart.applyPromoCode) {
            const result = this.cart.applyPromoCode(code);

            if (result.success) {
                this.showNotification(result.message, 'success');
                this.updateOrderSummary();

                // Update promo input
                const input = document.querySelector('.promo-input input');
                if (input) {
                    input.value = code;
                    input.disabled = true;
                }

                const btn = document.querySelector('.btn-promo');
                if (btn) {
                    btn.textContent = 'Applied ✓';
                    btn.style.background = '#56ab2f';
                }
            } else {
                this.showNotification(result.message, 'error');
            }
        } else {
            // Fallback: Simple demo promo codes
            const promos = {
                'WELCOME10': 0.10,
                'FAMILY20': 0.20,
                'FOODIE15': 0.15
            };

            const normalizedCode = code.trim().toUpperCase();
            if (promos[normalizedCode]) {
                const discount = promos[normalizedCode];
                const subtotal = this.cart ? this.cart.getSubtotal() : 0;
                const discountAmount = subtotal * discount;

                this.showNotification(`🎉 ${discount * 100}% off applied!`, 'success');

                // Update the discount display
                const discountRow = document.querySelector('.total-row.discount-row');
                const discountElement = document.querySelector('.discount-amount');
                if (discountRow && discountElement) {
                    discountRow.style.display = 'flex';
                    discountElement.textContent = `-$${discountAmount.toFixed(2)}`;
                }

                // Update total
                const total = subtotal - discountAmount + (this.cart ? this.cart.getDeliveryFee() : 0);
                const totalElement = document.querySelector('.total-row.total-final .final-price');
                if (totalElement) {
                    totalElement.textContent = `$${total.toFixed(2)}`;
                }
            } else {
                this.showNotification('❌ Invalid promo code', 'error');
            }
        }
    }

    // ============================================
    // CARD INPUT FORMATTING - User-friendly
    // ============================================

    formatCardNumber(input) {
        if (!input) return;

        // Remove all non-digit characters
        let value = input.value.replace(/\D/g, '');

        // Add spaces every 4 digits
        value = value.replace(/(.{4})/g, '$1 ').trim();

        // Limit to 19 characters (16 digits + 3 spaces)
        value = value.slice(0, 19);

        input.value = value;
    }

    formatExpiryDate(input) {
        if (!input) return;

        // Remove all non-digit characters
        let value = input.value.replace(/\D/g, '');

        // Add slash after 2 digits
        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2, 4);
        }

        // Limit to 5 characters (MM/YY)
        value = value.slice(0, 5);

        input.value = value;
    }

    formatCVV(input) {
        if (!input) return;

        // Remove all non-digit characters
        let value = input.value.replace(/\D/g, '');

        // Limit to 4 characters
        value = value.slice(0, 4);

        input.value = value;
    }

    // ============================================
    // AUTO-GENERATE ORDER NUMBER
    // ============================================

    generateOrderNumber() {
        const prefix = 'FOOD';
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${prefix}-${timestamp}-${random}`;
    }
}

// ============================================
// GLOBAL FUNCTIONS - For use in HTML
// ============================================

/**
 * Format card number input
 * @param {HTMLInputElement} input - The input element
 */
function formatCardNumber(input) {
    if (window.checkout) {
        window.checkout.formatCardNumber(input);
    }
}

/**
 * Format expiry date input
 * @param {HTMLInputElement} input - The input element
 */
function formatExpiryDate(input) {
    if (window.checkout) {
        window.checkout.formatExpiryDate(input);
    }
}

/**
 * Format CVV input
 * @param {HTMLInputElement} input - The input element
 */
function formatCVV(input) {
    if (window.checkout) {
        window.checkout.formatCVV(input);
    }
}

// ============================================
// INITIALIZATION - Let's get started!
// ============================================

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    // Create the checkout instance
    if (typeof window.checkout === 'undefined') {
        window.checkout = new Checkout();
        console.log('📝 Checkout initialized successfully!');
    }
});

// Make checkout available globally
window.Checkout = Checkout;

// ============================================
// EXPORT (for module bundlers if needed)
// ============================================

// If using ES modules
// export default Checkout;
// export { Checkout };

console.log('📝 Checkout.js loaded successfully!');
console.log('🍽️ Ready to process your order!');
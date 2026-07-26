/**
 * ============================================
 * UTILS.JS - Utility Functions
 * Foodie's Delight - Restaurant Food Order Website
 * ============================================
 * 
 * This file contains all utility functions including:
 * - DOM manipulation helpers
 * - String utilities
 * - Date/Time formatting
 * - Number formatting
 * - Array/Object helpers
 * - Validation functions
 * - Storage helpers
 * - Animation utilities
 * - And more...
 * ============================================
 */

// ============================================
// DOM UTILITIES - Making the DOM dance
// ============================================

const DOMUtils = {
    /**
     * Get an element by selector
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (optional)
     * @returns {Element|null} The found element
     */
    getElement: (selector, context = document) => {
        return context.querySelector(selector);
    },

    /**
     * Get multiple elements by selector
     * @param {string} selector - CSS selector
     * @param {Element} context - Context element (optional)
     * @returns {NodeList} The found elements
     */
    getElements: (selector, context = document) => {
        return context.querySelectorAll(selector);
    },

    /**
     * Add a class to an element
     * @param {Element|string} element - Element or selector
     * @param {string} className - Class name to add
     */
    addClass: (element, className) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.classList.add(className);
    },

    /**
     * Remove a class from an element
     * @param {Element|string} element - Element or selector
     * @param {string} className - Class name to remove
     */
    removeClass: (element, className) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.classList.remove(className);
    },

    /**
     * Toggle a class on an element
     * @param {Element|string} element - Element or selector
     * @param {string} className - Class name to toggle
     * @param {boolean} force - Force state (optional)
     */
    toggleClass: (element, className, force) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.classList.toggle(className, force);
    },

    /**
     * Check if an element has a class
     * @param {Element|string} element - Element or selector
     * @param {string} className - Class name to check
     * @returns {boolean} True if the element has the class
     */
    hasClass: (element, className) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        return el ? el.classList.contains(className) : false;
    },

    /**
     * Set the text content of an element
     * @param {Element|string} element - Element or selector
     * @param {string} text - Text to set
     */
    setText: (element, text) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.textContent = text;
    },

    /**
     * Get the text content of an element
     * @param {Element|string} element - Element or selector
     * @returns {string} The text content
     */
    getText: (element) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        return el ? el.textContent : '';
    },

    /**
     * Set the HTML content of an element
     * @param {Element|string} element - Element or selector
     * @param {string} html - HTML to set
     */
    setHTML: (element, html) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.innerHTML = html;
    },

    /**
     * Get the HTML content of an element
     * @param {Element|string} element - Element or selector
     * @returns {string} The HTML content
     */
    getHTML: (element) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        return el ? el.innerHTML : '';
    },

    /**
     * Insert HTML before an element
     * @param {Element|string} element - Element or selector
     * @param {string} html - HTML to insert
     */
    insertBefore: (element, html) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.insertAdjacentHTML('beforebegin', html);
    },

    /**
     * Insert HTML after an element
     * @param {Element|string} element - Element or selector
     * @param {string} html - HTML to insert
     */
    insertAfter: (element, html) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.insertAdjacentHTML('afterend', html);
    },

    /**
     * Insert HTML at the start of an element
     * @param {Element|string} element - Element or selector
     * @param {string} html - HTML to insert
     */
    prepend: (element, html) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.insertAdjacentHTML('afterbegin', html);
    },

    /**
     * Insert HTML at the end of an element
     * @param {Element|string} element - Element or selector
     * @param {string} html - HTML to insert
     */
    append: (element, html) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (el) el.insertAdjacentHTML('beforeend', html);
    },

    /**
     * Get the position of an element
     * @param {Element} element - The element
     * @returns {Object} Position object with top and left
     */
    getPosition: (element) => {
        const rect = element.getBoundingClientRect();
        return {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            bottom: rect.bottom + window.scrollY,
            right: rect.right + window.scrollX,
            width: rect.width,
            height: rect.height
        };
    },

    /**
     * Check if an element is visible in the viewport
     * @param {Element} element - The element
     * @param {number} offset - Offset amount (optional)
     * @returns {boolean} True if the element is visible
     */
    isVisible: (element, offset = 0) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        return rect.top < viewportHeight - offset && rect.bottom > offset;
    },

    /**
     * Wait for an element to exist in the DOM
     * @param {string} selector - CSS selector
     * @param {number} timeout - Timeout in milliseconds (optional)
     * @returns {Promise} Resolves when the element exists
     */
    waitForElement: (selector, timeout = 5000) => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const element = DOMUtils.getElement(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element "${selector}" not found within ${timeout}ms`));
                    return;
                }

                requestAnimationFrame(checkElement);
            };

            checkElement();
        });
    },

    /**
     * Create an element with attributes and children
     * @param {string} tag - HTML tag name
     * @param {Object} attributes - Attributes to set
     * @param {Array|string} children - Child elements or text
     * @returns {Element} The created element
     */
    createElement: (tag, attributes = {}, children = []) => {
        const element = document.createElement(tag);

        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else {
                element.setAttribute(key, value);
            }
        });

        // Add children
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof Element) {
                    element.appendChild(child);
                }
            });
        }

        return element;
    }
};

// ============================================
// STRING UTILITIES - Words matter
// ============================================

const StringUtils = {
    /**
     * Capitalize the first letter of a string
     * @param {string} str - The string to capitalize
     * @returns {string} Capitalized string
     */
    capitalize: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    /**
     * Capitalize the first letter of each word
     * @param {string} str - The string to capitalize
     * @returns {string} Capitalized string
     */
    titleCase: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str.toLowerCase().split(' ').map(word =>
            StringUtils.capitalize(word)
        ).join(' ');
    },

    /**
     * Truncate a string to a specific length
     * @param {string} str - The string to truncate
     * @param {number} length - Maximum length
     * @param {string} suffix - Suffix to add (optional)
     * @returns {string} Truncated string
     */
    truncate: (str, length = 50, suffix = '...') => {
        if (!str || typeof str !== 'string') return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + suffix;
    },

    /**
     * Convert a string to slug format (URL-friendly)
     * @param {string} str - The string to convert
     * @returns {string} Slugified string
     */
    slugify: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    },

    /**
     * Convert a string to a friendly URL
     * @param {string} str - The string to convert
     * @returns {string} URL-friendly string
     */
    toUrlFriendly: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    },

    /**
     * Check if a string is empty or whitespace
     * @param {string} str - The string to check
     * @returns {boolean} True if the string is empty
     */
    isEmpty: (str) => {
        return !str || str.trim().length === 0;
    },

    /**
     * Get the length of a string (including emoji support)
     * @param {string} str - The string to check
     * @returns {number} Length of the string
     */
    getLength: (str) => {
        if (!str) return 0;
        return [...str].length;
    },

    /**
     * Count words in a string
     * @param {string} str - The string to check
     * @returns {number} Number of words
     */
    wordCount: (str) => {
        if (!str || typeof str !== 'string') return 0;
        const cleaned = str.replace(/[^\w\s]/g, '');
        return cleaned.trim().split(/\s+/).length;
    },

    /**
     * Generate a random string
     * @param {number} length - Length of the string
     * @param {string} chars - Characters to use (optional)
     * @returns {string} Random string
     */
    random: (length = 10, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },

    /**
     * Convert camelCase to Title Case
     * @param {string} str - The string to convert
     * @returns {string} Title Case string
     */
    camelToTitle: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s) => s.toUpperCase())
            .trim();
    },

    /**
     * Convert Title Case to camelCase
     * @param {string} str - The string to convert
     * @returns {string} camelCase string
     */
    titleToCamel: (str) => {
        if (!str || typeof str !== 'string') return '';
        return str
            .toLowerCase()
            .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase());
    }
};

// ============================================
// NUMBER UTILITIES - Making cents of it all
// ============================================

const NumberUtils = {
    /**
     * Format a number as currency
     * @param {number} amount - The amount to format
     * @param {string} currency - Currency code (optional)
     * @param {string} locale - Locale (optional)
     * @returns {string} Formatted currency string
     */
    formatCurrency: (amount, currency = 'USD', locale = 'en-US') => {
        if (typeof amount !== 'number' || isNaN(amount)) return '$0.00';
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency
        }).format(amount);
    },

    /**
     * Format a number with commas
     * @param {number} num - The number to format
     * @param {number} decimals - Number of decimal places (optional)
     * @returns {string} Formatted number
     */
    formatNumber: (num, decimals = 0) => {
        if (typeof num !== 'number' || isNaN(num)) return '0';
        return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },

    /**
     * Format a number as percentage
     * @param {number} num - The number to format
     * @param {number} decimals - Number of decimal places (optional)
     * @returns {string} Formatted percentage
     */
    formatPercentage: (num, decimals = 0) => {
        if (typeof num !== 'number' || isNaN(num)) return '0%';
        return (num * 100).toFixed(decimals) + '%';
    },

    /**
     * Round a number to a specific precision
     * @param {number} num - The number to round
     * @param {number} precision - Number of decimal places (optional)
     * @returns {number} Rounded number
     */
    round: (num, precision = 2) => {
        if (typeof num !== 'number' || isNaN(num)) return 0;
        const factor = Math.pow(10, precision);
        return Math.round(num * factor) / factor;
    },

    /**
     * Get a random number between min and max
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {boolean} integer - Whether to return an integer (optional)
     * @returns {number} Random number
     */
    random: (min = 0, max = 1, integer = false) => {
        const num = Math.random() * (max - min) + min;
        return integer ? Math.floor(num) : num;
    },

    /**
     * Clamp a number between min and max
     * @param {number} num - The number to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} Clamped number
     */
    clamp: (num, min, max) => {
        return Math.min(Math.max(num, min), max);
    },

    /**
     * Check if a number is between min and max
     * @param {number} num - The number to check
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @param {boolean} inclusive - Whether to include min and max (optional)
     * @returns {boolean} True if the number is in range
     */
    isInRange: (num, min, max, inclusive = true) => {
        if (inclusive) {
            return num >= min && num <= max;
        }
        return num > min && num < max;
    },

    /**
     * Convert a string to a number safely
     * @param {string} str - The string to convert
     * @param {number} defaultValue - Default value if conversion fails (optional)
     * @returns {number} Converted number
     */
    parseNumber: (str, defaultValue = 0) => {
        if (typeof str === 'number' && !isNaN(str)) return str;
        if (typeof str === 'string') {
            const cleaned = str.replace(/[^0-9.-]/g, '');
            const num = parseFloat(cleaned);
            if (!isNaN(num)) return num;
        }
        return defaultValue;
    }
};

// ============================================
// DATE/TIME UTILITIES - Time flies when you're eating
// ============================================

const DateUtils = {
    /**
     * Format a date
     * @param {Date|string|number} date - Date to format
     * @param {string} format - Format string (optional)
     * @param {string} locale - Locale (optional)
     * @returns {string} Formatted date
     */
    formatDate: (date, format = 'MMM DD, YYYY', locale = 'en-US') => {
        const d = DateUtils.parse(date);
        if (!d || isNaN(d.getTime())) return 'Invalid Date';

        const options = DateUtils.getFormatOptions(format);
        return new Intl.DateTimeFormat(locale, options).format(d);
    },

    /**
     * Format a time
     * @param {Date|string|number} date - Date to format
     * @param {string} locale - Locale (optional)
     * @returns {string} Formatted time
     */
    formatTime: (date, locale = 'en-US') => {
        const d = DateUtils.parse(date);
        if (!d || isNaN(d.getTime())) return 'Invalid Time';

        return new Intl.DateTimeFormat(locale, {
            hour: '2-digit',
            minute: '2-digit'
        }).format(d);
    },

    /**
     * Format a date as a relative time (e.g., "2 hours ago")
     * @param {Date|string|number} date - Date to format
     * @returns {string} Relative time string
     */
    formatRelative: (date) => {
        const d = DateUtils.parse(date);
        if (!d || isNaN(d.getTime())) return 'Invalid Date';

        const now = new Date();
        const diff = Math.floor((now - d) / 1000);

        if (diff < 60) return 'Just now';
        if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
        if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
        if (diff < 172800) return 'Yesterday';
        if (diff < 2592000) return Math.floor(diff / 86400) + ' days ago';
        if (diff < 31536000) return Math.floor(diff / 2592000) + ' months ago';
        return Math.floor(diff / 31536000) + ' years ago';
    },

    /**
     * Parse a date from various formats
     * @param {Date|string|number} date - Date to parse
     * @returns {Date} Parsed date
     */
    parse: (date) => {
        if (date instanceof Date) return date;
        if (typeof date === 'number') return new Date(date);
        if (typeof date === 'string') {
            // Try to parse the string
            const parsed = new Date(date);
            if (!isNaN(parsed.getTime())) return parsed;

            // Try to parse as relative time (e.g., "2 days ago")
            const relative = DateUtils.parseRelative(date);
            if (relative) return relative;
        }
        return new Date(date);
    },

    /**
     * Parse relative time strings (e.g., "2 days ago")
     * @param {string} str - Relative time string
     * @returns {Date|null} Parsed date
     */
    parseRelative: (str) => {
        const match = str.match(/^(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*ago$/);
        if (!match) return null;

        const value = parseInt(match[1]);
        const unit = match[2];
        const now = new Date();

        switch (unit) {
            case 'second': now.setSeconds(now.getSeconds() - value); break;
            case 'minute': now.setMinutes(now.getMinutes() - value); break;
            case 'hour': now.setHours(now.getHours() - value); break;
            case 'day': now.setDate(now.getDate() - value); break;
            case 'week': now.setDate(now.getDate() - value * 7); break;
            case 'month': now.setMonth(now.getMonth() - value); break;
            case 'year': now.setFullYear(now.getFullYear() - value); break;
            default: return null;
        }

        return now;
    },

    /**
     * Get the day of the week
     * @param {Date|string|number} date - Date to check
     * @param {string} locale - Locale (optional)
     * @returns {string} Day of the week
     */
    getDayName: (date, locale = 'en-US') => {
        const d = DateUtils.parse(date);
        if (!d || isNaN(d.getTime())) return '';

        return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(d);
    },

    /**
     * Get the month name
     * @param {Date|string|number} date - Date to check
     * @param {string} locale - Locale (optional)
     * @returns {string} Month name
     */
    getMonthName: (date, locale = 'en-US') => {
        const d = DateUtils.parse(date);
        if (!d || isNaN(d.getTime())) return '';

        return new Intl.DateTimeFormat(locale, { month: 'long' }).format(d);
    },

    /**
     * Check if two dates are the same day
     * @param {Date|string|number} date1 - First date
     * @param {Date|string|number} date2 - Second date
     * @returns {boolean} True if they are the same day
     */
    isSameDay: (date1, date2) => {
        const d1 = DateUtils.parse(date1);
        const d2 = DateUtils.parse(date2);
        if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) return false;

        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    },

    /**
     * Check if a date is today
     * @param {Date|string|number} date - Date to check
     * @returns {boolean} True if the date is today
     */
    isToday: (date) => {
        return DateUtils.isSameDay(date, new Date());
    },

    /**
     * Add time to a date
     * @param {Date|string|number} date - Date to add to
     * @param {number} amount - Amount to add
     * @param {string} unit - Unit to add (seconds, minutes, hours, days, weeks, months, years)
     * @returns {Date} New date
     */
    add: (date, amount, unit) => {
        const d = DateUtils.parse(date);
        if (!d || isNaN(d.getTime())) return new Date();

        const result = new Date(d);
        switch (unit) {
            case 'seconds': result.setSeconds(result.getSeconds() + amount); break;
            case 'minutes': result.setMinutes(result.getMinutes() + amount); break;
            case 'hours': result.setHours(result.getHours() + amount); break;
            case 'days': result.setDate(result.getDate() + amount); break;
            case 'weeks': result.setDate(result.getDate() + amount * 7); break;
            case 'months': result.setMonth(result.getMonth() + amount); break;
            case 'years': result.setFullYear(result.getFullYear() + amount); break;
            default: return d;
        }
        return result;
    },

    /**
     * Get the time difference between two dates
     * @param {Date|string|number} date1 - First date
     * @param {Date|string|number} date2 - Second date
     * @param {string} unit - Unit to return (seconds, minutes, hours, days)
     * @returns {number} Difference in the specified unit
     */
    diff: (date1, date2, unit = 'days') => {
        const d1 = DateUtils.parse(date1);
        const d2 = DateUtils.parse(date2);
        if (!d1 || !d2 || isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;

        const diffMs = d1.getTime() - d2.getTime();
        switch (unit) {
            case 'seconds': return diffMs / 1000;
            case 'minutes': return diffMs / (1000 * 60);
            case 'hours': return diffMs / (1000 * 60 * 60);
            case 'days': return diffMs / (1000 * 60 * 60 * 24);
            default: return diffMs;
        }
    },

    /**
     * Get format options from a format string
     * @param {string} format - Format string
     * @returns {Object} Intl.DateTimeFormat options
     */
    getFormatOptions: (format) => {
        const options = {};

        if (format.includes('YYYY')) options.year = 'numeric';
        if (format.includes('YY')) options.year = '2-digit';
        if (format.includes('MMMM')) options.month = 'long';
        if (format.includes('MMM')) options.month = 'short';
        if (format.includes('MM')) options.month = '2-digit';
        if (format.includes('M')) options.month = 'numeric';
        if (format.includes('DDDD')) options.weekday = 'long';
        if (format.includes('DDD')) options.weekday = 'short';
        if (format.includes('DD')) options.day = '2-digit';
        if (format.includes('D')) options.day = 'numeric';
        if (format.includes('HH')) options.hour = '2-digit';
        if (format.includes('H')) options.hour = 'numeric';
        if (format.includes('mm')) options.minute = '2-digit';
        if (format.includes('m')) options.minute = 'numeric';
        if (format.includes('ss')) options.second = '2-digit';
        if (format.includes('s')) options.second = 'numeric';

        return options;
    }
};

// ============================================
// ARRAY UTILITIES - Keeping things organized
// ============================================

const ArrayUtils = {
    /**
     * Check if an array is empty
     * @param {Array} arr - The array to check
     * @returns {boolean} True if the array is empty
     */
    isEmpty: (arr) => {
        return !arr || arr.length === 0;
    },

    /**
     * Get the last element of an array
     * @param {Array} arr - The array
     * @returns {*} The last element
     */
    last: (arr) => {
        return arr && arr.length > 0 ? arr[arr.length - 1] : undefined;
    },

    /**
     * Get the first element of an array
     * @param {Array} arr - The array
     * @returns {*} The first element
     */
    first: (arr) => {
        return arr && arr.length > 0 ? arr[0] : undefined;
    },

    /**
     * Remove duplicates from an array
     * @param {Array} arr - The array
     * @returns {Array} Array without duplicates
     */
    unique: (arr) => {
        return [...new Set(arr)];
    },

    /**
     * Chunk an array into smaller arrays of a specific size
     * @param {Array} arr - The array to chunk
     * @param {number} size - Chunk size
     * @returns {Array} Chunked array
     */
    chunk: (arr, size) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    },

    /**
     * Shuffle an array (Fisher-Yates)
     * @param {Array} arr - The array to shuffle
     * @returns {Array} Shuffled array
     */
    shuffle: (arr) => {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    },

    /**
     * Group an array by a key
     * @param {Array} arr - The array to group
     * @param {string|Function} key - Key to group by
     * @returns {Object} Grouped object
     */
    groupBy: (arr, key) => {
        return arr.reduce((group, item) => {
            const groupKey = typeof key === 'function' ? key(item) : item[key];
            group[groupKey] = group[groupKey] || [];
            group[groupKey].push(item);
            return group;
        }, {});
    },

    /**
     * Sum an array of numbers
     * @param {Array} arr - Array of numbers
     * @returns {number} Sum
     */
    sum: (arr) => {
        return arr.reduce((total, num) => total + num, 0);
    },

    /**
     * Average an array of numbers
     * @param {Array} arr - Array of numbers
     * @returns {number} Average
     */
    average: (arr) => {
        return arr.length > 0 ? ArrayUtils.sum(arr) / arr.length : 0;
    },

    /**
     * Find the minimum value in an array
     * @param {Array} arr - Array of numbers
     * @returns {number} Minimum value
     */
    min: (arr) => {
        return arr.length > 0 ? Math.min(...arr) : undefined;
    },

    /**
     * Find the maximum value in an array
     * @param {Array} arr - Array of numbers
     * @returns {number} Maximum value
     */
    max: (arr) => {
        return arr.length > 0 ? Math.max(...arr) : undefined;
    },

    /**
     * Sort an array by a key
     * @param {Array} arr - The array to sort
     * @param {string|Function} key - Key to sort by
     * @param {string} order - Sort order (asc, desc)
     * @returns {Array} Sorted array
     */
    sortBy: (arr, key, order = 'asc') => {
        const sorted = [...arr];
        const direction = order === 'desc' ? -1 : 1;

        sorted.sort((a, b) => {
            const aVal = typeof key === 'function' ? key(a) : a[key];
            const bVal = typeof key === 'function' ? key(b) : b[key];

            if (aVal < bVal) return -1 * direction;
            if (aVal > bVal) return 1 * direction;
            return 0;
        });

        return sorted;
    },

    /**
     * Flatten a nested array
     * @param {Array} arr - The array to flatten
     * @param {number} depth - Depth to flatten (optional)
     * @returns {Array} Flattened array
     */
    flatten: (arr, depth = Infinity) => {
        return arr.flat(depth);
    },

    /**
     * Difference between two arrays
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array} Elements in arr1 that are not in arr2
     */
    difference: (arr1, arr2) => {
        return arr1.filter(item => !arr2.includes(item));
    },

    /**
     * Intersection of two arrays
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array} Elements common to both arrays
     */
    intersection: (arr1, arr2) => {
        return arr1.filter(item => arr2.includes(item));
    },

    /**
     * Union of two arrays
     * @param {Array} arr1 - First array
     * @param {Array} arr2 - Second array
     * @returns {Array} Elements from both arrays (unique)
     */
    union: (arr1, arr2) => {
        return ArrayUtils.unique([...arr1, ...arr2]);
    }
};

// ============================================
// OBJECT UTILITIES - Keeping things structured
// ============================================

const ObjectUtils = {
    /**
     * Check if an object is empty
     * @param {Object} obj - The object to check
     * @returns {boolean} True if the object is empty
     */
    isEmpty: (obj) => {
        return !obj || Object.keys(obj).length === 0;
    },

    /**
     * Deep clone an object
     * @param {Object} obj - The object to clone
     * @returns {Object} Cloned object
     */
    clone: (obj) => {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * Merge two objects (deep merge)
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    merge: (target, source) => {
        const result = { ...target };

        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = ObjectUtils.merge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }

        return result;
    },

    /**
     * Pick specific properties from an object
     * @param {Object} obj - The object
     * @param {Array} keys - Keys to pick
     * @returns {Object} Object with picked properties
     */
    pick: (obj, keys) => {
        return keys.reduce((result, key) => {
            if (key in obj) {
                result[key] = obj[key];
            }
            return result;
        }, {});
    },

    /**
     * Omit specific properties from an object
     * @param {Object} obj - The object
     * @param {Array} keys - Keys to omit
     * @returns {Object} Object without omitted properties
     */
    omit: (obj, keys) => {
        const result = { ...obj };
        keys.forEach(key => delete result[key]);
        return result;
    },

    /**
     * Get a nested value from an object using dot notation
     * @param {Object} obj - The object
     * @param {string} path - Path to the value (e.g., "user.address.city")
     * @param {*} defaultValue - Default value if path doesn't exist
     * @returns {*} Value at the path
     */
    get: (obj, path, defaultValue = undefined) => {
        if (!obj || typeof obj !== 'object') return defaultValue;

        const keys = path.split('.');
        let current = obj;

        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return defaultValue;
            }
        }

        return current;
    },

    /**
     * Set a nested value in an object using dot notation
     * @param {Object} obj - The object
     * @param {string} path - Path to set (e.g., "user.address.city")
     * @param {*} value - Value to set
     * @returns {Object} The modified object
     */
    set: (obj, path, value) => {
        const keys = path.split('.');
        let current = obj;

        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]] || typeof current[keys[i]] !== 'object') {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }

        current[keys[keys.length - 1]] = value;
        return obj;
    },

    /**
     * Convert an object to an array of key-value pairs
     * @param {Object} obj - The object
     * @returns {Array} Array of [key, value] pairs
     */
    toPairs: (obj) => {
        return Object.entries(obj);
    },

    /**
     * Convert an array of key-value pairs to an object
     * @param {Array} pairs - Array of [key, value] pairs
     * @returns {Object} The object
     */
    fromPairs: (pairs) => {
        return Object.fromEntries(pairs);
    },

    /**
     * Map over an object's values
     * @param {Object} obj - The object
     * @param {Function} fn - Mapping function
     * @returns {Object} Mapped object
     */
    map: (obj, fn) => {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                result[key] = fn(obj[key], key);
            }
        }
        return result;
    },

    /**
     * Filter an object's properties
     * @param {Object} obj - The object
     * @param {Function} fn - Filter function
     * @returns {Object} Filtered object
     */
    filter: (obj, fn) => {
        const result = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key) && fn(obj[key], key)) {
                result[key] = obj[key];
            }
        }
        return result;
    }
};

// ============================================
// VALIDATION UTILITIES - Keeping data clean
// ============================================

const ValidationUtils = {
    /**
     * Check if a value is a valid email
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    isEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Check if a value is a valid phone number
     * @param {string} phone - Phone to validate
     * @returns {boolean} True if valid
     */
    isPhone: (phone) => {
        const re = /^[\+\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    },

    /**
     * Check if a value is a valid URL
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    isURL: (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check if a value is a valid credit card number (Luhn algorithm)
     * @param {string} cardNumber - Card number to validate
     * @returns {boolean} True if valid
     */
    isCreditCard: (cardNumber) => {
        const digits = cardNumber.replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) return false;

        let sum = 0;
        let isEven = false;

        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    },

    /**
     * Check if a value is a valid ZIP code
     * @param {string} zip - ZIP code to validate
     * @returns {boolean} True if valid
     */
    isZipCode: (zip) => {
        const re = /^\d{5}(-\d{4})?$/;
        return re.test(zip);
    },

    /**
     * Check if a value is a valid date
     * @param {*} value - Value to check
     * @returns {boolean} True if valid
     */
    isDate: (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
    },

    /**
     * Check if a value is a valid number
     * @param {*} value - Value to check
     * @returns {boolean} True if valid
     */
    isNumber: (value) => {
        return typeof value === 'number' && !isNaN(value);
    },

    /**
     * Check if a value is a valid integer
     * @param {*} value - Value to check
     * @returns {boolean} True if valid
     */
    isInteger: (value) => {
        return Number.isInteger(value);
    },

    /**
     * Check if a string is a valid JSON
     * @param {string} str - String to check
     * @returns {boolean} True if valid
     */
    isJSON: (str) => {
        try {
            JSON.parse(str);
            return true;
        } catch {
            return false;
        }
    },

    /**
     * Check if a value is a valid password (8+ chars, at least one number, one uppercase, one lowercase)
     * @param {string} password - Password to validate
     * @returns {boolean} True if valid
     */
    isPassword: (password) => {
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        return re.test(password);
    },

    /**
     * Check if two strings match
     * @param {string} str1 - First string
     * @param {string} str2 - Second string
     * @returns {boolean} True if they match
     */
    matches: (str1, str2) => {
        return str1 === str2;
    },

    /**
     * Check if a value is in a list
     * @param {*} value - Value to check
     * @param {Array} list - List to check against
     * @returns {boolean} True if in list
     */
    isIn: (value, list) => {
        return list.includes(value);
    }
};

// ============================================
// STORAGE UTILITIES - Keeping data safe
// ============================================

const StorageUtils = {
    /**
     * Save data to localStorage
     * @param {string} key - Storage key
     * @param {*} data - Data to save
     * @returns {boolean} True if successful
     */
    set: (key, data) => {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.warn('Unable to save to localStorage:', error);
            return false;
        }
    },

    /**
     * Get data from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Retrieved data
     */
    get: (key, defaultValue = null) => {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.warn('Unable to read from localStorage:', error);
            return defaultValue;
        }
    },

    /**
     * Remove data from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful
     */
    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('Unable to remove from localStorage:', error);
            return false;
        }
    },

    /**
     * Clear all localStorage data
     * @returns {boolean} True if successful
     */
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.warn('Unable to clear localStorage:', error);
            return false;
        }
    },

    /**
     * Check if a key exists in localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if key exists
     */
    has: (key) => {
        return localStorage.getItem(key) !== null;
    },

    /**
     * Get all keys from localStorage
     * @returns {Array} Array of keys
     */
    keys: () => {
        return Object.keys(localStorage);
    }
};

// ============================================
// ANIMATION UTILITIES - Making things move
// ============================================

const AnimationUtils = {
    /**
     * Fade in an element
     * @param {Element} element - The element
     * @param {number} duration - Duration in ms (optional)
     * @param {Function} callback - Callback function (optional)
     */
    fadeIn: (element, duration = 300, callback = null) => {
        if (!element) return;

        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ease`;

        // Trigger reflow
        void element.offsetHeight;

        element.style.opacity = '1';

        setTimeout(() => {
            if (callback) callback();
        }, duration);
    },

    /**
     * Fade out an element
     * @param {Element} element - The element
     * @param {number} duration - Duration in ms (optional)
     * @param {Function} callback - Callback function (optional)
     */
    fadeOut: (element, duration = 300, callback = null) => {
        if (!element) return;

        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;

        setTimeout(() => {
            element.style.display = 'none';
            if (callback) callback();
        }, duration);
    },

    /**
     * Slide down an element
     * @param {Element} element - The element
     * @param {number} duration - Duration in ms (optional)
     * @param {Function} callback - Callback function (optional)
     */
    slideDown: (element, duration = 300, callback = null) => {
        if (!element) return;

        const height = element.scrollHeight;
        element.style.maxHeight = '0';
        element.style.overflow = 'hidden';
        element.style.display = 'block';
        element.style.transition = `max-height ${duration}ms ease`;

        // Trigger reflow
        void element.offsetHeight;

        element.style.maxHeight = height + 'px';

        setTimeout(() => {
            element.style.maxHeight = 'none';
            element.style.overflow = 'visible';
            if (callback) callback();
        }, duration);
    },

    /**
     * Slide up an element
     * @param {Element} element - The element
     * @param {number} duration - Duration in ms (optional)
     * @param {Function} callback - Callback function (optional)
     */
    slideUp: (element, duration = 300, callback = null) => {
        if (!element) return;

        const height = element.scrollHeight;
        element.style.maxHeight = height + 'px';
        element.style.overflow = 'hidden';
        element.style.transition = `max-height ${duration}ms ease`;

        // Trigger reflow
        void element.offsetHeight;

        element.style.maxHeight = '0';

        setTimeout(() => {
            element.style.display = 'none';
            element.style.maxHeight = 'none';
            element.style.overflow = 'visible';
            if (callback) callback();
        }, duration);
    },

    /**
     * Slide toggle an element
     * @param {Element} element - The element
     * @param {number} duration - Duration in ms (optional)
     * @param {Function} callback - Callback function (optional)
     */
    slideToggle: (element, duration = 300, callback = null) => {
        if (!element) return;

        if (element.style.display === 'none' || element.style.display === '') {
            AnimationUtils.slideDown(element, duration, callback);
        } else {
            AnimationUtils.slideUp(element, duration, callback);
        }
    },

    /**
     * Scroll to an element with animation
     * @param {Element|string} element - Element or selector
     * @param {number} offset - Offset from top (optional)
     * @param {number} duration - Duration in ms (optional)
     */
    scrollTo: (element, offset = 0, duration = 800) => {
        const el = typeof element === 'string' ? DOMUtils.getElement(element) : element;
        if (!el) return;

        const targetPosition = DOMUtils.getPosition(el).top - offset;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const startTime = Date.now();

        const ease = (t) => {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = ease(progress);

            window.scrollTo(0, startPosition + distance * easedProgress);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    },

    /**
     * Animate a number from start to end
     * @param {Element} element - The element to update
     * @param {number} start - Start value
     * @param {number} end - End value
     * @param {number} duration - Duration in ms (optional)
     * @param {Function} formatter - Formatter function (optional)
     */
    animateNumber: (element, start, end, duration = 1000, formatter = (n) => n) => {
        if (!element) return;

        const startTime = Date.now();
        const difference = end - start;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = progress < 0.5 ?
                2 * progress * progress :
                -1 + (4 - 2 * progress) * progress;

            const currentValue = start + difference * easedProgress;
            element.textContent = formatter(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    },

    /**
     * Add a pulsing animation to an element
     * @param {Element} element - The element
     * @param {number} duration - Duration in ms (optional)
     */
    pulse: (element, duration = 1500) => {
        if (!element) return;

        element.style.animation = `pulse ${duration}ms ease-in-out infinite`;

        // Add keyframes if not already present
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(style);
    },

    /**
     * Add a shaking animation to an element
     * @param {Element} element - The element
     * @param {number} duration - Duration in ms (optional)
     */
    shake: (element, duration = 500) => {
        if (!element) return;

        element.style.animation = `shake ${duration}ms ease-in-out`;

        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 50% { transform: translateX(-10px); }
                30%, 70% { transform: translateX(10px); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
};

// ============================================
// DEVICE UTILITIES - Know your environment
// ============================================

const DeviceUtils = {
    /**
     * Check if the device is mobile
     * @returns {boolean} True if mobile
     */
    isMobile: () => {
        return window.innerWidth < 768;
    },

    /**
     * Check if the device is tablet
     * @returns {boolean} True if tablet
     */
    isTablet: () => {
        return window.innerWidth >= 768 && window.innerWidth < 1024;
    },

    /**
     * Check if the device is desktop
     * @returns {boolean} True if desktop
     */
    isDesktop: () => {
        return window.innerWidth >= 1024;
    },

    /**
     * Check if the device is touch-enabled
     * @returns {boolean} True if touch-enabled
     */
    isTouch: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },

    /**
     * Check the device type
     * @returns {string} Device type (mobile, tablet, desktop)
     */
    getDeviceType: () => {
        if (DeviceUtils.isMobile()) return 'mobile';
        if (DeviceUtils.isTablet()) return 'tablet';
        return 'desktop';
    },

    /**
     * Check the operating system
     * @returns {string} Operating system
     */
    getOS: () => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('windows')) return 'windows';
        if (userAgent.includes('mac')) return 'mac';
        if (userAgent.includes('linux')) return 'linux';
        if (userAgent.includes('android')) return 'android';
        if (userAgent.includes('ios') || userAgent.includes('iphone') || userAgent.includes('ipad')) {
            return 'ios';
        }
        return 'unknown';
    },

    /**
     * Check the browser
     * @returns {string} Browser name
     */
    getBrowser: () => {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('firefox')) return 'firefox';
        if (userAgent.includes('chrome') && !userAgent.includes('edge')) return 'chrome';
        if (userAgent.includes('safari') && !userAgent.includes('chrome')) return 'safari';
        if (userAgent.includes('edge')) return 'edge';
        if (userAgent.includes('opera') || userAgent.includes('opr')) return 'opera';
        return 'unknown';
    },

    /**
     * Check if the device is in dark mode
     * @returns {boolean} True if in dark mode
     */
    isDarkMode: () => {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },

    /**
     * Get the viewport size
     * @returns {Object} Viewport size
     */
    getViewportSize: () => {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }
};

// ============================================
// COOKIE UTILITIES - Tasty data storage
// ============================================

const CookieUtils = {
    /**
     * Set a cookie
     * @param {string} name - Cookie name
     * @param {string} value - Cookie value
     * @param {number} days - Days until expiration (optional)
     * @param {string} path - Cookie path (optional)
     */
    set: (name, value, days = 7, path = '/') => {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path}`;
    },

    /**
     * Get a cookie
     * @param {string} name - Cookie name
     * @returns {string|null} Cookie value or null if not found
     */
    get: (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + encodeURIComponent(name) + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    },

    /**
     * Delete a cookie
     * @param {string} name - Cookie name
     * @param {string} path - Cookie path (optional)
     */
    delete: (name, path = '/') => {
        document.cookie = `${encodeURIComponent(name)}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=${path}`;
    },

    /**
     * Check if a cookie exists
     * @param {string} name - Cookie name
     * @returns {boolean} True if the cookie exists
     */
    has: (name) => {
        return CookieUtils.get(name) !== null;
    },

    /**
     * Get all cookies
     * @returns {Object} Object of all cookies
     */
    all: () => {
        const cookies = {};
        document.cookie.split(';').forEach(cookie => {
            const [name, value] = cookie.trim().split('=');
            if (name) {
                cookies[decodeURIComponent(name)] = decodeURIComponent(value);
            }
        });
        return cookies;
    }
};

// ============================================
// EXPOSE UTILITIES TO GLOBAL SCOPE
// ============================================

// Expose all utility objects globally
window.DOMUtils = DOMUtils;
window.StringUtils = StringUtils;
window.NumberUtils = NumberUtils;
window.DateUtils = DateUtils;
window.ArrayUtils = ArrayUtils;
window.ObjectUtils = ObjectUtils;
window.ValidationUtils = ValidationUtils;
window.StorageUtils = StorageUtils;
window.AnimationUtils = AnimationUtils;
window.DeviceUtils = DeviceUtils;
window.CookieUtils = CookieUtils;

// Also expose individual functions for easier access
window.$ = (selector, context = document) => DOMUtils.getElement(selector, context);
window.$$ = (selector, context = document) => DOMUtils.getElements(selector, context);

console.log('🛠️ Utilities loaded successfully!');
console.log('💪 Ready to help with all your needs!');
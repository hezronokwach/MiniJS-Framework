/**
 * MiniJS Framework - DOM Module
 * 
 * Integrates all DOM-related functionality into a unified API.
 * This module combines element creation, attribute management,
 * DOM manipulation, and rendering capabilities.
 * 
 * @module dom/index
 * @version 1.0.0
 * @author MiniJS Framework Team
 */

(function() {
    'use strict';

    /**
     * Check for required dependencies and provide meaningful error messages
     */
    function validateDependencies() {
        const dependencies = [
            { name: 'MiniJSDOMElement', variable: window.MiniJSDOMElement, file: 'element.js' },
            { name: 'MiniJSDOMAttributes', variable: window.MiniJSDOMAttributes, file: 'attributes.js' },
            { name: 'MiniJSDOMManipulation', variable: window.MiniJSDOMManipulation, file: 'manipulation.js' },
            { name: 'MiniJSDOMRender', variable: window.MiniJSDOMRender, file: 'render.js' }
        ];
        
        const missing = dependencies.filter(dep => !dep.variable);
        
        if (missing.length > 0) {
            const missingNames = missing.map(dep => dep.name).join(', ');
            const missingFiles = missing.map(dep => dep.file).join(', ');
            console.error(
                `DOM module initialization failed: Required modules not loaded.\n` +
                `Missing: ${missingNames}\n` +
                `Make sure these files are loaded: ${missingFiles}`
            );
            return false;
        }
        
        return true;
    }

    // Check if required modules are loaded
    if (!validateDependencies()) {
        return; // Exit if dependencies are missing
    }

    // Get module references
    const element = window.MiniJSDOMElement;
    const attributes = window.MiniJSDOMAttributes;
    const manipulation = window.MiniJSDOMManipulation;
    const render = window.MiniJSDOMRender;

    /**
     * DOM Module - Unified API for DOM operations
     * @namespace
     */
    const DOM = {
        /**
         * Creates a virtual DOM element
         * @param {string} tag - HTML tag name
         * @param {Object} attributes - Element attributes
         * @param {Array|string|Object} children - Child elements
         * @returns {Object} Virtual DOM element
         */
        createElement: element.createElement,
        
        /**
         * Creates a virtual text node
         * @param {string} text - Text content
         * @returns {Object} Virtual text node
         */
        createTextNode: element.createTextNode,
        
        /**
         * Checks if an object is a virtual element
         * @param {*} obj - Object to check
         * @returns {boolean} True if object is a virtual element
         */
        isVirtualElement: element.isVirtualElement,
        
        /**
         * Checks if an object is a text node
         * @param {*} obj - Object to check
         * @returns {boolean} True if object is a text node
         */
        isTextNode: element.isTextNode,

        // Attribute management methods
        setAttribute: attributes.setAttribute,
        getAttribute: attributes.getAttribute,
        removeAttribute: attributes.removeAttribute,
        hasAttribute: attributes.hasAttribute,
        addClass: attributes.addClass,
        removeClass: attributes.removeClass,
        toggleClass: attributes.toggleClass,
        hasClass: attributes.hasClass,
        setStyle: attributes.setStyle,
        getStyle: attributes.getStyle,

        // DOM manipulation methods
        appendChild: manipulation.appendChild,
        removeChild: manipulation.removeChild,
        insertBefore: manipulation.insertBefore,
        insertAfter: manipulation.insertAfter,
        replaceChild: manipulation.replaceChild,
        clearChildren: manipulation.clearChildren,
        getFirstChild: manipulation.getFirstChild,
        getLastChild: manipulation.getLastChild,
        getChildren: manipulation.getChildren,
        getChildCount: manipulation.getChildCount,
        hasChildren: manipulation.hasChildren,
        findChild: manipulation.findChild,
        findChildren: manipulation.findChildren,

        /**
         * Renders a virtual element to the DOM
         * @param {Object} virtualElement - Virtual element to render
         * @param {HTMLElement} container - DOM element to render into
         * @returns {HTMLElement} The created DOM element
         */
        render: render.render,
        
        /**
         * Creates a real DOM element from a virtual element
         * @param {Object} virtualElement - Virtual element to convert
         * @returns {HTMLElement} Real DOM element
         */
        createDOMElement: render.createDOMElement,

        /**
         * Creates a component from a render function
         * @param {Function} renderFn - Function that returns a virtual element
         * @param {Object} props - Properties to pass to the render function
         * @returns {Object} Virtual element
         */
        createComponent: function(renderFn, props = {}) {
            if (typeof renderFn !== 'function') {
                throw new Error('createComponent: renderFn must be a function');
            }
            try {
                return renderFn(props);
            } catch (error) {
                console.error('Error creating component:', error);
                // Return an empty div as fallback
                return this.createElement('div', { class: 'error-component' }, 
                    'Component Error: ' + error.message);
            }
        },

        /**
         * Initializes the DOM module
         * @returns {Object} The DOM module for chaining
         */
        init: function() {
            console.log('🔄 DOM module initialized');
            
            // Attach to MiniJS if available
            if (window.MiniJS) {
                window.MiniJS.dom = this;
            }
            
            return this;
        },
        
        /**
         * Gets version information
         * @returns {Object} Version info
         */
        getVersion: function() {
            return {
                version: '1.0.0',
                name: 'MiniJS DOM Module',
                dependencies: {
                    element: true,
                    attributes: true,
                    manipulation: true,
                    render: true
                }
            };
        }
    };

    // Make available globally with safety check
    if (typeof window !== 'undefined') {
        window.MiniJSDOM = DOM;
    }

    // Auto-initialize when all modules are loaded
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                DOM.init();
            });
        } else {
            // DOM is already ready - initialize on next tick
            setTimeout(function() {
                DOM.init();
            }, 0);
        }
    }

})();
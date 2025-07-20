/**
 * MiniJS Framework - DOM Module
 * Integrates all DOM-related functionality
 */

(function() {
    'use strict';

    // Check if required modules are loaded
    const element = window.MiniJSDOMElement;
    const attributes = window.MiniJSDOMAttributes;
    const manipulation = window.MiniJSDOMManipulation;
    const render = window.MiniJSDOMRender;

    if (!element || !attributes || !manipulation || !render) {
        console.error('DOM module initialization failed: Required modules not loaded');
        return;
    }

    // Create the integrated DOM module
    const DOM = {
        // Element creation
        createElement: element.createElement,
        createTextNode: element.createTextNode,
        isVirtualElement: element.isVirtualElement,
        isTextNode: element.isTextNode,

        // Attributes
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

        // Manipulation
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

        // Rendering
        render: render.render,
        createDOMElement: render.createDOMElement,

        // Initialize the DOM module
        init: function() {
            console.log('🔄 DOM module initialized');
            
            // Attach to MiniJS if available
            if (window.MiniJS) {
                window.MiniJS.dom = this;
            }
        }
    };

    // Make available globally
    window.MiniJSDOM = DOM;

    // Auto-initialize when all modules are loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            DOM.init();
        });
    } else {
        // DOM is already ready
        setTimeout(function() {
            DOM.init();
        }, 0);
    }

})();
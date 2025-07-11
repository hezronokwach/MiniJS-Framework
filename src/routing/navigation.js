/**
 * MiniJS Framework - Routing Navigation Utilities
 * Exposes navigation functions for hash-based routing
 */

(function() {
    'use strict';

    // Use the router if available
    const Router = (typeof window !== 'undefined' && window.MiniJS && window.MiniJS.routing)
        ? window.MiniJS.routing
        : null;

    // Navigation API
    const Navigation = {
        navigateTo: function(route) {
            if (Router && typeof Router.navigateTo === 'function') {
                Router.navigateTo(route);
            }
        },
        back: function() {
            if (Router && typeof Router.back === 'function') {
                Router.back();
            }
        },
        forward: function() {
            if (Router && typeof Router.forward === 'function') {
                Router.forward();
            }
        }
    };

    // Attach to MiniJS.routing if available
    if (Router) {
        Router.navigation = Navigation;
    }

    // Support module exports
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Navigation;
    }

})(); 
/**
 * MiniJS Framework - Main Entry Point
 * A lightweight JavaScript framework with DOM abstraction, state management, event handling, and routing
 * 
 * @version 1.0.0
 * @author MiniJS Framework Team
 */

(function(global) {
    'use strict';

    /**
     * MiniJS Framework Main Object
     */
    const MiniJS = {
        version: '1.0.0',

        // Core modules
        core: null,
        dom: null, // Will be initialized with DOM module
        events: null,
        state: null,
        routing: (typeof require === 'function' ? require('./routing/router.js') : (window && window.MiniJS && window.MiniJS.routing) ? window.MiniJS.routing : null),
        
        // Framework initialization
        init: function() {
            console.log('🚀 MiniJS Framework v' + this.version + ' initializing...');

            // Initialize core modules when they're implemented
            if (this.core) this.core.init();
            if (this.dom) this.dom.init();
            if (this.events) this.events.init();
            if (this.state) this.state.init();
            if (this.routing) this.routing.init();

            console.log('✅ MiniJS Framework initialized successfully!');
            return this;
        },
        
        // Utility function to check if framework is ready
        isReady: function() {
            return !!(this.core && this.dom && this.events && this.state && this.routing);
        },
        
        // Get framework info
        getInfo: function() {
            return {
                name: 'MiniJS Framework',
                version: this.version,
                modules: {
                    core: !!this.core,
                    dom: !!this.dom,
                    events: !!this.events,
                    state: !!this.state,
                    routing: !!this.routing
                }
            };
        }
    };

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            MiniJS.init();
        });
    } else {
        // DOM is already ready
        setTimeout(function() {
            MiniJS.init();
        }, 0);
    }

    // Expose MiniJS to global scope
    global.MiniJS = MiniJS;

    // Also support CommonJS/Node.js if needed
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = MiniJS;
    }

})(typeof window !== 'undefined' ? window : this);

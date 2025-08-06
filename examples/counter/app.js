/**
 * Counter App - MiniJS Framework Example
 * 
 * Demonstrates how to use the refactored MiniJS framework
 * for building simple applications with state management.
 */

(function() {
    'use strict';

    let state;

    /**
     * Initialize the application
     */
    function init() {
        console.log('🚀 Counter App initializing...');

        // Wait for MiniJS framework to be ready
        if (!window.MiniJS || !window.MiniJS.state) {
            console.error('❌ MiniJS framework not available!');
            return;
        }

        initState();
        setupEventHandlers();
        render();

        console.log('✅ Counter App initialized successfully!');
    }

    /**
     * Initialize state management
     */
    function initState() {
        // Configure state management for counter app
        const stateConfig = {
            initialState: {
                count: 0,
                totalClicks: 0,
                lastAction: null
            },
            storageKey: 'miniJS-counter',
            enablePersistence: true,
            enableLogging: true
        };

        // Initialize state manager
        window.MiniJS.state.init(stateConfig);
        state = window.MiniJS.state;

        // Subscribe to state changes
        state.subscribe(function(newState, prevState, actionType) {
            console.log('State changed:', actionType, newState);
            render();
        });
    }

    /**
     * Set up event handlers
     */
    function setupEventHandlers() {
        const incrementBtn = document.getElementById('increment');
        const decrementBtn = document.getElementById('decrement');
        const resetBtn = document.getElementById('reset');

        incrementBtn.addEventListener('click', increment);
        decrementBtn.addEventListener('click', decrement);
        resetBtn.addEventListener('click', reset);
    }

    /**
     * Increment counter
     */
    function increment() {
        const currentState = state.getState();
        
        state.setState(function(currentState) {
            return {
                ...currentState,
                count: currentState.count + 1,
                totalClicks: currentState.totalClicks + 1,
                lastAction: 'increment'
            };
        }, 'INCREMENT');
    }

    /**
     * Decrement counter
     */
    function decrement() {
        const currentState = state.getState();
        
        state.setState(function(currentState) {
            return {
                ...currentState,
                count: currentState.count - 1,
                totalClicks: currentState.totalClicks + 1,
                lastAction: 'decrement'
            };
        }, 'DECREMENT');
    }

    /**
     * Reset counter
     */
    function reset() {
        state.setState(function(currentState) {
            return {
                ...currentState,
                count: 0,
                lastAction: 'reset'
            };
        }, 'RESET');
    }

    /**
     * Render the UI
     */
    function render() {
        const currentState = state.getState();
        
        // Update counter display
        document.getElementById('counter').textContent = currentState.count;
        
        // Update statistics
        document.getElementById('total-clicks').textContent = currentState.totalClicks;
        document.getElementById('current-value').textContent = currentState.count;
        
        // Disable decrement button if count is 0
        const decrementBtn = document.getElementById('decrement');
        decrementBtn.disabled = currentState.count <= 0;
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);

})();

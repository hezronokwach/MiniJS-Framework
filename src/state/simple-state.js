/**
 * MiniJS Framework - Simple State Module
 * Basic state management for TodoMVC
 */

(function() {
    'use strict';

    // Initial state
    const initialState = {
        todos: {},
        filter: 'all',
        nextId: 1,
        editingId: null
    };

    // Current state
    let state = { ...initialState };

    // Subscribers
    const subscribers = [];

    // State management
    const stateManager = {
        // Initialize state
        init: function() {
            console.log('🔄 State module initialized');
            
            // Load from localStorage if available
            this.loadFromStorage();
            
            // Attach to MiniJS if available
            if (window.MiniJS) {
                window.MiniJS.state = this;
            }
        },
        
        // Get current state or part of state
        getState: function(path = null) {
            if (!path) return { ...state };
            
            const keys = path.split('.');
            let current = state;
            
            for (const key of keys) {
                if (current === null || current === undefined) return undefined;
                current = current[key];
            }
            
            return current;
        },
        
        // Update state
        setState: function(updates, actionType = 'SET_STATE') {
            const prevState = { ...state };
            
            // Apply updates
            if (typeof updates === 'function') {
                state = updates(state);
            } else {
                state = this.deepMerge(state, updates);
            }
            
            // Track last action and added todo ID for UI effects
            this._lastAction = actionType;
            if (actionType === 'ADD_TODO' && updates.todos) {
                const newIds = Object.keys(updates.todos).filter(id => !prevState.todos[id]);
                if (newIds.length > 0) {
                    this._lastAddedId = parseInt(newIds[0]);
                }
            }
            
            // Save to localStorage
            this.saveToStorage();
            
            // Notify subscribers
            this.notifySubscribers(prevState, state, actionType);
            
            return state;
        },
        
        // Subscribe to state changes
        subscribe: function(callback) {
            if (typeof callback !== 'function') {
                throw new Error('subscribe requires a function');
            }
            
            subscribers.push(callback);
            
            // Return unsubscribe function
            return () => {
                const index = subscribers.indexOf(callback);
                if (index > -1) {
                    subscribers.splice(index, 1);
                }
            };
        },
        
        // Notify subscribers of state changes
        notifySubscribers: function(prevState, newState, actionType) {
            subscribers.forEach(subscriber => {
                try {
                    subscriber(newState, prevState, actionType);
                } catch (error) {
                    console.error('Subscriber error:', error);
                }
            });
        },
        
        // Deep merge objects
        deepMerge: function(target, source) {
            const result = { ...target };
            
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                        result[key] = this.deepMerge(result[key] || {}, source[key]);
                    } else {
                        result[key] = source[key];
                    }
                }
            }
            
            return result;
        },
        
        // Save state to localStorage
        saveToStorage: function() {
            try {
                localStorage.setItem('miniJS-todos', JSON.stringify(state));
            } catch (error) {
                console.error('Failed to save state to localStorage:', error);
            }
        },
        
        // Load state from localStorage
        loadFromStorage: function() {
            try {
                const savedState = localStorage.getItem('miniJS-todos');
                if (savedState) {
                    state = JSON.parse(savedState);
                }
            } catch (error) {
                console.error('Failed to load state from localStorage:', error);
            }
        },
        
        // Reset state
        reset: function() {
            state = { ...initialState };
            this.saveToStorage();
            this.notifySubscribers({}, state, 'RESET');
        }
    };

    // Make available globally
    window.MiniJSState = stateManager;

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            stateManager.init();
        });
    } else {
        // DOM is already ready
        setTimeout(function() {
            stateManager.init();
        }, 0);
    }

})();
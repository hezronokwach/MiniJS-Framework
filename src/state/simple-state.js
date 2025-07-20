/**
 * MiniJS Framework - Simple State Module
 * 
 * A lightweight state management system for TodoMVC application that provides:
 * - Centralized state container
 * - Immutable state updates
 * - Subscription system for state changes
 * - Local storage persistence
 * - Deep object merging
 * 
 * @module state/simple-state
 * @version 1.0.0
 * @authors Hezron, Phillip, Stephen and Shisia
 */

(function() {
    'use strict';

    /**
     * Default initial state structure
     * @type {Object}
     * @property {Object} todos - Collection of todo items indexed by ID
     * @property {string} filter - Current filter (all, active, completed)
     * @property {number} nextId - Next available ID for new todos
     * @property {number|null} editingId - ID of todo currently being edited, or null
     */
    const initialState = {
        todos: {},
        filter: 'all',
        nextId: 1,
        editingId: null
    };

    /** @type {Object} Current application state */
    let state = { ...initialState };

    /** @type {Array} Collection of subscriber callbacks */
    const subscribers = [];

    /**
     * Storage key for persisting state
     * @const {string}
     */
    const STORAGE_KEY = 'miniJS-todos';

    /**
     * Checks if localStorage is available
     * @returns {boolean} True if localStorage is available
     */
    function isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * State management object with methods for state operations
     * @namespace
     */
    const stateManager = {
        /**
         * Initializes the state module
         * @returns {Object} The state manager instance for chaining
         */
        init: function() {
            console.log('🔄 State module initialized');
            
            // Load from localStorage if available
            this.loadFromStorage();
            
            // Attach to MiniJS if available
            if (window.MiniJS) {
                window.MiniJS.state = this;
            }
            
            return this;
        },
        
        /**
         * Gets current state or a specific path in the state
         * @param {string|null} path - Dot notation path to specific state value (e.g., 'todos.1.title')
         * @returns {*} The requested state or undefined if path doesn't exist
         */
        getState: function(path = null) {
            // Return a copy of the entire state if no path specified
            if (!path) return { ...state };
            
            // Handle dot notation paths
            const keys = path.split('.');
            let current = state;
            
            // Navigate through the path
            for (const key of keys) {
                if (current === null || current === undefined) return undefined;
                current = current[key];
            }
            
            // Return a copy if object to maintain immutability
            return (typeof current === 'object' && current !== null) ? 
                { ...current } : current;
        },
        
        /**
         * Updates the application state
         * @param {Object|Function} updates - Object to merge with state or function that returns new state
         * @param {string} actionType - Name of the action for debugging and tracking
         * @returns {Object} The new state
         * @throws {Error} If updates is not an object or function
         */
        setState: function(updates, actionType = 'SET_STATE') {
            // Validate input
            if (typeof updates !== 'object' && typeof updates !== 'function') {
                throw new Error('setState requires an object or function');
            }
            
            // Create a copy of the previous state for comparison
            const prevState = { ...state };
            
            // Apply updates based on type
            if (typeof updates === 'function') {
                try {
                    state = updates(state);
                } catch (error) {
                    console.error('Error in state update function:', error);
                    throw error; // Re-throw to allow caller to handle
                }
            } else {
                state = this.deepMerge(state, updates);
            }
            
            // Track metadata for UI effects
            this._lastAction = actionType;
            if (actionType === 'ADD_TODO' && updates.todos) {
                const newIds = Object.keys(updates.todos).filter(id => !prevState.todos[id]);
                if (newIds.length > 0) {
                    this._lastAddedId = parseInt(newIds[0], 10);
                }
            }
            
            // Persist state changes
            this.saveToStorage();
            
            // Notify subscribers of state change
            this.notifySubscribers(prevState, state, actionType);
            
            return state;
        },
        
        /**
         * Subscribes to state changes
         * @param {Function} callback - Function to call when state changes
         * @returns {Function} Unsubscribe function
         * @throws {Error} If callback is not a function
         */
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
        
        /**
         * Notifies all subscribers of state changes
         * @param {Object} prevState - Previous state
         * @param {Object} newState - New state
         * @param {string} actionType - Type of action that caused the change
         * @private
         */
        notifySubscribers: function(prevState, newState, actionType) {
            subscribers.forEach(subscriber => {
                try {
                    subscriber(newState, prevState, actionType);
                } catch (error) {
                    console.error('Subscriber error:', error);
                    // Don't throw here to prevent one bad subscriber from breaking others
                }
            });
        },
        
        /**
         * Deep merges two objects recursively
         * @param {Object} target - Target object
         * @param {Object} source - Source object to merge into target
         * @returns {Object} New merged object
         */
        deepMerge: function(target, source) {
            // Create a new object to avoid modifying the target
            const result = { ...target };
            
            // Handle null or undefined source
            if (source === null || source === undefined) {
                return result;
            }
            
            // Iterate through source properties
            for (const key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    // Recursively merge objects (but not arrays)
                    if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
                        result[key] = this.deepMerge(result[key] || {}, source[key]);
                    } else {
                        // Direct assignment for primitives, arrays, and null
                        result[key] = source[key];
                    }
                }
            }
            
            return result;
        },
        
        /**
         * Saves state to localStorage
         * @returns {boolean} True if save was successful
         */
        saveToStorage: function() {
            if (!isStorageAvailable()) {
                return false;
            }
            
            try {
                // Only save essential state data
                const stateToSave = {
                    todos: state.todos,
                    filter: state.filter,
                    nextId: state.nextId
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
                return true;
            } catch (error) {
                console.error('Failed to save state to localStorage:', error);
                return false;
            }
        },
        
        /**
         * Loads state from localStorage
         * @returns {boolean} True if load was successful
         */
        loadFromStorage: function() {
            if (!isStorageAvailable()) {
                return false;
            }
            
            try {
                const savedState = localStorage.getItem(STORAGE_KEY);
                if (!savedState) return false;
                
                const parsedState = JSON.parse(savedState);
                
                // Validate the loaded state
                if (!parsedState || typeof parsedState !== 'object') {
                    return false;
                }
                
                // Validate todos structure if present
                if (parsedState.todos && typeof parsedState.todos !== 'object') {
                    return false;
                }
                
                // Merge with initial state to ensure all required properties exist
                state = this.deepMerge(initialState, parsedState);
                return true;
            } catch (error) {
                console.error('Failed to load state from localStorage:', error);
                return false;
            }
        },
        
        /**
         * Resets state to initial values
         * @returns {Object} The reset state
         */
        reset: function() {
            state = { ...initialState };
            this.saveToStorage();
            this.notifySubscribers({}, state, 'RESET');
            return state;
        },
        
        /**
         * Gets statistics about the current state
         * @returns {Object} Statistics object
         */
        getStats: function() {
            return {
                todoCount: Object.keys(state.todos || {}).length,
                activeCount: Object.values(state.todos || {}).filter(todo => !todo.completed).length,
                completedCount: Object.values(state.todos || {}).filter(todo => todo.completed).length,
                subscriberCount: subscribers.length,
                currentFilter: state.filter,
                nextId: state.nextId
            };
        }
    };

    // Make available globally with safety check
    if (typeof window !== 'undefined') {
        window.MiniJSState = stateManager;
    }

    // Auto-initialize when DOM is ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                stateManager.init();
            });
        } else {
            // DOM is already ready - initialize on next tick to ensure
            // all dependencies have loaded
            setTimeout(function() {
                stateManager.init();
            }, 0);
        }
    }

})();
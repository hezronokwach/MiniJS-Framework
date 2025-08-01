/**
 * TodoMVC Application using MiniJS Framework
 */

(function() {
    'use strict';

    let state;
    let nextId = 1;

    // Wait for MiniJS framework to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Add keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Reset app (Ctrl+Alt+R)
            if (e.ctrlKey && e.altKey && e.key === 'r') {
                e.preventDefault();
                if (typeof resetApp === 'function') {
                    resetApp();
                    console.log('App reset triggered by keyboard shortcut (Ctrl+Alt+R)');
                }
            }
            
            // Export todos (Ctrl+Alt+E)
            if (e.ctrlKey && e.altKey && e.key === 'e') {
                e.preventDefault();
                if (typeof exportTodos === 'function') {
                    exportTodos();
                    console.log('Todos export triggered by keyboard shortcut (Ctrl+Alt+E)');
                }
            }
            
            // Show help (F1 or ?)
            if (e.key === 'F1' || (e.key === '?' && !e.ctrlKey && !e.altKey && !e.shiftKey)) {
                e.preventDefault();
                if (typeof showHelp === 'function') {
                    showHelp();
                    console.log('Help dialog triggered by keyboard shortcut');
                }
            }

            // Global Escape key handler for editing
            if (e.key === 'Escape') {
                const editingTodo = document.querySelector('.todo-list li.editing');
                if (editingTodo) {
                    e.preventDefault();
                    cancelEditing();
                }
            }
        });

        console.log('📝 TodoMVC App initializing...');
        
        if (typeof MiniJS === 'undefined') {
            console.error('❌ MiniJS Framework not found! Please ensure src/index.js is loaded.');
            return;
        }

        console.log('Framework info:', MiniJS.getInfo());
        
        // Wait for all modules to be ready
        setTimeout(() => {
            initApp();
        }, 100);
    });

    /**
     * Initialize the TodoMVC application
     */
    function initApp() {
        // Check if localStorage is available
        if (typeof isStorageAvailable === 'function') {
            const storageAvailable = isStorageAvailable();
            if (!storageAvailable) {
                console.warn('localStorage is not available, state will not persist');
            }
        }

        // Check if all required modules are loaded
        if (!window.MiniJSDOM || !window.MiniJSEvents || !window.MiniJSState || !window.MiniJS.routing) {
            console.error('❌ Required modules not loaded!');
            return;
        }
        
        console.log('✅ All modules loaded, initializing app...');
        
        // Initialize state
        initState();
        
        // Set up event handlers
        setupEventHandlers();
        
        // Set up routing
        setupRouting();
        
        // Render initial UI
        renderApp();
        
        // Verify TodoMVC structure
        setTimeout(() => {
            if (typeof verifyTodoMVCStructure === 'function') {
                verifyTodoMVCStructure();
            }
        }, 500);
    }

    /**
     * Initialize application state
     */
    function initState() {
        state = window.MiniJSState;

        if (!state) {
            console.error('❌ MiniJSState not available!');
            return;
        }
        
        // Load todos from localStorage
        let todosLoaded = false;
        if (typeof loadTodos === 'function') {
            const savedTodos = loadTodos();
            if (savedTodos && Object.keys(savedTodos).length > 0) {
                const maxId = Math.max(...Object.keys(savedTodos).map(id => parseInt(id)));
                nextId = maxId + 1;
                
                state.setState({
                    todos: savedTodos,
                    nextId: nextId,
                    filter: 'all',
                    editingId: null
                });
                todosLoaded = true;
            }
        }
        
        // Initialize with empty state if no todos were loaded
        if (!todosLoaded) {
            state.setState({
                todos: {},
                nextId: 1,
                filter: 'all',
                editingId: null
            });
            nextId = 1;
        }
        
        // Subscribe to state changes
        state.subscribe(function(newState, prevState, actionType) {
            // For toggle actions, delay the re-render slightly to avoid conflicts
            if (actionType === 'TOGGLE_TODO') {
                setTimeout(() => {
                    renderTodos(newState.todos);
                    updateFooter(newState.todos, newState.filter);
                    updateToggleAll(newState.todos);
                }, 10);
            } else {
                renderTodos(newState.todos);
                updateFooter(newState.todos, newState.filter);
                updateToggleAll(newState.todos);
            }

            // Save to localStorage
            if (typeof saveTodos === 'function') {
                saveTodos(newState.todos);
            }
        });

        console.log('State initialized:', state.getState());
    }

    /**
     * Set up event handlers
     */
    function setupEventHandlers() {
        // New todo input
        const newTodoInput = document.querySelector('.new-todo');
        if (newTodoInput) {
            newTodoInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    const value = this.value.trim();
                    if (value) {
                        addTodo(value);
                        this.value = '';
                    }
                }
            });
        }

        // Toggle all checkbox
        const toggleAllCheckbox = document.querySelector('.toggle-all');
        if (toggleAllCheckbox) {
            toggleAllCheckbox.addEventListener('change', function() {
                toggleAllTodos(this.checked);
            });
        }

        // Clear completed button - use event delegation
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('clear-completed')) {
                e.preventDefault();
                clearCompletedTodos();
            }
        });

        // Filter links
        document.addEventListener('click', function(e) {
            if (e.target.matches('.filters a')) {
                e.preventDefault();
                const href = e.target.getAttribute('href');
                const filter = href.replace('#/', '');
                setFilter(filter);
            }
        });

        // Todo list event delegation
        const todoList = document.querySelector('.todo-list');
        if (todoList) {
            // Handle toggle checkbox changes
            todoList.addEventListener('change', function(e) {
                if (e.target.classList.contains('toggle')) {
                    const li = e.target.closest('li');
                    if (li) {
                        const id = parseInt(li.dataset.id);
                        toggleTodo(id);
                    }
                }
            });

            // Handle destroy button clicks
            todoList.addEventListener('click', function(e) {
                if (e.target.classList.contains('destroy')) {
                    e.preventDefault();
                    const li = e.target.closest('li');
                    if (li) {
                        const id = parseInt(li.dataset.id);
                        deleteTodo(id);
                    }
                }
            });

            // Handle double-click to edit - only on label (text area)
            todoList.addEventListener('dblclick', function(e) {
                if (e.target.tagName === 'LABEL') {
                    const li = e.target.closest('li');
                    if (li) {
                        const id = parseInt(li.dataset.id);
                        startEditing(id);
                    }
                }
            });

            // Handle edit input events
            todoList.addEventListener('keydown', function(e) {
                if (e.target.classList.contains('edit')) {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.target.value.trim();
                        finishEditing(id, value);
                    } else if (e.key === 'Escape') {
                        e.preventDefault();
                        cancelEditing();
                    }
                }
            });

            todoList.addEventListener('blur', function(e) {
                if (e.target.classList.contains('edit')) {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    const value = e.target.value.trim();
                    finishEditing(id, value);
                }
            }, true);
        }
    }

    /**
     * Set up routing
     */
    function setupRouting() {
        if (window.MiniJS && window.MiniJS.routing) {
            const router = window.MiniJS.routing;

            router.registerRoute('all', function() {
                setFilter('all');
            });

            router.registerRoute('active', function() {
                setFilter('active');
            });

            router.registerRoute('completed', function() {
                setFilter('completed');
            });

            // Set initial route based on current hash
            const hash = window.location.hash.slice(2) || 'all';
            setFilter(hash);
        }
    }

    /**
     * Add a new todo
     */
    function addTodo(title) {
        const currentState = state.getState();
        const id = currentState.nextId || nextId;
        
        const newTodo = {
            id: id,
            title: title,
            completed: false,
            createdAt: Date.now()
        };
        
        const newTodos = { ...currentState.todos };
        newTodos[id] = newTodo;
        
        // Use function-based update to avoid deep merge issues
        state.setState(function(currentState) {
            return {
                ...currentState,
                todos: newTodos,
                nextId: id + 1
            };
        }, 'ADD_TODO');
        
        nextId = id + 1;
        console.log('Added todo:', title);
    }

    /**
     * Toggle todo completion status
     */
    function toggleTodo(id) {
        const currentState = state.getState();
        const todo = currentState.todos[id];

        if (todo) {
            const newCompleted = !todo.completed;
            const newTodos = { ...currentState.todos };
            newTodos[id] = {
                ...todo,
                completed: newCompleted,
                completedAt: newCompleted ? Date.now() : null
            };

            // Use function-based update to avoid deep merge issues
            state.setState(function(currentState) {
                return { ...currentState, todos: newTodos };
            }, 'TOGGLE_TODO');

            console.log(`Todo ${newCompleted ? 'completed' : 'marked active'}: ${todo.title}`);
        }
    }

    /**
     * Delete a todo
     */
    function deleteTodo(id) {
        const currentState = state.getState();
        const todo = currentState.todos[id];

        if (todo) {
            const newTodos = { ...currentState.todos };
            delete newTodos[id];

            // Use function-based update to avoid deep merge issues
            state.setState(function(currentState) {
                const result = { ...currentState, todos: newTodos };
                if (currentState.editingId === id) {
                    result.editingId = null;
                }
                return result;
            }, 'DELETE_TODO');

            console.log('Deleted todo:', todo.title);
        }
    }

    /**
     * Start editing a todo
     */
    function startEditing(id) {
        state.setState({
            editingId: id
        }, 'START_EDITING');
        
        setTimeout(() => {
            const editInput = document.querySelector(`li[data-id="${id}"] .edit`);
            if (editInput) {
                editInput.focus();
                editInput.select();
            }
        }, 0);
    }

    /**
     * Finish editing a todo
     */
    function finishEditing(id, newTitle) {
        if (!newTitle) {
            deleteTodo(id);
            return;
        }
        
        const currentState = state.getState();
        const todo = currentState.todos[id];
        
        if (todo && todo.title !== newTitle) {
            const newTodos = { ...currentState.todos };
            newTodos[id] = {
                ...todo,
                title: newTitle
            };
            
            // Use function-based update to avoid deep merge issues
            state.setState(function(currentState) {
                return {
                    ...currentState,
                    todos: newTodos,
                    editingId: null
                };
            }, 'EDIT_TODO');
        } else {
            state.setState({
                editingId: null
            }, 'CANCEL_EDIT');
        }
    }

    /**
     * Cancel editing
     */
    function cancelEditing() {
        state.setState({
            editingId: null
        }, 'CANCEL_EDIT');
    }

    /**
     * Toggle all todos
     */
    function toggleAllTodos(completed) {
        const currentState = state.getState();
        const newTodos = { ...currentState.todos };
        
        Object.keys(newTodos).forEach(id => {
            newTodos[id] = {
                ...newTodos[id],
                completed: completed,
                completedAt: completed ? Date.now() : null
            };
        });
        
        // Use function-based update to avoid deep merge issues
        state.setState(function(currentState) {
            return { ...currentState, todos: newTodos };
        }, 'TOGGLE_ALL');
        
        console.log(`All todos ${completed ? 'completed' : 'marked active'}`);
    }

    /**
     * Clear completed todos
     */
    function clearCompletedTodos() {
        const currentState = state.getState();
        const newTodos = {};
        let removedCount = 0;
        
        Object.keys(currentState.todos).forEach(id => {
            const todo = currentState.todos[id];
            if (!todo.completed) {
                newTodos[id] = todo;
            } else {
                removedCount++;
            }
        });
        
        // Use function-based update to avoid deep merge issues
        state.setState(function(currentState) {
            const result = { ...currentState, todos: newTodos };
            if (currentState.editingId && currentState.todos[currentState.editingId]?.completed) {
                result.editingId = null;
            }
            return result;
        }, 'CLEAR_COMPLETED');
        
        console.log(`Cleared ${removedCount} completed todos`);
    }

    /**
     * Set filter
     */
    function setFilter(filter) {
        const currentState = state.getState();
        
        state.setState({
            filter: filter
        }, 'SET_FILTER');
        
        // Update filter links
        document.querySelectorAll('.filters a').forEach(link => {
            link.classList.remove('selected');
        });
        
        const activeLink = document.querySelector(`.filters a[href="#/${filter}"]`);
        if (activeLink) {
            activeLink.classList.add('selected');
        }
        
        // Update URL without triggering navigation
        if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', `#/${filter}`);
        }
        
        console.log('Filter set to:', filter);
    }

    /**
     * Render the entire app
     */
    function renderApp() {
        const currentState = state.getState();
        renderTodos(currentState.todos);
        updateFooter(currentState.todos, currentState.filter);
        updateToggleAll(currentState.todos);
    }

    /**
     * Render todos list
     */
    function renderTodos(todos) {
        const todoList = document.querySelector('.todo-list');
        if (!todoList) return;

        const currentState = state.getState();
        const filter = currentState.filter || 'all';
        const editingId = currentState.editingId;
        
        // Clear existing todos
        todoList.innerHTML = '';
        
        // Get all todos as array
        const allTodos = Object.values(todos);
        
        // Filter todos based on current filter
        const filteredTodos = allTodos.filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true; // 'all' filter shows everything
        });
        
        // Sort by creation time
        filteredTodos.sort((a, b) => a.createdAt - b.createdAt);
        
        // Create todo elements
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.dataset.id = todo.id;

            // Set classes
            if (todo.completed) {
                li.classList.add('completed');
            }
            if (editingId === todo.id) {
                li.classList.add('editing');
            }

            li.innerHTML = `
                <div class="view">
                    <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                    <label>${escapeHtml(todo.title)}</label>
                    <button class="destroy"></button>
                </div>
                <input class="edit" value="${escapeHtml(todo.title)}">
            `;


            
            todoList.appendChild(li);
        });
        
        // Update main section and footer visibility
        const main = document.querySelector('.main');
        const footer = document.querySelector('.footer');
        const hasItems = allTodos.length > 0;
        
        if (main) {
            main.style.display = hasItems ? 'block' : 'none';
        }
        if (footer) {
            footer.style.display = hasItems ? 'block' : 'none';
        }
        
        console.log(`Rendered ${filteredTodos.length} todos (filter: ${filter})`);
    }

    /**
     * Update footer with count and filters
     */
    function updateFooter(todos, filter) {
        const todoCount = document.querySelector('.todo-count');
        const clearCompleted = document.querySelector('.clear-completed');
        
        const allTodos = Object.values(todos);
        const activeTodos = allTodos.filter(todo => !todo.completed);
        const completedTodos = allTodos.filter(todo => todo.completed);
        
        if (todoCount) {
            const count = activeTodos.length;
            const itemText = count === 1 ? 'item' : 'items';
            todoCount.innerHTML = `<strong>${count}</strong> ${itemText} left`;
        }
        
        if (clearCompleted) {
            if (completedTodos.length > 0) {
                clearCompleted.style.display = 'block';
                clearCompleted.classList.remove('hidden');
            } else {
                clearCompleted.style.display = 'none';
                clearCompleted.classList.add('hidden');
            }
        }
    }

    /**
     * Update toggle all checkbox
     */
    function updateToggleAll(todos) {
        const toggleAll = document.querySelector('.toggle-all');
        if (toggleAll) {
            const allTodos = Object.values(todos);
            const completedTodos = allTodos.filter(todo => todo.completed);
            
            toggleAll.checked = allTodos.length > 0 && completedTodos.length === allTodos.length;
        }
    }

    /**
     * Escape HTML to prevent XSS
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Make functions globally available for other scripts
    window.addTodo = addTodo;
    window.toggleTodo = toggleTodo;
    window.deleteTodo = deleteTodo;
    window.startEditing = startEditing;
    window.finishEditing = finishEditing;
    window.cancelEditing = cancelEditing;
    window.toggleAllTodos = toggleAllTodos;
    window.clearCompletedTodos = clearCompletedTodos;
    window.setFilter = setFilter;

})();

/**
 * TodoMVC Application using MiniJS Framework
 */

(function() {
    'use strict';

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
        const state = window.MiniJSState;
        
        // Try to load todos from localStorage first
        let todosLoaded = false;
        if (typeof loadTodosFromStorage === 'function') {
            const savedTodos = loadTodosFromStorage();
            if (savedTodos && Object.keys(savedTodos).length > 0) {
                // Calculate next ID based on highest existing ID
                const ids = Object.keys(savedTodos).map(id => parseInt(id));
                const nextId = Math.max(...ids) + 1;
                
                state.setState({
                    todos: savedTodos,
                    nextId: nextId,
                    filter: 'all',
                    editingId: null
                });
                todosLoaded = true;
                console.log(`Loaded ${Object.keys(savedTodos).length} todos from localStorage`);
                
                if (typeof showNotification === 'function') {
                    showNotification('Todos loaded from localStorage', 'info');
                }
            }
        }
        
        // If no todos were loaded, initialize with default todos
        if (!todosLoaded && Object.keys(state.getState().todos).length === 0) {
            state.setState({
                todos: {
                    1: { id: 1, title: 'Learn MiniJS Framework', completed: false, createdAt: Date.now() },
                    2: { id: 2, title: 'Build TodoMVC app', completed: false, createdAt: Date.now() + 100 },
                    3: { id: 3, title: 'Master JavaScript', completed: true, createdAt: Date.now() + 200, completedAt: Date.now() + 300 }
                },
                nextId: 4,
                filter: 'all',
                editingId: null
            });
        }
        
        // Subscribe to state changes
        state.subscribe(function(newState, prevState, actionType) {
            // Render todos on any state change
            renderTodos(newState.todos);
            
            // Log state changes for debugging
            if (actionType !== 'SET_STATE') {
                console.log(`State updated: ${actionType}`);
                
                // Save todos to localStorage
                if (typeof saveTodosToStorage === 'function') {
                    saveTodosToStorage(newState.todos);
                }
                
                // Show notifications for certain actions
                if (typeof showNotification === 'function') {
                    switch (actionType) {
                        case 'ADD_TODO':
                            showNotification('Todo added', 'success');
                            break;
                        case 'DELETE_TODO':
                            showNotification('Todo deleted', 'info');
                            break;
                        case 'EDIT_TODO':
                            showNotification('Todo updated', 'success');
                            break;
                        case 'TOGGLE_TODO':
                            showNotification('Todo status changed', 'info');
                            break;
                        case 'CLEAR_COMPLETED':
                            showNotification('Completed todos cleared', 'info');
                            break;
                    }
                }
            }
        });
    }

    /**
     * Set up event handlers for user interactions
     */
    function setupEventHandlers() {
        const events = window.MiniJSEvents;
        const state = window.MiniJSState;
        
        // New todo input
        const newTodoInput = document.querySelector('.new-todo');
        events.onKeydown(newTodoInput, function(e) {
            if (e.key === 'Enter') {
                const value = e.target.value.trim();
                if (value) {
                    addTodo(value);
                    e.target.value = '';
                }
            }
        });
        
        // Also handle input event for better mobile support
        events.onInput(newTodoInput, function(e) {
            if (e.originalEvent.inputType === 'insertLineBreak') {
                const value = e.target.value.trim();
                if (value) {
                    addTodo(value);
                    e.target.value = '';
                }
            }
        });
        
        // Toggle all
        const toggleAll = document.querySelector('.toggle-all');
        events.onChange(toggleAll, function(e) {
            const checked = e.target.checked;
            toggleAllTodos(checked);
        });
        
        // Clear completed
        const clearCompleted = document.querySelector('.clear-completed');
        events.onClick(clearCompleted, function() {
            clearCompletedTodos();
        });
        
        // Todo item events (using event delegation)
        const todoList = document.querySelector('.todo-list');
        
        // Toggle todo
        events.bind(todoList, {
            click: function(e) {
                if (e.target.classList.contains('toggle')) {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    toggleTodo(id);
                }
            }
        });
        
        // Delete todo
        events.bind(todoList, {
            click: function(e) {
                if (e.target.classList.contains('destroy')) {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    deleteTodo(id);
                }
            }
        });
        
        // Edit todo (double click)
        events.bind(todoList, {
            dblclick: function(e) {
                if (e.target.tagName === 'LABEL') {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    startEditing(id);
                    
                    // Prevent double click from selecting text in other elements
                    e.preventDefault();
                }
            }
        });
        
        // Add direct event listeners as backup
        document.addEventListener('dblclick', function(e) {
            if (e.target.tagName === 'LABEL' && e.target.closest('.todo-list')) {
                const li = e.target.closest('li');
                if (li) {
                    const id = parseInt(li.dataset.id);
                    startEditing(id);
                    e.preventDefault();
                }
            }
        });
        
        // Support single click on edit icon
        events.bind(todoList, {
            click: function(e) {
                if (e.target.classList.contains('edit-icon')) {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    startEditing(id);
                }
            }
        });
        
        // Support keyboard activation for label and edit icon
        events.bind(todoList, {
            keydown: function(e) {
                if ((e.target.tagName === 'LABEL' || e.target.classList.contains('edit-icon')) && 
                    (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault(); // Prevent page scroll on space
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    startEditing(id);
                }
            }
        });
        
        // Save edited todo
        events.bind(todoList, {
            keydown: function(e) { // Use keydown for better responsiveness
                if (e.target.classList.contains('edit')) {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    
                    if (e.key === 'Enter') {
                        e.preventDefault(); // Prevent adding a newline
                        finishEditing(id, e.target.value.trim());
                    } else if (e.key === 'Escape') {
                        e.preventDefault(); // Prevent browser back
                        cancelEditing();
                    }
                }
            },
            blur: function(e) {
                if (e.target.classList.contains('edit')) {
                    const li = e.target.closest('li');
                    const id = parseInt(li.dataset.id);
                    
                    // Only save if we're still in editing mode
                    // This prevents conflicts with Escape key
                    const state = window.MiniJSState;
                    if (state.getState().editingId === id) {
                        finishEditing(id, e.target.value.trim());
                    }
                }
            }
        });
    }

    /**
     * Set up routing for filtering todos
     */
    function setupRouting() {
        const router = window.MiniJS.routing;
        
        // Register routes
        router.registerRoute('all', function() {
            setFilter('all');
        });
        
        router.registerRoute('active', function() {
            setFilter('active');
        });
        
        router.registerRoute('completed', function() {
            setFilter('completed');
        });
        
        // Add route change listener
        router.setRouteChangeListener(function(route) {
            console.log(`Route changed to: ${route}`);
        });
        
        // Handle filter links clicks
        const filterLinks = document.querySelectorAll('.filters a');
        filterLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.getAttribute('href').replace('#/', '');
                router.navigateTo(filter);
            });
        });
        
        // Default route
        if (!window.location.hash) {
            router.navigateTo('all');
        } else {
            // Handle initial route from URL
            const initialRoute = window.location.hash.replace('#/', '');
            if (['all', 'active', 'completed'].includes(initialRoute)) {
                setFilter(initialRoute);
            } else {
                router.navigateTo('all');
            }
        }
    }

    /**
     * Set current filter
     * @param {string} filter - Filter name (all, active, completed)
     */
    function setFilter(filter) {
        const state = window.MiniJSState;
        const currentFilter = state.getState().filter;
        
        // Only update if filter changed
        if (filter !== currentFilter) {
            state.setState({ filter: filter }, 'SET_FILTER');
            
            // Update filter UI
            const filters = document.querySelectorAll('.filters a');
            filters.forEach(a => {
                a.classList.remove('selected');
                if (a.getAttribute('href') === '#/' + filter) {
                    a.classList.add('selected');
                }
            });
            
            // Update document title to reflect current filter
            document.title = `TodoMVC - ${filter.charAt(0).toUpperCase() + filter.slice(1)}`;
            
            // Re-render todos with filter
            renderTodos(state.getState().todos);
            
            console.log(`Filter changed to: ${filter}`);
        }
    }

    /**
     * Render the entire application UI
     */
    function renderApp() {
        const state = window.MiniJSState;
        renderTodos(state.getState().todos);
        
        // Focus the new todo input
        setTimeout(() => {
            const newTodoInput = document.querySelector('.new-todo');
            if (newTodoInput) {
                newTodoInput.focus();
            }
        }, 100);
    }

    /**
     * Render todos based on current state and filter
     * @param {Object} todos - Todo items to render
     */
    function renderTodos(todos) {
        const state = window.MiniJSState;
        const filter = state.getState().filter;
        const todoList = document.querySelector('.todo-list');
        
        if (!todoList) return;
        
        // Clear existing todos and empty state message
        todoList.innerHTML = '';
        
        // Filter todos
        const filteredTodos = Object.values(todos).filter(todo => {
            if (filter === 'active') return !todo.completed;
            if (filter === 'completed') return todo.completed;
            return true; // 'all' filter
        });
        
        // Track newly added todos
        const lastAction = state._lastAction || '';
        const lastAddedId = state._lastAddedId || null;
        
        // Create todo elements
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.dataset.id = todo.id;
            
            // Apply appropriate classes
            if (todo.completed) li.classList.add('completed');
            if (state.getState().editingId === todo.id) li.classList.add('editing');
            
            // Highlight newly added todos
            if (lastAction === 'ADD_TODO' && todo.id === lastAddedId) {
                li.classList.add('highlight');
                // Remove highlight after animation completes
                setTimeout(() => {
                    li.classList.remove('highlight');
                }, 1000);
            }
            
            // Show edited indicator if this todo was just edited
            if (lastAction === 'EDIT_TODO' && state._lastEditedId === todo.id) {
                li.classList.add('edited');
                // Remove edited class after animation completes
                setTimeout(() => {
                    li.classList.remove('edited');
                }, 1000);
            }
            
            li.innerHTML = `
                <div class="view">
                    <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''} 
                           aria-label="${todo.completed ? 'Mark as incomplete' : 'Mark as complete'}"
                           onclick="if(typeof toggleTodo === 'function') { toggleTodo(${todo.id}); return false; }">
                    <label title="Double-click to edit" tabindex="0" 
                           ondblclick="this.closest('li').classList.add('editing'); this.closest('li').querySelector('.edit').focus();"
                           data-action="edit">${todo.title}</label>
                    <button class="destroy" title="Delete todo" aria-label="Delete todo"></button>
                    <span class="edit-icon" title="Edit todo" tabindex="0" role="button" 
                          aria-label="Edit todo">${todo.completed ? '' : '✏️'}</span>
                </div>
                <input class="edit" value="${todo.title}" 
                       placeholder="Edit todo and press Enter" 
                       aria-label="Edit todo item"
                       onkeydown="if(event.key === 'Enter') { event.preventDefault(); const id = parseInt(this.closest('li').dataset.id); if(typeof finishEditing === 'function') { finishEditing(id, this.value.trim()); } } else if(event.key === 'Escape') { event.preventDefault(); if(typeof cancelEditing === 'function') { cancelEditing(); } else { this.closest('li').classList.remove('editing'); } }">
            `;
            
            todoList.appendChild(li);
        });
        
        // Update UI visibility
        updateUIVisibility();
    }

    /**
     * Update visibility of UI sections based on todos
     */
    function updateUIVisibility() {
        const state = window.MiniJSState;
        const todos = state.getState().todos;
        const todoCount = Object.keys(todos).length;
        const completedCount = Object.values(todos).filter(todo => todo.completed).length;
        const activeCount = todoCount - completedCount;
        
        // Show/hide main section and footer
        const main = document.querySelector('.main');
        const footer = document.querySelector('.footer');
        
        if (main) main.classList.toggle('hidden', todoCount === 0);
        if (footer) footer.classList.toggle('hidden', todoCount === 0);
        
        // Update todo count
        const todoCountElement = document.querySelector('.todo-count');
        if (todoCountElement) {
            // Check if count changed to add animation
            const currentCount = todoCountElement.querySelector('strong');
            const countChanged = currentCount && parseInt(currentCount.textContent) !== activeCount;
            
            // Update the count
            todoCountElement.innerHTML = `<strong>${activeCount}</strong> item${activeCount !== 1 ? 's' : ''} left`;
            
            // Add animation class if count changed
            if (countChanged) {
                todoCountElement.classList.add('changed');
                setTimeout(() => {
                    todoCountElement.classList.remove('changed');
                }, 500);
            }
        }
        
        // Show/hide clear completed button
        const clearCompletedButton = document.querySelector('.clear-completed');
        if (clearCompletedButton) {
            clearCompletedButton.classList.toggle('hidden', completedCount === 0);
        }
        
        // Update toggle-all checkbox
        const toggleAll = document.querySelector('.toggle-all');
        if (toggleAll) {
            toggleAll.checked = todoCount > 0 && completedCount === todoCount;
        }
        
        // Show welcome message if no todos
        const todoList = document.querySelector('.todo-list');
        if (todoList && todoCount === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-state';
            emptyMessage.innerHTML = `
                <p>Your todo list is empty!</p>
                <p>Add a new todo by typing in the input field above and pressing Enter.</p>
            `;
            todoList.appendChild(emptyMessage);
        }
    }

    /**
     * Add a new todo
     * @param {string} title - Todo title
     * @returns {number|null} - ID of the new todo or null if not added
     */
    function addTodo(title) {
        // Make function available globally
        window.addTodo = addTodo;
        // Validate input
        if (!title || typeof title !== 'string') {
            return null;
        }
        
        const trimmedTitle = title.trim();
        if (trimmedTitle === '') {
            return null;
        }
        
        const state = window.MiniJSState;
        const currentState = state.getState();
        const id = currentState.nextId;
        
        // Create new todo object
        const newTodo = {
            id: id,
            title: trimmedTitle,
            completed: false,
            createdAt: Date.now()
        };
        
        // Add to todos collection
        const newTodos = { ...currentState.todos };
        newTodos[id] = newTodo;
        
        // Update state
        state.setState({
            todos: newTodos,
            nextId: id + 1
        }, 'ADD_TODO');
        
        // Log for debugging
        console.log(`Todo added: "${trimmedTitle}" (ID: ${id})`);
        
        // Scroll to bottom if needed to show new todo
        setTimeout(() => {
            const todoList = document.querySelector('.todo-list');
            if (todoList) {
                todoList.scrollTop = todoList.scrollHeight;
            }
        }, 0);
        
        return id; // Return the ID of the new todo
    }

    /**
     * Toggle todo completion status
     * @param {number} id - Todo ID
     */
    function toggleTodo(id) {
        // Make function available globally
        window.toggleTodo = toggleTodo;
        const state = window.MiniJSState;
        const currentState = state.getState();
        const todo = currentState.todos[id];
        
        if (!todo) return;
        
        const newCompleted = !todo.completed;
        
        const updatedTodo = {
            ...todo,
            completed: newCompleted,
            completedAt: newCompleted ? Date.now() : null
        };
        
        const newTodos = { ...currentState.todos };
        newTodos[id] = updatedTodo;
        
        state.setState({
            todos: newTodos
        }, 'TOGGLE_TODO');
        
        console.log(`Todo ${newCompleted ? 'completed' : 'marked active'}: "${todo.title}" (ID: ${id})`);
    }

    /**
     * Toggle all todos completion status
     * @param {boolean} completed - New completion status
     */
    function toggleAllTodos(completed) {
        const state = window.MiniJSState;
        const currentState = state.getState();
        const newTodos = { ...currentState.todos };
        
        // Count how many we're changing
        let changedCount = 0;
        const timestamp = Date.now();
        
        Object.keys(newTodos).forEach(id => {
            if (newTodos[id].completed !== completed) {
                changedCount++;
                newTodos[id] = {
                    ...newTodos[id],
                    completed: completed,
                    completedAt: completed ? timestamp : null
                };
            }
        });
        
        state.setState({
            todos: newTodos
        }, 'TOGGLE_ALL');
        
        console.log(`Toggled ${changedCount} todo${changedCount !== 1 ? 's' : ''} to ${completed ? 'completed' : 'active'}`);
    }

    /**
     * Delete a todo
     * @param {number} id - Todo ID
     */
    function deleteTodo(id) {
        const state = window.MiniJSState;
        const currentState = state.getState();
        const todo = currentState.todos[id];
        
        if (!todo) return;
        
        const newTodos = { ...currentState.todos };
        delete newTodos[id];
        
        // If we're deleting the todo being edited, clear editing state
        const newState = {
            todos: newTodos
        };
        
        if (currentState.editingId === id) {
            newState.editingId = null;
        }
        
        state.setState(newState, 'DELETE_TODO');
        
        // Add a visual effect for deletion
        const li = document.querySelector(`li[data-id="${id}"]`);
        if (li) {
            li.classList.add('deleting');
            setTimeout(() => {
                li.remove();
            }, 300); // Match this with CSS animation duration
        }
        
        console.log(`Todo deleted: "${todo.title}" (ID: ${id})`);
    }

    /**
     * Clear all completed todos
     */
    function clearCompletedTodos() {
        // Make function available globally
        window.clearCompletedTodos = clearCompletedTodos;
        const state = window.MiniJSState;
        const currentState = state.getState();
        const newTodos = { ...currentState.todos };
        
        // Count how many we're removing for logging
        let removedCount = 0;
        
        // Add visual effect for deletion
        Object.keys(newTodos).forEach(id => {
            if (newTodos[id].completed) {
                const li = document.querySelector(`li[data-id="${id}"]`);
                if (li) {
                    li.classList.add('deleting');
                }
                delete newTodos[id];
                removedCount++;
            }
        });
        
        // If we're deleting the todo being edited, clear editing state
        const newState = {
            todos: newTodos
        };
        
        if (currentState.editingId && !newTodos[currentState.editingId]) {
            newState.editingId = null;
        }
        
        state.setState(newState, 'CLEAR_COMPLETED');
        
        console.log(`Cleared ${removedCount} completed todo${removedCount !== 1 ? 's' : ''}`);
    }

    /**
     * Start editing a todo
     * @param {number} id - Todo ID
     */
    function startEditing(id) {
        const state = window.MiniJSState;
        const currentState = state.getState();
        
        // Don't allow editing completed todos (optional UX choice)
        const todo = currentState.todos[id];
        if (!todo) return;
        
        // If already editing another todo, save it first
        if (currentState.editingId && currentState.editingId !== id) {
            const previousEditInput = document.querySelector(`li[data-id="${currentState.editingId}"] .edit`);
            if (previousEditInput) {
                finishEditing(currentState.editingId, previousEditInput.value.trim());
            }
        }
        
        // Set editing state
        state.setState({
            editingId: id
        }, 'START_EDITING');
        
        // Focus the edit input
        setTimeout(() => {
            const editInput = document.querySelector(`li[data-id="${id}"] .edit`);
            if (editInput) {
                editInput.focus();
                editInput.selectionStart = 0;
                editInput.selectionEnd = editInput.value.length;
                
                // Announce for screen readers
                const announcer = document.getElementById('a11y-announcer') || 
                    document.createElement('div');
                if (!announcer.id) {
                    announcer.id = 'a11y-announcer';
                    announcer.setAttribute('aria-live', 'polite');
                    announcer.className = 'sr-only';
                    document.body.appendChild(announcer);
                }
                announcer.textContent = `Editing todo: ${todo.title}. Press Enter to save or Escape to cancel.`;
            }
        }, 0);
        
        console.log(`Editing todo: "${todo.title}" (ID: ${id})`);
    }

    /**
     * Finish editing a todo
     * @param {number} id - Todo ID
     * @param {string} newTitle - New todo title
     */
    function finishEditing(id, newTitle) {
        // Make function available globally
        window.finishEditing = finishEditing;
        const state = window.MiniJSState;
        const currentState = state.getState();
        
        if (currentState.editingId !== id) return;
        
        const todo = currentState.todos[id];
        if (!todo) return;
        
        const oldTitle = todo.title;
        
        if (newTitle === '') {
            // Delete todo if title is empty
            deleteTodo(id);
            console.log(`Todo deleted (empty title): ID ${id}`);
        } else if (newTitle !== oldTitle) {
            // Only update if title changed
            const newTodos = { ...currentState.todos };
            newTodos[id] = {
                ...todo,
                title: newTitle,
                updatedAt: Date.now() // Track when it was edited
            };
            
            state.setState({
                todos: newTodos,
                editingId: null,
                lastEditedId: id // Track the last edited todo
            }, 'EDIT_TODO');
            
            console.log(`Todo edited: "${oldTitle}" → "${newTitle}" (ID: ${id})`);
            
            // Add a temporary class to show the todo was edited
            setTimeout(() => {
                const li = document.querySelector(`li[data-id="${id}"]`);
                if (li) {
                    li.classList.add('edited');
                    setTimeout(() => {
                        li.classList.remove('edited');
                    }, 1000);
                }
            }, 0);
        } else {
            // No changes, just exit edit mode
            state.setState({
                editingId: null
            });
            
            console.log(`Todo edit cancelled (no changes): ID ${id}`);
        }
        
        // Return focus to the todo item label
        setTimeout(() => {
            const label = document.querySelector(`li[data-id="${id}"] label`);
            if (label) {
                label.focus();
            }
        }, 0);
    }

    /**
     * Cancel editing
     */
    function cancelEditing() {
        // Make function available globally
        window.cancelEditing = cancelEditing;
        const state = window.MiniJSState;
        const currentState = state.getState();
        const editingId = currentState.editingId;
        
        if (!editingId) return;
        
        state.setState({
            editingId: null
        }, 'CANCEL_EDIT');
        
        console.log(`Todo edit cancelled: ID ${editingId}`);
        
        // Return focus to the todo item label
        setTimeout(() => {
            const label = document.querySelector(`li[data-id="${editingId}"] label`);
            if (label) {
                label.focus();
            }
        }, 0);
    }

})();

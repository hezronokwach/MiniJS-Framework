# MiniJS Framework Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Core Concepts](#core-concepts)
   - [DOM Module](#dom-module)
   - [State Management](#state-management)
   - [Event System](#event-system)
   - [Routing](#routing)
4. [TodoMVC Example](#todomvc-example)
5. [API Reference](#api-reference)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Introduction

MiniJS is a lightweight JavaScript framework for building modern web applications with minimal overhead. It provides essential features like DOM manipulation, state management, and routing in a simple, intuitive API.

**Key Features:**
- Lightweight (~5KB gzipped)
- No external dependencies
- Reactive state management
- Component-based architecture
- Hash-based routing
- Virtual DOM for efficient updates

## Getting Started

### Installation
```html
<script src="path/to/minijs/index.js"></script>
<!-- load the the other framework modules -->
```

### Hello World
```javascript
// Import the framework
import { createElement, render } from 'minijs';

// Create a component
function Greeting({ name }) {
  return createElement('h1', {}, `Hello, ${name}!`);
}

// Render the component
const root = document.getElementById('app');
render(createElement(Greeting, { name: 'World' }), root);
```

## Core Concepts

### DOM Module

The DOM Module provides a virtual DOM abstraction that simplifies element creation, manipulation, and rendering.

#### Element Creation
```javascript
// Basic element with attributes
const element = MiniJSDOM.createElement('div', { 
  class: 'container', 
  id: 'main' 
}, 'Hello World');

// Element with children
const list = MiniJSDOM.createElement('ul', {},
  ['Item 1', 'Item 2', 'Item 3'].map(text => 
    MiniJSDOM.createElement('li', {}, text)
  )
);
```

#### Component Creation
```javascript
const Button = (props) => MiniJSDOM.createElement('button', props, props.text || 'Button');
const myButton = MiniJSDOM.createComponent(Button, { class: 'primary', text: 'Submit' });
```

> **📖 Complete Documentation**: For a comprehensive guide to all DOM module features including advanced element manipulation, styling, and traversal methods, see the [DOM Module Complete Documentation](./docs/DOM_MODULE_COMPLETE.md).


### State Management

The State Management module provides a centralized store with reactive updates and persistence.

#### Initialization
```javascript
// Initialize state
MiniJSState.init();

// Set initial state
MiniJSState.setState({
  todos: [],
  filter: 'all',
  nextId: 1
});
```

#### State Access and Updates
```javascript
// Get state
const state = MiniJSState.getState();

// Update state
MiniJSState.setState({
  todos: [...state.todos, { id: state.nextId, text: 'New Todo', completed: false }],
  nextId: state.nextId + 1
}, 'ADD_TODO');

// Subscribe to changes
MiniJSState.subscribe((state) => {
  console.log('State updated:', state);
});
```

> **📖 Complete Documentation**: For a comprehensive guide to all state management features including advanced state manipulation, persistence, and debugging methods, see the [State Management Complete Documentation](./docs/STATE_MODULE_COMPLETE.md).

### Event System

#### Module Initialization

##### `init()`
Initializes the events module.

```javascript
MiniJSEvents.init();
```

#### Event Handling
```javascript
// Inline event handler
const button = MiniJSDOM.createElement('button', {
  class: 'btn',
  onclick: (e) => {
    e.preventDefault();
    console.log('Button clicked');
  }
}, 'Click me');

// Event delegation
const list = MiniJSDOM.createElement('ul', {
  onclick: (e) => {
    if (e.target.matches('li')) {
      console.log('Item clicked:', e.target.textContent);
    }
  }
}, 
  ['Item 1', 'Item 2'].map(text => 
    MiniJSDOM.createElement('li', {}, text)
  )
);
```

> **📖 Complete Documentation**: For a comprehensive guide to all event system features including advanced event handling, delegation, and integration with other modules, see the [Event System Complete Documentation](./docs/EVENTS_MODULE_COMPLETE.md).

### Routing

The Routing module provides hash-based client-side routing.

#### Basic Setup
```javascript
// Initialize router
const router = MiniJSRouter.init();

// Define routes
router.registerRoute('', () => {
  MiniJSState.setState({ filter: 'all' });
});

router.registerRoute('active', () => {
  MiniJSState.setState({ filter: 'active' });
});

router.registerRoute('completed', () => {
  MiniJSState.setState({ filter: 'completed' });
});

// Start the router
router.start();

// Navigate programmatically
router.navigateTo('active');
```

> **📖 Complete Documentation**: For a comprehensive guide to all routing features including advanced routing, integration with other modules, and best practices, see the [Routing Complete Documentation](./docs/ROUTING_MODULE_COMPLETE.md).

## TodoMVC Example

Let's explore how the TodoMVC application is implemented using the MiniJS Framework. This example demonstrates a complete, production-ready todo application with state management, routing, and DOM manipulation.

### 1. Application Structure

The TodoMVC app follows a traditional structure with these key components:
- `app.js`: Main application logic and initialization
- `index.html`: HTML structure and framework imports
- `style.css`: Application styles (TodoMVC CSS)
- `storage.js`: Handles localStorage persistence

### 2. Initialization

The application initializes when the DOM is fully loaded:

```javascript
// Wait for MiniJS framework to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Check if all required modules are loaded
    if (!window.MiniJSDOM || !window.MiniJSEvents || !window.MiniJSState || !window.MiniJS.routing) {
        console.error('❌ Required modules not loaded!');
        return;
    }
    
    // Initialize application
    initState();
    setupEventHandlers();
    setupRouting();
    renderApp();
});
```

### 3. State Management

The application uses MiniJSState for state management with the following structure:

```javascript
{
    todos: {
        // Using object for O(1) lookups by ID
        '1': { id: 1, text: 'Learn MiniJS', completed: false },
        '2': { id: 2, text: 'Build TodoMVC', completed: true }
    },
    nextId: 3,      // Next available todo ID
    filter: 'all',  // Current filter: 'all', 'active', or 'completed'
    editingId: null // ID of todo being edited (if any)
}
```

State is initialized with data from localStorage if available:

```javascript
function initState() {
    state = window.MiniJSState;
    
    // Load todos from localStorage
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
            return;
        }
    }
    
    // Initialize with empty state
    state.setState({
        todos: {},
        nextId: 1,
        filter: 'all',
        editingId: null
    });
}
```

### 4. Event Handling

Event handlers are set up for user interactions:

```javascript
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
    
    // Clear completed button (using event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('clear-completed')) {
            e.preventDefault();
            clearCompletedTodos();
        }
    });
}
```

### 5. Routing

Client-side routing is implemented using the MiniJS routing module:

```javascript
function setupRouting() {
    const router = window.MiniJS.routing;
    
    // Define routes
    router.registerRoute('', function() {
        state.setState({ filter: 'all' });
    });
    
    router.registerRoute('active', function() {
        state.setState({ filter: 'active' });
    });
    
    router.registerRoute('completed', function() {
        state.setState({ filter: 'completed' });
    });
    
    // Start the router
    router.start();
}
```

### 6. Rendering

The application uses direct DOM manipulation for rendering, with separate functions for different parts of the UI:

```javascript
function renderApp() {
    const currentState = state.getState();
    renderTodos(currentState.todos);
    updateFooter(currentState.todos, currentState.filter);
    updateToggleAll(currentState.todos);
}

function renderTodos(todos) {
    const todoList = document.querySelector('.todo-list');
    if (!todoList) return;
    
    const filter = state.getState().filter;
    const editingId = state.getState().editingId;
    
    // Filter todos based on current filter
    const filteredTodos = Object.values(todos).filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });
    
    // Generate HTML for todos
    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="${todo.completed ? 'completed' : ''} ${editingId === todo.id ? 'editing' : ''}" data-id="${todo.id}">
            <div class="view">
                <input class="toggle" type="checkbox" ${todo.completed ? 'checked' : ''}>
                <label>${escapeHtml(todo.text)}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${escapeHtml(todo.text)}">
        </li>
    `).join('');
}
```

### 7. State Updates

State updates are handled through action functions that update the state and trigger re-renders:

```javascript
function addTodo(text) {
    const currentState = state.getState();
    const id = currentState.nextId;
    
    state.setState({
        todos: {
            ...currentState.todos,
            [id]: { id, text, completed: false }
        },
        nextId: id + 1
    }, 'ADD_TODO');
}

function toggleTodo(id) {
    const currentState = state.getState();
    const todo = currentState.todos[id];
    if (!todo) return;
    
    state.setState({
        todos: {
            ...currentState.todos,
            [id]: { ...todo, completed: !todo.completed }
        }
    }, 'TOGGLE_TODO');
}
```

### 8. State Persistence

The application persists todos to localStorage:

```javascript
// Save todos to localStorage
function saveTodos(todos) {
    if (typeof Storage === 'undefined') return;
    
    try {
        localStorage.setItem('todos', JSON.stringify(todos));
    } catch (e) {
        console.error('Failed to save todos:', e);
    }
}

// Load todos from localStorage
function loadTodos() {
    if (typeof Storage === 'undefined') return null;
    
    try {
        const todos = localStorage.getItem('todos');
        return todos ? JSON.parse(todos) : null;
    } catch (e) {
        console.error('Failed to load todos:', e);
        return null;
    }
}
```

### 9. Keyboard Shortcuts

The application includes several keyboard shortcuts for better UX:

- **Ctrl+Alt+R**: Reset the application
- **Ctrl+Alt+E**: Export todos
- **F1** or **?**: Show help dialog
- **Escape**: Cancel editing mode

### 10. Styling

The application uses the standard TodoMVC CSS for consistent styling:

```html
<link rel="stylesheet" href="node_modules/todomvc-app-css/index.css">
```

This implementation demonstrates how to build a complete, production-ready application with the MiniJS Framework, including state management, routing, and DOM manipulation.

## API Reference

### Core API

#### `createElement(type, props, ...children)`
Creates a virtual DOM element.
- `type`: String (HTML tag name) or Function (component)
- `props`: Object containing element attributes and event handlers
- `children`: Child elements or text content

#### `render(element, container)`
Renders a virtual DOM element into the DOM.
- `element`: Virtual DOM element to render
- `container`: DOM element to render into

### State Management

#### `createStore(initialState)`
Creates a new state store.
- `initialState`: Initial state object

#### Store Methods
- `getState()`: Returns the current state
- `setState(updates)`: Updates the state
- `subscribe(callback)`: Subscribes to state changes
- `dispatch(action, payload)`: Dispatches an action

### Routing

#### `Router(routes)`
Creates a new router instance.
- `routes`: Object mapping paths to handler functions

#### Router Methods
- `start()`: Starts the router
- `navigate(path)`: Navigates to the specified path
- `back()`: Navigates back in history
- `forward()`: Navigates forward in history

## Best Practices

### Component Design
1. **Keep Components Small and Focused**
   - Each component should do one thing well
   - Split large components into smaller, reusable ones

2. **Props and State**
   - Use props for configuration
   - Use state for component-specific data that changes over time
   - Lift state up when multiple components need the same data

3. **Performance Optimization**
   - Use keys for lists to help with efficient updates
   - Avoid inline function definitions in render for better performance
   - Use `shouldComponentUpdate` or `React.memo` equivalent for complex components

### State Management
1. **Single Source of Truth**
   - Keep your state in a single store when possible
   - Derive data from the state rather than duplicating it

2. **Immutable Updates**
   - Always return new state objects instead of mutating existing ones
   - Use the spread operator or object.assign for updates

3. **Action Design**
   - Use descriptive action types
   - Keep actions simple and focused
   - Use action creators for complex actions

### Event Handling
1. **Naming Conventions**
   - Use `onEvent` naming for props that handle events
   - Keep event handlers focused and simple

2. **Event Delegation**
   - Use event delegation for lists and dynamic content
   - Attach event handlers to parent elements when possible

### Routing
1. **Route Organization**
   - Keep route definitions in a single location
   - Use route parameters for dynamic segments
   - Protect sensitive routes with authentication checks

2. **Navigation**
   - Use the router's navigation methods instead of direct URL manipulation
   - Provide loading states for route transitions

## Troubleshooting

### Common Issues

#### Components Not Updating
- Check if you're mutating state directly (always return new state objects)
- Verify that state updates are happening through `setState`
- Ensure you're not accidentally creating new objects/arrays in render

#### Event Handlers Not Working
- Check that event names are in camelCase (e.g., `onClick` not `onclick`)
- Verify that the component is properly mounted
- Check for event propagation issues (use `e.stopPropagation()` if needed)

#### Routing Issues
- Make sure routes are properly registered
- Check for leading/trailing slashes in route paths
- Verify that the router is started with `router.start()`

## Conclusion

MiniJS provides a lightweight yet powerful foundation for building modern web applications. By following the patterns and best practices outlined in this documentation, you can create maintainable and performant applications with ease.

For more examples and advanced usage patterns, check out the examples directory in the project repository.

## License

MIT © PoSSH Framework Team

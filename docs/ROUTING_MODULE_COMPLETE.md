# MiniJS Framework - Routing Module

## Overview
The Routing Module provides a hash-based routing system for single-page applications. It synchronizes application state with URL changes, enabling navigation between views without page reloads.

## Core Concepts

### Hash-Based Routing
The module uses URL hash fragments (e.g., `#/active`) to represent different application states or views.

### Route Registration
Routes are registered with handler functions that are called when the route is activated.

### Browser Integration
The module integrates with browser history, enabling back/forward navigation.

### State Synchronization
Routes can be synchronized with application state, ensuring UI updates when routes change.

## API Reference

### Route Registration

#### `registerRoute(path, handler)`
Registers a route and its handler function.

```javascript
// Register a route
MiniJS.routing.registerRoute('active', function(route) {
  console.log('Active route activated');
  showActiveTodos();
});

// Register multiple routes
MiniJS.routing.registerRoute('all', showAllTodos);
MiniJS.routing.registerRoute('completed', showCompletedTodos);
```

### Navigation

#### `navigateTo(path)`
Navigates to a specific route.

```javascript
// Navigate to a route
MiniJS.routing.navigateTo('active');

// With user interaction
document.querySelector('.filter-active').addEventListener('click', function(e) {
  e.preventDefault();
  MiniJS.routing.navigateTo('active');
});
```

#### `back()`
Navigates back in browser history.

```javascript
MiniJS.routing.back();
```

#### `forward()`
Navigates forward in browser history.

```javascript
MiniJS.routing.forward();
```

### Route Information

#### `getCurrentRoute()`
Gets the current active route.

```javascript
const currentRoute = MiniJS.routing.getCurrentRoute();
console.log('Current route:', currentRoute);
```

### Event Handling

#### `setRouteChangeListener(fn)`
Sets a callback to be called on any route change.

```javascript
MiniJS.routing.setRouteChangeListener(function(route) {
  console.log('Route changed to:', route);
  updateUI(route);
});
```

## How It Works

1. **Hash Monitoring**: The module listens for changes to the URL hash using the `hashchange` event.

2. **Route Matching**: When the hash changes, the module matches it against registered routes.

3. **Handler Execution**: If a matching route is found, its handler function is called.

4. **Notification**: The route change listener is notified of the change.

5. **Browser History**: The module integrates with browser history, enabling back/forward navigation.

## TodoMVC Routing Example

```javascript
// Initialize the application
function initApp() {
  // Register routes
  MiniJS.routing.registerRoute('all', function() {
    setFilter('all');
  });
  
  MiniJS.routing.registerRoute('active', function() {
    setFilter('active');
  });
  
  MiniJS.routing.registerRoute('completed', function() {
    setFilter('completed');
  });
  
  // Set route change listener
  MiniJS.routing.setRouteChangeListener(function(route) {
    console.log('Route changed to:', route);
    
    // Update filter links
    const links = document.querySelectorAll('.filters a');
    links.forEach(link => {
      link.classList.remove('selected');
      if (link.getAttribute('href') === '#/' + route) {
        link.classList.add('selected');
      }
    });
  });
  
  // Default route
  if (!window.location.hash) {
    MiniJS.routing.navigateTo('all');
  }
}

// Set filter and update UI
function setFilter(filter) {
  // Update state
  MiniJSState.setState({ filter: filter });
  
  // Re-render todos with filter
  renderTodos();
}

// Handle filter link clicks
function setupFilterLinks() {
  const links = document.querySelectorAll('.filters a');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const filter = this.getAttribute('href').replace('#/', '');
      MiniJS.routing.navigateTo(filter);
    });
  });
}
```

## URL Structure

The routing module uses hash-based URLs with the following structure:

```
http://example.com/index.html#/route
```

For TodoMVC, the routes are:

- `#/all` - Show all todos
- `#/active` - Show active (uncompleted) todos
- `#/completed` - Show completed todos

## Integration with State Management

The routing module can be integrated with the state management module to synchronize routes with application state:

```javascript
// Set up routing
function setupRouting() {
  // Register routes
  MiniJS.routing.registerRoute('all', () => setFilter('all'));
  MiniJS.routing.registerRoute('active', () => setFilter('active'));
  MiniJS.routing.registerRoute('completed', () => setFilter('completed'));
  
  // Listen for state changes
  MiniJSState.subscribe(function(newState) {
    // Update route if filter changes
    if (MiniJS.routing.getCurrentRoute() !== newState.filter) {
      MiniJS.routing.navigateTo(newState.filter);
    }
  });
  
  // Set default route
  if (!window.location.hash) {
    MiniJS.routing.navigateTo('all');
  }
}

// Update filter in state
function setFilter(filter) {
  MiniJSState.setState({ filter: filter });
}
```

## Best Practices

1. **Use Descriptive Routes**: Choose route names that clearly describe the view or state.

2. **Handle Initial Route**: Always check and handle the initial route on page load.

3. **Provide Fallback Route**: Define a default route for when no hash is present.

4. **Synchronize with State**: Keep routes synchronized with application state.

5. **Use Route Parameters**: For dynamic routes, extract parameters from the route path.

## Browser Compatibility

The hash-based routing approach works in all modern browsers and doesn't require server configuration. However, it has some limitations:

- Hash fragments are not sent to the server
- Search engines may not index hash-based routes properly
- URLs are less clean than HTML5 History API routes

For most single-page applications like TodoMVC, these limitations are acceptable.
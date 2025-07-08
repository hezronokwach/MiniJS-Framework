# MiniJS Framework - Routing Module

## Overview

The MiniJS Routing module provides a simple, hash-based routing system for single-page applications (SPAs). It synchronizes application state with URL changes, enabling navigation between different views (such as TodoMVC filters: All, Active, Completed) without reloading the page. The router supports programmatic navigation, browser back/forward, and integration with state management.

---

## Importing and Setup

### 1. **Script Import (Browser)**
Make sure to include the routing module after the MiniJS core in your HTML:

```html
<script src="src/index.js"></script>
<script src="src/routing/router.js"></script>
```

> **Note:** If you use the main framework entry point (`src/index.js`), and the router is loaded after, `MiniJS.routing` will be available globally.

### 2. **Module Import (Node/CommonJS)**
If using a bundler or Node.js:

```js
const MiniJS = require('./src/index.js');
const Router = require('./src/routing/router.js');
MiniJS.routing = Router;
```

---

## API Reference

### Registering Routes
```js
MiniJS.routing.registerRoute(path, handler)
```
- **path**: (string) The route name (e.g., 'all', 'active', 'completed')
- **handler**: (function) Called when the route is activated

### Navigating
```js
MiniJS.routing.navigateTo(path)
```
- Programmatically navigate to a route (updates the URL hash and triggers the handler)

### Browser History
```js
MiniJS.routing.back()
MiniJS.routing.forward()
```
- Navigate back/forward in browser history

### Route Change Listener
```js
MiniJS.routing.setRouteChangeListener(fn)
```
- Set a callback to be called on any route change (for integration with state/UI updates)

### Get Current Route
```js
MiniJS.routing.getCurrentRoute()
```
- Returns the current active route (string)

---

## Usage Example

```js
// Register routes
MiniJS.routing.registerRoute('all', function(route) {
  // Show all items
  console.log('All route activated:', route);
});
MiniJS.routing.registerRoute('active', function(route) {
  // Show active items
  console.log('Active route activated:', route);
});
MiniJS.routing.registerRoute('completed', function(route) {
  // Show completed items
  console.log('Completed route activated:', route);
});

// Navigate programmatically
MiniJS.routing.navigateTo('active'); // URL becomes #active

// Listen for route changes (integration with state/UI)
MiniJS.routing.setRouteChangeListener(function(route) {
  // Update UI or state based on route
  console.log('Route changed to:', route);
});

// Use browser navigation
MiniJS.routing.back();    // Go back in history
MiniJS.routing.forward(); // Go forward in history
```

---

## Integration with State Management

- Use `setRouteChangeListener` to update application state or UI when the route changes.
- The router supports browser back/forward buttons and updates the view accordingly.
- The correct route handler is called on page load based on the URL hash.

---

## Usage in TodoMVC Example

In the TodoMVC example (`examples/todomvc/app.js`), the routing module is used to filter todos based on the current route:

```js
// Register filter routes
MiniJS.routing.registerRoute('all', function() {
  renderTodos('all');
});
MiniJS.routing.registerRoute('active', function() {
  renderTodos('active');
});
MiniJS.routing.registerRoute('completed', function() {
  renderTodos('completed');
});

// Listen for route changes to update the filter state
MiniJS.routing.setRouteChangeListener(function(route) {
  updateFilterUI(route); // Highlight the correct filter button
});

// On page load, the correct filter is shown based on the URL hash
// Navigating between filters updates the URL and the visible todos
```

**Key Points:**
- Clicking filter buttons calls `MiniJS.routing.navigateTo('all'|'active'|'completed')`.
- The URL hash changes (e.g., `#/active`), and the corresponding handler updates the visible todos.
- Browser back/forward works as expected, updating the filter and the UI.
- The filter state is always in sync with the URL.

---

## Acceptance Criteria
- URL changes when navigating (e.g., clicking All/Active/Completed in TodoMVC)
- Browser back/forward works correctly
- Page loads with the correct filter/view based on the URL
- State/UI updates when the route changes

---

## Troubleshooting
- Ensure the router script is loaded after the MiniJS core.
- If `MiniJS.routing` is undefined, check the script order in your HTML.
- For async UI updates, use `setTimeout` or Promises to wait for route changes if needed.

---

## License
MIT License - see LICENSE file for details. 
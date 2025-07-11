# MiniJS Framework Documentation

## Overview

MiniJS is a lightweight, custom JavaScript framework built from scratch with no external dependencies. It provides core features needed for modern web applications including DOM abstraction, state management, event handling, and routing.

## Features

- **DOM Abstraction Layer**: Simplified DOM manipulation through JavaScript objects
- **State Management**: Global state store with reactive updates
- **Event Handling**: Custom event system different from native addEventListener
- **Routing System**: Hash-based routing for single-page applications
- **No Dependencies**: Pure JavaScript implementation

## Quick Start

### 1. Include the Framework

```html
<script src="src/index.js"></script>
```

### 2. Basic Usage

```javascript
// Framework will auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (MiniJS.isReady()) {
        console.log('Framework is ready!');
        // Your app code here
    }
});
```

## API Reference

### Core Framework

#### MiniJS.init()
Initializes the framework and all its modules.

#### MiniJS.isReady()
Returns `true` if all framework modules are loaded and ready.

#### MiniJS.getInfo()
Returns framework information including version and module status.

## Framework Modules

### DOM Abstraction (Coming Soon)
- Element creation and manipulation
- Attribute management
- Element nesting and hierarchy
- Text content management

### Event Handling (Coming Soon)
- Custom event binding
- Event delegation
- Event cleanup and unbinding
- Integration with state management

### State Management (Coming Soon)
- Global state store
- State subscriptions
- Reactive updates
- Local storage persistence

### Routing
- Hash-based routing for single-page applications
- Route registration and matching
- Navigation functions (navigateTo, back, forward)
- Route change event handling
- Integration with state management
- Browser history support

#### Overview
The MiniJS Routing module provides a simple, hash-based routing system for single-page applications. It synchronizes application state with URL changes, enabling navigation between views (e.g., TodoMVC filters: All, Active, Completed) without page reloads.

#### API
- `MiniJS.routing.registerRoute(path, handler)`
  - Register a route and its handler function. The handler is called when the route is activated.
- `MiniJS.routing.navigateTo(path)`
  - Programmatically navigate to a route (updates the URL hash and triggers the handler).
- `MiniJS.routing.back()`
  - Navigate back in browser history.
- `MiniJS.routing.forward()`
  - Navigate forward in browser history.
- `MiniJS.routing.setRouteChangeListener(fn)`
  - Set a callback to be called on any route change (for integration with state/UI updates).
- `MiniJS.routing.getCurrentRoute()`
  - Get the current active route (string).

#### Usage Example
```js
// Register routes
MiniJS.routing.registerRoute('all', function(route) {
  // Show all items
});
MiniJS.routing.registerRoute('active', function(route) {
  // Show active items
});
MiniJS.routing.registerRoute('completed', function(route) {
  // Show completed items
});

// Navigate programmatically
MiniJS.routing.navigateTo('active'); // URL becomes #active

// Listen for route changes (integration with state/UI)
MiniJS.routing.setRouteChangeListener(function(route) {
  // Update UI or state based on route
});
```

#### Integration
- **State Management:** Use `setRouteChangeListener` to update application state or UI when the route changes.
- **Browser Navigation:** The router supports browser back/forward buttons and updates the view accordingly.
- **Initial Load:** The correct route handler is called on page load based on the URL hash.

#### Acceptance Criteria
- URL changes when navigating (e.g., clicking All/Active/Completed in TodoMVC)
- Browser back/forward works correctly
- Page loads with the correct filter/view based on the URL
- State/UI updates when the route changes

## Examples

### TodoMVC Application
A complete TodoMVC implementation is available in the `examples/todomvc/` directory, demonstrating all framework features.

```bash
# Start development server
npm start

# Visit TodoMVC example
http://localhost:8080/examples/todomvc/
```

## Development

### Project Structure
```
MiniJS-Framework/
├── src/                    # Framework source code
│   ├── core/              # Core framework modules
│   ├── dom/               # DOM abstraction layer
│   ├── events/            # Event handling system
│   ├── state/             # State management
│   ├── routing/           # Routing system
│   └── index.js           # Main framework entry point
├── docs/                  # Documentation
├── examples/              # Example applications
│   └── todomvc/           # TodoMVC implementation
├── tests/                 # Test files
└── index.html            # Development test page
```

### Development Server
```bash
# Start local development server
npm start
# or
python3 -m http.server 8080
```

### Testing
```bash
# Run tests (when implemented)
npm test
```

## Browser Support

- Modern browsers (ES5+)
- Chrome, Firefox, Safari, Edge
- No Internet Explorer support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.



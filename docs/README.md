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

### Routing (Coming Soon)
- Hash-based routing
- Route registration and matching
- Navigation functions
- Browser history support

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

## Roadmap

### Phase 1: Core Framework (Current)
- [x] Project structure setup
- [ ] DOM abstraction layer
- [ ] Event handling system
- [ ] State management
- [ ] Basic routing

### Phase 2: TodoMVC Implementation
- [ ] Complete TodoMVC application
- [ ] All required functionality
- [ ] Routing integration
- [ ] Local storage persistence

### Phase 3: Documentation & Polish
- [ ] Complete API documentation
- [ ] Code examples and tutorials
- [ ] Performance optimizations
- [ ] Code quality improvements

---

*This documentation will be updated as framework modules are implemented.*

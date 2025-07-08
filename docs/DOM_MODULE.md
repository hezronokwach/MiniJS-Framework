# MiniJS Framework - DOM Module

## Overview
The DOM Module provides a simple abstraction layer over the native DOM API, making it easier to create and manipulate elements programmatically.

## Core Concepts

### Virtual Elements
The framework works with virtual elements - JavaScript objects that represent DOM elements:

```javascript
{
  tag: 'div',
  attrs: { class: 'container', id: 'main' },
  children: ['Hello World'],
  _isVirtualElement: true
}
```

## API Reference

### Element Creation

#### `createElement(tag, attributes, children)`
Creates a virtual DOM element.

```javascript
// Simple element
const div = MiniJSDOMElement.createElement('div', { class: 'container' }, 'Hello World');

// Element with children
const button = MiniJSDOMElement.createElement('button', {
  onclick: () => alert('Clicked!')
}, 'Click Me');

const container = MiniJSDOMElement.createElement('div', { class: 'app' }, [
  MiniJSDOMElement.createElement('h1', {}, 'My App'),
  button
]);
```

#### `createTextNode(text)`
Creates a virtual text node.

```javascript
const textNode = MiniJSDOMElement.createTextNode('Hello World');
```

### Attribute Management

```javascript
// Set attributes
MiniJSDOMAttributes.setAttribute(element, 'id', 'main');
MiniJSDOMAttributes.setAttribute(element, 'data-value', '123');

// Get attributes
const id = MiniJSDOMAttributes.getAttribute(element, 'id');

// CSS classes
MiniJSDOMAttributes.addClass(element, 'active');
MiniJSDOMAttributes.removeClass(element, 'inactive');
MiniJSDOMAttributes.toggleClass(element, 'visible');

// Check if has class
if (MiniJSDOMAttributes.hasClass(element, 'active')) {
  // Element has active class
}
```

### DOM Manipulation

```javascript
// Add children
MiniJSDOMManipulation.appendChild(parent, child);

// Remove children
MiniJSDOMManipulation.removeChild(parent, child);

// Insert elements
MiniJSDOMManipulation.insertBefore(parent, newChild, referenceChild);

// Get children info
const children = MiniJSDOMManipulation.getChildren(element);
const childCount = MiniJSDOMManipulation.getChildCount(element);
const firstChild = MiniJSDOMManipulation.getFirstChild(element);
```

### Rendering

```javascript
// Render virtual element to actual DOM
const virtualElement = MiniJSDOMElement.createElement('div', {}, 'Hello');
MiniJSDOMRender.render(virtualElement, document.getElementById('container'));
```

## Complete Example

```javascript
// Create a simple todo item
function createTodoItem(text) {
  // Create checkbox
  const checkbox = MiniJSDOMElement.createElement('input', {
    type: 'checkbox',
    onchange: (e) => {
      if (e.target.checked) {
        MiniJSDOMAttributes.addClass(todoItem, 'completed');
      } else {
        MiniJSDOMAttributes.removeClass(todoItem, 'completed');
      }
    }
  });

  // Create text span
  const textSpan = MiniJSDOMElement.createElement('span', {}, text);

  // Create delete button
  const deleteBtn = MiniJSDOMElement.createElement('button', {
    onclick: () => {
      // Remove from parent
      const parent = todoItem.parent; // You'd track this
      MiniJSDOMManipulation.removeChild(parent, todoItem);
      // Re-render parent
      MiniJSDOMRender.render(parent, document.getElementById('todo-list'));
    }
  }, 'Delete');

  // Create todo item container
  const todoItem = MiniJSDOMElement.createElement('li', { class: 'todo-item' }, [
    checkbox,
    textSpan,
    deleteBtn
  ]);

  return todoItem;
}

// Usage
const todo = createTodoItem('Buy groceries');
MiniJSDOMRender.render(todo, document.getElementById('todo-container'));
```

## How It Works

1. **Create** virtual elements using `createElement`
2. **Manipulate** them using attribute and manipulation functions
3. **Render** them to the actual DOM using `render`

The virtual elements are just JavaScript objects, so they're fast to create and manipulate. Only when you call `render` does the framework create actual DOM elements.

## Testing

Open `index.html` in your browser and check the console. You should see:
- ✅ Element created
- ✅ Attributes added  
- ✅ Child appended
- ✅ Text node added
- ✅ Rendered to DOM successfully
- 🎉 All DOM tests passed!

The test creates a div with a button and text, then renders it to the page where you can click the button to verify events work.

## Next Steps

This DOM module provides the foundation for:
- Building interactive components
- Creating the TodoMVC application  
- Adding state management for reactive updates
- Implementing routing for navigation

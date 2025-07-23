# MiniJS Framework - DOM Module

## Overview
The DOM Module provides a virtual DOM abstraction layer that simplifies element creation, manipulation, and rendering. It transforms HTML structures into JavaScript objects for easier programmatic manipulation.

## Core Concepts

### Virtual Elements
The framework represents DOM elements as JavaScript objects:

```javascript
{
  tag: 'div',
  attrs: { class: 'container', id: 'main' },
  children: ['Hello World'],
  _isVirtualElement: true
}
```

This virtual representation allows for easier manipulation before rendering to the actual DOM.

## API Reference

### Element Creation

#### `createElement(tag, attributes, children)`
Creates a virtual DOM element.

```javascript
// Simple element
const div = MiniJSDOM.createElement('div', { class: 'container' }, 'Hello World');

// Element with children
const container = MiniJSDOM.createElement('div', { class: 'app' }, [
  MiniJSDOM.createElement('h1', {}, 'My App'),
  MiniJSDOM.createElement('button', { onclick: () => alert('Clicked!') }, 'Click Me')
]);
```

#### `createTextNode(text)`
Creates a virtual text node.

```javascript
const textNode = MiniJSDOM.createTextNode('Hello World');
```

#### `createComponent(renderFn, props)`
Creates a component from a render function.

```javascript
const Button = (props) => MiniJSDOM.createElement('button', props, props.text || 'Button');
const myButton = MiniJSDOM.createComponent(Button, { class: 'primary', text: 'Submit' });
```

### Attribute Management

#### `setAttribute(element, name, value)`
Sets an attribute on a virtual element.

```javascript
MiniJSDOM.setAttribute(element, 'id', 'main');
MiniJSDOM.setAttribute(element, 'data-value', '123');
```

#### `getAttribute(element, name)`
Gets an attribute from a virtual element.

```javascript
const id = MiniJSDOM.getAttribute(element, 'id');
```

#### `removeAttribute(element, name)`
Removes an attribute from a virtual element.

```javascript
MiniJSDOM.removeAttribute(element, 'disabled');
```

#### `hasAttribute(element, name)`
Checks if a virtual element has an attribute.

```javascript
if (MiniJSDOM.hasAttribute(element, 'required')) {
  // Element has required attribute
}
```

### CSS Class Management

#### `addClass(element, className)`
Adds CSS class(es) to a virtual element.

```javascript
MiniJSDOM.addClass(element, 'active');
MiniJSDOM.addClass(element, 'visible highlighted'); // Multiple classes
```

#### `removeClass(element, className)`
Removes CSS class(es) from a virtual element.

```javascript
MiniJSDOM.removeClass(element, 'inactive');
MiniJSDOM.removeClass(element, 'hidden error'); // Multiple classes
```

#### `toggleClass(element, className)`
Toggles a CSS class on a virtual element.

```javascript
MiniJSDOM.toggleClass(element, 'selected');
```

#### `hasClass(element, className)`
Checks if a virtual element has a CSS class.

```javascript
if (MiniJSDOM.hasClass(element, 'active')) {
  // Element has active class
}
```

### Style Management

#### `setStyle(element, property, value)`
Sets inline style on a virtual element.

```javascript
// Set single style
MiniJSDOM.setStyle(element, 'color', 'red');

// Set multiple styles
MiniJSDOM.setStyle(element, {
  color: 'blue',
  fontSize: '16px',
  marginTop: '10px'
});
```

#### `getStyle(element, property)`
Gets inline style from a virtual element.

```javascript
const color = MiniJSDOM.getStyle(element, 'color');
```

### DOM Manipulation

#### `appendChild(parent, child)`
Appends a child to a parent virtual element.

```javascript
const parent = MiniJSDOM.createElement('div');
const child = MiniJSDOM.createElement('span');
MiniJSDOM.appendChild(parent, child);
```

#### `removeChild(parent, child)`
Removes a child from a parent virtual element.

```javascript
MiniJSDOM.removeChild(parent, child);
```

#### `insertBefore(parent, newChild, referenceChild)`
Inserts a child before a reference child.

```javascript
MiniJSDOM.insertBefore(parent, newChild, referenceChild);
```

#### `insertAfter(parent, newChild, referenceChild)`
Inserts a child after a reference child.

```javascript
MiniJSDOM.insertAfter(parent, newChild, referenceChild);
```

#### `replaceChild(parent, newChild, oldChild)`
Replaces a child with a new child.

```javascript
MiniJSDOM.replaceChild(parent, newChild, oldChild);
```

#### `clearChildren(element)`
Removes all children from an element.

```javascript
MiniJSDOM.clearChildren(element);
```

### Child Access

#### `getFirstChild(element)`
Gets the first child of an element.

```javascript
const firstChild = MiniJSDOM.getFirstChild(element);
```

#### `getLastChild(element)`
Gets the last child of an element.

```javascript
const lastChild = MiniJSDOM.getLastChild(element);
```

#### `getChildren(element)`
Gets all children of an element.

```javascript
const children = MiniJSDOM.getChildren(element);
```

#### `getChildCount(element)`
Gets the number of children.

```javascript
const count = MiniJSDOM.getChildCount(element);
```

#### `hasChildren(element)`
Checks if element has children.

```javascript
if (MiniJSDOM.hasChildren(element)) {
  // Element has children
}
```

#### `findChild(element, predicate)`
Finds a child element by a predicate function.

```javascript
const button = MiniJSDOM.findChild(element, child => 
  MiniJSDOM.getAttribute(child, 'type') === 'submit'
);
```

#### `findChildren(element, predicate)`
Finds all child elements matching a predicate function.

```javascript
const inputs = MiniJSDOM.findChildren(element, child => 
  child.tag === 'input'
);
```

### Rendering

#### `render(virtualElement, container)`
Renders a virtual element to the actual DOM.

```javascript
const vDiv = MiniJSDOM.createElement('div', {}, 'Hello World');
const realDiv = MiniJSDOM.render(vDiv, document.getElementById('app'));
```

#### `createDOMElement(virtualElement)`
Creates a real DOM element from a virtual element.

```javascript
const vButton = MiniJSDOM.createElement('button', { class: 'btn' }, 'Click');
const realButton = MiniJSDOM.createDOMElement(vButton);
document.body.appendChild(realButton);
```

## How It Works

1. **Create Virtual Elements**: Use `createElement` to build a tree of virtual elements
2. **Manipulate**: Modify the virtual elements using attribute and manipulation functions
3. **Render**: Convert the virtual elements to real DOM elements using `render`

The virtual DOM approach allows for efficient updates by only modifying the parts of the DOM that have changed.

## Example: Todo Item Component

```javascript
function createTodoItem(todo) {
  // Create checkbox
  const checkbox = MiniJSDOM.createElement('input', {
    class: 'toggle',
    type: 'checkbox',
    checked: todo.completed
  });

  // Create label
  const label = MiniJSDOM.createElement('label', {}, todo.title);

  // Create delete button
  const deleteBtn = MiniJSDOM.createElement('button', { class: 'destroy' });

  // Create view container
  const view = MiniJSDOM.createElement('div', { class: 'view' }, [
    checkbox, label, deleteBtn
  ]);

  // Create edit input
  const editInput = MiniJSDOM.createElement('input', {
    class: 'edit',
    value: todo.title
  });

  // Create todo item container
  const todoItem = MiniJSDOM.createElement('li', {
    'data-id': todo.id,
    class: todo.completed ? 'completed' : ''
  }, [view, editInput]);

  return todoItem;
}

// Usage
const todoList = document.querySelector('.todo-list');
const todo = { id: 1, title: 'Learn MiniJS', completed: false };
const todoElement = createTodoItem(todo);
MiniJSDOM.render(todoElement, todoList);
```
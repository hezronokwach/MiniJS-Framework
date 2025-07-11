/**
 * MiniJS Framework - Event Delegation
 * Efficient event handling for dynamic content
 */

export class EventDelegation {
    constructor(eventSystem) {
        this.eventSystem = eventSystem;
        this.delegatedSelectors = new Map();
    }

    // Delegate events based on CSS selectors
    delegate(container, selector, eventType, handler) {
        const delegatedHandler = (event) => {
            const target = event.target.closest(selector);
            if (target && container.contains(target)) {
                const enhancedEvent = this.eventSystem.createEnhancedEvent(event, target);
                handler.call(target, enhancedEvent);
            }
        };

        this.eventSystem.bind(container, { [eventType]: delegatedHandler });

        // Store for cleanup
        const key = `${selector}-${eventType}`;
        if (!this.delegatedSelectors.has(container)) {
            this.delegatedSelectors.set(container, new Set());
        }
        this.delegatedSelectors.get(container).add(key);
    }

    // Remove delegated events
    undelegate(container, selector, eventType) {
        const key = `${selector}-${eventType}`;
        const containerSelectors = this.delegatedSelectors.get(container);

        if (containerSelectors) {
            containerSelectors.delete(key);
            if (containerSelectors.size === 0) {
                this.delegatedSelectors.delete(container);
            }
        }
    }

    // TodoMVC specific delegation
    delegateTodoEvents(container) {
        // Toggle todo completion
        this.delegate(container, '.todo-toggle', 'change', (event) => {
            const todoId = event.currentTarget.closest('.todo-item').dataset.id;
            return event.updateState({
                todos: {
                    [todoId]: { completed: event.currentTarget.checked }
                }
            });
        });

        // Start editing todo
        this.delegate(container, '.todo-text', 'dblclick', (event) => {
            const todoItem = event.currentTarget.closest('.todo-item');
            todoItem.classList.add('editing');
            const input = todoItem.querySelector('.todo-edit');
            if (input) {
                input.focus();
                input.select();
            }
        });

        // Delete todo
        this.delegate(container, '.todo-destroy', 'click', (event) => {
            const todoId = event.currentTarget.closest('.todo-item').dataset.id;
            return event.updateState({ deleteTodo: todoId });
        });

        // Save todo edit
        this.delegate(container, '.todo-edit', 'blur', (event) => {
            this.saveTodoEdit(event);
        });

        this.delegate(container, '.todo-edit', 'keydown', (event) => {
            if (event.key === 'Enter') {
                this.saveTodoEdit(event);
            } else if (event.key === 'Escape') {
                this.cancelTodoEdit(event);
            }
        });
    }

    saveTodoEdit(event) {
        const input = event.currentTarget;
        const todoItem = input.closest('.todo-item');
        const todoId = todoItem.dataset.id;
        const newText = input.value.trim();

        if (newText) {
            event.updateState({
                todos: {
                    [todoId]: { text: newText }
                }
            });
        }

        todoItem.classList.remove('editing');
    }

    cancelTodoEdit(event) {
        const input = event.currentTarget;
        const todoItem = input.closest('.todo-item');
        const originalText = todoItem.querySelector('.todo-text').textContent;

        input.value = originalText;
        todoItem.classList.remove('editing');
    }
}
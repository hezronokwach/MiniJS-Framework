// Fix for "Press Enter to add" functionality
document.addEventListener('DOMContentLoaded', function() {
    // Direct event handler for the new todo input
    const newTodoInput = document.querySelector('.new-todo');
    if (newTodoInput) {
        newTodoInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const value = this.value.trim();
                if (value) {
                    // Call the addTodo function if it exists
                    if (typeof addTodo === 'function') {
                        addTodo(value);
                    } else {
                        // Fallback: Add todo directly
                        const state = window.MiniJSState;
                        if (state) {
                            const currentState = state.getState();
                            const id = currentState.nextId || 1;
                            
                            const newTodo = {
                                id: id,
                                title: value,
                                completed: false,
                                createdAt: Date.now()
                            };
                            
                            const newTodos = { ...currentState.todos };
                            newTodos[id] = newTodo;
                            
                            state.setState({
                                todos: newTodos,
                                nextId: id + 1
                            }, 'ADD_TODO');
                        }
                    }
                    
                    // Clear the input
                    this.value = '';
                    e.preventDefault();
                }
            }
        });
    }
});
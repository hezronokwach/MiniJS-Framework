// Add direct inline handlers to toggle checkboxes
document.addEventListener('DOMContentLoaded', function() {
    // Function to update all toggle checkboxes
    function updateToggleCheckboxes() {
        document.querySelectorAll('.toggle').forEach(checkbox => {
            // Add direct onclick attribute that doesn't rely on any framework functions
            checkbox.setAttribute('onclick', `
                const li = this.closest('li');
                li.classList.toggle('completed', this.checked);
                
                const id = parseInt(li.dataset.id);
                const state = window.MiniJSState;
                if (state) {
                    const currentState = state.getState();
                    const todo = currentState.todos[id];
                    if (todo) {
                        const newTodos = {...currentState.todos};
                        newTodos[id] = {
                            ...todo,
                            completed: this.checked
                        };
                        state.setState({
                            todos: newTodos
                        }, 'TOGGLE_TODO');
                    }
                }
            `);
        });
    }
    
    // Initial update
    updateToggleCheckboxes();
    
    // Update when DOM changes
    const observer = new MutationObserver(function(mutations) {
        updateToggleCheckboxes();
    });
    
    observer.observe(document.querySelector('.todo-list') || document.body, {
        childList: true,
        subtree: true
    });
});
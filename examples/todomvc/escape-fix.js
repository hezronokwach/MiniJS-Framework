// Fix for Escape key to cancel editing
document.addEventListener('DOMContentLoaded', function() {
    // Make cancelEditing function globally available
    if (typeof cancelEditing === 'function') {
        window.cancelEditing = cancelEditing;
    }
    
    // Direct event handler for Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const editInput = document.querySelector('.todo-list li.editing .edit');
            if (editInput) {
                e.preventDefault();
                
                const li = editInput.closest('li');
                const id = parseInt(li.dataset.id);
                
                // Try to use the framework's cancelEditing function
                if (typeof cancelEditing === 'function') {
                    cancelEditing();
                } else {
                    // Direct fallback implementation
                    const state = window.MiniJSState;
                    if (state) {
                        state.setState({
                            editingId: null
                        }, 'CANCEL_EDIT');
                    }
                    
                    // Remove editing class directly
                    li.classList.remove('editing');
                    
                    // Return focus to the label
                    setTimeout(() => {
                        const label = li.querySelector('label');
                        if (label) {
                            label.focus();
                        }
                    }, 0);
                }
            }
        }
    });
    
    // Add inline handlers to edit inputs
    function updateEditInputs() {
        document.querySelectorAll('.edit').forEach(input => {
            if (!input.getAttribute('onkeydown')) {
                input.setAttribute('onkeydown', `
                    if(event.key === 'Escape') {
                        event.preventDefault();
                        const li = this.closest('li');
                        li.classList.remove('editing');
                        if(typeof cancelEditing === 'function') {
                            cancelEditing();
                        } else {
                            const state = window.MiniJSState;
                            if(state) {
                                state.setState({
                                    editingId: null
                                }, 'CANCEL_EDIT');
                            }
                        }
                        return false;
                    }
                `);
            }
        });
    }
    
    // Update when DOM changes
    const observer = new MutationObserver(updateEditInputs);
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Initial update
    updateEditInputs();
});
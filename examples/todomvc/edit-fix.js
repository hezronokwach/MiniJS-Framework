// Fix for double-click editing using MiniJS Events
function initializeEditFix() {
    // Wait for MiniJS Events to be available
    if (!window.MiniJS || !window.MiniJS.events) {
        setTimeout(initializeEditFix, 100);
        return;
    }

    const events = window.MiniJS.events;

    // Direct event handler for double-click on labels using MiniJS Events
    events.onDoubleClick(document.body, function(e) {
        if (e.target.tagName === 'LABEL' && e.target.closest('.todo-list')) {
            const li = e.target.closest('li');
            if (li) {
                const id = parseInt(li.dataset.id);
                li.classList.add('editing');
                const editInput = li.querySelector('.edit');
                if (editInput) {
                    editInput.focus();
                    editInput.selectionStart = 0;
                    editInput.selectionEnd = editInput.value.length;
                }
                
                // Update state
                if (window.MiniJSState) {
                    window.MiniJSState.setState({
                        editingId: id
                    }, 'START_EDITING');
                }
                
                e.preventDefault();
            }
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEditFix);
} else {
    initializeEditFix();
}
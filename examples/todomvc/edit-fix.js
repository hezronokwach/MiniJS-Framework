// Fix for double-click editing
document.addEventListener('DOMContentLoaded', function() {
    // Direct event handler for double-click on labels
    document.body.addEventListener('dblclick', function(e) {
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
});
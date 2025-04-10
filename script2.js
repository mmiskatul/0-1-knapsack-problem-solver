document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active.tagName === 'INPUT') {
        const inputs = Array.from(document.querySelectorAll('input'));
        const index = inputs.indexOf(active);
        if (e.key === 'ArrowDown') {
            if (index >= 0 && index < inputs.length - 1) {
                e.preventDefault();
                inputs[index + 1].focus();
            }
        }

        if (e.key === 'ArrowUp') {
            if (index > 0) {
                e.preventDefault();
                inputs[index - 1].focus();
            }
        }
        
        if (e.key === 'ArrowRight') {
            if (active.classList.contains('item-value')) {
                const weightInput = active.parentElement.querySelector('.item-weight');
                if (weightInput) {
                    e.preventDefault();
                    weightInput.focus();
                }
            }
        }

        if (e.key === 'ArrowLeft') {
            if (active.classList.contains('item-weight')) {
                const valueInput = active.parentElement.querySelector('.item-value');
                if (valueInput) {
                    e.preventDefault();
                    valueInput.focus();
                }
            }
        }
    }
});

const itemCountInput = document.getElementById('itemCount');

itemCountInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        generateItemsBtn.click();
        setTimeout(() => {
            const firstInput = document.querySelector('.item-value');
            if (firstInput) firstInput.focus(); 
        }, 100); 
    }
});


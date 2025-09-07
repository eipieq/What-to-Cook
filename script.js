document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded');

    const selections = document.querySelectorAll('.selection');
    const whatToCookBtn = document.getElementById('whatToCookBtn');

    let selectedPreferences = {
        mealType: null,
        cuisine: null
    };

    selections.forEach(selection => {
        // Add both click and touchend events for better mobile support
        selection.addEventListener('click', handleSelection);
        selection.addEventListener('touchend', handleSelection);
        
        function handleSelection(e) {
            // Prevent default to avoid double-firing on mobile
            e.preventDefault();
            
            console.log('Selection clicked');
            
            const category = this.closest('.category');
            const categoryTitle = category.querySelector('h5').textContent.toLowerCase().replace(' ', '');
            const selectionText = this.querySelector('p').textContent;

            // Remove selected class from siblings
            const siblingSelections = category.querySelectorAll('.selection');
            siblingSelections.forEach(sibling => {
                sibling.classList.remove('selected');
            });

            // Add selected class to current
            this.classList.add('selected');

            // Update preferences
            if (categoryTitle === 'mealtype') {
                selectedPreferences.mealType = selectionText;
            } else if (categoryTitle === 'cuisine') {
                selectedPreferences.cuisine = selectionText;
            }

            console.log('Updated preferences:', selectedPreferences);

            // Update button state
            updateButtonState();
        }
    });

    // Add both click and touchend events for the button
    whatToCookBtn.addEventListener('click', handleButtonClick);
    whatToCookBtn.addEventListener('touchend', handleButtonClick);
    
    function handleButtonClick(e) {
        // Prevent default and stop propagation
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Button clicked!');
        console.log('Current preferences:', selectedPreferences);
        
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            const url = `recipe.html?meal=${encodeURIComponent(selectedPreferences.mealType)}&cuisine=${encodeURIComponent(selectedPreferences.cuisine)}`;
            console.log('Redirecting to:', url);
            
            // Use a slight delay to ensure the touch event completes
            setTimeout(() => {
                window.location.href = url;
            }, 50);
        } else {
            alert('Please select both meal type and cuisine preferences.');
        }
    }

    function updateButtonState() {
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            whatToCookBtn.style.opacity = '1';
            whatToCookBtn.disabled = false;
            whatToCookBtn.style.pointerEvents = 'auto';
            console.log('Button enabled');
        } else {
            whatToCookBtn.style.opacity = '0.5';
            whatToCookBtn.disabled = true;
            whatToCookBtn.style.pointerEvents = 'none';
            console.log('Button disabled');
        }
    }

    // Initial button state
    updateButtonState();
});
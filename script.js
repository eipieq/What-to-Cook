document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded');

    const selections = document.querySelectorAll('.selection');
    const whatToCookBtn = document.getElementById('whatToCookBtn');

    let selectedPreferences = {
        mealType: null,
        cuisine: null
    };

    selections.forEach(selection => {
        selection.addEventListener('click', function() {
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
        });
    });

    whatToCookBtn.addEventListener('click', function() {
        console.log('Button clicked!');
        console.log('Current preferences:', selectedPreferences);
        
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            const url = `recipe.html?meal=${selectedPreferences.mealType}&cuisine=${selectedPreferences.cuisine}`;
            console.log('Redirecting to:', url);
            window.location.href = url;
        } else {
            alert('Please select both meal type and cuisine preferences.');
        }
    });

    function updateButtonState() {
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            whatToCookBtn.style.opacity = 1;
            whatToCookBtn.disabled = false;
            console.log('Button enabled');
        } else {
            whatToCookBtn.style.opacity = 0.5;
            whatToCookBtn.disabled = true;
            console.log('Button disabled');
        }
    }

    updateButtonState();
});
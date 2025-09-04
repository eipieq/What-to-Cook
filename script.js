// Preferences functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all selection elements
    const selections = document.querySelectorAll('.selection');
    const whatToCookBtn = document.getElementById('whatToCookBtn');
    
    // Store selected preferences
    let selectedPreferences = {
        mealType: null,
        cuisine: null
    };
    
    // Add click event listeners to all selections
    selections.forEach(selection => {
        selection.addEventListener('click', function() {
            const category = this.closest('.category');
            const categoryTitle = category.querySelector('h5').textContent.toLowerCase().replace(' ', '');
            const selectionText = this.querySelector('p').textContent;
            
            // Remove selected class from other items in the same category
            const siblingSelections = category.querySelectorAll('.selection');
            siblingSelections.forEach(sibling => {
                sibling.classList.remove('selected');
            });
            
            // Add selected class to clicked item
            this.classList.add('selected');
            
            // Update selected preferences
            if (categoryTitle === 'mealtype') {
                selectedPreferences.mealType = selectionText;
            } else if (categoryTitle === 'cuisine') {
                selectedPreferences.cuisine = selectionText;
            }
            
            // Log current preferences (for debugging)
            console.log('Selected preferences:', selectedPreferences);
            
            // Enable "What to Cook?" button if both preferences are selected
            updateWhatToCookButton();
        });
    });
    
    // Handle "What to Cook?" button click
    whatToCookBtn.addEventListener('click', function() {
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            // Here you can add logic to generate recipe suggestions
            // For now, we'll just show an alert
            alert(`Looking for ${selectedPreferences.cuisine} ${selectedPreferences.mealType} recipes!`);
            
            // You could redirect to a results page or show recipes dynamically
            // window.location.href = 'results.html';
        } else {
            alert('Please select both meal type and cuisine preferences.');
        }
    });
    
    // Function to update the "What to Cook?" button state
    function updateWhatToCookButton() {
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            whatToCookBtn.style.opacity = '1';
            whatToCookBtn.style.cursor = 'pointer';
            whatToCookBtn.disabled = false;
        } else {
            whatToCookBtn.style.opacity = '0.6';
            whatToCookBtn.style.cursor = 'not-allowed';
            whatToCookBtn.disabled = true;
        }
    }
    
    // Initialize button state
    updateWhatToCookButton();
    
    // Add hover effects for better user experience
    selections.forEach(selection => {
        selection.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        selection.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
            }
        });
    });
    
    // Touch device optimizations
    if ('ontouchstart' in window) {
        selections.forEach(selection => {
            selection.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.96)';
            });
            
            selection.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = this.classList.contains('selected') ? 'translateY(-2px)' : 'translateY(0)';
                }, 100);
            });
        });
    }
});
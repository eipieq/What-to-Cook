document.addEventListener('DOMContentLoaded', function() {
    console.log('Recipe page loaded');

    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const selectedMeal = urlParams.get('meal');
    const selectedCuisine = urlParams.get('cuisine');
    
    console.log('URL params:', { meal: selectedMeal, cuisine: selectedCuisine });

    // Store excluded recipes for "What Else?" functionality
    let excludedRecipes = JSON.parse(sessionStorage.getItem('excludedRecipes') || '[]');
    
    // Load and display recipe
    loadRecipe(selectedMeal, selectedCuisine, excludedRecipes);

    // Handle button clicks
    setupButtonHandlers(selectedMeal, selectedCuisine);
});

async function loadRecipe(meal, cuisine, excludedRecipes = []) {
    try {
        console.log('Loading recipe for:', { meal, cuisine, excluded: excludedRecipes });
        
        // Load recipes data
        const response = await fetch('recipes.json');
        const data = await response.json();
        
        // Find matching recipes
        const matchingRecipes = data.recipes.filter(recipe => 
            recipe.mealType === meal && 
            recipe.cuisine === cuisine &&
            !excludedRecipes.includes(recipe.id)
        );
        
        console.log('Matching recipes:', matchingRecipes);
        
        if (matchingRecipes.length === 0) {
            // No more recipes available
            displayNoMoreRecipes();
            return;
        }
        
        // Pick the first available recipe (you can randomize this later)
        const selectedRecipe = matchingRecipes[0];
        console.log('Selected recipe:', selectedRecipe);
        
        // Display the recipe
        displayRecipe(selectedRecipe);
        
    } catch (error) {
        console.error('Error loading recipe:', error);
        displayError();
    }
}

function displayRecipe(recipe) {
    // Store current recipe ID and data for later use
    window.currentRecipeId = recipe.id;
    window.currentRecipe = recipe;
    
    // Update page title
    document.title = `${recipe.name} - What to Cook`;
    
    // Update recipe name
    const titleElement = document.querySelector('.recipe-page h1');
    titleElement.textContent = recipe.name;
    
    // Update recipe image
    const imageElement = document.querySelector('.recipe img');
    imageElement.src = recipe.image;
    imageElement.alt = recipe.name;
    
    // Update stats
    const statsClips = document.querySelectorAll('.clip');
    
    // Time
    statsClips[0].querySelector('p').innerHTML = `${recipe.cookTime} <span>minutes</span>`;
    
    // Servings
    statsClips[1].querySelector('p').innerHTML = `${recipe.servings} <span>servings</span>`;
    
    // Style
    statsClips[2].querySelector('p').textContent = recipe.style;
    
    // Update description
    const descriptionElement = document.querySelector('.recipe > p');
    descriptionElement.textContent = recipe.description;
    
    // DON'T add ingredients and instructions yet - wait for user to click "I'll cook this!"
}

function setupButtonHandlers(meal, cuisine) {
    const acceptBtn = document.querySelector('.cook-action.accept');
    const rejectBtn = document.querySelector('.cook-action.reject');
    
    acceptBtn.addEventListener('click', function() {
        console.log('User accepted recipe - showing full recipe details');
        
        // Show ingredients and instructions
        addIngredientsSection(window.currentRecipe);
        addInstructionsSection(window.currentRecipe);
        
        // Change button text and behavior
        acceptBtn.innerHTML = '<i class="ph ph-heart"></i> Thanks!';
        acceptBtn.style.background = '#94CA72';
        
        // Hide reject button since they've accepted
        rejectBtn.style.display = 'none';
        
        // Clear excluded recipes for next time
        sessionStorage.removeItem('excludedRecipes');
        
        // Scroll to ingredients
        setTimeout(() => {
            const ingredientsSection = document.querySelector('.ingredients-section');
            if (ingredientsSection) {
                ingredientsSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 100);
    });
    
    rejectBtn.addEventListener('click', function() {
        console.log('User rejected recipe, finding alternative');
        
        // Get current recipe ID to exclude it
        const currentRecipeId = getCurrentRecipeId();
        
        // Add to excluded list
        let excludedRecipes = JSON.parse(sessionStorage.getItem('excludedRecipes') || '[]');
        excludedRecipes.push(currentRecipeId);
        sessionStorage.setItem('excludedRecipes', JSON.stringify(excludedRecipes));
        
        // Clear current recipe content
        clearRecipeContent();
        
        // Load new recipe
        loadRecipe(meal, cuisine, excludedRecipes);
    });
}

function addIngredientsSection(recipe) {
    // Find where to insert ingredients (after description)
    const descriptionElement = document.querySelector('.recipe > p');
    
    // Parse ingredients to separate quantity and item
    const parsedIngredients = recipe.ingredients.map(ingredient => {
        // Split on first space after a number/fraction or measurement
        const match = ingredient.match(/^([0-9\/\.\s]*(?:cups?|tbsp|tsp|oz|lbs?|g|kg|ml|l|cloves?|slices?|medium|large|small|handful|pinch)?)\s+(.+)$/i);
        if (match) {
            return {
                quantity: match[1].trim(),
                item: match[2].trim()
            };
        } else {
            return {
                quantity: '',
                item: ingredient
            };
        }
    });
    
    // Create ingredients section
    const ingredientsSection = document.createElement('div');
    ingredientsSection.className = 'ingredients-section';
    ingredientsSection.innerHTML = `
        <h3>Ingredients</h3>
        <ul class="ingredients-list">
            ${parsedIngredients.map(ing => `
                <li>
                    <p>${ing.quantity}</p><span>${ing.item}</span>
                </li>
            `).join('')}
        </ul>
    `;
    
    // Insert after description
    descriptionElement.parentNode.insertBefore(ingredientsSection, descriptionElement.nextSibling);
}

function addInstructionsSection(recipe) {
    // Find where to insert instructions (after ingredients)
    const ingredientsSection = document.querySelector('.ingredients-section');
    
    // Create instructions section
    const instructionsSection = document.createElement('div');
    instructionsSection.className = 'instructions-section';
    instructionsSection.innerHTML = `
        <h3>How to Make It</h3>
        <ul class="instructions-list">
            ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
        </ul>
    `;
    
    // Insert after ingredients
    ingredientsSection.parentNode.insertBefore(instructionsSection, ingredientsSection.nextSibling);
}

function getCurrentRecipeId() {
    return window.currentRecipeId;
}

function getCurrentRecipeId() {
    return window.currentRecipeId;
}

function clearRecipeContent() {
    // Remove dynamically added sections
    const ingredientsSection = document.querySelector('.ingredients-section');
    const instructionsSection = document.querySelector('.instructions-section');
    const backButton = document.querySelector('.back-button');
    
    if (ingredientsSection) ingredientsSection.remove();
    if (instructionsSection) instructionsSection.remove();
    if (backButton) backButton.remove();
}

function displayNoMoreRecipes() {
    const titleElement = document.querySelector('.recipe-page h1');
    titleElement.textContent = "No More Options";
    
    const descriptionElement = document.querySelector('.recipe > p');
    descriptionElement.innerHTML = `
        Looks like you've seen all our recipes for this combination! 
        <br><br>
        <a href="preferences.html" style="color: #f59e0b; text-decoration: underline;">
            Try different preferences
        </a> or come back later for new recipes.
    `;
    
    // Hide the image and stats
    document.querySelector('.recipe img').style.display = 'none';
    document.querySelector('.stats').style.display = 'none';
    
    // Hide reject button
    document.querySelector('.cook-action.reject').style.display = 'none';
}

function displayError() {
    const titleElement = document.querySelector('.recipe-page h1');
    titleElement.textContent = "Oops!";
    
    const descriptionElement = document.querySelector('.recipe > p');
    descriptionElement.innerHTML = `
        Something went wrong loading your recipe. 
        <br><br>
        <a href="preferences.html" style="color: #f59e0b; text-decoration: underline;">
            Try again
        </a>
    `;
}
document.addEventListener('DOMContentLoaded', function() {

    const selections = document.querySelectorAll('.selection');
    const whatToCookBtn = document.getElementById('whatToCookBtn');

    let selectedPreferences = {
        mealType: null,
        cuisine: null,
        timestamp: null
    };

    selections.forEach(selection => {
        selection.addEventListener('click', function() {
            const category = this.closest('.category');
            const categoryTitle = category.querySelector('h5').textContent.toLowerCase().replace(' ', '');
            const selectionText = this.querySelector('p').textContent;

            const siblingSelections = category.querySelectorAll('.selection');
            siblingSelections.forEach(sibling => {
                sibling.classList.remove('selected');
            });

            this.classList.add('selected');

            if (categoryTitle === 'mealtype') {
                selectedPreferences.mealType = selectionText;
            } else if (categoryTitle === 'cuisine') {
                selectedPreferences.cuisine = selectionText
            }

            selectedPreferences.timestamp = new Date().toISOString();

            console.log('Selected preferences:', selectedPreferences);

            updateWhatToCookButton();

            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });

    whatToCookBtn.addEventListener('click', function() {
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            const preferencesPayload = {
                userPreferences: {
                    mealType: selectedPreferences.mealType,
                    cuisine: selectedPreferences.cuisine,
                    requestType: "recipe_suggestion",
                    timestamp: selectedPreferences.timestamp
                },
                systemContext: {
                    appName: "What to Cook",
                    version: "1.0",
                    requestId: generateRequestId()
                },
                llmPrompt: `Please suggest a ${selectedPreferences.cuisine} ${selectedPreferences.mealType.toLowerCase()} recipe. For each recipe, provide: 1. recipe name, 2. brief description, 3. difficulty level (easy/medium/hard), 4. estimated cooking time, 5. key ingredients, 6. brief cooking method overview, 7. health benefits, format the response in a user-friendly way that's easy to read and follow.`
            };

            console.log('Preferences JSON for LLM:', JSON.stringify(preferencesPayload, null, 2));
            showJsonOutput(preferencesPayload);
        } else {
            alert('Please select both meal type and cuisine preferences.');
        }
    });

    function generateRequestId() {
        return 'req_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    // function showJsonOutput(payload) {
    //     const jsonWindow = window.open('', '_blank', 'width=600, height=800');
    //     jsonWindow.document.write(`
    //         <!Doctype html>
    //         <html>
    //         <head>
    //             <title>Preferences JSON for LLM</title>
    //             <style>
    //                 body { font-family: 'Courier New', monospace; padding: 20px; background: #1e1e1e; color: #d4d4d4; }
    //                 pre { background: #2d2d30; padding: 20px; border-radius: 8px; overflow: auto; }
    //                 .header { color: #569cd6; margin-bottom: 20px; }
    //                 .copy-btn {
    //                     background: #007acc; color: white; border: none; padding: 10px 20px;
    //                     border-radius: 4px; cursor: pointer; margin-bottom: 10px;
    //                 }
    //                 .copy-btn:hover { background: #005a9e; }
    //             </style>
    //         </head>
    //         <body>
    //             <h2 class="header">Preferences JSON for LLM Processing</h2>
    //             <button class="copy-btn" onclick="copyToClipboard()">Copy JSON</button>
    //             <pre id="jsonContent">${JSON.stringify(payload, null, 2)}</pre>
    //             <script>
    //                 function copyToClipboard() {
    //                     const jsonContent = document.getElementById('jsonContent').textContent;
    //                     navigator.clipboard.writeText(content).then(() => {
    //                         alert('JSON copied to clipboard!');
    //                     });
    //                 }
    //             </script>
    //         </body>
    //         </html>
    //     `);

    //     showSuccessMessage();
    // }

    // function showSuccessMessage() {
    //     const message = document.createElement('div');
    //     message.innerHTML = `
    //     <div style="
    //         position: fixed; top: 20px; right: 20px;
    //         background: linear-gradient(135deg, #f59e0b 0%, #f97);
    //         color: white; padding: 15px 20px; border-radius: 8px;
    //         box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    //         z-index: 1000; font-family: 'Nunito', sans-serif;
    //         animation: slideIn 0.3s ease-out;
    //     ">
    //         preferences submitted successfully<br>
    //         <small>JSON payload generated for LLM processing</small>
    //     </div>
    //     <style>
    //         @keyframes slideIn {
    //             from { tranform: translateX(100%); opacity: 0; }
    //             to ( transform: translateX(0); opacity: 1; }
    //         }
    //     </style>
    //     `;

    //     document.body.appendChild(message);
    //     setTimeout(() => {
    //         message.remove();
    //     }, 3000);
    // }

    function sendToLLM(payload) {
        console.log('LLM Integration')
    }

    function updateWhatToCookButton() {
        if (selectedPreferences.mealType && selectedPreferences.cuisine) {
            whatToCookBtn.style.opacity = 1;
            whatToCookBtn.style.cursor = 'pointer';
            whatToCookBtn.disabled = false;
            whatToCookBtn.style.transform = 'scale(1)';
        } else {
            whatToCookBtn.style.opacity = 0.5;
            whatToCookBtn.style.cursor = 'not-allowed';
            whatToCookBtn.disabled = true;
            whatToCookBtn.style.transform = 'scale(0.95)';
        }
    }

    updateWhatToCookButton();

    selections.forEach(selection => {
        selection.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }
        });

        selection.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            }
        });
    });

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
                const button = mutation.target;
                if (button.disabled) {
                    button.style.transition = 'all 0.3s ease';
                } else {
                    button.style.transition = 'all 0.3s ease';

                    button.animate([
                        { transform: 'scale(1)' },
                        { transform: 'scale(1.05)' },
                        { transform: 'scale(1)' }
                    ], {
                        duration: 200,
                        easing: 'ease-out'
                    });
                }
            }
        });
    observer.observe(whatToCookBtn, { attributes: true });
    });
});
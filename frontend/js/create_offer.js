// Get all input fields on the page
const inputFields = document.querySelectorAll('input');

// Add an event listener to each input field

inputFields.forEach(input => {
    input.addEventListener('input', () => {
        // Check if the input field has a value
        if (input.value.trim() !== '') {
            console.log('Something is typed in this field');
        }
    });
});

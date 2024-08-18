const nameBox = document.getElementById("nameInput");
const emailBox = document.getElementById("emailInput");
const cardBox = document.getElementById("cardInput");
const nameError1 = document.getElementById('nameNotAlpha');
const nameError2 = document.getElementById('nameEmpty');
const nameError3 = document.getElementById('nameTooLong');
const emailError3 = document.getElementById('emailTooLong');
const emailError1 = document.getElementById('emailEmpty');
const emailError2 = document.getElementById('emailInvalid');
const cardError2 = document.getElementById('cardNotNum');
const cardError3 = document.getElementById('cardTooLong');
const cardError1 = document.getElementById('cardEmpty');
const cardError5 = document.getElementById('cardInvalid');
const cardError4 = document.getElementById('cardTooShort');

const sendEmailButton = document.getElementById('submitButton');

// https://www.30secondsofcode.org/js/s/is-alpha-numeric/#:~:text=Check%20if%20a%20string%20contains,pattern%20matches%20the%20entire%20string.
const isAlpha = str => /^[a-zA-Z - '-'---]*$/.test(str);
const isValid = str => /^[0-9 - ]*$/.test(str);

let index;


// ==========================================
// data cleansing
// ==========================================


const allowedCharsRegex = /^[a-zA-Z0-9 \-@!.#$%&'*+\-/=?^_`{|}~]*$/;

function isAllowedKey(event) {
    const allowedKeyCodes = [
        8, 9, 37, 39, 46, // Backspace, Tab, ArrowLeft, ArrowRight, Delete
        67, 86, // Ctrl+C and Ctrl+V
        91, 93, // Cmd key on Mac
        16, // Shift key
    ];
    const allowedChars = /[a-zA-Z0-9 \-@!.#$%&'*+\-/=?^_`{|}~]/;
    return allowedKeyCodes.includes(event.keyCode) ||
            event.ctrlKey || 
            event.metaKey || 
            allowedChars.test(event.key);
}
function blockInvalidChars(event) {
    if (!isAllowedKey(event)) {
        event.preventDefault(); // Block invalid key presses
    }
}
function handlePaste(event) {
    event.preventDefault(); // Prevent default paste action
    const pastedText = event.clipboardData.getData('text');

    if (allowedCharsRegex.test(pastedText)) {
        const input = event.target;

        // Get the current selection start and end positions
        const start = input.selectionStart;
        const end = input.selectionEnd;

        // Delete the selected text by replacing the selected range with the pasted text
        const textBefore = input.value.slice(0, start);
        const textAfter = input.value.slice(end);
        input.value = textBefore + pastedText + textAfter;

        // Set the cursor position after the inserted text
        const newCursorPosition = start + pastedText.length;
        input.selectionStart = input.selectionEnd = newCursorPosition;

        // Optionally cleanse and validate after paste
        validateInput(input);
    }
}
function validateInput(input) {
    const id = input.id;
    let value = input.value.trim();
    let index = -1;

    if (id === 'nameInput') {
        index = checkName(value);
        displayValidationError('name', index);
    } else if (id === 'emailInput') {
        index = checkEmail(value);
        displayValidationError('email', index);
    } else if (id === 'cardInput') {
        index = cardCheck(value);
        displayValidationError('card', index);
    }

    // Apply background color based on validation result
    input.style.background = index === -1 ? 'rgb(137,200,46)' : 'rgb(231,0,100)';
}
function displayValidationError(type, index) {
    const errorTypes = {
        name: ['nameNotAlpha', 'nameEmpty', 'nameTooLong'],
        email: ['emailEmpty', 'emailInvalid', 'emailTooLong'],
        card: ['cardEmpty', 'cardNotNum', 'cardTooLong', 'cardTooShort', 'cardInvalid']
    };

    const errorDivs = errorTypes[type];
    errorDivs.forEach((errorId, i) => {
        document.getElementById(errorId).style.display = (index === i + 1) ? 'block' : 'none';
    });
}

function checkName(name){
    if (!/^[a-zA-Z ---']*$/.test(name)) return 1;
    if (name === '') return 2;
    if (name.length > 100) return 3;
    return -1;
}

function checkEmail(email){
    if (email === '') return 1;
    if (!email.includes('@')) return 2;
    if (email.length > 500) return 3;
    return -1;
}

function isValidCardNumber(cardNum) {
    const format = cardNum.replace(/ /g, '');
    if (/^\d+$/.test(format)) {
        let sum = 0;
        let shouldDouble = false;
        for (let i = format.length - 1; i >= 0; i--) {
            let digit = parseInt(format.charAt(i), 10);
            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10 === 0);
    }
    return false;
}

function cardCheck(card){
    const formatCard = card.replace(/ /g, '');
    if (card === '') return 1;
    if (!/^\d+$/.test(formatCard)) return 2;
    if (formatCard.length > 19) return 3;
    if (formatCard.length < 13) return 4;
    if (!isValidCardNumber(card)) return 5;
    return -1;
}

// Add event listeners
nameBox.addEventListener('keydown', blockInvalidChars);
emailBox.addEventListener('keydown', blockInvalidChars);
cardBox.addEventListener('keydown', blockInvalidChars);

nameBox.addEventListener('paste', handlePaste);
emailBox.addEventListener('paste', handlePaste);
cardBox.addEventListener('paste', handlePaste);

nameBox.addEventListener('input', () => validateInput(nameBox));
emailBox.addEventListener('input', () => validateInput(emailBox));
cardBox.addEventListener('input', () => validateInput(cardBox));

sendEmailButton.addEventListener('click', () => {
    if (checkName(nameBox.value.trim()) !== -1 || checkEmail(emailBox.value.trim()) !== -1 || cardCheck(cardBox.value.trim()) !== -1) {
        alert('Please ensure all fields have valid data. For more information about invalid fields, please scroll right');
        return;
    }
    const emailData = {
        name: nameBox.value,
        email: emailBox.value,
        card: cardBox.value
    };
    fetch('/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        document.getElementById('nameInput').value = '';
        document.getElementById('emailInput').value = '';
        document.getElementById('cardInput').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});







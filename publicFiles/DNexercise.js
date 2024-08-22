"use strict";
// Define type aliases and interfaces
const inputElements = {
    name: document.getElementById("nameInput"),
    email: document.getElementById("emailInput"),
    card: document.getElementById("cardInput"),
};
const errorElements = {
    nameNotAlpha: document.getElementById('nameNotAlpha'),
    nameEmpty: document.getElementById('nameEmpty'),
    nameTooLong: document.getElementById('nameTooLong'),
    emailTooLong: document.getElementById('emailTooLong'),
    emailEmpty: document.getElementById('emailEmpty'),
    emailInvalid: document.getElementById('emailInvalid'),
    cardNotNum: document.getElementById('cardNotNum'),
    cardTooLong: document.getElementById('cardTooLong'),
    cardEmpty: document.getElementById('cardEmpty'),
    cardInvalid: document.getElementById('cardInvalid'),
    cardTooShort: document.getElementById('cardTooShort'),
};
const sendEmailButton = document.getElementById('submitButton');
// Utility functions with type annotations
const isAlpha = (str) => /^[a-zA-Z - '-'---]*$/.test(str);
const isValid = (str) => /^[0-9 - ]*$/.test(str);
let index;
// ==========================================
// Data Cleansing
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
    var _a, _b, _c, _d;
    event.preventDefault(); // Prevent default paste action
    const pastedText = (_b = (_a = event.clipboardData) === null || _a === void 0 ? void 0 : _a.getData('text')) !== null && _b !== void 0 ? _b : '';
    if (allowedCharsRegex.test(pastedText)) {
        const input = event.target;
        const start = (_c = input.selectionStart) !== null && _c !== void 0 ? _c : 0;
        const end = (_d = input.selectionEnd) !== null && _d !== void 0 ? _d : 0;
        const textBefore = input.value.slice(0, start);
        const textAfter = input.value.slice(end);
        input.value = textBefore + pastedText + textAfter;
        const newCursorPosition = start + pastedText.length;
        input.selectionStart = input.selectionEnd = newCursorPosition;
        validateInput(input);
    }
}
// ==========================================
// Data Validation
// ==========================================
function validateInput(input) {
    const id = input.id;
    let value = input.value.trim();
    let index = -1;
    if (id === 'nameInput') {
        index = checkName(value);
        displayValidationError('name', index);
    }
    else if (id === 'emailInput') {
        index = checkEmail(value);
        displayValidationError('email', index);
    }
    else if (id === 'cardInput') {
        index = cardCheck(value);
        displayValidationError('card', index);
    }
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
        const errorElement = document.getElementById(errorId);
        errorElement.style.display = (index === i + 1) ? 'block' : 'none';
    });
}
function checkName(name) {
    if (!/^[a-zA-Z\s'-]*$/.test(name))
        return 1;
    if (name === '')
        return 2;
    if (name.length > 100)
        return 3;
    return -1;
}
function checkEmail(email) {
    if (email === '')
        return 1;
    if (!email.includes('@'))
        return 2;
    if (email.length > 500)
        return 3;
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
                if (digit > 9)
                    digit -= 9;
            }
            sum += digit;
            shouldDouble = !shouldDouble;
        }
        return (sum % 10 === 0);
    }
    return false;
}
function cardCheck(card) {
    const formatCard = card.replace(/ /g, '');
    if (card === '')
        return 1;
    if (!/^\d+$/.test(formatCard))
        return 2;
    if (formatCard.length > 19)
        return 3;
    if (formatCard.length < 13)
        return 4;
    if (!isValidCardNumber(card))
        return 5;
    return -1;
}
// Add event listeners
inputElements.name.addEventListener('keydown', blockInvalidChars);
inputElements.email.addEventListener('keydown', blockInvalidChars);
inputElements.card.addEventListener('keydown', blockInvalidChars);
inputElements.name.addEventListener('paste', handlePaste);
inputElements.email.addEventListener('paste', handlePaste);
inputElements.card.addEventListener('paste', handlePaste);
inputElements.name.addEventListener('input', () => validateInput(inputElements.name));
inputElements.email.addEventListener('input', () => validateInput(inputElements.email));
inputElements.card.addEventListener('input', () => validateInput(inputElements.card));
sendEmailButton.addEventListener('click', () => {
    if (checkName(inputElements.name.value.trim()) !== -1 || checkEmail(inputElements.email.value.trim()) !== -1 || cardCheck(inputElements.card.value.trim()) !== -1) {
        alert('Please ensure all fields have valid data. For more information about invalid fields, please scroll right');
        return;
    }
    const emailData = {
        name: inputElements.name.value,
        email: inputElements.email.value,
        card: inputElements.card.value
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
        inputElements.name.value = '';
        inputElements.email.value = '';
        inputElements.card.value = '';
    })
        .catch(error => {
        console.error('Error:', error);
    });
});

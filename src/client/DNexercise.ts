// Define type aliases and interfaces

interface InputElements {
    name: HTMLInputElement;
    email: HTMLInputElement;
    card: HTMLInputElement;
}

interface ErrorElements {
    nameNotAlpha: HTMLElement;
    nameEmpty: HTMLElement;
    nameTooLong: HTMLElement;
    emailTooLong: HTMLElement;
    emailEmpty: HTMLElement;
    emailInvalid: HTMLElement;
    cardNotNum: HTMLElement;
    cardTooLong: HTMLElement;
    cardEmpty: HTMLElement;
    cardInvalid: HTMLElement;
    cardTooShort: HTMLElement;
}

interface EmailData {
    name: string;
    email: string;
    card: string;
}

const inputElements: InputElements = {
    name: document.getElementById("nameInput") as HTMLInputElement,
    email: document.getElementById("emailInput") as HTMLInputElement,
    card: document.getElementById("cardInput") as HTMLInputElement,
};

const errorElements: ErrorElements = {
    nameNotAlpha: document.getElementById('nameNotAlpha') as HTMLElement,
    nameEmpty: document.getElementById('nameEmpty') as HTMLElement,
    nameTooLong: document.getElementById('nameTooLong') as HTMLElement,
    emailTooLong: document.getElementById('emailTooLong') as HTMLElement,
    emailEmpty: document.getElementById('emailEmpty') as HTMLElement,
    emailInvalid: document.getElementById('emailInvalid') as HTMLElement,
    cardNotNum: document.getElementById('cardNotNum') as HTMLElement,
    cardTooLong: document.getElementById('cardTooLong') as HTMLElement,
    cardEmpty: document.getElementById('cardEmpty') as HTMLElement,
    cardInvalid: document.getElementById('cardInvalid') as HTMLElement,
    cardTooShort: document.getElementById('cardTooShort') as HTMLElement,
};

const sendEmailButton = document.getElementById('submitButton') as HTMLButtonElement;

// Utility functions with type annotations
const isAlpha = (str: string): boolean => /^[a-zA-Z - '-'---]*$/.test(str);
const isValid = (str: string): boolean => /^[0-9 - ]*$/.test(str);

let index: number;

// ==========================================
// Data Cleansing
// ==========================================

const allowedCharsRegex = /^[a-zA-Z0-9 \-@!.#$%&'*+\-/=?^_`{|}~]*$/;

function isAllowedKey(event: KeyboardEvent): boolean {
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

function blockInvalidChars(event: KeyboardEvent): void {
    if (!isAllowedKey(event)) {
        event.preventDefault(); // Block invalid key presses
    }
}

function handlePaste(event: ClipboardEvent): void {
    event.preventDefault(); // Prevent default paste action
    const pastedText = event.clipboardData?.getData('text') ?? '';

    if (allowedCharsRegex.test(pastedText)) {
        const input = event.target as HTMLInputElement;

        const start = input.selectionStart ?? 0;
        const end = input.selectionEnd ?? 0;

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

function validateInput(input: HTMLInputElement): void {
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

    input.style.background = index === -1 ? 'rgb(137,200,46)' : 'rgb(231,0,100)';
}

function displayValidationError(type: 'name' | 'email' | 'card', index: number): void {
    const errorTypes: { [key: string]: string[] } = {
        name: ['nameNotAlpha', 'nameEmpty', 'nameTooLong'],
        email: ['emailEmpty', 'emailInvalid', 'emailTooLong'],
        card: ['cardEmpty', 'cardNotNum', 'cardTooLong', 'cardTooShort', 'cardInvalid']
    };

    const errorDivs = errorTypes[type];
    errorDivs.forEach((errorId, i) => {
        const errorElement = document.getElementById(errorId) as HTMLElement;
        errorElement.style.display = (index === i + 1) ? 'block' : 'none';
    });
}

function checkName(name: string): number {
    if (!/^[a-zA-Z\s'-]*$/.test(name)) return 1;
    if (name === '') return 2;
    if (name.length > 100) return 3;
    return -1;
}

function checkEmail(email: string): number {
    if (email === '') return 1;
    if (!email.includes('@')) return 2;
    if (email.length > 500) return 3;
    return -1;
}

function isValidCardNumber(cardNum: string): boolean {
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

function cardCheck(card: string): number {
    const formatCard = card.replace(/ /g, '');
    if (card === '') return 1;
    if (!/^\d+$/.test(formatCard)) return 2;
    if (formatCard.length > 19) return 3;
    if (formatCard.length < 13) return 4;
    if (!isValidCardNumber(card)) return 5;
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
    const emailData: EmailData = {
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

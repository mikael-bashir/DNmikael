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

let index;


// ==========================================
// data cleansing
// ==========================================

const allowedCharsRegex = /^[a-zA-Z0-9 \-@!#$%&'*+\-/=?^_`{|}~]*$/;

function isAllowedKey(event) {
    // Allow specific key codes for control and navigation keys
    const allowedKeyCodes = [
        8, 9, 37, 39, 46, // Backspace, Tab, ArrowLeft, ArrowRight, Delete
        67, 86, // Ctrl+C and Ctrl+V
        91, 93, // Cmd key on Mac
        16, // Shift key (useful for capital letters)
    ];
    
    // Key codes for allowed characters
    const allowedChars = /[a-zA-Z0-9 \-@!#$%&'*+\-/=?^_`{|}~]/;

    // Allow control keys or if the key matches the allowed characters
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
    // Prevent the default paste action
    event.preventDefault();

    // Get the pasted text from clipboard
    const pastedText = event.clipboardData.getData('text');

    // Check if the pasted text is allowed
    if (allowedCharsRegex.test(pastedText)) {
        // If allowed, manually insert the text at the cursor position
        const input = event.target;
        const cursorPosition = input.selectionStart;
        const textBefore = input.value.slice(0, cursorPosition);
        const textAfter = input.value.slice(cursorPosition);

        // Set the input value with pasted text
        input.value = textBefore + pastedText + textAfter;

        // Update the cursor position
        input.selectionStart = input.selectionEnd = cursorPosition + pastedText.length;
    }
}

nameBox.addEventListener('keydown', blockInvalidChars);
emailBox.addEventListener('keydown', blockInvalidChars);
cardBox.addEventListener('keydown', blockInvalidChars);

nameBox.addEventListener('paste', handlePaste);
emailBox.addEventListener('paste', handlePaste);
cardBox.addEventListener('paste', handlePaste);

// ==========================================
// data validation
// ==========================================

// https://www.30secondsofcode.org/js/s/is-alpha-numeric/#:~:text=Check%20if%20a%20string%20contains,pattern%20matches%20the%20entire%20string.
const isAlpha = str => /^[a-zA-Z - '-'---]*$/.test(str);
const isValid = str => /^[0-9 - ]*$/.test(str);

function format(cardNum){
    return cardNum.replace(/ /g, '');
}
function digSum(num){
    if (isNaN(num)){
        return "1";
    }
    let temp = String(num);
    let result = 0;
    for (let i=0; i<temp.length; i++){
        result += Number(temp.charAt(i));
    }
    return result;
}
function LUHN(card) {
    let number = format(card);
    let result = 0;
    let cycle = 1;
    let temp;

    for (let i = number.length - 1; i >= 0; i--) {
        if (cycle === 2){
            temp = Number(number.charAt(i)) * cycle;
            result += digSum(temp);
        } else{
            result += Number(number.charAt(i));
        }
        cycle = 1 + (cycle % 2);
    }
    return String(result);
}
function checkName(name){
    if (!isAlpha(name)) return 1;
    if (name === '') return 2;
    if (name.length > 100) return 3;
    return -1;
}
nameBox.addEventListener('paste', function(e){
    e.preventDefault();
})
nameBox.addEventListener('input', function() {

    index = checkName(nameBox.value.trim());

    if (index === -1){
        nameBox.style.background = '#89c82e';
        nameError1.style.display = "none";
        nameError2.style.display = "none";
        nameError3.style.display = "none";
        return;
    } 

    nameBox.style.background = 'rgb(231,0,100)';

    if (index === 1){
        nameError1.style.display = "block";
        nameError2.style.display = "none";
        nameError3.style.display = "none";
        return;
    } else if (index === 2){
        nameError1.style.display = "none";
        nameError2.style.display = "block";
        nameError3.style.display = "none";
        return;
    } else if (index == 3){
        nameError1.style.display = "none";
        nameError2.style.display = "none";
        nameError3.style.display = "block";
        return;
    }
});
function checkEmail(email){
    if (email === '') return 1;
    if (!email.includes('@')) return 2;
    if (email.length > 500) return 3;
    return -1;
}
emailBox.addEventListener('paste', function(e){
    e.preventDefault();
})
emailBox.addEventListener('input', function() {
    index = checkEmail(emailBox.value.trim());

    if (index === -1){
        emailBox.style.background = '#89c82e';
        emailError1.style.display = "none";
        emailError2.style.display = "none";
        emailError3.style.display = "none";
        return;
    }
    
    emailBox.style.background = 'rgb(231,0,100)';

    if (index === 1) {
        emailError1.style.display = "block";
        emailError2.style.display = "none";
        emailError3.style.display = "none";
        return;
    }
    if (index === 2) {
        emailError1.style.display = "none";
        emailError2.style.display = "block";
        emailError3.style.display = "none";
        return;
    }
    if (index === 3) {
        emailError1.style.display = "none";
        emailError2.style.display = "none";
        emailError3.style.display = "block";
        return;
    }
});
function cardCheck(card){
    if (card === '') return 1;
    if (!isValid(card)) return 2;
    if (format(card).length > 19) return 3;
    if (format(card).length < 13) return 4;
    if (Number(LUHN(card)) % 10 !== 0) return 5;
    return -1;
}
cardBox.addEventListener('paste', function(e){
    e.preventDefault();
})
cardBox.addEventListener('input', function () {
    
    index = cardCheck(cardBox.value.trim());


    if (index === -1){
        cardBox.style.background = '#89c82e';
        cardError1.style.display = "none";
        cardError2.style.display = "none";
        cardError3.style.display = "none";
        cardError4.style.display = "none";
        cardError5.style.display = "none";
        return;
    } 

    cardBox.style.background = 'rgb(231,0,100)';


    if (index === 1) {
        cardError1.style.display = "block";
        cardError2.style.display = "none";
        cardError3.style.display = "none";
        cardError4.style.display = "none";
        cardError5.style.display = "none";
        return;
    } else if (index === 2) {
        cardError1.style.display = "none";
        cardError2.style.display = "block";
        cardError3.style.display = "none";
        cardError4.style.display = "none";
        cardError5.style.display = "none";
        return;
    } else if (index === 3) {
        cardError1.style.display = "none";
        cardError2.style.display = "none";
        cardError3.style.display = "block";
        cardError4.style.display = "none";
        cardError5.style.display = "none";
        return;
    } else if (index === 4) {
        cardError1.style.display = "none";
        cardError2.style.display = "none";
        cardError3.style.display = "none";
        cardError4.style.display = "block";
        cardError5.style.display = "none";
        return;
    } else if (index === 5) {
        cardError1.style.display = "none";
        cardError2.style.display = "none";
        cardError3.style.display = "none";
        cardError4.style.display = "none";
        cardError5.style.display = "block";
        return;
    }
});

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







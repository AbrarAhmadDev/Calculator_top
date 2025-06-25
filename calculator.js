function add(a, b) {
    return a + b;
}
function subtract(a, b) {
    return a - b;
}
function multiply(a, b) {
    return a * b;
}
function divide(a, b) {
    if (b === 0) {
        throw new Error("Cannot divide by zero");
    }
    return a / b;
}
function operate(op,a,b){
    if (op == '+')
        return add(a,b);
    else if (op == '-')
        return subtract(a,b);
    else if (op == '*')
        return multiply(a,b);
    else if (op == '/')
        return divide(a,b);
    else
        return display.textContent = "Error";
}

function createCalculator(){
    const container = document.createElement("div");
    container.className = "calculator-container";
    document.body.appendChild(container);

    const display = document.createElement("div");
    display.className = "calculator-display";
    display.textContent = "";
    container.appendChild(display);

    const buttons = document.createElement("div");
    buttons.className = "calculator-buttons";
    container.appendChild(buttons);

    const buttonValues = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
        'C', 'DEL'
    ];
    buttonValues.forEach(value => {
        const button = document.createElement("button");
        button.textContent = value;
        buttons.appendChild(button);
    });
}

function createTitle(){
    const title = document.createElement('h1');
    title.textContent = "Basic Calculator";
    document.body.appendChild(title);
}
createTitle();
createCalculator();

function clickButton() {
    let displayValue = "";
    let firstOperand = null;
    let operator = null;
    let waitingForSecondOperand = false;
    let resultJustDisplayed = false;

    const container = document.querySelector(".calculator-container");
    const display = container.querySelector(".calculator-display");
    const buttons = container.querySelectorAll("button");

    function resetCalculator() {
        displayValue = "";
        firstOperand = null;
        operator = null;
        waitingForSecondOperand = false;
        resultJustDisplayed = false;
        display.textContent = "";
    }

    function roundResult(num) {
        return Math.round(num * 100000000) / 100000000;
    }

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.textContent;

            if (value === 'C') {
                resetCalculator();
                return;
            }

            if (value === 'DEL') {
                if (resultJustDisplayed) {
                    resetCalculator();
                } else {
                    displayValue = displayValue.slice(0, -1);
                    display.textContent = displayValue;
                }
                return;
            }

            if (['+', '-', '*', '/'].includes(value)) {
                if (displayValue === "" && firstOperand === null) return;
                if (operator && waitingForSecondOperand) {
                    operator = value;
                    displayValue = displayValue.slice(0, -1) + value;
                    display.textContent = displayValue;
                    return;
                }
                if (operator && !waitingForSecondOperand) {
                    let secondOperand = parseFloat(displayValue.slice(displayValue.lastIndexOf(operator) + 1));
                    if (operator === '/' && secondOperand === 0) {
                        display.textContent = "Nice try!";
                        resetCalculator();
                        return;
                    }
                    let result = operate(operator, firstOperand, secondOperand);
                    result = roundResult(result);
                    display.textContent = result + " " + value;
                    firstOperand = result;
                    displayValue = result.toString() + value;
                    operator = value;
                    waitingForSecondOperand = true;
                    resultJustDisplayed = false;
                    return;
                }
                firstOperand = parseFloat(displayValue);
                operator = value;
                displayValue += value;
                waitingForSecondOperand = true;
                resultJustDisplayed = false;
                display.textContent = displayValue;
                return;
            }
            if (value === '.') {
                let lastOpIdx = Math.max(
                    displayValue.lastIndexOf('+'),
                    displayValue.lastIndexOf('-'),
                    displayValue.lastIndexOf('*'),
                    displayValue.lastIndexOf('/')
                );
                let currentNumber = displayValue.slice(lastOpIdx + 1);
                if (
                    currentNumber.length > 0 &&
                    !currentNumber.includes('.')
                ) {
                    if (resultJustDisplayed) {
                        displayValue = "0.";
                        resultJustDisplayed = false;
                    } else {
                        displayValue += value;
                    }
                } else if (currentNumber.length === 0) {
                    displayValue += "0.";
                }
                display.textContent = displayValue;
                return;
            }
            if (value === '=') {
                if (operator && !waitingForSecondOperand) {
                    let secondOperand = parseFloat(displayValue.slice(displayValue.lastIndexOf(operator) + 1));
                    if (operator === '/' && secondOperand === 0) {
                        display.textContent = "Nice try!";
                        resetCalculator();
                        return;
                    }
                    let result = operate(operator, firstOperand, secondOperand);
                    result = roundResult(result);
                    display.textContent = result;
                    displayValue = result.toString();
                    firstOperand = result;
                    operator = null;
                    waitingForSecondOperand = false;
                    resultJustDisplayed = true;
                }
                return;
            }
            if (resultJustDisplayed && !isNaN(value)) {
                displayValue = value;
                resultJustDisplayed = false;
                operator = null;
                firstOperand = null;
                waitingForSecondOperand = false;
            } else {
                if (waitingForSecondOperand) {
                    displayValue = "";
                    waitingForSecondOperand = false;
                }
                displayValue += value;
            }
            display.textContent = displayValue;
        });
    });
}

function handleKeyboardInput() {
    document.addEventListener("keydown", (event) => {
        const keyMap = {
            "Enter": "=",
            "Backspace": "DEL",
            "Delete": "C"
        };
        let value = event.key;
        if (keyMap[value]) value = keyMap[value];
        const allowed = ['0','1','2','3','4','5','6','7','8','9','.','+','-','*','/','=','C','DEL'];
        if (allowed.includes(value)) {
            document.querySelectorAll("button").forEach(btn => {
                if (btn.textContent === value) btn.click();
            });
            event.preventDefault();
        }
    });
}
clickButton();
handleKeyboardInput();
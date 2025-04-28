const displayBox = document.querySelector(".display"),
    displayInput = document.querySelector(".display-input"),
    displayResult = document.querySelector(".display-result"),
    buttons = document.querySelectorAll("button"),
    operators = ["%", "÷", "×", "-", "+"];

let input = "",
    result = "",
    lastCalculation = false;

 
const replaceOperators = input =>
    input.replaceAll("÷", "/").replaceAll("×", "*");

const resetCalculator = newInput => {
    input = newInput;
    result = "";
    lastCalculation = false;
    displayBox.classList.remove("active");
};

const countBrackets = input => {
    let openBracketsCount = 0,
        closeBracketsCount = 0;

    for (const char of input) {
        if (char === "(") openBracketsCount++;
        else if (char === ")") closeBracketsCount++;
    }
    return { openBracketsCount, closeBracketsCount };
};

// Main function to handle calculator logic
const calculate = btnValue => {
    const lastChar = input.slice(-1),
        withoutLastChar = input.slice(0, -1),
        isLastCharOperator = operators.includes(lastChar);

    let { openBracketsCount, closeBracketsCount } = countBrackets(input);

    // Handle equals
    if (btnValue === "=") {
        if (input === "" || lastChar === "(" || isLastCharOperator) return;

        while (openBracketsCount > closeBracketsCount) {
            input += ")";
            closeBracketsCount++;
        }

        const formattedInput = replaceOperators(input);
        try {
            const calculatedValue = eval(formattedInput);
            result = parseFloat(calculatedValue.toFixed(10)).toString();
        } catch {
            result = "Error";
        }

        lastCalculation = true;
        displayBox.classList.add("active");
    }

    // Handle AC (All Clear)
    else if (btnValue === "AC") {
        resetCalculator("");
    }

    // Handle backspace
    else if (btnValue === "⌫") {
        if (lastCalculation) {
            resetCalculator(result.slice(0, -1));
        } else {
            const lastBracket = lastChar === ")";
            if (lastBracket) closeBracketsCount--;
            else if (lastChar === "(") openBracketsCount--;

            input = withoutLastChar;
        }
    }

     
    else if (btnValue === "()") {
        if (lastCalculation) {
            resetCalculator("(");
        } else if (lastChar === "(" || input === "" || isLastCharOperator) {
            input += "(";
        } else if (openBracketsCount > closeBracketsCount) {
            input += ")";
        } else {
            input += "*(";
        }
    }
 
    else {
        if (lastCalculation) resetCalculator(btnValue);
        else input += btnValue;
    }

 
    displayInput.value = input;
    displayResult.value = result;
    displayInput.scrollLeft = displayInput.scrollWidth;
};

// Add click event listeners to all buttons
buttons.forEach(button =>
    button.addEventListener("click", e =>
        calculate(e.target.textContent)
    )
);

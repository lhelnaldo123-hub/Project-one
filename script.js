// Calculator logic. No eval(): the maths is done with our own code.

const displayEl = document.getElementById("display");
const expressionEl = document.getElementById("expression");

// tokens holds finished parts of the expression, e.g. [5, "+", 3, "×"]
let tokens = [];
let current = "0";       // the number being typed
let justEvaluated = false;
let hasError = false;

const OPS = ["+", "−", "×", "÷"];

function render() {
  displayEl.textContent = current;
  displayEl.classList.toggle("error", hasError);
  expressionEl.textContent = tokens.join(" ");
}

function resetAll() {
  tokens = [];
  current = "0";
  justEvaluated = false;
  hasError = false;
}

function inputNumber(digit) {
  if (hasError || justEvaluated) resetAll();
  if (current === "0") current = digit;
  else if (current.length < 14) current += digit;
  render();
}

function inputDecimal() {
  if (hasError || justEvaluated) resetAll();
  if (!current.includes(".")) current += ".";
  render();
}

function inputOperator(op) {
  if (hasError) return;
  if (justEvaluated) {
    // keep going with the result: 8 then × 2
    tokens = [];
    justEvaluated = false;
  }
  const lastIsOp = OPS.includes(tokens[tokens.length - 1]);
  if (current === "" && lastIsOp) {
    // user changed their mind about the operator
    tokens[tokens.length - 1] = op;
  } else {
    tokens.push(parseFloat(current), op);
    current = "";
  }
  render();
  if (current === "") displayEl.textContent = tokens[tokens.length - 2];
}

function backspace() {
  if (hasError || justEvaluated) { resetAll(); render(); return; }
  if (current.length > 1) current = current.slice(0, -1);
  else current = "0";
  render();
}

// Evaluate with correct order of operations: × and ÷ first, then + and −
function calculate(list) {
  const first = [];
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    if (t === "×" || t === "÷") {
      const left = first.pop();
      const right = list[++i];
      if (t === "÷" && right === 0) return null; // division by zero
      first.push(t === "×" ? left * right : left / right);
    } else {
      first.push(t);
    }
  }
  let result = first[0];
  for (let i = 1; i < first.length; i += 2) {
    const right = first[i + 1];
    result = first[i] === "+" ? result + right : result - right;
  }
  return result;
}

function equals() {
  if (hasError || justEvaluated) return;
  if (current === "" ) current = String(tokens[tokens.length - 2]); // "5 +" then "="
  const list = [...tokens, parseFloat(current)];
  const result = calculate(list);

  expressionEl.textContent = list.join(" ") + " =";
  if (result === null) {
    current = "Cannot divide by 0";
    hasError = true;
    tokens = [];
    displayEl.textContent = current;
    displayEl.classList.add("error");
    return;
  }
  // round off floating point noise like 0.1 + 0.2
  current = String(parseFloat(result.toFixed(10)));
  tokens = [];
  justEvaluated = true;
  displayEl.textContent = current;
  displayEl.classList.remove("error");
}

// Event listeners (no inline onclick in the HTML)
document.querySelectorAll("[data-num]").forEach((btn) =>
  btn.addEventListener("click", () => inputNumber(btn.dataset.num))
);
document.querySelectorAll("[data-op]").forEach((btn) =>
  btn.addEventListener("click", () => inputOperator(btn.dataset.op))
);
document.getElementById("decimal").addEventListener("click", inputDecimal);
document.getElementById("equals").addEventListener("click", equals);
document.getElementById("backspace").addEventListener("click", backspace);
document.getElementById("clear").addEventListener("click", () => { resetAll(); render(); });

// Keyboard support (bonus)
document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputNumber(e.key);
  else if (e.key === ".") inputDecimal();
  else if (e.key === "+") inputOperator("+");
  else if (e.key === "-") inputOperator("−");
  else if (e.key === "*") inputOperator("×");
  else if (e.key === "/") { e.preventDefault(); inputOperator("÷"); }
  else if (e.key === "Enter" || e.key === "=") equals();
  else if (e.key === "Backspace") backspace();
  else if (e.key === "Escape") { resetAll(); render(); }
});

render();
    

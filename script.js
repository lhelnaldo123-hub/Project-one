// Calculator logic. No eval(): the maths is done with our own code.
// Bottom line = what you type (e.g. 1+2+6+7). Top line = the answer after "=".

const typedEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

const OPS = ["+", "−", "×", "÷"];
const MAX_LENGTH = 40;

let expr = "";            // everything the user has typed, as text
let justEvaluated = false;
let hasError = false;

function render() {
  typedEl.textContent = expr === "" ? "0" : expr;
  typedEl.scrollLeft = typedEl.scrollWidth; // keep the newest characters visible
}

function showResult(text, isError) {
  resultEl.textContent = text;
  resultEl.classList.toggle("error", Boolean(isError));
}

function clearResult() {
  showResult("", false);
  justEvaluated = false;
  hasError = false;
}

function lastChar() { return expr.slice(-1); }
function isOp(ch) { return OPS.includes(ch); }

// the number currently being typed (text after the last operator)
function currentNumber() {
  let i = expr.length;
  while (i > 0 && !isOp(expr[i - 1])) i--;
  return expr.slice(i);
}

function inputNumber(digit) {
  if (justEvaluated) { expr = ""; }   // start a fresh sum after an answer
  clearResult();
  if (expr.length >= MAX_LENGTH) return;
  if (currentNumber() === "0") expr = expr.slice(0, -1); // avoid 007
  expr += digit;
  render();
}

function inputDecimal() {
  if (justEvaluated) { expr = ""; }
  clearResult();
  if (expr.length >= MAX_LENGTH) return;
  const num = currentNumber();
  if (num.includes(".")) return;      // only one dot per number
  expr += num === "" ? "0." : ".";
  render();
}

function inputOperator(op) {
  if (justEvaluated) {
    // continue from the answer: 16 then × 2
    expr = resultEl.textContent.replace("-", "−");
  }
  clearResult();
  if (expr === "") {
    if (op === "−") { expr = "−"; render(); }  // allow a negative first number
    return;
  }
  if (expr === "−") return;
  if (isOp(lastChar())) expr = expr.slice(0, -1) + op; // change your mind
  else if (expr.length < MAX_LENGTH) expr += op;
  render();
}

function backspace() {
  // after "=", the sum stays on the bottom line so you can fix a mistake
  clearResult();
  expr = expr.slice(0, -1);
  render();
}

function clearAll() {
  expr = "";
  clearResult();
  showResult("", false);
  render();
}

// Turn "1+2×3" into numbers and operators: [1, "+", 2, "×", 3]
function tokenize(text) {
  const tokens = [];
  let buffer = "";
  for (const ch of text) {
    if (isOp(ch)) {
      if (buffer === "" && tokens.length === 0 && ch === "−") buffer = "-";
      else { tokens.push(parseFloat(buffer), ch); buffer = ""; }
    } else buffer += ch;
  }
  tokens.push(parseFloat(buffer));
  return tokens;
}

// Order of operations: × and ÷ first, then + and −
function calculate(list) {
  const first = [];
  for (let i = 0; i < list.length; i++) {
    const t = list[i];
    if (t === "×" || t === "÷") {
      const left = first.pop();
      const right = list[++i];
      if (t === "÷" && right === 0) return null; // division by zero
      first.push(t === "×" ? left * right : left / right);
    } else first.push(t);
  }
  let result = first[0];
  for (let i = 1; i < first.length; i += 2) {
    const right = first[i + 1];
    result = first[i] === "+" ? result + right : result - right;
  }
  return result;
}

function equals() {
  if (expr === "" || justEvaluated) return;
  // ignore a trailing operator, e.g. "5+" is treated as "5"
  while (isOp(lastChar())) expr = expr.slice(0, -1);
  if (expr === "" || expr === "−") { expr = ""; render(); return; }
  render();

  const result = calculate(tokenize(expr));
  if (result === null) {
    hasError = true;
    showResult("Cannot divide by 0", true);
    return;
  }
  // round off floating point noise like 0.1 + 0.2
  showResult(String(parseFloat(result.toFixed(10))), false);
  justEvaluated = true;
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
document.getElementById("clear").addEventListener("click", clearAll);

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
  else if (e.key === "Escape") clearAll();
});

render();

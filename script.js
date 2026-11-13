:root {
  --bg: #1d2b2a;
  --body: #2a3d3b;
  --screen: #c9d8c5;
  --screen-ink: #1d2b2a;
  --key: #f1efe7;
  --key-ink: #1d2b2a;
  --fn: #e0b44c;
  --op: #4f7f77;
  --equals: #d9553f;
  --light: #ffffff;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 10px;
  background: var(--bg);
  font-family: "Trebuchet MS", "Segoe UI", system-ui, sans-serif;
}

.calculator {
  width: 100%;
  max-width: 460px;
  padding: 20px;
  background: var(--body);
  border-radius: 22px;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
}

.screen {
  height: 130px;
  margin-bottom: 18px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  background: var(--screen);
  color: var(--screen-ink);
  border-radius: 10px;
  overflow: hidden;
}

.result {
  min-height: 28px;
  max-width: 100%;
  font-family: "Courier New", monospace;
  font-size: 1.7rem;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
}

.result.error { color: var(--equals); font-size: 1.1rem; }

.typed {
  max-width: 100%;
  font-family: "Courier New", monospace;
  font-size: 2.1rem;
  white-space: nowrap;
  overflow: hidden;
}

/* CSS Grid for the button layout */
.keys {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.key {
  padding: 22px 0;
  font-size: 1.5rem;
  font-weight: 700;
  font-family: inherit;
  color: var(--key-ink);
  background: var(--key);
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 0 rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: transform 0.08s, box-shadow 0.08s;
}

.key:active { transform: translateY(3px); box-shadow: 0 1px 0 rgba(0, 0, 0, 0.3); }
.key:focus-visible { outline: 3px solid var(--light); outline-offset: 2px; }

.fn { background: var(--fn); }
.op { background: var(--op); color: var(--light); }
.op.active { outline: 3px solid var(--light); }

.equals {
  grid-column: 4;
  grid-row: 4 / span 2;
  background: var(--equals);
  color: var(--light);
}

.zero { grid-column: 1 / span 2; }

@media (prefers-reduced-motion: reduce) {
  .key { transition: none; }
}

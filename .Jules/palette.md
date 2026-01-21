## 2024-05-23 - Semantic Steppers
**Learning:** Steppers built with `div`s are invisible to screen readers as ordered lists, making it hard to understand the process flow.
**Action:** Use `<ol>` and `<li>` for step containers, and `aria-current="step"` to indicate the active step.

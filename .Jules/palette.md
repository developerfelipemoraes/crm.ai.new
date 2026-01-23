## 2024-05-23 - Semantic Steppers
**Learning:** Steppers implemented with `<div>`s lack semantic meaning for screen readers, making navigation confusing.
**Action:** Always use `<ol>` and `<li>` for ordered steps, and utilize `aria-current="step"` to indicate the active step.

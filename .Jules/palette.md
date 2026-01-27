## 2024-05-22 - Wizard Validation UX
**Learning:** Disabling "Next" buttons in wizards prevents users from understanding what is missing. Keeping them enabled and showing a toast/error on click is better UX.
**Action:** In future wizard components, ensure navigation buttons are clickable and trigger validation feedback instead of being disabled.

## 2024-05-22 - Semantic Steppers
**Learning:** Using `div` soup for steppers hurts accessibility.
**Action:** Always use `<ol>` and `<li>` with `aria-current="step"` for multi-step indicators.

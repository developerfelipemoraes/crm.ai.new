## 2024-01-08 - Wizard Accessibility
**Learning:** Progress steps in wizards are often just colored divs, confusing screen reader users who miss the context of "where am I?".
**Action:** Always wrap steps in `role="list"`/`role="listitem"`, use `aria-label` for step names, and `aria-current="step"` for the active item.

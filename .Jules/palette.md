## 2025-05-18 - Semantic Wizards & Enabled Buttons
**Learning:** Wizards with multi-step indicators are often implemented as divs, which lack semantic meaning for screen readers. Using `<ol>` and `<li>` with `aria-current="step"` provides immediate context about progress.
**Action:** Always use ordered lists for wizard steps and include hidden text (sr-only) to describe the state (Completed/Current/Pending) of each step.

**Learning:** Disabling the "Next" button in forms prevents users from learning *why* they cannot proceed. Keeping it enabled and showing validation feedback on click triggers the existing error handling (like toasts) and improves usability significantly.
**Action:** Default to enabled navigation buttons in wizards; use click handlers to validate and provide specific feedback instead of silent disabled states.

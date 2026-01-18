## 2024-05-22 - Semantic Wizards
**Learning:** Converting `div`-based steppers to semantic `<nav>` and `<ol>` lists significantly improves screen reader experience by announcing list context and position (e.g., "1 of 11") automatically. Using `aria-current="step"` provides a standard way to indicate the active item.
**Action:** When auditing wizards, always replace `div` containers with `<ol>` and `<li>` structure, and ensure `sr-only` text is available for status updates (completed/current/pending).

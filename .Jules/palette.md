## 2025-01-10 - Accessibility in Multi-step Wizards
**Learning:** Visual indicators in wizards (like colored circles) are completely invisible to screen reader users without semantic roles and ARIA states. Users relying on assistive technology had no way to know their progress or current position.
**Action:** Always wrap step indicators in `role="list"`, use `aria-current="step"` for the active item, and provide verbose `aria-label` text that includes step status (e.g., "Step 1: Completed").

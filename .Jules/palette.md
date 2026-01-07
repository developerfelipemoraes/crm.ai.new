## 2024-05-23 - Wizard Accessibility Patterns
**Learning:** Complex multi-step wizards often neglect screen reader navigation. Visual indicators (steps) need semantic roles (`role="list"`, `role="listitem"`) and state attributes (`aria-current`, `aria-label`) to be accessible.
**Action:** When implementing wizards, always wrap steps in a list structure and provide clear state feedback to assistive technologies.

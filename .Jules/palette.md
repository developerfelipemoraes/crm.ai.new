## 2024-05-24 - Semantic Steppers & Error Feedback
**Learning:**
1. Custom progress steppers implemented with only divs and numbers are invisible to screen readers.
2. Disabling "Next" buttons on invalid forms prevents users from learning *why* they cannot proceed.
**Action:**
1. Wrap steps in `role="list"`, items in `role="listitem"`, and use `aria-current`.
2. Keep navigation buttons enabled and trigger validation feedback (toasts/messages) on click instead of disabling them.

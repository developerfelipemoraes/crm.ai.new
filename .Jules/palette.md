## 2024-05-18 - Making Selection Cards Accessible
**Learning:** Selection cards implemented as clickable divs are a common anti-pattern that breaks keyboard navigation.
**Action:** Wrap the card content in a semantic `<button>` element, move the `onClick` handler to the button, and ensure focus styles are visible.

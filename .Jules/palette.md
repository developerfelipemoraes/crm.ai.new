# Palette's Journal

## 2024-05-23 - Interactive Cards Accessibility
**Learning:** The application frequently uses `div` elements (specifically Shadcn `Card` components) as interactive selection items with `onClick` handlers but without semantic roles or keyboard support. This makes the wizard steps inaccessible to keyboard and screen reader users.
**Action:** When encountering interactive Cards, wrap them in semantic `<button>` elements with `type="button"`, `aria-pressed`, and appropriate focus styles. This provides built-in accessibility without rewriting the Card component logic.

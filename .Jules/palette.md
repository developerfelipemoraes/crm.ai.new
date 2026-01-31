## 2025-02-18 - Inaccessible Clickable Cards
**Learning:** The application frequently uses `Card` components with `onClick` handlers for selection interfaces, making them inaccessible to keyboard and screen reader users.
**Action:** When encountering clickable Cards, wrap them in a `<button type='button'>` with `text-left` and appropriate ARIA labels/attributes (like `aria-pressed`) instead of attaching `onClick` directly to the Card.

## 2024-05-22 - Dashboard Card Navigation
**Learning:** Wrapping Dashboard cards in `Link` components significantly improves navigation speed. Users expect summary cards to be clickable.
**Action:** For summary stats cards, always wrap the `Card` in a `Link` (or equivalent) pointing to the detail view, and add hover states (`hover:shadow-md`) to indicate interactivity. Use `block h-full` on the anchor to maintain grid layout.

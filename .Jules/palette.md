## 2024-05-22 - Non-semantic Card Interactions
**Learning:** `Card` components are frequently used as interactive elements with `onClick` but lack semantic button roles and keyboard accessibility.
**Action:** Wrap interactive `Card` components in `<button type="button" className="w-full text-left ...">` to ensure accessibility while maintaining the visual design.

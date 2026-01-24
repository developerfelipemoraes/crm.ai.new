## 2024-05-22 - Semantic Steppers
**Learning:** Wizards using `<div>` elements for steps miss critical accessibility context.
**Action:** Use `<ol>` and `<li>` with `aria-current="step"` for all future multi-step indicators to ensure screen readers understand the sequence.

## 2024-05-22 - Enabled Next Buttons
**Learning:** Disabling "Next" buttons frustrates users who don't know *why* they can't proceed.
**Action:** Keep "Next" buttons enabled and use `toast` or inline validation to explain missing requirements on click.

## 2025-02-20 - [Wizard Navigation Accessibility]
**Learning:** Disabled "Next" buttons in wizards create dead ends for users who don't know what they missed. Keeping them enabled and validating on click provides better feedback.
**Action:** Default `isNextDisabled` to false in wizards and ensure `handleNext` triggers a toast with specific validation errors.

# Test Strategy

## Scope

The automation validates the WOGAA Sentiments widget on desktop and mobile web, plus the Report a problem feature.

## Coverage approach

### Desktop Sentiments

Desktop Chrome is the primary regression environment. Coverage includes:

- widget and rating controls
- low/high rating question routing
- mandatory category validation
- `Other` conditional validation
- optional interest, text and email fields
- input boundaries and invalid emails
- minimum and complete submissions
- close/reset behaviour

### Mobile Sentiments

Mobile is tested separately because questions are displayed one at a time. The mobile suite uses six focused end-to-end and navigation scenarios rather than duplicating every desktop case.

### Report a problem

The bonus feature covers:

- default state
- description content and boundary checks
- screenshot type/size validation
- remove/replace upload behaviour
- mandatory description and confirmation rules
- successful submission
- reset after submission

The whitespace-only description behaviour is documented as a known defect and excluded from the standard automated run.

## Browser strategy

- Chrome/Chromium: primary functional regression
- WebKit: desktop Safari-engine compatibility
- Pixel 7: Android mobile web
- iPhone 13: iOS/WebKit mobile web

## Framework principles

- Gherkin describes behaviour.
- Steps remain thin.
- Page/component objects own selectors and interactions.
- Shared UI text and semantic keys live in `data/`.
- Playwright auto-waiting and web-first assertions are preferred over fixed waits.
- Screenshots, video and trace are retained on failures.

## Test data approach

Test data is kept simple and organized for maintainability.

- Reusable UI labels, messages, placeholders, and configuration values are maintained centrally in the `data/` folder.
- Feature files use semantic keys such as `technical_errors`, which are resolved to the current UI text.
- Scenario-specific inputs remain in Gherkin when they improve readability.
- Upload files used for validation are stored under `test-data/`.

Example:

```text
technical_errors -> Technical errors
unsupported_file_type -> Unsupported file type. Please upload a JPG, JPEG, or PNG file.
```

## Reporting

The framework generates:
- Playwright HTML report
- Cucumber HTML report
- JUnit XML report

For failed tests, Playwright also retains:
- screenshots
- video
- trace
These artifacts support failure analysis and debugging.

## Limitations

- The test environment requires public IP whitelisting.
- Safari compatibility is validated using Playwright WebKit, not the installed Safari application.
- Android and iOS coverage uses Playwright device emulation rather than physical devices.
- Mobile coverage is intentionally smaller than desktop because the mobile flow is tested using focused, risk-based scenarios.

## Out of scope

- API testing: No API contract or service documentation was provided. Required business flows are validated through the UI.
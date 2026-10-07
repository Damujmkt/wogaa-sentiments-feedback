# WOGAA Sentiments Test Automation

Automated test suite for the WOGAA Sentiments widget using Playwright, TypeScript, and Playwright-BDD.

## Prerequisites

- Node.js 18+
- npm
- VSCode
- Chrome
- Access to the WOGAA test environment
- Public IP whitelisted for:
  `https://beta-docs.wogaa.cloud`

## Setup

Clone the repository or extract the ZIP file, then run:

```bash
npm install
npx playwright install chromium webkit
```

## Run Tests
## Test Execution
For stable execution, tests are recommended to be run by project.

Run Desktop Chrome only:

```bash
npm run test:chrome
```

Run Webkit-Safari Compatabile only:

```bash
npm run test:safari
```

Run mobile tests:

```bash
npm run test:mobile
```
Run tests by scenario tagging:

```bash
npm run test:tag -- --grep "@sentiments"
```
Run the complete test suite across all configured browser and mobile projects:

```bash
npm test
```

For additional execution commands, refer to the `scripts` section in `package.json`.

## Reports

The test execution generates:

- Playwright HTML Report
- Cucumber HTML Report
- JUnit XML Report

Open the Playwright HTML report:

```bash
npm run report
```

Report locations:

```text
reports/
├── playwright/
├── cucumber/
└── junit/
```

## Browser and Device Coverage

The suite is configured for:

- Desktop Chrome
- Desktop Safari compatibility using Playwright WebKit
- Android Mobile
- iOS Mobile

## Project Structure

```text
features/       BDD feature files
steps/          Step definitions
pages/          Page / component objects
fixtures/       Playwright fixtures
data/           Test data and UI configuration
test-data/      Test files used during execution
docs/           Supporting documentation
```

## Notes

- Scenarios tagged with `@manual` are excluded from normal automated execution.
- Screenshots, videos, and traces are retained for failed tests.
- The WOGAA test environment requires IP whitelisting before execution.

import {
  BUTTON_STATES,
  REPORT_PROBLEM,
  getReportProblemMessage,
} from '../data/report-problem.data';
import { Given, Then, When } from '../fixtures/test.fixture';

Given('the user opens the Report a problem form', async ({ reportProblemPanel }) => {
  await reportProblemPanel.open();
});

Then('the Report a problem form should be displayed', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectDisplayed();
});

Then('the Report a problem form should remain displayed', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectDisplayed();
});

Then('the problem details field should be empty', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectDetailsEmpty();
});

Then(
  'the configured problem details placeholder should be displayed',
  async ({ reportProblemPanel }) => {
    await reportProblemPanel.expectDetailsPlaceholder(REPORT_PROBLEM.placeholders.details);
  },
);

Then(
  'the character counter should show the configured default value',
  async ({ reportProblemPanel }) => {
    await reportProblemPanel.expectCharacterCounter(REPORT_PROBLEM.counters.empty);
  },
);

Then('the confirmation checkbox should be unchecked', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectConfirmationUnchecked();
});

Then('the Submit button should be displayed', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectSubmitVisible();
});

Then(
  'the Submit button should become {word}',
  async ({ reportProblemPanel }, buttonState: string) => {
    const expectedState = BUTTON_STATES[buttonState.toLowerCase()];
    if (expectedState === undefined) {
      throw new Error(`Invalid button state: "${buttonState}".`);
    }
    await reportProblemPanel.expectSubmitState(expectedState);
  },
);

When(
  'the user enters {string} as problem details',
  async ({ reportProblemPanel }, description: string) => {
    await reportProblemPanel.enterDetails(description);
  },
);

Then(
  'the problem details should contain {string}',
  async ({ reportProblemPanel }, expected: string) => {
    await reportProblemPanel.expectDetailsValue(expected);
  },
);

When(
  'the user types {int} characters into the problem details field',
  async ({ reportProblemPanel }, inputLength: number) => {
    await reportProblemPanel.enterDetailsLength(inputLength);
  },
);

Then(
  'the problem details should contain {int} characters',
  async ({ reportProblemPanel }, expectedLength: number) => {
    await reportProblemPanel.expectDetailsLength(expectedLength);
  },
);

When('the user uploads {string}', async ({ reportProblemPanel }, fileName: string) => {
  await reportProblemPanel.uploadScreenshot(fileName);
});

Given('the user has uploaded {string}', async ({ reportProblemPanel }, fileName: string) => {
  await reportProblemPanel.uploadScreenshot(fileName);
});

When(
  'the user uploads invalid document {string}',
  async ({ reportProblemPanel }, fileName: string) => {
    await reportProblemPanel.uploadInvalidFile(fileName);
  },
);

Then('one screenshot should be attached', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectScreenshotCount(1);
});

Then('no screenshot should be attached', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectScreenshotCount(0);
});

Then(
  'the uploaded filename {string} should be displayed',
  async ({ reportProblemPanel }, fileName: string) => {
    await reportProblemPanel.expectUploadedFileName(fileName);
  },
);

Then(
  'the filename {string} should not be displayed as an attached screenshot',
  async ({ reportProblemPanel }, fileName: string) => {
    await reportProblemPanel.expectFileNameHidden(fileName);
  },
);

Then('a remove screenshot control should be available', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectRemoveScreenshotAvailable();
});

When('the user removes the uploaded screenshot', async ({ reportProblemPanel }) => {
  await reportProblemPanel.removeScreenshot();
});

Then('the screenshot upload control should be available', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectUploadAvailable();
});

When('the user selects the confirmation checkbox', async ({ reportProblemPanel }) => {
  await reportProblemPanel.setConfirmation(true);
});

Given(
  'the confirmation checkbox state is {string}',
  async ({ reportProblemPanel }, state: string) => {
    if (state !== 'checked' && state !== 'unchecked') {
      throw new Error(`Unsupported confirmation checkbox state: "${state}".`);
    }
    await reportProblemPanel.setConfirmation(state === 'checked');
  },
);

Given(
  'the problem details state is {string}',
  async ({ reportProblemPanel }, state: string) => {
    switch (state) {
      case 'empty':
        await reportProblemPanel.clearDetails();
        break;
      case 'whitespace':
        await reportProblemPanel.enterDetails('   ');
        break;
      case 'valid':
        await reportProblemPanel.enterDetails(REPORT_PROBLEM.validDescription);
        break;
      default:
        throw new Error(`Unsupported problem details state: "${state}".`);
    }
  },
);

Given(
  'the screenshot state is {string}',
  async ({ reportProblemPanel }, state: string) => {
    if (state === 'none') {
      return;
    }
    if (state === 'valid') {
      await reportProblemPanel.uploadScreenshot(REPORT_PROBLEM.validScreenshot);
      return;
    }
    throw new Error(`Unsupported screenshot state: "${state}".`);
  },
);

When('the user closes the Report a problem form', async ({ reportProblemPanel }) => {
  await reportProblemPanel.close();
});

When('the user submits the problem report', async ({ reportProblemPanel }) => {
  await reportProblemPanel.submit();
});

Then('the problem report should not be submitted', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectNotSubmitted();
});

Then('the configured Report a problem success acknowledgement should be displayed', async ({ reportProblemPanel }) => {
  await reportProblemPanel.expectSuccess(getReportProblemMessage('success'));
});

Then(
  'the configured upload error {string} should be displayed',
  async ({ reportProblemPanel }, messageKey: string) => {
    await reportProblemPanel.expectUploadError(getReportProblemMessage(messageKey));
  },
);

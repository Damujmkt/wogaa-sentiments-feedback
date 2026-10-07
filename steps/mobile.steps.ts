import { getInterestLabel } from '../data/sentiments.data';
import { Then, When } from '../fixtures/test.fixture';

When('the user continues to the next mobile question', async ({ sentimentsWidget }) => {
  await sentimentsWidget.nextMobileQuestion();
});

When('the user skips the optional mobile question', async ({ sentimentsWidget }) => {
  await sentimentsWidget.skipMobileQuestion();
});

Then(
  'mobile feedback step {string} should be displayed',
  async ({ sentimentsWidget }, progress: string) => {
    const match = progress.trim().match(/^(\d+)\s+of\s+(\d+)$/i);
    if (!match) {
      throw new Error(`Invalid mobile progress: "${progress}".`);
    }

    await sentimentsWidget.expectMobileProgress(Number(match[1]), Number(match[2]));
  },
);

Then('the mobile NEXT button should be disabled', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectMobileNextDisabled();
});

Then('the mobile NEXT button should be enabled', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectMobileNextEnabled();
});

When(
  'the user selects mobile interest {string}',
  async ({ sentimentsWidget }, interestKey: string) => {
    await sentimentsWidget.selectInterest(getInterestLabel(interestKey, true));
  },
);

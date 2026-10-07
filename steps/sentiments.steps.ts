import {
  FEEDBACK_BOUNDARIES,
  FEEDBACK_BUTTON_STATES,
  feedbackOptions,
  getFeedbackCategoryLabel,
  getHeadingText,
  getInterestLabel,
  getLabelText,
  getMessageText,
  getPlaceholderText,
  getQuestionText,
  interestOptions,
  SENTIMENTS,
} from '../data/sentiments.data';
import { Given, Then, When, expect } from '../fixtures/test.fixture';

type BddDataTable = {
  hashes(): Array<Record<string, string>>;
};

function valuesFromTable(dataTable: BddDataTable, columns: string[]): string[] {
  const values = dataTable
    .hashes()
    .map((row) => columns.map((column) => row[column]?.trim()).find(Boolean))
    .filter((value): value is string => Boolean(value));

  if (values.length === 0) {
    throw new Error(`No values found in DataTable columns: ${columns.join(', ')}`);
  }

  return values;
}

Given('the Sentiments widget is available', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectAvailable();
});

When('I open the Sentiments widget', async ({ sentimentsWidget }) => {
  await sentimentsWidget.open();
});

Then('the feedback widget should be displayed', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectWidgetDisplayed();
});

Then(
  'the configured {string} heading should be displayed',
  async ({ sentimentsWidget }, headingKey: string) => {
    await sentimentsWidget.expectHeading(getHeadingText(headingKey));
  },
);

Then(
  'the configured {string} question should be displayed',
  async ({ sentimentsWidget }, questionKey: string) => {
    await sentimentsWidget.expectQuestion(getQuestionText(questionKey));
  },
);

Then(
  'the configured {string} question should be displayed as optional',
  async ({ sentimentsWidget }, questionKey: string) => {
    await sentimentsWidget.expectOptionalQuestion(getQuestionText(questionKey));
  },
);

Then('all configured rating options should be available', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectRatingsOneToSix();
});

Then(
  'rating {int} should represent configured {string} label',
  async ({ sentimentsWidget }, rating: number, labelKey: string) => {
    await sentimentsWidget.expectRatingMeaning(rating, getLabelText(labelKey));
  },
);

Then('the configured Report a problem option should be displayed', async ({ sentimentsWidget }) => {
  await expect(sentimentsWidget.reportProblemOption).toBeVisible();
});

When('the user selects rating {int}', async ({ sentimentsWidget }, rating: number) => {
  await sentimentsWidget.chooseRating(rating);
});

Given('the user has selected rating {int}', async ({ sentimentsWidget }, rating: number) => {
  await sentimentsWidget.open();
  await sentimentsWidget.chooseRating(rating);
});

Then('rating {int} should be selected', async ({ sentimentsWidget }, _rating: number) => {
  await sentimentsWidget.expectRatingAccepted();
});

Then(
  'the configured {string} form should be displayed',
  async ({ sentimentsWidget }, headingKey: string) => {
    await sentimentsWidget.expectHeading(getHeadingText(headingKey));
    await sentimentsWidget.expectFeedbackFormDisplayed();
  },
);

Then(
  'all configured {string} feedback categories should be available',
  async ({ sentimentsWidget }, group: string) => {
    if (group !== 'low' && group !== 'high') {
      throw new Error(`Unsupported rating group: "${group}".`);
    }
    await sentimentsWidget.expectFeedbackCategories(feedbackOptions[group]);
  },
);

When(
  'the user selects feedback category {string}',
  async ({ sentimentsWidget }, categoryKey: string) => {
    await sentimentsWidget.selectFeedbackOption(getFeedbackCategoryLabel(categoryKey));
  },
);

Given(
  'the user has selected feedback category {string}',
  async ({ sentimentsWidget }, categoryKey: string) => {
    await sentimentsWidget.selectFeedbackOption(getFeedbackCategoryLabel(categoryKey));
  },
);

When(
  'the user deselects feedback category {string}',
  async ({ sentimentsWidget }, categoryKey: string) => {
    await sentimentsWidget.deselectFeedbackOption(getFeedbackCategoryLabel(categoryKey));
  },
);

Then(
  'the feedback category {string} should be selected',
  async ({ sentimentsWidget }, categoryKey: string) => {
    await sentimentsWidget.expectFeedbackCategorySelected(
      getFeedbackCategoryLabel(categoryKey),
      true,
    );
  },
);

Then(
  'the feedback category {string} should be unselected',
  async ({ sentimentsWidget }, categoryKey: string) => {
    await sentimentsWidget.expectFeedbackCategorySelected(
      getFeedbackCategoryLabel(categoryKey),
      false,
    );
  },
);

When(
  'the user selects the following feedback categories:',
  async ({ sentimentsWidget }, dataTable: BddDataTable) => {
    for (const categoryKey of valuesFromTable(dataTable, ['categoryKey', 'category'])) {
      await sentimentsWidget.selectFeedbackOption(getFeedbackCategoryLabel(categoryKey));
    }
  },
);

Then('all selected feedback categories should remain selected', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectTrackedFeedbackSelections();
});

Given('no feedback category is selected', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectNoFeedbackCategorySelected();
});

Then('the Other elaboration field should be displayed', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectOtherElaborationDisplayed();
});

Then('the Other elaboration field should be mandatory', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectOtherElaborationMandatory();
});

Given('the Other elaboration field is empty', async ({ sentimentsWidget }) => {
  await sentimentsWidget.clearOtherElaboration();
});

When(
  'the user enters {string} in the Other elaboration field',
  async ({ sentimentsWidget }, value: string) => {
    await sentimentsWidget.enterOtherElaboration(value);
  },
);

Then(
  'the Other elaboration should contain {string}',
  async ({ sentimentsWidget }, expectedValue: string) => {
    await sentimentsWidget.expectOtherElaborationValue(expectedValue);
  },
);

Then('the Other elaboration field should not be required', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectOtherElaborationNotRequired();
});

Then('all configured interest options should be available', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectInterestOptions(Object.values(interestOptions));
});

When(
  'the user selects the following interests:',
  async ({ sentimentsWidget }, dataTable: BddDataTable) => {
    for (const interestKey of valuesFromTable(dataTable, ['interestKey', 'interest'])) {
      await sentimentsWidget.selectInterest(getInterestLabel(interestKey));
    }
  },
);

Then('all selected interests should remain selected', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectTrackedInterestsSelected();
});

When(
  'the user selects interest {string}',
  async ({ sentimentsWidget }, interestKey: string) => {
    await sentimentsWidget.selectInterest(getInterestLabel(interestKey));
  },
);

Given('no area of interest is selected', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectNoInterestSelected();
});

Then(
  'the feedback text field should display the configured {string} placeholder',
  async ({ sentimentsWidget }, placeholderKey: string) => {
    await sentimentsWidget.expectFeedbackPlaceholder(getPlaceholderText(placeholderKey));
  },
);

Then(
  'the feedback character counter should show the configured default value',
  async ({ sentimentsWidget }) => {
    await sentimentsWidget.expectFeedbackCounterText(
      `0/${SENTIMENTS.feedbackMaxLength} characters`,
    );
  },
);

When(
  'the user enters {string} in the optional feedback field',
  async ({ sentimentsWidget }, value: string) => {
    await sentimentsWidget.enterOptionalFeedback(value);
  },
);

Then(
  'the optional feedback field should contain {string}',
  async ({ sentimentsWidget }, expectedValue: string) => {
    await sentimentsWidget.expectOptionalFeedbackValue(expectedValue);
  },
);

Then('the character counter should reflect the entered text length', async ({ sentimentsWidget }) => {
  const actualLength = await sentimentsWidget.getOptionalFeedbackLength();
  await sentimentsWidget.expectFeedbackCharacterCount(actualLength);
});

When(
  'the user enters feedback text at the {string} boundary',
  async ({ sentimentsWidget }, boundaryKey: string) => {
    const length = FEEDBACK_BOUNDARIES[boundaryKey];
    if (length === undefined) {
      throw new Error(`Unsupported feedback boundary: "${boundaryKey}".`);
    }
    await sentimentsWidget.enterOptionalFeedbackLength(length);
  },
);

Then(
  'the feedback character count should match the {string} boundary',
  async ({ sentimentsWidget }, boundaryKey: string) => {
    const length = FEEDBACK_BOUNDARIES[boundaryKey];
    if (length === undefined) {
      throw new Error(`Unsupported feedback boundary: "${boundaryKey}".`);
    }
    await sentimentsWidget.expectFeedbackCharacterCount(length);
  },
);

Given('the email field is empty', async ({ sentimentsWidget }) => {
  await sentimentsWidget.clearEmail();
});

When(
  'the user enters {string} in the email field',
  async ({ sentimentsWidget }, email: string) => {
    await sentimentsWidget.enterEmail(email);
  },
);

Then('no email validation error should be displayed', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectNoEmailValidationError();
});

Then('the configured email validation message should be displayed', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectEmailValidationMessage(getMessageText('email_validation'));
});

Then('the Submit button should be disabled', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectSubmitDisabled();
});

Then('the Submit button should be enabled', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectSubmitEnabled();
});

Then(
  'the feedback Submit button should become {word}',
  async ({ sentimentsWidget }, buttonState: string) => {
    const expectedState = FEEDBACK_BUTTON_STATES[buttonState.toLowerCase()];
    if (expectedState === undefined) {
      throw new Error(`Unsupported feedback button state: "${buttonState}".`);
    }
    await sentimentsWidget.expectSubmitState(expectedState);
  },
);

When('the user submits the feedback', async ({ sentimentsWidget }) => {
  await sentimentsWidget.submit();
});

Then('the configured success acknowledgement should be displayed', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectAcknowledgement(getMessageText('success'));
});

When('the user closes the feedback form', async ({ sentimentsWidget }) => {
  await sentimentsWidget.close();
});

Then('the feedback form should not be displayed', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectFeedbackFormHidden();
});

Then('the rating selection screen should be displayed', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectRatingSelectionScreen();
});

Then('no rating should be selected', async ({ sentimentsWidget }) => {
  await sentimentsWidget.expectNoRatingSelected();
});

When('the user starts a fresh Sentiments session', async ({ sentimentsWidget }) => {
  await sentimentsWidget.openFreshSession();
});

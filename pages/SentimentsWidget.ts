import { expect, type Locator, type Page } from '@playwright/test';

import { feedbackOptions, interestOptions, SENTIMENTS } from '../data/sentiments.data';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class SentimentsWidget {
  private readonly selectedFeedbackOptions = new Set<string>();
  private readonly selectedInterestOptions = new Set<string>();

  constructor(private readonly page: Page) {}

  private get host(): Locator {
    return this.page.locator('wog-sentiments').first();
  }

  private get trigger(): Locator {
    const triggerText = new RegExp(escapeRegExp(SENTIMENTS.labels.trigger), 'i');
    return this.page
      .getByRole('button', { name: triggerText })
      .or(this.page.getByText(triggerText, { exact: false }))
      .first();
  }

  get widgetHeading(): Locator {
    return this.host.getByText(SENTIMENTS.headings.widget, { exact: true }).first();
  }

  get feedbackHeading(): Locator {
    return this.host.getByText(SENTIMENTS.headings.feedback, { exact: true }).first();
  }

  get ratingQuestion(): Locator {
    return this.host.getByText(SENTIMENTS.questions.rating, { exact: true }).first();
  }

  get reportProblemOption(): Locator {
    return this.host.getByText(SENTIMENTS.labels.report_problem, { exact: true }).first();
  }

  get submitButton(): Locator {
    return this.host
      .getByRole('button', {
        name: new RegExp(`^${escapeRegExp(SENTIMENTS.labels.submit)}$`, 'i'),
      })
      .first();
  }

  get otherElaborationField(): Locator {
    return this.host
      .getByPlaceholder(SENTIMENTS.placeholders.otherElaboration, { exact: true })
      .first();
  }

  get optionalFeedbackField(): Locator {
    return this.host
      .getByPlaceholder(SENTIMENTS.placeholders.feedback, { exact: true })
      .first();
  }

  get feedbackCharacterCounter(): Locator {
    return this.host
      .getByText(
        new RegExp(
          `\\d+\\s*\\/\\s*${SENTIMENTS.feedbackMaxLength}\\s*characters`,
          'i',
        ),
      )
      .first();
  }

  get emailField(): Locator {
    return this.host
      .getByLabel(new RegExp(escapeRegExp(SENTIMENTS.labels.email), 'i'))
      .or(this.host.locator('input[type="email"]'))
      .first();
  }

  get emailValidationMessage(): Locator {
    return this.host.getByText(SENTIMENTS.messages.email_validation, { exact: true }).first();
  }

  private get closeButton(): Locator {
    return this.host.getByRole('button', { name: /close/i }).first();
  }

  private get nextButton(): Locator {
    return this.host.getByRole('button', { name: /^next$/i }).first();
  }

  private get skipButton(): Locator {
    return this.host.getByRole('button', { name: /^skip$/i }).first();
  }

  async expectAvailable(): Promise<void> {
    await expect(this.trigger).toBeVisible();
  }

  async open(): Promise<void> {
    if (await this.ratingQuestion.isVisible().catch(() => false)) {
      return;
    }

    if (await this.feedbackHeading.isVisible().catch(() => false)) {
      return;
    }

    await expect(this.trigger).toBeVisible({ timeout: 5_000 });
    await this.trigger.click();
    await expect(this.ratingQuestion).toBeVisible({ timeout: 5_000 });
  }

  async openFreshSession(): Promise<void> {
    await this.page.reload({ waitUntil: 'domcontentloaded' });
    await this.open();
  }

  async expectWidgetDisplayed(): Promise<void> {
    await expect(this.widgetHeading).toBeVisible();
    await expect(this.ratingQuestion).toBeVisible();
  }

  async expectHeading(expectedHeading: string): Promise<void> {
    await expect(this.host.getByText(expectedHeading, { exact: true }).first()).toBeVisible();
  }

  async expectQuestion(question: string): Promise<void> {
    await expect(
      this.host.getByText(new RegExp(escapeRegExp(question), 'i')).first(),
    ).toBeVisible();
  }

  async expectOptionalQuestion(question: string): Promise<void> {
    await expect(
      this.host
        .getByText(new RegExp(`${escapeRegExp(question)}\\s*\\(Optional\\)`, 'i'))
        .first(),
    ).toBeVisible();
  }

  ratingControl(rating: number): Locator {
    if (rating < SENTIMENTS.rating.min || rating > SENTIMENTS.rating.max) {
      throw new Error(
        `Rating must be between ${SENTIMENTS.rating.min} and ${SENTIMENTS.rating.max}. Received: ${rating}`,
      );
    }

    return this.host
      .getByRole('button', {
        name: new RegExp(`^Rate\\s+${rating}\\s+of\\s+${SENTIMENTS.rating.max},`, 'i'),
      })
      .first();
  }

  async expectRatingsOneToSix(): Promise<void> {
    for (let rating = SENTIMENTS.rating.min; rating <= SENTIMENTS.rating.max; rating += 1) {
      await expect(this.ratingControl(rating)).toBeVisible();
    }
  }

  async expectRatingMeaning(rating: number, meaning: string): Promise<void> {
    await expect(this.ratingControl(rating)).toHaveAttribute(
      'aria-label',
      new RegExp(escapeRegExp(meaning), 'i'),
    );
  }

  async chooseRating(rating: number): Promise<void> {
    const control = this.ratingControl(rating);
    await expect(control).toBeVisible();
    await control.click();
  }

  async expectRatingAccepted(): Promise<void> {
    await expect(this.feedbackHeading).toBeVisible();
  }

  async expectFeedbackFormDisplayed(): Promise<void> {
    await expect(this.feedbackHeading).toBeVisible();
  }

  feedbackCategory(option: string): Locator {
    return this.host
      .getByRole('checkbox', {
        name: new RegExp(`^${escapeRegExp(option)},\\s*category chip$`, 'i'),
      })
      .first();
  }

  async expectFeedbackCategories(options: readonly string[]): Promise<void> {
    for (const option of options) {
      await expect(this.feedbackCategory(option)).toBeVisible();
    }
  }

  async setFeedbackCategory(option: string, selected: boolean): Promise<void> {
    const control = this.feedbackCategory(option);
    await expect(control).toBeVisible();

    const isSelected = (await control.getAttribute('aria-checked')) === 'true';
    if (isSelected !== selected) {
      await control.click();
    }

    await expect(control).toHaveAttribute('aria-checked', selected ? 'true' : 'false');

    if (selected) {
      this.selectedFeedbackOptions.add(option);
    } else {
      this.selectedFeedbackOptions.delete(option);
    }
  }

  async selectFeedbackOption(option: string): Promise<void> {
    await this.setFeedbackCategory(option, true);
  }

  async deselectFeedbackOption(option: string): Promise<void> {
    await this.setFeedbackCategory(option, false);
  }

  async expectFeedbackCategorySelected(option: string, selected: boolean): Promise<void> {
    await expect(this.feedbackCategory(option)).toHaveAttribute(
      'aria-checked',
      selected ? 'true' : 'false',
    );
  }

  async expectTrackedFeedbackSelections(): Promise<void> {
    for (const option of this.selectedFeedbackOptions) {
      await this.expectFeedbackCategorySelected(option, true);
    }
  }

  async expectNoFeedbackCategorySelected(): Promise<void> {
    const options = [...new Set([...feedbackOptions.low, ...feedbackOptions.high])];

    for (const option of options) {
      const control = this.feedbackCategory(option);
      if (await control.isVisible().catch(() => false)) {
        await expect(control).toHaveAttribute('aria-checked', 'false');
      }
    }
  }

  async expectOtherElaborationDisplayed(): Promise<void> {
    await expect(this.otherElaborationField).toBeVisible();
  }

  async expectOtherElaborationMandatory(): Promise<void> {
    await expect(this.otherElaborationField).toBeVisible();
    await expect(this.otherElaborationField).toHaveValue('');
    await expect(this.submitButton).toBeDisabled();
  }

  async clearOtherElaboration(): Promise<void> {
    await this.otherElaborationField.fill('');
  }

  async enterOtherElaboration(value: string): Promise<void> {
    await expect(this.otherElaborationField).toBeVisible();
    await this.otherElaborationField.fill(value);
  }

  async expectOtherElaborationValue(value: string): Promise<void> {
    await expect(this.otherElaborationField).toHaveValue(value);
  }

  async expectOtherElaborationNotRequired(): Promise<void> {
    if (!(await this.otherElaborationField.isVisible().catch(() => false))) {
      return;
    }

    await expect(this.otherElaborationField).not.toHaveAttribute('aria-required', 'true');
  }

  interestCheckbox(interest: string): Locator {
    return this.host
      .getByRole('checkbox', {
        name: new RegExp(`^${escapeRegExp(interest)}$`, 'i'),
      })
      .first();
  }

  async expectInterestOptions(options: readonly string[]): Promise<void> {
    for (const option of options) {
      await expect(this.interestCheckbox(option)).toBeVisible();
    }
  }

  async selectInterest(interest: string): Promise<void> {
    const checkbox = this.interestCheckbox(interest);
    await expect(checkbox).toBeVisible();

    if (!(await checkbox.isChecked())) {
      await checkbox.check();
    }

    await expect(checkbox).toBeChecked();
    this.selectedInterestOptions.add(interest);
  }

  async expectTrackedInterestsSelected(): Promise<void> {
    for (const interest of this.selectedInterestOptions) {
      await expect(this.interestCheckbox(interest)).toBeChecked();
    }
  }

  async expectNoInterestSelected(): Promise<void> {
    for (const interest of Object.values(interestOptions)) {
      const checkbox = this.interestCheckbox(interest);
      if (await checkbox.isVisible().catch(() => false)) {
        await expect(checkbox).not.toBeChecked();
      }
    }
  }

  async enterOptionalFeedback(value: string): Promise<void> {
    await expect(this.optionalFeedbackField).toBeVisible();
    await this.optionalFeedbackField.fill(value);
  }

  async enterOptionalFeedbackLength(length: number): Promise<void> {
    await this.enterOptionalFeedback('A'.repeat(length));
  }

  async expectOptionalFeedbackValue(value: string): Promise<void> {
    await expect(this.optionalFeedbackField).toHaveValue(value);
  }

  async expectFeedbackPlaceholder(expected: string): Promise<void> {
    await expect(this.optionalFeedbackField).toHaveAttribute('placeholder', expected);
  }

  async expectFeedbackCounterText(expected: string): Promise<void> {
    await expect(this.feedbackCharacterCounter).toContainText(expected);
  }

  async expectFeedbackCharacterCount(expectedLength: number): Promise<void> {
    await expect(this.feedbackCharacterCounter).toHaveText(
      new RegExp(
        `^${expectedLength}\\s*\\/\\s*${SENTIMENTS.feedbackMaxLength}\\s*characters$`,
        'i',
      ),
    );
  }

  async getOptionalFeedbackLength(): Promise<number> {
    return (await this.optionalFeedbackField.inputValue()).length;
  }

  async clearEmail(): Promise<void> {
    await expect(this.emailField).toBeVisible();
    await this.emailField.fill('');
    await this.emailField.blur();
  }

  async enterEmail(email: string): Promise<void> {
    await expect(this.emailField).toBeVisible();
    await this.emailField.fill(email);
    await expect(this.emailField).toHaveValue(email);
    await this.emailField.blur();
  }

  async expectNoEmailValidationError(): Promise<void> {
    await expect(this.emailValidationMessage).toBeHidden();
  }

  async expectEmailValidationMessage(expected: string): Promise<void> {
    await expect(this.host.getByText(expected, { exact: true }).first()).toBeVisible();
  }

  async expectSubmitDisabled(): Promise<void> {
    await expect(this.submitButton).toBeDisabled();
  }

  async expectSubmitEnabled(): Promise<void> {
    await expect(this.submitButton).toBeEnabled();
  }

  async expectSubmitState(expectedEnabled: boolean): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ enabled: expectedEnabled });
  }

  async submit(): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ timeout: 5_000 });
    await this.submitButton.click();
  }

  async expectAcknowledgement(expectedMessage: string): Promise<void> {
    await expect(this.host.getByText(expectedMessage, { exact: true }).first()).toBeVisible({
      timeout: 5_000,
    });
  }

  async close(): Promise<void> {
    await expect(this.closeButton).toBeVisible();
    await this.closeButton.click();
    await expect(this.feedbackHeading).toBeHidden();
  }

  async expectFeedbackFormHidden(): Promise<void> {
    await expect(this.feedbackHeading).toBeHidden();
  }

  async expectRatingSelectionScreen(): Promise<void> {
    await expect(this.ratingQuestion).toBeVisible();
    await this.expectRatingsOneToSix();
  }

  async expectNoRatingSelected(): Promise<void> {
    await expect(this.ratingQuestion).toBeVisible();
    await expect(this.feedbackHeading).toBeHidden();
  }

  async expectMobileProgress(current: number, total: number): Promise<void> {
    await expect(this.host).toContainText(new RegExp(`${current}\\s*of\\s*${total}`, 'i'));
  }

  async expectMobileNextEnabled(): Promise<void> {
    await expect(this.nextButton).toBeVisible();
    await expect(this.nextButton).toBeEnabled();
  }

  async expectMobileNextDisabled(): Promise<void> {
    await expect(this.nextButton).toBeVisible();
    await expect(this.nextButton).toBeDisabled();
  }

  async nextMobileQuestion(): Promise<void> {
    await this.expectMobileNextEnabled();
    await this.nextButton.click();
  }

  async skipMobileQuestion(): Promise<void> {
    await expect(this.skipButton).toBeVisible();
    await expect(this.skipButton).toBeEnabled();
    await this.skipButton.click();
  }
}

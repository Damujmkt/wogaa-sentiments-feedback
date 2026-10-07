import path from 'path';
import { expect, type Locator, type Page } from '@playwright/test';

import { REPORT_PROBLEM } from '../data/report-problem.data';

export class ReportProblemPanel {
  constructor(private readonly page: Page) {}

  private get host(): Locator {
    return this.page.locator('wog-bug-report-form').first();
  }

  private get trigger(): Locator {
    return this.page
      .locator('wog-sentiments')
      .getByText(REPORT_PROBLEM.labels.trigger, { exact: true })
      .first();
  }

  get detailsField(): Locator {
    return this.host.getByPlaceholder(REPORT_PROBLEM.placeholders.details).first();
  }

  get characterCounter(): Locator {
    return this.host.locator('[aria-label^="Character count,"]').first();
  }

  get uploadedFile(): Locator {
    return this.host.locator('.wog--file-info-section');
  }

  get uploadedFileName(): Locator {
    return this.host.locator('.wog--file-name');
  }

  get removeScreenshotButton(): Locator {
    return this.host.locator('.wog--remove-image-btn').first();
  }

  get uploadButton(): Locator {
    return this.host.getByRole('button', { name: /^upload$/i }).first();
  }

  get uploadInput(): Locator {
    return this.host.locator('input[type="file"]').last();
  }

  get confirmationCheckbox(): Locator {
    return this.host.locator('.wog--brt-checkbox-input').first();
  }

  get submitButton(): Locator {
    return this.host.getByRole('button', { name: /^submit$/i }).first();
  }

  get successAcknowledgement(): Locator {
    return this.page.getByText(REPORT_PROBLEM.messages.success, { exact: true }).first();
  }

  private get closeButton(): Locator {
    return this.host.getByRole('button', { name: /close/i }).first();
  }

  private fixturePath(fileName: string): string {
    return path.resolve(process.cwd(), REPORT_PROBLEM.fixtureDirectory, fileName);
  }

  async open(): Promise<void> {
    if (await this.detailsField.isVisible().catch(() => false)) {
      return;
    }

    await expect(this.trigger).toBeVisible();
    await this.trigger.click();
    await this.expectDisplayed();
  }

  async close(): Promise<void> {
    await expect(this.closeButton).toBeVisible();
    await this.closeButton.click();
    await expect(this.detailsField).toBeHidden();
  }

  async expectDisplayed(): Promise<void> {
    await expect(this.detailsField).toBeVisible();
    await expect(this.confirmationCheckbox).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }

  async expectDetailsEmpty(): Promise<void> {
    await expect(this.detailsField).toHaveValue('');
  }

  async expectDetailsPlaceholder(expected: string): Promise<void> {
    await expect(this.detailsField).toHaveAttribute('placeholder', expected);
  }

  async expectCharacterCounter(expected: string): Promise<void> {
    await expect(this.characterCounter).toHaveText(expected);
  }

  async enterDetails(value: string): Promise<void> {
    await expect(this.detailsField).toBeVisible();
    await this.detailsField.fill(value);
  }

  async clearDetails(): Promise<void> {
    await this.detailsField.fill('');
  }

  async enterDetailsLength(length: number): Promise<void> {
    await this.enterDetails('A'.repeat(length));
  }

  async expectDetailsValue(expected: string): Promise<void> {
    await expect(this.detailsField).toHaveValue(expected);
  }

  async expectDetailsLength(expectedLength: number): Promise<void> {
    await expect
      .poll(async () => (await this.detailsField.inputValue()).length)
      .toBe(expectedLength);
  }

  async uploadScreenshot(fileName: string): Promise<void> {
    await this.uploadInput.setInputFiles(this.fixturePath(fileName));
    await expect(this.uploadButton).toBeVisible();
    await this.uploadButton.click();
    await this.expectScreenshotCount(1);
  }

  async uploadInvalidFile(fileName: string): Promise<void> {
    await this.uploadInput.setInputFiles(this.fixturePath(fileName));
  }

  async expectScreenshotCount(expectedCount: number): Promise<void> {
    await expect.poll(async () => this.uploadedFile.count()).toBe(expectedCount);
  }

  async expectUploadedFileName(fileName: string): Promise<void> {
    await expect(this.uploadedFileName).toHaveText(fileName);
  }

  async expectFileNameHidden(fileName: string): Promise<void> {
    await expect(this.host.getByText(fileName, { exact: false })).toBeHidden();
  }

  async expectRemoveScreenshotAvailable(): Promise<void> {
    await expect(this.removeScreenshotButton).toBeVisible();
    await expect(this.removeScreenshotButton).toBeEnabled();
  }

  async removeScreenshot(): Promise<void> {
    await expect(this.removeScreenshotButton).toBeVisible();
    await this.removeScreenshotButton.click();
    await this.expectScreenshotCount(0);
  }

  async expectUploadAvailable(): Promise<void> {
    await expect(this.uploadInput).toBeAttached();
  }

  async expectUploadError(expectedMessage: string): Promise<void> {
    await expect(this.host.getByText(expectedMessage, { exact: false })).toBeVisible();
  }

  async setConfirmation(checked: boolean): Promise<void> {
    await expect(this.confirmationCheckbox).toBeVisible();

    if (checked) {
      await this.confirmationCheckbox.check();
    } else {
      await this.confirmationCheckbox.uncheck();
    }
  }

  async expectConfirmationUnchecked(): Promise<void> {
    await expect(this.confirmationCheckbox).not.toBeChecked();
  }

  async expectSubmitVisible(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
  }

  async expectSubmitState(enabled: boolean): Promise<void> {
    await expect(this.submitButton).toBeEnabled({ enabled });
  }

  async submit(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
    await this.submitButton.click();
  }

  async expectSuccess(expectedMessage: string = REPORT_PROBLEM.messages.success): Promise<void> {
    await expect(this.page.getByText(expectedMessage, { exact: true }).first()).toBeVisible();
  }

  async expectNotSubmitted(): Promise<void> {
    await expect(this.successAcknowledgement).toBeHidden();
  }
}

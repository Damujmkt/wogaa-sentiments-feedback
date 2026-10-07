import { expect as playwrightExpect } from '@playwright/test';
import { createBdd, test as base } from 'playwright-bdd';

import { ReportProblemPanel } from '../pages/ReportProblemPanel';
import { SentimentsWidget } from '../pages/SentimentsWidget';

type Fixtures = {
  sentimentsWidget: SentimentsWidget;
  reportProblemPanel: ReportProblemPanel;
};

export const test = base.extend<Fixtures>({
  sentimentsWidget: async ({ page }, use) => {
    await use(new SentimentsWidget(page));
  },
  reportProblemPanel: async ({ page }, use) => {
    await use(new ReportProblemPanel(page));
  },
});

export const expect = playwrightExpect;
export const { Given, When, Then } = createBdd(test);

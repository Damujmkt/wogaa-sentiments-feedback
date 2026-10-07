import 'dotenv/config';

import { defineConfig, devices } from '@playwright/test';
import { cucumberReporter, defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: ['steps/**/*.ts', 'fixtures/**/*.ts'],
  outputDir: '.features-gen',
});

const useBrandedChrome = process.env.USE_BRANDED_CHROME === 'true';

export default defineConfig({
  testDir,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  grepInvert: /@manual/,
  outputDir: 'test-results',

  reporter: [
    cucumberReporter('html', {
      outputFile: 'reports/cucumber/index.html',
      externalAttachments: true,
    }),
    ['html', { outputFolder: 'reports/playwright', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
  ],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://beta-docs.wogaa.cloud',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
  },

  projects: [
    {
      name: 'web-chrome',
      grep: /@web|@report-problem/,
      use: {
        ...devices['Desktop Chrome'],
        channel: useBrandedChrome ? 'chrome' : undefined,
      },
    },
    {
      name: 'web-safari-webkit',
      grep: /@web|@report-problem/,
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-web-android',
      grep: /@mobile/,
      use: { ...devices['Pixel 7'] },
    },
    {
      name: 'mobile-web-ios',
      grep: /@mobile/,
      use: { ...devices['iPhone 13'] },
    },
  ],
});

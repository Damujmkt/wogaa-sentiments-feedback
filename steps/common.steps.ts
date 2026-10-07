import { Given } from '../fixtures/test.fixture';

Given('the user is on the WOGAA test website', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});

import { expect, test } from '@playwright/test';
import { tabToAllControls } from './keyboard';

for (const width of [320, 1200]) {
  test(`docs code copy has a usable target at ${width}px in both themes`, async ({ page, browserName }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: { writeText: async () => { throw new DOMException('Denied', 'NotAllowedError'); } },
      });
    });
    await page.goto('/#/button');
    for (const theme of ['light', 'dark']) {
      if (theme === 'dark') {
        await page.reload();
        await page.getByRole('button', { name: 'Switch to dark theme' }).click();
      }
      const playground = page.locator('.playground');
      const codeTab = playground.getByRole('button', { name: 'Code', exact: true });
      await codeTab.click();
      const copy = playground.locator('.om-clipboard-button');
      await expect(copy).toHaveAccessibleName('Copy code');
      const rect = await copy.boundingBox();
      expect(rect?.width).toBeGreaterThanOrEqual(44);
      expect(rect?.height).toBeGreaterThanOrEqual(44);
      await codeTab.press(tabToAllControls(browserName));
      await expect(copy).toBeFocused();
      await expect(copy).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Enter');
      await expect(copy).toHaveAccessibleName('Select the code to copy');
      await expect(copy).toBeFocused();
      await expect(playground.getByRole('status')).toHaveText('Select the code to copy');
      await expect(playground.locator('pre')).toContainText('Create project');
    }
  });
}

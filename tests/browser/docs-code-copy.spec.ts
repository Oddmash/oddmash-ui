import { expect, test } from '@playwright/test';

for (const width of [320, 1200]) {
  test(`docs code copy has a usable target at ${width}px in both themes`, async ({ page }) => {
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
      await playground.getByRole('button', { name: 'Code', exact: true }).click();
      const copy = playground.getByRole('button', { name: 'Copy code' });
      const rect = await copy.boundingBox();
      expect(rect?.width).toBeGreaterThanOrEqual(44);
      expect(rect?.height).toBeGreaterThanOrEqual(44);
      await copy.press('Enter');
      const error = playground.getByRole('button', { name: 'Select the code to copy' });
      await expect(error).toBeFocused();
      await expect(error).toHaveCSS('outline-style', 'solid');
      await expect(playground.getByRole('status')).toHaveText('Select the code to copy');
      await expect(playground.locator('pre')).toContainText('Create project');
    }
  });
}

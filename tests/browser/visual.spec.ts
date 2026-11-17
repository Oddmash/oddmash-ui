import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });

for (const theme of ['light', 'dark']) {
  test(`${theme}: screenshot baselines for focus and overlays`, async ({ page, browserName }) => {
    test.skip(process.platform !== 'linux' || browserName !== 'chromium', 'Baselines use Linux Chromium.');

    await page.goto('/#/select');
    if (theme === 'dark') {
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    }
    await page.evaluate(() => document.fonts.ready.then(() => undefined));

    const select = page.getByRole('combobox', { name: 'Environment' });
    await select.press('Enter');
    await select.press('ArrowDown');
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.locator('.playground .preview')).toHaveScreenshot(`select-${theme}.png`);

    await page.goto('/#/dialog');
    await page.getByRole('button', { name: 'Edit project' }).press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('textbox')).toBeFocused();
    await expect(dialog).toHaveScreenshot(`dialog-${theme}.png`);
  });
}

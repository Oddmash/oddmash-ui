import { readFile } from 'node:fs/promises';
import { expect, test, type TestInfo } from '@playwright/test';

const reportActual = async (name: string, testInfo: TestInfo) => {
  const path = testInfo.outputPath(`${name}-actual.png`);
  const data = await readFile(path).catch(() => undefined);
  if (!data) return;
  const encoded = data.toString('base64');
  const chunks = encoded.match(/.{1,1024}/g) ?? [];
  for (const [index, chunk] of chunks.entries()) {
    console.log(`ODDMASH_SNAPSHOT ${name} ${index + 1}/${chunks.length} ${chunk}`);
  }
};

test.use({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });

for (const theme of ['light', 'dark']) {
  test(`${theme}: screenshot baselines for focus and overlays`, async ({ page, browserName }, testInfo) => {
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
    await expect.soft(page.locator('.playground .preview')).toHaveScreenshot(`select-${theme}.png`, { maxDiffPixels: 8 });
    await reportActual(`select-${theme}`, testInfo);

    await page.goto('/#/dialog');
    await page.getByRole('button', { name: 'Edit project' }).press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('textbox')).toBeFocused();
    await expect.soft(dialog).toHaveScreenshot(`dialog-${theme}.png`);
    await reportActual(`dialog-${theme}`, testInfo);
  });
}

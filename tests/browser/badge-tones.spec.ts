import { expect, test } from '@playwright/test';

test('semantic badges are distinct, visible and fit narrow layouts in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/badge');
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') {
      await page.reload();
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    }
    const preview = page.locator('.playground .preview');
    for (const text of ['Running', 'Waiting', 'Succeeded', 'Failed', 'Attention required', 'Unknown']) {
      await expect(preview.getByText(text, { exact: true })).toBeVisible();
    }
    const tones = preview.locator('.om-badge--active, .om-badge--success, .om-badge--danger, .om-badge--warning');
    const colors = await tones.evaluateAll(badges => badges.map(badge => getComputedStyle(badge).color));
    expect(new Set(colors).size).toBe(4);
    expect(await preview.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(preview.getByRole('status')).toHaveCount(0);
    await expect(preview.getByRole('alert')).toHaveCount(0);
  }
});

test('semantic badges retain visible labels and boundaries in forced colors', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Forced-colors emulation is verified in Chromium.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#/badge');
  const badge = page.locator('.playground .preview').getByText('Failed', { exact: true });
  await expect(badge).toBeVisible();
  await expect(badge).toHaveCSS('border-style', 'solid');
});

import { expect, test } from '@playwright/test';

test('token-styled slider retains native keyboard and pointer behavior in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/slider');
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') {
      await page.reload();
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    }
    const slider = page.getByRole('slider', { name: 'Width' });
    await expect(slider).toHaveValue('320');
    await expect(slider).toHaveCSS('appearance', 'none');
    await slider.press('Home');
    await expect(slider).toHaveValue('100');
    await expect(slider).toHaveCSS('--om-slider-progress', '0%');
    await slider.press('End');
    await expect(slider).toHaveValue('600');
    await expect(slider).toHaveCSS('--om-slider-progress', '100%');
    await expect(slider).toHaveCSS('outline-style', 'solid');
    await slider.press('ArrowLeft');
    await expect(slider).toHaveValue('599');
    const box = await slider.boundingBox();
    if (!box) throw new Error('Slider has no rendered target');
    await slider.click({ position: { x: box.width / 2, y: box.height / 2 } });
    const value = Number(await slider.inputValue());
    expect(value).toBeGreaterThan(100);
    expect(value).toBeLessThan(600);
  }
});

test('forced colors preserves the native range appearance', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Forced-colors emulation is verified in Chromium.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#/slider');
  const slider = page.getByRole('slider', { name: 'Width' });
  await expect(slider).not.toHaveCSS('appearance', 'none');
  await slider.press('Home');
  await expect(slider).toHaveValue('100');
});

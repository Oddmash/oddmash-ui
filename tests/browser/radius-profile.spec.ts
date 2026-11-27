import { expect, test } from '@playwright/test';
import { chooseDocsTheme } from './docs-test-helpers';
import { tabToAllControls } from './keyboard';

for (const theme of ['Light', 'Dark'] as const) {
  test(`scoped corner styles keep controls and overlays usable in ${theme}`, async ({ page, browserName }) => {
    for (const width of [320, 390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/#/radius');
      await chooseDocsTheme(page, theme);
      const standard = page.getByRole('region', { name: 'Default corners' });
      const soft = page.getByRole('region', { name: 'Soft corners' });
      const standardInput = standard.getByRole('textbox', { name: 'Project name', exact: true });
      const softInput = soft.getByRole('textbox', { name: 'Project name', exact: true });

      await expect(standardInput).toHaveCSS('border-radius', '6px');
      await expect(softInput).toHaveCSS('border-radius', '10px');
      await expect(standard.locator('.om-card')).toHaveCSS('border-radius', '12px');
      await expect(soft.locator('.om-card')).toHaveCSS('border-radius', '16px');
      await expect(page.getByRole('combobox', { name: 'Language' })).toHaveCSS('border-radius', '6px');
      const [standardBox, softBox] = await Promise.all([standardInput.boundingBox(), softInput.boundingBox()]);
      expect(softBox?.height).toBe(standardBox?.height);
      expect(softBox?.width).toBeCloseTo(standardBox?.width ?? 0, 0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);

      const invalid = soft.getByRole('textbox', { name: 'Invalid project name' });
      const disabled = soft.getByRole('button', { name: 'Unavailable' });
      await expect(invalid).toHaveCSS('border-radius', '10px');
      await expect(disabled).toBeDisabled();
      await expect(disabled).toHaveCSS('border-radius', '10px');

      for (const [scope, menuRadius, dialogRadius] of [[standard, '8px', '12px'], [soft, '12px', '16px']] as const) {
        const select = scope.getByRole('combobox', { name: 'Environment' });
        await select.press('Enter');
        const menu = scope.getByRole('listbox');
        await expect(menu).toBeInViewport({ ratio: 1 });
        await expect(menu).toHaveCSS('border-radius', menuRadius);
        await select.press('Escape');

        const trigger = scope.getByRole('button', { name: 'Edit project' });
        await trigger.press('Enter');
        const dialog = scope.getByRole('dialog');
        await expect(dialog).toBeInViewport({ ratio: 1 });
        await expect(dialog).toHaveCSS('border-radius', dialogRadius);
        await expect(dialog.getByRole('textbox')).toBeFocused();
        await page.keyboard.press('Escape');
        await expect(trigger).toBeFocused();
      }

      await softInput.hover();
      await softInput.focus();
      await page.keyboard.press(tabToAllControls(browserName));
      const select = soft.getByRole('combobox', { name: 'Environment' });
      await expect(select).toBeFocused();
      await expect(select).toHaveCSS('outline-style', 'solid');
    }
  });
}

test('the soft profile honors nested defaults and preserves compact controls', async ({ page }) => {
  await page.goto('/#/radius');
  const root = page.locator('html');
  await root.evaluate((element) => { element.dataset.omRadius = 'soft'; });
  const defaultInput = page.getByRole('region', { name: 'Default corners' }).getByRole('textbox').first();
  await expect(defaultInput).toHaveCSS('border-radius', '6px');
  await page.goto('/#/input');
  await expect(page.locator('.playground .preview .om-input').first()).toHaveCSS('border-radius', '10px');
  const compact = page.getByRole('button', { name: 'Expand preview' });
  await expect(compact).toHaveCSS('border-radius', '6px');
  await page.goto('/#/toggle-group');
  await expect(page.locator('.om-toggle-group-item').first()).toHaveCSS('border-radius', '6px');
});

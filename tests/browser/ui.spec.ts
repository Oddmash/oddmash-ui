import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
for (const theme of ['dark', 'light']) {
  test(`${theme}: accessible, responsive, keyboard usable`, async ({ page }) => {
    await page.goto('/');
    if (theme === 'light') await page.getByRole('button', { name: 'Switch to light' }).click();
    await expect(page.getByRole('button', { name: 'Save changes' })).toHaveCSS('background-color', theme === 'light' ? 'rgb(8, 124, 102)' : 'rgb(172, 223, 201)');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole('tab', { name: 'General' }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('tab', { name: 'Events' })).toHaveAttribute('aria-selected', 'true');
    await page.getByRole('button', { name: 'Save changes' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: 'Done', exact: true })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('button', { name: 'Done', exact: true })).toBeFocused();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.getByRole('button', { name: 'Save changes' })).toBeFocused();
    await page.setViewportSize({ width: 320, height: 700 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await expect(page.getByRole('button', { name: 'Save changes' })).toHaveCSS('transition-duration', '0s');
  });
}

test('scoped overrides and nested themes do not leak', async ({ page }) => {
  await page.goto('/');
  await page.locator('.om-card').evaluate((card) => {
    card.setAttribute('data-om-theme', 'light');
    (card as HTMLElement).style.setProperty('--om-semantic-color-border', '#b42318');
    (card as HTMLElement).style.setProperty('--om-semantic-radius-sm', '2px');
  });
  await expect(page.getByLabel('Project name')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(page.getByLabel('Project name')).toHaveCSS('border-top-color', 'rgb(180, 35, 24)');
  await expect(page.getByLabel('Project name')).toHaveCSS('border-top-left-radius', '2px');
  await expect(page.locator('main')).toHaveCSS('background-color', 'rgb(17, 20, 24)');
});

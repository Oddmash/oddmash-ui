import { expect, test } from '@playwright/test';

test('landing discovery and the HTML guide preserve the installation flow', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto('/');
  const finder = page.getByRole('navigation', { name: 'Try a component' });
  await expect(finder.getByRole('link')).toHaveCount(6);
  await finder.getByRole('link', { name: /Action Sheet/ }).click();
  await expect(page).toHaveURL(/#action-sheet$/);
  await page.getByRole('link', { name: 'Action Sheet reference' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Action Sheet' })).toBeVisible();
  const pages = page.getByRole('navigation', { name: 'Documentation pages' });
  await expect(pages.getByRole('link', { name: 'Action Sheet' })).toHaveAttribute('aria-current', 'page');
  await pages.getByRole('link', { name: 'Quickstart' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Quickstart' })).toBeVisible();
  await expect(page.getByRole('main')).toContainText('pnpm pack');
  await page.getByRole('link', { name: 'Bottom Sheet reference' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Bottom Sheet' })).toBeVisible();
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await page.getByRole('region', { name: 'Code example' }).focus();
  await expect(page.getByRole('region', { name: 'Code example' })).toBeFocused();
});

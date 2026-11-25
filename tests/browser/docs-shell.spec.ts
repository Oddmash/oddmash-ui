import { expect, test } from '@playwright/test';
import { chooseDocsTheme } from './docs-test-helpers';

test('system theme tracks the operating system while explicit choices persist', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const html = page.locator('html');
  const theme = page.getByRole('combobox', { name: 'Theme', exact: true });
  await expect(theme).toHaveText('System');
  await expect(html).toHaveAttribute('data-om-theme', 'dark');
  await expect(html).toHaveCSS('color-scheme', 'dark');
  await chooseDocsTheme(page, 'Light');
  await expect(html).toHaveAttribute('data-om-theme', 'light');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.emulateMedia({ colorScheme: 'dark' });
  await expect(html).toHaveAttribute('data-om-theme', 'light');
  await page.reload();
  await expect(theme).toHaveText('Light');
  await expect(html).toHaveAttribute('data-om-theme', 'light');
  await chooseDocsTheme(page, 'System');
  await expect(html).toHaveAttribute('data-om-theme', 'dark');
  await page.emulateMedia({ colorScheme: 'light' });
  await expect(html).toHaveAttribute('data-om-theme', 'light');
  await page.reload();
  await expect(theme).toHaveText('System');
});

test('global search opens a modal from shortcut or trigger, navigates and retains sidebar position', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 560 });
  await page.goto('/#/command-palette');
  const trigger = page.getByRole('button', { name: 'Search documentation' });
  const searchDialog = page.getByRole('dialog', { name: 'Search documentation' });
  await page.keyboard.press('Control+k');
  await expect(searchDialog).toBeVisible();
  const search = searchDialog.getByRole('combobox', { name: 'Search documentation' });
  await expect(search).toBeFocused();
  await search.fill('timeline filters');
  await expect(searchDialog.getByRole('option', { name: 'Timeline filters', exact: true })).toBeVisible();
  await search.press('Enter');
  await expect(searchDialog).toBeHidden();
  await expect(page.locator('#page-title')).toHaveText('Timeline filters');
  const sidebar = page.locator('#docs-sidebar');
  const active = sidebar.getByRole('link', { name: 'Timeline filters', exact: true });
  await expect(active).toHaveAttribute('aria-current', 'page');
  const position = await sidebar.evaluate((element) => element.scrollTop);
  expect(position).toBeGreaterThan(0);
  expect(await active.evaluate((element) => {
    const item = element.getBoundingClientRect();
    const parent = element.closest('.sidebar')!.getBoundingClientRect();
    return item.top >= parent.top - 1 && item.bottom <= parent.bottom + 1;
  })).toBe(true);
  await sidebar.getByRole('link', { name: 'Interaction monitor', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Interaction monitor');
  expect(await sidebar.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await trigger.click();
  await search.fill('does-not-exist-at-all');
  await expect(searchDialog.getByRole('status')).toHaveText('No pages found.');
  await page.keyboard.press('Escape');
  await expect(searchDialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test('named package icon links use shared motion controls and fit compact translated headers', async ({ page }) => {
  await page.goto('/');
  const github = page.locator('.site-header').getByRole('link', { name: 'GitHub' });
  const npm = page.locator('.site-header').getByRole('link', { name: 'npm' });
  await expect(github).toHaveAttribute('href', 'https://github.com/Oddmash/oddmash-ui');
  await expect(npm).toHaveAttribute('href', 'https://www.npmjs.com/package/@oddmash/ui');
  await expect(github).toHaveAttribute('data-platform', 'github');
  await expect(npm).toHaveAttribute('data-platform', 'npm');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await github.hover();
  await expect(github.locator('svg')).toHaveCSS('animation-name', 'none');
  await page.setViewportSize({ width: 320, height: 780 });
  for (const locale of ['en', 'ko', 'ja', 'zh-CN']) {
    await page.evaluate((value) => localStorage.setItem('om-docs-locale', value), locale);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(github).toBeVisible();
    await expect(npm).toBeVisible();
    expect(await page.locator('.site-header').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
});

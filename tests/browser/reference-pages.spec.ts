import { expect, test } from '@playwright/test';

test('the component reference is readable without JavaScript and links to the correct locale', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  const page = await context.newPage();
  const response = await page.goto('http://127.0.0.1:4173/reference/ko/tooltip/');
  expect(response?.ok()).toBe(true);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('툴팁');
  await expect(page.getByRole('heading', { name: '접근성' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://oddmash.github.io/oddmash-ui/reference/ko/tooltip/');
  await expect(page.getByRole('link', { name: '인터랙티브 문서' })).toHaveAttribute('href', '../../../?lang=ko#/tooltip');
  await page.getByRole('link', { name: '日本語' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ja');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ツールチップ');
  await context.close();
});

test('static references hand off to the localized live playground without changing its hash route', async ({ page }) => {
  await page.goto('/reference/ko/tooltip/');
  await page.getByRole('link', { name: '인터랙티브 문서' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ko');
  await expect(page).toHaveURL(/#\/tooltip$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('툴팁');
  await expect(page.getByRole('link', { name: /컴포넌트 참고 문서/ })).toHaveAttribute('href', './reference/ko/tooltip/');
});

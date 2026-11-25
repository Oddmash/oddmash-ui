import { expect, test } from '@playwright/test';

test('platform links preserve the hover pulse, touch target and keyboard focus', async ({ page }) => {
  await page.goto('/#/link-controls');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const preview = page.locator('.example-primitives').first();
  const github = preview.getByRole('link', { name: 'GitHub example' });
  const npm = preview.getByRole('link', { name: 'npm example' });
  await expect(github).toHaveAttribute('href', '#/link-controls');
  await expect(npm).toHaveAttribute('href', '#/link-controls');
  const dimensions = await github.boundingBox();
  expect(dimensions?.width).toBeGreaterThanOrEqual(44);
  expect(dimensions?.height).toBeGreaterThanOrEqual(44);
  await github.hover();
  await expect(github.locator('svg')).toHaveCSS('animation-name', 'om-platform-pulse');
  expect(await github.boundingBox()).toEqual(dimensions);
  await npm.hover();
  await expect(github.locator('svg')).toHaveCSS('animation-name', 'none');
  await expect(npm.locator('svg')).toHaveCSS('animation-name', 'om-platform-pulse');
  await expect(npm).toHaveCSS('color', 'rgb(203, 56, 55)');

  await page.mouse.move(0, 0);
  await github.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  await expect(github).toBeFocused();
  await expect(github).toHaveCSS('outline-style', 'solid');
  await expect(github).toHaveCSS('outline-width', '2px');
  await github.press('Enter');
  await expect(page).toHaveURL(/#\/link-controls$/);
});

test('platform hover fill is immediate and pulse is disabled under reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/link-controls');
  const github = page.locator('.example-primitives').first().getByRole('link', { name: 'GitHub example' });
  await github.hover();
  await expect(github).toHaveCSS('transition-duration', '0s');
  await expect(github.locator('svg')).toHaveCSS('animation-name', 'none');
  await expect(github.locator('svg')).toHaveCSS('transform', 'none');
});

test('shared shortcut uses native kbd and named icon controls retain their roles', async ({ page }) => {
  await page.goto('/#/link-controls');
  const preview = page.locator('.example-primitives').first();
  await expect(preview.getByRole('link', { name: 'Read guide' })).toBeVisible();
  await expect(preview.getByRole('button', { name: 'Open search example' })).toBeVisible();
  await expect(preview.getByRole('link', { name: 'Open reference example' })).toBeVisible();
  await expect(preview.locator('kbd.om-kbd')).toHaveText('Ctrl K');
});

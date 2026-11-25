import { expect, test, type Locator } from '@playwright/test';

const remaining = (card: Locator) => card.evaluate(element => Number((element as HTMLElement).style.getPropertyValue('--om-toast-remaining')));

test('managed toast countdown follows expiry and freezes on hover or keyboard focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/toast-provider');
  const saved = page.getByRole('button', { name: 'Show saved notification' });
  const error = page.getByRole('button', { name: 'Show error notification' });
  const viewport = page.getByTestId('managed-toast-viewport');
  const card = viewport.locator('[data-toast-id][data-state="open"]');
  await saved.click();
  await expect(card.locator('.om-toast-progress')).toBeVisible();
  await expect.poll(() => remaining(card)).toBeLessThan(0.95);
  await card.locator('.om-toast').hover();
  await page.waitForTimeout(100);
  const hovered = await remaining(card);
  const ratio = await card.locator('.om-toast-progress').evaluate(track => track.firstElementChild!.getBoundingClientRect().width / track.getBoundingClientRect().width);
  expect(ratio).toBeCloseTo(hovered, 2);
  await page.waitForTimeout(400);
  expect(await remaining(card)).toBeCloseTo(hovered, 3);
  const close = card.getByRole('button');
  await close.focus();
  await saved.hover();
  await page.waitForTimeout(400);
  expect(await remaining(card)).toBeCloseTo(hovered, 3);
  await saved.focus();
  await expect.poll(() => remaining(card)).toBeLessThan(hovered - 0.03);
  await expect(card).toHaveCount(0, { timeout: 5000 });
  await error.click();
  await expect(card.getByRole('alert')).toBeVisible();
  await expect(card.locator('.om-toast-progress')).toHaveCount(0);
});

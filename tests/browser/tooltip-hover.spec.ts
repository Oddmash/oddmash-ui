import { expect, test } from '@playwright/test';

test('allows a slow pointer crossing between a trigger and its tooltip', async ({ page }) => {
  await page.goto('/#/tooltip');
  const trigger = page.locator('.playground').getByRole('button', { name: 'Reference' });
  await trigger.hover();
  const panel = page.getByRole('tooltip');
  await expect(panel).toBeVisible();
  const a = await trigger.boundingBox();
  const b = await panel.boundingBox();
  if (!a || !b) throw new Error('Expected visible trigger and tooltip bounds.');
  const x = Math.max(a.x, b.x) + Math.min(a.x + a.width, b.x + b.width) / 2 - Math.max(a.x, b.x) / 2;
  const above = b.y + b.height <= a.y;
  const near = above ? b.y + b.height : a.y + a.height;
  const far = above ? a.y : b.y;
  expect(far - near).toBeGreaterThan(0);
  await page.mouse.move(x, (near + far) / 2);
  await page.waitForTimeout(250);
  await expect(panel).toBeVisible();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await expect(panel).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(panel).not.toBeVisible();
});

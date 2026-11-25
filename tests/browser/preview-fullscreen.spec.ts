import { expect, test } from '@playwright/test';

test('fullscreen keeps the current preview, supports nested controls and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('/#/select');
  const expand = page.getByRole('button', { name: 'Expand preview' });
  const trigger = page.getByRole('combobox', { name: 'Environment' });
  await expect(trigger).toHaveText('Staging');
  await expand.click();
  const dialog = page.getByRole('dialog', { name: 'Fullscreen preview' });
  await expect(dialog).toBeVisible();
  const close = dialog.getByRole('button', { name: 'Exit fullscreen preview' });
  await expect(close).toBeFocused();
  const box = await dialog.boundingBox();
  expect(box).toMatchObject({ x: 0, y: 0, width: 320, height: 700 });
  await trigger.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await trigger.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await expect(dialog).toBeVisible();
  await trigger.press('Enter');
  await trigger.press('ArrowDown');
  await trigger.press('Enter');
  await expect(trigger).toHaveText('Production');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(expand).toBeFocused();
  await expect(trigger).toHaveText('Production');
  await expect(page).toHaveURL(/#\/select$/);
});

test('toast controls stay above the embedded viewport and local notifications survive expansion', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/#/toast');
  const preview = page.locator('.playground .preview');
  const tone = preview.getByRole('combobox', { name: 'Notification tone' });
  const trigger = preview.getByRole('button', { name: 'Show toast' });
  await tone.click();
  await page.getByRole('option', { name: 'Error' }).click();
  await trigger.click();
  const card = preview.locator('.om-toast-region[data-state="open"] .om-toast');
  await expect(card).toBeVisible();
  const isContained = async () => {
    const bounds = await preview.boundingBox();
    const choice = await tone.boundingBox();
    const button = await trigger.boundingBox();
    const toast = await card.boundingBox();
    return !!bounds && !!choice && !!button && !!toast && choice.x < button.x &&
      toast.y >= Math.max(choice.y + choice.height, button.y + button.height) &&
      toast.x >= bounds.x && toast.x + toast.width <= bounds.x + bounds.width &&
      toast.y + toast.height <= bounds.y + bounds.height;
  };
  await expect.poll(isContained).toBe(true);
  await page.getByRole('button', { name: 'Expand preview' }).click();
  await expect(page.getByRole('dialog', { name: 'Fullscreen preview' })).toBeVisible();
  await expect(card).toContainText('Save failed');
  await expect.poll(isContained).toBe(true);
  await page.getByRole('button', { name: 'Exit fullscreen preview' }).click();
  await expect(card).toContainText('Save failed');
  await expect.poll(isContained).toBe(true);
  await page.setViewportSize({ width: 320, height: 640 });
  await expect(card).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  const dismiss = card.getByRole('button', { name: 'Dismiss notification' });
  await dismiss.press('Enter');
  await expect(trigger).toBeFocused();
});

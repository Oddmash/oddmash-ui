import { expect, test } from '@playwright/test';

test.use({ viewport: { width: 320, height: 700 }, hasTouch: true, reducedMotion: 'reduce' });

test('explicit command dismissal works by touch and keyboard', async ({ page }) => {
  await page.goto('/#/command-palette');
  const trigger = page.locator('.playground .preview').getByRole('button', { name: 'Commands' });
  const dialog = page.getByRole('dialog', { name: 'Commands' });
  const dismiss = dialog.getByRole('button', { name: 'Close commands' });
  await trigger.tap();
  await expect(dismiss).toBeVisible();
  await dismiss.tap();
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await dismiss.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await trigger.press('Enter');
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

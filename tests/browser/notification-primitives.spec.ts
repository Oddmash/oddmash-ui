import { expect, test } from '@playwright/test';

test('clipboard button reports resolution and rejection without moving focus', async ({ page }) => {
  await page.addInitScript(() => {
    const state = { copied: '', denied: false };
    (window as Window & { clipboardFixture?: typeof state }).clipboardFixture = state;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (text: string) => {
          if (state.denied) throw new DOMException('Permission denied', 'NotAllowedError');
          state.copied = text;
        },
      },
    });
  });
  await page.goto('/#/clipboard-button');
  const button = page.locator('.playground .preview .om-clipboard-button');
  await button.press('Enter');
  await expect(button).toHaveAttribute('data-copy-state', 'copied');
  await expect(button).toBeFocused();
  const copied = await page.evaluate(() => (window as Window & { clipboardFixture?: { copied: string } }).clipboardFixture?.copied);
  expect(copied).toBe('pnpm add @oddmash/ui');
  await page.evaluate(() => {
    const state = (window as Window & { clipboardFixture?: { denied: boolean } }).clipboardFixture;
    if (state) state.denied = true;
  });
  await button.press('Enter');
  await expect(button).toHaveAttribute('data-copy-state', 'error');
  await expect(page.locator('.playground .preview [role="status"]')).toHaveText('Select the code to copy');
  await expect(button).toBeFocused();
});

test('clipboard button writes the actual browser clipboard in Chromium', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Clipboard permissions are browser-specific.');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/#/clipboard-button');
  const button = page.locator('.playground .preview .om-clipboard-button');
  await button.click();
  await expect(button).toHaveAttribute('data-copy-state', 'copied');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('pnpm add @oddmash/ui');
});

test('managed toast capacity and reduced-motion dismissal preserve committed focus', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/toast-provider');
  const trigger = page.getByRole('button', { name: 'Show saved notification' });
  const viewport = page.getByTestId('managed-toast-viewport');
  await expect(viewport.locator('[data-toast-id]')).toHaveCount(0);
  await trigger.press('Enter');
  await trigger.press('Enter');
  await trigger.press('Enter');
  await expect(viewport.locator('[data-toast-id][data-state="open"]')).toHaveCount(2);
  await expect(viewport.locator('[data-toast-id="3"]')).toHaveCount(0);
  const dismiss = (id: number) => viewport.locator(`[data-toast-id="${id}"]`).getByRole('button', { name: 'Dismiss notification' });
  await dismiss(1).press('Enter');
  await expect(dismiss(2)).toBeFocused();
  await expect(viewport.locator('[data-toast-id="3"][data-state="open"]')).toHaveCount(1);
  await dismiss(2).press('Enter');
  await expect(dismiss(3)).toBeFocused();
  await dismiss(3).press('Enter');
  await expect(trigger).toBeFocused();
  await expect(viewport.locator('[data-toast-id]')).toHaveCount(0);
});

test('managed toast expiration pauses on hover and does not expire important errors', async ({ page }) => {
  await page.goto('/#/toast-provider');
  await page.getByRole('button', { name: 'Show error notification' }).click();
  await page.getByRole('button', { name: 'Show saved notification' }).click();
  const viewport = page.getByTestId('managed-toast-viewport');
  const success = viewport.locator('[data-toast-id="2"] .om-toast');
  await expect(success).toBeVisible();
  await success.hover();
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'true');
  await page.waitForTimeout(3300);
  await expect(success).toBeVisible();
  await page.mouse.move(0, 0);
  await expect(viewport.locator('[data-toast-id="2"]')).toHaveCount(0, { timeout: 4500 });
  await expect(viewport.getByRole('alert')).toContainText('Save failed');
});

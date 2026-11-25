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

test('all documentation locales expose the dismiss action and preserve pointer result selection', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 });
  await page.goto('/#/command-palette');
  const language = page.locator('.locale-select');
  for (const [locale, label, commands, dismiss, save] of [
    ['ko', '한국어', '명령', '명령 닫기', '프로젝트 저장'],
    ['ja', '日本語', 'コマンド', 'コマンドを閉じる', 'プロジェクトを保存'],
    ['zh-CN', '简体中文', '命令', '关闭命令', '保存项目'],
    ['en', 'English', 'Commands', 'Close commands', 'Save project'],
  ]) {
    await language.press('Enter');
    await page.locator('.header-actions [role="listbox"]').getByRole('option', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    const trigger = page.locator('.playground .preview').getByRole('button', { name: commands });
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: commands });
    await expect(dialog.getByRole('button', { name: dismiss })).toBeVisible();
    await dialog.getByRole('option', { name: save }).click();
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
});

import { expect, test } from '@playwright/test';

test('semantic badges are distinct, visible and fit narrow layouts in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/badge');
  for (const theme of ['light', 'dark']) {
    if (theme === 'dark') {
      await page.reload();
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
    }
    const preview = page.locator('.playground .preview');
    for (const text of ['Running', 'Waiting', 'Succeeded', 'Failed', 'Attention required', 'Unknown']) {
      await expect(preview.getByText(text, { exact: true })).toBeVisible();
    }
    const tones = preview.locator('.om-badge--active, .om-badge--success, .om-badge--danger, .om-badge--warning');
    const colors = await tones.evaluateAll(badges => badges.map(badge => getComputedStyle(badge).color));
    expect(new Set(colors).size).toBe(4);
    expect(await preview.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    await expect(preview.getByRole('status')).toHaveCount(0);
    await expect(preview.getByRole('alert')).toHaveCount(0);
  }
});

test('semantic badges retain visible labels and boundaries in forced colors', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Forced-colors emulation is verified in Chromium.');
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/#/badge');
  const badge = page.locator('.playground .preview').getByText('Failed', { exact: true });
  await expect(badge).toBeVisible();
  await expect(badge).toHaveCSS('border-style', 'solid');
});

test('tone aliases preserve computed styles and localized docs expose operational labels', async ({ page }) => {
  await page.goto('/#/badge');
  const language = page.locator('.locale-select');
  const preview = page.locator('.playground .preview');
  for (const [locale, label, running, waiting, succeeded, failed, warning, unknown] of [
    ['ko', '한국어', '실행 중', '대기 중', '성공', '실패', '확인 필요', '알 수 없음'],
    ['ja', '日本語', '実行中', '待機中', '成功', '失敗', '確認が必要', '不明'],
    ['zh-CN', '简体中文', '正在运行', '等待中', '成功', '失败', '需要关注', '未知'],
    ['en', 'English', 'Running', 'Waiting', 'Succeeded', 'Failed', 'Attention required', 'Unknown'],
  ]) {
    await language.press('Enter');
    await page.locator('.header-actions [role="listbox"]').getByRole('option', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    for (const text of [running, waiting, succeeded, failed, warning, unknown]) {
      await expect(preview.getByText(text, { exact: true })).toBeVisible();
    }
  }
  for (const [tone, alias] of [['active', 'info'], ['danger', 'error']]) {
    const badge = preview.locator(`.om-badge--${tone}`);
    const styles = await badge.evaluate((element, { tone, alias }) => {
      const read = () => {
        const css = getComputedStyle(element);
        return [css.color, css.backgroundColor, css.borderColor];
      };
      const original = read();
      element.classList.replace(`om-badge--${tone}`, `om-badge--${alias}`);
      const aliased = read();
      element.classList.replace(`om-badge--${alias}`, `om-badge--${tone}`);
      return { original, aliased };
    }, { tone, alias });
    expect(styles.aliased).toEqual(styles.original);
  }
});

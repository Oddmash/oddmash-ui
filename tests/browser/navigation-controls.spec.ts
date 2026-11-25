import { expect, test } from '@playwright/test';

test('documentation navigation disclosure closes safely and preserves native destinations', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/docs-navigation');
  const nav = page.locator('.playground .preview .om-docs-navigation');
  const toggle = nav.locator('.om-docs-toggle');
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(nav.locator('a[href="/guide"]')).toBeHidden();
  await toggle.press('Enter');
  await expect(nav.locator('a[href="/guide"]')).toBeVisible();
  const route = page.url();
  await nav.locator('a[href="/api"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  expect(page.url()).toBe(route);
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(toggle).toBeHidden();
  await expect(nav.locator('a[href="/api"]')).toBeVisible();
  await expect(nav.locator('a[href="/api"]')).toHaveAttribute('aria-current', 'page');
});

test('table of contents follows the visible section and returns mobile focus to its heading', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/#/table-of-contents');
  const nav = page.locator('.playground .preview .om-table-of-contents');
  const toggle = nav.locator('.om-docs-toggle');
  await expect(toggle).toBeVisible();
  await toggle.press('Enter');
  const route = page.url();
  await nav.locator('a[href="#om-toc-demo-usage"]').click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#om-toc-demo-usage')).toBeFocused();
  await expect(nav.locator('a[href="#om-toc-demo-usage"]')).toHaveAttribute('aria-current', 'location');
  expect(page.url()).toBe(route);
});

test('scroll header respects direction, pointer safety and reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/scroll-header');
  const header = page.locator('.playground .preview .om-scroll-header');
  await expect(header).toHaveAttribute('data-om-scroll-hidden', 'false');
  await page.evaluate(() => window.scrollTo(0, 180));
  await expect(header).toHaveAttribute('data-om-scroll-hidden', 'true');
  await expect(header).toHaveCSS('pointer-events', 'none');
  await page.evaluate(() => window.scrollTo(0, Math.max(0, window.scrollY - 20)));
  await expect(header).toHaveAttribute('data-om-scroll-hidden', 'false');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.evaluate(() => window.scrollTo(0, 300));
  await expect(header).toHaveAttribute('data-om-scroll-hidden', 'false');
  await expect(header).toHaveCSS('transition-duration', '0s');
});

test('locale picker reuses keyboard-select interaction without choosing a product route', async ({ page }) => {
  await page.goto('/#/locale-picker');
  const trigger = page.locator('.playground .preview .om-locale-picker [role="combobox"]');
  await expect(trigger).toHaveText('English');
  const route = page.url();
  await trigger.press('Enter');
  await trigger.press('ArrowDown');
  await trigger.press('Enter');
  await expect(trigger).toHaveText('한국어');
  await expect(trigger).toHaveAttribute('lang', 'ko');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(page.url()).toBe(route);
});

test('non-enhanced mobile navigation classes keep native links available', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/docs-navigation');
  const preview = page.locator('.playground .preview');
  await preview.evaluate(element => {
    const nav = document.createElement('nav');
    nav.className = 'om-docs-navigation';
    nav.dataset.collapsible = 'true';
    nav.dataset.expanded = 'false';
    const toggle = document.createElement('button');
    toggle.className = 'om-docs-toggle';
    toggle.textContent = 'Browse docs';
    const panel = document.createElement('div');
    panel.className = 'om-docs-panel';
    const link = document.createElement('a');
    link.href = '/guide';
    link.textContent = 'Static guide';
    panel.append(link);
    nav.append(toggle, panel);
    const details = document.createElement('details');
    details.className = 'om-locale-fallback';
    const summary = document.createElement('summary');
    summary.textContent = 'Language';
    const alternate = document.createElement('a');
    alternate.href = '/ko/docs';
    alternate.hreflang = 'ko';
    alternate.textContent = '한국어';
    details.append(summary, alternate);
    element.append(nav, details);
  });
  await expect(preview.getByRole('link', { name: 'Static guide' })).toBeVisible();
  await expect(preview.getByRole('button', { name: 'Browse docs', exact: true })).toBeHidden();
  await preview.locator('.om-locale-fallback summary').click();
  await expect(preview.locator('.om-locale-fallback a')).toBeVisible();
  await expect(preview.locator('.om-locale-fallback a')).toHaveAttribute('hreflang', 'ko');
});

test('all four documentation controls remain localized and fit at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/docs-navigation');
  const language = page.locator('.locale-select');
  for (const [locale, label, titles] of [
    ['ko', '한국어', ['문서 탐색', '목차', '스크롤 헤더', '언어 선택기']],
    ['ja', '日本語', ['ドキュメントナビゲーション', '目次', 'スクロールヘッダー', '言語セレクター']],
    ['zh-CN', '简体中文', ['文档导航', '目录', '滚动页眉', '语言选择器']],
    ['en', 'English', ['Docs Navigation', 'Table of Contents', 'Scroll Header', 'Locale Picker']],
  ] as const) {
    await language.press('Enter');
    await page.locator('.header-actions [role="listbox"]').getByRole('option', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    for (const [index, id] of ['docs-navigation', 'table-of-contents', 'scroll-header', 'locale-picker'].entries()) {
      await page.goto('/#/' + id);
      await expect(page.locator('#page-title')).toHaveText(titles[index]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    }
  }
});

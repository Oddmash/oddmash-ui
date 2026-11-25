import { expect, test } from '@playwright/test';

test('link card sweeps left to right without layout shift', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/link-card');
  await page.mouse.move(0, 0);
  const card = page.locator('.playground .preview .om-link-card');
  await expect(card).toHaveCSS('background-size', '0% 100%');
  await expect(card).toHaveCSS('background-position-x', /^0(?:px|%)$/);
  await expect(card).toHaveCSS('background-repeat', 'no-repeat');
  await expect(card).toHaveCSS('transition-property', 'background-size');
  await card.scrollIntoViewIfNeeded();
  const before = await card.boundingBox();
  await card.hover();
  await expect(card).toHaveCSS('background-size', '100% 100%');
  expect(await card.boundingBox()).toEqual(before);
  await page.mouse.move(0, 0);
  await expect(card).toHaveCSS('background-size', '0% 100%');
});

test('static classes contain long code and wide tables at 320px without a global reset', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/prose');
  const preview = page.locator('.playground .preview');
  await preview.evaluate((element) => {
    const outside = document.createElement('p');
    outside.className = 'outside-prose';
    outside.textContent = 'Outside the component';
    const article = document.createElement('article');
    article.className = 'om-prose';
    article.lang = 'ko';
    const paragraph = document.createElement('p');
    paragraph.textContent = '문서의 한국어 설명과 아주 긴 토큰이 어색하게 잘리지 않도록 확인합니다.';
    const block = document.createElement('div');
    block.className = 'om-code-block';
    const pre = document.createElement('pre');
    pre.className = 'om-code-block-content';
    pre.tabIndex = 0;
    pre.setAttribute('role', 'region');
    pre.setAttribute('aria-label', 'Long code');
    const code = document.createElement('code');
    code.textContent = 'const value = ' + 'x'.repeat(240) + ';';
    pre.append(code);
    block.append(pre);
    const scroll = document.createElement('div');
    scroll.className = 'om-prose-scroll';
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'region');
    scroll.setAttribute('aria-label', 'Wide table');
    const table = document.createElement('table');
    const row = table.createTHead().insertRow();
    for (let i = 0; i < 8; i += 1) {
      const heading = document.createElement('th');
      heading.scope = 'col';
      heading.textContent = 'Heading ' + i;
      row.append(heading);
    }
    scroll.append(table);
    article.append(paragraph, block, scroll);
    (element as HTMLElement).style.display = 'block';
    element.replaceChildren(outside, article);
  });
  const code = preview.getByRole('region', { name: 'Long code' });
  const table = preview.getByRole('region', { name: 'Wide table' });
  await expect(code).toHaveCSS('white-space', 'pre');
  await expect(code).toHaveCSS('margin-top', '0px');
  await expect(code).toHaveCSS('margin-bottom', '0px');
  expect(await code.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
  await expect(table.getByRole('table')).toBeVisible();
  await expect(preview.locator('article p')).toHaveCSS('word-break', 'keep-all');
  await expect(preview.locator('.outside-prose')).not.toHaveCSS('word-break', 'keep-all');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

test('documentation previews remain localized and contained on narrow screens', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/link-card');
  const language = page.locator('.locale-select');
  for (const [locale, label, titles] of [
    ['ko', '한국어', ['링크 카드', '코드 블록', '사이트 레이아웃', '문서 본문']],
    ['ja', '日本語', ['リンクカード', 'コードブロック', 'サイトレイアウト', '記事本文']],
    ['zh-CN', '简体中文', ['链接卡片', '代码块', '网站布局', '文章正文']],
    ['en', 'English', ['Link Card', 'Code Block', 'Site Layout', 'Prose']],
  ] as const) {
    await language.press('Enter');
    await page.locator('.header-actions [role="listbox"]').getByRole('option', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    for (const [index, id] of ['link-card', 'code-block', 'site-layout', 'prose'].entries()) {
      await page.goto('/#/' + id);
      await expect(page.locator('#page-title')).toHaveText(titles[index]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    }
  }
});

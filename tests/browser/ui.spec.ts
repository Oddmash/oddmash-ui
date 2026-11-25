import { test, expect } from '@playwright/test';
import { chooseDocsTheme } from './docs-test-helpers';
import AxeBuilder from '@axe-core/playwright';
import { pages } from '../../demo/content';
import { packageVersion, packageMinorVersion } from '../../demo/package-links';
import { tabToAllControls } from './keyboard';

for (const theme of ['light', 'dark']) {
  test(`${theme}: document pages, examples, contrast and mobile layout`, async ({
    page,
    browserName,
  }) => {
    test.setTimeout(75_000);
    await page.goto('/');
    await expect(page.locator('.version-label')).toHaveText(`v${packageMinorVersion}`);
    await chooseDocsTheme(page, theme === 'dark' ? 'Dark' : 'Light');
    await expect(page.locator('html')).toHaveAttribute('data-om-theme', theme);
    for (const { id } of pages) {
      await page.goto(`/#/${id}`);
      await expect(page.locator('#page-title')).toBeVisible();
      expect(
        (
          await new AxeBuilder({ page })
            .setLegacyMode(browserName === 'firefox')
            .analyze()
        ).violations,
        `${theme}/${id}`,
      ).toEqual([]);
      await page.setViewportSize({ width: 320, height: 780 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${id} overflows`,
      ).toBe(true);
      await page.setViewportSize({ width: 1280, height: 800 });
    }
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-om-theme', theme);
  });
  test(`${theme}: modal focus, contrast and return`, async ({
    page,
    browserName,
  }) => {
    await page.goto('/#/dialog');
    await chooseDocsTheme(page, theme === 'dark' ? 'Dark' : 'Light');
    await page.getByRole('button', { name: 'Edit project' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#dialog-name')).toBeFocused();
    expect(
      (
        await new AxeBuilder({ page })
          .setLegacyMode(browserName === 'firefox')
          .analyze()
      ).violations,
    ).toEqual([]);
    await page.keyboard.press('Shift+Tab');
    await expect(
      page.getByRole('button', { name: 'Save changes' }),
    ).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(
      page.getByRole('button', { name: 'Edit project' }),
    ).toBeFocused();
  });
}

test('a scrollable dialog contains overscroll on a short viewport', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 240 });
  await page.goto('/#/dialog');
  await page.getByRole('button', { name: 'Edit project' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((element) => element.scrollHeight > element.clientHeight)).toBe(true);
  await expect(dialog).toHaveCSS('overscroll-behavior', 'contain');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Edit project' })).toBeFocused();
});

test('navigation, search, live props, code, tokens and mobile menu work', async ({
  page,
  context,
}) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', {
    name: 'Documentation',
    exact: true,
  });
  const searchTrigger = page.getByRole('button', { name: 'Search documentation' });
  await searchTrigger.click();
  const searchDialog = page.getByRole('dialog', { name: 'Search documentation' });
  const search = searchDialog.getByRole('combobox', { name: 'Search documentation' });
  await expect(search).toBeFocused();
  await search.fill('button');
  await expect(searchDialog.getByRole('option', { name: 'Clipboard Button', exact: true })).toBeVisible();
  await searchDialog.getByRole('option', { name: 'Button', exact: true }).click();
  await expect(searchDialog).toBeHidden();
  await expect(page.locator('#page-title')).toHaveText('Button');
  await page.getByRole('combobox', { name: 'Variant', exact: true }).click();
  await page.getByRole('option', { name: 'secondary', exact: true }).click();
  const size = page.getByRole('combobox', { name: 'Size', exact: true });
  await size.press('End');
  await size.press('Enter');
  await expect(size).toHaveText('sm');
  await expect(
    page.getByRole('button', { name: 'Create project' }),
  ).toHaveClass(/om-button--secondary.*om-button--sm/);
  await page.getByLabel('Disabled', { exact: true }).check();
  await expect(
    page.getByRole('button', { name: 'Create project' }),
  ).toBeDisabled();
  await page.getByRole('button', { name: 'Code', exact: true }).click();
  await expect(page.locator('.playground pre')).toContainText(
    'size="sm" disabled',
  );
  await context
    .grantPermissions(['clipboard-read', 'clipboard-write'])
    .catch(() => {});
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async (value: string) => {
          document.documentElement.dataset.copied = value;
        },
      },
    });
  });
  const copy = page.locator('.playground .om-clipboard-button');
  await expect(copy).toHaveAccessibleName('Copy code');
  const copySize = await copy.boundingBox();
  expect(copySize?.width).toBeGreaterThanOrEqual(44);
  expect(copySize?.height).toBeGreaterThanOrEqual(44);
  await copy.press('Enter');
  await expect(copy).toBeFocused();
  await expect(page.locator('.playground [role="status"]')).toHaveText(
    'Copied',
  );
  expect(await page.locator('html').getAttribute('data-copied')).toContain(
    'variant="secondary"',
  );
  await navigation.getByRole('link', { name: 'Tabs', exact: true }).click();
  await page.getByRole('tab', { name: 'Activity' }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Settings' })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Activity' })).toBeFocused();
  await navigation.getByRole('link', { name: 'Tokens', exact: true }).click();
  const tokenTable = page.getByRole('table');
  await expect(
    tokenTable.getByRole('columnheader', { name: 'Light' }),
  ).toBeVisible();
  await expect(
    tokenTable.getByRole('columnheader', { name: 'Dark' }),
  ).toBeVisible();
  const background = tokenTable
    .getByRole('row')
    .filter({ hasText: '--om-semantic-color-bg' });
  await expect(background.locator('[data-om-theme="light"]')).not.toHaveCSS(
    'background-color',
    'rgba(0, 0, 0, 0)',
  );
  expect(
    await background
      .locator('[data-om-theme="light"]')
      .evaluate((swatch) => getComputedStyle(swatch).backgroundColor),
  ).not.toBe(
    await background
      .locator('[data-om-theme="dark"]')
      .evaluate((swatch) => getComputedStyle(swatch).backgroundColor),
  );
  await page.getByRole('textbox', { name: 'Filter tokens' }).fill('motion');
  await expect(page.locator('tbody tr')).toHaveCount(2);
  await page.reload();
  await expect(page.locator('#page-title')).toHaveText('Tokens');
  await page.setViewportSize({ width: 375, height: 812 });
  await expect(navigation).toBeHidden();
  await searchTrigger.click();
  await search.fill('dialog');
  await expect(searchDialog.getByRole('option', { name: 'Dialog', exact: true })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(searchDialog).toBeHidden();
  await expect(searchTrigger).toBeFocused();
  await expect(navigation).toBeHidden();
  await page.getByRole('button', { name: 'Toggle navigation' }).click();
  await navigation.getByRole('link', { name: 'Dialog', exact: true }).click();
  await expect(navigation).toBeHidden();
  const toggle = page.getByRole('button', { name: 'Toggle navigation' });
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(navigation).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(navigation).toBeHidden();
  await expect(toggle).toBeFocused();
  await page.getByRole('button', { name: 'Edit project' }).click();
  await page.getByLabel('Project name', { exact: true }).fill('A new idea');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('.preview').getByRole('status')).toHaveCount(0);
  await page.getByRole('button', { name: 'Edit project' }).click();
  await expect(page.getByLabel('Project name', { exact: true })).toHaveValue(
    'A new idea',
  );
});

test('nested themes and project overrides stay scoped', async ({ page }) => {
  await page.goto('/#/input');
  await chooseDocsTheme(page, 'Dark');
  await page.locator('.preview').evaluate((preview) => {
    preview.setAttribute('data-om-theme', 'light');
    (preview as HTMLElement).style.setProperty(
      '--om-semantic-color-border',
      '#b42318',
    );
    (preview as HTMLElement).style.setProperty(
      '--om-semantic-radius-sm',
      '2px',
    );
  });
  await expect(page.getByLabel('Project name', { exact: true })).toHaveCSS(
    'border-top-color',
    'rgb(180, 35, 24)',
  );
  await expect(page.getByLabel('Project name', { exact: true })).toHaveCSS(
    'border-top-left-radius',
    '2px',
  );
  await expect(page.locator('html')).toHaveAttribute('data-om-theme', 'dark');
  await page.goto('/#/button');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.getByRole('button', { name: 'Create project' })).toHaveCSS(
    'transition-duration',
    '0s',
  );
});

test('interaction lab captures keyboard events and keeps a bounded history', async ({
  page,
  browserName,
}) => {
  await page.goto('/#/interaction-pattern');
  const input = page.getByLabel('Project name', { exact: true });
  await input.focus();
  await input.fill('A new tool');
  await page.keyboard.press(tabToAllControls(browserName));
  const submit = page.getByRole('button', { name: 'Save project' });
  await expect(submit).toBeFocused();
  await expect(submit).toHaveCSS('outline-color', 'rgb(36, 89, 211)');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status')).toHaveText('Saved A new tool');
  const history = page.getByRole('list', { name: 'Recent interactions' });
  await expect(history.getByRole('listitem')).toHaveCount(6);
  await expect(history).toContainText('keydown');
  await expect(history).toContainText('Enter');
  await page.getByRole('tab', { name: 'Target' }).click();
  await expect(page.getByRole('tabpanel')).toContainText('Save project');
  await page.getByRole('button', { name: 'Clear events' }).click();
  await expect(page.getByRole('tabpanel')).toContainText(
    'Interact with the form',
  );
  await page.getByRole('tab', { name: 'Events' }).click();
  await expect(history).toHaveCount(0);
});

test('installation links distinguish the published package from source', async ({
  page,
}) => {
  await page.goto('/#/installation');
  const content = page.getByRole('main');
  await expect(
    content.getByRole('link', { name: 'npm', exact: true }),
  ).toHaveAttribute('href', 'https://www.npmjs.com/package/@oddmash/ui');
  await expect(
    content.getByRole('link', { name: 'GitHub repository' }),
  ).toHaveAttribute('href', 'https://github.com/Oddmash/oddmash-ui');
  await expect(
    content.getByText(`npm install @oddmash/ui@${packageVersion}`, { exact: true }),
  ).toBeVisible();
});

test('new controls support native keyboard interaction and navigation', async ({
  page,
}) => {
  await page.goto('/#/switch');
  const toggle = page.getByRole('switch', { name: 'Capture interactions' });
  await expect(toggle).toBeChecked();
  await toggle.focus();
  await page.keyboard.press('Space');
  await expect(toggle).not.toBeChecked();
  await expect(toggle).toBeFocused();

  await page.goto('/#/radio');
  const newest = page.getByRole('radio', { name: 'Newest first' });
  await newest.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio', { name: 'Oldest first' })).toBeChecked();

  await page.goto('/#/accordion');
  const summary = page.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(summary.locator('..')).toHaveAttribute('open', '');
  await expect(
    summary
      .locator('..')
      .getByText('to move to the next control', { exact: false }),
  ).toBeVisible();

  await page.goto('/#/pagination');
  const pagination = page.getByRole('navigation', { name: 'Example pagination' });
  const third = pagination.getByRole('button', { name: 'Page 3' });
  await third.press('Enter');
  await expect(third).toBeFocused();
  await expect(third).toHaveAttribute('aria-current', 'page');
  await expect(pagination.locator('[aria-current="page"]')).toHaveCount(1);
  await expect(page).toHaveURL(/#\/pagination$/);
});

test('timeline filters combine without changing the original event list', async ({
  page,
}) => {
  await page.goto('/#/timeline-filters');
  const filters = page.getByRole('group', { name: 'Timeline filters' });
  const timeline = page.getByRole('list', { name: 'Filtered event timeline' });
  await expect(timeline.getByRole('listitem')).toHaveCount(4);
  await filters.getByRole('combobox', { name: 'Event type' }).click();
  await filters.getByRole('option', { name: 'click' }).click();
  await expect(timeline.getByRole('listitem')).toHaveCount(2);
  await filters
    .getByRole('switch', { name: 'Selected element' })
    .press('Space');
  await expect(timeline.getByRole('listitem')).toHaveCount(1);
  await expect(timeline.getByRole('listitem')).toHaveText('click button');
});

test('custom Select navigates, skips disabled options and dismisses', async ({
  page,
}) => {
  await page.goto('/#/select');
  const select = page.getByRole('combobox', { name: 'Environment' });
  await select.focus();
  await select.press('ArrowDown');
  await expect(select).toHaveAttribute('aria-expanded', 'true');
  await select.press('ArrowDown');
  await select.press('Enter');
  await expect(select).toHaveText('Production');
  await expect(select).toBeFocused();
  await select.press('s');
  await select.press('Escape');
  await expect(select).toHaveText('Production');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await select.press('Home');
  const listbox = page.getByRole('listbox');
  const selected = listbox.getByRole('option', { selected: true });
  const active = listbox.locator('[data-active]');
  await expect(listbox).toHaveCSS('animation-name', 'om-dropdown-reveal');
  await expect(selected).toHaveCSS('font-weight', '400');
  await expect(selected).toHaveCSS('outline-style', 'none');
  await expect(active).toHaveAttribute('aria-selected', 'false');
  await expect(active).toHaveCSS('outline-style', 'solid');
  await expect(selected).toHaveCSS('display', 'flex');
  expect(await selected.evaluate((option) => getComputedStyle(option, '::after').visibility)).toBe('visible');
  expect(await selected.evaluate((option) => getComputedStyle(option).backgroundColor)).not.toBe(
    await active.evaluate((option) => getComputedStyle(option).backgroundColor),
  );
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(listbox).toHaveCSS('animation-name', 'none');
  await listbox.getByRole('option', { name: 'Staging' }).click();
  await expect(select).toHaveText('Staging');
  await expect(select).toHaveAttribute('aria-expanded', 'false');
});

test('feedback demos reveal content on demand and honor reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/alert');
  const alert = page.getByRole('alertdialog');
  await expect(alert).toHaveCount(0);
  await page.getByRole('button', { name: 'Show alert' }).click();
  await expect(alert).toContainText('Recording stopped');
  await expect(alert).toHaveCSS('animation-name', 'none');
  await expect(alert.getByRole('button', { name: 'OK' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(alert).toBeVisible();
  await alert.getByRole('button', { name: 'OK' }).press('Enter');
  await expect(alert).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Show alert' })).toBeFocused();
  await page.goto('/#/toast');
  const trigger = page.getByRole('button', { name: 'Show toast' });
  await expect(page.getByText('Project saved', { exact: true })).toHaveCount(0);
  await trigger.click();
  await expect(page.locator('.om-toast [role=status]')).toContainText(
    'Project saved',
  );
  await expect(page.locator('.om-toast')).toHaveCSS('animation-name', 'none');
  await trigger.click();
  const toasts = page.locator('.om-toast');
  await expect(toasts).toHaveCount(2);
  await expect.poll(async () => {
    const [first, second] = await Promise.all([toasts.nth(0).boundingBox(), toasts.nth(1).boundingBox()]);
    return first!.y + first!.height <= second!.y + 1;
  }).toBe(true);
  await page.getByRole('button', { name: 'Dismiss notification' }).first().click();
  await expect(toasts).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Dismiss notification' })).toBeFocused();
  await page.getByRole('button', { name: 'Dismiss notification' }).press('Enter');
  await expect(trigger).toBeFocused();
  await expect(page.locator('.om-toast')).toHaveCount(0);
});

test('breadcrumb preview updates its local location without routing', async ({
  page,
}) => {
  await page.goto('/#/breadcrumbs');
  const sample = page.getByRole('navigation', { name: 'Example breadcrumb' });
  const overview = sample.getByRole('button', { name: 'Overview' });
  await overview.click();
  await expect(overview).toHaveAttribute('aria-current', 'page');
  await expect(overview).toBeFocused();
  await expect(page).toHaveURL(/#\/breadcrumbs$/);
});

test('language switch translates docs and persists across reloads', async ({
  page,
}) => {
  await page.goto('/#/colors');
  const language = page.locator('.locale-select');
  for (const [locale, label, heading, palette] of [
    ['ko', '한국어', '색상', '모노크롬 팔레트'],
    ['ja', '日本語', 'カラー', 'モノクロパレット'],
    ['zh-CN', '简体中文', '颜色', '单色调色板'],
    ['en', 'English', 'Colors', 'Monochrome palette'],
  ]) {
    await language.press('Enter');
    await expect(language).toHaveCSS('outline-offset', '-1px');
    const list = page.getByRole('listbox');
    await expect(list).toBeVisible();
    await list.getByRole('option', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('#page-title')).toHaveText(heading);
    await expect(page.getByRole('heading', { name: palette })).toBeVisible();
    await page.reload();
    await expect(language).toHaveText(label);
  }
  await page.setViewportSize({ width: 320, height: 720 });
  await language.press('Enter');
  await language.press('ArrowDown');
  await language.press('Escape');
  await expect(language).toHaveText('English');
  await expect(language).toBeFocused();
  await expect(language).toHaveAttribute('aria-expanded', 'false');
});

test('wide layouts center docs within the space beyond the sidebar', async ({
  page,
}) => {
  for (const width of [1440, 1920, 2560]) {
    await page.setViewportSize({ width, height: 960 });
    for (const path of ['overview', 'button']) {
      await page.goto(`/#/${path}`);
      await expect(page.locator('#page-title')).toBeVisible();
      const sidebar = await page.locator('#docs-sidebar').boundingBox();
      const breadcrumb = await page.locator('.breadcrumb').boundingBox();
      expect(sidebar).not.toBeNull();
      expect(breadcrumb).not.toBeNull();
      const laneStart = sidebar!.x + sidebar!.width;
      const leftSpace = breadcrumb!.x - laneStart;
      const rightSpace = width - breadcrumb!.x - breadcrumb!.width;
      expect(Math.abs(leftSpace - rightSpace)).toBeLessThanOrEqual(1);
    }
  }
});

test('route navigation is static while components keep their motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/button');
  const content = page.locator('.route-content');
  await expect(content).toHaveCSS('animation-name', 'none');
  await page.locator('#docs-sidebar').getByRole('link', { name: 'Select', exact: true }).click();
  await expect(page).toHaveURL(/#\/select$/);
  await expect(content).toHaveCSS('animation-name', 'none');
  const select = page.getByRole('combobox', { name: 'Environment' });
  await select.press('Enter');
  await expect(page.getByRole('listbox')).toHaveCSS('animation-name', 'om-dropdown-reveal');
});

test('overview links lead to the actual pattern and component previews', async ({ page }) => {
  await page.goto('/#/overview');
  const main = page.getByRole('main');
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('Oddmash UI');
  for (const id of ['interaction-pattern', 'timeline-filters', 'select', 'colors']) {
    await expect(main.locator(`a[href="#/${id}"]`)).toBeVisible();
  }
  await expect(main.locator('.preview')).toHaveCount(0);
  await main.getByRole('link', { name: /Getting started/ }).click();
  await expect(main.getByRole('heading', { level: 1 })).toHaveText('Installation');
  await expect(main.getByRole('heading', { level: 2 }).first()).toHaveText('Install from npm');
});

test('form focus uses a single outline and preserves the invalid border', async ({ page }) => {
  await page.goto('/#/input');
  const name = page.getByRole('textbox', { name: 'Project name' });
  await name.focus();
  await expect(name).toHaveCSS('outline-style', 'solid');
  await expect(name).toHaveCSS('outline-offset', '-1px');
  const invalid = page.getByRole('textbox', { name: 'Repository URL' });
  await name.press('Tab');
  await expect(invalid).toBeFocused();
  await expect(invalid).toHaveCSS('outline-offset', '-3px');
  await expect(invalid).toHaveAttribute('aria-invalid', 'true');
});

test('accordion expands and collapses with native disclosure motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#/accordion');
  const accordion = page.locator('.om-accordion');
  const sampleToggle = () =>
    accordion.evaluate(async (element) => {
      const summary = element.querySelector('summary')!;
      const start = element.getBoundingClientRect().height;
      const heights: number[] = [];
      summary.click();
      const duration = Number.parseFloat(
        getComputedStyle(element, '::details-content').transitionDuration,
      ) * 1000;
      const started = performance.now();
      while (performance.now() - started < duration + 80) {
        await new Promise(requestAnimationFrame);
        heights.push(element.getBoundingClientRect().height);
      }
      return { start, end: heights.at(-1)!, heights };
    });

  for (const direction of ['open', 'closed']) {
    const { start, end, heights } = await sampleToggle();
    expect(end > start).toBe(direction === 'open');
    expect(heights.some((height) =>
      height > Math.min(start, end) && height < Math.max(start, end),
    )).toBe(true);
  }
  await expect(accordion).not.toHaveAttribute('open', '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => accordion.evaluate((element) =>
    getComputedStyle(element, '::details-content').transitionDuration,
  )).toBe('0s');
});

test('overview exposes a working demo and primary documentation links', async ({ page }, testInfo) => {
  await page.goto('/#/overview');
  await expect(page.getByRole('heading', { name: 'Oddmash UI', exact: true })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath('landing-light.png'), fullPage: true, animations: 'disabled' });
  const lab = page.locator('.overview .interaction-lab');
  await lab.getByLabel('Project name', { exact: true }).fill('Demo project');
  await lab.getByRole('button', { name: 'Save project' }).click();
  await expect(lab.getByRole('status')).toHaveText('Saved Demo project');
  await chooseDocsTheme(page, 'Dark');
  await page.screenshot({ path: testInfo.outputPath('landing-dark.png'), fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 320, height: 780 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('landing-mobile.png'), fullPage: true, animations: 'disabled' });
  await page.getByRole('link', { name: 'Browse components', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Button');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: testInfo.outputPath('component-docs.png'), fullPage: true, animations: 'disabled' });
});

test('toast stack expands on hover and focus, then dismisses without losing keyboard position', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/#/toast');
  const trigger = page.getByRole('button', { name: 'Show toast' });
  const viewport = page.locator('.om-toast-viewport');
  const cards = viewport.locator('.om-toast-region[data-state="open"]');
  const dismiss = viewport.getByRole('button', { name: 'Dismiss notification' });
  await trigger.click();
  await expect(cards).toHaveCount(1);
  await expect(cards.locator('.om-toast')).toHaveCSS('animation-name', 'om-toast-in');
  await trigger.click();
  await trigger.click();
  await page.mouse.move(0, 0);
  await expect(cards).toHaveCount(3);
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'false');
  await expect(cards.nth(0)).toHaveAttribute('data-stack-back', 'true');
  await expect(cards.nth(2)).toHaveAttribute('data-stack-back', 'false');
  await cards.last().hover();
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'true');
  await expect.poll(async () => {
    const first = await cards.first().boundingBox();
    const last = await cards.last().boundingBox();
    return !!first && !!last && first.y + first.height <= last.y;
  }).toBe(true);
  await page.mouse.move(0, 0);
  await dismiss.first().focus();
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'true');
  await dismiss.first().press('Enter');
  await expect(cards).toHaveCount(2);
  await expect(dismiss.first()).toBeFocused();
  await expect(viewport.locator('[data-state="closing"] .om-toast')).toHaveCount(0);
  await dismiss.first().press('Enter');
  await dismiss.first().press('Enter');
  await expect(trigger).toBeFocused();
  await expect(viewport.locator('.om-toast')).toHaveCount(0);
  await page.setViewportSize({ width: 320, height: 640 });
  await trigger.click();
  await expect(cards).toHaveCount(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
});

test('toast handles mixed-height notifications and rapid reopen during exit', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/#/toast');
  const trigger = page.getByRole('button', { name: 'Show toast' });
  const tone = page.getByRole('combobox', { name: 'Notification tone' });
  const viewport = page.locator('.om-toast-viewport');
  const open = viewport.locator('.om-toast-region[data-state="open"]');
  const choose = async (label: string) => {
    await tone.click();
    await page.getByRole('option', { name: label, exact: true }).click();
  };
  await trigger.click();
  await choose('Information');
  await trigger.click();
  await choose('Error');
  await trigger.click();
  await page.mouse.move(0, 0);
  await expect(open).toHaveCount(3);
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'false');
  await expect(open.last().locator('.om-toast')).toHaveAttribute('data-tone', 'error');
  await expect(open.last().getByRole('alert')).toContainText('Save failed');
  await expect.poll(async () => {
    const height = await open.last().locator('.om-toast').evaluate(el => el.getBoundingClientRect().height);
    const short = await open.first().locator('.om-toast').evaluate(el => el.getBoundingClientRect().height);
    return height > short;
  }).toBe(true);
  await expect.poll(async () => {
    const boxes = await Promise.all([open.nth(0).boundingBox(), open.nth(1).boundingBox(), open.nth(2).boundingBox()]);
    return boxes.every(Boolean) && boxes[0]!.y <= boxes[1]!.y - 8 && boxes[1]!.y <= boxes[2]!.y - 8;
  }).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('toast-collapsed-light.png'), animations: 'disabled' });
  await open.last().hover();
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'true');
  await expect.poll(async () => {
    const [a, b, c] = await Promise.all([open.nth(0).boundingBox(), open.nth(1).boundingBox(), open.nth(2).boundingBox()]);
    return !!a && !!b && !!c && a.y + a.height <= b.y + 1 && b.y + b.height <= c.y + 1;
  }).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('toast-expanded-light.png'), animations: 'disabled' });
  await open.nth(1).getByRole('button', { name: 'Dismiss notification' }).press('Enter');
  await expect(open).toHaveCount(2);
  await trigger.click();
  await expect(open).toHaveCount(3);
  await expect(viewport.locator('.om-toast-region[data-state="closing"]')).toHaveCount(0);
  await expect(open.last().getByRole('alert')).toContainText('Save failed');
  await chooseDocsTheme(page, 'Dark');
  await page.mouse.move(0, 0);
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'false');
  await page.screenshot({ path: testInfo.outputPath('toast-collapsed-dark.png'), animations: 'disabled' });
  await page.setViewportSize({ width: 320, height: 220 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(viewport).toHaveAttribute('data-stack-expanded', 'true');
  await expect(viewport).toHaveAttribute('data-stack-overflow', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await expect(open.last().getByRole('button', { name: 'Dismiss notification' })).toBeVisible();
});

test('toast previews keep dismissal visible in forced colors and localize the tone selector', async ({ page, browserName }) => {
  await page.emulateMedia({ reducedMotion: 'reduce', ...(browserName === 'chromium' ? { forcedColors: 'active' as const } : {}) });
  await page.goto('/#/toast');
  const trigger = page.getByRole('button', { name: 'Show toast' });
  await trigger.click();
  const dismiss = page.getByRole('button', { name: 'Dismiss notification' });
  if (browserName === 'chromium') {
    await trigger.focus();
    await page.keyboard.press('Tab');
    await expect(dismiss).toBeFocused();
    await expect(dismiss).toHaveCSS('outline-style', 'solid');
  } else {
    await dismiss.focus();
    await expect(dismiss).toBeFocused();
  }
  await dismiss.press('Enter');
  await expect(trigger).toBeFocused();
  const language = page.locator('.locale-select');
  for (const [locale, label, toneLabel, successLabel] of [
    ['ko', '한국어', '알림 상태', '성공'],
    ['ja', '日本語', '通知の種類', '成功'],
    ['zh-CN', '简体中文', '通知类型', '成功'],
    ['en', 'English', 'Notification tone', 'Success'],
  ]) {
    await language.press('Enter');
    await page.getByRole('listbox').getByRole('option', { name: label }).click();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('combobox', { name: toneLabel })).toHaveText(successLabel);
  }
});

test('toast icons and dismiss buttons align with the card center and narrow viewport insets', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/toast');
  const tone = page.getByRole('combobox', { name: 'Notification tone' });
  await tone.press('Enter');
  await page.getByRole('option', { name: 'Error', exact: true }).click();
  const trigger = page.getByRole('button', { name: 'Show toast' });
  await trigger.click();
  const card = page.locator('.om-toast-region[data-state="open"] .om-toast');
  await expect(card).toBeVisible();
  const centered = () => card.evaluate(el => {
    const bounds = el.getBoundingClientRect();
    const center = bounds.top + bounds.height / 2;
    return [...el.querySelectorAll('.om-toast-icon, button')].every(child => {
      const box = child.getBoundingClientRect();
      return Math.abs(box.top + box.height / 2 - center) <= 2;
    });
  });
  await expect.poll(centered).toBe(true);
  await page.setViewportSize({ width: 320, height: 640 });
  await expect.poll(centered).toBe(true);
  await expect.poll(() => card.evaluate(el => {
    const box = el.getBoundingClientRect();
    return Math.abs(box.left - (document.documentElement.clientWidth - box.right));
  })).toBeLessThanOrEqual(2);
  await card.getByRole('button', { name: 'Dismiss notification' }).click();
  await page.setViewportSize({ width: 1280, height: 800 });
  await tone.press('Enter');
  await page.getByRole('option', { name: 'Loading', exact: true }).click();
  await trigger.click();
  await expect(card.getByRole('status')).toContainText('Saving project');
  const loading = card.locator('[data-icon="loading"]');
  await expect(loading).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect(loading).toHaveCSS('animation-name', 'om-spinner-turn');
});

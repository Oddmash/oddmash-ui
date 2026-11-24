import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { pages } from '../../demo/content';
import { tabToAllControls } from './keyboard';

for (const theme of ['light', 'dark']) {
  test(`${theme}: document pages, examples, contrast and mobile layout`, async ({
    page,
    browserName,
  }) => {
    test.setTimeout(75_000);
    await page.goto('/');
    if (theme === 'dark')
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
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
    if (theme === 'dark')
      await page.getByRole('button', { name: 'Switch to dark theme' }).click();
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
  await page
    .getByRole('textbox', { name: 'Search documentation' })
    .fill('button');
  await expect(navigation.getByRole('link')).toHaveCount(1);
  await navigation.getByRole('link', { name: 'Button', exact: true }).click();
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
  await page
    .locator('.playground')
    .getByRole('button', { name: 'Copy code' })
    .click();
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
  await page
    .getByRole('textbox', { name: 'Search documentation' })
    .fill('dialog');
  await expect(navigation.getByRole('link')).toHaveCount(1);
  await page.keyboard.press('Escape');
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
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
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
    content.getByText('npm install @oddmash/ui@0.3.0', { exact: true }),
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
  await filters
    .getByRole('combobox', { name: 'Event type' })
    .selectOption('click');
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
  const [first, second] = await Promise.all([toasts.nth(0).boundingBox(), toasts.nth(1).boundingBox()]);
  expect(first!.y + first!.height).toBeLessThanOrEqual(second!.y);
  await page.getByRole('button', { name: 'Dismiss notification' }).first().click();
  await expect(toasts).toHaveCount(1);
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
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
  for (const [locale, heading, palette] of [
    ['ko', '색상', '모노크롬 팔레트'],
    ['ja', 'カラー', 'モノクロパレット'],
    ['zh-CN', '颜色', '单色调色板'],
    ['en', 'Colors', 'Monochrome palette'],
  ]) {
    await language.selectOption(locale);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('#page-title')).toHaveText(heading);
    await expect(page.getByRole('heading', { name: palette })).toBeVisible();
    await page.reload();
    await expect(language).toHaveValue(locale);
  }
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
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.screenshot({ path: testInfo.outputPath('landing-dark.png'), fullPage: true, animations: 'disabled' });
  await page.setViewportSize({ width: 320, height: 780 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath('landing-mobile.png'), fullPage: true, animations: 'disabled' });
  await page.getByRole('link', { name: 'Browse components', exact: true }).click();
  await expect(page.locator('#page-title')).toHaveText('Button');
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.screenshot({ path: testInfo.outputPath('component-docs.png'), fullPage: true, animations: 'disabled' });
});

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { pages } from '../../demo/content';

for (const theme of ['light', 'dark']) {
  test(`${theme}: document pages, examples, contrast and mobile layout`, async ({
    page,
    browserName,
  }) => {
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
  await page.getByLabel('Variant', { exact: true }).selectOption('secondary');
  await page.getByLabel('Size', { exact: true }).selectOption('sm');
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
  await page.getByRole('button', { name: 'Edit project' }).click();
  await page.getByLabel('Project name', { exact: true }).fill('A new idea');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog')).toBeHidden();
  await expect(page.locator('.preview').getByRole('status')).toContainText(
    'Saved: A new idea',
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
}) => {
  await page.goto('/#/interaction-pattern');
  const input = page.getByLabel('Project name', { exact: true });
  await input.focus();
  await input.fill('A new tool');
  await page.keyboard.press('Tab');
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
    content.getByText('npm install @oddmash/ui@0.1.0', { exact: true }),
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
  await page.getByRole('link', { name: 'Page 3' }).click();
  await expect(
    page.getByRole('table', { name: 'Recorded events' }),
  ).toBeVisible();
});

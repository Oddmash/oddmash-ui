import { expect, test, type Locator, type Page } from '@playwright/test';
import { chooseDocsTheme } from './docs-test-helpers';
import AxeBuilder from '@axe-core/playwright';
import { componentIds, type ComponentId } from '../../demo/content';
import { tabToAllControls } from './keyboard';

const previewChecks = {
  'docs-navigation': async (preview) => {
    const nav = preview.getByRole('navigation', { name: 'Documentation navigation example' });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Usage guide' })).toHaveAttribute('aria-current', 'page');
  },
  'table-of-contents': async (preview) => {
    const nav = preview.getByRole('navigation', { name: 'On this page' });
    await expect(nav.getByRole('link', { name: 'Installation' })).toHaveAttribute('href', '#om-toc-demo-setup');
    await expect(preview.locator('#om-toc-demo-setup')).toBeVisible();
  },
  'scroll-header': async (preview) => {
    const header = preview.locator('.om-scroll-header');
    await expect(header).toHaveAttribute('data-om-scroll-hidden', 'false');
    const lock = header.getByRole('button', { name: 'Keep header visible' });
    await lock.click();
    await expect(lock).toHaveAttribute('aria-pressed', 'true');
  },
  'locale-picker': async (preview) => {
    const trigger = preview.getByRole('combobox', { name: 'Language' });
    await expect(trigger).toHaveText('English');
    await trigger.press('Enter');
    await trigger.press('ArrowDown');
    await trigger.press('Enter');
    await expect(trigger).toHaveText('한국어');
  },
  'clipboard-button': async (preview) => {
    await expect(preview.getByRole('button', { name: 'Copy code' })).toBeVisible();
    await expect(preview.getByRole('region', { name: 'Clipboard example code' })).toBeVisible();
  },
  'toast-provider': async (preview) => {
    await expect(preview.getByRole('button', { name: 'Show saved notification' })).toBeVisible();
    await expect(preview.getByRole('button', { name: 'Show error notification' })).toBeVisible();
    await expect(preview.getByTestId('managed-toast-viewport').locator('[data-toast-id]')).toHaveCount(0);
  },
  "link-controls": async (preview) => {
    await expect(preview.getByRole('link', { name: 'Read guide' })).toBeVisible();
    await expect(preview.getByRole('button', { name: 'Open search example' })).toHaveAttribute('type', 'button');
    await expect(preview.getByRole('link', { name: 'GitHub example' })).toHaveAttribute('href', '#/link-controls');
    await expect(preview.getByRole('link', { name: 'npm example' })).toBeVisible();
    await expect(preview.locator('kbd')).toHaveText('Ctrl K');
  },
  'link-card': async (preview, page, browserName) => {
    const card = preview.getByRole('link', { name: /Usage guide/ });
    await expect(card).toHaveAttribute('href', '#/link-card');
    await page.locator('.view-switch').getByRole('button', { name: 'Code' }).press(tabToAllControls(browserName));
    const expand = page.getByRole('button', { name: 'Expand preview' });
    await expect(expand).toBeFocused();
    await expand.press(tabToAllControls(browserName));
    await expect(card).toBeFocused();
    await expect(card).toHaveCSS('background-size', '100% 100%');
    await expect(card).toHaveCSS('outline-style', 'solid');
    await expect(card).toHaveCSS('transition-duration', '0s');
    await expect(card.locator('.om-link-card-arrow')).toHaveCSS('transform', 'none');
  },
  'code-block': async (preview) => {
    await expect(preview.getByRole('button', { name: 'Copy code' })).toHaveAttribute('type', 'button');
    const code = preview.getByRole('region', { name: 'Terminal code' });
    await expect(code).toHaveText('pnpm add @oddmash/ui');
    await expect(code).toHaveCSS('white-space', 'pre');
    await expect(code).toHaveAttribute('tabindex', '0');
  },
  'site-layout': async (preview) => {
    await expect(preview.locator('header.om-site-header')).toBeVisible();
    await expect(preview.locator('footer.om-site-footer')).toBeVisible();
    await expect(preview.getByRole('navigation', { name: 'Header navigation example' }).getByRole('link', { name: 'Docs' })).toHaveAttribute('aria-current', 'page');
    await expect(preview.getByRole('navigation', { name: 'Footer navigation example' })).toBeVisible();
  },
  prose: async (preview) => {
    await expect(preview.getByRole('article')).toBeVisible();
    await expect(preview.getByRole('heading', { name: 'Usage guide' })).toBeVisible();
    await expect(preview.getByRole('table')).toBeVisible();
    await expect(preview.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
  },
  slider: async (preview) => {
    const slider = preview.getByRole('slider', { name: 'Width' });
    await slider.press('ArrowRight');
    await expect(slider).toHaveValue('321');
  },
  'toggle-group': async (preview, page, browserName) => {
    const views = preview.getByRole('group', { name: 'View mode' });
    const grid = views.getByRole('button', { name: 'Grid view' });
    const list = views.getByRole('button', { name: 'List view' });
    const formatting = preview.getByRole('group', { name: 'Text formatting' });
    const bold = formatting.getByRole('button', { name: 'Bold' });
    const italic = formatting.getByRole('button', { name: 'Italic' });

    await expect(grid).toHaveAttribute('aria-pressed', 'true');
    await expect(grid).toHaveAttribute('tabindex', '0');
    await expect(views.getByRole('button', { name: 'Compact view' })).toBeDisabled();
    await page.locator('.view-switch').getByRole('button', { name: 'Code' }).press(tabToAllControls(browserName));
    await expect(grid).toBeFocused();
    await expect(grid).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('ArrowRight');
    await expect(list).toBeFocused();
    await expect(grid).toHaveAttribute('aria-pressed', 'true');
    await expect(list).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('ArrowRight');
    await expect(grid).toBeFocused();
    await page.keyboard.press('End');
    await expect(list).toBeFocused();
    await page.keyboard.press('Space');
    await expect(list).toHaveAttribute('aria-pressed', 'true');
    await expect(grid).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press('Enter');
    await expect(list).toHaveAttribute('aria-pressed', 'false');
    await page.keyboard.press(tabToAllControls(browserName));
    await expect(bold).toBeFocused();
    await italic.click();
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
    await bold.click();
    await expect(bold).toHaveAttribute('aria-pressed', 'false');
    await expect(italic).toHaveAttribute('aria-pressed', 'true');
  },
  'command-palette': async (preview, page) => {
    const trigger = preview.getByRole('button', { name: 'Commands' });
    await trigger.press('Enter');
    const search = page.getByRole('combobox', { name: 'Search commands' });
    await expect(page.getByRole('group', { name: 'Project' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Save project' })).toHaveAccessibleDescription('Save current changes');
    await expect(search).toBeFocused();
    await search.fill('missing');
    await expect(page.getByRole('status').filter({ hasText: 'No commands found' })).toBeVisible();
    await search.fill('save');
    await expect(page.getByRole('option', { name: 'Save project' })).toBeVisible();
    await search.press('Enter');
    await expect(page.getByRole('dialog', { name: 'Commands' })).toHaveCount(0);
    await expect(trigger).toBeFocused();
  },
  button: async (preview, page, browserName) => {
    const button = preview.getByRole('button', { name: 'Create project' });
    await page.locator('.view-switch').getByRole('button', { name: 'Code' }).press(tabToAllControls(browserName));
    const expand = page.getByRole('button', { name: 'Expand preview' });
    await expect(expand).toBeFocused();
    await expand.press(tabToAllControls(browserName));
    await expect(button).toBeFocused();
    await expect(button).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(preview.getByRole('status')).toHaveCount(0);
  },
  input: async (preview) => {
    const name = preview.getByRole('textbox', { name: 'Project name' });
    await name.fill('Oddmash');
    await expect(name).toHaveValue('Oddmash');
    await expect(preview.getByRole('textbox', { name: 'Repository URL' }))
      .toHaveAccessibleDescription('Enter a valid repository URL.');
  },
  card: async (preview) => {
    await expect(preview.getByRole('heading', { name: 'Interaction Inspector' })).toBeVisible();
    await expect(preview.getByText('Active', { exact: true })).toBeVisible();
  },
  badge: async (preview) => {
    await expect(preview.getByText('Active', { exact: true })).toBeVisible();
    await expect(preview.getByText('Draft', { exact: true })).toBeVisible();
  },
  tabs: async (preview) => {
    await preview.getByRole('tab', { name: 'Activity' }).press('ArrowRight');
    const settings = preview.getByRole('tab', { name: 'Settings' });
    await expect(settings).toBeFocused();
    await expect(settings).toHaveAttribute('aria-selected', 'true');
    await expect(preview.getByRole('tabpanel', { name: 'Settings' })).toBeVisible();
    await expect(preview.getByRole('tab', { name: 'Members' })).toBeDisabled();
  },
  textarea: async (preview) => {
    const notes = preview.getByRole('textbox', { name: 'Release notes' });
    await notes.fill('First line\nSecond line');
    await expect(notes).toHaveValue('First line\nSecond line');
  },
  select: async (preview) => {
    const select = preview.getByRole('combobox', { name: 'Environment' });
    await select.press('Enter');
    const list = preview.getByRole('listbox');
    await expect(list.getByRole('option', { selected: true })).toHaveText('Staging');
    await expect(list.getByRole('option', { name: 'Preview' })).toBeDisabled();
    await select.press('ArrowDown');
    const production = list.getByRole('option', { name: 'Production' });
    await expect(select).toHaveAttribute('aria-activedescendant', await production.getAttribute('id') ?? '');
    await expect(select).toBeFocused();
  },
  checkbox: async (preview) => {
    const choice = preview.getByRole('checkbox', { name: 'Capture keyboard events' });
    await expect(choice).toBeChecked();
    await choice.press('Space');
    await expect(choice).not.toBeChecked();
  },
  radio: async (preview) => {
    await preview.getByRole('radio', { name: 'Newest first' }).press('ArrowRight');
    await expect(preview.getByRole('radio', { name: 'Oldest first' })).toBeChecked();
  },
  switch: async (preview) => {
    const toggle = preview.getByRole('switch', { name: 'Capture interactions' });
    await expect(toggle).toBeChecked();
    await toggle.press('Space');
    await expect(toggle).not.toBeChecked();
  },
  separator: async (preview) => {
    await expect(preview.getByRole('separator')).toBeVisible();
  },
  skeleton: async (preview) => {
    await preview.getByRole('button', { name: 'Show loading state' }).press('Enter');
    await expect(preview.getByRole('status')).toHaveText('Loading event details');
    await expect(preview.locator('.om-skeleton')).toHaveCount(3);
  },
  progress: async (preview) => {
    await preview.getByRole('button', { name: 'Show loading state' }).press('Enter');
    await expect(preview.getByRole('progressbar', { name: 'Exporting events (65%)' }))
      .toHaveJSProperty('position', 0.65);
  },
  table: async (preview) => {
    const table = preview.getByRole('table', { name: 'Recorded events' });
    await expect(table.getByRole('columnheader', { name: 'Event' })).toBeVisible();
    await expect(table.getByRole('row')).toHaveCount(3);
  },
  field: async (preview) => {
    const group = preview.getByRole('group', { name: 'Events to capture' });
    const pointer = group.getByRole('checkbox', { name: 'Pointer' });
    await pointer.press('Space');
    await expect(pointer).toBeChecked();
    await expect(group.getByRole('checkbox', { name: 'Focus' })).toBeChecked();
  },
  accordion: async (preview) => {
    await preview.getByText('Keyboard shortcuts', { exact: true }).press('Enter');
    await expect(preview.locator('details')).toHaveAttribute('open', '');
    await expect(preview.getByText('Tab', { exact: true })).toBeVisible();
  },
  alert: async (preview, page) => {
    await preview.getByRole('button', { name: 'Show alert' }).press('Enter');
    await expect(page.getByRole('alertdialog')).toContainText('Recording stopped');
    await expect(page.getByRole('button', { name: 'OK' })).toBeFocused();
  },
  avatar: async (preview) => {
    await expect(preview.getByRole('img', { name: 'Sangmin Park' })).toHaveText('SP');
    await expect(preview.getByRole('img', { name: 'Design team' })).toHaveText('DT');
  },
  spinner: async (preview) => {
    await preview.getByRole('button', { name: 'Show loading state' }).press('Enter');
    await expect(preview.getByRole('status')).toHaveText('Connecting to inspector');
    await expect(preview.locator('.om-spinner')).toHaveCSS('animation-name', 'none');
  },
  breadcrumbs: async (preview, page) => {
    const overview = preview.getByRole('button', { name: 'Overview' });
    await overview.press('Enter');
    await expect(overview).toHaveAttribute('aria-current', 'page');
    await expect(page).toHaveURL(/#\/breadcrumbs$/);
  },
  pagination: async (preview, page) => {
    const pagination = preview.getByRole('navigation', { name: 'Example pagination' });
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
    await pagination.getByRole('button', { name: 'Page 3' }).click();
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('3');
    await expect(page).toHaveURL(/#\/pagination$/);
  },
  'empty-state': async (preview) => {
    await expect(preview.getByText('No events captured')).toBeVisible();
    await expect(preview.getByRole('button', { name: 'Open Interaction Lab' })).toBeVisible();
  },
  toast: async (preview, page) => {
    await preview.getByRole('button', { name: 'Show toast' }).press('Enter');
    await expect(page.getByRole('status').filter({ hasText: 'Project saved' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Dismiss notification' })).toBeVisible();
  },
} satisfies Record<Exclude<ComponentId, 'dialog'>, (preview: Locator, page: Page, browserName: string) => Promise<void>>;

test.use({ reducedMotion: 'reduce' });

for (const id of componentIds.filter((id) => id !== 'dialog')) {
  test(`${id}: real component and active-state accessibility`, async ({ page, browserName }) => {
    await page.goto(`/#/${id}`);
    const preview = page.locator('.playground .preview');
    for (const theme of ['light', 'dark']) {
      await test.step(theme, async () => {
        if (theme === 'dark') await page.reload();
        await chooseDocsTheme(page, theme === 'dark' ? 'Dark' : 'Light');
        await expect(preview).toBeVisible();
        await previewChecks[id](preview, page, browserName);
        const { violations } = await new AxeBuilder({ page })
          .include(id === 'alert' ? '.om-alert-dialog' : id === 'toast' ? '.om-toast-viewport' : '.playground .preview')
          .setLegacyMode(browserName === 'firefox')
          .analyze();
        expect(violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))).toEqual([]);
      });
    }
  });
}

test('toggle-group: localized examples and 320px layout', async ({ page }) => {
  await page.goto('/#/toggle-group');
  const language = page.locator('.locale-select');
  const preview = page.locator('.playground .preview');

  for (const [locale, key, group, grid] of [
    ['ko', 'ArrowDown', '보기 모드', '격자 보기'],
    ['ja', 'ArrowDown', '表示モード', 'グリッド表示'],
    ['zh-CN', 'ArrowDown', '视图模式', '网格视图'],
    ['en', 'Home', 'View mode', 'Grid view'],
  ]) {
    await language.press('Enter');
    await language.press(key);
    await language.press('Enter');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await page.setViewportSize({ width: 320, height: 780 });
    await expect(preview.getByRole('group', { name: group }).getByRole('button', { name: grid, pressed: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    await page.setViewportSize({ width: 1280, height: 800 });
  }
});

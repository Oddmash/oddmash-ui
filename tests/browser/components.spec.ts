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
  'date-select': async (preview) => {
    const group = preview.getByRole('group', { name: 'Date and time' });
    await expect(group.getByRole('combobox')).toHaveCount(6);
    const seconds = group.getByRole('combobox', { name: 'Second' });
    await expect(seconds).toHaveValue('42');
    await seconds.selectOption('59');
    await expect(seconds).toHaveValue('59');
    await group.getByRole('button', { name: 'Clear date and time' }).click();
    await expect(group.getByRole('combobox', { name: 'Year' })).toBeFocused();
    await expect(seconds).toHaveValue('');
  },
  'date-calendar': async (preview) => {
    const grid = preview.getByRole('grid', { name: 'November 2026' });
    const selected = grid.getByRole('button', { name: 'Tuesday, November 17, 2026' });
    await selected.press('ArrowRight');
    const next = grid.getByRole('button', { name: 'Wednesday, November 18, 2026' });
    await expect(next).toBeFocused();
    await next.press('Enter');
    await expect(next).toHaveAttribute('data-selected', 'true');
    await preview.getByRole('button', { name: 'Next month' }).click();
    await expect(preview.getByRole('grid', { name: 'December 2026' })).toBeVisible();
  },
  'date-picker': async (preview) => {
    const trigger = preview.getByRole('button', { name: 'Calendar' });
    await trigger.click();
    await expect(preview.getByRole('grid', { name: 'November 2026' })).toBeVisible();
    await preview.getByRole('button', { name: 'Tuesday, November 24, 2026' }).click();
    await expect(trigger).toBeFocused();
    await expect(preview.getByRole('combobox', { name: 'Day' })).toHaveValue('24');
    await expect(preview.getByRole('combobox', { name: 'Second' })).toHaveValue('42');
    await trigger.click();
    await expect(preview.getByRole('grid')).toBeVisible();
  },
  'date-range-picker': async (preview) => {
    const start = preview.getByRole('group', { name: 'Start date' });
    const end = preview.getByRole('group', { name: 'End date' });
    await start.getByRole('combobox', { name: 'Day' }).selectOption('30');
    await expect(preview.getByRole('status')).toHaveText('End date must not precede start date.');
    await expect(end.getByRole('combobox', { name: 'Day' })).toHaveValue('25');
    await start.getByRole('button', { name: 'Clear date and time' }).click();
    await expect(start.getByRole('combobox', { name: 'Year' })).toHaveValue('');
    await expect(end.getByRole('combobox', { name: 'Second' })).toHaveValue('59');
    await end.getByRole('button', { name: 'Calendar' }).click();
    await expect(end.getByRole('grid', { name: 'November 2026' })).toBeVisible();
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

test('date range calendar fits narrow screens in each documentation language', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/#/date-range-picker');
  const preview = page.locator('.playground .preview');
  await preview.getByRole('group', { name: 'Start date' }).getByRole('button', { name: 'Calendar' }).click();
  const calendar = preview.locator('.om-date-calendar');
  await expect(calendar).toBeVisible();
  for (const locale of ['en', 'ko', 'ja', 'zh-CN']) {
    await page.evaluate(language => localStorage.setItem('om-docs-locale', language), locale);
    await page.reload();
    await preview.locator('.om-date-picker-actions button[aria-expanded]').first().click();
    await expect(calendar).toBeVisible();
    expect(await calendar.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
    expect(await preview.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
  }
});

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

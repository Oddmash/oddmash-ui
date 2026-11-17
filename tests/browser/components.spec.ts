import { expect, test, type Locator, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { componentIds, type ComponentId } from '../../demo/content';

const previewChecks = {
  button: async (preview, page) => {
    const button = preview.getByRole('button', { name: 'Create project' });
    await page.locator('.view-switch').getByRole('button', { name: 'Code' }).press('Tab');
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
  dialog: async (preview, page) => {
    await preview.getByRole('button', { name: 'Edit project' }).press('Enter');
    await expect(page.getByRole('dialog', { name: 'Project settings' })).toBeVisible();
    await expect(page.getByRole('dialog').getByRole('textbox')).toBeFocused();
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
  alert: async (preview) => {
    await preview.getByRole('button', { name: 'Show alert' }).press('Enter');
    await expect(preview.getByRole('alert')).toContainText('Recording stopped');
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
  pagination: async (preview) => {
    const pagination = preview.getByRole('navigation', { name: 'Example pagination' });
    await expect(pagination.locator('[aria-current="page"]')).toHaveText('2');
    await expect(pagination.getByRole('link', { name: 'Page 3' })).toHaveAttribute('href', '#/table');
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
} satisfies Record<ComponentId, (preview: Locator, page: Page) => Promise<void>>;

test.use({ reducedMotion: 'reduce' });

for (const id of componentIds) {
  test(`${id}: real component and active-state accessibility`, async ({ page, browserName }) => {
    await page.goto(`/#/${id}`);
    const preview = page.locator('.playground .preview');
    for (const theme of ['light', 'dark']) {
      await test.step(theme, async () => {
        if (theme === 'dark') {
          await page.reload();
          await page.getByRole('button', { name: 'Switch to dark theme' }).click();
        }
        await expect(preview).toBeVisible();
        await previewChecks[id](preview, page);
        const { violations } = await new AxeBuilder({ page })
          .include(id === 'dialog' ? '.docs-dialog' : '.playground .preview')
          .setLegacyMode(browserName === 'firefox')
          .analyze();
        expect(violations.map(({ id, nodes }) => ({ id, targets: nodes.map(({ target }) => target) }))).toEqual([]);
      });
    }
  });
}

import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Button } from '../src/button';
import { CommandPalette, type CommandPaletteItem } from '../src/command-palette';

const props = {
  trigger: <Button>Commands</Button>,
  title: 'Commands',
  description: 'Choose a result',
  searchLabel: 'Search',
  emptyLabel: 'No results',
};

it('groups descriptive search results and preserves keyboard selection order', async () => {
  const user = userEvent.setup();
  const select = vi.fn();
  const items: CommandPaletteItem[] = [
    { id: 'intro', label: 'Introduction', group: 'Guide', description: 'Learn the framework', onSelect: select },
    { id: 'api', label: 'Runtime', group: 'Reference', description: 'Public methods', onSelect: select },
    { id: 'start', label: 'Getting started', group: 'Guide', keywords: ['install'], onSelect: select },
    { id: 'locked', label: 'Unavailable', group: 'Reference', disabled: true, onSelect: select },
  ];
  render(<CommandPalette {...props} items={items} />);
  await user.click(screen.getByRole('button', { name: 'Commands' }));
  const search = screen.getByRole('combobox', { name: 'Search' });
  expect(screen.getByRole('group', { name: 'Guide' })).toContainElement(screen.getByRole('option', { name: 'Getting started' }));
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('option', { name: 'Getting started' })).toHaveAttribute('aria-selected', 'true');
  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('option', { name: 'Runtime' })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('option', { name: 'Runtime' })).toHaveAccessibleDescription('Public methods');
  await user.type(search, 'framework');
  expect(screen.getAllByRole('option')).toHaveLength(1);
  expect(screen.getByRole('option', { name: 'Introduction' })).toHaveAttribute('aria-selected', 'true');
  await user.keyboard('{Enter}');
  expect(select).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('opens with an opt-in shortcut and follows controlled state', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();
  function Example() {
    const [open, setOpen] = useState(false);
    return <CommandPalette {...props} open={open} shortcut onOpenChange={value => { onChange(value); setOpen(value); }} items={[]} />;
  }
  render(<Example />);
  fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(onChange).toHaveBeenCalledWith(true);
  await user.type(screen.getByRole('combobox'), 'text');
  await user.keyboard('{Escape}');
  expect(onChange).toHaveBeenLastCalledWith(false);
  await user.click(screen.getByRole('button', { name: 'Commands' }));
  expect(screen.getByRole('combobox')).toHaveValue('');
});

it('supports consumer matching and result limits without enabling a global shortcut by default', async () => {
  const user = userEvent.setup();
  const items = [
    { id: 'one', label: 'First', onSelect: vi.fn() },
    { id: 'two', label: 'Second', onSelect: vi.fn() },
    { id: 'three', label: 'Third', onSelect: vi.fn() },
  ];
  render(<CommandPalette {...props} items={items} maxResults={1} filter={(item, query) => !query || item.id === query} />);
  fireEvent.keyDown(document, { key: 'k', metaKey: true });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Commands' }));
  expect(screen.getAllByRole('option')).toHaveLength(1);
  expect(screen.getByRole('option', { name: 'First' })).toBeVisible();
  await user.type(screen.getByRole('combobox'), 'three');
  expect(screen.getByRole('option', { name: 'Third' })).toBeVisible();
});

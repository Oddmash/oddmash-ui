import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Button, CommandPalette, Slider } from '../src';

it('preserves native range value, limits and ref', () => {
  const ref = createRef<HTMLInputElement>();
  render(<label>Width <Slider ref={ref} name="width" min={100} max={600} step={10} defaultValue={320} /></label>);
  expect(screen.getByRole('slider', { name: 'Width' })).toBe(ref.current);
  expect(ref.current).toHaveValue('320');
  expect(ref.current?.step).toBe('10');
});

it('filters commands, skips disabled items and selects with keyboard', async () => {
  const user = userEvent.setup();
  const action = vi.fn();
  render(<CommandPalette trigger={<Button>Commands</Button>} title="Commands" description="Choose an action" searchLabel="Search commands" emptyLabel="No commands found" items={[{ id: 'disabled', label: 'Save disabled', disabled: true, onSelect: vi.fn() }, { id: 'save', label: 'Save project', onSelect: action }, { id: 'open', label: 'Open', onSelect: vi.fn() }]} />);
  await user.click(screen.getByRole('button', { name: 'Commands' }));
  await user.type(screen.getByRole('combobox'), 'save');
  expect(screen.queryByRole('option', { name: 'Open' })).not.toBeInTheDocument();
  await user.keyboard('{ArrowDown}{Enter}');
  expect(action).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button', { name: 'Commands' }));
  await user.keyboard('{Escape}');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Select } from '../src/select-dropdown';

const options = [
  { value: 'dev', label: 'Development' },
  { value: 'test', label: 'Testing', disabled: true },
  { value: 'prod', label: 'Production' },
];

it('distinguishes selected, pointer-hovered, and keyboard-active options', async () => {
  const user = userEvent.setup();
  const changed = vi.fn();
  render(<Select options={options} defaultValue="dev" aria-label="Environment" onValueChange={changed} />);
  const trigger = screen.getByRole('combobox');
  await user.click(trigger);
  const selected = screen.getByRole('option', { name: 'Development' });
  const production = screen.getByRole('option', { name: 'Production' });
  expect(selected).toHaveAttribute('aria-selected', 'true');
  expect(selected).not.toHaveAttribute('data-keyboard-active');
  fireEvent.pointerMove(production, { pointerType: 'mouse' });
  expect(production).toHaveAttribute('data-active');
  expect(production).not.toHaveAttribute('data-keyboard-active');
  expect(selected).toHaveAttribute('aria-selected', 'true');
  await user.keyboard('{ArrowUp}');
  expect(selected).toHaveAttribute('data-keyboard-active');
  expect(trigger).toHaveAttribute('aria-activedescendant', selected.id);
  await user.keyboard('{ArrowDown}{Enter}');
  expect(changed).toHaveBeenCalledExactlyOnceWith('prod');
  expect(trigger).toHaveTextContent('Production');
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

it('contains wheel movement at each end but leaves list scrolling available', async () => {
  render(<Select options={options} defaultValue="dev" aria-label="Environment" />);
  await userEvent.click(screen.getByRole('combobox'));
  const menu = screen.getByRole('listbox');
  Object.defineProperties(menu, {
    scrollHeight: { value: 300 },
    clientHeight: { value: 100 },
    scrollTop: { value: 100, writable: true },
  });
  expect(fireEvent.wheel(menu, { deltaY: 50 })).toBe(true);
  menu.scrollTop = 200;
  expect(fireEvent.wheel(menu, { deltaY: 50 })).toBe(false);
  expect(fireEvent.wheel(menu, { deltaY: -50 })).toBe(true);
  menu.scrollTop = 0;
  expect(fireEvent.wheel(menu, { deltaY: -50 })).toBe(false);
});

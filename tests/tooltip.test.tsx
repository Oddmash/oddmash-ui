import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Tooltip } from '../src/tooltip';

it('retains link semantics, describes the trigger and dismisses on Escape', async () => {
  const user = userEvent.setup();
  render(<Tooltip content="Reference summary"><a href="/guide">Guide</a></Tooltip>);
  const link = screen.getByRole('link', { name: 'Guide' });
  expect(link).toHaveAttribute('href', '/guide');
  expect(link).toHaveAccessibleDescription('Reference summary');
  await user.tab();
  expect(screen.getByRole('tooltip')).toBeVisible();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('tooltip')).toBeNull());
  expect(link).toHaveFocus();
});

it('keeps the tooltip open while hovering its content and hides after leaving', async () => {
  const user = userEvent.setup();
  render(<Tooltip content="Summary"><button type="button">Reference</button></Tooltip>);
  const trigger = screen.getByRole('button');
  await user.hover(trigger);
  const panel = screen.getByRole('tooltip');
  await user.hover(panel);
  expect(panel).toBeVisible();
  await user.unhover(panel);
  await waitFor(() => expect(panel).not.toBeVisible());
});

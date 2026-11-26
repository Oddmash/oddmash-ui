import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Tooltip, mountTooltip, type TooltipController } from '../src/tooltip';

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

it('retains focus and updated content across fresh child JSX', async () => {
  const user = userEvent.setup();
  const view = render(<Tooltip content="Original"><button>Reference</button></Tooltip>);
  await user.tab();
  const trigger = screen.getByRole('button', { name: 'Reference' });
  expect(screen.getByRole('tooltip')).toHaveTextContent('Original');
  view.rerender(<Tooltip content="Updated"><button>Reference</button></Tooltip>);
  expect(trigger).toHaveFocus();
  expect(screen.getByRole('tooltip')).toHaveTextContent('Updated');
  expect(trigger).toHaveAccessibleDescription('Updated');
});

it('removes only its own description during teardown', () => {
  const view = render(<><input aria-describedby="hint" /><span id="hint">Hint</span><span id="validation">Validation error</span><span id="tip" hidden>Tooltip</span></>);
  const trigger = screen.getByRole('textbox');
  const panel = view.container.querySelector<HTMLElement>('#tip')!;
  const controller = mountTooltip(trigger, panel);
  trigger.setAttribute('aria-describedby', 'hint validation tip');
  controller.destroy();
  expect(trigger).toHaveAttribute('aria-describedby', 'hint validation');
  expect(trigger).toHaveAccessibleDescription('Hint Validation error');
});

it('suppresses the latest native title and restores it on teardown', () => {
  const view = render(<Tooltip content="Original"><button title="Old title">Reference</button></Tooltip>);
  const trigger = screen.getByRole('button');
  expect(trigger).not.toHaveAttribute('title');
  view.rerender(<Tooltip content="Updated"><button title="New title">Reference</button></Tooltip>);
  expect(trigger).not.toHaveAttribute('title');
  view.unmount();
  expect(trigger).toHaveAttribute('title', 'New title');
});

it('preserves the public destroy-only controller type', () => {
  const controller: TooltipController = { destroy: () => undefined };
  expect(controller.destroy()).toBeUndefined();
});

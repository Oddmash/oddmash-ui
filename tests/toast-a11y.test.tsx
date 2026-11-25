import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Toast, ToastViewport } from '../src';

it('uses a status for neutral notifications and an alert for danger ones', () => {
  render(
    <ToastViewport>
      <Toast open title="Saved" />
      <Toast open title="Failed" tone="danger" />
    </ToastViewport>,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Saved');
  expect(screen.getByRole('alert')).toHaveTextContent('Failed');
});

it('renders nothing for a closed notification', () => {
  render(
    <ToastViewport>
      <Toast open={false} title="Hidden" onDismiss={() => {}} />
    </ToastViewport>,
  );
  expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument();
});

it('dismisses once from the keyboard with the expected button name', async () => {
  const user = userEvent.setup();
  const onDismiss = vi.fn();
  render(
    <ToastViewport>
      <Toast open title="Saved" onDismiss={onDismiss} />
    </ToastViewport>,
  );
  const dismiss = screen.getByRole('button', { name: 'Dismiss notification' });
  dismiss.focus();
  expect(dismiss).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

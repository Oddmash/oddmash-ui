import { createRef, StrictMode } from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Toast, ToastViewport } from '../src';

it('sets and clears an object ref to the viewport div', () => {
  const ref = createRef<HTMLDivElement>();
  const { unmount } = render(
    <ToastViewport ref={ref} data-testid="toast-viewport">
      <Toast open title="Saved" onDismiss={vi.fn()} />
    </ToastViewport>,
  );

  const viewport = screen.getByTestId('toast-viewport');
  expect(viewport).toBeInstanceOf(HTMLDivElement);
  expect(viewport).toContainElement(screen.getByRole('status'));
  expect(ref.current).toBe(viewport);

  unmount();
  expect(ref.current).toBeNull();
});

it('passes the viewport div to a callback ref and clears it on unmount', () => {
  const ref = vi.fn<(node: HTMLDivElement | null) => void>();
  const { unmount } = render(
    <StrictMode>
      <ToastViewport ref={ref} data-testid="toast-viewport">
        <Toast open title="Saved" onDismiss={vi.fn()} />
      </ToastViewport>
    </StrictMode>,
  );

  expect(ref).toHaveBeenLastCalledWith(screen.getByTestId('toast-viewport'));

  ref.mockClear();
  unmount();
  expect(ref).toHaveBeenLastCalledWith(null);
});

it('combines class names and forwards native attributes to the viewport div', () => {
  render(
    <ToastViewport
      data-testid="toast-viewport"
      className="custom-viewport"
      id="notifications"
      aria-label="Notifications"
      tabIndex={-1}
    >
      <Toast open title="Saved" onDismiss={vi.fn()} />
    </ToastViewport>,
  );

  const viewport = screen.getByTestId('toast-viewport');
  expect(viewport).toHaveClass('om-toast-viewport', 'custom-viewport');
  expect(viewport).toHaveAttribute('id', 'notifications');
  expect(viewport).toHaveAttribute('aria-label', 'Notifications');
  expect(viewport).toHaveAttribute('tabindex', '-1');
});
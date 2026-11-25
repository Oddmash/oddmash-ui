import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ToastProvider, useToast } from '../src/toast-provider';
import { Toast, ToastViewport } from '../src/toast';

const Controls = () => {
  const { showToast } = useToast();
  return (
    <>
      <button onClick={() => showToast({ title: 'First', duration: 1000, dismissLabel: 'Dismiss first' })}>First notice</button>
      <button onClick={() => showToast({ title: 'Second', tone: 'error', dismissLabel: 'Dismiss second' })}>Second notice</button>
      <button onClick={() => showToast({ title: 'Third', duration: null, dismissLabel: 'Dismiss third' })}>Third notice</button>
      <button onClick={() => showToast({ title: 'Long', duration: 3000, dismissLabel: 'Dismiss long' })}>Long notice</button>
    </>
  );
};

const advance = async (ms: number) => {
  await act(async () => { await vi.advanceTimersByTimeAsync(ms); });
};

const activate = (name: string) => {
  const button = screen.getByRole('button', { name });
  act(() => { button.focus(); fireEvent.click(button); });
  return button;
};

const remainingFraction = (container: HTMLElement) => {
  const region = container.querySelector<HTMLElement>('[data-toast-id][data-state="open"]');
  return Number(region?.style.getPropertyValue('--om-toast-remaining'));
};

const mousePointer = (target: HTMLElement, type: 'pointerover' | 'pointerout') => {
  const event = new MouseEvent(type, { bubbles: true });
  Object.defineProperty(event, 'pointerType', { value: 'mouse' });
  fireEvent(target, event);
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(Date.now()), 16));
  vi.stubGlobal('cancelAnimationFrame', (id: ReturnType<typeof setTimeout>) => clearTimeout(id));
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it('pre-mounts the live region, uses the real tone, forwards viewport props and retains focus on the trigger', async () => {
  const ref = createRef<HTMLDivElement>();
  render(<ToastProvider ref={ref} className="sample" data-testid="viewport"><Controls /></ToastProvider>);
  const viewport = screen.getByTestId('viewport');
  expect(ref.current).toBe(viewport);
  expect(viewport).toHaveClass('om-toast-viewport', 'sample');
  const button = activate('Second notice');
  expect(screen.getByRole('alert')).toBeEmptyDOMElement();
  expect(screen.queryByRole('button', { name: 'Dismiss second' })).not.toBeInTheDocument();
  await advance(32);
  expect(screen.getByRole('alert')).toHaveTextContent('Second');
  expect(button).toHaveFocus();
  await advance(10000);
  expect(screen.getByRole('alert')).toHaveTextContent('Second');
});

it('bounds the visible stack, queues distinct IDs and removes a dismissed control before admitting the next toast', async () => {
  const { container } = render(<ToastProvider maxVisible={2}><Controls /></ToastProvider>);
  activate('First notice');
  activate('Second notice');
  activate('Third notice');
  await advance(32);
  expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(2);
  expect(screen.queryByRole('button', { name: 'Dismiss third' })).not.toBeInTheDocument();
  const first = screen.getByRole('button', { name: 'Dismiss first' });
  const second = screen.getByRole('button', { name: 'Dismiss second' });
  act(() => { first.focus(); fireEvent.click(first); });
  expect(first).not.toBeInTheDocument();
  expect(second).toHaveFocus();
  expect(container.querySelector('[data-state="closing"][data-toast-id]')).toBeInTheDocument();
  await advance(250);
  await advance(32);
  expect(container.querySelectorAll('[data-toast-id]')).toHaveLength(2);
  expect(screen.getByRole('button', { name: 'Dismiss third' })).toBeInTheDocument();
  expect(second).toBeInTheDocument();
});

it('pauses remaining expiry while the viewport has keyboard focus and restores focus after the final manual dismissal', async () => {
  const { container } = render(<ToastProvider><Controls /></ToastProvider>);
  const trigger = activate('First notice');
  await advance(32);
  await advance(600);
  const close = screen.getByRole('button', { name: 'Dismiss first' });
  act(() => close.focus());
  const paused = remainingFraction(container);
  expect(paused).toBeCloseTo(0.4);
  await advance(5000);
  expect(remainingFraction(container)).toBe(paused);
  expect(close).toHaveFocus();
  act(() => trigger.focus());
  await advance(399);
  expect(close).toBeInTheDocument();
  await advance(2);
  expect(close).not.toBeInTheDocument();
  await advance(250);
  const secondTrigger = activate('Second notice');
  await advance(32);
  const secondClose = screen.getByRole('button', { name: 'Dismiss second' });
  act(() => { secondClose.focus(); fireEvent.click(secondClose); });
  expect(secondTrigger).toHaveFocus();
});

it('shows remaining auto-dismiss time and freezes the same remaining fraction on hover until mouse leave', async () => {
  const { container } = render(<ToastProvider><Controls /></ToastProvider>);
  activate('First notice');
  await advance(32);
  const viewport = container.querySelector<HTMLElement>('.om-toast-viewport')!;
  const track = container.querySelector('.om-toast-progress')!;
  expect(track).toHaveAttribute('aria-hidden', 'true');
  expect(remainingFraction(container)).toBe(1);
  await advance(320);
  expect(remainingFraction(container)).toBeCloseTo(0.68);
  mousePointer(viewport, 'pointerover');
  const paused = remainingFraction(container);
  await advance(5000);
  expect(remainingFraction(container)).toBe(paused);
  expect(screen.getByRole('button', { name: 'Dismiss first' })).toBeInTheDocument();
  mousePointer(viewport, 'pointerout');
  await advance(320);
  expect(remainingFraction(container)).toBeCloseTo(0.36);
  await advance(361);
  expect(screen.queryByRole('button', { name: 'Dismiss first' })).not.toBeInTheDocument();
  expect(container.querySelector<HTMLElement>('[data-state="closing"][data-toast-id]')?.style.getPropertyValue('--om-toast-remaining')).toBe('0');
});

it('keeps persistent notifications free of countdowns and starts queued countdowns only when admitted', async () => {
  const { container } = render(<ToastProvider maxVisible={1}><Controls /></ToastProvider>);
  activate('Second notice');
  activate('First notice');
  await advance(32);
  expect(container.querySelector('.om-toast-progress')).not.toBeInTheDocument();
  await advance(5000);
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss second' }));
  await advance(250);
  await advance(32);
  expect(container.querySelector('.om-toast-progress')).toBeInTheDocument();
  expect(remainingFraction(container)).toBe(1);
});

it('updates reduced-motion countdowns without frame animation and supports controlled decorative progress', async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  const { container } = render(<ToastProvider><Controls /></ToastProvider>);
  activate('Long notice');
  await advance(32);
  await advance(500);
  expect(remainingFraction(container)).toBe(1);
  await advance(500);
  expect(remainingFraction(container)).toBeCloseTo(2 / 3);
  const controlled = vi.fn();
  const view = render(<Toast open title="Standalone" onDismiss={controlled} progress={0.25} />);
  expect(view.container.querySelector<HTMLElement>('.om-toast-progress > span')?.style.transform).toContain('0.25');
  await advance(5000);
  expect(controlled).not.toHaveBeenCalled();
  expect(screen.getByText('Standalone')).toBeInTheDocument();
});

it('measures an explicitly bounded toast viewport independently of browser height', async () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }));
  const height = vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(80);
  try {
    const { container } = render(
      <ToastViewport style={{ maxBlockSize: '120px' }}>
        <Toast open title="First" onDismiss={() => {}} />
        <Toast open title="Second" onDismiss={() => {}} />
      </ToastViewport>,
    );
    await advance(32);
    expect(container.querySelector('.om-toast-viewport')).toHaveAttribute('data-stack-overflow', 'true');
  } finally {
    height.mockRestore();
  }
});

it('keeps reduced-motion removal immediate and clears pending callbacks on unmount', async () => {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: query.includes('prefers-reduced-motion'),
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
  const { unmount, container } = render(<ToastProvider><Controls /></ToastProvider>);
  const trigger = activate('Third notice');
  await advance(32);
  const close = screen.getByRole('button', { name: 'Dismiss third' });
  act(() => { close.focus(); fireEvent.click(close); });
  expect(trigger).toHaveFocus();
  await advance(1);
  expect(container.querySelector('[data-toast-id]')).not.toBeInTheDocument();
  activate('First notice');
  unmount();
  await advance(5000);
  expect(container).toBeEmptyDOMElement();
});

it('hydrates the provider with a pre-existing empty viewport and no recoverable errors', async () => {
  const app = <ToastProvider><Controls /></ToastProvider>;
  const container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = renderToString(app);
  expect(container.querySelector('.om-toast-viewport')).toBeInTheDocument();
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(container, app, { onRecoverableError: (error) => errors.push(error) }); });
  expect(errors).toEqual([]);
  await act(async () => root.unmount());
  container.remove();
});

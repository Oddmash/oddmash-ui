import { act, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { render, screen, fireEvent } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { ClipboardButton, copyText } from '../src/clipboard-button';

const labels = { idle: 'Copy code', pending: 'Copying', copied: 'Copied', error: 'Select the code to copy' };
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

const clipboard = (writeText: (text: string) => Promise<void>) => {
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
};

const settle = async () => {
  await act(async () => { await Promise.resolve(); });
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
  else Reflect.deleteProperty(navigator, 'clipboard');
  vi.useRealTimers();
});

it('only writes on explicit activation, reflects actual success and preserves native ref, focus and button semantics', async () => {
  const write = vi.fn(async () => {});
  clipboard(write);
  const ref = createRef<HTMLButtonElement>();
  const success = vi.fn();
  const submit = vi.fn();
  render(
    <form onSubmit={submit}>
      <ClipboardButton ref={ref} text={'  exact code\n'} labels={labels} className="sample" onCopied={success} />
    </form>,
  );
  const button = screen.getByRole('button', { name: 'Copy code' });
  expect(ref.current).toBe(button);
  expect(button).toHaveClass('om-button', 'om-clipboard-button', 'sample');
  expect(button).toHaveAttribute('type', 'button');
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
  expect(write).not.toHaveBeenCalled();
  button.focus();
  fireEvent.click(button);
  expect(button).toHaveAttribute('aria-busy', 'true');
  await settle();
  expect(write).toHaveBeenCalledOnce();
  expect(write).toHaveBeenCalledWith('  exact code\n');
  expect(success).toHaveBeenCalledWith('  exact code\n');
  expect(button).toHaveFocus();
  expect(button).toHaveTextContent('Copied');
  expect(screen.getByRole('status')).toHaveTextContent('Copied');
  expect(submit).not.toHaveBeenCalled();
  await act(async () => vi.advanceTimersByTimeAsync(2500));
  expect(button).toHaveTextContent('Copy code');
  expect(screen.getByRole('status')).toBeEmptyDOMElement();
});

it('reports actual failure without simulated success and supports one external announcement path', async () => {
  const denied = new Error('Permission denied');
  const write = vi.fn(async () => { throw denied; });
  clipboard(write);
  const failure = vi.fn();
  const copied = vi.fn();
  render(
    <ClipboardButton
      text="code"
      labels={labels}
      announce={false}
      onCopied={copied}
      onCopyError={failure}
      children={(state) => <span>{state}</span>}
    />,
  );
  const button = screen.getByRole('button', { name: 'Copy code' });
  fireEvent.click(button);
  await settle();
  expect(button).toHaveAttribute('data-copy-state', 'error');
  expect(button).toHaveAccessibleName(labels.error);
  expect(failure).toHaveBeenCalledWith(denied);
  expect(copied).not.toHaveBeenCalled();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  await act(async () => vi.advanceTimersByTimeAsync(5000));
  expect(button).toHaveAttribute('data-copy-state', 'error');
});

it('does not start concurrent writes and discards stale status after text changes', async () => {
  let resolve!: () => void;
  const write = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
  clipboard(write);
  const copied = vi.fn();
  const { rerender } = render(<ClipboardButton text="first" labels={labels} onCopied={copied} />);
  const button = screen.getByRole('button', { name: 'Copy code' });
  fireEvent.click(button);
  rerender(<ClipboardButton text="second" labels={labels} onCopied={copied} />);
  fireEvent.click(button);
  expect(write).toHaveBeenCalledOnce();
  await act(async () => resolve());
  expect(button).toHaveAttribute('data-copy-state', 'idle');
  expect(copied).not.toHaveBeenCalled();
  fireEvent.click(button);
  await act(async () => resolve());
  expect(write).toHaveBeenNthCalledWith(2, 'second');
  expect(copied).toHaveBeenCalledOnce();
  expect(copied).toHaveBeenCalledWith('second');
});

it('honors cancellation and native disabled, cleans pending work on unmount and rejects unsupported clipboard', async () => {
  let resolve!: () => void;
  const write = vi.fn(() => new Promise<void>((done) => { resolve = done; }));
  clipboard(write);
  const copied = vi.fn();
  const { rerender, unmount } = render(
    <ClipboardButton text="code" labels={labels} onClick={(event) => event.preventDefault()} />,
  );
  const button = screen.getByRole('button', { name: 'Copy code' });
  fireEvent.click(button);
  expect(write).not.toHaveBeenCalled();
  rerender(<ClipboardButton text="code" labels={labels} disabled />);
  fireEvent.click(button);
  expect(write).not.toHaveBeenCalled();
  rerender(<ClipboardButton text="code" labels={labels} onCopied={copied} />);
  fireEvent.click(button);
  unmount();
  await act(async () => resolve());
  expect(copied).not.toHaveBeenCalled();
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined });
  await expect(copyText('manual selection')).rejects.toThrow(/unavailable/);
});

it('preserves the consumer aria-label and reports successful repeat actions independently', async () => {
  clipboard(vi.fn(async () => {}));
  const copied = vi.fn();
  render(<ClipboardButton text="code" aria-label="Copy snippet" labels={labels} resetDelay={null} onCopied={copied} />);
  const button = screen.getByRole('button', { name: 'Copy snippet' });
  fireEvent.click(button);
  await settle();
  await act(async () => vi.advanceTimersByTimeAsync(5000));
  expect(button).toHaveAttribute('data-copy-state', 'copied');
  fireEvent.click(button);
  await settle();
  expect(copied).toHaveBeenCalledTimes(2);
  expect(button).toHaveAccessibleName('Copy snippet');
});

it('hydrates the initial button and live region without invoking the clipboard', async () => {
  const write = vi.fn(async () => {});
  clipboard(write);
  const app = <ClipboardButton text="code" labels={labels} />;
  const container = document.createElement('div');
  document.body.append(container);
  container.innerHTML = renderToString(app);
  expect(container.querySelector('[role="status"]')).toBeEmptyDOMElement();
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(container, app, { onRecoverableError: (error) => errors.push(error) }); });
  expect(errors).toEqual([]);
  expect(write).not.toHaveBeenCalled();
  await act(async () => root.unmount());
  container.remove();
});

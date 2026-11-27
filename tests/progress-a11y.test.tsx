import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Progress } from '../src';

it('exposes a labelled determinate progressbar', () => {
  render(<Progress aria-label="Exporting events" value={65} max={100} />);
  const bar = screen.getByRole('progressbar', { name: 'Exporting events' }) as HTMLProgressElement;
  expect(bar.value).toBe(65);
  expect(bar.max).toBe(100);
  expect(bar).toHaveClass('om-progress');
});

it('omits value for an indeterminate progressbar', () => {
  render(<Progress aria-label="Preparing export" />);
  const bar = screen.getByRole('progressbar', { name: 'Preparing export' });
  expect(bar).not.toHaveAttribute('value');
});

it('forwards the ref and the remaining attributes', () => {
  const ref = { current: null as HTMLProgressElement | null };
  render(<Progress ref={ref} data-testid="progress" aria-label="Upload" value={10} max={20} />);
  expect(ref.current).toBe(screen.getByTestId('progress'));
  expect(ref.current).toHaveAttribute('max', '20');
});

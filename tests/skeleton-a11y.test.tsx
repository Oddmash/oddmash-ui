import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Skeleton } from '../src';

it('hides a decorative skeleton from assistive technology by default', () => {
  const { container } = render(<Skeleton />);
  expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  expect(container.firstElementChild).toHaveClass('om-skeleton');
});

it('keeps the aria-hidden contract when callers pass attributes', () => {
  render(<Skeleton data-testid="placeholder" aria-hidden={false} className="tall" />);
  const placeholder = screen.getByTestId('placeholder');
  expect(placeholder).toHaveAttribute('aria-hidden', 'true');
  expect(placeholder).toHaveClass('om-skeleton', 'tall');
});

it('forwards a ref to the span', () => {
  const ref = { current: null as HTMLSpanElement | null };
  render(<Skeleton ref={ref} />);
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});

import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Spinner } from '../src';

it('exposes a labelled spinner as a status with that name', () => {
  render(<Spinner label="Loading events" />);
  const status = screen.getByRole('status');
  expect(status).toHaveClass('om-spinner');
  expect(status).toHaveTextContent('Loading events');
  expect(status).not.toHaveAttribute('aria-hidden');
});

it('keeps an unlabelled spinner out of the accessibility tree', () => {
  const { container } = render(<Spinner />);
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
});

it('updates the status text when the label changes', () => {
  const { rerender } = render(<Spinner label="Loading events" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading events');
  rerender(<Spinner label="Loading saved events" />);
  expect(screen.getByRole('status')).toHaveTextContent('Loading saved events');
});

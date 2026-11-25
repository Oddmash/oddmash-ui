import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { Pagination } from '../src';

function Demo() {
  const [page, setPage] = useState(1);
  return (
    <Pagination>
      <button type="button" aria-current={page === 1 ? 'page' : undefined} onClick={() => setPage(1)}>
        Page 1
      </button>
      <button type="button" aria-current={page === 2 ? 'page' : undefined} onClick={() => setPage(2)}>
        Page 2
      </button>
    </Pagination>
  );
}

it('is a named navigation landmark with a default and a custom name', () => {
  render(<Pagination />);
  expect(screen.getByRole('navigation', { name: 'Pagination' })).toHaveClass('om-pagination');
  render(<Pagination aria-label="Search results pages" />);
  expect(screen.getByRole('navigation', { name: 'Search results pages' })).toBeInTheDocument();
});

it('reaches the page controls by keyboard and updates aria-current', async () => {
  const user = userEvent.setup();
  render(<Demo />);
  const first = screen.getByRole('button', { name: 'Page 1' });
  expect(first).toHaveAttribute('aria-current', 'page');
  await user.tab();
  expect(first).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Page 2' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  expect(first).not.toHaveAttribute('aria-current');
});

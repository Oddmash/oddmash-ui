import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { Avatar } from '../src';

it('hides an unlabeled decorative avatar from the accessibility tree', () => {
  render(<Avatar src="/portrait.png">PO</Avatar>);

  const avatar = screen.getByText('PO');
  expect(avatar).toHaveAttribute('aria-hidden', 'true');
  expect(avatar).not.toHaveAttribute('role');
  expect(avatar).not.toHaveAttribute('aria-label');
  const image = avatar.querySelector('img')!;
  fireEvent.load(image);
  expect(image).toBeVisible();
  expect(image).toHaveAttribute('alt', '');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

it('exposes the supplied accessible name even when an image fails to load', () => {
  render(<Avatar src="/missing.png" label="Project owner">PO</Avatar>);

  const avatar = screen.getByRole('img', { name: 'Project owner' });
  expect(avatar).not.toHaveAttribute('aria-hidden');
  expect(avatar).toHaveTextContent('PO');
  fireEvent.error(avatar.querySelector('img')!);
  expect(avatar).toHaveAccessibleName('Project owner');
  expect(avatar.querySelector('img')).not.toBeVisible();
});

it('forwards the native span ref, class and attributes', () => {
  const ref = createRef<HTMLSpanElement>();
  render(<Avatar ref={ref} label="Contributor" className="custom-avatar" id="avatar" title="Contributor details">C</Avatar>);

  const avatar = screen.getByRole('img', { name: 'Contributor' });
  expect(ref.current).toBe(avatar);
  expect(avatar.tagName).toBe('SPAN');
  expect(avatar).toHaveClass('om-avatar', 'custom-avatar');
  expect(avatar).toHaveAttribute('id', 'avatar');
  expect(avatar).toHaveAttribute('title', 'Contributor details');
});

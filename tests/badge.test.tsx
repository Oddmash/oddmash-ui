import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it } from 'vitest';
import { Badge } from '../src/badge';

it('preserves span props and refs without adding announcement semantics', () => {
  const ref = createRef<HTMLSpanElement>();
  render(<Badge ref={ref} tone="active" className="custom" aria-label="Build is running">Running</Badge>);
  const badge = screen.getByText('Running');
  expect(badge).toBe(ref.current);
  expect(badge.tagName).toBe('SPAN');
  expect(badge).toHaveClass('om-badge', 'om-badge--active', 'custom');
  expect(badge).toHaveAttribute('aria-label', 'Build is running');
  expect(badge).not.toHaveAttribute('role');
  expect(badge).not.toHaveAttribute('aria-live');
});

it('renders existing and semantic variants with visible consumer-owned text', () => {
  const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'error', 'info', 'active'] as const;
  render(<>{tones.map(tone => <Badge key={tone} tone={tone}>{tone}</Badge>)}<Badge>Unknown</Badge></>);
  for (const tone of tones) expect(screen.getByText(tone)).toHaveClass(`om-badge--${tone}`);
  expect(screen.getByText('Unknown')).toHaveClass('om-badge--neutral');
  expect(renderToString(<Badge tone="success">Succeeded</Badge>)).toContain('om-badge--success');
});

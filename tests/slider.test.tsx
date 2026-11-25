import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { Slider } from '../src/slider';

const filled = (input: HTMLInputElement) => input.style.getPropertyValue('--om-slider-progress');

it('preserves native props and reports an uncontrolled value using the actual normalized range value', () => {
  const onInput = vi.fn();
  const onChange = vi.fn();
  const ref = createRef<HTMLInputElement>();
  render(<Slider ref={ref} aria-label="Width" min={100} max={600} step={10} defaultValue={320} className="consumer" style={{ color: 'red' }} onInput={onInput} onChange={onChange} />);
  const input = screen.getByRole<HTMLInputElement>('slider', { name: 'Width' });
  expect(input).toBe(ref.current);
  expect(input).toHaveClass('consumer');
  expect(input.style.color).toBe('red');
  expect(filled(input)).toBe('44%');
  fireEvent.input(input, { target: { value: '400' } });
  expect(onInput).toHaveBeenCalledOnce();
  expect(filled(input)).toBe('60%');
});

it('uses controlled values and updated limits for the visual fill', () => {
  const onChange = vi.fn();
  const { rerender } = render(<Slider aria-label="Width" min={0} max={100} value={25} onChange={onChange} />);
  const input = screen.getByRole<HTMLInputElement>('slider', { name: 'Width' });
  expect(filled(input)).toBe('25%');
  rerender(<Slider aria-label="Width" min={0} max={200} value={150} onChange={onChange} />);
  expect(input).toHaveValue('150');
  expect(filled(input)).toBe('75%');
  rerender(<Slider aria-label="Width" min={0} max={200} value={150} disabled onChange={onChange} />);
  expect(input).toBeDisabled();
});

it('renders deterministic initial progress without the DOM', () => {
  expect(renderToString(<Slider min={0} max={100} defaultValue={25} />)).toContain('--om-slider-progress:25%');
});

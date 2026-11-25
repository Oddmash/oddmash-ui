import { forwardRef, useEffect, useImperativeHandle, useRef, type ComponentPropsWithoutRef, type CSSProperties } from 'react';
import { cx } from './cx';

export type SliderProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;

const finiteNumber = (value: unknown, fallback: number) => {
  const number = typeof value === 'number' || (typeof value === 'string' && value.trim()) ? Number(value) : NaN;
  return Number.isFinite(number) ? number : fallback;
};
const progress = (value: unknown, min: unknown, max: unknown) => {
  const lower = finiteNumber(min, 0);
  const upper = finiteNumber(max, 100);
  const current = finiteNumber(value, lower + (upper - lower) / 2);
  return `${upper > lower ? Math.min(100, Math.max(0, (current - lower) / (upper - lower) * 100)) : 0}%`;
};
const syncProgress = (input: HTMLInputElement) => {
  input.style.setProperty('--om-slider-progress', progress(input.valueAsNumber, input.min, input.max));
};

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ className, onInput, style, ...props }, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => inputRef.current!, []);

  useEffect(() => {
    if (inputRef.current) syncProgress(inputRef.current);
  });

  useEffect(() => {
    const input = inputRef.current;
    const form = input?.form;
    if (!input || !form) return;
    const reset = () => queueMicrotask(() => { if (inputRef.current === input) syncProgress(input); });
    form.addEventListener('reset', reset);
    return () => form.removeEventListener('reset', reset);
  }, [props.form]);

  return (
    <input
      {...props}
      ref={inputRef}
      type="range"
      className={cx('om-slider', className)}
      style={{ '--om-slider-progress': progress(props.value ?? props.defaultValue, props.min, props.max), ...style } as CSSProperties}
      onInput={event => {
        if (props.value == null) syncProgress(event.currentTarget);
        onInput?.(event);
      }}
    />
  );
});
Slider.displayName = 'Slider';

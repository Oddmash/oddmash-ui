import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type SliderProps = Omit<ComponentPropsWithoutRef<'input'>, 'type'>;
export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => (
  <input {...props} ref={ref} type="range" className={cx('om-slider', className)} />
));
Slider.displayName = 'Slider';

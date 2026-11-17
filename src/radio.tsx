import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type RadioProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'role' | 'aria-checked'
>;

export const Radio = /* @__PURE__ */ forwardRef<HTMLInputElement, RadioProps>(
  ({ className, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      type="radio"
      className={cx('om-radio', className)}
    />
  ),
);
Radio.displayName = 'Radio';

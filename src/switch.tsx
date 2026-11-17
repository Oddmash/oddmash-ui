import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type SwitchProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'role' | 'aria-checked'
>;

export const Switch = /* @__PURE__ */ forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <input
      {...props}
      ref={ref}
      type="checkbox"
      role="switch"
      className={cx('om-switch', className)}
    />
  ),
);
Switch.displayName = 'Switch';

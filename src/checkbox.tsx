import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type CheckboxProps = Omit<
  ComponentPropsWithoutRef<'input'>,
  'type' | 'role' | 'aria-checked'
>;

export const Checkbox = /* @__PURE__ */ forwardRef<
  HTMLInputElement,
  CheckboxProps
>(({ className, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    type="checkbox"
    className={cx('om-checkbox', className)}
  />
));
Checkbox.displayName = 'Checkbox';

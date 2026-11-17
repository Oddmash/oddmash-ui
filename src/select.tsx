import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type SelectProps = ComponentPropsWithoutRef<'select'>;

export const Select = /* @__PURE__ */ forwardRef<
  HTMLSelectElement,
  SelectProps
>(({ className, ...props }, ref) => (
  <select {...props} ref={ref} className={cx('om-select', className)} />
));
Select.displayName = 'Select';

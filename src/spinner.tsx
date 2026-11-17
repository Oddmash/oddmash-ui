import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type SpinnerProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children'
> & { label?: string };

export const Spinner = /* @__PURE__ */ forwardRef<
  HTMLSpanElement,
  SpinnerProps
>(({ className, label, ...props }, ref) => (
  <span
    role={label ? 'status' : undefined}
    aria-hidden={label ? undefined : true}
    {...props}
    ref={ref}
    className={cx('om-spinner', className)}
  >
    {label && <span className="om-spinner-label">{label}</span>}
  </span>
));
Spinner.displayName = 'Spinner';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type ProgressProps = ComponentPropsWithoutRef<'progress'>;

export const Progress = /* @__PURE__ */ forwardRef<
  HTMLProgressElement,
  ProgressProps
>(({ className, ...props }, ref) => (
  <progress {...props} ref={ref} className={cx('om-progress', className)} />
));
Progress.displayName = 'Progress';

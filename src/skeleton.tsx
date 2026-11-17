import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type SkeletonProps = ComponentPropsWithoutRef<'span'>;

export const Skeleton = /* @__PURE__ */ forwardRef<
  HTMLSpanElement,
  SkeletonProps
>(({ className, ...props }, ref) => (
  <span
    {...props}
    ref={ref}
    aria-hidden="true"
    className={cx('om-skeleton', className)}
  />
));
Skeleton.displayName = 'Skeleton';

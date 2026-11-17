import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type EmptyStateProps = ComponentPropsWithoutRef<'div'>;

export const EmptyState = /* @__PURE__ */ forwardRef<
  HTMLDivElement,
  EmptyStateProps
>(({ className, ...props }, ref) => (
  <div {...props} ref={ref} className={cx('om-empty-state', className)} />
));
EmptyState.displayName = 'EmptyState';

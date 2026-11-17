import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type PaginationProps = ComponentPropsWithoutRef<'nav'>;

export const Pagination = /* @__PURE__ */ forwardRef<
  HTMLElement,
  PaginationProps
>(({ className, ...props }, ref) => (
  <nav
    aria-label="Pagination"
    {...props}
    ref={ref}
    className={cx('om-pagination', className)}
  />
));
Pagination.displayName = 'Pagination';

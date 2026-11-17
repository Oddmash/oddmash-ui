import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type BreadcrumbsProps = ComponentPropsWithoutRef<'nav'>;

export const Breadcrumbs = /* @__PURE__ */ forwardRef<
  HTMLElement,
  BreadcrumbsProps
>(({ className, children, ...props }, ref) => (
  <nav
    aria-label="Breadcrumb"
    {...props}
    ref={ref}
    className={cx('om-breadcrumbs', className)}
  >
    <ol role="list">{children}</ol>
  </nav>
));
Breadcrumbs.displayName = 'Breadcrumbs';

import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type SiteHeaderProps = ComponentPropsWithoutRef<'header'>;
export const SiteHeader = /* @__PURE__ */ forwardRef<HTMLElement, SiteHeaderProps>(
  ({ className, ...props }, ref) => (
    <header {...props} ref={ref} className={cx('om-site-header', className)} />
  ),
);
SiteHeader.displayName = 'SiteHeader';

export type SiteHeaderInnerProps = ComponentPropsWithoutRef<'div'>;
export const SiteHeaderInner = /* @__PURE__ */ forwardRef<HTMLDivElement, SiteHeaderInnerProps>(
  ({ className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('om-site-header-inner', className)} />
  ),
);
SiteHeaderInner.displayName = 'SiteHeaderInner';

export type SiteFooterProps = ComponentPropsWithoutRef<'footer'>;
export const SiteFooter = /* @__PURE__ */ forwardRef<HTMLElement, SiteFooterProps>(
  ({ className, ...props }, ref) => (
    <footer {...props} ref={ref} className={cx('om-site-footer', className)} />
  ),
);
SiteFooter.displayName = 'SiteFooter';

export type SiteFooterInnerProps = ComponentPropsWithoutRef<'div'>;
export const SiteFooterInner = /* @__PURE__ */ forwardRef<HTMLDivElement, SiteFooterInnerProps>(
  ({ className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('om-site-footer-inner', className)} />
  ),
);
SiteFooterInner.displayName = 'SiteFooterInner';

export type SiteNavProps = ComponentPropsWithoutRef<'nav'>;
export const SiteNav = /* @__PURE__ */ forwardRef<HTMLElement, SiteNavProps>(
  ({ className, ...props }, ref) => (
    <nav {...props} ref={ref} className={cx('om-site-nav', className)} />
  ),
);
SiteNav.displayName = 'SiteNav';

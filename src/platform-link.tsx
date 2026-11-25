import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import type { IconControlName } from './button';
import { cx } from './cx';

export type PlatformLinkKind = 'github' | 'npm';
export type PlatformLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'aria-label' | 'aria-labelledby'> & IconControlName & {
  platform: PlatformLinkKind;
  href: string;
};

export const PlatformLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, PlatformLinkProps>(({ className, platform, ...props }, ref) => (
  <a {...props} ref={ref} className={cx('om-platform-link', className)} data-platform={platform}>
    {platform === 'github' ? (
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor">
        <path d="M12 1.3a10.7 10.7 0 0 0-3.38 20.85c.54.1.73-.23.73-.52V19.6c-2.98.65-3.61-1.27-3.61-1.27-.49-1.23-1.19-1.56-1.19-1.56-.97-.67.08-.66.08-.66 1.08.08 1.65 1.11 1.65 1.11.95 1.64 2.49 1.16 3.1.89.1-.69.37-1.16.67-1.43-2.38-.27-4.88-1.19-4.88-5.29 0-1.17.42-2.13 1.1-2.88-.11-.27-.48-1.36.11-2.84 0 0 .9-.29 2.94 1.1a10.2 10.2 0 0 1 5.36 0c2.04-1.39 2.93-1.1 2.93-1.1.59 1.48.22 2.57.11 2.84.68.75 1.1 1.71 1.1 2.88 0 4.11-2.51 5.01-4.9 5.28.39.34.73 1 .73 2.01v2.95c0 .29.19.63.74.52A10.7 10.7 0 0 0 12 1.3Z" />
      </svg>
    ) : (
      <svg viewBox="0 0 32 12" width="32" height="12" aria-hidden="true" focusable="false" fill="currentColor">
        <path fillRule="evenodd" d="M0 0H32V12H0ZM2 2V10H4V4H6V10H8V2ZM10 2V10H12V8H18V2ZM12 4H16V6H12ZM20 2V10H22V4H24V10H26V4H28V10H30V2Z" />
      </svg>
    )}
  </a>
));
PlatformLink.displayName = 'PlatformLink';

export type PlatformLinksProps = ComponentPropsWithoutRef<'div'>;
export const PlatformLinks = /* @__PURE__ */ forwardRef<HTMLDivElement, PlatformLinksProps>(({ className, ...props }, ref) => (
  <div {...props} ref={ref} className={cx('om-platform-links', className)} />
));
PlatformLinks.displayName = 'PlatformLinks';

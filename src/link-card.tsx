import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type LinkCardProps = ComponentPropsWithoutRef<'a'>;
export const LinkCard = /* @__PURE__ */ forwardRef<HTMLAnchorElement, LinkCardProps>(
  ({ className, ...props }, ref) => (
    <a {...props} ref={ref} className={cx('om-link-card', className)} />
  ),
);
LinkCard.displayName = 'LinkCard';

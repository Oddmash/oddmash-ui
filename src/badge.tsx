import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type BadgeProps = ComponentPropsWithoutRef<'span'> & { tone?: 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'error' | 'info' | 'active' };
export const Badge = /* @__PURE__ */ forwardRef<HTMLSpanElement, BadgeProps>(({ className, tone = 'neutral', ...props }, ref) => <span {...props} ref={ref} className={cx('om-badge', `om-badge--${tone}`, className)} />);
Badge.displayName = 'Badge';

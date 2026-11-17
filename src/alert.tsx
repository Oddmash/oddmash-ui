import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type AlertProps = ComponentPropsWithoutRef<'div'> & {
  tone?: 'neutral' | 'danger';
};

export const Alert = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = 'neutral', ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-tone={tone}
      className={cx('om-alert', className)}
    />
  ),
);
Alert.displayName = 'Alert';

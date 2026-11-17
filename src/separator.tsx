import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type SeparatorProps = ComponentPropsWithoutRef<'hr'>;

export const Separator = /* @__PURE__ */ forwardRef<
  HTMLHRElement,
  SeparatorProps
>(({ className, ...props }, ref) => (
  <hr {...props} ref={ref} className={cx('om-separator', className)} />
));
Separator.displayName = 'Separator';

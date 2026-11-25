import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type KbdProps = ComponentPropsWithoutRef<'kbd'>;
export const Kbd = /* @__PURE__ */ forwardRef<HTMLElement, KbdProps>(({ className, ...props }, ref) => (
  <kbd {...props} ref={ref} className={cx('om-kbd', className)} />
));
Kbd.displayName = 'Kbd';

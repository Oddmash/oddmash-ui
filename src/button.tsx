import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type ButtonProps = ComponentPropsWithoutRef<'button'> & { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' };
export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
  <button {...props} ref={ref} type={type} className={cx('om-button', `om-button--${variant}`, `om-button--${size}`, className)} />
));
Button.displayName = 'Button';

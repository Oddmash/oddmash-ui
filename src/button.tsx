import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

type ButtonAppearance = { variant?: 'primary' | 'secondary' | 'ghost'; size?: 'sm' | 'md' };

export type ButtonProps = ComponentPropsWithoutRef<'button'> & ButtonAppearance;
export const Button = /* @__PURE__ */ forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant = 'primary', size = 'md', type = 'button', ...props }, ref) => (
  <button {...props} ref={ref} type={type} className={cx('om-button', `om-button--${variant}`, `om-button--${size}`, className)} />
));
Button.displayName = 'Button';

export type ButtonLinkProps = ComponentPropsWithoutRef<'a'> & ButtonAppearance & { href: string };
export const ButtonLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, ButtonLinkProps>(({ className, variant = 'primary', size = 'md', ...props }, ref) => (
  <a {...props} ref={ref} className={cx('om-button', 'om-button--link', `om-button--${variant}`, `om-button--${size}`, className)} />
));
ButtonLink.displayName = 'ButtonLink';

export type IconControlName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-label'?: string; 'aria-labelledby': string };

export type IconButtonProps = Omit<ButtonProps, 'aria-label' | 'aria-labelledby'> & IconControlName;
export const IconButton = /* @__PURE__ */ forwardRef<HTMLButtonElement, IconButtonProps>(({ className, variant = 'ghost', ...props }, ref) => (
  <Button {...props} ref={ref} variant={variant} className={cx('om-button--icon', className)} />
));
IconButton.displayName = 'IconButton';

export type IconLinkProps = Omit<ButtonLinkProps, 'aria-label' | 'aria-labelledby'> & IconControlName;
export const IconLink = /* @__PURE__ */ forwardRef<HTMLAnchorElement, IconLinkProps>(({ className, variant = 'ghost', ...props }, ref) => (
  <ButtonLink {...props} ref={ref} variant={variant} className={cx('om-button--icon', className)} />
));
IconLink.displayName = 'IconLink';

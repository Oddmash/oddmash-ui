import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type InputProps = ComponentPropsWithoutRef<'input'>;
export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => <input {...props} ref={ref} className={cx('om-input', className)} />);
Input.displayName = 'Input';

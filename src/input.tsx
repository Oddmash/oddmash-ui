import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from './cx';

export type InputProps = ComponentPropsWithoutRef<'input'> & {
  leadingIcon?: ReactNode;
};

export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(
  ({ className, leadingIcon, ...props }, ref) => {
    const input = <input {...props} ref={ref} className={cx('om-input', className)} />;
    if (leadingIcon == null || leadingIcon === false) return input;

    return (
      <span className="om-input-with-icon">
        <span className="om-input-leading-icon" aria-hidden="true">{leadingIcon}</span>
        {input}
      </span>
    );
  },
);
Input.displayName = 'Input';

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { cx } from './cx';

export type InputProps = ComponentPropsWithoutRef<'input'> & {
  leadingIcon?: ReactNode;
};

export const Input = /* @__PURE__ */ forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { className, leadingIcon, ...nativeProps } = props;
    const input = <input {...nativeProps} ref={ref} className={cx('om-input', className)} />;
    if (!Object.hasOwn(props, 'leadingIcon')) return input;

    return (
      <span className="om-input-with-icon">
        {leadingIcon != null && leadingIcon !== false && (
          <span className="om-input-leading-icon" aria-hidden="true" ref={element => { element?.setAttribute('inert', ''); }}>
            {leadingIcon}
          </span>
        )}
        {input}
      </span>
    );
  },
);
Input.displayName = 'Input';

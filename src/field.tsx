import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cx } from './cx';

export type FieldProps = ComponentPropsWithoutRef<'fieldset'> & {
  legend: ReactNode;
};

export const Field = /* @__PURE__ */ forwardRef<
  HTMLFieldSetElement,
  FieldProps
>(({ className, legend, children, ...props }, ref) => (
  <fieldset {...props} ref={ref} className={cx('om-field', className)}>
    <legend>{legend}</legend>
    {children}
  </fieldset>
));
Field.displayName = 'Field';

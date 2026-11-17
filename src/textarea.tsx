import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type TextareaProps = ComponentPropsWithoutRef<'textarea'>;

export const Textarea = /* @__PURE__ */ forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ className, ...props }, ref) => (
  <textarea {...props} ref={ref} className={cx('om-textarea', className)} />
));
Textarea.displayName = 'Textarea';

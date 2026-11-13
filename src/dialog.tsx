import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';
import * as DialogPrimitive from '@radix-ui/react-dialog';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export type DialogContentProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  container?: ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>['container'];
  theme?: 'light' | 'dark';
};
export const DialogContent = /* @__PURE__ */ forwardRef<HTMLDivElement, DialogContentProps>(({ className, children, container, theme, ...props }, ref) => (
  <DialogPrimitive.Portal container={container}>
    <DialogPrimitive.Overlay className="om-dialog-overlay" data-om-theme={theme} />
    <DialogPrimitive.Content {...props} ref={ref} data-om-theme={theme} className={cx('om-dialog-content', className)}>{children}</DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = 'DialogContent';

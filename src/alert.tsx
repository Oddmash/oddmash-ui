import { forwardRef, useRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';
import { Button } from './button';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from './dialog';
import type { DialogContentProps } from './dialog';
import type { ReactNode } from 'react';

export type AlertProps = ComponentPropsWithoutRef<'div'> & {
  tone?: 'neutral' | 'danger';
};

export const Alert = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone = 'neutral', ...props }, ref) => (
    <div
      {...props}
      ref={ref}
      data-tone={tone}
      className={cx('om-alert', className)}
    />
  ),
);
Alert.displayName = 'Alert';

export type AlertDialogProps = Omit<DialogContentProps, 'title' | 'children' | 'role' | 'onEscapeKeyDown' | 'onPointerDownOutside' | 'onInteractOutside'> & {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm: () => void;
};

export const AlertDialog = /* @__PURE__ */ forwardRef<HTMLDivElement, AlertDialogProps>(
  ({ open, title, children, confirmLabel = 'OK', onConfirm, className, onOpenAutoFocus, onCloseAutoFocus, ...props }, ref) => {
    const previousFocus = useRef<HTMLElement | null>(null);
    return (
    <Dialog open={open}>
      <DialogContent
        {...props}
        ref={ref}
        role="alertdialog"
        className={cx('om-alert-dialog', className)}
        onOpenAutoFocus={(event) => {
          previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          onOpenAutoFocus?.(event);
        }}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event);
          if (!event.defaultPrevented && previousFocus.current?.isConnected) {
            event.preventDefault();
            previousFocus.current.focus();
          }
        }}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{children}</DialogDescription>
        <div className="om-alert-dialog-actions">
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
    );
  },
);
AlertDialog.displayName = 'AlertDialog';

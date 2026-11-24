import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export const ToastViewport = /* @__PURE__ */ forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('om-toast-viewport', className)} />
  ),
);
ToastViewport.displayName = 'ToastViewport';

export type ToastProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  open: boolean;
  title: string;
  onDismiss: () => void;
  dismissLabel?: string;
  tone?: 'neutral' | 'danger';
};

export const Toast = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      open,
      title,
      onDismiss,
      dismissLabel = 'Dismiss notification',
      tone = 'neutral',
      children,
      className,
      ...props
    },
    ref,
  ) => (
    <div {...props} ref={ref} className={cx('om-toast-region', className)}>
      <div
        className={open ? 'om-toast' : undefined}
        data-tone={open ? tone : undefined}
      >
        {open && <span className="om-toast-icon" aria-hidden="true">{tone === 'danger' ? '!' : '✓'}</span>}
        <div role={tone === 'danger' ? 'alert' : 'status'} aria-atomic="true">
          {open && (
            <>
              <strong>{title}</strong>
              {children && <div>{children}</div>}
            </>
          )}
        </div>
        {open && (
          <button type="button" onClick={onDismiss} aria-label={dismissLabel}>
            ×
          </button>
        )}
      </div>
    </div>
  ),
);
Toast.displayName = 'Toast';

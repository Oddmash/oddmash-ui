import { useId, useRef, useState, type ReactNode } from 'react';
import { AlertDialog, Breadcrumbs, Button, Pagination, Toast, ToastViewport } from '@oddmash/ui';
import { useLocale } from './locale';

export const AlertPreview = () => {
  const { t } = useLocale();
  const trigger = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button
        variant="secondary"
        ref={trigger}
        onClick={() => setVisible(true)}
      >
        {t('Show alert')}
      </Button>
      <AlertDialog open={visible} title={t('Recording stopped')}
        confirmLabel={t('OK')} onConfirm={() => setVisible(false)}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          trigger.current?.focus();
        }}>
        {t('Reconnect the inspector to continue capturing events.')}
      </AlertDialog>
    </>
  );
};

export const ToastPreview = () => {
  const { t } = useLocale();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState([false, false, false]);
  return (
    <>
      <Button ref={trigger} variant="secondary" disabled={open.every(Boolean)} onClick={() => setOpen((current) => {
        const index = current.indexOf(false);
        return current.map((value, position) => position === index || value);
      })}>
        {t('Show toast')}
      </Button>
      <ToastViewport>
        {open.map((visible, index) => (
          <Toast key={index} title={t('Project saved')} open={visible}
            dismissLabel={t('Dismiss notification')}
            onDismiss={() => {
              setOpen((current) => current.map((value, position) => position === index ? false : value));
              requestAnimationFrame(() => trigger.current?.focus());
            }}>
            {t('Your changes are ready.')}
          </Toast>
        ))}
      </ToastViewport>
    </>
  );
};

export const BreadcrumbPreview = () => {
  const { t } = useLocale();
  const [selected, setSelected] = useState('Colors');
  return (
    <Breadcrumbs aria-label={t('Example breadcrumb')}>
      {['Overview', 'Foundations', 'Colors'].map((page) => (
        <li key={page}>
          <button
            type="button"
            aria-current={page === selected ? 'page' : undefined}
            onClick={(event) => {
              setSelected(page);
              event.currentTarget.focus();
            }}
          >
            {t(page)}
          </button>
        </li>
      ))}
    </Breadcrumbs>
  );
};

export const LoadingPreview = ({ children }: { children: ReactNode }) => {
  const { t } = useLocale();
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        aria-expanded={visible}
        aria-controls={id}
        onClick={() => setVisible(!visible)}
      >
        {t(visible ? 'Reset demo' : 'Show loading state')}
      </Button>
      <div id={id} hidden={!visible}>
        {visible && children}
      </div>
    </>
  );
};


export const PaginationPreview = () => {
  const { t } = useLocale();
  const [currentPage, setCurrentPage] = useState(2);
  return (
    <Pagination aria-label={t('Example pagination')}>
      {[1, 2, 3].map((page) => (
        <button
          key={page}
          type="button"
          aria-label={t(`Page ${page}`)}
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => setCurrentPage(page)}
        >
          {page}
        </button>
      ))}
    </Pagination>
  );
};

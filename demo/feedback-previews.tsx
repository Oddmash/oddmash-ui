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
  const viewport = useRef<HTMLDivElement>(null);
  const [notices, setNotices] = useState([0, 1, 2].map(id => ({ id, open: false })));
  const show = () => setNotices(current => {
    const next = current.find(notice => !notice.open);
    return next ? [...current.filter(notice => notice.id !== next.id), { ...next, open: true }] : current;
  });
  const dismiss = (id: number) => {
    const visible = notices.filter(notice => notice.open);
    const index = visible.findIndex(notice => notice.id === id);
    const next = visible[index + 1] ?? visible[index - 1];
    setNotices(current => current.map(notice => notice.id === id ? { ...notice, open: false } : notice));
    requestAnimationFrame(() => {
      const button = next && viewport.current?.querySelector<HTMLButtonElement>(`[data-toast-id="${next.id}"][data-state="open"] button`);
      (button || trigger.current)?.focus();
    });
  };
  return (
    <>
      <Button ref={trigger} variant="secondary" disabled={notices.every(notice => notice.open)} onClick={show}>
        {t('Show toast')}
      </Button>
      <ToastViewport ref={viewport}>
        {notices.map(notice => (
          <Toast key={notice.id} data-toast-id={notice.id} title={t('Project saved')} open={notice.open} tone="success"
            dismissLabel={t('Dismiss notification')} onDismiss={() => dismiss(notice.id)}>
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

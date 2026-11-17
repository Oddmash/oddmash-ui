import { useId, useRef, useState, type ReactNode } from 'react';
import { Alert, Breadcrumbs, Button, Pagination, Toast } from '@oddmash/ui';
import { useLocale } from './locale';

export const AlertPreview = () => {
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
        {t(visible ? 'Hide alert' : 'Show alert')}
      </Button>
      <div id={id} hidden={!visible}>
        {visible && (
          <Alert tone="danger" role="alert">
            <strong>{t('Recording stopped')}</strong>
            <div>
              {t('Reconnect the inspector to continue capturing events.')}
            </div>
          </Alert>
        )}
      </div>
    </>
  );
};

export const ToastPreview = () => {
  const { t } = useLocale();
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button ref={trigger} variant="secondary" onClick={() => setOpen(true)}>
        {t('Show toast')}
      </Button>
      <Toast
        title={t('Project saved')}
        open={open}
        dismissLabel={t('Dismiss notification')}
        onDismiss={() => {
          setOpen(false);
          trigger.current?.focus();
        }}
      >
        {t('Your changes are ready.')}
      </Toast>
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

import { useId, useRef, useState, type ReactNode } from 'react';
import { AlertDialog, Breadcrumbs, Button, Pagination, Select, ToastProvider, useToast } from '@oddmash/ui';
import { useLocale } from './locale';
import previewTokens from './preview-tokens.json';

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

const toastMessages = {
  neutral: { label: 'Notice', title: 'Project updated', description: 'The project has a new update.' },
  loading: { label: 'Loading', title: 'Saving project', description: 'Your changes are being synchronized.' },
  success: { label: 'Success', title: 'Project saved', description: 'Your changes are ready.' },
  info: { label: 'Information', title: 'Export ready', description: 'Your export is available in the project history.' },
  warning: { label: 'Warning', title: 'Connection interrupted', description: 'Your changes are preserved locally. Reconnect before continuing.' },
  error: { label: 'Error', title: 'Save failed', description: 'Your changes could not be synchronized. Check your network connection and retry when you are ready.' },
} as const;

type PreviewTone = keyof typeof toastMessages;

const ToastPreviewControls = () => {
  const { t } = useLocale();
  const trigger = useRef<HTMLButtonElement>(null);
  const { showToast } = useToast();
  const [tone, setTone] = useState<PreviewTone>('success');
  const options = (Object.keys(toastMessages) as PreviewTone[]).map(value => ({ value, label: t(toastMessages[value].label) }));
  const show = () => showToast({
    title: t(toastMessages[tone].title),
    description: t(toastMessages[tone].description),
    tone,
    duration: tone === 'neutral' || tone === 'success' || tone === 'info' ? previewTokens.toastDuration : null,
    restoreFocusTo: trigger.current,
  });
  return (
    <div className="preview-toast-controls">
      <Select aria-label={t('Notification tone')} options={options} value={tone} onValueChange={value => {
        if (Object.hasOwn(toastMessages, value)) setTone(value as PreviewTone);
      }} />
      <Button ref={trigger} variant="secondary" onClick={show}>
        {t('Show toast')}
      </Button>
    </div>
  );
};

export const ToastPreview = () => {
  const { t } = useLocale();
  return (
    <div className="preview-toast">
      <ToastProvider className="preview-toast-viewport" maxVisible={3} dismissLabel={t('Dismiss notification')}>
        <ToastPreviewControls />
      </ToastProvider>
    </div>
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

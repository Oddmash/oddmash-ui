import { Button, ClipboardButton, ToastProvider, useToast } from '@oddmash/ui';

type Translator = { t: (text: string) => string };

export const ClipboardButtonPreview = ({ t }: Translator) => (
  <div>
    <pre tabIndex={0} role="region" aria-label={t('Clipboard example code')}><code>pnpm add @oddmash/ui</code></pre>
    <ClipboardButton
      text="pnpm add @oddmash/ui"
      labels={{
        idle: t('Copy code'),
        pending: t('Copying code'),
        copied: t('Copied'),
        error: t('Select the code to copy'),
      }}
    />
  </div>
);

const ManagedToastControls = ({ t }: Translator) => {
  const { showToast } = useToast();
  return (
    <div className="example-choice">
      <Button
        onClick={() => showToast({ title: t('Project saved'), description: t('Your changes are ready.'), tone: 'success' })}
      >
        {t('Show saved notification')}
      </Button>
      <Button
        variant="secondary"
        onClick={() => showToast({ title: t('Save failed'), description: t('Your changes could not be synchronized. Check your network connection and retry when you are ready.'), tone: 'error' })}
      >
        {t('Show error notification')}
      </Button>
    </div>
  );
};

export const ToastProviderPreview = ({ t }: Translator) => (
  <div className="preview-toast">
    <ToastProvider className="preview-toast-viewport" maxVisible={2} dismissLabel={t('Dismiss notification')} data-testid="managed-toast-viewport">
      <ManagedToastControls t={t} />
    </ToastProvider>
  </div>
);

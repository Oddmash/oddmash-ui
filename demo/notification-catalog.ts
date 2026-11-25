export const notificationComponents = {
  'clipboard-button': {
    title: 'Clipboard Button',
    group: 'Feedback',
    description: 'Copy real text and report the result.',
    usage: 'Pass the exact text and localized labels to ClipboardButton. The copy action runs only from activation and keeps the native button focused. Use announce={false} with an external toast when the same result is announced there.',
    accessibility: 'A pre-existing live region announces completed copies and failures. Preserve keyboard activation, provide a manual selection path, and use a text or icon state that does not rely on color alone.',
    props: [
      ['text', 'string', 'Required'],
      ['labels', 'ClipboardLabels', 'English labels'],
      ['resetDelay', 'number | null', '2500'],
      ['announce', 'boolean', 'true'],
      ['onCopied / onCopyError', 'callback', 'None'],
    ],
    exports: 'ClipboardButton',
    code: `<div>
  <pre tabIndex={0} role="region" aria-label="Clipboard example code"><code>pnpm add @oddmash/ui</code></pre>
  <ClipboardButton
    text="pnpm add @oddmash/ui"
    labels={{ idle: 'Copy code', pending: 'Copying code', copied: 'Copied', error: 'Select the code to copy' }}
  />
</div>`,
  },
  'toast-provider': {
    title: 'Toast Provider',
    group: 'Feedback',
    description: 'Manage independent notifications, expiry and dismissal.',
    usage: 'Mount ToastProvider once for a product surface, then call showToast from useToast after a real result. A full visible stack queues new notifications until space is available.',
    accessibility: 'Show confirmations politely and errors as alerts, without moving focus on arrival. Expiry pauses during hover or focus. Dismissal restores focus to a remaining notification or the original control.',
    props: [
      ['maxVisible', 'number', '4'],
      ['dismissLabel', 'string', 'Dismiss notification'],
      ['showToast(options)', 'ToastNotification → string', 'Required title'],
      ['dismissToast(id)', 'string → void', 'None'],
      ['duration (notification)', 'number | null', '3000; important states persist'],
    ],
    exports: 'Button, ToastProvider, useToast',
    code: `const Controls = () => {
  const { showToast } = useToast();
  return (
    <div>
      <Button onClick={() => showToast({ title: 'Project saved', description: 'Your changes are ready.', tone: 'success' })}>
        Show saved notification
      </Button>
      <Button variant="secondary" onClick={() => showToast({ title: 'Save failed', description: 'Your changes could not be synchronized. Check your network connection and retry when you are ready.', tone: 'error' })}>
        Show error notification
      </Button>
    </div>
  );
};

<ToastProvider maxVisible={2}>
  <Controls />
</ToastProvider>`,
  },
};

import { Dialog, DialogContent, DialogTitle, IconButton } from '@oddmash/ui';
import { useCallback, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from './locale';
import previewTokens from './preview-tokens.json';
import './preview.scss';

type View = 'preview' | 'code';

export const PreviewFrame = ({ children, view, onViewChange }: {
  children: ReactNode;
  view: View;
  onViewChange: (view: View) => void;
}) => {
  const { t } = useLocale();
  const [expanded, setExpanded] = useState(false);
  const [host] = useState(() => document.createElement('div'));
  const expand = useRef<HTMLButtonElement>(null);
  const attachInline = useCallback((element: HTMLDivElement | null) => {
    if (element && !expanded) element.append(host);
  }, [expanded, host]);
  const attachExpanded = useCallback((element: HTMLDivElement | null) => {
    if (element) element.append(host);
  }, [host]);

  return (
    <Dialog open={expanded} onOpenChange={setExpanded}>
      <div className="preview-host-slot" ref={attachInline} />
      <DialogContent
        className="preview-expanded-dialog"
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          requestAnimationFrame(() => expand.current?.focus());
        }}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          requestAnimationFrame(() => expand.current?.focus({ preventScroll: true }));
        }}
        onInteractOutside={(event) => {
          const target = event.target;
          if (target instanceof Node && host.contains(target)) event.preventDefault();
        }}
        onEscapeKeyDown={(event) => {
          const active = document.activeElement;
          if (active instanceof HTMLButtonElement && active.matches('.om-select-dropdown-trigger[aria-expanded="true"]')) {
            event.preventDefault();
            active.click();
          }
        }}
      >
        <DialogTitle className="sr-only">{t('Fullscreen preview')}</DialogTitle>
        <div className="preview-host-slot" ref={attachExpanded} />
      </DialogContent>
      {createPortal(
        <div className="playground" style={{ '--preview-control-layer': previewTokens.controlLayer } as CSSProperties}>
          <div className="playground-toolbar">
            <div className="view-switch">
              <button aria-pressed={view === 'preview'} onClick={() => onViewChange('preview')}>
                {t('Preview')}
              </button>
              <button aria-pressed={view === 'code'} onClick={() => onViewChange('code')}>
                {t('Code')}
              </button>
            </div>
            <IconButton ref={expand} size="sm" aria-label={t(expanded ? 'Exit fullscreen preview' : 'Expand preview')} onClick={() => setExpanded(!expanded)}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={expanded ? 'M4 10h6V4m10 6h-6V4M4 14h6v6m10-6h-6v6' : 'M4 10V4h6m4 0h6v6m0 4v6h-6m-4 0H4v-6'} />
              </svg>
            </IconButton>
          </div>
          {children}
        </div>,
        host,
      )}
    </Dialog>
  );
};

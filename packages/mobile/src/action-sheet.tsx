'use client';

import { useRef } from 'react';
import type { RefObject } from 'react';
import { Overlay } from './overlay.js';
import { useControlled } from './use-controlled.js';
import { useViewport } from './use-viewport.js';

export type ActionSheetAction = {
  id: string;
  label: string;
  destructive?: boolean;
  disabled?: boolean;
};

export type ActionSheetProps = {
  title: string;
  description?: string;
  actions: readonly ActionSheetAction[];
  onSelect: (id: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  cancelLabel?: string;
  returnFocusRef?: RefObject<HTMLElement | null>;
};

export const ActionSheet = ({
  title, description, actions, onSelect, open, defaultOpen = false, onOpenChange,
  cancelLabel = 'Cancel', returnFocusRef,
}: ActionSheetProps) => {
  const [visible, setVisible] = useControlled(open, defaultOpen, onOpenChange);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const viewport = useViewport();

  return (
    <Overlay
      open={visible}
      onDismiss={() => setVisible(false)}
      title={title}
      description={description}
      className="om-action-sheet"
      style={viewport ? { maxHeight: viewport.height, insetBlockEnd: viewport.bottomInset } : undefined}
      showCloseButton={false}
      initialFocusRef={cancelRef}
      returnFocusRef={returnFocusRef}
      fixedFooter={(
        <div className="om-action-sheet-cancel">
          <button ref={cancelRef} type="button" onClick={() => setVisible(false)}>{cancelLabel}</button>
        </div>
      )}
    >
      <div className="om-overlay-content om-action-sheet-content">
        <ul className="om-action-sheet-actions">
          {actions.map(({ id, label, destructive, disabled }) => (
            <li key={id}>
              <button type="button" data-destructive={destructive || undefined} disabled={disabled} onClick={() => {
                setVisible(false);
                onSelect(id);
              }}>{label}</button>
            </li>
          ))}
        </ul>
      </div>
    </Overlay>
  );
};

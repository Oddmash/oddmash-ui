'use client';
import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, ReactNode, RefObject } from 'react';

let locks = 0;
let previousOverflow = '';
const lockScroll = () => {
  if (locks++ === 0) { previousOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden'; }
  return () => { if (--locks === 0) document.body.style.overflow = previousOverflow; };
};

const outsideDialog = (dialog: HTMLDialogElement, x: number, y: number) => {
  const { left, right, top, bottom } = dialog.getBoundingClientRect();
  return x < left || x > right || y < top || y > bottom;
};

export type OverlayProps = {
  open: boolean;
  onDismiss: () => void;
  dismissible?: boolean;
  showCloseButton?: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  fixedFooter?: ReactNode;
  className?: string;
  style?: CSSProperties;
  returnFocusRef?: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
};

export const Overlay = ({open, onDismiss, dismissible = true, showCloseButton = true, title, description, children, fixedFooter, className, style, returnFocusRef, initialFocusRef}: OverlayProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const backdropPress = useRef<number | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const body = <>
    <header className="om-overlay-header"><h2 id={titleId}>{title}</h2>{dismissible && showCloseButton && <button type="button" onClick={onDismiss} aria-label="Close dialog">×</button>}</header>
    {description && <p id={descriptionId} className="om-overlay-description">{description}</p>}
    {children}
  </>;
  const focusTarget = useRef(returnFocusRef);
  useEffect(() => { focusTarget.current = returnFocusRef; }, [returnFocusRef]);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const initialFocus = initialFocusRef?.current;
    const setAutofocus = initialFocus && !initialFocus.hasAttribute('autofocus');
    // The browser chooses its initial focus inside showModal, before a subsequent focus call.
    if (setAutofocus) initialFocus.setAttribute('autofocus', '');
    try {
      dialog.showModal();
    } finally {
      if (setAutofocus) initialFocus.removeAttribute('autofocus');
    }
    initialFocus?.focus({preventScroll: true});
    const unlock = lockScroll();
    return () => {
      if (dialog.open) dialog.close();
      unlock();
      const explicitTrigger = focusTarget.current?.current;
      const target = explicitTrigger?.isConnected ? explicitTrigger : trigger;
      if (target?.isConnected) target.focus({preventScroll: true});
    };
  }, [open, initialFocusRef]);
  return <dialog ref={ref} className={`om-overlay ${className ?? ''}`} style={style} aria-labelledby={titleId} aria-describedby={description ? descriptionId : undefined}
    onCancel={(event) => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      if (dismissible) onDismiss();
    }}
    onSubmit={(event) => {
      const form = event.target;
      if (event.defaultPrevented || !(form instanceof HTMLFormElement) || form.closest('dialog') !== event.currentTarget) return;
      const submitter = event.nativeEvent.submitter;
      const button = submitter instanceof HTMLButtonElement || submitter instanceof HTMLInputElement ? submitter : null;
      const method = button?.hasAttribute('formmethod') ? button.formMethod : form.method;
      if (method !== 'dialog') return;
      event.preventDefault();
      if (button) event.currentTarget.returnValue = button.value;
      onDismiss();
    }}
    onClose={(event) => {
      const dialog = event.currentTarget;
      if (event.target !== dialog || !open || dialog.open || !dialog.isConnected) return;
      // The controlled state remains authoritative if the browser closes the node directly.
      dialog.showModal();
      onDismiss();
    }}
    onPointerDown={(event) => {
      const { currentTarget, target, button, pointerId, clientX, clientY, isPrimary } = event;
      backdropPress.current = isPrimary && button === 0 && target === currentTarget
        && outsideDialog(currentTarget, clientX, clientY) ? pointerId : null;
    }}
    onPointerCancel={(event) => {
      if (backdropPress.current === event.pointerId) backdropPress.current = null;
    }}
    onPointerUp={(event) => {
      if (backdropPress.current !== event.pointerId || event.target !== event.currentTarget
        || !outsideDialog(event.currentTarget, event.clientX, event.clientY)) {
        backdropPress.current = null;
      }
    }}
    onClick={(event) => {
      const startedOnBackdrop = backdropPress.current !== null;
      backdropPress.current = null;
      if (dismissible && startedOnBackdrop && event.target === event.currentTarget
        && outsideDialog(event.currentTarget, event.clientX, event.clientY)) onDismiss();
    }}>
    {open && <div className="om-overlay-inner">
      {fixedFooter ? <><div className="om-overlay-scroll-body">{body}</div>{fixedFooter}</> : body}
    </div>}
  </dialog>;
};

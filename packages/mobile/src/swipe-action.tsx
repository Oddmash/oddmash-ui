'use client';
import type { ReactNode } from 'react';
import { useEffect, useId, useRef } from 'react';
import { useControlled } from './use-controlled.js';
import { useDrag } from './use-drag.js';
import { clamp } from './gesture.js';

export type SwipeActionProps = { children: ReactNode; actions: ReactNode; open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; actionWidth?: number; direction?: 'left' | 'right'; label?: string };

export const SwipeAction = ({children, actions, open, defaultOpen = false, onOpenChange, actionWidth = 112, direction = 'left', label = 'Show actions'}: SwipeActionProps) => {
  const [visible, setVisible] = useControlled(open, defaultOpen, onOpenChange);
  const id = useId();
  const actionsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const panel = actionsRef.current;
    if (!panel) return;
    if (!visible && panel.contains(document.activeElement)) {
      triggerRef.current?.focus();
    }
    panel.inert = !visible;
  }, [visible]);
  const sign = direction === 'left' ? -1 : 1;
  const drag = useDrag({axis: 'x', canStart: (event) => !(event.target instanceof Element && event.target.closest('button,a,input,select,textarea,label,[contenteditable]:not([contenteditable="false"]),[role="button"],[role="link"]')), onCommit: (distance) => {
    if (Math.abs(distance) >= 32) setVisible(distance * sign > 0);
  }});
  const offset = clamp((visible ? actionWidth : 0) + drag.distance * sign, 0, actionWidth) * sign;
  return <div className="om-swipe" onKeyDown={(event) => {if (event.key === 'Escape' && visible) {
    event.preventDefault();
    event.stopPropagation();
    setVisible(false);
    triggerRef.current?.focus();
  }}}>
    <button ref={triggerRef} type="button" aria-expanded={visible} aria-controls={id} onClick={() => setVisible(!visible)}>{visible ? 'Hide actions' : label}</button>
    <div className="om-swipe-track">
      <div ref={actionsRef} id={id} className="om-swipe-actions" aria-hidden={!visible} style={{width: actionWidth, [direction === 'left' ? 'right' : 'left']: 0}}>{actions}</div>
      <div className="om-swipe-content" style={{transform: `translateX(clamp(-100%, ${offset}px, 100%))`, transition: drag.dragging ? 'none' : undefined}} {...drag.handlers}>
        {children}
      </div>
    </div>
  </div>;
};

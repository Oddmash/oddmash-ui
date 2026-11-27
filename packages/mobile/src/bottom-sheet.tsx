'use client';
import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode, RefObject } from 'react';
import { Overlay } from './overlay.js';
import { useControlled } from './use-controlled.js';
import { useDrag } from './use-drag.js';
import { useViewport } from './use-viewport.js';
import { clamp, nearestSnapPoint, normalizeSnapPoints } from './gesture.js';

export type BottomSheetProps = { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; title: string; children: ReactNode; snapPoints?: readonly number[]; snapPoint?: number; defaultSnapPoint?: number; onSnapPointChange?: (point: number) => void; dismissible?: boolean; presentation?: 'sheet' | 'dialog'; returnFocusRef?: RefObject<HTMLElement | null> };

export const BottomSheet = ({open, defaultOpen = false, onOpenChange, title, children, snapPoints = [0.5, 0.9], snapPoint, defaultSnapPoint, onSnapPointChange, dismissible = true, presentation = 'sheet', returnFocusRef}: BottomSheetProps) => {
  const points = normalizeSnapPoints(snapPoints);
  const [visible, setVisible] = useControlled(open, defaultOpen, onOpenChange);
  const [selected, setSelected] = useControlled(snapPoint, defaultSnapPoint ?? points[0]!, onSnapPointChange);
  const current = nearestSnapPoint(points, selected);
  const viewport = useViewport();
  const height = viewport?.height ?? 0;
  const centered = presentation === 'dialog';
  const showHandle = !centered && (points.length > 1 || dismissible);
  const drag = useDrag({ axis: 'y', enabled: visible && showHandle, onCommit: (distance, velocity) => {
    if (!height) return;
    const projected = current - (distance + velocity * 120) / height;
    if (dismissible && projected < points[0]! / 2) { setVisible(false); return; }
    setSelected(nearestSnapPoint(points, projected));
  }});
  const size = height ? `${clamp(current * height - drag.distance, 0, height)}px` : `${current * 100}dvh`;
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const restoreHandleFocus = useRef(false);
  const setHandle = useCallback((node: HTMLButtonElement | null) => {
    if (!node && handleRef.current === document.activeElement) restoreHandleFocus.current = true;
    handleRef.current = node;
  }, []);
  useEffect(() => {
    if (!restoreHandleFocus.current) return;
    restoreHandleFocus.current = false;
    const content = contentRef.current;
    const dialog = content?.closest('dialog');
    if (visible && !showHandle && content && dialog?.open && !dialog.contains(document.activeElement)) {
      const control = content.querySelector<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex="0"]',
      );
      if (control) control.focus({ preventScroll: true });
      if (!dialog.contains(document.activeElement)) {
        content.tabIndex = -1;
        content.focus({ preventScroll: true });
      }
    }
  }, [visible, showHandle]);
  useEffect(() => {
    if (!visible || !centered || !viewport) return;
    const content = contentRef.current;
    const active = document.activeElement;
    const dialog = content?.closest('dialog');
    if (!(active instanceof HTMLElement) || !content?.contains(active) || !dialog?.open) return;
    const frame = dialog.getBoundingClientRect();
    const field = active.getBoundingClientRect();
    if (field.top < frame.top) dialog.scrollTop += field.top - frame.top;
    else if (field.bottom > frame.bottom) dialog.scrollTop += field.bottom - frame.bottom;
  }, [viewport, visible, centered]);
  const viewportHeight = height ? `${height}px` : '100dvh';
  const centeredStyle = viewport ? {
    position: 'fixed' as const,
    insetBlockStart: viewport.offsetTop,
    insetBlockEnd: viewport.bottomInset,
    maxHeight: viewport.height * 0.85,
  } : undefined;
  const index = points.indexOf(current);
  return <Overlay open={visible} onDismiss={() => setVisible(false)} dismissible={dismissible} title={title} returnFocusRef={returnFocusRef}
    className={centered ? 'om-centered' : 'om-sheet'} style={centered ? centeredStyle : {height: size, minHeight: `min(12rem, ${viewportHeight})`, maxHeight: viewportHeight, bottom: viewport?.bottomInset, transition: drag.dragging ? 'none' : undefined}}>
    {showHandle && <div key="handle" className="om-sheet-controls"><button ref={setHandle} type="button" className="om-handle" aria-label={points.length > 1 ? "Resize sheet" : "Dismiss sheet"}
      onClick={(event) => {
        if (event.detail !== 0 && drag.didDrag()) return;
        if (points.length === 1) setVisible(false);
        else setSelected(points[(index + 1) % points.length]!);
      }}
      onKeyDown={(event) => {
      if (points.length === 1 || !['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? points.length - 1 : clamp(index + (event.key === 'ArrowUp' ? 1 : -1), 0, points.length - 1);
      setSelected(points[next]!);
    }} {...drag.handlers}><span /></button></div>}
    <div key="content" ref={contentRef} className="om-overlay-content">{children}</div>
  </Overlay>;
};

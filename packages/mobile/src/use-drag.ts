'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import { getIntent } from './gesture.js';
import type { Axis } from './gesture.js';

type Session = {
  id: number;
  x: number;
  y: number;
  lastDistance: number;
  lastMovementAt: number;
  velocity: number;
  active: boolean;
  target: Element;
  cleanup?: () => void;
};
type Options = { axis: Axis; enabled?: boolean; canStart?: (event: PointerEvent<HTMLElement>) => boolean; onCommit: (distance: number, velocity: number) => void };

// Nested drag surfaces share the event, so the closest eligible surface owns it.
const claimedPointerDowns = new WeakSet<Event>();
const releaseWindow = 48;
const idleAfter = 80;

const recordMovement = (session: Session, distance: number, now: number) => {
  if (distance === session.lastDistance) return;
  const elapsed = Math.min(releaseWindow, Math.max(1, now - session.lastMovementAt));
  session.velocity = Math.min(3, Math.max(-3, (distance - session.lastDistance) / elapsed));
  session.lastDistance = distance;
  session.lastMovementAt = now;
};

export const useDrag = ({ axis, enabled = true, canStart, onCommit }: Options) => {
  const session = useRef<Session | null>(null);
  const dragged = useRef(false);
  const [distance, setDistance] = useState(0);
  const [dragging, setDragging] = useState(false);
  const reset = useCallback(() => {
    session.current?.cleanup?.();
    session.current = null;
    setDistance(0);
    setDragging(false);
  }, []);
  const cancel = useCallback(({ id, target }: Session) => {
    reset();
    if (target.hasPointerCapture(id)) target.releasePointerCapture(id);
  }, [reset]);
  useEffect(() => {
    if (enabled) return;
    dragged.current = false;
    if (session.current) cancel(session.current);
  }, [enabled, cancel]);
  useEffect(() => () => session.current?.cleanup?.(), []);
  const delta = (event: PointerEvent<HTMLElement>, current: Session) => axis === 'x' ? event.clientX - current.x : event.clientY - current.y;
  return {
    distance, dragging,
    didDrag: () => dragged.current,
    handlers: {
      onPointerDown: (event: PointerEvent<HTMLElement>) => {
        if (!enabled || !event.isPrimary || event.button !== 0 || session.current || canStart?.(event) === false) return;
        if (claimedPointerDowns.has(event.nativeEvent)) return;
        claimedPointerDowns.add(event.nativeEvent);
        dragged.current = false;
        const target = event.target instanceof Element ? event.target : event.currentTarget;
        target.setPointerCapture(event.pointerId);
        const next: Session = {
          id: event.pointerId, x: event.clientX, y: event.clientY,
          lastDistance: 0, lastMovementAt: event.timeStamp, velocity: 0, active: false, target,
        };
        session.current = next;
        if (event.pointerType === 'touch') {
          const onSecondTouch = (second: globalThis.PointerEvent) => {
            if (second.pointerType !== 'touch' || second.pointerId === next.id) return;
            dragged.current = true;
            cancel(next);
          };
          const document = target.ownerDocument;
          document.addEventListener('pointerdown', onSecondTouch, { capture: true, passive: true });
          next.cleanup = () => document.removeEventListener('pointerdown', onSecondTouch, true);
        }
      },
      onPointerMove: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (!current || current.id !== event.pointerId) return;
        const primary = delta(event, current);
        const cross = axis === 'x' ? event.clientY - current.y : event.clientX - current.x;
        if (!current.active) {
          const intent = getIntent(primary, cross);
          if (intent === 'pending') {
            recordMovement(current, primary, event.timeStamp);
            return;
          }
          dragged.current = true;
          if (intent === 'cross') {
            cancel(current);
            return;
          }
          current.active = true;
          setDragging(true);
        }
        recordMovement(current, primary, event.timeStamp);
        setDistance(primary);
      },
      onPointerUp: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (!current || current.id !== event.pointerId) return;
        const movement = delta(event, current);
        reset();
        if (!enabled || !current.active) return;
        recordMovement(current, movement, event.timeStamp);
        const velocity = event.timeStamp - current.lastMovementAt <= idleAfter ? current.velocity : 0;
        onCommit(movement, velocity);
      },
      onPointerCancel: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (current?.id === event.pointerId) cancel(current);
      },
      onLostPointerCapture: (event: PointerEvent<HTMLElement>) => {
        const current = session.current;
        if (current?.id === event.pointerId && !current.target.hasPointerCapture(current.id)) reset();
      }
    }
  };
};

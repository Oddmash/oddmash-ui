'use client';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useDrag } from './use-drag.js';

export type PullToRefreshProps = { children: ReactNode; onRefresh: () => Promise<void> | void; disabled?: boolean; threshold?: number; label?: string };

export const PullToRefresh = ({children, onRefresh, disabled = false, threshold = 64, label = 'Refresh'}: PullToRefreshProps) => {
  const [state, setState] = useState<'idle' | 'refreshing' | 'success' | 'error'>('idle');
  const busy = useRef(false);
  const mounted = useRef(false);
  useEffect(() => {mounted.current = true; return () => {mounted.current = false;};}, []);
  const refresh = async () => {
    if (disabled || busy.current) return;
    busy.current = true; setState('refreshing');
    try {await onRefresh(); if (mounted.current) setState('success');}
    catch {if (mounted.current) setState('error');}
    finally {busy.current = false;}
  };
  const drag = useDrag({
    axis: 'y',
    enabled: !disabled && state !== 'refreshing',
    canStart: () => !busy.current,
    onCommit: (distance) => { if (distance >= threshold) void refresh(); },
  });
  const status = state === 'refreshing' ? 'Refreshing…'
    : drag.distance >= threshold ? 'Release to refresh'
    : state === 'error' ? 'Refresh failed. Try again.'
    : state === 'success' ? 'Refreshed'
    : '';

  return <section className="om-refresh">
    <div className="om-refresh-handle" {...drag.handlers} aria-hidden="true">Pull down to refresh ↓</div>
    <button type="button" disabled={disabled} aria-disabled={state === 'refreshing' || undefined} onClick={() => void refresh()}>{label}</button>
    <div className="om-refresh-status" role="status">{status}</div>
    <div aria-busy={state === 'refreshing'}>{children}</div>
  </section>;
};

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { Toast, ToastViewport, type ToastProps } from './toast';

type Tone = NonNullable<ToastProps['tone']>;

export type ToastNotification = {
  title: string;
  description?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  duration?: number | null;
  dismissLabel?: string;
  restoreFocusTo?: HTMLElement | null;
};

export type ToastController = {
  showToast: (options: ToastNotification) => string;
  dismissToast: (id: string) => void;
};

export type ToastProviderProps = ComponentPropsWithoutRef<'div'> & {
  maxVisible?: number;
  dismissLabel?: string;
};

type Entry = {
  id: string;
  options: ToastNotification;
  duration: number | null;
  phase: 'waiting' | 'queued' | 'open' | 'closing';
  trigger: HTMLElement | null;
};

type Region = { node: HTMLDivElement; trigger: HTMLElement | null };

const ToastContext = /* @__PURE__ */ createContext<ToastController | null>(null);

export const useToast = (): ToastController => {
  const controller = useContext(ToastContext);
  if (!controller) throw new Error('useToast requires a ToastProvider.');
  return controller;
};

const activeElement = (node: HTMLElement | null): HTMLElement | null => {
  const root = node?.getRootNode() as Document | ShadowRoot | undefined;
  const active = root?.activeElement ?? node?.ownerDocument.activeElement ?? null;
  const view = node?.ownerDocument.defaultView;
  return view && active instanceof view.HTMLElement ? active : null;
};

const capacityFor = (maxVisible: number): number =>
  Number.isFinite(maxVisible) ? Math.max(1, Math.floor(maxVisible)) : 4;

const durationFor = ({ tone, duration }: ToastNotification): number | null => {
  if (duration === null) return null;
  if (duration !== undefined && Number.isFinite(duration) && duration > 0) return duration;
  return tone === 'warning' || tone === 'danger' || tone === 'error' || tone === 'loading' ? null : 3000;
};

const admit = (entries: Entry[], capacity: number): Entry[] => {
  let slots = capacity - entries.filter(({ phase }) => phase !== 'waiting').length;
  if (slots <= 0 || !entries.some(({ phase }) => phase === 'waiting')) return entries;
  return entries.map((entry) => {
    if (entry.phase !== 'waiting' || slots <= 0) return entry;
    slots -= 1;
    return { ...entry, phase: 'queued' };
  });
};

type ManagedToastProps = {
  entry: Entry;
  paused: boolean;
  dismissLabel: string;
  register: (id: string, region: Region | null) => void;
  open: (id: string) => void;
  dismiss: (id: string) => void;
  exited: (id: string) => void;
};

const ManagedToast = ({ entry, paused, dismissLabel, register, open, dismiss, exited }: ManagedToastProps) => {
  const root = useRef<HTMLDivElement | null>(null);
  const remaining = useRef(entry.duration);
  const { id, phase, trigger, options } = entry;

  const ref = useCallback((node: HTMLDivElement | null) => {
    root.current = node;
    register(id, node ? { node, trigger } : null);
  }, [id, trigger, register]);

  useEffect(() => {
    if (phase !== 'queued') return;
    const view = root.current?.ownerDocument.defaultView;
    if (!view) return;
    if (typeof view.requestAnimationFrame !== 'function') {
      const timeout = view.setTimeout(() => open(id), 0);
      return () => view.clearTimeout(timeout);
    }
    const frame = view.requestAnimationFrame(() => open(id));
    return () => view.cancelAnimationFrame(frame);
  }, [id, phase, open]);

  useEffect(() => {
    const node = root.current;
    const view = node?.ownerDocument.defaultView;
    const duration = entry.duration;
    if (phase !== 'open' || !node || !view || duration === null || remaining.current === null) return;
    const time = remaining.current;
    const updateProgress = (value: number) => {
      node.style.setProperty('--om-toast-remaining', String(Math.min(1, Math.max(0, value / duration))));
    };
    updateProgress(time);
    if (paused) return;
    const started = Date.now();
    const reduced = typeof view.matchMedia === 'function' ? view.matchMedia('(prefers-reduced-motion: reduce)') : undefined;
    const getRemaining = () => Math.max(0, time - (Date.now() - started));
    let frame: number | undefined;
    let progressTimeout: number | undefined;
    const update = () => {
      const value = getRemaining();
      updateProgress(value);
      if (value > 0) schedule();
    };
    const schedule = () => {
      if (!reduced?.matches && typeof view.requestAnimationFrame === 'function' && typeof view.cancelAnimationFrame === 'function') {
        frame = view.requestAnimationFrame(update);
      } else {
        progressTimeout = view.setTimeout(update, Math.min(1000, getRemaining()));
      }
    };
    schedule();
    const timeout = view.setTimeout(() => {
      remaining.current = 0;
      updateProgress(0);
      dismiss(id);
    }, time);
    return () => {
      view.clearTimeout(timeout);
      if (frame !== undefined) view.cancelAnimationFrame(frame);
      if (progressTimeout !== undefined) view.clearTimeout(progressTimeout);
      remaining.current = getRemaining();
      updateProgress(remaining.current);
    };
  }, [id, phase, paused, dismiss, entry.duration]);

  useEffect(() => {
    if (phase !== 'closing') return;
    const node = root.current;
    const view = node?.ownerDocument.defaultView;
    if (!node || !view) return;
    const finish = () => {
      if (node.dataset.state === 'closed') exited(id);
    };
    if (node.dataset.state === 'closed') {
      finish();
      return;
    }
    if (typeof view.MutationObserver !== 'function') {
      const timeout = view.setTimeout(() => exited(id), 250);
      return () => view.clearTimeout(timeout);
    }
    const observer = new view.MutationObserver(finish);
    observer.observe(node, { attributes: true, attributeFilter: ['data-state'] });
    return () => observer.disconnect();
  }, [id, phase, exited]);

  return (
    <Toast
      ref={ref}
      open={phase === 'open'}
      title={options.title}
      tone={options.tone}
      icon={options.icon}
      progress={entry.duration === null ? undefined : 1}
      dismissLabel={options.dismissLabel ?? dismissLabel}
      onDismiss={() => dismiss(id)}
      data-toast-id={id}
    >
      {options.description}
    </Toast>
  );
};

export const ToastProvider = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProviderProps>(
  (
    {
      children,
      maxVisible = 4,
      dismissLabel = 'Dismiss notification',
      onPointerEnter,
      onPointerLeave,
      onFocusCapture,
      onBlurCapture,
      ...props
    },
    ref,
  ) => {
    const viewport = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => viewport.current!, []);
    const regions = useRef(new Map<string, Region>());
    const nextId = useRef(0);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [hovered, setHovered] = useState(false);
    const [focused, setFocused] = useState(false);
    const capacity = capacityFor(maxVisible);

    useEffect(() => {
      setEntries((previous) => admit(previous, capacity));
    }, [capacity]);

    const register = useCallback((id: string, region: Region | null) => {
      if (region) regions.current.set(id, region);
      else regions.current.delete(id);
    }, []);

    const open = useCallback((id: string) => {
      setEntries((previous) => {
        const target = previous.find((entry) => entry.id === id);
        if (target?.phase !== 'queued') return previous;
        return previous.map((entry) => entry.id === id ? { ...entry, phase: 'open' } : entry);
      });
    }, []);

    const exited = useCallback((id: string) => {
      setEntries((previous) => admit(previous.filter((entry) => entry.id !== id), capacity));
    }, [capacity]);

    const showToast = useCallback((options: ToastNotification) => {
      const id = String(++nextId.current);
      const trigger = options.restoreFocusTo === undefined ? activeElement(viewport.current) : options.restoreFocusTo;
      setEntries((previous) => admit([
        ...previous,
        { id, options, duration: durationFor(options), phase: 'waiting', trigger },
      ], capacity));
      return id;
    }, [capacity]);

    const dismissToast = useCallback((id: string) => {
      const region = regions.current.get(id);
      if (region && region.node.contains(activeElement(region.node))) {
        const remaining = Array.from(regions.current.entries()).reverse().find(
          ([otherId, value]) => otherId !== id && value.node.dataset.state === 'open',
        )?.[1].node.querySelector<HTMLButtonElement>('.om-toast > button');
        const target = remaining ?? region.trigger;
        if (target?.isConnected) target.focus();
      }

      setEntries((previous) => {
        const target = previous.find((entry) => entry.id === id);
        if (!target || target.phase === 'closing') return previous;
        if (target.phase !== 'open') return admit(previous.filter((entry) => entry.id !== id), capacity);
        return previous.map((entry) => entry.id === id ? { ...entry, phase: 'closing' } : entry);
      });
    }, [capacity]);

    const controller = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

    return (
      <ToastContext.Provider value={controller}>
        {children}
        <ToastViewport
          {...props}
          ref={viewport}
          onPointerEnter={(event) => {
            onPointerEnter?.(event);
            if (event.pointerType === 'mouse') setHovered(true);
          }}
          onPointerLeave={(event) => {
            onPointerLeave?.(event);
            setHovered(false);
          }}
          onFocusCapture={(event) => {
            onFocusCapture?.(event);
            setFocused(true);
          }}
          onBlurCapture={(event) => {
            onBlurCapture?.(event);
            setFocused(event.currentTarget.contains(event.relatedTarget));
          }}
        >
          {entries.filter((entry) => entry.phase !== 'waiting').map((entry) => (
            <ManagedToast
              key={entry.id}
              entry={entry}
              paused={hovered || focused}
              dismissLabel={dismissLabel}
              register={register}
              open={open}
              dismiss={dismissToast}
              exited={exited}
            />
          ))}
        </ToastViewport>
      </ToastContext.Provider>
    );
  },
);
ToastProvider.displayName = 'ToastProvider';

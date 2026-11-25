import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from 'react';
import { cx } from './cx';

const EXIT_DURATION = 220;
const STACK_GAP = 8;
const STACK_PEEK = 12;

export const ToastViewport = /* @__PURE__ */ forwardRef<HTMLDivElement, ComponentPropsWithoutRef<'div'>>(
  ({ className, ...props }, ref) => {
    const root = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => root.current!, []);

    useEffect(() => {
      const viewport = root.current;
      if (!viewport || typeof window.matchMedia !== 'function') return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const hover = window.matchMedia('(hover: hover) and (pointer: fine)');
      let pointer = false;
      let focused = false;
      let frame = 0;
      const observed = new Set<Element>();
      const resize = typeof ResizeObserver === 'undefined' ? undefined : new ResizeObserver(() => schedule());

      const layout = () => {
        const regions = Array.from(viewport.children).filter(
          (element): element is HTMLElement => element instanceof HTMLElement && element.classList.contains('om-toast-region'),
        );
        const cards = regions.flatMap(region => {
          const card = region.querySelector<HTMLElement>('.om-toast');
          return card ? [{ region, card }] : [];
        });
        const active = cards.filter(({ region }) => region.dataset.state === 'open');
        for (const element of observed) {
          if (!cards.some(({ card }) => card === element)) {
            resize?.unobserve(element);
            observed.delete(element);
          }
        }
        for (const { card } of cards) {
          if (!observed.has(card)) {
            observed.add(card);
            resize?.observe(card);
          }
        }

        const fullHeight = active.reduce((sum, { card }) => sum + card.offsetHeight + STACK_GAP, 0) - STACK_GAP;
        const frontHeight = active.at(-1)?.card.offsetHeight ?? 0;
        const maxHeight = window.innerHeight - 32;
        const expanded = reduced.matches || !hover.matches || pointer || focused || frontHeight + 2 * STACK_PEEK > maxHeight;
        const overflow = expanded && fullHeight > maxHeight;
        let offset = 0;
        active.slice().reverse().forEach(({ region, card }, index) => {
          const depth = Math.min(index, 2);
          region.style.setProperty('--om-toast-offset', `${expanded ? offset : depth * STACK_PEEK}px`);
          region.style.setProperty('--om-toast-scale', String(expanded ? 1 : 1 - depth * .045));
          region.style.setProperty('--om-toast-layer', String(active.length - index));
          region.style.setProperty('--om-toast-front-height', `${frontHeight}px`);
          region.dataset.stackBack = String(!expanded && index > 0);
          region.dataset.stackHidden = String(!expanded && index > 2);
          offset += card.offsetHeight + STACK_GAP;
        });
        viewport.style.setProperty('--om-toast-stack-height', `${Math.max(0, expanded ? fullHeight : frontHeight + Math.min(Math.max(0, active.length - 1), 2) * STACK_PEEK)}px`);
        viewport.dataset.stackReady = 'true';
        viewport.dataset.stackExpanded = String(expanded);
        viewport.dataset.stackOverflow = String(overflow);
        viewport.dataset.stackActive = String(active.length > 0);
      };
      function schedule() {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => { frame = 0; layout(); });
      }
      const mutation = new MutationObserver(schedule);
      mutation.observe(viewport, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-state'] });
      const enter = (event: PointerEvent) => { if (event.pointerType === 'mouse') { pointer = true; schedule(); } };
      const leave = () => { pointer = false; schedule(); };
      const focusIn = () => { focused = true; schedule(); };
      const focusOut = (event: FocusEvent) => {
        focused = event.relatedTarget instanceof Node && viewport.contains(event.relatedTarget);
        schedule();
      };
      viewport.addEventListener('pointerenter', enter);
      viewport.addEventListener('pointerleave', leave);
      viewport.addEventListener('focusin', focusIn);
      viewport.addEventListener('focusout', focusOut);
      reduced.addEventListener('change', schedule);
      hover.addEventListener('change', schedule);
      window.addEventListener('resize', schedule);
      schedule();
      return () => {
        if (frame) cancelAnimationFrame(frame);
        mutation.disconnect();
        resize?.disconnect();
        viewport.removeEventListener('pointerenter', enter);
        viewport.removeEventListener('pointerleave', leave);
        viewport.removeEventListener('focusin', focusIn);
        viewport.removeEventListener('focusout', focusOut);
        reduced.removeEventListener('change', schedule);
        hover.removeEventListener('change', schedule);
        window.removeEventListener('resize', schedule);
      };
    }, []);

    return <div {...props} ref={root} className={cx('om-toast-viewport', className)} />;
  },
);
ToastViewport.displayName = 'ToastViewport';

export type ToastProps = Omit<ComponentPropsWithoutRef<'div'>, 'title'> & {
  open: boolean;
  title: string;
  onDismiss: () => void;
  dismissLabel?: string;
  tone?: 'neutral' | 'success' | 'info' | 'warning' | 'danger' | 'error';
};

const ToastIcon = ({ tone }: { tone: NonNullable<ToastProps['tone']> }) => (
  <svg className="om-toast-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {tone === 'success' || tone === 'neutral' ? <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>
      : tone === 'warning' ? <><path d="M10.3 4.7a2 2 0 0 1 3.4 0l7 12.1a2 2 0 0 1-1.7 3H5a2 2 0 0 1-1.7-3z" /><path d="M12 9v4m0 3h.01" /></>
        : <><circle cx="12" cy="12" r="9" /><path d={tone === 'info' ? 'M12 11v5m0-8h.01' : 'M12 8v5m0 3h.01'} /></>}
  </svg>
);

export const Toast = /* @__PURE__ */ forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      open,
      title,
      onDismiss,
      dismissLabel = 'Dismiss notification',
      tone = 'neutral',
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const [present, setPresent] = useState(open);
    useEffect(() => {
      if (open) {
        setPresent(true);
        return;
      }
      const reduced = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const timer = window.setTimeout(() => setPresent(false), reduced ? 0 : EXIT_DURATION);
      return () => window.clearTimeout(timer);
    }, [open]);

    const visible = open || present;
    const urgent = tone === 'danger' || tone === 'error';
    return (
      <div {...props} ref={ref} className={cx('om-toast-region', className)} data-state={open ? 'open' : visible ? 'closing' : 'closed'}>
        <div className={visible ? 'om-toast' : undefined} data-tone={visible ? tone : undefined} data-state={open ? 'open' : 'closing'}>
          {visible && <ToastIcon tone={tone} />}
          <div role={urgent ? 'alert' : 'status'} aria-atomic="true">
            {open && <><strong>{title}</strong>{children && <div>{children}</div>}</>}
          </div>
          {!open && visible && <div aria-hidden="true" className="om-toast-exit-copy" ref={element => { element?.setAttribute('inert', ''); }}><strong>{title}</strong>{children && <div>{children}</div>}</div>}
          {open && <button type="button" onClick={onDismiss} aria-label={dismissLabel}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg>
          </button>}
          {!open && visible && <span aria-hidden="true" className="om-toast-close-placeholder" />}
        </div>
      </div>
    );
  },
);
Toast.displayName = 'Toast';

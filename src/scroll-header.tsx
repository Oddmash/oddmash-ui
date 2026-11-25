import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ComponentPropsWithoutRef,
} from 'react';
import { cx } from './cx';

export type ScrollHeaderOptions = {
  enabled?: boolean;
  media?: string;
  locked?: boolean;
  hideThreshold?: number;
  revealThreshold?: number;
  topOffset?: number;
};

export const observeScrollHeader = (header: HTMLElement, {
  enabled = true,
  media,
  locked = false,
  hideThreshold = 24,
  revealThreshold = 8,
  topOffset = 8,
}: ScrollHeaderOptions = {}) => {
  const doc = header.ownerDocument;
  const view = doc.defaultView;
  if (!view) return () => {};
  const original = header.getAttribute('data-om-scroll-hidden');
  const reduced = typeof view.matchMedia === 'function' ? view.matchMedia('(prefers-reduced-motion: reduce)') : undefined;
  const breakpoint = media && typeof view.matchMedia === 'function' ? view.matchMedia(media) : undefined;
  let hidden = false;
  let last = Math.max(0, view.scrollY);
  let distance = 0;
  let direction = 0;
  let frame: number | undefined;
  let disposed = false;

  const show = (nextHidden: boolean) => {
    hidden = nextHidden;
    header.dataset.omScrollHidden = String(nextHidden);
  };
  const isLocked = () => !enabled || locked || reduced?.matches || (breakpoint && !breakpoint.matches) ||
    header.contains(doc.activeElement) || header.querySelector('details[open], [aria-expanded="true"]');
  const reveal = () => {
    distance = 0;
    direction = 0;
    last = Math.max(0, view.scrollY);
    show(false);
  };
  const update = () => {
    frame = undefined;
    if (disposed) return;
    const next = Math.max(0, view.scrollY);
    const delta = next - last;
    last = next;
    if (next <= Math.max(0, topOffset) || isLocked()) {
      reveal();
      return;
    }
    if (!delta) return;
    const nextDirection = Math.sign(delta);
    if (nextDirection !== direction) {
      distance = 0;
      direction = nextDirection;
    }
    distance += Math.abs(delta);
    if (!hidden && direction > 0 && distance >= Math.max(0, hideThreshold)) {
      show(true);
      distance = 0;
    } else if (hidden && direction < 0 && distance >= Math.max(0, revealThreshold)) {
      show(false);
      distance = 0;
    }
  };
  const schedule = () => {
    if (frame !== undefined) return;
    if (typeof view.requestAnimationFrame === 'function') frame = view.requestAnimationFrame(update);
    else update();
  };
  const menuChange = () => { if (isLocked()) reveal(); };
  const mutation = typeof view.MutationObserver === 'undefined' ? undefined : new view.MutationObserver(menuChange);
  mutation?.observe(header, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'aria-expanded'] });
  view.addEventListener('scroll', schedule, { passive: true });
  view.addEventListener('resize', schedule);
  view.addEventListener('pageshow', reveal);
  header.addEventListener('focusin', reveal);
  reduced?.addEventListener('change', reveal);
  breakpoint?.addEventListener('change', reveal);
  reveal();
  return () => {
    disposed = true;
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    mutation?.disconnect();
    view.removeEventListener('scroll', schedule);
    view.removeEventListener('resize', schedule);
    view.removeEventListener('pageshow', reveal);
    header.removeEventListener('focusin', reveal);
    reduced?.removeEventListener('change', reveal);
    breakpoint?.removeEventListener('change', reveal);
    if (original === null) header.removeAttribute('data-om-scroll-hidden');
    else header.setAttribute('data-om-scroll-hidden', original);
  };
};

export type ScrollHeaderProps = ComponentPropsWithoutRef<'header'> & ScrollHeaderOptions;

export const ScrollHeader = forwardRef<HTMLElement, ScrollHeaderProps>(({
  enabled,
  media,
  locked,
  hideThreshold,
  revealThreshold,
  topOffset,
  className,
  ...props
}, ref) => {
  const header = useRef<HTMLElement>(null);
  useImperativeHandle(ref, () => header.current!, []);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    return observeScrollHeader(element, { enabled, media, locked, hideThreshold, revealThreshold, topOffset });
  }, [enabled, media, locked, hideThreshold, revealThreshold, topOffset]);
  return <header {...props} ref={header} className={cx('om-site-header', 'om-scroll-header', className)} />;
});
ScrollHeader.displayName = 'ScrollHeader';

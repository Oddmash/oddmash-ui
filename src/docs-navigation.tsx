import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { Button } from './button';
import { cx } from './cx';

export type DocsNavigationItem = {
  id: string;
  href: string;
  label: ReactNode;
};

export type DocsNavigationGroup = {
  id: string;
  label?: ReactNode;
  items: readonly DocsNavigationItem[];
};

export type DocsNavigationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  groups: readonly DocsNavigationGroup[];
  currentId?: string;
  mobileLabel?: string;
  defaultMobileOpen?: boolean;
  onNavigate?: (item: DocsNavigationItem, event: MouseEvent<HTMLAnchorElement>) => void;
};

const isOrdinaryClick = (event: MouseEvent<HTMLAnchorElement>) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey;

const useDisclosure = (mobileLabel?: string, defaultOpen = false) => {
  const panelId = useId();
  const toggle = useRef<HTMLButtonElement>(null);
  const [enhanced, setEnhanced] = useState(false);
  const [open, setOpen] = useState(defaultOpen);
  useEffect(() => {
    setEnhanced(true);
  }, []);
  const close = (event: MouseEvent<HTMLAnchorElement>, heading?: HTMLElement | null) => {
    if (!open || !isOrdinaryClick(event)) return;
    setOpen(false);
    const button = toggle.current;
    const view = button?.ownerDocument.defaultView;
    if (!button || view?.getComputedStyle(button).display === 'none') return;
    heading?.focus({ preventScroll: true });
    if (!heading || button.ownerDocument.activeElement !== heading) button.focus({ preventScroll: true });
  };
  return {
    panelId,
    toggle,
    open,
    setOpen,
    close,
    attributes: {
      'data-enhanced': enhanced ? 'true' : undefined,
      'data-collapsible': mobileLabel ? 'true' : undefined,
      'data-expanded': String(open),
    },
  };
};

export const DocsNavigation = forwardRef<HTMLElement, DocsNavigationProps>(({
  groups,
  currentId,
  mobileLabel,
  defaultMobileOpen,
  onNavigate,
  className,
  ...props
}, ref) => {
  const disclosure = useDisclosure(mobileLabel, defaultMobileOpen);
  return (
    <nav {...props} {...disclosure.attributes} ref={ref} className={cx('om-docs-navigation', className)}>
      {mobileLabel && (
        <Button ref={disclosure.toggle} className="om-docs-toggle" variant="secondary" size="sm"
          aria-controls={disclosure.panelId} aria-expanded={disclosure.open}
          onClick={() => disclosure.setOpen(open => !open)}>
          {mobileLabel}
        </Button>
      )}
      <div className="om-docs-panel" id={disclosure.panelId}>
        {groups.map(group => (
          <div className="om-docs-group" key={group.id}>
            {group.label && <p className="om-docs-group-label">{group.label}</p>}
            <ul className="om-docs-links" role="list">
              {group.items.map(item => (
                <li key={item.id}>
                  <a href={item.href} aria-current={item.id === currentId ? 'page' : undefined}
                    onClick={event => {
                      onNavigate?.(item, event);
                      disclosure.close(event);
                    }}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );
});
DocsNavigation.displayName = 'DocsNavigation';

export type ActiveHeadingOptions = {
  offset?: number;
};

export const observeActiveHeading = (
  content: HTMLElement,
  headingIds: readonly string[],
  onActiveChange: (id: string | undefined) => void,
  { offset = 0 }: ActiveHeadingOptions = {},
) => {
  const doc = content.ownerDocument;
  const view = doc.defaultView;
  if (!view) return () => {};
  const headings = () => headingIds.flatMap(id => {
    const heading = doc.getElementById(id);
    return heading && content.contains(heading) ? [heading] : [];
  });
  let frame: number | undefined;
  let active: string | undefined;
  let disposed = false;
  const publish = (next: string | undefined) => {
    if (next === active) return;
    active = next;
    onActiveChange(next);
  };
  const update = () => {
    frame = undefined;
    if (disposed) return;
    const sections = headings();
    const bottom = view.scrollY > 0 &&
      view.scrollY + view.innerHeight >= doc.documentElement.scrollHeight - 2;
    if (bottom) {
      publish(sections.at(-1)?.id);
      return;
    }
    const current = sections.slice().reverse().find(heading => {
      const margin = Number.parseFloat(view.getComputedStyle(heading).scrollMarginTop) || 0;
      return heading.getBoundingClientRect().top <= Math.max(offset, margin) + 24;
    });
    publish(current?.id);
  };
  const schedule = () => {
    if (frame !== undefined) return;
    if (typeof view.requestAnimationFrame === 'function') frame = view.requestAnimationFrame(update);
    else update();
  };
  const syncHash = () => {
    const hash = view.location.hash.slice(1);
    let id = hash;
    try {
      id = decodeURIComponent(hash);
    } catch {
      id = hash;
    }
    const match = headings().find(heading => heading.id === id);
    if (match) publish(match.id);
    else schedule();
  };
  const resize = typeof view.ResizeObserver === 'undefined' ? undefined : new view.ResizeObserver(schedule);
  resize?.observe(content);
  view.addEventListener('scroll', schedule, { passive: true });
  view.addEventListener('resize', schedule);
  view.addEventListener('hashchange', syncHash);
  syncHash();
  return () => {
    disposed = true;
    if (frame !== undefined) view.cancelAnimationFrame(frame);
    resize?.disconnect();
    view.removeEventListener('scroll', schedule);
    view.removeEventListener('resize', schedule);
    view.removeEventListener('hashchange', syncHash);
  };
};

export type UseActiveHeadingOptions = ActiveHeadingOptions & {
  contentId?: string;
  enabled?: boolean;
};

export const useActiveHeading = (headingIds: readonly string[], {
  contentId,
  offset,
  enabled = true,
}: UseActiveHeadingOptions = {}) => {
  const [active, setActive] = useState<string>();
  const key = JSON.stringify(headingIds);
  useEffect(() => {
    setActive(undefined);
    if (!enabled) return;
    const content = contentId ? document.getElementById(contentId) : document.body;
    if (!content) return;
    return observeActiveHeading(content, JSON.parse(key) as string[], setActive, { offset });
  }, [key, contentId, offset, enabled]);
  return active;
};

export type TocHeading = {
  id: string;
  label: ReactNode;
  level?: number;
};

export type TableOfContentsProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  headings: readonly TocHeading[];
  label: string;
  mobileLabel?: string;
  defaultMobileOpen?: boolean;
  contentId?: string;
  offset?: number;
  activeId?: string | null;
  onNavigate?: (heading: TocHeading, event: MouseEvent<HTMLAnchorElement>) => void;
};

export const TableOfContents = forwardRef<HTMLElement, TableOfContentsProps>(({
  headings,
  label,
  mobileLabel,
  defaultMobileOpen,
  contentId,
  offset,
  activeId,
  onNavigate,
  className,
  ...props
}, ref) => {
  const observed = useActiveHeading(headings.map(heading => heading.id), {
    contentId,
    offset,
    enabled: activeId === undefined,
  });
  const currentId = activeId === undefined ? observed : activeId;
  const disclosure = useDisclosure(mobileLabel, defaultMobileOpen);
  return (
    <nav aria-label={label} {...props} {...disclosure.attributes} ref={ref} className={cx('om-table-of-contents', className)}>
      <p className="om-toc-label">{label}</p>
      {mobileLabel && (
        <Button ref={disclosure.toggle} className="om-docs-toggle" variant="secondary" size="sm"
          aria-controls={disclosure.panelId} aria-expanded={disclosure.open}
          onClick={() => disclosure.setOpen(open => !open)}>
          {mobileLabel}
        </Button>
      )}
      <ul className="om-docs-panel om-toc-links" id={disclosure.panelId} role="list">
        {headings.map(heading => (
          <li key={heading.id} data-level={heading.level ?? 2}>
            <a href={'#' + encodeURIComponent(heading.id)}
              aria-current={heading.id === currentId ? 'location' : undefined}
              onClick={event => {
                onNavigate?.(heading, event);
                disclosure.close(event, event.currentTarget.ownerDocument.getElementById(heading.id));
              }}>
              {heading.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
});
TableOfContents.displayName = 'TableOfContents';

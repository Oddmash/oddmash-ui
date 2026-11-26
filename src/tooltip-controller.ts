import primitiveTokens from '../tokens/primitive.json' with { type: 'json' };

export type TooltipController = { destroy: () => void; refresh: () => void };

let nextId = 0;

export const mountTooltip = (trigger: HTMLElement, tooltip: HTMLElement): TooltipController => {
  const doc = trigger.ownerDocument;
  const view = doc.defaultView;
  if (!view) return { destroy: () => undefined, refresh: () => undefined };

  const previousDescription = trigger.getAttribute('aria-describedby');
  const previousTitle = trigger.getAttribute('title');
  if (!tooltip.id) {
    do { tooltip.id = `om-tooltip-${++nextId}`; } while (doc.getElementById(tooltip.id) && doc.getElementById(tooltip.id) !== tooltip);
  }
  const tooltipId = tooltip.id;
  const ownsDescription = !(previousDescription ?? '').split(/\s+/).includes(tooltipId);
  const describe = () => {
    const descriptions = new Set((trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean));
    descriptions.add(tooltipId);
    trigger.setAttribute('aria-describedby', [...descriptions].join(' '));
  };
  describe();
  trigger.removeAttribute('title');
  tooltip.setAttribute('role', 'tooltip');
  tooltip.hidden = true;

  const controller = new AbortController();
  const { signal } = controller;
  let active = false;
  let hoveringTrigger = false;
  let hoveringTooltip = false;
  let focused = trigger.contains(doc.activeElement);
  let dismissed = false;
  let timer: number | undefined;

  const position = () => {
    if (!active) return;
    const anchor = trigger.getBoundingClientRect();
    const panel = tooltip.getBoundingClientRect();
    const gap = primitiveTokens.primitive.space['8'].$value.value;
    const viewport = view.visualViewport;
    const left = viewport?.offsetLeft ?? 0;
    const top = viewport?.offsetTop ?? 0;
    const right = left + (viewport?.width ?? view.innerWidth);
    const bottom = top + (viewport?.height ?? view.innerHeight);
    const x = Math.max(left + gap, Math.min(anchor.left + (anchor.width - panel.width) / 2, right - panel.width - gap));
    const above = anchor.top - panel.height - gap;
    const below = anchor.bottom + gap;
    const y = Math.max(top + gap, Math.min(above >= top + gap ? above : below, bottom - panel.height - gap));
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  const hide = () => {
    view.clearTimeout(timer);
    if (!active) return;
    active = false;
    if (typeof tooltip.hidePopover === 'function') {
      try { tooltip.hidePopover(); } catch { tooltip.removeAttribute('popover'); }
    }
    tooltip.hidden = true;
  };

  const show = () => {
    view.clearTimeout(timer);
    if (dismissed || active) return;
    active = true;
    tooltip.hidden = false;
    if (typeof tooltip.showPopover === 'function') {
      tooltip.setAttribute('popover', 'manual');
      try { tooltip.showPopover(); } catch { tooltip.removeAttribute('popover'); }
    }
    position();
  };

  const bridgeContains = (event: PointerEvent) => {
    const a = trigger.getBoundingClientRect();
    const b = tooltip.getBoundingClientRect();
    if (!a.width || !a.height || !b.width || !b.height) return false;
    const top = b.bottom <= a.top ? b.bottom : a.bottom;
    const bottom = b.bottom <= a.top ? a.top : b.top;
    return top <= bottom && event.clientY >= top && event.clientY <= bottom
      && event.clientX >= Math.min(a.left, b.left) && event.clientX <= Math.max(a.right, b.right);
  };
  const scheduleHide = (event?: PointerEvent) => {
    view.clearTimeout(timer);
    if (hoveringTrigger || hoveringTooltip || focused || (event && active && bridgeContains(event))) return;
    dismissed = false;
    timer = view.setTimeout(hide, primitiveTokens.primitive.duration['ms-140'].$value.value);
  };

  trigger.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'touch') return;
    hoveringTrigger = true;
    dismissed = false;
    show();
  }, { signal });
  trigger.addEventListener('pointerleave', (event) => { hoveringTrigger = false; scheduleHide(event); }, { signal });
  tooltip.addEventListener('pointerenter', () => { hoveringTooltip = true; view.clearTimeout(timer); }, { signal });
  tooltip.addEventListener('pointerleave', (event) => { hoveringTooltip = false; scheduleHide(event); }, { signal });
  trigger.addEventListener('focusin', () => { focused = true; dismissed = false; show(); }, { signal });
  trigger.addEventListener('focusout', () => { focused = false; scheduleHide(); }, { signal });
  doc.addEventListener('pointermove', (event) => {
    if (!active || hoveringTrigger || hoveringTooltip || focused || bridgeContains(event)) return;
    const target = event.target;
    if (target instanceof Node && (trigger.contains(target) || tooltip.contains(target))) return;
    hide();
  }, { signal });
  doc.addEventListener('pointerout', (event) => {
    if (event.relatedTarget === null && !focused) { hoveringTrigger = false; hoveringTooltip = false; scheduleHide(); }
  }, { signal });
  doc.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !active) return;
    dismissed = true;
    hoveringTooltip = false;
    hide();
    event.preventDefault();
  }, { signal, capture: true });
  view.addEventListener('resize', position, { signal });
  view.addEventListener('scroll', position, { signal, capture: true, passive: true });
  view.visualViewport?.addEventListener('resize', position, { signal });
  view.visualViewport?.addEventListener('scroll', position, { signal });

  if (focused) show();
  return {
    refresh: () => { describe(); position(); },
    destroy: () => {
      controller.abort();
      hide();
      if (ownsDescription) {
        const remaining = (trigger.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(id => id && id !== tooltipId);
        if (remaining.length) trigger.setAttribute('aria-describedby', remaining.join(' '));
        else trigger.removeAttribute('aria-describedby');
      }
      if (previousTitle !== null && !trigger.hasAttribute('title')) trigger.setAttribute('title', previousTitle);
      tooltip.removeAttribute('popover');
      tooltip.style.removeProperty('top');
      tooltip.style.removeProperty('left');
    },
  };
};

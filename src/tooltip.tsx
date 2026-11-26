import { useEffect, useId, useRef, type ReactElement, type ReactNode } from 'react';
import { mountTooltip } from './tooltip-controller';

export type TooltipProps = { children: ReactElement; content: ReactNode };

export const Tooltip = ({ children, content }: TooltipProps) => {
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const id = useId();
  const mounted = useRef<{ trigger: HTMLElement; panel: HTMLElement; controller: ReturnType<typeof mountTooltip> } | null>(null);

  useEffect(() => {
    const trigger = anchor.current?.firstElementChild;
    const current = mounted.current;
    if (current && (current.trigger !== trigger || current.panel !== panel.current)) {
      current.controller.destroy();
      mounted.current = null;
    }
    if (!(trigger instanceof HTMLElement) || !panel.current) return;
    if (!mounted.current) mounted.current = { trigger, panel: panel.current, controller: mountTooltip(trigger, panel.current) };
    else mounted.current.controller.refresh();
  });
  useEffect(() => () => {
    mounted.current?.controller.destroy();
    mounted.current = null;
  }, []);

  return (
    <span className="om-tooltip-anchor" ref={anchor}>
      {children}
      <span ref={panel} id={id} className="om-tooltip" role="tooltip" hidden>{content}</span>
    </span>
  );
};
export { mountTooltip, type TooltipController } from './tooltip-controller';

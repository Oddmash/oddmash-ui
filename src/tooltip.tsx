import { useEffect, useId, useRef, type ReactElement, type ReactNode } from 'react';
import { mountTooltip } from './tooltip-controller';

export type TooltipProps = { children: ReactElement; content: ReactNode };

export const Tooltip = ({ children, content }: TooltipProps) => {
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLSpanElement>(null);
  const id = useId();

  useEffect(() => {
    const trigger = anchor.current?.firstElementChild;
    if (!(trigger instanceof HTMLElement) || !panel.current) return;
    const controller = mountTooltip(trigger, panel.current);
    return controller.destroy;
  }, [children, content]);

  return (
    <span className="om-tooltip-anchor" ref={anchor}>
      {children}
      <span ref={panel} id={id} className="om-tooltip" role="tooltip" hidden>{content}</span>
    </span>
  );
};
export { mountTooltip, type TooltipController } from './tooltip-controller';

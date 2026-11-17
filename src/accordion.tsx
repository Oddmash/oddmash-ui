import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from 'react';
import { cx } from './cx';

export type AccordionProps = ComponentPropsWithoutRef<'details'> & {
  summary: ReactNode;
};

export const Accordion = /* @__PURE__ */ forwardRef<
  HTMLDetailsElement,
  AccordionProps
>(({ className, summary, children, ...props }, ref) => (
  <details {...props} ref={ref} className={cx('om-accordion', className)}>
    <summary>{summary}</summary>
    <div className="om-accordion-content">
      <div>{children}</div>
    </div>
  </details>
));
Accordion.displayName = 'Accordion';

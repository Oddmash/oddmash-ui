import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type ProseProps = ComponentPropsWithoutRef<'article'>;
export const Prose = /* @__PURE__ */ forwardRef<HTMLElement, ProseProps>(
  ({ className, ...props }, ref) => (
    <article {...props} ref={ref} className={cx('om-prose', className)} />
  ),
);
Prose.displayName = 'Prose';

export type ProseScrollProps = ComponentPropsWithoutRef<'div'>;
export const ProseScroll = /* @__PURE__ */ forwardRef<HTMLDivElement, ProseScrollProps>(
  ({ className, ...props }, ref) => (
    <div {...props} ref={ref} className={cx('om-prose-scroll', className)} />
  ),
);
ProseScroll.displayName = 'ProseScroll';

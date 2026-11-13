import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type CardProps = ComponentPropsWithoutRef<'div'>;
export const Card = /* @__PURE__ */ forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => <div {...props} ref={ref} className={cx('om-card', className)} />);
Card.displayName = 'Card';

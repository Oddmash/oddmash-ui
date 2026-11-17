import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from './cx';

export type TableProps = ComponentPropsWithoutRef<'table'>;

export const Table = /* @__PURE__ */ forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <table {...props} ref={ref} className={cx('om-table', className)} />
  ),
);
Table.displayName = 'Table';

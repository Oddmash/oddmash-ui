import { forwardRef, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type KeyboardEvent } from 'react';
import { Button } from './button';
import { cx } from './cx';

export type DateCalendarLabels = { previousMonth: string; nextMonth: string; today: string };
export type DateCalendarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'defaultValue' | 'onChange'> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  minYear?: number;
  maxYear?: number;
  locale?: string;
  labels?: Partial<DateCalendarLabels>;
  disabled?: boolean;
};

const defaults = { previousMonth: 'Previous month', nextMonth: 'Next month', today: 'Today' };
const utc = (year: number, month: number, day: number) => {
  const date = new Date(0);
  date.setUTCFullYear(year, month, day);
  return date;
};
const iso = (date: Date) => date.toISOString().slice(0, 10);
const parse = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const date = utc(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return iso(date) === value ? date : null;
};
const addDays = (date: Date, amount: number) => utc(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + amount);
const addMonths = (date: Date, amount: number) => {
  const first = utc(date.getUTCFullYear(), date.getUTCMonth() + amount, 1);
  const last = utc(first.getUTCFullYear(), first.getUTCMonth() + 1, 0).getUTCDate();
  return utc(first.getUTCFullYear(), first.getUTCMonth(), Math.min(last, date.getUTCDate()));
};
const monthStart = (date: Date) => utc(date.getUTCFullYear(), date.getUTCMonth(), 1);
const localToday = () => {
  const now = new Date();
  return utc(now.getFullYear(), now.getMonth(), now.getDate());
};

export const DateCalendar = forwardRef<HTMLDivElement, DateCalendarProps>(({
  value, defaultValue = '', onValueChange, minYear = 1900, maxYear = 2100, locale = 'en', labels, disabled, className, ...props
}, ref) => {
  if (!Number.isInteger(minYear) || !Number.isInteger(maxYear) || minYear < 1 || maxYear > 9999 || minYear > maxYear) throw new RangeError('DateCalendar requires an ordered year range from 1 to 9999.');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selected = parse(value ?? internalValue);
  const clamp = (date: Date) => date.getUTCFullYear() < minYear ? utc(minYear, 0, 1) : date.getUTCFullYear() > maxYear ? utc(maxYear, 11, 31) : date;
  const [cursor, setCursor] = useState(() => clamp(selected ?? new Date()));
  const [today, setToday] = useState<Date | null>(null);
  const active = clamp(cursor);
  const first = monthStart(active);
  const monthId = useId();
  const grid = useRef<HTMLTableElement>(null);
  const pendingFocus = useRef(false);
  const selectedKey = selected ? iso(selected) : '';
  const strings = { ...defaults, ...labels };
  const monthFormatter = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', timeZone: 'UTC', calendar: 'gregory' });
  const weekdayFormatter = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC', calendar: 'gregory' });
  const dateFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC', calendar: 'gregory' });
  const totalDays = addMonths(first, 1).getTime() - first.getTime();
  const length = Math.round(totalDays / 86400000);
  const offset = first.getUTCDay();

  useEffect(() => {
    const now = localToday();
    setToday(now);
    if (!selectedKey) setCursor(now);
  }, [selectedKey]);
  useEffect(() => {
    const next = parse(selectedKey);
    if (next) setCursor(next);
  }, [selectedKey]);
  useEffect(() => {
    if (pendingFocus.current) {
      pendingFocus.current = false;
      grid.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
    }
  }, [cursor]);

  const move = (date: Date, focus = false) => {
    pendingFocus.current = focus;
    setCursor(clamp(date));
  };
  const select = (date: Date) => {
    if (disabled) return;
    const next = iso(date);
    setCursor(date);
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };
  const onGridKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next: Date;
    switch (event.key) {
      case 'ArrowLeft': next = addDays(active, -1); break;
      case 'ArrowRight': next = addDays(active, 1); break;
      case 'ArrowUp': next = addDays(active, -7); break;
      case 'ArrowDown': next = addDays(active, 7); break;
      case 'Home': next = addDays(active, -active.getUTCDay()); break;
      case 'End': next = addDays(active, 6 - active.getUTCDay()); break;
      case 'PageUp': next = addMonths(active, event.shiftKey ? -12 : -1); break;
      case 'PageDown': next = addMonths(active, event.shiftKey ? 12 : 1); break;
      default: return;
    }
    event.preventDefault();
    move(next, true);
  };

  return <div {...props} ref={ref} className={cx('om-date-calendar', className)}>
    <div className="om-date-calendar-header">
      <Button size="sm" variant="ghost" aria-label={strings.previousMonth} disabled={disabled || (first.getUTCFullYear() === minYear && first.getUTCMonth() === 0)} onClick={() => move(addMonths(active, -1))}><span aria-hidden="true">‹</span></Button>
      <span id={monthId} aria-live="polite">{monthFormatter.format(first)}</span>
      <Button size="sm" variant="ghost" aria-label={strings.nextMonth} disabled={disabled || (first.getUTCFullYear() === maxYear && first.getUTCMonth() === 11)} onClick={() => move(addMonths(active, 1))}><span aria-hidden="true">›</span></Button>
    </div>
    <table ref={grid} role="grid" aria-labelledby={monthId} className="om-date-calendar-grid">
      <thead><tr>{Array.from({ length: 7 }, (_, index) => <th key={index} scope="col">{weekdayFormatter.format(utc(2024, 0, 7 + index))}</th>)}</tr></thead>
      <tbody>{Array.from({ length: 6 }, (_, row) => <tr key={row}>{Array.from({ length: 7 }, (_, column) => {
        const day = row * 7 + column - offset + 1;
        if (day < 1 || day > length) return <td key={column} />;
        const date = utc(first.getUTCFullYear(), first.getUTCMonth(), day);
        const key = iso(date);
        const current = today !== null && key === iso(today);
        return <td key={column} aria-selected={key === selectedKey}>
          <button type="button" className="om-date-calendar-day" aria-label={dateFormatter.format(date)} aria-current={current ? 'date' : undefined} data-selected={key === selectedKey || undefined} tabIndex={key === iso(active) ? 0 : -1} disabled={disabled} onClick={() => select(date)} onKeyDown={onGridKey}>{day}</button>
        </td>;
      })}</tr>)}</tbody>
    </table>
    <Button size="sm" variant="ghost" disabled={disabled || !today || today.getUTCFullYear() < minYear || today.getUTCFullYear() > maxYear} onClick={() => { if (today) select(today); }}>{strings.today}</Button>
  </div>;
});
DateCalendar.displayName = 'DateCalendar';

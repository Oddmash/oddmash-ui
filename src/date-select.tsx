import { forwardRef, useEffect, useReducer, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { Button } from './button';
import { cx } from './cx';

const parts = ['year', 'month', 'day', 'hour', 'minute', 'second'] as const;
type DatePart = typeof parts[number];
type DateParts = Record<DatePart, number>;

export type DateSelectLabels = Record<DatePart | 'clear', string>;
export type DateSelectProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'defaultValue' | 'name' | 'value'> & {
  label: ReactNode;
  labels?: Partial<DateSelectLabels>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  minYear?: number;
  maxYear?: number;
  name?: string;
  required?: boolean;
};

const defaultLabels: DateSelectLabels = {
  year: 'Year', month: 'Month', day: 'Day', hour: 'Hour', minute: 'Minute', second: 'Second', clear: 'Clear date and time',
};

const daysInMonth = (year: number, month: number) => {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
};

const parse = (value: string, minYear: number, maxYear: number): DateParts | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const [year, month, day, hour, minute, second] = match.slice(1).map(Number);
  if (year < minYear || year > maxYear || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month) || hour > 23 || minute > 59 || second > 59) return null;
  return { year, month, day, hour, minute, second };
};

const pad = (value: number, length = 2) => String(value).padStart(length, '0');
const format = ({ year, month, day, hour, minute, second }: DateParts) => `${pad(year, 4)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}`;
const range = (first: number, last: number) => Array.from({ length: last - first + 1 }, (_, index) => index + first);

export const DateSelect = forwardRef<HTMLFieldSetElement, DateSelectProps>(({
  label, labels, value, defaultValue = '', onValueChange, minYear = 1900, maxYear = 2100, name, required, disabled, className, form, ...props
}, ref) => {
  if (!Number.isInteger(minYear) || !Number.isInteger(maxYear) || minYear < 1 || maxYear > 9999 || minYear > maxYear) throw new RangeError('DateSelect requires an ordered year range from 1 to 9999.');
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [, refresh] = useReducer((revision: number) => revision + 1, 0);
  const yearControl = useRef<HTMLSelectElement>(null);
  const parsed = parse(value ?? internalValue, minYear, maxYear);
  const fieldLabels = { ...defaultLabels, ...labels };

  useEffect(() => {
    const owner = yearControl.current?.form;
    let active = true;
    const reset = (event: Event) => {
      queueMicrotask(() => {
        if (!active || event.defaultPrevented) return;
        if (value === undefined) setInternalValue(defaultValue);
        refresh();
      });
    };
    owner?.addEventListener('reset', reset);
    return () => { active = false; owner?.removeEventListener('reset', reset); };
  }, [defaultValue, form, value]);

  const update = (next: string) => {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  };

  const selectPart = (part: DatePart, next: number) => {
    if (disabled) return;
    const now = new Date();
    const current = parsed ?? {
      year: Math.min(maxYear, Math.max(minYear, now.getFullYear())), month: now.getMonth() + 1, day: part === 'month' || part === 'year' ? 1 : now.getDate(), hour: 0, minute: 0, second: 0,
    };
    const updated = { ...current, [part]: next };
    updated.day = Math.min(updated.day, daysInMonth(updated.year, updated.month));
    update(format(updated));
  };

  const options: Record<DatePart, number[]> = {
    year: range(minYear, maxYear), month: range(1, 12), day: range(1, parsed ? daysInMonth(parsed.year, parsed.month) : 31), hour: range(0, 23), minute: range(0, 59), second: range(0, 59),
  };

  return <fieldset {...props} ref={ref} className={cx('om-date-select', className)} disabled={disabled} form={form}>
    <legend>{label}</legend>
    <div className="om-date-select-parts">
      {parts.map(part => <label key={part}>
        <span>{fieldLabels[part]}</span>
        <select ref={part === 'year' ? yearControl : undefined} className="om-select" form={form} value={parsed?.[part] ?? ''} required={required} aria-invalid={props['aria-invalid']} aria-describedby={props['aria-describedby']} onChange={event => selectPart(part, Number(event.currentTarget.value))}>
          <option value="" disabled>—</option>
          {options[part].map(option => <option key={option} value={option}>{pad(option, part === 'year' ? 4 : 2)}</option>)}
        </select>
      </label>)}
    </div>
    {name && <input type="hidden" name={name} form={form} value={parsed ? format(parsed) : ''} />}
    {!required && <Button type="button" className="om-date-select-clear" variant="ghost" size="sm" disabled={!parsed || disabled} onClick={() => { update(''); yearControl.current?.focus(); }}>{fieldLabels.clear}</Button>}
  </fieldset>;
});
DateSelect.displayName = 'DateSelect';

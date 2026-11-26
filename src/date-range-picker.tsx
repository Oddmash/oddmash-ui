import { forwardRef, useEffect, useId, useRef, useState, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { DatePicker, type DatePickerLabels } from './date-picker';
import { cx } from './cx';

export type DateRange = { start: string; end: string };
export type DateRangePickerProps = Omit<ComponentPropsWithoutRef<'fieldset'>, 'children' | 'defaultValue' | 'name' | 'value'> & {
  label: ReactNode;
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  value?: DateRange;
  defaultValue?: DateRange;
  onValueChange?: (value: DateRange) => void;
  labels?: Partial<DatePickerLabels>;
  minYear?: number;
  maxYear?: number;
  locale?: string;
  withTime?: boolean;
  required?: boolean;
  startName?: string;
  endName?: string;
  invalidMessage?: string;
  showCalendar?: boolean;
};

const empty: DateRange = { start: '', end: '' };
export const DateRangePicker = forwardRef<HTMLFieldSetElement, DateRangePickerProps>(({
  label, startLabel = 'Start date', endLabel = 'End date', value, defaultValue = empty, onValueChange, labels, minYear, maxYear, locale, withTime = false, required, disabled, startName, endName, invalidMessage = 'End date must not precede start date.', showCalendar, className, form, ...props
}, ref) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const startField = useRef<HTMLFieldSetElement>(null);
  const endField = useRef<HTMLFieldSetElement>(null);
  const errorId = useId();
  const current = value ?? internalValue;
  const reversed = Boolean(current.start && current.end && current.start > current.end);
  const invalid = reversed || props['aria-invalid'] === true || props['aria-invalid'] === 'true';
  const describedBy = [props['aria-describedby'], reversed ? errorId : undefined].filter(Boolean).join(' ') || undefined;

  useEffect(() => {
    const owner = startField.current?.querySelector('select')?.form;
    let active = true;
    const reset = (event: Event) => queueMicrotask(() => {
      if (active && !event.defaultPrevented && value === undefined) setInternalValue(defaultValue);
    });
    owner?.addEventListener('reset', reset);
    return () => { active = false; owner?.removeEventListener('reset', reset); };
  }, [defaultValue, form, value]);
  useEffect(() => {
    endField.current?.querySelector('select')?.setCustomValidity(reversed ? invalidMessage || 'End date must not precede start date.' : '');
  }, [reversed, invalidMessage]);

  const update = (part: keyof DateRange, next: string) => {
    if (disabled) return;
    const range = { ...current, [part]: next };
    if (value === undefined) setInternalValue(range);
    onValueChange?.(range);
  };
  const pickerProps = { labels, minYear, maxYear, locale, required, disabled, form, showCalendar, mode: withTime ? 'date-time' as const : 'date' as const, 'aria-invalid': invalid || undefined, 'aria-describedby': describedBy };
  return <fieldset {...props} ref={ref} className={cx('om-date-range-picker', className)} disabled={disabled} form={form} aria-invalid={invalid || undefined} aria-describedby={describedBy}>
    <legend>{label}</legend>
    <div className="om-date-range-picker-bounds">
      <DatePicker {...pickerProps} ref={startField} label={startLabel} name={startName} value={current.start} onValueChange={next => update('start', next)} />
      <DatePicker {...pickerProps} ref={endField} label={endLabel} name={endName} value={current.end} onValueChange={next => update('end', next)} />
    </div>
    {reversed && <p className="om-date-range-picker-error" role="status" id={errorId}>{invalidMessage}</p>}
  </fieldset>;
});
DateRangePicker.displayName = 'DateRangePicker';

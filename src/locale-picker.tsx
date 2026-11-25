import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Select, type SelectOption, type SelectProps } from './select';
import { cx } from './cx';

export type LocalePickerOption = SelectOption & {
  href: string;
};

export type LocalePickerProps = {
  label: string;
  options: readonly LocalePickerOption[];
  value: string;
  onValueChange?: (value: string, option: LocalePickerOption) => void;
  className?: string;
  selectProps?: Omit<SelectProps, 'options' | 'value' | 'defaultValue' | 'onValueChange' | 'aria-label'>;
};

export const LocalePicker = forwardRef<HTMLButtonElement, LocalePickerProps>(({
  label,
  options,
  value,
  onValueChange,
  className,
  selectProps,
}, ref) => {
  const fallback = useRef<HTMLDetailsElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const transferFocus = useRef(false);
  const [enhanced, setEnhanced] = useState(false);
  const current = options.find(option => option.value === value);
  useImperativeHandle(ref, () => trigger.current!, [enhanced]);
  useEffect(() => {
    const element = fallback.current;
    transferFocus.current = Boolean(element?.contains(element.ownerDocument.activeElement));
    setEnhanced(true);
  }, []);
  useEffect(() => {
    if (enhanced && transferFocus.current) {
      trigger.current?.focus({ preventScroll: true });
      transferFocus.current = false;
    }
  }, [enhanced]);
  return (
    <div className={cx('om-locale-picker', className)}>
      <details ref={fallback} className="om-locale-fallback" hidden={enhanced}>
        <summary aria-label={label} aria-disabled={selectProps?.disabled || undefined} lang={current?.lang}>{current?.label ?? label}</summary>
        <ul className="om-locale-options" role="list">
          {options.map(option => (
            <li key={option.value} lang={option.lang}>
              {option.disabled || selectProps?.disabled ? <span aria-disabled="true">{option.label}</span> : (
                <a href={option.href} hrefLang={option.lang} aria-current={option.value === value ? 'page' : undefined}>
                  {option.label}
                </a>
              )}
            </li>
          ))}
        </ul>
      </details>
      {enhanced && (
        <Select {...selectProps} ref={trigger} aria-label={label} lang={selectProps?.lang ?? current?.lang} options={options} value={value}
          onValueChange={next => {
            const option = options.find(item => item.value === next && !item.disabled);
            if (!option) return;
            if (onValueChange) onValueChange(next, option);
            else trigger.current?.ownerDocument.defaultView?.location.assign(option.href);
          }} />
      )}
    </div>
  );
});
LocalePicker.displayName = 'LocalePicker';

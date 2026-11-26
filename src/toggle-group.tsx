import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from 'react';
import { cx } from './cx';

type ToggleGroupBaseProps = Omit<ComponentPropsWithoutRef<'div'>, 'defaultValue'> & {
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
};

export type ToggleGroupProps = ToggleGroupBaseProps & (
  | {
      type: 'single';
      value?: string | null;
      defaultValue?: string | null;
      onValueChange?: (value: string | null) => void;
    }
  | {
      type: 'multiple';
      value?: readonly string[];
      defaultValue?: readonly string[];
      onValueChange?: (value: string[]) => void;
    }
);

export type ToggleGroupItemProps = Omit<
  ComponentPropsWithoutRef<'button'>, 'value' | 'aria-pressed' | 'tabIndex'
> & { value: string };

const ToggleGroupContext = /* @__PURE__ */ createContext<{
  disabled: boolean;
  selectedValues: readonly string[];
  tabStop: string | null;
  setTabStop: (id: string) => void;
  toggle: (value: string) => void;
} | null>(null);

function enabledItems(group: HTMLDivElement) {
  return Array.from(group.querySelectorAll<HTMLButtonElement>('button[data-om-toggle-item]:enabled'))
    .filter(item => {
      const hidden = item.closest('[hidden]');
      return item.closest('[data-om-toggle-group]') === group
        && (!hidden || hidden === group || !group.contains(hidden));
    });
}

export const ToggleGroup = /* @__PURE__ */ forwardRef<HTMLDivElement, ToggleGroupProps>(
  (props, ref) => {
    const {
      type, value, defaultValue, onValueChange, disabled, orientation = 'horizontal',
      className, onKeyDown, 'aria-disabled': ariaDisabled, ...nativeProps
    } = props;
    const isDisabled = disabled || ariaDisabled === true || ariaDisabled === 'true';
    const root = useRef<HTMLDivElement>(null);
    const [internalValue, setInternalValue] = useState(defaultValue ?? (type === 'single' ? null : []));
    const [tabStop, setTabStop] = useState<string | null>(null);
    useImperativeHandle(ref, () => root.current!, []);

    useEffect(() => {
      const group = root.current;
      if (!group) return;

      const syncTabStop = () => {
        const ids = enabledItems(group).map(item => item.dataset.omToggleItem!);
        setTabStop(current => current !== null && ids.includes(current) ? current : ids[0] ?? null);
      };

      syncTabStop();
      const Observer = group.ownerDocument.defaultView?.MutationObserver;
      if (!Observer) return;
      const observer = new Observer(syncTabStop);
      observer.observe(group, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'hidden'] });
      return () => observer.disconnect();
    }, []);

    const selection = value === undefined ? internalValue : value;
    const singleValue = typeof selection === 'string' ? selection : null;
    const multipleValues = selection !== null && typeof selection !== 'string' ? selection : [];
    const selectedValues = type === 'single' ? (singleValue === null ? [] : [singleValue]) : multipleValues;

    const toggle = (itemValue: string) => {
      if (isDisabled) return;
      if (type === 'single') {
        const next = singleValue === itemValue ? null : itemValue;
        if (value === undefined) setInternalValue(next);
        onValueChange?.(next);
      } else {
        const next = multipleValues.includes(itemValue)
          ? multipleValues.filter(item => item !== itemValue)
          : [...multipleValues, itemValue];
        if (value === undefined) setInternalValue(next);
        onValueChange?.(next);
      }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      if (isDisabled || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

      const group = event.currentTarget;
      const items = enabledItems(group);
      const index = items.findIndex(item => item === event.target);
      if (index === -1) return;

      const { key } = event;
      let nextIndex: number;
      if (key === 'Home') nextIndex = 0;
      else if (key === 'End') nextIndex = items.length - 1;
      else {
        const previous = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
        const next = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
        if (key !== previous && key !== next) return;
        const rtl = orientation === 'horizontal'
          && group.ownerDocument.defaultView?.getComputedStyle(group).direction === 'rtl';
        const step = (key === next ? 1 : -1) * (rtl ? -1 : 1);
        nextIndex = (index + step + items.length) % items.length;
      }

      event.preventDefault();
      items[nextIndex].focus();
    };

    return (
      <ToggleGroupContext.Provider value={{ disabled: isDisabled, selectedValues, tabStop, setTabStop, toggle }}>
        <div
          role="group"
          {...nativeProps}
          aria-disabled={isDisabled || ariaDisabled}
          ref={root}
          className={cx('om-toggle-group', className)}
          data-om-toggle-group=""
          data-orientation={orientation}
          onKeyDown={handleKeyDown}
        />
      </ToggleGroupContext.Provider>
    );
  },
);

export const ToggleGroupItem = /* @__PURE__ */ forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ value, className, type = 'button', disabled, onFocus, onClick, 'aria-disabled': ariaDisabled, ...props }, ref) => {
    const id = useId();
    const group = useContext(ToggleGroupContext);
    if (!group) throw new Error('ToggleGroupItem must be rendered inside ToggleGroup.');
    const isDisabled = group.disabled || disabled || ariaDisabled === true || ariaDisabled === 'true';

    return (
      <button
        {...props}
        ref={ref}
        type={type}
        value={value}
        className={cx('om-toggle-group-item', className)}
        disabled={isDisabled}
        aria-disabled={ariaDisabled}
        aria-pressed={group.selectedValues.includes(value)}
        data-om-toggle-item={id}
        tabIndex={!isDisabled && group.tabStop === id ? 0 : -1}
        onFocus={event => {
          onFocus?.(event);
          if (!isDisabled) group.setTabStop(id);
        }}
        onClick={event => {
          onClick?.(event);
          if (!isDisabled && !event.defaultPrevented) group.toggle(value);
        }}
      />
    );
  },
);

ToggleGroup.displayName = 'ToggleGroup';
ToggleGroupItem.displayName = 'ToggleGroupItem';

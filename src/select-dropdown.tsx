import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type KeyboardEvent,
} from 'react';
import { cx } from './cx';

export type SelectDropdownOption = {
  value: string;
  label: string;
  disabled?: boolean;
  lang?: string;
};

export type SelectDropdownProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'name' | 'role'
> & {
  options: readonly SelectDropdownOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
};

export const SelectDropdown = /* @__PURE__ */ forwardRef<
  HTMLButtonElement,
  SelectDropdownProps
>(
  (
    {
      options,
      name,
      value,
      defaultValue,
      placeholder = 'Choose an option',
      onValueChange,
      disabled,
      form,
      className,
      onClick,
      onKeyDown,
      onBlur,
      ...props
    },
    ref,
  ) => {
    const listId = useId();
    const root = useRef<HTMLDivElement>(null);
    const list = useRef<HTMLUListElement>(null);
    const search = useRef({ text: '', time: 0 });
    const [internal, setInternal] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<number | undefined>();
    const selected = options.findIndex(
      (option) => option.value === (value ?? internal),
    );
    const enabled = options.flatMap((option, index) =>
      option.disabled ? [] : [index],
    );
    const expanded = open && !disabled && enabled.length > 0;
    const activeIndex =
      active !== undefined && enabled.includes(active) ? active : undefined;

    const close = () => {
      setOpen(false);
      setActive(undefined);
      search.current.text = '';
    };

    useEffect(() => {
      if (!expanded) return;
      const container = root.current;
      const scope = container?.getRootNode();
      const dismiss = (event: Event) => {
        if (container && !event.composedPath().includes(container)) close();
      };
      scope?.addEventListener('pointerdown', dismiss, true);
      return () => scope?.removeEventListener('pointerdown', dismiss, true);
    }, [expanded]);

    useEffect(() => {
      const menu = list.current;
      const item =
        activeIndex === undefined ? undefined : menu?.children[activeIndex];
      if (!expanded || !menu || !item) return;
      const visible = menu.getBoundingClientRect();
      const option = item.getBoundingClientRect();
      if (option.top < visible.top) menu.scrollTop -= visible.top - option.top;
      if (option.bottom > visible.bottom)
        menu.scrollTop += option.bottom - visible.bottom;
    }, [activeIndex, expanded]);

    useEffect(() => {
      const owner = root.current?.querySelector('button')?.form;
      const reset = () => {
        if (value === undefined) setInternal(defaultValue);
        close();
      };
      owner?.addEventListener('reset', reset);
      return () => owner?.removeEventListener('reset', reset);
    }, [defaultValue, form, value]);

    const initial = (last = false) =>
      enabled.includes(selected)
        ? selected
        : last
          ? enabled.at(-1)
          : enabled[0];

    const choose = (index: number | undefined) => {
      if (index === undefined || !enabled.includes(index)) return;
      const next = options[index].value;
      if (value === undefined) setInternal(next);
      if (index !== selected) onValueChange?.(next);
      close();
    };

    const handleKeys = (event: KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(event);
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        !enabled.length
      )
        return;

      const { key } = event;
      if (key === 'Escape' && expanded) {
        event.preventDefault();
        event.stopPropagation();
        close();
      } else if (
        key === 'ArrowDown' ||
        key === 'ArrowUp' ||
        key === 'Home' ||
        key === 'End'
      ) {
        event.preventDefault();
        const previous =
          activeIndex === undefined ? -1 : enabled.indexOf(activeIndex);
        const next =
          key === 'Home'
            ? enabled[0]
            : key === 'End'
              ? enabled.at(-1)
              : previous < 0
                ? initial(key === 'ArrowUp')
                : enabled[
                    Math.max(
                      0,
                      Math.min(
                        enabled.length - 1,
                        previous + (key === 'ArrowDown' ? 1 : -1),
                      ),
                    )
                  ];
        setActive(next);
        setOpen(true);
      } else if (key === 'Enter' || key === ' ') {
        event.preventDefault();
        if (expanded) choose(activeIndex);
        else {
          setActive(initial());
          setOpen(true);
        }
      } else if (key.length === 1) {
        const time = Date.now();
        const char = key.toLocaleLowerCase();
        const previous =
          time - search.current.time < 500 ? search.current.text : '';
        const text = previous + char;
        search.current = { text, time };
        const repeated = [...text].every((letter) => letter === char);
        const start = enabled.indexOf(activeIndex ?? selected);
        const first =
          repeated || previous === '' ? start + 1 : Math.max(0, start);
        const ordered = [...enabled.slice(first), ...enabled.slice(0, first)];
        const match = ordered.find((index) =>
          options[index].label
            .toLocaleLowerCase()
            .startsWith(repeated ? char : text),
        );
        if (match === undefined) return;
        event.preventDefault();
        setActive(match);
        setOpen(true);
      }
    };

    return (
      <div className="om-select-dropdown" ref={root}>
        <button
          {...props}
          ref={ref}
          type="button"
          role="combobox"
          form={form}
          disabled={disabled}
          aria-disabled={!enabled.length || undefined}
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={
            expanded && activeIndex !== undefined
              ? `${listId}-${activeIndex}`
              : undefined
          }
          className={cx('om-select', 'om-select-dropdown-trigger', className)}
          onKeyDown={handleKeys}
          onBlur={(event) => {
            onBlur?.(event);
            close();
          }}
          onClick={(event) => {
            onClick?.(event);
            if (event.defaultPrevented || !enabled.length) return;
            if (expanded) close();
            else {
              setActive(initial());
              setOpen(true);
            }
          }}
        >
          {options[selected]?.label ?? placeholder}
        </button>
        {name && selected !== -1 && (
          <input
            type="hidden"
            name={name}
            value={options[selected].value}
            disabled={disabled}
            form={form}
          />
        )}
        <ul
          id={listId}
          role="listbox"
          aria-label={props['aria-label'] ?? 'Options'}
          ref={list}
          hidden={!expanded}
        >
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={selected === index}
              aria-disabled={option.disabled || undefined}
              lang={option.lang}
              data-active={activeIndex === index || undefined}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    );
  },
);
SelectDropdown.displayName = 'SelectDropdown';

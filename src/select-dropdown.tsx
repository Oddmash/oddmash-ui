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

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
  lang?: string;
};

export type SelectProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'name' | 'role'
> & {
  options: readonly SelectOption[];
  name?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
};

export const Select = /* @__PURE__ */ forwardRef<
  HTMLButtonElement,
  SelectProps
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
    const [keyboardActive, setKeyboardActive] = useState(false);
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
      setKeyboardActive(false);
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
      const trigger = root.current?.querySelector('button');
      const view = menu?.ownerDocument.defaultView;
      if (!expanded || !menu || !trigger || !view) return;

      const preventScrollBleed = (event: WheelEvent) => {
        if (
          (event.deltaY < 0 && menu.scrollTop <= 0) ||
          (event.deltaY > 0 && menu.scrollTop + menu.clientHeight >= menu.scrollHeight - 1)
        ) event.preventDefault();
      };
      menu.addEventListener('wheel', preventScrollBleed, { passive: false });

      const viewport = view.visualViewport;
      const position = () => {
        const anchor = trigger.getBoundingClientRect();
        const top = viewport?.offsetTop ?? 0;
        const left = viewport?.offsetLeft ?? 0;
        const right = left + (viewport?.width ?? view.innerWidth);
        const bottom = top + (viewport?.height ?? view.innerHeight);
        if (anchor.bottom <= top || anchor.top >= bottom) {
          close();
          return;
        }
        const below = Math.max(0, bottom - anchor.bottom);
        const above = Math.max(0, anchor.top - top);
        const opensAbove = below < menu.scrollHeight && above > below;
        const width = Math.min(anchor.width, right - left);
        menu.dataset.placement = opensAbove ? 'above' : 'below';
        menu.style.setProperty('--om-select-anchor-left', `${Math.max(left, Math.min(anchor.left, right - width))}px`);
        menu.style.setProperty('--om-select-anchor-top', `${Math.max(top, anchor.bottom)}px`);
        menu.style.setProperty('--om-select-anchor-bottom', `${view.innerHeight - Math.min(anchor.top, bottom)}px`);
        menu.style.setProperty('--om-select-anchor-width', `${width}px`);
        menu.style.setProperty('--om-select-available', `${opensAbove ? above : below}px`);
      };
      let positioned = false;
      if (typeof menu.showPopover === 'function') {
        menu.setAttribute('popover', 'manual');
        try {
          menu.showPopover();
          positioned = true;
          menu.dataset.positioned = 'true';
          position();
        } catch {
          menu.removeAttribute('popover');
        }
      }
      const onScroll = (event: Event) => {
        if (event.target !== menu) position();
      };
      const resize = positioned && typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(position)
        : undefined;
      if (positioned) {
        view.addEventListener('resize', position);
        view.addEventListener('scroll', onScroll, true);
        viewport?.addEventListener('resize', position);
        viewport?.addEventListener('scroll', position);
        resize?.observe(trigger);
      }
      return () => {
        menu.removeEventListener('wheel', preventScrollBleed);
        if (!positioned) return;
        resize?.disconnect();
        view.removeEventListener('resize', position);
        view.removeEventListener('scroll', onScroll, true);
        viewport?.removeEventListener('resize', position);
        viewport?.removeEventListener('scroll', position);
        if (menu.matches(':popover-open')) menu.hidePopover();
        menu.removeAttribute('popover');
        delete menu.dataset.positioned;
        delete menu.dataset.placement;
      };
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
        setKeyboardActive(true);
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
          setKeyboardActive(true);
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
        setKeyboardActive(true);
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
              setKeyboardActive(false);
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
              data-keyboard-active={keyboardActive && activeIndex === index || undefined}
              onPointerMove={(event) => {
                if (option.disabled || event.pointerType === 'touch') return;
                setKeyboardActive(false);
                setActive(index);
              }}
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
Select.displayName = 'Select';

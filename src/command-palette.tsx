import { useCallback, useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog';
import { Input } from './input';

export type CommandPaletteItem = {
  id: string;
  label: string;
  keywords?: readonly string[];
  description?: string;
  group?: string;
  disabled?: boolean;
  onSelect: () => void;
};
export type CommandPaletteProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  searchLabel: string;
  emptyLabel: string;
  items: readonly CommandPaletteItem[];
  theme?: 'light' | 'dark';
  container?: HTMLElement | null;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  shortcut?: boolean;
  maxResults?: number;
  filter?: (item: CommandPaletteItem, query: string) => boolean;
};

const defaultFilter = (item: CommandPaletteItem, query: string) =>
  [item.label, item.description, item.group, ...(item.keywords ?? [])].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase());

export const CommandPalette = ({
  trigger, title, description, searchLabel, emptyLabel, items, theme, container,
  open: controlledOpen, defaultOpen = false, onOpenChange, shortcut = false, maxResults, filter = defaultFilter,
}: CommandPaletteProps) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const open = controlledOpen ?? internalOpen;
  const id = useId();

  const setOpen = useCallback((value: boolean) => {
    if (controlledOpen === undefined) setInternalOpen(value);
    onOpenChange?.(value);
    if (!value) {
      setQuery('');
      setActive(null);
    }
  }, [controlledOpen, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActive(null);
    }
  }, [open]);

  useEffect(() => {
    if (!shortcut) return;
    const owner = container?.ownerDocument ?? document;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.isComposing || event.repeat || event.altKey || event.shiftKey ||
          (!event.metaKey && !event.ctrlKey) || event.key.toLowerCase() !== 'k') return;
      event.preventDefault();
      if (!open) setOpen(true);
    };
    owner.addEventListener('keydown', onKeyDown);
    return () => owner.removeEventListener('keydown', onKeyDown);
  }, [container, open, setOpen, shortcut]);

  const groups = useMemo(() => {
    const matches = items.filter(item => filter(item, query.trim()));
    const limit = maxResults === undefined ? matches.length : Math.max(0, Math.floor(maxResults));
    const result = new Map<string | undefined, CommandPaletteItem[]>();
    for (const item of matches.slice(0, limit)) {
      const group = item.group || undefined;
      if (!result.has(group)) result.set(group, []);
      result.get(group)!.push(item);
    }
    return Array.from(result, ([label, entries]) => ({ label, entries }));
  }, [filter, items, maxResults, query]);
  const list = useMemo(() => groups.flatMap(group => group.entries), [groups]);
  const available = list.filter(item => !item.disabled);
  const selected = available.find(item => item.id === active) ?? available[0];
  const optionId = (item: CommandPaletteItem) => `${id}-${list.indexOf(item)}`;

  useEffect(() => {
    if (open && selected) {
      const owner = container?.ownerDocument ?? document;
      owner.getElementById(`${id}-${list.indexOf(selected)}`)?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [container, open, selected, id, list]);

  const select = (item: CommandPaletteItem) => {
    if (item.disabled) return;
    setOpen(false);
    item.onSelect();
  };

  const renderOption = (item: CommandPaletteItem) => (
    <div key={item.id} id={optionId(item)} role="option" aria-selected={selected?.id === item.id} aria-disabled={item.disabled || undefined}
      onPointerMove={() => { if (!item.disabled) setActive(item.id); }}
      onMouseDown={event => event.preventDefault()} onClick={() => select(item)}>
      <span className="om-command-label">{item.label}</span>
      {item.description && <span className="om-command-description">{item.description}</span>}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent theme={theme} container={container} className="om-command-palette">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <Input role="combobox" aria-label={searchLabel} aria-autocomplete="list" aria-expanded="true" aria-controls={id} aria-activedescendant={selected ? optionId(selected) : undefined}
          value={query} onChange={event => { setQuery(event.target.value); setActive(null); }} onKeyDown={event => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              if (!available.length) return;
              const index = selected ? available.indexOf(selected) : 0;
              setActive(available[(index + (event.key === 'ArrowDown' ? 1 : available.length - 1)) % available.length].id);
            } else if (event.key === 'Enter' && selected && !event.nativeEvent.isComposing) {
              event.preventDefault();
              select(selected);
            }
          }} />
        <div role="listbox" id={id} aria-label={title} className="om-command-list">
          {groups.map(group => group.label ? (
            <div role="group" aria-label={group.label} key={group.label} className="om-command-group">
              <div aria-hidden="true" className="om-command-group-label">{group.label}</div>
              {group.entries.map(renderOption)}
            </div>
          ) : group.entries.map(renderOption))}
        </div>
        {!list.length && <p role="status">{emptyLabel}</p>}
      </DialogContent>
    </Dialog>
  );
};

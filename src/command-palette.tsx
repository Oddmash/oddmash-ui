import { useEffect, useId, useState, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from './dialog';
import { Input } from './input';

export type CommandPaletteItem = { id: string; label: string; keywords?: readonly string[]; disabled?: boolean; onSelect: () => void };
export type CommandPaletteProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  searchLabel: string;
  emptyLabel: string;
  items: readonly CommandPaletteItem[];
  theme?: 'light' | 'dark';
  container?: HTMLElement | null;
};

export const CommandPalette = ({ trigger, title, description, searchLabel, emptyLabel, items, theme, container }: CommandPaletteProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<string | null>(null);
  const id = useId();
  const list = items.filter(item => [item.label, ...(item.keywords ?? [])].join(' ').toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const available = list.filter(item => !item.disabled);
  const selected = available.find(item => item.id === active) ?? available[0];
  useEffect(() => { if (open && selected) document.getElementById(`${id}-${list.indexOf(selected)}`)?.scrollIntoView?.({ block: 'nearest' }); }, [open, selected, id, list]);
  const select = (item: CommandPaletteItem) => {
    if (item.disabled) return;
    setOpen(false);
    setQuery('');
    setActive(null);
    item.onSelect();
  };
  return (
    <Dialog open={open} onOpenChange={value => { setOpen(value); if (!value) { setQuery(''); setActive(null); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent theme={theme} container={container} className="om-command-palette">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <Input role="combobox" aria-label={searchLabel} aria-autocomplete="list" aria-expanded="true" aria-controls={id} aria-activedescendant={selected ? `${id}-${list.indexOf(selected)}` : undefined} value={query} onChange={event => { setQuery(event.target.value); setActive(null); }} onKeyDown={event => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!available.length) return;
            const index = selected ? available.indexOf(selected) : 0;
            setActive(available[(index + (event.key === 'ArrowDown' ? 1 : available.length - 1)) % available.length].id);
          } else if (event.key === 'Enter' && selected && !event.nativeEvent.isComposing) { event.preventDefault(); select(selected); }
        }} />
        <div role="listbox" id={id} aria-label={title} className="om-command-list">
          {list.map((item, index) => <div key={item.id} id={`${id}-${index}`} role="option" aria-selected={selected?.id === item.id} aria-disabled={item.disabled || undefined} onPointerMove={() => { if (!item.disabled) setActive(item.id); }} onMouseDown={event => event.preventDefault()} onClick={() => select(item)}>{item.label}</div>)}
        </div>
        {!list.length && <p role="status">{emptyLabel}</p>}
      </DialogContent>
    </Dialog>
  );
};

import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { expect, it, vi } from 'vitest';
import { ToggleGroup, ToggleGroupItem } from '../src';

it('selects only one item and reports null when it is toggled off', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <ToggleGroup aria-label="View mode" type="single" defaultValue="grid" onValueChange={onValueChange}>
      <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
    </ToggleGroup>,
  );

  const grid = screen.getByRole('button', { name: 'Grid', pressed: true });
  const list = screen.getByRole('button', { name: 'List', pressed: false });
  await user.click(list);
  expect(onValueChange).toHaveBeenLastCalledWith('list');
  expect(grid).toHaveAttribute('aria-pressed', 'false');
  expect(list).toHaveAttribute('aria-pressed', 'true');

  await user.click(list);
  expect(onValueChange).toHaveBeenLastCalledWith(null);
  expect(list).toHaveAttribute('aria-pressed', 'false');
});

it('allows independent multiple selection and reports an empty array when cleared', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <ToggleGroup aria-label="Formatting" type="multiple" defaultValue={['bold']} onValueChange={onValueChange}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
    </ToggleGroup>,
  );

  const bold = screen.getByRole('button', { name: 'Bold', pressed: true });
  const italic = screen.getByRole('button', { name: 'Italic', pressed: false });
  await user.click(italic);
  expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
  expect(bold).toHaveAttribute('aria-pressed', 'true');
  expect(italic).toHaveAttribute('aria-pressed', 'true');

  await user.click(bold);
  expect(onValueChange).toHaveBeenLastCalledWith(['italic']);
  await user.click(italic);
  expect(onValueChange).toHaveBeenLastCalledWith([]);
});

it('reports controlled changes and displays the value supplied by the parent', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  const group = (value: string | null) => (
    <ToggleGroup type="single" value={value} onValueChange={onValueChange}>
      <ToggleGroupItem value="list">List</ToggleGroupItem>
    </ToggleGroup>
  );
  const { rerender } = render(group(null));
  const list = screen.getByRole('button', { name: 'List', pressed: false });
  await user.click(list);
  expect(onValueChange).toHaveBeenLastCalledWith('list');
  expect(list).toHaveAttribute('aria-pressed', 'false');

  rerender(group('list'));
  expect(list).toHaveAttribute('aria-pressed', 'true');
  await user.click(list);
  expect(onValueChange).toHaveBeenLastCalledWith(null);
  expect(list).toHaveAttribute('aria-pressed', 'true');
});

it('reports controlled multiple changes without mutating the parent value', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  const value = Object.freeze(['bold']);
  const group = (selection: readonly string[]) => (
    <ToggleGroup type="multiple" value={selection} onValueChange={onValueChange}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
    </ToggleGroup>
  );
  const { rerender } = render(group(value));
  const italic = screen.getByRole('button', { name: 'Italic', pressed: false });
  await user.click(italic);
  expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic']);
  expect(italic).toHaveAttribute('aria-pressed', 'false');
  rerender(group(['bold', 'italic']));
  expect(italic).toHaveAttribute('aria-pressed', 'true');
});

it('moves vertical focus without changing selection and skips disabled items', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <StrictMode>
      <button>Before</button>
      <ToggleGroup type="single" orientation="vertical" defaultValue="first" onValueChange={onValueChange}>
        <ToggleGroupItem value="first">First</ToggleGroupItem>
        <ToggleGroupItem value="second" disabled>Second</ToggleGroupItem>
        <ToggleGroupItem value="third">Third</ToggleGroupItem>
      </ToggleGroup>
      <button>After</button>
    </StrictMode>,
  );

  const first = screen.getByRole('button', { name: 'First', pressed: true });
  const third = screen.getByRole('button', { name: 'Third', pressed: false });
  await user.tab();
  await user.tab();
  expect(first).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  expect(first).toHaveFocus();
  await user.keyboard('{ArrowUp}');
  expect(third).toHaveFocus();
  await user.keyboard('{Home}{ArrowDown}');
  expect(third).toHaveFocus();
  expect(third).toHaveAttribute('tabindex', '0');
  expect(first).toHaveAttribute('tabindex', '-1');
  expect(onValueChange).not.toHaveBeenCalled();

  await user.tab();
  expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  await user.tab({ shift: true });
  expect(third).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onValueChange).toHaveBeenLastCalledWith('third');
});

it('removes disabled groups from the tab order and restores a tab stop after items change', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  const group = (disabled: boolean, showFirst: boolean) => (
    <ToggleGroup aria-label="Options" type="multiple" disabled={disabled} onValueChange={onValueChange}>
      <ToggleGroupItem value="hidden" hidden>Hidden</ToggleGroupItem>
      <ToggleGroupItem value="unavailable" aria-disabled="true">Unavailable</ToggleGroupItem>
      {showFirst && <ToggleGroupItem value="a">A</ToggleGroupItem>}
      <ToggleGroupItem value="b">B</ToggleGroupItem>
    </ToggleGroup>
  );
  const { rerender } = render(group(true, true));
  const container = screen.getByRole('group', { name: 'Options' });
  const b = within(container).getByRole('button', { name: 'B' });
  expect(container).toHaveAttribute('aria-disabled', 'true');
  expect(b).toBeDisabled();
  await user.click(b);
  expect(onValueChange).not.toHaveBeenCalled();

  rerender(group(false, true));
  const a = within(container).getByRole('button', { name: 'A' });
  await waitFor(() => expect(a).toHaveAttribute('tabindex', '0'));
  rerender(group(false, false));
  await waitFor(() => expect(b).toHaveAttribute('tabindex', '0'));
});

it('forwards native props, classes and refs for both elements', async () => {
  const user = userEvent.setup();
  const groupRef = createRef<HTMLDivElement>();
  const itemRef = createRef<HTMLButtonElement>();
  const onFocus = vi.fn();
  const onValueChange = vi.fn();
  const { unmount } = render(
    <ToggleGroup type="single" ref={groupRef} className="custom-group" aria-label="Appearance" onValueChange={onValueChange}>
      <ToggleGroupItem
        value="grid" ref={itemRef} className="custom-item" name="view" aria-label="Grid"
        onFocus={onFocus} onClick={event => event.preventDefault()}
      >
        <span aria-hidden="true">▦</span>
      </ToggleGroupItem>
    </ToggleGroup>,
  );

  const group = screen.getByRole('group', { name: 'Appearance' });
  const item = screen.getByRole('button', { name: 'Grid' });
  expect(groupRef.current).toBe(group);
  expect(itemRef.current).toBe(item);
  expect(group).toHaveClass('om-toggle-group', 'custom-group');
  expect(item).toHaveClass('om-toggle-group-item', 'custom-item');
  expect(item).toHaveAttribute('name', 'view');
  expect(item).toHaveAttribute('value', 'grid');
  expect(item).toHaveAttribute('type', 'button');
  await user.tab();
  expect(onFocus).toHaveBeenCalledOnce();
  await user.click(item);
  expect(onValueChange).not.toHaveBeenCalled();

  unmount();
  expect(groupRef.current).toBeNull();
  expect(itemRef.current).toBeNull();
});

it('hydrates the pressed state and establishes one tab stop', async () => {
  const component = (
    <ToggleGroup type="multiple" aria-label="Formatting" defaultValue={['bold']}>
      <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
      <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
    </ToggleGroup>
  );
  const container = document.createElement('div');
  container.innerHTML = renderToString(component);
  const bold = within(container).getByRole('button', { name: 'Bold', pressed: true });
  const italic = within(container).getByRole('button', { name: 'Italic', pressed: false });
  const onRecoverableError = vi.fn();
  let root!: ReturnType<typeof hydrateRoot>;
  try {
    await act(async () => { root = hydrateRoot(container, component, { onRecoverableError }); });
    expect(bold).toHaveAttribute('tabindex', '0');
    expect(italic).toHaveAttribute('tabindex', '-1');
    expect(onRecoverableError).not.toHaveBeenCalled();
  } finally {
    await act(async () => root?.unmount());
  }
});

it('can be entered with Tab after an initially hidden parent is revealed', async () => {
  const user = userEvent.setup();
  const group = (hidden: boolean) => (
    <>
      <button>Before</button>
      <div hidden={hidden}>
        <ToggleGroup type="single">
          <ToggleGroupItem value="grid">Grid</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </>
  );
  const { rerender } = render(group(true));
  await user.tab();
  expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  rerender(group(false));
  await user.tab();
  expect(screen.getByRole('button', { name: 'Grid' })).toHaveFocus();
});

it('reverses horizontal arrow navigation in RTL without changing selection', async () => {
  const user = userEvent.setup();
  const onValueChange = vi.fn();
  render(
    <ToggleGroup type="single" dir="rtl" style={{ direction: 'rtl' }} defaultValue="a" onValueChange={onValueChange}>
      <ToggleGroupItem value="a">A</ToggleGroupItem>
      <ToggleGroupItem value="b" disabled>B</ToggleGroupItem>
      <ToggleGroupItem value="c">C</ToggleGroupItem>
      <ToggleGroupItem value="d">D</ToggleGroupItem>
    </ToggleGroup>,
  );
  await user.tab();
  await user.keyboard('{ArrowLeft}');
  expect(screen.getByRole('button', { name: 'C' })).toHaveFocus();
  await user.keyboard('{ArrowRight}{ArrowRight}');
  expect(screen.getByRole('button', { name: 'D' })).toHaveFocus();
  expect(screen.getByRole('button', { name: 'A' })).toHaveAttribute('aria-pressed', 'true');
  expect(onValueChange).not.toHaveBeenCalled();
});

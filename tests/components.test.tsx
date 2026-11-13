import { createRef } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Button, Input, Card, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from '../src';

describe('native contracts', () => {
  it('forwards refs and attributes without accidentally submitting a form', async () => {
    const ref = createRef<HTMLButtonElement>();
    let submissions = 0;
    render(<form onSubmit={(event) => { event.preventDefault(); submissions++; }}><Button ref={ref}>Action</Button><Button type="submit">Submit</Button></form>);
    await userEvent.click(screen.getByText('Action'));
    expect(submissions).toBe(0);
    expect(ref.current).toBe(screen.getByText('Action'));
    await userEvent.click(screen.getByText('Submit'));
    expect(submissions).toBe(1);
  });
  it('keeps disabled controls inert and supports labelled invalid input', async () => {
    let clicks = 0;
    const ref = createRef<HTMLInputElement>();
    render(<><Button disabled onClick={() => clicks++}>Disabled</Button><label htmlFor="name">Name</label><Input ref={ref} id="name" aria-invalid="true" aria-describedby="error" /><p id="error">Required</p><Card data-testid="card" className="custom"><Badge tone="accent">Active</Badge></Card></>);
    await userEvent.click(screen.getByText('Disabled'));
    await userEvent.type(screen.getByLabelText('Name'), 'Oddmash');
    expect(clicks).toBe(0);
    expect(ref.current).toHaveValue('Oddmash');
    expect(ref.current).toHaveAccessibleDescription('Required');
    expect(screen.getByTestId('card')).toHaveClass('om-card', 'custom');
    expect(screen.getByText('Active')).toHaveClass('om-badge--accent');
  });
});
it('tabs support keyboard navigation and skip disabled triggers', async () => {
  render(<Tabs defaultValue="a"><TabsList aria-label="Views"><TabsTrigger value="a">A</TabsTrigger><TabsTrigger value="b" disabled>B</TabsTrigger><TabsTrigger value="c">C</TabsTrigger></TabsList><TabsContent value="a">Alpha</TabsContent><TabsContent value="c">Charlie</TabsContent></Tabs>);
  screen.getByRole('tab', { name: 'A' }).focus();
  await userEvent.keyboard('{ArrowRight}');
  await waitFor(() => expect(screen.getByRole('tab', { name: 'C' })).toHaveAttribute('aria-selected', 'true'));
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Charlie');
});
it('dialog is named, focuses its controls, escapes and restores trigger focus', async () => {
  render(<Dialog><DialogTrigger asChild><Button>Open</Button></DialogTrigger><DialogContent theme="dark"><DialogTitle>Settings</DialogTitle><DialogDescription>Local preferences</DialogDescription><label htmlFor="setting">Setting</label><Input id="setting" /><DialogClose asChild><Button>Done</Button></DialogClose></DialogContent></Dialog>);
  await userEvent.click(screen.getByText('Open'));
  expect(screen.getByRole('dialog')).toHaveAccessibleName('Settings');
  expect(screen.getByRole('dialog')).toHaveAccessibleDescription('Local preferences');
  expect(screen.getByLabelText('Setting')).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  expect(screen.getByText('Open')).toHaveFocus();
});
it('supports controlled dialog state and an explicit portal container', async () => {
  const portal = document.createElement('div');
  portal.dataset.omTheme = 'dark';
  document.body.append(portal);
  const changes: boolean[] = [];
  const view = render(<Dialog open onOpenChange={(open) => changes.push(open)}><DialogContent container={portal} className="custom-dialog"><DialogTitle>Controlled</DialogTitle><DialogDescription>Scoped content</DialogDescription><DialogClose asChild><Button>Close</Button></DialogClose></DialogContent></Dialog>);
  expect(portal).toContainElement(screen.getByRole('dialog'));
  expect(screen.getByRole('dialog')).toHaveClass('custom-dialog');
  await userEvent.click(screen.getByText('Close'));
  expect(changes).toEqual([false]);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  view.unmount();
  portal.remove();
});

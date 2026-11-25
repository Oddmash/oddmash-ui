import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { expect, it } from 'vitest';
import { Button, Input, Card, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, Toast, ToastViewport } from '../src';
import { DateSelect } from '../src';
it('hydrates the public components without recoverable errors', async () => {
  const App = () => <Card><Badge>Ready</Badge><Input aria-label="Name" /><Button>Save</Button><Tabs defaultValue="a"><TabsList aria-label="Views"><TabsTrigger value="a">A</TabsTrigger></TabsList><TabsContent value="a">Alpha</TabsContent></Tabs><Dialog><DialogTrigger>Open</DialogTrigger><DialogContent><DialogTitle>Title</DialogTitle><DialogDescription>Description</DialogDescription></DialogContent></Dialog><ToastViewport><Toast open={false} title="Saved" onDismiss={() => {}} /><Toast open title="Error" tone="error" onDismiss={() => {}} /></ToastViewport></Card>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(<App />);
  document.body.append(container);
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(container, <App />, { onRecoverableError: (error) => errors.push(error) }); });
  expect(errors).toEqual([]);
  await act(async () => root.unmount());
  container.remove();
});

it('hydrates empty and selected DateSelect values without time-dependent output', async () => {
  const App = () => <><DateSelect label="Start"/><DateSelect label="End" value="2024-02-29T23:59:59" /></>;
  const container = document.createElement('div');
  container.innerHTML = renderToString(<App />);
  document.body.append(container);
  const errors: unknown[] = [];
  let root: ReturnType<typeof hydrateRoot>;
  await act(async () => { root = hydrateRoot(container, <App />, { onRecoverableError: (error) => errors.push(error) }); });
  expect(errors).toEqual([]);
  await act(async () => root.unmount());
  container.remove();
});

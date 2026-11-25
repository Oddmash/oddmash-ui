import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { Select } from '@oddmash/ui';
import { expect, it } from 'vitest';
import { PreviewFrame } from '../demo/preview-frame';

it('moves the same live preview into and out of fullscreen without resetting input or focus', async () => {
  render(
    <PreviewFrame view="preview" onViewChange={() => {}}>
      <label>Project name <input defaultValue="Project" /></label>
    </PreviewFrame>,
  );
  const field = screen.getByRole('textbox', { name: 'Project name' });
  fireEvent.change(field, { target: { value: 'Edited project' } });
  fireEvent.click(screen.getByRole('button', { name: 'Expand preview' }));
  const dialog = await screen.findByRole('dialog', { name: 'Fullscreen preview' });
  expect(within(dialog).getByRole('textbox', { name: 'Project name' })).toBe(field);
  expect(field).toHaveValue('Edited project');
  const close = within(dialog).getByRole('button', { name: 'Exit fullscreen preview' });
  await waitFor(() => expect(close).toHaveFocus());
  fireEvent.pointerDown(field);
  field.focus();
  expect(dialog).toBeInTheDocument();
  fireEvent.click(close);
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Fullscreen preview' })).not.toBeInTheDocument());
  expect(screen.getByRole('textbox', { name: 'Project name' })).toBe(field);
  expect(field).toHaveValue('Edited project');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Expand preview' })).toHaveFocus());
});

it('dismisses a nested Select before closing the fullscreen preview on Escape', async () => {
  render(
    <PreviewFrame view="preview" onViewChange={() => {}}>
      <Select aria-label="Environment" defaultValue="staging" options={[{ value: 'staging', label: 'Staging' }, { value: 'production', label: 'Production' }]} />
    </PreviewFrame>,
  );
  fireEvent.click(screen.getByRole('button', { name: 'Expand preview' }));
  const dialog = await screen.findByRole('dialog', { name: 'Fullscreen preview' });
  await waitFor(() => expect(within(dialog).getByRole('button', { name: 'Exit fullscreen preview' })).toHaveFocus());
  const select = within(dialog).getByRole('combobox', { name: 'Environment' });
  select.focus();
  fireEvent.keyDown(select, { key: 'Enter' });
  expect(select).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(select, { key: 'Escape' });
  expect(select).toHaveAttribute('aria-expanded', 'false');
  expect(dialog).toBeInTheDocument();
  fireEvent.keyDown(select, { key: 'Escape' });
  await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Fullscreen preview' })).not.toBeInTheDocument());
});

import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import {
  Avatar,
  AlertDialog,
  Checkbox,
  Field,
  Radio,
  Select,
  Switch,
  Textarea,
  Toast,
  ToastViewport,
} from '../src';

it('preserves independent toast live regions and dismissal inside a viewport', async () => {
  const user = userEvent.setup();
  let dismissed = 0;
  render(
    <ToastViewport>
      <Toast open title="Saved" onDismiss={() => dismissed++} />
      <Toast open title="Failed" tone="danger" onDismiss={() => dismissed++} />
      <Toast open={false} title="Hidden" onDismiss={() => dismissed++} />
    </ToastViewport>,
  );
  expect(screen.getAllByRole('status')[0]).toHaveTextContent('Saved');
  expect(screen.getByRole('alert')).toHaveTextContent('Failed');
  expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
  const dismiss = screen.getAllByRole('button', { name: 'Dismiss notification' });
  expect(dismiss).toHaveLength(2);
  await user.click(dismiss[0]);
  expect(dismissed).toBe(1);
});

it('requires explicit acknowledgment in the alert dialog', async () => {
  const user = userEvent.setup();
  let confirmed = 0;
  const view = render(<AlertDialog open title="Notice" onConfirm={() => confirmed++}>Check connection.</AlertDialog>);
  expect(screen.getByRole('alertdialog', { name: 'Notice' })).toHaveTextContent('Check connection.');
  await user.keyboard('{Escape}');
  expect(screen.getByRole('alertdialog')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'OK' }));
  expect(confirmed).toBe(1);
  view.rerender(<AlertDialog open={false} title="Notice" onConfirm={() => confirmed++}>Check connection.</AlertDialog>);
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
});

it('supports rich alert dialog descriptions without nesting block elements in a paragraph', () => {
  render(
    <AlertDialog open title="Notice" onConfirm={() => {}}>
      <section><p>Check connection.</p></section>
    </AlertDialog>,
  );
  const dialog = screen.getByRole('alertdialog', { name: 'Notice' });
  const description = document.getElementById(dialog.getAttribute('aria-describedby') ?? '');
  expect(description?.tagName).toBe('DIV');
  expect(description).toContainElement(screen.getByText('Check connection.'));
  expect(dialog).toHaveAccessibleDescription('Check connection.');
});

it('keeps form values, refs, and disabled fieldset behavior native', async () => {
  const user = userEvent.setup();
  const ref = createRef<HTMLTextAreaElement>();
  let values: Record<string, FormDataEntryValue> = {};
  render(
    <form
      onSubmit={(event) => {
        event.preventDefault();
        values = Object.fromEntries(new FormData(event.currentTarget));
      }}
    >
      <label>
        Notes <Textarea ref={ref} name="notes" />
      </label>
      <label>
        Environment{' '}
        <Select name="environment" defaultValue="staging">
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </Select>
      </label>
      <label>
        <Checkbox name="focus" value="on" /> Focus
      </label>
      <label>
        <Switch name="capture" value="on" /> Capture
      </label>
      <Field legend="Order">
        <label>
          <Radio name="order" value="newest" defaultChecked /> Newest
        </label>
        <label>
          <Radio name="order" value="oldest" /> Oldest
        </label>
      </Field>
      <Field legend="Unavailable" disabled>
        <label>
          <Checkbox name="ignored" defaultChecked /> Ignored
        </label>
      </Field>
      <button type="submit">Submit</button>
    </form>,
  );

  await user.type(screen.getByLabelText('Notes'), 'Ready');
  expect(ref.current).toHaveValue('Ready');
  await user.selectOptions(screen.getByLabelText('Environment'), 'production');
  await user.click(screen.getByRole('checkbox', { name: 'Focus' }));
  await user.click(screen.getByRole('switch', { name: 'Capture' }));
  await user.click(screen.getByRole('radio', { name: 'Oldest' }));
  expect(screen.getByRole('checkbox', { name: 'Ignored' })).toBeDisabled();
  await user.click(screen.getByRole('button', { name: 'Submit' }));
  expect(values).toEqual({
    notes: 'Ready',
    environment: 'production',
    focus: 'on',
    capture: 'on',
    order: 'oldest',
  });
});

it('shows initials during image load and when the image source fails', () => {
  const view = render(
    <Avatar src="/first.png" label="Project owner">
      PO
    </Avatar>,
  );
  const avatar = screen.getByRole('img', { name: 'Project owner' });
  const image = () => avatar.querySelector('img')!;
  expect(avatar).toHaveTextContent('PO');
  expect(image()).not.toBeVisible();
  fireEvent.load(image());
  expect(image()).toBeVisible();
  view.rerender(
    <Avatar src="/second.png" label="Project owner">
      PO
    </Avatar>,
  );
  expect(image()).not.toBeVisible();
  fireEvent.error(image());
  expect(image()).not.toBeVisible();
  expect(avatar).toHaveTextContent('PO');
});

it('uses status live region for neutral notifications and alert for danger notifications', () => {
  const view = render(
    <Toast open title="Changes saved" onDismiss={() => {}}>
      Your settings are up to date.
    </Toast>,
  );

  const statusRegion = screen.getByRole('status');
  expect(statusRegion).toHaveAttribute('aria-atomic', 'true');
  expect(statusRegion).toHaveTextContent('Changes saved');
  expect(statusRegion).toHaveTextContent('Your settings are up to date.');
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();

  view.rerender(
    <Toast open tone="danger" title="Save failed" onDismiss={() => {}}>
      Please check your network connection.
    </Toast>,
  );

  const alertRegion = screen.getByRole('alert');
  expect(alertRegion).toHaveAttribute('aria-atomic', 'true');
  expect(alertRegion).toHaveTextContent('Save failed');
  expect(alertRegion).toHaveTextContent('Please check your network connection.');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

it('does not expose message content or a dismiss button when closed', () => {
  render(
    <Toast open={false} title="Hidden notice" onDismiss={() => {}}>
      This detail should not be rendered.
    </Toast>,
  );

  const statusRegion = screen.getByRole('status');
  expect(statusRegion).toBeEmptyDOMElement();
  expect(screen.queryByText('Hidden notice')).not.toBeInTheDocument();
  expect(
    screen.queryByText('This detail should not be rendered.'),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: /dismiss/i }),
  ).not.toBeInTheDocument();
});

it('exposes the dismiss button accessible name and activates once via keyboard', async () => {
  const user = userEvent.setup();
  const onDismissEnter = vi.fn();

  const view = render(
    <Toast open title="Export ready" onDismiss={onDismissEnter} />,
  );

  const defaultButton = screen.getByRole('button', {
    name: 'Dismiss notification',
  });
  defaultButton.focus();
  expect(defaultButton).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onDismissEnter).toHaveBeenCalledTimes(1);

  const onDismissSpace = vi.fn();
  view.rerender(
    <Toast
      open
      title="Export ready"
      dismissLabel="Close export alert"
      onDismiss={onDismissSpace}
    />,
  );

  const customButton = screen.getByRole('button', {
    name: 'Close export alert',
  });
  customButton.focus();
  expect(customButton).toHaveFocus();
  await user.keyboard(' ');
  expect(onDismissSpace).toHaveBeenCalledTimes(1);
});

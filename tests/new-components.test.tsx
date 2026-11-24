import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
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

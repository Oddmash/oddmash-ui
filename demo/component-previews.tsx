import {
  Accordion,
  Alert,
  Avatar,
  Breadcrumbs,
  Button,
  Checkbox,
  EmptyState,
  Field,
  Pagination,
  Progress,
  Radio,
  SelectDropdown,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Table,
  Textarea,
} from '@oddmash/ui';
import type { ExtendedComponentId } from './component-catalog';
import type { ReactNode } from 'react';

export const componentPreviews: Record<ExtendedComponentId, ReactNode> = {
  textarea: (
    <label>
      Release notes
      <Textarea rows={3} placeholder="Describe what changed" />
    </label>
  ),
  select: (
    <div>
      <label htmlFor="example-environment">Environment</label>
      <SelectDropdown
        id="example-environment"
        defaultValue="staging"
        options={[
          { value: 'staging', label: 'Staging' },
          { value: 'preview', label: 'Preview', disabled: true },
          { value: 'production', label: 'Production' },
        ]}
      />
    </div>
  ),
  checkbox: (
    <label className="example-choice">
      <Checkbox name="events" value="keyboard" defaultChecked /> Capture
      keyboard events
    </label>
  ),
  radio: (
    <Field legend="Event order">
      <div className="example-primitives">
        <label className="example-choice">
          <Radio name="order" value="newest" defaultChecked /> Newest first
        </label>
        <label className="example-choice">
          <Radio name="order" value="oldest" /> Oldest first
        </label>
      </div>
    </Field>
  ),
  switch: (
    <label className="example-choice">
      <Switch defaultChecked /> Capture interactions
    </label>
  ),
  field: (
    <Field legend="Events to capture">
      <div className="example-primitives">
        <label className="example-choice">
          <Checkbox name="events" value="focus" defaultChecked /> Focus
        </label>
        <label className="example-choice">
          <Checkbox name="events" value="pointer" /> Pointer
        </label>
      </div>
    </Field>
  ),
  alert: (
    <Alert tone="danger">
      <strong>Recording stopped</strong>
      <div>Reconnect the inspector to continue capturing events.</div>
    </Alert>
  ),
  progress: (
    <label>
      Exporting events (65%)
      <Progress value={65} max={100} />
    </label>
  ),
  spinner: (
    <div className="example-choice" role="status">
      <Spinner /> Connecting to inspector
    </div>
  ),
  skeleton: (
    <div className="example-primitives" role="status">
      <span>Loading event details</span>
      <Skeleton style={{ width: '60%' }} />
      <Skeleton />
      <Skeleton style={{ width: '80%' }} />
    </div>
  ),
  'empty-state': (
    <EmptyState>
      <strong>No events captured</strong>
      <p>Interact with the page to start filling the timeline.</p>
      <Button
        variant="secondary"
        onClick={() => (location.hash = '/interaction-pattern')}
      >
        Open Interaction Lab
      </Button>
    </EmptyState>
  ),
  accordion: (
    <Accordion summary="Keyboard shortcuts">
      Press <kbd>Tab</kbd> to move to the next control and <kbd>Enter</kbd> to
      activate it.
    </Accordion>
  ),
  breadcrumbs: (
    <Breadcrumbs aria-label="Example breadcrumb">
      <li>
        <a href="#/overview">Overview</a>
      </li>
      <li>
        <a href="#/colors">Foundations</a>
      </li>
      <li>
        <span aria-current="page">Colors</span>
      </li>
    </Breadcrumbs>
  ),
  pagination: (
    <Pagination aria-label="Example pagination">
      <a href="#/breadcrumbs" aria-label="Page 1">
        1
      </a>
      <span aria-current="page">2</span>
      <a href="#/table" aria-label="Page 3">
        3
      </a>
    </Pagination>
  ),
  avatar: (
    <div className="example-choice">
      <Avatar label="Sangmin Park">SP</Avatar>
      <Avatar label="Design team">DT</Avatar>
    </div>
  ),
  separator: (
    <div>
      <strong>Recording settings</strong>
      <Separator />
      <span>Export options</span>
    </div>
  ),
  table: (
    <Table>
      <caption>Recorded events</caption>
      <thead>
        <tr>
          <th scope="col">Event</th>
          <th scope="col">Target</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>focusin</td>
          <td>Project name</td>
        </tr>
        <tr>
          <td>click</td>
          <td>Save project</td>
        </tr>
      </tbody>
    </Table>
  ),
};

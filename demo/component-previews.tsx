import {
  AlertPreview,
  BreadcrumbPreview,
  LoadingPreview,
  ToastPreview,
} from './feedback-previews';
import {
  Accordion,
  Avatar,
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

export const getComponentPreviews = (
  t: (text: string) => string,
): Record<ExtendedComponentId, ReactNode> => ({
  textarea: (
    <label>
      {t('Release notes')}
      <Textarea rows={3} placeholder={t('Describe what changed')} />
    </label>
  ),
  select: (
    <div>
      <label htmlFor="example-environment">{t('Environment')}</label>
      <SelectDropdown
        id="example-environment"
        defaultValue="staging"
        options={[
          { value: 'staging', label: t('Staging') },
          { value: 'preview', label: t('Preview'), disabled: true },
          { value: 'production', label: t('Production') },
        ]}
      />
    </div>
  ),
  checkbox: (
    <label className="example-choice">
      <Checkbox name="events" value="keyboard" defaultChecked />{' '}
      {t('Capture keyboard events')}
    </label>
  ),
  radio: (
    <Field legend={t('Event order')}>
      <div className="example-primitives">
        <label className="example-choice">
          <Radio name="order" value="newest" defaultChecked />{' '}
          {t('Newest first')}
        </label>
        <label className="example-choice">
          <Radio name="order" value="oldest" /> {t('Oldest first')}
        </label>
      </div>
    </Field>
  ),
  switch: (
    <label className="example-choice">
      <Switch defaultChecked /> {t('Capture interactions')}
    </label>
  ),
  field: (
    <Field legend={t('Events to capture')}>
      <div className="example-primitives">
        <label className="example-choice">
          <Checkbox name="events" value="focus" defaultChecked /> {t('Focus')}
        </label>
        <label className="example-choice">
          <Checkbox name="events" value="pointer" /> {t('Pointer')}
        </label>
      </div>
    </Field>
  ),
  alert: <AlertPreview />,
  toast: <ToastPreview />,
  progress: (
    <LoadingPreview>
      <label>
        {t('Exporting events (65%)')}
        <Progress value={65} max={100} />
      </label>
    </LoadingPreview>
  ),
  spinner: (
    <LoadingPreview>
      <div className="example-choice" role="status">
        <Spinner /> {t('Connecting to inspector')}
      </div>
    </LoadingPreview>
  ),
  skeleton: (
    <LoadingPreview>
      <div className="example-primitives" role="status">
        <span>{t('Loading event details')}</span>
        <Skeleton style={{ width: '60%' }} />
        <Skeleton />
        <Skeleton style={{ width: '80%' }} />
      </div>
    </LoadingPreview>
  ),
  'empty-state': (
    <EmptyState>
      <strong>{t('No events captured')}</strong>
      <p>{t('Interact with the page to start filling the timeline.')}</p>
      <Button
        variant="secondary"
        onClick={() => (location.hash = '/interaction-pattern')}
      >
        {t('Open Interaction Lab')}
      </Button>
    </EmptyState>
  ),
  accordion: (
    <Accordion summary={t('Keyboard shortcuts')}>
      {t('Press')} <kbd>Tab</kbd> {t('to move to the next control and')}{' '}
      <kbd>Enter</kbd> {t('to activate it.')}
    </Accordion>
  ),
  breadcrumbs: <BreadcrumbPreview />,
  pagination: (
    <Pagination aria-label={t('Example pagination')}>
      <a href="#/breadcrumbs" aria-label={t('Page 1')}>
        1
      </a>
      <span aria-current="page">2</span>
      <a href="#/table" aria-label={t('Page 3')}>
        3
      </a>
    </Pagination>
  ),
  avatar: (
    <div className="example-choice">
      <Avatar label="Sangmin Park">SP</Avatar>
      <Avatar label={t('Design team')}>DT</Avatar>
    </div>
  ),
  separator: (
    <div>
      <strong>{t('Recording settings')}</strong>
      <Separator />
      <span>{t('Export options')}</span>
    </div>
  ),
  table: (
    <Table>
      <caption>{t('Recorded events')}</caption>
      <thead>
        <tr>
          <th scope="col">{t('Event')}</th>
          <th scope="col">{t('Target')}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>focusin</td>
          <td>{t('Project name')}</td>
        </tr>
        <tr>
          <td>click</td>
          <td>{t('Save project')}</td>
        </tr>
      </tbody>
    </Table>
  ),
});

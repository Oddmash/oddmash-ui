import { ClipboardButtonPreview, ToastProviderPreview } from './notification-previews';
import {
  AlertPreview,
  BreadcrumbPreview,
  LoadingPreview,
  PaginationPreview,
  ToastPreview,
} from './feedback-previews';
import {
  Accordion,
  LinkCard,
  ButtonLink,
  IconButton,
  IconLink,
  PlatformLink,
  PlatformLinks,
  Kbd,
  CodeBlock,
  CodeBlockHeader,
  CodeBlockCaption,
  CodeBlockContent,
  CodeBlockCopy,
  SiteHeader,
  SiteHeaderInner,
  SiteFooter,
  SiteFooterInner,
  SiteNav,
  Prose,
  ProseScroll,
  Avatar,
  Button,
  CommandPalette,
  Slider,
  Checkbox,
  EmptyState,
  Field,
  Progress,
  Radio,
  Select,
  Separator,
  Skeleton,
  Spinner,
  Switch,
  Table,
  Textarea,
} from '@oddmash/ui';
import type { ExtendedComponentId } from './component-catalog';
import { useState, type ReactNode } from 'react';

const CodeBlockPreview = ({ t }: { t: (text: string) => string }) => {
  const code = 'pnpm add @oddmash/ui';
  const [status, setStatus] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('Copied');
    } catch {
      setStatus('Select the code to copy');
    }
  };

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockCaption>{t('Terminal')}</CodeBlockCaption>
        <CodeBlockCopy onClick={copy}>{t('Copy code')}</CodeBlockCopy>
      </CodeBlockHeader>
      <CodeBlockContent tabIndex={0} role="region" aria-label={t('Terminal code')}>
        <code>{code}</code>
      </CodeBlockContent>
      <span role="status">{t(status)}</span>
    </CodeBlock>
  );
};

export const getComponentPreviews = (
  t: (text: string) => string,
): Record<ExtendedComponentId, ReactNode> => ({
  'clipboard-button': <ClipboardButtonPreview t={t} />,
  'toast-provider': <ToastProviderPreview t={t} />,
  "link-controls": (
    <>
      <ButtonLink href="#/link-controls">{t('Read guide')}</ButtonLink>
      <IconButton aria-label={t('Open search example')}><span aria-hidden="true">⌕</span></IconButton>
      <IconLink href="#/link-controls" aria-label={t('Open reference example')}><span aria-hidden="true">↗</span></IconLink>
      <PlatformLinks role="group" aria-label={t('Platform links')}>
        <PlatformLink platform="github" href="#/link-controls" aria-label={t('GitHub example')} />
        <PlatformLink platform="npm" href="#/link-controls" aria-label={t('npm example')} />
      </PlatformLinks>
      <Kbd>Ctrl K</Kbd>
    </>
  ),
  'link-card': (
    <LinkCard href="#/link-card">
      <strong>{t('Usage guide')}</strong> <span className="om-link-card-arrow" aria-hidden="true">→</span>
      <p>{t('Learn how to use the library.')}</p>
    </LinkCard>
  ),
  'code-block': <CodeBlockPreview t={t} />,
  'site-layout': (
    <>
      <SiteHeader>
        <SiteHeaderInner>
          <strong>Oddmash</strong>
          <SiteNav aria-label={t('Header navigation example')}>
            <a href="#/site-layout" aria-current="page">{t('Docs')}</a>
            <a href="#/site-layout">{t('Examples')}</a>
          </SiteNav>
        </SiteHeaderInner>
      </SiteHeader>
      <SiteFooter>
        <SiteFooterInner>
          <span>{t('Open source')}</span>
          <SiteNav aria-label={t('Footer navigation example')}>
            <a href="#/site-layout">{t('Docs')}</a>
          </SiteNav>
        </SiteFooterInner>
      </SiteFooter>
    </>
  ),
  prose: (
    <Prose>
      <h3>{t('Usage guide')}</h3>
      <p>{t('Learn how to use the library.')}</p>
      <ul><li>{t('Install the package.')}</li></ul>
      <pre tabIndex={0} role="region" aria-label={t('Terminal code')}><code>pnpm add @oddmash/ui</code></pre>
      <ProseScroll tabIndex={0} role="region" aria-label={t('Example options table')}>
        <table>
          <thead><tr><th scope="col">{t('Name')}</th><th scope="col">{t('Type')}</th></tr></thead>
          <tbody><tr><td>href</td><td>string</td></tr></tbody>
        </table>
      </ProseScroll>
    </Prose>
  ),
  slider: <label>{t('Width')} <Slider min={100} max={600} defaultValue={320} /></label>,
  'command-palette': <CommandPalette trigger={<Button>{t('Commands')}</Button>} title={t('Commands')} description={t('Choose an action')} searchLabel={t('Search commands')} emptyLabel={t('No commands found')} shortcut items={[{ id: 'save', label: t('Save project'), group: t('Project'), description: t('Save current changes'), onSelect: () => {} }, { id: 'guide', label: t('Usage guide'), group: t('Documentation'), onSelect: () => {} }]} />,
  textarea: (
    <label>
      {t('Release notes')}
      <Textarea rows={3} placeholder={t('Describe what changed')} />
    </label>
  ),
  select: (
    <div>
      <label htmlFor="example-environment">{t('Environment')}</label>
      <Select
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
  pagination: <PaginationPreview />,
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

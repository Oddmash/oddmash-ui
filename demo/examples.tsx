import { useLocale } from './locale';
import { useState, type ReactNode } from 'react';
import {
  Button,
  Input,
  Select,
  Card,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  type ButtonProps,
} from '@oddmash/ui';
import { details, type ComponentId } from './content';
import { getComponentPreviews } from './component-previews';
import type { ExtendedComponentId } from './component-catalog';

export const Arrow = () => <span aria-hidden="true">↗</span>;
export const Code = ({
  children,
  label = 'Example.tsx',
}: {
  children: string;
  label?: string;
}) => {
  const { t } = useLocale();
  const [status, setStatus] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setStatus('Copied');
    } catch {
      setStatus('Select the code to copy');
    }
  };
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>{label}</span>
        <button onClick={copy}>{t('Copy code')}</button>
      </div>
      <pre tabIndex={0} role="region" aria-label={`${label} ${t('code')}`}>
        <code>{children}</code>
      </pre>
      <span className="copy-status" role="status">
        {t(status)}
      </span>
    </div>
  );
};
export const Preview = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => <div className={`preview ${className}`}>{children}</div>;
export const Example = ({ id }: { id: ComponentId }) => {
  const { t } = useLocale();
  const componentPreviews = getComponentPreviews(t);
  const [name, setName] = useState('Interaction Inspector');
  const [draftName, setDraftName] = useState(name);
  const [open, setOpen] = useState(false);
  if (Object.hasOwn(componentPreviews, id)) {
    return (
      <div className="example-primitives">
        {componentPreviews[id as ExtendedComponentId]}
      </div>
    );
  }
  if (id === 'button')
    return (
      <div className="example-stack">
        <div className="button-row">
          <Button>
            {t('Create project')} <Arrow />
          </Button>
          <Button variant="secondary">
            {t('Cancel')}
          </Button>
          <Button variant="ghost">
            {t('Learn more')}
          </Button>
        </div>
      </div>
    );
  if (id === 'input')
    return (
      <div className="field-example">
        <label htmlFor="example-project">{t('Project name')}</label>
        <Input
          id="example-project"
          placeholder={t('Your next idea')}
          aria-describedby="project-hint"
        />
        <p id="project-hint">{t('Use a short, memorable name.')}</p>
        <label htmlFor="example-error">{t('Repository URL')}</label>
        <Input
          id="example-error"
          defaultValue="not-a-url"
          aria-invalid="true"
          aria-describedby="repo-error"
        />
        <p id="repo-error" className="error-text">
          {t('Enter a valid repository URL.')}
        </p>
      </div>
    );
  if (id === 'card')
    return (
      <Card className="project-card">
        <div className="project-card-top">
          <span className="project-icon" aria-hidden="true">
            ⌘
          </span>
          <Badge tone="accent">{t('Active')}</Badge>
        </div>
        <h3>Interaction Inspector</h3>
        <p>{t('A clearer view of every interaction.')}</p>
        <span className="project-card-updated">{t('Updated just now')}</span>
      </Card>
    );
  if (id === 'badge')
    return (
      <div className="example-stack">
        <div className="button-row">
          <Badge tone="accent">
            <span className="status-dot" />
            {t('Active')}
          </Badge>
          <Badge>{t('Draft')}</Badge>
          <Badge>v0.3.0</Badge>
        </div>
        <p className="muted">{t('A little context. No extra noise.')}</p>
      </div>
    );
  if (id === 'tabs')
    return (
      <Tabs defaultValue="activity" className="tabs-example">
        <TabsList aria-label={t('Project views')}>
          <TabsTrigger value="activity">{t('Activity')}</TabsTrigger>
          <TabsTrigger value="settings">{t('Settings')}</TabsTrigger>
          <TabsTrigger value="members" disabled>
            {t('Members')}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <div className="activity-item">
            <span className="status-dot" />
            <div>
              <strong>{t('Project created')}</strong>
              <p>{t('Ready for your next idea.')}</p>
            </div>
            <span>{t('Just now')}</span>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <label htmlFor="tab-project">{t('Project name')}</label>
          <Input id="tab-project" defaultValue="Interaction Inspector" />
        </TabsContent>
      </Tabs>
    );
  return (
    <div className="example-stack">
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setDraftName(name);
          setOpen(nextOpen);
        }}
      >
        <DialogTrigger asChild>
          <Button variant="secondary">
            {t('Edit project')} <Arrow />
          </Button>
        </DialogTrigger>
        <DialogContent className="docs-dialog">
          <DialogTitle>{t('Project settings')}</DialogTitle>
          <DialogDescription>
            {t('Give your project a name.')}
          </DialogDescription>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!draftName.trim()) return;
              setName(draftName.trim());
              setOpen(false);
            }}
          >
            <label htmlFor="dialog-name">{t('Project name')}</label>
            <Input
              id="dialog-name"
              value={draftName}
              required
              onChange={(event) => setDraftName(event.target.value)}
            />
            <div className="dialog-actions">
              <DialogClose asChild>
                <Button variant="secondary">{t('Cancel')}</Button>
              </DialogClose>
              <Button type="submit">{t('Save changes')}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export const ComponentPage = ({ id }: { id: ComponentId }) => {
  const { t } = useLocale();
  const [variant, setVariant] =
    useState<NonNullable<ButtonProps['variant']>>('primary');
  const [size, setSize] = useState<NonNullable<ButtonProps['size']>>('md');
  const [disabled, setDisabled] = useState(false);
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const info = details[id];
  const buttonCode = `<Button variant="${variant}" size="${size}"${disabled ? ' disabled' : ''}>\n  Create project\n</Button>`;
  const code = info.code || buttonCode;
  const exports =
    info.exports ??
    (id === 'tabs'
      ? 'Tabs, TabsList, TabsTrigger, TabsContent'
      : id === 'dialog'
        ? 'Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Button, Input'
        : id === 'card'
          ? 'Card, Badge'
          : id[0].toUpperCase() + id.slice(1));
  const reactImport = info.reactImports
    ? `import { ${info.reactImports.join(', ')} } from 'react';\n`
    : '';
  return (
    <>
      <section className="doc-section" aria-labelledby="playground-heading">
        <div className="section-title">
          <h2 id="playground-heading">{t('Playground')}</h2>
        </div>
        <div className="playground">
          <div className="playground-toolbar">
            <div className="view-switch">
              <button
                aria-pressed={view === 'preview'}
                onClick={() => setView('preview')}
              >
                {t('Preview')}
              </button>
              <button
                aria-pressed={view === 'code'}
                onClick={() => setView('code')}
              >
                {t('Code')}
              </button>
            </div>
          </div>
          {view === 'preview' ? (
            <Preview>
              {id === 'button' ? (
                <div className="example-stack">
                  <Button
                    variant={variant}
                    size={size}
                    disabled={disabled}
                  >
                    {t('Create project')} <Arrow />
                  </Button>
                </div>
              ) : (
                <Example id={id} />
              )}
            </Preview>
          ) : (
            <Code>{`${reactImport}import { ${exports} } from '@oddmash/ui';\nimport '@oddmash/ui/styles.css';\n\n${code}`}</Code>
          )}
          {id === 'button' && (
            <div className="playground-controls">
              <div className="playground-control">
                <label htmlFor="button-variant">{t('Variant')}</label>
                <Select
                  id="button-variant"
                  value={variant}
                  options={[
                    { value: 'primary', label: 'primary' },
                    { value: 'secondary', label: 'secondary' },
                    { value: 'ghost', label: 'ghost' },
                  ]}
                  onValueChange={(value) => setVariant(value as typeof variant)}
                />
              </div>
              <div className="playground-control">
                <label htmlFor="button-size">{t('Size')}</label>
                <Select
                  id="button-size"
                  value={size}
                  options={[
                    { value: 'md', label: 'md' },
                    { value: 'sm', label: 'sm' },
                  ]}
                  onValueChange={(value) => setSize(value as typeof size)}
                />
              </div>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(event) => setDisabled(event.target.checked)}
                />
                {t('Disabled')}
              </label>
            </div>
          )}
        </div>
      </section>
      <section className="doc-section" id="usage">
        <h2>{t('Usage')}</h2>
        <p className="body-copy">{t(info.usage)}</p>
      </section>
      <section className="doc-section" id="api">
        <h2>{t('API reference')}</h2>
        <p className="body-copy">
          {t(
            id === 'dialog'
              ? 'Dialog controls state. Put native attributes, className, style, and refs on DialogContent or the other rendered parts.'
              : 'Native attributes, className, style, and refs pass through to the underlying element.',
          )}
        </p>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label={t('API reference table')}
        >
          <table>
            <thead>
              <tr>
                <th>{t('Prop')}</th>
                <th>{t('Type')}</th>
                <th>{t('Default')}</th>
              </tr>
            </thead>
            <tbody>
              {info.props.map(([name, type, value]) => (
                <tr key={name}>
                  <td>
                    <code>{name}</code>
                  </td>
                  <td>{type}</td>
                  <td>
                    <code>{value}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="doc-section" id="accessibility">
        <h2>{t('Accessibility')}</h2>
        <p className="body-copy">{t(info.accessibility)}</p>
      </section>
    </>
  );
};

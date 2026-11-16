import { useState, type ReactNode } from 'react';
import {
  Button,
  Input,
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

export const Arrow = () => <span aria-hidden="true">↗</span>;
export const Mark = () => (
  <span className="brand-mark" aria-hidden="true">
    <i />
    <i />
    <i />
    <i />
  </span>
);
export const Code = ({
  children,
  label = 'Example.tsx',
}: {
  children: string;
  label?: string;
}) => {
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
        <button onClick={copy}>Copy code</button>
      </div>
      <pre tabIndex={0} role="region" aria-label={`${label} code`}>
        <code>{children}</code>
      </pre>
      <span className="copy-status" role="status">
        {status}
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
  const [notice, setNotice] = useState('');
  const [name, setName] = useState('Interaction Inspector');
  const [open, setOpen] = useState(false);
  if (id === 'button')
    return (
      <div className="example-stack">
        <div className="button-row">
          <Button onClick={() => setNotice('Primary action triggered')}>
            Create project <Arrow />
          </Button>
          <Button
            variant="secondary"
            onClick={() => setNotice('Secondary action triggered')}
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            onClick={() => setNotice('Ghost action triggered')}
          >
            Learn more
          </Button>
        </div>
        <span className="example-feedback" role="status">
          {notice}
        </span>
      </div>
    );
  if (id === 'input')
    return (
      <div className="field-example">
        <label htmlFor="example-project">Project name</label>
        <Input
          id="example-project"
          placeholder="Your next idea"
          aria-describedby="project-hint"
        />
        <p id="project-hint">Use a short, memorable name.</p>
        <label htmlFor="example-error">Repository URL</label>
        <Input
          id="example-error"
          defaultValue="not-a-url"
          aria-invalid="true"
          aria-describedby="repo-error"
        />
        <p id="repo-error" className="error-text">
          Enter a valid repository URL.
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
          <Badge tone="accent">Active</Badge>
        </div>
        <h3>Interaction Inspector</h3>
        <p>A clearer view of every interaction.</p>
        <div className="project-card-bottom">
          <span>Updated just now</span>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setNotice('This is a local preview project.')}
          >
            Open project <Arrow />
          </Button>
        </div>
        <span role="status" className="example-feedback">
          {notice}
        </span>
      </Card>
    );
  if (id === 'badge')
    return (
      <div className="example-stack">
        <div className="button-row">
          <Badge tone="accent">
            <span className="status-dot" />
            Active
          </Badge>
          <Badge>Draft</Badge>
          <Badge>v0.1.0</Badge>
        </div>
        <p className="muted">A little context. No extra noise.</p>
      </div>
    );
  if (id === 'tabs')
    return (
      <Tabs defaultValue="activity" className="tabs-example">
        <TabsList aria-label="Project views">
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="members" disabled>
            Members
          </TabsTrigger>
        </TabsList>
        <TabsContent value="activity">
          <div className="activity-item">
            <span className="status-dot" />
            <div>
              <strong>Project created</strong>
              <p>Ready for your next idea.</p>
            </div>
            <span>Just now</span>
          </div>
        </TabsContent>
        <TabsContent value="settings">
          <label htmlFor="tab-project">Project name</label>
          <Input id="tab-project" defaultValue="Interaction Inspector" />
        </TabsContent>
      </Tabs>
    );
  return (
    <div className="example-stack">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary">
            Edit project <Arrow />
          </Button>
        </DialogTrigger>
        <DialogContent className="docs-dialog">
          <div className="dialog-eyebrow">PROJECT / SETTINGS</div>
          <DialogTitle>Make it yours.</DialogTitle>
          <DialogDescription>
            A good name is a good place to start.
          </DialogDescription>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!name.trim()) return;
              setNotice(`Saved: ${name.trim()}`);
              setOpen(false);
            }}
          >
            <label htmlFor="dialog-name">Project name</label>
            <Input
              id="dialog-name"
              value={name}
              required
              onChange={(event) => setName(event.target.value)}
            />
            <div className="dialog-actions">
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <span className="example-feedback" role="status">
        {notice}
      </span>
    </div>
  );
};
export const ComponentPage = ({ id }: { id: ComponentId }) => {
  const [variant, setVariant] =
    useState<NonNullable<ButtonProps['variant']>>('primary');
  const [size, setSize] = useState<NonNullable<ButtonProps['size']>>('md');
  const [disabled, setDisabled] = useState(false);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState<'preview' | 'code'>('preview');
  const info = details[id];
  const buttonCode = `<Button variant="${variant}" size="${size}"${disabled ? ' disabled' : ''}>\n  Create project\n</Button>`;
  const code = info.code || buttonCode;
  const exports =
    id === 'tabs'
      ? 'Tabs, TabsList, TabsTrigger, TabsContent'
      : id === 'dialog'
        ? 'Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose, Button, Input'
        : id === 'card'
          ? 'Card, Badge, Button'
          : id[0].toUpperCase() + id.slice(1);
  return (
    <>
      <section className="doc-section" aria-labelledby="playground-heading">
        <div className="section-title">
          <h2 id="playground-heading">Playground</h2>
          <span className="section-caption">REAL COMPONENTS. LIVE PROPS.</span>
        </div>
        <div className="playground">
          <div className="playground-toolbar">
            <div className="view-switch">
              <button
                aria-pressed={view === 'preview'}
                onClick={() => setView('preview')}
              >
                Preview
              </button>
              <button
                aria-pressed={view === 'code'}
                onClick={() => setView('code')}
              >
                Code
              </button>
            </div>
            <span className="live-label">
              <span className="status-dot" />
              Interactive
            </span>
          </div>
          {view === 'preview' ? (
            <Preview>
              {id === 'button' ? (
                <div className="example-stack">
                  <Button
                    variant={variant}
                    size={size}
                    disabled={disabled}
                    onClick={() => setNotice('Project action triggered')}
                  >
                    Create project <Arrow />
                  </Button>
                  <span role="status" className="example-feedback">
                    {notice}
                  </span>
                </div>
              ) : (
                <Example id={id} />
              )}
            </Preview>
          ) : (
            <Code>{`import { ${exports} } from '@oddmash/ui';\n\n${code}`}</Code>
          )}
          {id === 'button' && (
            <div className="playground-controls">
              <label>
                Variant
                <select
                  aria-label="Variant"
                  value={variant}
                  onChange={(event) =>
                    setVariant(event.target.value as typeof variant)
                  }
                >
                  <option>primary</option>
                  <option>secondary</option>
                  <option>ghost</option>
                </select>
              </label>
              <label>
                Size
                <select
                  aria-label="Size"
                  value={size}
                  onChange={(event) =>
                    setSize(event.target.value as typeof size)
                  }
                >
                  <option>md</option>
                  <option>sm</option>
                </select>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={disabled}
                  onChange={(event) => setDisabled(event.target.checked)}
                />
                Disabled
              </label>
            </div>
          )}
        </div>
      </section>
      <section className="doc-section" id="usage">
        <h2>Usage</h2>
        <p className="body-copy">{info.usage}</p>
        <Code>{`import { ${exports} } from '@oddmash/ui';\nimport '@oddmash/ui/styles.css';\n\n${code}`}</Code>
      </section>
      <section className="doc-section" id="api">
        <h2>API reference</h2>
        <p className="body-copy">
          {id === 'dialog'
            ? 'Dialog controls state. Put native attributes, className, style, and refs on DialogContent or the other rendered parts.'
            : 'Native attributes, className, style, and refs pass through to the underlying element.'}
        </p>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="API reference table"
        >
          <table>
            <thead>
              <tr>
                <th>Prop</th>
                <th>Type</th>
                <th>Default</th>
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
      <section className="accessibility-note" id="accessibility">
        <span aria-hidden="true">◎</span>
        <div>
          <h2>Built for everyone</h2>
          <p>{info.accessibility}</p>
        </div>
      </section>
    </>
  );
};

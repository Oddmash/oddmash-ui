import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, ButtonLink } from '@oddmash/ui/button';
import { ClipboardButton } from '@oddmash/ui/clipboard-button';
import { Input } from '@oddmash/ui/input';
import { PlatformLink } from '@oddmash/ui/platform-link';
import '@oddmash/ui/styles.css';
import { ActionSheet, AdaptiveDialog, BottomNavigation, BottomSheet, PullToRefresh, SwipeAction } from '../src/index.js';
import '../src/styles.css';
import './demo.css';
import theme from './design-tokens.json' with { type: 'json' };

for (const [name, value] of Object.entries(theme)) {
  document.documentElement.style.setProperty(`--mobile-${name}`, value);
}

const filterExample = `import { useRef, useState } from 'react';
import { BottomSheet } from '@oddmash/mobile-interactions/bottom-sheet';
import '@oddmash/mobile-interactions/styles.css';

export function FilterExample() {
  const trigger = useRef(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button ref={trigger} onClick={() => setOpen(true)}>
        Open filters
      </button>
      <BottomSheet
        title="Filters"
        open={open}
        onOpenChange={setOpen}
        returnFocusRef={trigger}
        snapPoints={[0.5, 0.9]}
      >
        <label>Search <input /></label>
        <button onClick={() => setOpen(false)}>Apply</button>
      </BottomSheet>
    </>
  );
}`;

const adaptiveExample = `import { useState } from 'react';
import { AdaptiveDialog } from '@oddmash/mobile-interactions/adaptive-dialog';
import '@oddmash/mobile-interactions/styles.css';

export function ProfileExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Edit profile</button>
      <AdaptiveDialog title="Edit profile" open={open}
        onOpenChange={setOpen} breakpoint={640}>
        <label>Name <input defaultValue="Alex" /></label>
        <button onClick={() => setOpen(false)}>Done</button>
      </AdaptiveDialog>
    </>
  );
}`;

const swipeExample = `import { useEffect, useRef, useState } from 'react';
import { SwipeAction } from '@oddmash/mobile-interactions/swipe-action';
import '@oddmash/mobile-interactions/styles.css';

export function InboxRow() {
  const [archived, setArchived] = useState(false);
  const confirmation = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (archived) confirmation.current?.focus();
  }, [archived]);

  return archived ? <p ref={confirmation} tabIndex={-1}>Message archived.</p> : (
    <SwipeAction direction="left"
      actions={<button type="button" onClick={() => setArchived(true)}>Archive</button>}>
      Project update
    </SwipeAction>
  );
}`;

const refreshExample = `import { useState } from 'react';
import { PullToRefresh } from '@oddmash/mobile-interactions/pull-to-refresh';
import '@oddmash/mobile-interactions/styles.css';

export function InboxExample() {
  const [revision, setRevision] = useState(0);
  async function refresh() {
    // Await your application's reload here.
    setRevision((previous) => previous + 1);
  }

  return (
    <PullToRefresh onRefresh={refresh} threshold={64}>
      <p>Revision {revision}</p>
    </PullToRefresh>
  );
}`;

const repository = 'https://github.com/Oddmash/oddmash-mobile';
const buildCommands = 'git clone https://github.com/Oddmash/oddmash-mobile.git\ncd oddmash-mobile\npnpm install --frozen-lockfile\npnpm build\npnpm pack';
const installCommand = 'pnpm add /path/to/oddmash-mobile-interactions-0.1.0-alpha.0.tgz';
const copyLabels = { idle: 'Copy', pending: 'Copying…', copied: 'Copied', error: 'Copy failed' };
const actionChoices = [
  { id: 'remove', label: 'Remove saved copy', destructive: true },
  { id: 'duplicate', label: 'Duplicate report' },
  { id: 'share', label: 'Share report', disabled: true },
];
const navigationItems = [
  { id: 'inbox', href: '#navigation-inbox', label: 'Inbox' },
  { id: 'projects', href: '#navigation-projects', label: 'Projects' },
  { id: 'account', href: '#navigation-account', label: 'Account' },
];
const componentIndex = [
  ['bottom-sheet', 'Bottom Sheet', 'Resizable overlays'],
  ['adaptive-dialog', 'Adaptive Dialog', 'Responsive forms'],
  ['swipe-action', 'Swipe Action', 'List-row controls'],
  ['pull-to-refresh', 'Pull to Refresh', 'Async list reload'],
  ['action-sheet', 'Action Sheet', 'Contextual choices'],
  ['bottom-navigation', 'Bottom Navigation', 'App destinations'],
];

const App = () => {
  const sheetTrigger = useRef<HTMLButtonElement>(null);
  const dialogTrigger = useRef<HTMLButtonElement>(null);
  const [sheet, setSheet] = useState(false);
  const [dialog, setDialog] = useState(false);
  const actionTrigger = useRef<HTMLButtonElement>(null);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState('');
  const [activeDestination, setActiveDestination] = useState('inbox');
  useEffect(() => {
    const update = () => {
      const match = navigationItems.find(({ href }) => href === window.location.hash);
      setActiveDestination(match?.id ?? 'inbox');
    };
    update();
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const [archived, setArchived] = useState(false);
  const inboxRow = useRef<HTMLDivElement>(null);
  const restoreInboxFocus = useRef(false);
  useEffect(() => {
    if (archived || !restoreInboxFocus.current) return;
    restoreInboxFocus.current = false;
    inboxRow.current?.querySelector<HTMLButtonElement>('button[aria-expanded]')?.focus();
  }, [archived]);
  const [revision, setRevision] = useState(0);

  return <>
    <header className="masthead">
      <div className="shell masthead-inner">
        <a className="wordmark" href="#main">Oddmash <strong>Mobile</strong></a>
        <nav aria-label="Main navigation">
          <a href="#quickstart">Quickstart</a>
          <a href="#components">Components</a>
          <a href="./guide/">Docs</a>
          <PlatformLink platform="github" href={repository} aria-label="Oddmash Mobile on GitHub" />
        </nav>
      </div>
    </header>

    <main id="main" className="shell">
      <section className="hero" aria-labelledby="page-title">
        <div className="hero-copy">
          <h1 id="page-title">Mobile interactions for React.</h1>
          <p className="hero-description">Six primitives for gestures, overlays, and navigation in your existing React app.</p>
          <div className="hero-actions">
            <ButtonLink href="#quickstart">Get started</ButtonLink>
            <a href="#components">Explore components <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-support">Source alpha <span aria-hidden="true">/</span> React 18 and 19</p>
        </div>

        <section className="inbox-stage" id="inbox-preview" aria-labelledby="inbox-title">
          <div className="stage-title"><span>Live example</span><span>Swipe Action</span></div>
          <div className="inbox">
            <header className="inbox-header">
              <h2 id="inbox-title">Inbox</h2>
              <p>Swipe the first row left or select Show actions.</p>
            </header>
            <div className="inbox-row highlighted" ref={inboxRow}>
              {archived ? (
                <div className="archive-state">
                  <span>Message archived</span>
                  <Button type="button" autoFocus onClick={() => {
                    restoreInboxFocus.current = true;
                    setArchived(false);
                  }}>Restore message</Button>
                </div>
              ) : (
                <SwipeAction actions={<Button type="button" onClick={() => setArchived(true)}>Archive</Button>}>
                  <div><strong>Project update</strong><span>Sam Rivera</span></div>
                </SwipeAction>
              )}
            </div>
            <div className="inbox-row"><strong>Design review</strong><span>Alex Chen</span></div>
            <div className="inbox-row"><strong>Release notes</strong><span>Jamie Park</span></div>
          </div>
          <a className="stage-link" href="./guide/swipe-action/">Use Swipe Action in your app <span aria-hidden="true">↗</span></a>
        </section>
      </section>

      <nav className="component-index" aria-label="Try a component">
        <ul>
          {componentIndex.map(([id, name, description]) => (
            <li key={id}><a href={`#${id}`}><strong>{name}</strong><span>{description}</span></a></li>
          ))}
        </ul>
      </nav>

      <section id="quickstart" className="major-section quickstart" aria-labelledby="quickstart-title">
        <div className="section-intro">
          <h2 id="quickstart-title">Quickstart</h2>
          <p>Build the alpha tarball from the source and add it to your React project.</p>
          <a href="./guide/quickstart/">Read the full setup guide</a>
        </div>
        <div className="quickstart-steps">
          <section aria-labelledby="installation">
            <h3 id="installation">Build and install</h3>
            <p>Use Node.js 24 and pnpm 11.25.0 to build from source.</p>
            <div className="code-panel">
              <div className="code-toolbar"><span>Package checkout</span><ClipboardButton text={buildCommands} labels={copyLabels} size="sm" variant="ghost" aria-label="Copy build commands" /></div>
              <pre><code>{buildCommands}</code></pre>
            </div>
            <p>Replace the path below with the tarball path printed by <code>pnpm pack</code>.</p>
            <div className="code-panel">
              <div className="code-toolbar"><span>Your React app</span><ClipboardButton text={installCommand} labels={copyLabels} size="sm" variant="ghost" aria-label="Copy install command" /></div>
              <pre><code>{installCommand}</code></pre>
            </div>
          </section>
          <section aria-labelledby="first-example">
            <h3 id="first-example">Render a Bottom Sheet</h3>
            <p>Save this example as <code>FilterExample.jsx</code>, then render <code>&lt;FilterExample /&gt;</code> in your app.</p>
            <div className="code-panel">
              <div className="code-toolbar"><span>FilterExample.jsx</span><ClipboardButton text={filterExample} labels={copyLabels} size="sm" variant="ghost" aria-label="Copy Bottom Sheet example" /></div>
              <pre className="example-code" tabIndex={0} role="region" aria-label="Bottom Sheet example code"><code>{filterExample}</code></pre>
            </div>
            <p>Use <code>onOpenChange</code> to keep visibility in sync and <code>returnFocusRef</code> to restore focus. In Next.js App Router, add <code>'use client'</code> to the example. Import the stylesheet to apply the sheet layout.</p>
          </section>
        </div>
      </section>

      <section id="components" className="major-section" aria-labelledby="components-title">
        <div className="section-intro">
          <h2 id="components-title">Components</h2>
          <p>Try each interaction, then check the options for using it in your app.</p>
          <a href="./guide/native-parity/">Native behavior and browser support</a>
        </div>
        <div className="component-list">
          <section id="bottom-sheet" className="component-row" aria-labelledby="bottom-sheet-title">
            <div><h3 id="bottom-sheet-title">Bottom Sheet</h3><p>Let users adjust product filters and return to the catalog. Tap, drag, or use the arrow keys on the sheet handle.</p></div>
            <div className="component-example">
              <Button ref={sheetTrigger} onClick={() => setSheet(true)}>Open filters</Button>
              <BottomSheet title="Filters" open={sheet} onOpenChange={setSheet} returnFocusRef={sheetTrigger}>
                <label>Search <Input placeholder="Search products" /></label>
                <p>Choose filters without leaving the page.</p>
                <Button onClick={() => setSheet(false)}>Apply filters</Button>
              </BottomSheet>
              <a href="./guide/bottom-sheet/">Bottom Sheet reference</a>
            </div>
          </section>
          <section id="adaptive-dialog" className="component-row" aria-labelledby="adaptive-title">
            <div><h3 id="adaptive-title">Adaptive Dialog</h3><p>Edit a profile in a sheet on a narrow screen or in a centered dialog on a wide screen.</p></div>
            <div className="component-example">
              <Button ref={dialogTrigger} onClick={() => setDialog(true)}>Edit profile</Button>
              <AdaptiveDialog title="Edit profile" open={dialog} onOpenChange={setDialog} returnFocusRef={dialogTrigger}>
                <label>Name <Input defaultValue="Alex" /></label>
                <Button onClick={() => setDialog(false)}>Done</Button>
              </AdaptiveDialog>
              <details><summary>AdaptiveDialog example and options</summary><p>Pass a title and control visibility with open and onOpenChange. The default presentation adapts at breakpoint.</p><pre className="example-code" tabIndex={0} role="region" aria-label="Adaptive Dialog example code"><code>{adaptiveExample}</code></pre></details>
              <a href="./guide/adaptive-dialog/">Adaptive Dialog reference</a>
            </div>
          </section>
          <section id="swipe-action" className="component-row" aria-labelledby="swipe-title">
            <div><h3 id="swipe-title">Swipe Action</h3><p>Reveal message actions within the row. Use the disclosure button to reach the same actions by keyboard.</p></div>
            <div className="component-example">
              <ButtonLink href="#inbox-preview" variant="secondary">Try the inbox example</ButtonLink>
              <details><summary>SwipeAction example and options</summary><p>Pass the row through children and its controls through actions. Set direction to choose the reveal edge.</p><pre className="example-code" tabIndex={0} role="region" aria-label="Swipe Action example code"><code>{swipeExample}</code></pre></details>
              <a href="./guide/swipe-action/">Swipe Action reference</a>
            </div>
          </section>
          <section id="pull-to-refresh" className="component-row" aria-labelledby="refresh-title">
            <div><h3 id="refresh-title">Pull to Refresh</h3><p>Reload a list with a pull or a button, with feedback while the request runs.</p></div>
            <div className="component-example">
              <PullToRefresh onRefresh={async () => {
                await new Promise<void>((resolve) => setTimeout(resolve, 300));
                setRevision((value) => value + 1);
              }}><p>Revision {revision}</p></PullToRefresh>
              <details><summary>PullToRefresh example and options</summary><p>Return a promise from onRefresh so busy and failure states reflect your request. Threshold sets the pull distance in pixels.</p><pre className="example-code" tabIndex={0} role="region" aria-label="Pull to Refresh example code"><code>{refreshExample}</code></pre></details>
              <a href="./guide/pull-to-refresh/">Pull to Refresh reference</a>
            </div>
          </section>
          <section id="action-sheet" className="component-row" aria-labelledby="action-sheet-title">
            <div><h3 id="action-sheet-title">Action Sheet</h3><p>Offer a short list of related choices and an explicit way to cancel.</p></div>
            <div className="component-example">
              <Button ref={actionTrigger} onClick={() => setActionsOpen(true)}>Open report actions</Button>
              <ActionSheet
                title="Report actions"
                description="Choose an action for the weekly report."
                open={actionsOpen}
                onOpenChange={setActionsOpen}
                actions={actionChoices}
                onSelect={(id) => setSelectedAction(id === 'remove' ? 'Saved copy removed' : 'Report duplicated')}
                returnFocusRef={actionTrigger}
              />
              <output>{selectedAction}</output>
              <a href="./guide/action-sheet/">Action Sheet reference</a>
            </div>
          </section>
          <section id="bottom-navigation" className="component-row" aria-labelledby="bottom-navigation-title">
            <div><h3 id="bottom-navigation-title">Bottom Navigation</h3><p>Use real links for top-level destinations and mark the current page.</p></div>
            <div className="component-example navigation-example">
              <div className="navigation-example-screen">
                <span id="navigation-inbox" /><span id="navigation-projects" /><span id="navigation-account" />
                <p>{navigationItems.find(({id}) => id === activeDestination)?.label}</p>
              </div>
              <BottomNavigation label="Example app destinations" items={navigationItems} activeId={activeDestination} />
              <a href="./guide/bottom-navigation/">Bottom Navigation reference</a>
            </div>
          </section>
        </div>
      </section>
      <section className="support-band" aria-labelledby="support-title">
        <div><h2 id="support-title">Check before you ship</h2><p>See the verified browser coverage and the remaining device checks for this source alpha.</p></div>
        <a href="./guide/support/">Support and limitations</a>
        <a href="./guide/composition/">Composition recipes</a>
      </section>
    </main>

    <footer className="shell footer">
      <span>Oddmash Mobile</span>
      <a href="./guide/">Documentation</a>
    </footer>
  </>;
};

createRoot(document.getElementById('root')!).render(<App />);

import { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BottomSheet, PullToRefresh, SwipeAction } from '../../../src/index.js';
import '../../../src/styles.css';

const Controls = () => {
  const [open, setOpen] = useState(false);
  const [singleOpen, setSingleOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [allowClose, setAllowClose] = useState(false);
  const [closeRequests, setCloseRequests] = useState(0);
  const [refreshDisabled, setRefreshDisabled] = useState(false);
  const [refreshRequests, setRefreshRequests] = useState(0);
  const resolveRefresh = useRef<(() => void) | null>(null);
  return <>
    <button type="button" onClick={() => setOpen(true)}>Open compact sheet</button>
    <BottomSheet title="Compact sheet" open={open} onOpenChange={setOpen} snapPoints={[0.05]} dismissible={false}>
      <button type="button" onClick={() => setOpen(false)}>Finish</button>
    </BottomSheet>
    <button type="button" onClick={() => setSingleOpen(true)}>Open single-point sheet</button>
    <BottomSheet title="Single-point sheet" open={singleOpen} onOpenChange={setSingleOpen} snapPoints={[0.5]}>
      <p>Single snap point content</p>
    </BottomSheet>
    <button type="button" onClick={() => setDialogOpen(true)}>Open tall dialog</button>
    <BottomSheet title="Tall dialog" open={dialogOpen} presentation="dialog" onOpenChange={(next) => {
      setCloseRequests((count) => count + 1);
      if (allowClose) setDialogOpen(next);
    }}>
      <label><input type="checkbox" checked={allowClose} onChange={(event) => setAllowClose(event.currentTarget.checked)} /> Allow close</label>
      <output>Close requests: {closeRequests}</output>
      <div style={{ height: 900 }} />
      <form method="dialog"><button type="submit" value="finished">Complete tall dialog</button></form>
    </BottomSheet>
    <SwipeAction direction="right" actions={<button type="button">Archive item</button>}>
      <label><input type="checkbox" /> Right-swipe item</label>
    </SwipeAction>
    <section aria-label="Refresh fixture">
      <button type="button" onClick={() => setRefreshDisabled((value) => !value)}>{refreshDisabled ? 'Resume refresh' : 'Pause refresh'}</button>
      <button type="button" onClick={() => resolveRefresh.current?.()}>Finish request</button>
      <p>Refresh requests: {refreshRequests}</p>
      <PullToRefresh disabled={refreshDisabled} onRefresh={() => new Promise((resolve) => {
        setRefreshRequests((count) => count + 1);
        resolveRefresh.current = resolve;
      })}>
        <p>Refreshable content</p>
        <button type="button" aria-disabled="true">Unavailable content action</button>
      </PullToRefresh>
    </section>
  </>;
};

createRoot(document.getElementById('root')!).render(<Controls />);

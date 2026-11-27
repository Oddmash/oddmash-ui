# Composition recipes

The host app owns the data, routes, and confirmed actions. Compose the primitives at the boundaries where users open an overlay, reveal an action, refresh content, or move to another page.

## Protect an unsaved form

Use [Adaptive Dialog](components/adaptive-dialog.md) with controlled `open`. A close request can set a confirmation state while leaving the dialog open. If the person confirms, set `open` to false. If you set `dismissible={false}`, add an explicit completion or cancel button in the dialog itself. Keep the trigger mounted and pass `returnFocusRef`. Test a change in viewport width while a draft is present and Escape while the form is open.

## Coordinate an inbox

Keep a single row ID in app state and pass the derived controlled `open` to each [Swipe Action](components/swipe-action.md). Wrap the list in [Pull to Refresh](components/pull-to-refresh.md) when the same data should refresh in place. If deleting or archiving removes a focused row, move focus to a surviving row or an undo control. On refresh failure, preserve the current list and allow retry.

```jsx
import { useState } from 'react';
import { SwipeAction } from '@oddmash/mobile-interactions/swipe-action';
import { PullToRefresh } from '@oddmash/mobile-interactions/pull-to-refresh';
import '@oddmash/mobile-interactions/styles.css';

export function Inbox({ messages, reload, archive }) {
  const [openRow, setOpenRow] = useState(null);
  return (
    <PullToRefresh onRefresh={reload}>
      <ul>
        {messages.map(({ id, title }) => (
          <li key={id}>
            <SwipeAction
              open={openRow === id}
              onOpenChange={(open) => setOpenRow(
                (previous) => open ? id : previous === id ? null : previous,
              )}
              actions={<button onClick={() => archive(id)}>Archive</button>}
            >
              {title}
            </SwipeAction>
          </li>
        ))}
      </ul>
    </PullToRefresh>
  );
}
```

Return a promise from `reload` and reject it if the request fails. The package exposes status feedback and prevents duplicate requests while the promise is pending.

## Keep navigation out of the scroll surface

Put [Bottom Navigation](components/bottom-navigation.md) in its own grid row below the scrollable app content. Supply `activeId` from the actual router location, and keep real `href` values so modifier-click and browser history remain available. The component reference includes the shell layout CSS.

## Verify the integrated result

Check keyboard operation, touch cancellation, 320 CSS px reflow, enlarged labels, reduced motion, and return focus after a modal closes. On a real device, also check the software keyboard, viewport safe areas, OS back gestures, and the installed-PWA behavior your app supports. Use the [verification notes](alpha-verification.md) to reproduce the published evidence.

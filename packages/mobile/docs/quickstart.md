# Quickstart

Build the source alpha, install it in an existing React 18 or 19 app, and render a filter sheet. Building the source requires Node.js 24 and pnpm 11.25.0.

## Build the package

```sh
git clone https://github.com/Oddmash/oddmash-mobile.git
cd oddmash-mobile
pnpm install --frozen-lockfile
pnpm build
pnpm pack
```

Copy the absolute path of the tarball that pnpm prints. From your React app directory, substitute that path below.

```sh
pnpm add /absolute/path/to/oddmash-mobile-interactions-0.1.0-alpha.0.tgz
```

Commit your app's package manifest and lockfile when you need to reproduce the same installation. Keep the tarball available to any environment that installs from that local path.

## Render a filter sheet

Save the following file as `FilterExample.jsx` and render `<FilterExample />` inside your app.

```jsx
import { useRef, useState } from 'react';
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
}
```

Open the sheet, type in Search, then select Apply. The sheet closes and focus returns to Open filters. Drag or tap the handle to change between the two detents. With the handle focused, the arrow keys and Home or End also resize it.

## Next.js App Router

Put `'use client'` on the first line of your application component when it uses state or event handlers as above. Keep server data fetching in the server component and pass serializable values into the client component. Import the library stylesheet once at a location permitted by your app's framework configuration.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| A local tarball fails to install in CI | Make that tarball available in CI or build it from the same reviewed commit. Update the local path if it moved. |
| The dialog opens with browser-default layout | Check that `@oddmash/mobile-interactions/styles.css` is imported and generated in the consumer build. |
| The sheet opens but does not close | In controlled mode, update `open` from `onOpenChange`. |
| Closing fails to restore focus | Keep the trigger mounted and pass its ref as `returnFocusRef`. |
| A gesture competes with browser scrolling | Try the explicit button or handle and review [native behavior](native-interaction-parity.md). |

Continue to the [Bottom Sheet reference](components/bottom-sheet.md) or [composition recipes](composition.md).

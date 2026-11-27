# Bottom Sheet

Use a resizable modal panel for a task such as filtering a list or editing a short form. For a complete runnable integration, see the [Quickstart](../quickstart.md).

```tsx
import { BottomSheet } from '@oddmash/mobile-interactions/bottom-sheet';
import '@oddmash/mobile-interactions/styles.css';

<BottomSheet title="Filters" open={open} onOpenChange={setOpen} snapPoints={[0.4, 0.85]}>
  <button type="button" onClick={() => setOpen(false)}>Apply</button>
</BottomSheet>
```

## Props

| Prop | Type and default | Behavior |
| --- | --- | --- |
| `title`, `children` | Required string and React node | Label the dialog and render its contents. |
| `open`, `onOpenChange` | Optional boolean and callback | Control visibility. Apply the requested value or keep the current state. |
| `defaultOpen` | Boolean, `false` | Initial visibility in uncontrolled mode. |
| `snapPoints` | Readonly number array, `[0.5, 0.9]` | Fractions of the usable visual viewport from above zero to one. Values must be finite. The component sorts and removes duplicates. |
| `snapPoint`, `onSnapPointChange` | Optional number and callback | Control the active detent. An unmatched value displays at the nearest available detent. |
| `defaultSnapPoint` | Number, first normalized detent | Initial detent in uncontrolled mode. |
| `dismissible` | Boolean, `true` | Allow close button, Escape, backdrop and eligible downward handle dismissal. |
| `presentation` | `'sheet' \| 'dialog'`, `'sheet'` | Set a bottom sheet or centered modal explicitly. |
| `returnFocusRef` | Optional element ref | Supply the trigger when the browser does not focus it on pointer activation. |

## Interaction and constraints

Tap the handle to cycle through detents. Arrow Up, Arrow Down, Home and End resize a multi-detent sheet. A single-detent dismissible sheet has a dismiss handle. The panel can impose a minimum content height at very small detents. Scrolling remains available within the sheet body. Start drag-to-resize on the handle.

Use `dismissible={false}` only when the content has an explicit way to finish or cancel. Keep the trigger mounted for focus restoration. For layout that switches presentation automatically, use [Adaptive Dialog](adaptive-dialog.md).

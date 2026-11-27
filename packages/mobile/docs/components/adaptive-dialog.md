# Adaptive Dialog

Use one form or modal task that appears as a sheet on a narrow viewport and a centered dialog on wider screens. The same content stays mounted when presentation changes, so draft values survive resizing.

```tsx
import { AdaptiveDialog } from '@oddmash/mobile-interactions/adaptive-dialog';
import '@oddmash/mobile-interactions/styles.css';

<AdaptiveDialog title="Edit profile" open={open} onOpenChange={setOpen} breakpoint={720}>
  <label>Name <input defaultValue="Alex" /></label>
  <button type="button" onClick={() => setOpen(false)}>Done</button>
</AdaptiveDialog>
```

## Props

All [Bottom Sheet props](bottom-sheet.md#props) are accepted, with these presentation controls.

| Prop | Type and default | Behavior |
| --- | --- | --- |
| `presentation` | `'auto' \| 'sheet' \| 'dialog'`, `'auto'` | Choose by breakpoint or force one presentation. |
| `breakpoint` | Number, `640` | In auto mode, the sheet appears below this width in CSS pixels. |

## Focus and resizing

The server render starts with the centered presentation. The viewport mode is determined after mounting. A wide dialog uses the visual viewport for its height, and the component adjusts internal scroll when a focused field falls outside the dialog on viewport movement. Pass `returnFocusRef` when you need explicit focus restoration. Test the form on a real mobile keyboard if its layout is critical.

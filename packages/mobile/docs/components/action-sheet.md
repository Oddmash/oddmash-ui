# Action Sheet

Use Action Sheet for a short list of choices following an explicit user action. The modal grows with its content up to the visible viewport. The list can scroll and the Cancel button stays separate.

```tsx
import { useRef, useState } from 'react';
import { ActionSheet } from '@oddmash/mobile-interactions/action-sheet';
import '@oddmash/mobile-interactions/styles.css';

export const ReportActions = () => {
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [selection, setSelection] = useState('');
  return (
    <>
      <button ref={trigger} onClick={() => setOpen(true)}>Report actions</button>
      <ActionSheet
        title="Weekly report"
        description="Choose what to do with your saved copy."
        open={open}
        onOpenChange={setOpen}
        returnFocusRef={trigger}
        actions={[
          { id: 'remove', label: 'Remove saved copy', destructive: true },
          { id: 'duplicate', label: 'Duplicate report' },
        ]}
        onSelect={setSelection}
      />
      <output>{selection}</output>
    </>
  );
};
```

Provide a unique `id` and a visible label per action. Use `disabled` for unavailable choices and `destructive` for destructive emphasis. The app owns confirmation, mutation, error handling and any follow-up after selection. Action order is preserved.

## Props

| Prop | Type and default | Behavior |
| --- | --- | --- |
| `title` | Required string | Names the dialog. |
| `actions`, `onSelect` | Required action array and callback | Render choices in order. The callback receives only the selected action's ID. |
| `description` | Optional string | Provides short context and is exposed as the dialog description. |
| `open`, `onOpenChange` | Optional boolean and callback | Control whether the sheet is visible. |
| `defaultOpen` | Boolean, `false` | Initial uncontrolled visibility. |
| `cancelLabel` | String, `'Cancel'` | Visible text for the persistent cancel action. |
| `returnFocusRef` | Optional element ref | Supplies the element to focus after closing. |

## Focus and selection

Cancel receives initial focus. Cancel, Escape and backdrop dismissal call `onOpenChange(false)` without selecting an action. Picking an enabled action requests closing and calls `onSelect(id)`. Use `defaultOpen` for uncontrolled visibility. Pass `cancelLabel` to localize the cancel button.

The web presentation uses the same bottom-anchored dialog for narrow and wide layouts. iPad confirmation popovers are a separate native presentation.

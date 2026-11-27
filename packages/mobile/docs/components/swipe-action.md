# Swipe Action

Reveal contextual controls beside a row while preserving a button path for pointer, keyboard, and assistive-technology users.

```tsx
import { SwipeAction } from '@oddmash/mobile-interactions/swipe-action';
import '@oddmash/mobile-interactions/styles.css';

<SwipeAction
  actions={<button type="button" onClick={() => archive(message.id)}>Archive</button>}
>
  {message.subject}
</SwipeAction>
```

## Props

| Prop | Type and default | Behavior |
| --- | --- | --- |
| `children`, `actions` | Required React nodes | Row content and action controls. Give each action an accessible label. |
| `direction` | `'left' \| 'right'`, `'left'` | Physical direction the row moves to reveal actions. |
| `actionWidth` | Number, `112` | Width of the revealed action area in CSS pixels. Ensure it fits the longest useful action label. |
| `label` | String, `'Show actions'` | Accessible visible label for the closed disclosure button. |
| `open`, `onOpenChange` | Optional boolean and callback | Let the parent coordinate the open row. |
| `defaultOpen` | Boolean, `false` | Initial visibility in uncontrolled mode. |

## Gesture behavior

A swipe reveals actions. The person explicitly activates a button to perform the mutation. Escape closes the actions and returns focus to the disclosure. Browser scrolling and pinch zoom remain available on supported browsers. For a single open row or an inbox with refresh, see [composition recipes](../composition.md#coordinate-an-inbox).

## Focus when removing a row

The app owns focus when an action removes the entire row, including the active button. After the DOM updates, focus a surviving row, an undo button, or a confirmation with `tabIndex={-1}`. For example, keep a ref to the confirmation and call its `focus()` from a React effect that runs when the archive succeeds. Confirm that the next Tab continues in the expected order. For a list of messages, prefer the next row's action button when the user has more rows to process.

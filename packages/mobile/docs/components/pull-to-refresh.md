# Pull to Refresh

Place a refresh handle and a button above content that can update in place. An explicit handle scopes the gesture and coexists with normal vertical scrolling.

```tsx
import { PullToRefresh } from '@oddmash/mobile-interactions/pull-to-refresh';
import '@oddmash/mobile-interactions/styles.css';

<PullToRefresh onRefresh={async () => {
  const response = await fetch('/api/messages');
  if (!response.ok) throw new Error('Refresh failed');
  setMessages(await response.json());
}}>
  <MessageList messages={messages} />
</PullToRefresh>
```

## Props

| Prop | Type and default | Behavior |
| --- | --- | --- |
| `children` | Required React node | Content that stays rendered and gets a busy state while a refresh is pending. |
| `onRefresh` | Required function returning void or a promise | Called on a completed qualifying pull or a button press. Return the actual request promise. |
| `disabled` | Boolean, `false` | Disable the button and cancel a pending gesture. |
| `threshold` | Number, `64` | Pull distance in CSS pixels. Use a positive value. |
| `label` | String, `'Refresh'` | Label for the refresh button. |

## Recovery

The status announces when a pull can be released and when a request is pending, successful, or failed. A second activation cannot start a concurrent request. Preserve old data until the replacement succeeds, and keep the button available for retry after a failed request. Browser-level pull-to-refresh behavior remains platform-specific. See [native behavior](../native-interaction-parity.md).

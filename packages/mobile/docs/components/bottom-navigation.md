# Bottom Navigation

Use Bottom Navigation for a small set of primary destinations. It renders an accessible navigation landmark and ordinary links. The host router or page owns location and supplies the active item.

```tsx
import { BottomNavigation } from '@oddmash/mobile-interactions/bottom-navigation';
import '@oddmash/mobile-interactions/styles.css';

export const AppNavigation = ({ current }: { current: string }) => (
  <BottomNavigation
    label="Primary navigation"
    activeId={current}
    items={[
      { id: 'inbox', href: '/inbox', label: 'Inbox' },
      { id: 'projects', href: '/projects', label: 'Projects' },
      { id: 'account', href: '/account', label: 'Account' },
    ]}
  />
);
```

Each item has a unique `id`, `href` and visible `label`. Optional icons are decorative, non-interactive and inherit the surrounding color. Standard link props such as `onClick`, `target` and `rel` are accepted. When a client router handles clicks, preserve modifier keys, external navigation, and the default action when interception does not apply. The current link has `aria-current="page"`.

## Props

| Prop | Type | Behavior |
| --- | --- | --- |
| `label` | Required string | Accessible name for the navigation landmark. |
| `items` | Required readonly item array | Each item contains permanent `id`, `href` and visible `label`. The icon is optional. |
| `activeId` | Optional string | Marks the matching link as current. Derive it from the app's location. |
| `className` | Optional string | Adds a class to the navigation element. |

## App shell

The bar renders in document flow and accounts for safe areas where the browser supplies them. To keep it at the bottom of an app shell, place the scrolling content and the navigation in separate grid rows. This keeps the bar from covering a focused link or form control in the content. Give oversized navigation labels their own scroll space in the bar. Per-section stack restoration belongs to the app router.

```css
.app-shell { display: grid; grid-template-rows: minmax(0, 1fr) auto; height: 100dvh; }
.app-content { overflow: auto; }
.app-navigation { max-height: min(50dvh, 12rem); overflow: auto; }
```

Pass `className="app-navigation"` to Bottom Navigation and apply the other classes to its host and content sibling.

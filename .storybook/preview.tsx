import type { Preview } from '@storybook/react-vite';
import '../src/styles.scss';
const preview: Preview = {
  globalTypes: { theme: { toolbar: { items: ['light', 'dark'] } } },
  initialGlobals: { theme: 'light' },
  decorators: [(Story, context) => <div data-om-theme={context.globals.theme} style={{ padding: 24, background: 'var(--om-semantic-color-bg)', color: 'var(--om-semantic-color-text)' }}><Story /></div>],
};
export default preview;

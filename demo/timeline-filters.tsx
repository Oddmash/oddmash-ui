import { Code, Preview } from './examples';
import { TimelineFilterExample } from './timeline-filter-example';
import exampleSource from './timeline-filter-example.tsx?raw';
import stylesSource from './timeline-filter-example.scss?raw';

export const TimelineFilters = () => (
  <>
    <section className="doc-section">
      <h2>Try the filters</h2>
      <p>
        Choose an event type or limit the list to the selected button. The
        filters work together and keep the original event list available.
      </p>
      <Preview>
        <TimelineFilterExample />
      </Preview>
    </section>
    <section className="doc-section">
      <h2>Use in your tool</h2>
      <p>
        Replace the sample events with your own list. Keep the filter values
        beside the timeline and derive the visible rows from that state.
      </p>
      <Code label="timeline-filter-example.tsx">{exampleSource}</Code>
      <Code label="timeline-filter-example.scss">{stylesSource}</Code>
    </section>
  </>
);

import { useLocale } from './locale';
import { Code, Preview } from './examples';
import { TimelineFilterExample } from './timeline-filter-example';
import exampleSource from './timeline-filter-example.tsx?raw';
import stylesSource from './timeline-filter-example.scss?raw';

export const TimelineFilters = () => {
  const { t } = useLocale();
  return (
    <>
      <section className="doc-section">
        <h2>{t('Try the filters')}</h2>
        <p>
          {t(
            'Choose an event type or limit the list to the selected button. The filters work together and keep the original event list available.',
          )}
        </p>
        <Preview>
          <TimelineFilterExample t={t} />
        </Preview>
      </section>
      <section className="doc-section">
        <h2>{t('Use in your tool')}</h2>
        <p>
          {t(
            'Replace the sample events with your own list. Keep the filter values beside the timeline and derive the visible rows from that state.',
          )}
        </p>
        <Code label="timeline-filter-example.tsx">{exampleSource}</Code>
        <Code label="timeline-filter-example.scss">{stylesSource}</Code>
      </section>
    </>
  );
};

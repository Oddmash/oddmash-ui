import { useState } from 'react';
import { Field } from '@oddmash/ui/field';
import { SelectDropdown } from '@oddmash/ui/select';
import { Switch } from '@oddmash/ui/switch';
import '@oddmash/ui/styles.css';
import './timeline-filter-example.scss';

const eventTypes = ['focusin', 'focusout', 'click', 'keydown'] as const;
type EventType = (typeof eventTypes)[number];

const events = [
  { id: 1, type: 'focusin', target: 'button', targetId: 1 },
  { id: 2, type: 'focusout', target: 'button', targetId: 1 },
  { id: 3, type: 'click', target: 'a', targetId: 2 },
  { id: 4, type: 'click', target: 'button', targetId: 1 },
] satisfies { id: number; type: EventType; target: string; targetId: number }[];

export const TimelineFilterExample = ({
  selectedId = 1,
  t = (text) => text,
}: { selectedId?: number; t?: (text: string) => string } = {}) => {
  const [eventFilter, setEventFilter] = useState<EventType | 'all'>('all');
  const [selectedOnly, setSelectedOnly] = useState(false);
  const visibleEvents = events.filter(
    ({ type, targetId }) =>
      (eventFilter === 'all' || type === eventFilter) &&
      (!selectedOnly || targetId === selectedId),
  );

  return (
    <div className="timeline-filter-example">
      <Field legend={t('Timeline filters')}>
        <div className="timeline-select">
          <span>{t('Event type')}</span>
          <SelectDropdown
            aria-label={t('Event type')}
            value={eventFilter}
            onValueChange={(value) =>
              setEventFilter(value as EventType | 'all')
            }
            options={[{ value: 'all', label: t('All events') }, ...eventTypes.map((type) => ({ value: type, label: type }))]}
          />
        </div>
        <label>
          <Switch
            checked={selectedOnly}
            onChange={(event) => setSelectedOnly(event.target.checked)}
          />
          {t('Selected element')}
        </label>
      </Field>
      <p role="status">
        {visibleEvents.length} {t('matching events')}
      </p>
      <ol aria-label={t('Filtered event timeline')}>
        {visibleEvents.map(({ id, type, target }) => (
          <li key={id}>
            <code>{type}</code> <span>{target}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

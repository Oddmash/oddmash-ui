import { useLocale } from './locale';
import { useId, useState, type SyntheticEvent } from 'react';
import {
  Badge,
  Button,
  Card,
  Input,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@oddmash/ui';

type Interaction = { type: string; target: string; key?: string };

const InteractionLab = () => {
  const { t } = useLocale();
  const fieldId = useId();
  const [events, setEvents] = useState<Interaction[]>([]);
  const [status, setStatus] = useState('');
  const latest = events.at(-1);

  const record = (event: SyntheticEvent, type: string, key?: string) => {
    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.dataset.target) return;
    const label = target.dataset.target;
    setEvents((previous) => [
      ...previous.slice(-5),
      { type, target: label, key },
    ]);
  };

  return (
    <Card className="interaction-lab">
      <div className="lab-header">
        <h2>{t('Interaction Lab')}</h2>
        <Button size="sm" variant="ghost" onClick={() => setEvents([])}>
          {t('Clear events')}
        </Button>
      </div>
      <div className="lab-body">
        <form
          className="lab-targets"
          onFocus={(event) => record(event, 'focusin')}
          onBlur={(event) => record(event, 'focusout')}
          onClick={(event) => record(event, 'click')}
          onKeyDown={(event) => {
            if (['Tab', 'Enter', 'Escape', ' '].includes(event.key)) {
              record(event, 'keydown', event.key === ' ' ? 'Space' : event.key);
            }
          }}
          onSubmit={(event) => {
            event.preventDefault();
            const name = new FormData(event.currentTarget).get('project');
            setStatus(String(name));
          }}
        >
          <label htmlFor={fieldId}>{t('Project name')}</label>
          <Input
            id={fieldId}
            name="project"
            defaultValue="Interaction Inspector"
            required
            data-target="Project name"
          />
          <Button type="submit" size="sm" data-target="Save project">
            {t('Save project')}
          </Button>
          <p className="lab-status" role="status">
            {status && `${t('Saved')} ${status}`}
          </p>
        </form>
        <Tabs className="lab-monitor" defaultValue="events">
          <TabsList aria-label={t('Interaction views')}>
            <TabsTrigger value="events">{t('Events')}</TabsTrigger>
            <TabsTrigger value="target">{t('Target')}</TabsTrigger>
          </TabsList>
          <TabsContent value="events">
            {events.length ? (
              <ol
                className="lab-events"
                role="list"
                aria-label={t('Recent interactions')}
              >
                {events.map((event, index) => (
                  <li key={index}>
                    <Badge
                      tone={event.type === 'focusin' ? 'accent' : 'neutral'}
                    >
                      {event.type}
                    </Badge>
                    <span>
                      {t(event.target)}
                      {event.key && <small> · {event.key}</small>}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="lab-empty">
                {t('Tab into the form or click a control to capture an event.')}
              </p>
            )}
          </TabsContent>
          <TabsContent value="target">
            {latest ? (
              <dl className="lab-target-details">
                <dt>{t('Control')}</dt>
                <dd>{t(latest.target)}</dd>
                <dt>{t('Last event')}</dt>
                <dd>
                  <code>{latest.type}</code>
                </dd>
              </dl>
            ) : (
              <p className="lab-empty">
                {t('Interact with the form to inspect a control.')}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};

export default InteractionLab;

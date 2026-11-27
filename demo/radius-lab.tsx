import { useId, useState } from 'react';
import { Button, Card, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, Input, Select } from '@oddmash/ui';
import { Code } from './examples';
import { useLocale } from './locale';
import './radius-lab.scss';

const RadiusExample = ({ profile }: { profile: 'default' | 'soft' }) => {
  const { t } = useLocale();
  const headingId = useId();
  const inputId = useId();
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);

  return (
    <section className="radius-example" data-om-radius={profile} aria-labelledby={headingId}>
      <h2 id={headingId}>{t(profile === 'soft' ? 'Soft corners' : 'Default corners')}</h2>
      <Card className="radius-example-card">
        <label htmlFor={inputId}>{t('Project name')}</label>
        <Input id={inputId} defaultValue="Oddmash" />
        <Select
          aria-label={t('Environment')}
          defaultValue="production"
          options={[
            { value: 'production', label: t('Production') },
            { value: 'preview', label: t('Preview') },
          ]}
        />
        <Input aria-label={t('Invalid project name')} aria-invalid="true" defaultValue="?" />
        <div className="radius-example-actions">
          <Dialog>
            <DialogTrigger asChild><Button>{t('Edit project')}</Button></DialogTrigger>
            {portal && (
              <DialogContent container={portal}>
                <DialogTitle>{t('Edit project')}</DialogTitle>
                <DialogDescription>{t('Update the project name.')}</DialogDescription>
                <Input aria-label={t('Project name')} defaultValue="Oddmash" />
                <DialogClose asChild><Button>{t('Close')}</Button></DialogClose>
              </DialogContent>
            )}
          </Dialog>
          <Button variant="secondary" disabled>{t('Unavailable')}</Button>
        </div>
      </Card>
      <div ref={setPortal} />
    </section>
  );
};

const scopedRadiusExample = `import { useState } from 'react';
import { Button, Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger } from '@oddmash/ui';
import '@oddmash/ui/styles.css';

export function ProjectControls() {
  const [portal, setPortal] = useState<HTMLDivElement | null>(null);

  return (
    <section data-om-radius="soft">
      <Dialog>
        <DialogTrigger asChild><Button>Edit project</Button></DialogTrigger>
        {portal && (
          <DialogContent container={portal} aria-describedby={undefined}>
            <DialogTitle>Edit project</DialogTitle>
            <DialogClose asChild><Button>Close</Button></DialogClose>
          </DialogContent>
        )}
      </Dialog>
      <div ref={setPortal} />
      <div data-om-radius="default">
        <Button variant="secondary">Reset project</Button>
      </div>
    </section>
  );
}`;

export const RadiusLab = () => {
  const { t } = useLocale();

  return (
    <>
      <div className="radius-lab">
        <RadiusExample profile="default" />
        <RadiusExample profile="soft" />
      </div>
      <section className="doc-section">
        <h2>{t('Use soft corners')}</h2>
        <p>
          {t('Add data-om-radius="soft" to a section or the page root. Use data-om-radius="default" on a nested section to restore the default corners.')}
        </p>
        <p>
          {t('For a Dialog in a soft section, pass an element inside that section as the container. Select menus already render inside their own section.')}
        </p>
        <Code label={t('Scoped corner styles')}>{scopedRadiusExample}</Code>
      </section>
    </>
  );
};

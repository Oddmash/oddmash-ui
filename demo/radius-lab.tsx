import { useId, useState } from 'react';
import { Button, Card, Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, Input, Select } from '@oddmash/ui';
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

export const RadiusLab = () => (
  <div className="radius-lab">
    <RadiusExample profile="default" />
    <RadiusExample profile="soft" />
  </div>
);

import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { TextInput } from './primitives/TextInput.tsx';
import { DateInput } from './primitives/DateInput.tsx';
import { ChipPicker } from './primitives/ChipPicker.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { useStore } from '../store/store.tsx';
import { t, tr } from '../../i18n/tr.ts';

interface NewWorkerFormProps {
  goBack: () => void;
}

export function NewWorkerForm({ goBack }: NewWorkerFormProps) {
  const { addWorker } = useStore();
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const valid = name.trim().length > 2 && specialty && startDate;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await addWorker({ name, specialty, startDate });
      goBack();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title={t('newWorkerForm.title')} altTitle={t('newWorkerForm.subtitle')}>
      <Field label={t('newWorkerForm.fieldName')}><TextInput value={name} onChange={setName} placeholder={t('newWorkerForm.namePlaceholder')} /></Field>
      <Field label={t('newWorkerForm.fieldSpecialty')}><ChipPicker value={specialty} onChange={setSpecialty} options={tr.newWorkerForm.specialtyOptions} /></Field>
      <Field label={t('newWorkerForm.fieldStartDate')}><DateInput value={startDate} onChange={setStartDate} /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.adding') : t('newWorkerForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

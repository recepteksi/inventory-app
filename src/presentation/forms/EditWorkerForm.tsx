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

interface EditWorkerFormProps {
  id: string;
  goBack: () => void;
}

export function EditWorkerForm({ id, goBack }: EditWorkerFormProps) {
  const { getWorker, editWorker } = useStore();
  const worker = getWorker(id);

  const [name, setName] = useState(worker?.name ?? '');
  const [specialty, setSpecialty] = useState(worker?.specialty ?? '');
  const [startDate, setStartDate] = useState(worker?.startDate ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!worker) return <div style={{ padding: 24, fontFamily: TOKENS.font, color: TOKENS.inkSoft }}>{t('editWorkerForm.notFound')}</div>;

  const valid = name.trim().length > 2 && specialty && startDate;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await editWorker(id, { name, specialty, startDate });
      goBack();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title={t('editWorkerForm.title')} altTitle={worker.name}>
      <Field label={t('editWorkerForm.fieldName')}><TextInput value={name} onChange={setName} placeholder={t('editWorkerForm.namePlaceholder')} /></Field>
      <Field label={t('editWorkerForm.fieldSpecialty')}><ChipPicker value={specialty} onChange={setSpecialty} options={tr.newWorkerForm.specialtyOptions} /></Field>
      <Field label={t('editWorkerForm.fieldStartDate')}><DateInput value={startDate} onChange={setStartDate} /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('editWorkerForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

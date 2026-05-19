import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { TextInput } from './primitives/TextInput.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { ChipPicker } from './primitives/ChipPicker.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { useStore } from '../store/store.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t, tr } from '../../i18n/tr.ts';

interface EditMaterialFormProps {
  id: string;
  goBack: () => void;
}

export function EditMaterialForm({ id, goBack }: EditMaterialFormProps) {
  const { getMaterial, editMaterial } = useStore();
  const m = getMaterial(id);

  const [minimum, setMinimum] = useState(String(m?.minimum ?? ''));
  const [name, setName] = useState(m?.name ?? '');
  const [category, setCategory] = useState(m?.category ?? '');
  const [unit, setUnit] = useState(m?.unit ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!m) return <div style={{ padding: 24, fontFamily: TOKENS.font, color: TOKENS.inkSoft }}>{t('editMaterialForm.notFound')}</div>;

  const isPipeFitting = m.group === 'pipe';
  const valid = minimum && Number(minimum) >= 0 && (isPipeFitting || (name.trim().length > 1 && category && unit));

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await editMaterial(id, { minimum, name, category, unit });
      goBack();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title={t('editMaterialForm.title')} altTitle={getMaterialName(m)}>
      {isPipeFitting ? (
        <>
          <div style={{ background: TOKENS.lineSoft, borderRadius: 10, padding: '10px 14px' }}>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5, marginBottom: 4 }}>{t('editMaterialForm.readonlyLabel')}</div>
            <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.ink }}>{m.diameter} · {m.grade} · {m.kind} · {m.unit}</div>
          </div>
          <Field label={t('editMaterialForm.fieldMinStock')}><NumInput value={minimum} onChange={setMinimum} suffix={m.unit} /></Field>
        </>
      ) : (
        <>
          <Field label={t('editMaterialForm.fieldName')}><TextInput value={name} onChange={setName} placeholder={t('editMaterialForm.namePlaceholder')} /></Field>
          <Field label={t('editMaterialForm.fieldCategory')}><ChipPicker value={category} onChange={setCategory} options={tr.newMaterialForm.categoryOptions} /></Field>
          <Field label={t('editMaterialForm.fieldUnit')}><ChipPicker value={unit} onChange={setUnit} options={['adet', 'paket', 'litre', 'kg', 'm']} /></Field>
          <Field label={t('editMaterialForm.fieldMinStock')}><NumInput value={minimum} onChange={setMinimum} suffix={unit} /></Field>
        </>
      )}
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('editMaterialForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

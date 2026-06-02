import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { TextInput } from './primitives/TextInput.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { ChipPicker } from './primitives/ChipPicker.tsx';
import { SegmentControl } from './primitives/SegmentControl.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { useStore } from '../store/store.tsx';
import { useAuth } from '../auth/AuthProvider.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';

interface EditMaterialFormProps {
  id: string;
  goBack: () => void;
}

export function EditMaterialForm({ id, goBack }: EditMaterialFormProps) {
  const { getMaterial, editMaterial, catalogOptions } = useStore();
  const { isAdmin } = useAuth();
  const m = getMaterial(id);

  const [minimum, setMinimum] = useState(m?.minimum != null ? String(m.minimum) : '');
  const [name, setName] = useState(m?.name ?? '');
  const [category, setCategory] = useState(m?.category ?? '');
  const [unit, setUnit] = useState(m?.unit ?? '');
  const [diameter, setDiameter] = useState(m?.diameter ?? '');
  const [kind, setKind] = useState(m?.kind ?? '');
  const [grade, setGrade] = useState(m?.grade ?? '');
  const [shape, setShape] = useState<'round' | 'rect'>(m?.shape ?? 'round');
  const [width, setWidth] = useState(m?.width ?? '');
  const [height, setHeight] = useState(m?.height ?? '');
  const [thickness, setThickness] = useState(m?.thickness ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!m) return <div style={{ padding: 24, fontFamily: TOKENS.font, color: TOKENS.inkSoft }}>{t('editMaterialForm.notFound')}</div>;

  const isOther = m.group === 'other';
  const isPipeLike = m.group === 'pipe' || m.group === 'ventilation';
  const isIsolation = m.group === 'isolation';
  const canEditIdentity = isAdmin && !isOther;

  const valid = isOther ? (name.trim().length > 1 && !!category && !!unit) : true;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await editMaterial(id, { minimum, name, category, unit, diameter, kind, grade, shape, width, height, thickness });
      goBack();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title={t('editMaterialForm.title')} altTitle={getMaterialName(m)}>
      {isOther && (
        <>
          <Field label={t('editMaterialForm.fieldName')}><TextInput value={name} onChange={setName} placeholder={t('editMaterialForm.namePlaceholder')} /></Field>
          <Field label={t('editMaterialForm.fieldCategory')}><ChipPicker value={category} onChange={setCategory} options={catalogOptions('other', 'category')} /></Field>
          <Field label={t('editMaterialForm.fieldUnit')}><ChipPicker value={unit} onChange={setUnit} options={catalogOptions('other', 'unit')} /></Field>
        </>
      )}

      {!isOther && !canEditIdentity && (
        <div style={{ background: TOKENS.lineSoft, borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5, marginBottom: 4 }}>{t('editMaterialForm.readonlyLabel')}</div>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.ink }}>{getMaterialName(m)} · {m.unit}</div>
        </div>
      )}

      {canEditIdentity && isPipeLike && (
        <>
          <div style={{ fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.accent, letterSpacing: 0.6, textTransform: 'uppercase' }}>{t('editMaterialForm.adminLabel')}</div>
          <Field label={t('newMaterialForm.fieldDiameter')} optional={m.group === 'ventilation'}><ChipPicker value={diameter} onChange={setDiameter} options={catalogOptions(m.group, 'diameter')} /></Field>
          <Field label={t('newMaterialForm.fieldKind')}><ChipPicker value={kind} onChange={setKind} options={catalogOptions(m.group, 'kind')} /></Field>
          <Field label={t('newMaterialForm.fieldGrade')}><ChipPicker value={grade} onChange={setGrade} options={catalogOptions(m.group, 'grade')} /></Field>
        </>
      )}

      {canEditIdentity && isIsolation && (
        <>
          <div style={{ fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.accent, letterSpacing: 0.6, textTransform: 'uppercase' }}>{t('editMaterialForm.adminLabel')}</div>
          <Field label={t('newMaterialForm.fieldKind')}><ChipPicker value={kind} onChange={setKind} options={catalogOptions('isolation', 'kind')} /></Field>
          <Field label={t('newMaterialForm.fieldGrade')} optional><ChipPicker value={grade} onChange={setGrade} options={catalogOptions('isolation', 'grade')} /></Field>
          <Field label={t('newMaterialForm.fieldShape')}>
            <SegmentControl value={shape} onChange={(v) => setShape(v as 'round' | 'rect')} options={[{ value: 'round', label: t('newMaterialForm.shapeRound') }, { value: 'rect', label: t('newMaterialForm.shapeRect') }]} />
          </Field>
          {shape === 'round' ? (
            <Field label={t('newMaterialForm.fieldDiameter')}><ChipPicker value={diameter} onChange={setDiameter} options={catalogOptions('isolation', 'diameter')} /></Field>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label={t('newMaterialForm.fieldWidth')}><NumInput value={width} onChange={setWidth} suffix="mm" /></Field>
              <Field label={t('newMaterialForm.fieldHeight')}><NumInput value={height} onChange={setHeight} suffix="mm" /></Field>
            </div>
          )}
          <Field label={t('newMaterialForm.fieldThickness')}><ChipPicker value={thickness} onChange={setThickness} options={catalogOptions('isolation', 'thickness')} /></Field>
        </>
      )}

      <Field label={t('editMaterialForm.fieldMinStock')} optional><NumInput value={minimum} onChange={setMinimum} suffix={m.unit} /></Field>

      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('editMaterialForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { TextInput } from './primitives/TextInput.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { ChipPicker } from './primitives/ChipPicker.tsx';
import { SegmentControl } from './primitives/SegmentControl.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { NewMaterialSuccess } from './NewMaterialSuccess.tsx';
import { useStore } from '../store/store.tsx';
import { t, tr } from '../../i18n/tr.ts';

interface NewMaterialFormProps {
  preset?: { group?: 'pipe' | 'other' } | string;
  goBack: () => void;
}

export function NewMaterialForm({ preset, goBack }: NewMaterialFormProps) {
  const { pipeFittings, otherMaterials, addMaterial } = useStore();
  const presetGroup = typeof preset === 'object' ? preset?.group : undefined;
  const [group, setGroup] = useState<'pipe' | 'other'>(presetGroup || 'pipe');
  const [diameter, setDiameter] = useState('');
  const [kind, setKind] = useState('');
  const [grade, setGrade] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [openingStock, setOpeningStock] = useState('');
  const [minimum, setMinimum] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isPipeFitting = group === 'pipe';
  const autoUnit = isPipeFitting ? (kind === 'Boru' ? 'm' : 'adet') : unit;
  const valid = isPipeFitting
    ? diameter && kind && grade && minimum
    : category && name.trim().length > 1 && unit && minimum;
  const duplicate = isPipeFitting && diameter && kind && grade
    ? pipeFittings.find((m) => m.diameter === diameter && m.kind === kind && m.grade === grade)
    : !isPipeFitting && name
      ? otherMaterials.find((m) => (m.name ?? '').toLowerCase() === name.toLowerCase())
      : null;

  const submit = async () => {
    if (!valid || duplicate || loading) return;
    setLoading(true); setError('');
    try {
      await addMaterial({ group, diameter, kind, grade, category, name, unit, openingStock, minimum });
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const newName = isPipeFitting ? `${diameter} ${grade} ${kind}` : name;
    return <NewMaterialSuccess name={newName} group={group} unit={autoUnit} openingStock={openingStock} minimum={minimum} goBack={goBack} />;
  }

  return (
    <FormShell title={t('newMaterialForm.title')} altTitle={t('newMaterialForm.subtitle')}>
      <Field label={t('newMaterialForm.fieldGroup')}>
        <SegmentControl value={group} onChange={(v) => setGroup(v as 'pipe' | 'other')} options={[{ value: 'pipe', label: t('newMaterialForm.optionPipe') }, { value: 'other', label: t('newMaterialForm.optionOther') }]} />
      </Field>
      {isPipeFitting ? (
        <>
          <Field label={t('newMaterialForm.fieldDiameter')}><ChipPicker value={diameter} onChange={setDiameter} options={['1"', '2"', '3"', '4"', '6"']} /></Field>
          <Field label={t('newMaterialForm.fieldKind')}><ChipPicker value={kind} onChange={setKind} options={tr.newMaterialForm.kindOptions} /></Field>
          <Field label={t('newMaterialForm.fieldGrade')}><ChipPicker value={grade} onChange={setGrade} options={tr.newMaterialForm.gradeOptions} /></Field>
          {diameter && kind && grade && (
            <div style={{ background: duplicate ? TOKENS.lowSoft : TOKENS.steelSoft, border: `1px solid ${duplicate ? TOKENS.low : 'transparent'}`, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <MaterialGlyph material={{ kind, diameter, grade }} size={40} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{duplicate ? t('newMaterialForm.badgeExists') : t('newMaterialForm.badgePreview')}</div>
                <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 15, color: TOKENS.ink, marginTop: 2 }}>{diameter} {grade} {kind}</div>
                <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkSoft, marginTop: 2 }}>
                  {duplicate
                    ? t('newMaterialForm.existingStock').replace('{stock}', String(duplicate.stock)).replace('{unit}', duplicate.unit)
                    : t('newMaterialForm.unitPreview').replace('{unit}', autoUnit)}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <Field label={t('newMaterialForm.fieldCategory')}><ChipPicker value={category} onChange={setCategory} options={tr.newMaterialForm.categoryOptions} /></Field>
          <Field label={t('newMaterialForm.fieldName')}><TextInput value={name} onChange={setName} placeholder={t('newMaterialForm.namePlaceholder')} /></Field>
          <Field label={t('newMaterialForm.fieldUnit')}><ChipPicker value={unit} onChange={setUnit} options={['adet', 'paket', 'litre', 'kg', 'm']} /></Field>
        </>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 4, borderTop: `1px solid ${TOKENS.lineSoft}`, marginTop: 4 }}>
        <Field label={t('newMaterialForm.fieldOpeningStock')} optional><NumInput value={openingStock} onChange={setOpeningStock} suffix={autoUnit} /></Field>
        <Field label={t('newMaterialForm.fieldMinStock')}><NumInput value={minimum} onChange={setMinimum} suffix={autoUnit} /></Field>
      </div>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || !!duplicate || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !duplicate && !loading ? 1 : 0.4 }}>
          {loading ? t('common.adding') : duplicate ? t('newMaterialForm.btnAlreadyExists') : t('newMaterialForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

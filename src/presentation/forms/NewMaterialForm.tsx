import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { TextInput } from './primitives/TextInput.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { ChipPicker } from './primitives/ChipPicker.tsx';
import { SegmentControl } from './primitives/SegmentControl.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { NewMaterialSuccess } from './NewMaterialSuccess.tsx';
import { useStore } from '../store/store.tsx';
import { t } from '../../i18n/tr.ts';
import type { MaterialGroup } from '../../types/index.ts';

const GROUP_OPTIONS: { value: MaterialGroup; label: string }[] = [
  { value: 'pipe', label: 'Boru' },
  { value: 'ventilation', label: 'Havaland.' },
  { value: 'isolation', label: 'İzolasyon' },
  { value: 'other', label: 'Diğer' },
];

const GROUP_LABEL: Record<MaterialGroup, string> = {
  pipe: 'Boru & Fittings', ventilation: 'Havalandırma', isolation: 'İzolasyon', other: 'Diğer Malzeme',
};

interface NewMaterialFormProps {
  preset?: string;
  goBack: () => void;
}

export function NewMaterialForm({ preset, goBack }: NewMaterialFormProps) {
  const { addMaterial, catalogOptions } = useStore();
  const presetGroup = (['pipe', 'other', 'ventilation', 'isolation'] as string[]).includes(preset ?? '')
    ? (preset as MaterialGroup)
    : 'pipe';
  const [group, setGroup] = useState<MaterialGroup>(presetGroup);
  const [diameter, setDiameter] = useState('');
  const [kind, setKind] = useState('');
  const [grade, setGrade] = useState('');
  const [category, setCategory] = useState('');
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [shape, setShape] = useState<'round' | 'rect'>('round');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [thickness, setThickness] = useState('');
  const [openingStock, setOpeningStock] = useState('');
  const [minimum, setMinimum] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const autoUnit =
    group === 'pipe' ? (kind === 'Boru' ? 'm' : 'adet')
    : group === 'ventilation' ? (kind === 'Kanal' ? 'm' : 'adet')
    : group === 'isolation' ? 'm'
    : unit;

  const valid =
    group === 'pipe' ? diameter && kind && grade
    : group === 'ventilation' ? kind && grade
    : group === 'isolation' ? kind && thickness && (shape === 'round' ? diameter : width && height)
    : category && name.trim().length > 1 && unit;

  const reset = () => { setDiameter(''); setKind(''); setGrade(''); setCategory(''); setName(''); setUnit(''); setWidth(''); setHeight(''); setThickness(''); };

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await addMaterial({ group, diameter, kind, grade, category, name, unit, shape, width, height, thickness, openingStock, minimum });
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const newName =
      group === 'pipe' || group === 'ventilation' ? [diameter, grade, kind].filter(Boolean).join(' ')
      : group === 'isolation' ? `${kind} ${shape === 'round' ? `Ø${diameter}` : `${width}×${height}`} · ${thickness}mm`
      : name;
    return <NewMaterialSuccess name={newName} groupLabel={GROUP_LABEL[group]} unit={autoUnit} openingStock={openingStock} minimum={minimum || '—'} goBack={goBack} />;
  }

  return (
    <FormShell title={t('newMaterialForm.title')} altTitle={t('newMaterialForm.subtitle')}>
      <Field label={t('newMaterialForm.fieldGroup')}>
        <SegmentControl value={group} onChange={(v) => { setGroup(v as MaterialGroup); reset(); }} options={GROUP_OPTIONS} />
      </Field>

      {(group === 'pipe' || group === 'ventilation') && (
        <>
          <Field label={t('newMaterialForm.fieldDiameter')} optional={group === 'ventilation'}>
            <ChipPicker value={diameter} onChange={setDiameter} options={catalogOptions(group, 'diameter')} />
          </Field>
          <Field label={t('newMaterialForm.fieldKind')}><ChipPicker value={kind} onChange={setKind} options={catalogOptions(group, 'kind')} /></Field>
          <Field label={t('newMaterialForm.fieldGrade')}><ChipPicker value={grade} onChange={setGrade} options={catalogOptions(group, 'grade')} /></Field>
        </>
      )}

      {group === 'isolation' && (
        <>
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

      {group === 'other' && (
        <>
          <Field label={t('newMaterialForm.fieldCategory')}><ChipPicker value={category} onChange={setCategory} options={catalogOptions('other', 'category')} /></Field>
          <Field label={t('newMaterialForm.fieldName')}><TextInput value={name} onChange={setName} placeholder={t('newMaterialForm.namePlaceholder')} /></Field>
          <Field label={t('newMaterialForm.fieldUnit')}><ChipPicker value={unit} onChange={setUnit} options={catalogOptions('other', 'unit')} /></Field>
        </>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 4, borderTop: `1px solid ${TOKENS.lineSoft}`, marginTop: 4 }}>
        <Field label={t('newMaterialForm.fieldOpeningStock')} optional><NumInput value={openingStock} onChange={setOpeningStock} suffix={autoUnit} /></Field>
        <Field label={t('newMaterialForm.fieldMinStock')} optional><NumInput value={minimum} onChange={setMinimum} suffix={autoUnit} /></Field>
      </div>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.adding') : t('newMaterialForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

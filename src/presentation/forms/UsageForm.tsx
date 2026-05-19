import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { DateInput } from './primitives/DateInput.tsx';
import { TextArea } from './primitives/TextArea.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { MaterialPicker } from './MaterialPicker.tsx';
import { WorkerPicker } from './WorkerPicker.tsx';
import { UsageSuccess } from './UsageSuccess.tsx';
import { todayIso } from './shared/todayIso.ts';
import { useStore } from '../store/store.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';
import type { Material, Worker } from '../../types/index.ts';

interface UsageFormProps {
  presetId?: string;
  goBack: () => void;
}

interface UsageSnapshot {
  material: Material;
  quantity: string;
  worker: Worker | null | undefined;
  jobDescription: string;
  date: string;
}

export function UsageForm({ presetId, goBack }: UsageFormProps) {
  const { getMaterial, getWorker, addUsage } = useStore();
  const [materialId, setMaterialId] = useState(presetId || '');
  const [quantity, setQuantity] = useState('');
  const [workerId, setWorkerId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [date, setDate] = useState(todayIso());
  const [submitted, setSubmitted] = useState(false);
  const [snapshot, setSnapshot] = useState<UsageSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const material = materialId ? getMaterial(materialId) : null;
  const worker = workerId ? getWorker(workerId) : null;
  const isInsufficient = !!(material && quantity && Number(quantity) > material.stock);
  const valid = materialId && quantity && Number(quantity) > 0 && workerId && jobDescription.trim().length > 2;

  const submit = async () => {
    if (!valid || isInsufficient || loading) return;
    setLoading(true); setError('');
    try {
      await addUsage({ materialId, quantity, date, workerId, jobDescription });
      if (material) setSnapshot({ material, quantity, worker, jobDescription, date });
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && snapshot) return <UsageSuccess {...snapshot} goBack={goBack} />;

  return (
    <FormShell title={t('usageForm.title')} altTitle={t('usageForm.subtitle')}>
      <Field label={t('usageForm.fieldMaterial')}><MaterialPicker value={materialId} onChange={setMaterialId} /></Field>
      {material && (
        <div style={{ background: TOKENS.steelSoft, borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <MaterialGlyph material={material} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, color: TOKENS.ink }}>{getMaterialName(material)}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkSoft }}>
              {t('usageForm.currentStock').replace('{stock}', String(material.stock)).replace('{unit}', material.unit)}
              {quantity && Number(quantity) > 0 && (
                <> → <span style={{ color: isInsufficient ? TOKENS.low : TOKENS.accent, fontWeight: 600 }}>{material.stock - Number(quantity)} {material.unit}</span></>
              )}
            </div>
          </div>
        </div>
      )}
      <Field label={material ? t('usageForm.fieldQuantityWithUnit').replace('{unit}', material.unit) : t('usageForm.fieldQuantity')} hint={isInsufficient ? t('usageForm.fieldInsufficient') : null}>
        <NumInput value={quantity} onChange={setQuantity} suffix={material?.unit} warn={isInsufficient} />
      </Field>
      <Field label={t('usageForm.fieldWorker')}><WorkerPicker value={workerId} onChange={setWorkerId} /></Field>
      <Field label={t('usageForm.fieldJob')}><TextArea value={jobDescription} onChange={setJobDescription} placeholder={t('usageForm.jobPlaceholder')} /></Field>
      <Field label={t('usageForm.fieldDate')}><DateInput value={date} onChange={setDate} /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || !!isInsufficient || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !isInsufficient && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('usageForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

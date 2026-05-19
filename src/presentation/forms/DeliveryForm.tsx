import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { DateInput } from './primitives/DateInput.tsx';
import { TextInput } from './primitives/TextInput.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { MaterialPicker } from './MaterialPicker.tsx';
import { DeliverySuccess } from './DeliverySuccess.tsx';
import { todayIso } from './shared/todayIso.ts';
import { useStore } from '../store/store.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';
import type { Material } from '../../types/index.ts';

interface DeliveryFormProps {
  presetId?: string;
  goBack: () => void;
}

interface DeliverySnapshot {
  material: Material;
  quantity: string;
  date: string;
}

export function DeliveryForm({ presetId, goBack }: DeliveryFormProps) {
  const { getMaterial, addDelivery } = useStore();
  const [materialId, setMaterialId] = useState(presetId || '');
  const [quantity, setQuantity] = useState('');
  const [date, setDate] = useState(todayIso());
  const [receiptNo, setReceiptNo] = useState('');
  const [supplier, setSupplier] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [snapshot, setSnapshot] = useState<DeliverySnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const material = materialId ? getMaterial(materialId) : null;
  const valid = materialId && quantity && Number(quantity) > 0;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await addDelivery({ materialId, quantity, date, supplier, receiptNo });
      if (material) setSnapshot({ material, quantity, date });
      setSubmitted(true);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && snapshot) return <DeliverySuccess {...snapshot} goBack={goBack} />;

  return (
    <FormShell title={t('deliveryForm.title')} altTitle={t('deliveryForm.subtitle')}>
      <Field label={t('deliveryForm.fieldMaterial')}><MaterialPicker value={materialId} onChange={setMaterialId} /></Field>
      {material && (
        <div style={{ background: TOKENS.steelSoft, borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <MaterialGlyph material={material} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, color: TOKENS.ink }}>{getMaterialName(material)}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkSoft }}>
              {t('deliveryForm.currentStock').replace('{stock}', String(material.stock)).replace('{unit}', material.unit)}
              {quantity && Number(quantity) > 0 && (
                <> → <span style={{ color: TOKENS.ok, fontWeight: 600 }}>{material.stock + Number(quantity)} {material.unit}</span></>
              )}
            </div>
          </div>
        </div>
      )}
      <Field label={material ? t('deliveryForm.fieldQuantityWithUnit').replace('{unit}', material.unit) : t('deliveryForm.fieldQuantity')}>
        <NumInput value={quantity} onChange={setQuantity} suffix={material?.unit} />
      </Field>
      <Field label={t('deliveryForm.fieldDate')}><DateInput value={date} onChange={setDate} /></Field>
      <Field label={t('deliveryForm.fieldSupplier')} optional><TextInput value={supplier} onChange={setSupplier} placeholder={t('deliveryForm.supplierPlaceholder')} /></Field>
      <Field label={t('deliveryForm.fieldReceiptNo')} optional><TextInput value={receiptNo} onChange={setReceiptNo} placeholder="F-2026-…" mono /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4, background: TOKENS.ok }}>
          {loading ? t('common.saving') : t('deliveryForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

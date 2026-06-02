import { useState } from 'react';
import { TOKENS, btnPrimaryStyle, btnGhostStyle } from '../components/ui/tokens.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { DateInput } from './primitives/DateInput.tsx';
import { TextInput } from './primitives/TextInput.tsx';
import { TextArea } from './primitives/TextArea.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { MaterialPicker } from './MaterialPicker.tsx';
import { todayIso } from './shared/todayIso.ts';
import { useStore } from '../store/store.tsx';
import { t } from '../../i18n/tr.ts';

interface Row { key: number; materialId: string; quantity: string; }

let rowSeq = 1;
const newRow = (): Row => ({ key: rowSeq++, materialId: '', quantity: '' });

interface NewOrderFormProps {
  goBack: () => void;
}

export function NewOrderForm({ goBack }: NewOrderFormProps) {
  const { getMaterial, addOrder } = useStore();
  const today = todayIso();
  const [orderDate, setOrderDate] = useState(today);
  const [supplier, setSupplier] = useState('');
  const [note, setNote] = useState('');
  const [rows, setRows] = useState<Row[]>([newRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setRow = (key: number, patch: Partial<Row>) => setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => (rs.length >= 15 ? rs : [...rs, newRow()]));
  const removeRow = (key: number) => setRows((rs) => (rs.length <= 1 ? rs : rs.filter((r) => r.key !== key)));

  const filled = rows.filter((r) => r.materialId && Number(r.quantity) > 0);
  const dateInPast = orderDate < today;
  const valid = !!orderDate && !dateInPast && filled.length > 0;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await addOrder({
        orderDate, supplier, note,
        items: filled.map((r) => ({ materialId: r.materialId, quantity: Number(r.quantity) })),
      });
      goBack();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title={t('newOrderForm.title')} altTitle={t('newOrderForm.subtitle')}>
      <Field label={t('newOrderForm.fieldDate')} hint={dateInPast ? t('newOrderForm.pastDate') : null}>
        <DateInput value={orderDate} onChange={setOrderDate} />
      </Field>
      <Field label={t('newOrderForm.fieldSupplier')} optional><TextInput value={supplier} onChange={setSupplier} placeholder={t('deliveryForm.supplierPlaceholder')} /></Field>

      <div style={{ borderTop: `1px solid ${TOKENS.lineSoft}`, paddingTop: 8 }}>
        <div style={{ fontFamily: TOKENS.font, fontSize: 13, fontWeight: 600, color: TOKENS.ink, marginBottom: 8 }}>{t('newOrderForm.items')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map((r) => {
            const m = r.materialId ? getMaterial(r.materialId) : null;
            return (
              <div key={r.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 10, padding: 10 }}>
                <MaterialPicker value={r.materialId} onChange={(id) => setRow(r.key, { materialId: id })} />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}><NumInput value={r.quantity} onChange={(v) => setRow(r.key, { quantity: v })} suffix={m?.unit} /></div>
                  <button onClick={() => removeRow(r.key)} disabled={rows.length <= 1} title={t('batchUsageForm.removeRow')} style={{ appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.bg, width: 38, height: 38, borderRadius: 8, cursor: rows.length <= 1 ? 'default' : 'pointer', color: TOKENS.inkSoft, opacity: rows.length <= 1 ? 0.4 : 1 }}>×</button>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={addRow} disabled={rows.length >= 15} style={{ ...btnGhostStyle, marginTop: 10, width: '100%', opacity: rows.length >= 15 ? 0.4 : 1 }}>{t('newOrderForm.addRow')}</button>
      </div>

      <Field label={t('newOrderForm.fieldNote')} optional><TextArea value={note} onChange={setNote} placeholder={t('newOrderForm.notePlaceholder')} /></Field>

      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('newOrderForm.btnSave')}
        </button>
      </div>
    </FormShell>
  );
}

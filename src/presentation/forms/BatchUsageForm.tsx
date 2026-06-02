import { useState } from 'react';
import { TOKENS, btnPrimaryStyle, btnGhostStyle } from '../components/ui/tokens.tsx';
import { FormShell } from './FormShell.tsx';
import { Field } from './primitives/Field.tsx';
import { NumInput } from './primitives/NumInput.tsx';
import { DateInput } from './primitives/DateInput.tsx';
import { TextArea } from './primitives/TextArea.tsx';
import { ErrorBanner } from './primitives/ErrorBanner.tsx';
import { MaterialPicker } from './MaterialPicker.tsx';
import { WorkerPicker } from './WorkerPicker.tsx';
import { todayIso } from './shared/todayIso.ts';
import { useStore } from '../store/store.tsx';
import { t } from '../../i18n/tr.ts';

interface Row { key: number; materialId: string; quantity: string; }

let rowSeq = 1;
const newRow = (): Row => ({ key: rowSeq++, materialId: '', quantity: '' });

interface BatchUsageFormProps {
  goBack: () => void;
}

export function BatchUsageForm({ goBack }: BatchUsageFormProps) {
  const { getMaterial, addUsageBatch } = useStore();
  const [workerId, setWorkerId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [date, setDate] = useState(todayIso());
  const [rows, setRows] = useState<Row[]>([newRow()]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const setRow = (key: number, patch: Partial<Row>) =>
    setRows((rs) => rs.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const addRow = () => setRows((rs) => (rs.length >= 10 ? rs : [...rs, newRow()]));
  const removeRow = (key: number) => setRows((rs) => (rs.length <= 1 ? rs : rs.filter((r) => r.key !== key)));

  const filled = rows.filter((r) => r.materialId && Number(r.quantity) > 0);
  const anyInsufficient = rows.some((r) => {
    const m = r.materialId ? getMaterial(r.materialId) : null;
    return m && r.quantity && Number(r.quantity) > m.stock;
  });
  const valid = workerId && jobDescription.trim().length > 2 && date && filled.length > 0 && !anyInsufficient;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await addUsageBatch({
        workerId, date, jobDescription,
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
    <FormShell title={t('batchUsageForm.title')} altTitle={t('batchUsageForm.subtitle')}>
      <Field label={t('usageForm.fieldWorker')}><WorkerPicker value={workerId} onChange={setWorkerId} /></Field>
      <Field label={t('usageForm.fieldJob')}><TextArea value={jobDescription} onChange={setJobDescription} placeholder={t('usageForm.jobPlaceholder')} /></Field>
      <Field label={t('usageForm.fieldDate')}><DateInput value={date} onChange={setDate} /></Field>

      <div style={{ borderTop: `1px solid ${TOKENS.lineSoft}`, paddingTop: 8 }}>
        <div style={{ fontFamily: TOKENS.font, fontSize: 13, fontWeight: 600, color: TOKENS.ink, marginBottom: 8 }}>{t('batchUsageForm.materials')}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map((r) => {
            const m = r.materialId ? getMaterial(r.materialId) : null;
            const insufficient = !!(m && r.quantity && Number(r.quantity) > m.stock);
            return (
              <div key={r.key} style={{ display: 'flex', flexDirection: 'column', gap: 6, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 10, padding: 10 }}>
                <MaterialPicker value={r.materialId} onChange={(id) => setRow(r.key, { materialId: id })} />
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <NumInput value={r.quantity} onChange={(v) => setRow(r.key, { quantity: v })} suffix={m?.unit} warn={insufficient} />
                  </div>
                  <button onClick={() => removeRow(r.key)} disabled={rows.length <= 1} title={t('batchUsageForm.removeRow')} style={{ appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.bg, width: 38, height: 38, borderRadius: 8, cursor: rows.length <= 1 ? 'default' : 'pointer', color: TOKENS.inkSoft, opacity: rows.length <= 1 ? 0.4 : 1 }}>×</button>
                </div>
                {m && (
                  <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: insufficient ? TOKENS.low : TOKENS.inkMuted }}>
                    {t('usageForm.currentStock').replace('{stock}', String(m.stock)).replace('{unit}', m.unit)}
                    {insufficient && ` · ${t('usageForm.fieldInsufficient')}`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <button onClick={addRow} disabled={rows.length >= 10} style={{ ...btnGhostStyle, marginTop: 10, width: '100%', opacity: rows.length >= 10 ? 0.4 : 1 }}>{t('batchUsageForm.addRow')}</button>
      </div>

      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('batchUsageForm.btnSave').replace('{count}', String(filled.length))}
        </button>
      </div>
    </FormShell>
  );
}

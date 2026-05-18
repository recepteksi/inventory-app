import React, { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { FormShell } from './FormShell.jsx';
import { Field } from './primitives/Field.jsx';
import { TextInput } from './primitives/TextInput.jsx';
import { DateInput } from './primitives/DateInput.jsx';
import { ChipPicker } from './primitives/ChipPicker.jsx';
import { ErrorBanner } from './primitives/ErrorBanner.jsx';
import { useStore } from '../store/store.jsx';

/**
 * Edit existing worker form.
 * @param {object} props
 * @param {string} props.id - ID of the worker to edit
 * @param {() => void} props.goBack - Called after save or cancel
 */
export function DuzenleUstaForm({ id, goBack }) {
  const { getUsta, editUsta } = useStore();
  const u = getUsta(id);

  const [ad, setAd] = useState(u?.ad ?? '');
  const [uzmanlik, setUzmanlik] = useState(u?.uzmanlik ?? '');
  const [baslangic, setBaslangic] = useState(u?.baslangic ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!u) return <div style={{ padding: 24, fontFamily: TOKENS.font, color: TOKENS.inkSoft }}>Usta bulunamadı.</div>;

  const valid = ad.trim().length > 2 && uzmanlik && baslangic;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await editUsta(id, { ad, uzmanlik, baslangic });
      goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title="Usta Düzenle" altTitle={u.ad}>
      <Field label="Ad Soyad"><TextInput value={ad} onChange={setAd} placeholder="ör. Hasan Yıldız" /></Field>
      <Field label="Uzmanlık"><ChipPicker value={uzmanlik} onChange={setUzmanlik} options={['Kaynak', 'Tesisat', 'Montaj', 'Boya', 'Elektrik', 'Diğer']} /></Field>
      <Field label="İşe Başlangıç"><DateInput value={baslangic} onChange={setBaslangic} /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </FormShell>
  );
}

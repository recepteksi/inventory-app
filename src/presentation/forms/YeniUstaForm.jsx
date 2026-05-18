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
 * Add new team member form.
 * Calls goBack directly after a successful save (no separate success screen).
 * @param {object} props
 * @param {() => void} props.goBack - Called when the add completes or is cancelled
 */
export function YeniUstaForm({ goBack }) {
  const { addUsta } = useStore();
  const [ad, setAd] = useState('');
  const [uzmanlik, setUzmanlik] = useState('');
  const [baslangic, setBaslangic] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const valid = ad.trim().length > 2 && uzmanlik && baslangic;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await addUsta({ ad, uzmanlik, baslangic });
      goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title="Yeni Usta" altTitle="Ekip üyesi ekle">
      <Field label="Ad Soyad"><TextInput value={ad} onChange={setAd} placeholder="ör. Hasan Yıldız" /></Field>
      <Field label="Uzmanlık"><ChipPicker value={uzmanlik} onChange={setUzmanlik} options={['Kaynak', 'Tesisat', 'Montaj', 'Boya', 'Elektrik', 'Diğer']} /></Field>
      <Field label="İşe Başlangıç"><DateInput value={baslangic} onChange={setBaslangic} /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? 'Ekleniyor…' : 'Usta ekle'}
        </button>
      </div>
    </FormShell>
  );
}

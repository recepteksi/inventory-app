import React, { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { MalzemeGlyph } from '../components/ui/MalzemeGlyph.jsx';
import { FormShell } from './FormShell.jsx';
import { Field } from './primitives/Field.jsx';
import { NumInput } from './primitives/NumInput.jsx';
import { DateInput } from './primitives/DateInput.jsx';
import { TextArea } from './primitives/TextArea.jsx';
import { ErrorBanner } from './primitives/ErrorBanner.jsx';
import { MalzemeSecici } from './MalzemeSecici.jsx';
import { UstaSecici } from './UstaSecici.jsx';
import { KullanimBasarili } from './KullanimBasarili.jsx';
import { todayIso } from './shared/todayIso.js';
import { useStore } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

/**
 * Material usage form — records material consumed in production.
 * Shows a warning and blocks saving if stock is insufficient.
 * @param {object} props
 * @param {string} [props.presetId] - Pre-selected material ID
 * @param {() => void} props.goBack - Form close handler
 */
export function KullanimForm({ presetId, goBack }) {
  const { getMalzeme, getUsta, addKullanim } = useStore();
  const [malzemeId, setMalzemeId] = useState(presetId || '');
  const [miktar, setMiktar] = useState('');
  const [ustaId, setUstaId] = useState('');
  const [is, setIs] = useState('');
  const [tarih, setTarih] = useState(todayIso());
  const [submitted, setSubmitted] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const m = malzemeId ? getMalzeme(malzemeId) : null;
  const usta = ustaId ? getUsta(ustaId) : null;
  const yetersiz = m && miktar && Number(miktar) > m.stok;
  const valid = malzemeId && miktar && Number(miktar) > 0 && ustaId && is.trim().length > 2;

  const submit = async () => {
    if (!valid || yetersiz || loading) return;
    setLoading(true); setError('');
    try {
      await addKullanim({ malzemeId, miktar, tarih, ustaId, is });
      setSnapshot({ m, miktar, usta, is, tarih });
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && snapshot) return <KullanimBasarili {...snapshot} goBack={goBack} />;

  return (
    <FormShell title="Kullanım Kaydet" altTitle="Üretimde kullanılan malzeme">
      <Field label="Malzeme"><MalzemeSecici value={malzemeId} onChange={setMalzemeId} /></Field>
      {m && (
        <div style={{ background: TOKENS.steelSoft, borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <MalzemeGlyph malzeme={m} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, color: TOKENS.ink }}>{getMalzemeAd(m)}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkSoft }}>
              Mevcut: {m.stok} {m.birim}
              {miktar && Number(miktar) > 0 && (
                <> → <span style={{ color: yetersiz ? TOKENS.low : TOKENS.accent, fontWeight: 600 }}>{m.stok - Number(miktar)} {m.birim}</span></>
              )}
            </div>
          </div>
        </div>
      )}
      <Field label={`Miktar${m ? ` (${m.birim})` : ''}`} hint={yetersiz ? 'Stok yetersiz!' : null}>
        <NumInput value={miktar} onChange={setMiktar} suffix={m?.birim} warn={yetersiz} />
      </Field>
      <Field label="Kullanan Usta"><UstaSecici value={ustaId} onChange={setUstaId} /></Field>
      <Field label="Yapılan İş"><TextArea value={is} onChange={setIs} placeholder="ör. 4. kat radyatör hattı dönüş kolları" /></Field>
      <Field label="Tarih"><DateInput value={tarih} onChange={setTarih} /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || !!yetersiz || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !yetersiz && !loading ? 1 : 0.4 }}>
          {loading ? 'Kaydediliyor…' : 'Kullanım kaydet'}
        </button>
      </div>
    </FormShell>
  );
}

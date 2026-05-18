import React, { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { MalzemeGlyph } from '../components/ui/MalzemeGlyph.jsx';
import { FormShell } from './FormShell.jsx';
import { Field } from './primitives/Field.jsx';
import { NumInput } from './primitives/NumInput.jsx';
import { DateInput } from './primitives/DateInput.jsx';
import { TextInput } from './primitives/TextInput.jsx';
import { ErrorBanner } from './primitives/ErrorBanner.jsx';
import { MalzemeSecici } from './MalzemeSecici.jsx';
import { GelisBasarili } from './GelisBasarili.jsx';
import { todayIso } from './shared/todayIso.js';
import { useStore } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

/**
 * Incoming delivery form — records a material receipt from a supplier.
 * Shows the GelisBasarili summary screen after a successful save.
 * @param {object} props
 * @param {string} [props.presetId] - Pre-selected material ID (populated when opened from a stock row)
 * @param {() => void} props.goBack - Form close / drawer close handler
 */
export function GelisForm({ presetId, goBack }) {
  const { getMalzeme, addGelis } = useStore();
  const [malzemeId, setMalzemeId] = useState(presetId || '');
  const [miktar, setMiktar] = useState('');
  const [tarih, setTarih] = useState(todayIso());
  const [fis, setFis] = useState('');
  const [tedarikci, setTedarikci] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const m = malzemeId ? getMalzeme(malzemeId) : null;
  const valid = malzemeId && miktar && Number(miktar) > 0;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await addGelis({ malzemeId, miktar, tarih, tedarikci, fis });
      setSnapshot({ m, miktar, tarih });
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted && snapshot) return <GelisBasarili {...snapshot} goBack={goBack} />;

  return (
    <FormShell title="Yeni Geliş" altTitle="Tedarikten malzeme girişi">
      <Field label="Malzeme"><MalzemeSecici value={malzemeId} onChange={setMalzemeId} /></Field>
      {m && (
        <div style={{ background: TOKENS.steelSoft, borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
          <MalzemeGlyph malzeme={m} size={36} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, color: TOKENS.ink }}>{getMalzemeAd(m)}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkSoft }}>
              Mevcut: {m.stok} {m.birim}
              {miktar && Number(miktar) > 0 && (
                <> → <span style={{ color: TOKENS.ok, fontWeight: 600 }}>{m.stok + Number(miktar)} {m.birim}</span></>
              )}
            </div>
          </div>
        </div>
      )}
      <Field label={`Miktar${m ? ` (${m.birim})` : ''}`}>
        <NumInput value={miktar} onChange={setMiktar} suffix={m?.birim} />
      </Field>
      <Field label="Geliş Tarihi"><DateInput value={tarih} onChange={setTarih} /></Field>
      <Field label="Tedarikçi" optional><TextInput value={tedarikci} onChange={setTedarikci} placeholder="ör. Borsan Çelik" /></Field>
      <Field label="Fiş No" optional><TextInput value={fis} onChange={setFis} placeholder="F-2026-…" mono /></Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4, background: TOKENS.ok }}>
          {loading ? 'Kaydediliyor…' : 'Geliş kaydet'}
        </button>
      </div>
    </FormShell>
  );
}

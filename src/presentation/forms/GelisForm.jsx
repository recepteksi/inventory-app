import React, { useState } from 'react';
import { TOKENS, IconCheck, MalzemeGlyph, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { FormShell, Field, NumInput, DateInput, TextInput, ErrorBanner } from './FormShell.jsx';
import { MalzemeSecici } from './MalzemeSecici.jsx';
import { useStore, fmtTarih } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

function todayIso() { return new Date().toISOString().slice(0, 10); }

function Basarili({ miktar, m, tarih, goBack }) {
  return (
    <div style={{ padding:'60px 24px 100px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ width:72, height:72, borderRadius:999, background:TOKENS.okSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <IconCheck size={36} color={TOKENS.ok}/>
      </div>
      <h2 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:22, margin:0, color:TOKENS.ink }}>Geliş kaydedildi</h2>
      <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:14, padding:16, width:'100%', textAlign:'left' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <MalzemeGlyph malzeme={m} size={40}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:15, color:TOKENS.ink }}>{getMalzemeAd(m)}</div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:14, fontWeight:600, color:TOKENS.ok }}>+{miktar} {m.birim}</div>
          </div>
        </div>
        <div style={{ marginTop:10, fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted, letterSpacing:0.5, textTransform:'uppercase' }}>{fmtTarih(tarih)}</div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding:'12px 30px' }}>Tamam</button>
    </div>
  );
}

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

  if (submitted && snapshot) return <Basarili {...snapshot} goBack={goBack}/>;

  return (
    <FormShell title="Yeni Geliş" altTitle="Tedarikten malzeme girişi">
      <Field label="Malzeme"><MalzemeSecici value={malzemeId} onChange={setMalzemeId}/></Field>
      {m && (
        <div style={{ background:TOKENS.steelSoft, borderRadius:10, padding:10, display:'flex', alignItems:'center', gap:10 }}>
          <MalzemeGlyph malzeme={m} size={36}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:14, color:TOKENS.ink }}>{getMalzemeAd(m)}</div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkSoft }}>
              Mevcut: {m.stok} {m.birim}
              {miktar && Number(miktar) > 0 && <> → <span style={{ color:TOKENS.ok, fontWeight:600 }}>{m.stok + Number(miktar)} {m.birim}</span></>}
            </div>
          </div>
        </div>
      )}
      <Field label={`Miktar${m ? ` (${m.birim})` : ''}`}><NumInput value={miktar} onChange={setMiktar} suffix={m?.birim}/></Field>
      <Field label="Geliş Tarihi"><DateInput value={tarih} onChange={setTarih}/></Field>
      <Field label="Tedarikçi" optional><TextInput value={tedarikci} onChange={setTedarikci} placeholder="ör. Borsan Çelik"/></Field>
      <Field label="Fiş No" optional><TextInput value={fis} onChange={setFis} placeholder="F-2026-…" mono/></Field>
      <ErrorBanner message={error}/>
      <div style={{ position:'sticky', bottom:0, padding:'12px 0 0', background:`linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width:'100%', padding:'14px', opacity:valid&&!loading?1:0.4, background:TOKENS.ok }}>
          {loading ? 'Kaydediliyor…' : 'Geliş kaydet'}
        </button>
      </div>
    </FormShell>
  );
}

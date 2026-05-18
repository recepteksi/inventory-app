import React, { useState } from 'react';
import { TOKENS, IconCheck, MalzemeGlyph, UstaAvatar, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { FormShell, Field, NumInput, DateInput, TextArea, ErrorBanner } from './FormShell.jsx';
import { MalzemeSecici } from './MalzemeSecici.jsx';
import { UstaSecici } from './UstaSecici.jsx';
import { useStore, fmtTarih } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

function todayIso() { return new Date().toISOString().slice(0, 10); }

function Basarili({ miktar, m, usta, is, tarih, goBack }) {
  return (
    <div style={{ padding:'60px 24px 100px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ width:72, height:72, borderRadius:999, background:TOKENS.accentSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <IconCheck size={36} color={TOKENS.accent}/>
      </div>
      <h2 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:22, margin:0, color:TOKENS.ink }}>Kullanım kaydedildi</h2>
      <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:14, padding:16, width:'100%', textAlign:'left' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <MalzemeGlyph malzeme={m} size={40}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:15, color:TOKENS.ink }}>{getMalzemeAd(m)}</div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:14, fontWeight:600, color:TOKENS.accent }}>−{miktar} {m.birim}</div>
          </div>
        </div>
        {usta && (
          <div style={{ marginTop:10, padding:'10px 0 0', borderTop:`1px solid ${TOKENS.lineSoft}` }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <UstaAvatar usta={usta} size={24}/>
              <span style={{ fontFamily:TOKENS.font, fontSize:13, color:TOKENS.ink, fontWeight:600 }}>{usta.ad}</span>
              <span style={{ fontFamily:TOKENS.font, fontSize:13, color:TOKENS.inkSoft }}>· {usta.uzmanlik}</span>
            </div>
            <div style={{ fontFamily:TOKENS.font, fontSize:13, color:TOKENS.ink, marginTop:4, lineHeight:1.4 }}>{is}</div>
          </div>
        )}
        <div style={{ marginTop:10, fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted, letterSpacing:0.5, textTransform:'uppercase' }}>{fmtTarih(tarih)}</div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding:'12px 30px' }}>Tamam</button>
    </div>
  );
}

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

  if (submitted && snapshot) return <Basarili {...snapshot} goBack={goBack}/>;

  return (
    <FormShell title="Kullanım Kaydet" altTitle="Üretimde kullanılan malzeme">
      <Field label="Malzeme"><MalzemeSecici value={malzemeId} onChange={setMalzemeId}/></Field>
      {m && (
        <div style={{ background:TOKENS.steelSoft, borderRadius:10, padding:10, display:'flex', alignItems:'center', gap:10 }}>
          <MalzemeGlyph malzeme={m} size={36}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:14, color:TOKENS.ink }}>{getMalzemeAd(m)}</div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkSoft }}>
              Mevcut: {m.stok} {m.birim}
              {miktar && Number(miktar) > 0 && <> → <span style={{ color:yetersiz?TOKENS.low:TOKENS.accent, fontWeight:600 }}>{m.stok - Number(miktar)} {m.birim}</span></>}
            </div>
          </div>
        </div>
      )}
      <Field label={`Miktar${m ? ` (${m.birim})` : ''}`} hint={yetersiz ? 'Stok yetersiz!' : null}>
        <NumInput value={miktar} onChange={setMiktar} suffix={m?.birim} warn={yetersiz}/>
      </Field>
      <Field label="Kullanan Usta"><UstaSecici value={ustaId} onChange={setUstaId}/></Field>
      <Field label="Yapılan İş"><TextArea value={is} onChange={setIs} placeholder="ör. 4. kat radyatör hattı dönüş kolları"/></Field>
      <Field label="Tarih"><DateInput value={tarih} onChange={setTarih}/></Field>
      <ErrorBanner message={error}/>
      <div style={{ position:'sticky', bottom:0, padding:'12px 0 0', background:`linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || !!yetersiz || loading} style={{ ...btnPrimaryStyle, width:'100%', padding:'14px', opacity:valid&&!yetersiz&&!loading?1:0.4 }}>
          {loading ? 'Kaydediliyor…' : 'Kullanım kaydet'}
        </button>
      </div>
    </FormShell>
  );
}

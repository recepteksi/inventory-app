import React, { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { FormShell, Field, TextInput, NumInput, ChipPicker, ErrorBanner } from './FormShell.jsx';
import { useStore } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

export function DuzenleMalzemeForm({ id, goBack }) {
  const { getMalzeme, editMalzeme } = useStore();
  const m = getMalzeme(id);

  const [minimum, setMinimum] = useState(String(m?.minimum ?? ''));
  const [ad, setAd] = useState(m?.ad ?? '');
  const [kategori, setKategori] = useState(m?.kategori ?? '');
  const [birim, setBirim] = useState(m?.birim ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!m) return <div style={{ padding:24, fontFamily:TOKENS.font, color:TOKENS.inkSoft }}>Malzeme bulunamadı.</div>;

  const isBoru = m.grup === 'boru';
  const valid = minimum && Number(minimum) >= 0 && (isBoru || (ad.trim().length > 1 && kategori && birim));

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      await editMalzeme(id, { minimum, ad, kategori, birim });
      goBack();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title="Malzeme Düzenle" altTitle={getMalzemeAd(m)}>
      {isBoru ? (
        <>
          <div style={{ background:TOKENS.lineSoft, borderRadius:10, padding:'10px 14px' }}>
            <div style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted, letterSpacing:0.5, marginBottom:4 }}>Sabit özellikler (değiştirilemez)</div>
            <div style={{ fontFamily:TOKENS.font, fontSize:14, color:TOKENS.ink }}>{m.cap} · {m.cins} · {m.tur} · {m.birim}</div>
          </div>
          <Field label="Minimum Stok"><NumInput value={minimum} onChange={setMinimum} suffix={m.birim}/></Field>
        </>
      ) : (
        <>
          <Field label="Malzeme Adı"><TextInput value={ad} onChange={setAd} placeholder="Malzeme adı"/></Field>
          <Field label="Kategori"><ChipPicker value={kategori} onChange={setKategori} options={['Elektrod','Boya','Bağlantı','Sarf','Diğer']}/></Field>
          <Field label="Birim"><ChipPicker value={birim} onChange={setBirim} options={['adet','paket','litre','kg','m']}/></Field>
          <Field label="Minimum Stok"><NumInput value={minimum} onChange={setMinimum} suffix={birim}/></Field>
        </>
      )}
      <ErrorBanner message={error}/>
      <div style={{ position:'sticky', bottom:0, padding:'12px 0 0', background:`linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width:'100%', padding:'14px', opacity:valid&&!loading?1:0.4 }}>
          {loading ? 'Kaydediliyor…' : 'Kaydet'}
        </button>
      </div>
    </FormShell>
  );
}

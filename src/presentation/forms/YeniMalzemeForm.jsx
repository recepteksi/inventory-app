import React, { useState } from 'react';
import { TOKENS, IconCheck, MalzemeGlyph, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { FormShell, Field, TextInput, NumInput, ErrorBanner, ChipPicker, SegmentControl } from './FormShell.jsx';
import { useStore } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

function Basarili({ yeniAd, grup, birim, baslangic, minimum, goBack }) {
  return (
    <div style={{ padding:'60px 24px 100px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
      <div style={{ width:72, height:72, borderRadius:999, background:TOKENS.okSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>
        <IconCheck size={36} color={TOKENS.ok}/>
      </div>
      <h2 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:22, margin:0, color:TOKENS.ink }}>Malzeme kataloga eklendi</h2>
      <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:14, padding:16, width:'100%', textAlign:'left' }}>
        <div style={{ fontFamily:TOKENS.mono, fontSize:10, color:TOKENS.inkMuted, letterSpacing:1, textTransform:'uppercase' }}>
          {grup === 'boru' ? 'Boru & Fittings' : 'Diğer Malzeme'}
        </div>
        <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:17, color:TOKENS.ink, marginTop:2 }}>{yeniAd}</div>
        <div style={{ marginTop:12, paddingTop:10, borderTop:`1px solid ${TOKENS.lineSoft}`, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          <div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:10, color:TOKENS.inkMuted, letterSpacing:0.6 }}>AÇILIŞ</div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:17, fontWeight:600, color:TOKENS.ink }}>{baslangic||0} <span style={{ fontSize:11, color:TOKENS.inkMuted }}>{birim}</span></div>
          </div>
          <div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:10, color:TOKENS.inkMuted, letterSpacing:0.6 }}>MİNİMUM</div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:17, fontWeight:600, color:TOKENS.ink }}>{minimum} <span style={{ fontSize:11, color:TOKENS.inkMuted }}>{birim}</span></div>
          </div>
        </div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding:'12px 30px' }}>Tamam</button>
    </div>
  );
}

export function YeniMalzemeForm({ preset, goBack }) {
  const { boruFittings, digerMalzeme, addMalzeme } = useStore();
  const [grup, setGrup] = useState(preset?.grup || 'boru');
  const [cap, setCap] = useState('');
  const [tur, setTur] = useState('');
  const [cins, setCins] = useState('');
  const [kategori, setKategori] = useState('');
  const [ad, setAd] = useState('');
  const [birim, setBirim] = useState('');
  const [baslangic, setBaslangic] = useState('');
  const [minimum, setMinimum] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isBoru = grup === 'boru';
  const otoBirim = isBoru ? (tur === 'Boru' ? 'm' : 'adet') : birim;
  const valid = isBoru ? cap && tur && cins && minimum : kategori && ad.trim().length > 1 && birim && minimum;
  const cakisma = isBoru && cap && tur && cins
    ? boruFittings.find((m) => m.cap === cap && m.tur === tur && m.cins === cins)
    : !isBoru && ad ? digerMalzeme.find((m) => m.ad.toLowerCase() === ad.toLowerCase()) : null;

  const submit = async () => {
    if (!valid || cakisma || loading) return;
    setLoading(true); setError('');
    try {
      await addMalzeme({ grup, cap, tur, cins, kategori, ad, birim, baslangic, minimum });
      setSubmitted(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    const yeniAd = isBoru ? `${cap} ${cins} ${tur}` : ad;
    return <Basarili yeniAd={yeniAd} grup={grup} birim={otoBirim} baslangic={baslangic} minimum={minimum} goBack={goBack}/>;
  }

  return (
    <FormShell title="Yeni Malzeme" altTitle="Katalog tanımı">
      <Field label="Malzeme Grubu">
        <SegmentControl value={grup} onChange={setGrup} options={[{ value:'boru', label:'Boru & Fittings' }, { value:'diger', label:'Diğer Malzeme' }]}/>
      </Field>
      {isBoru ? (
        <>
          <Field label="Çap"><ChipPicker value={cap} onChange={setCap} options={['1"','2"','3"','4"','6"']}/></Field>
          <Field label="Tür"><ChipPicker value={tur} onChange={setTur} options={['Boru','Dirsek','Tee','Manşon']}/></Field>
          <Field label="Cins"><ChipPicker value={cins} onChange={setCins} options={['Siyah','Galvaniz','Paslanmaz']}/></Field>
          {cap && tur && cins && (
            <div style={{ background:cakisma?TOKENS.lowSoft:TOKENS.steelSoft, border:`1px solid ${cakisma?TOKENS.low:'transparent'}`, borderRadius:10, padding:12, display:'flex', alignItems:'center', gap:12 }}>
              <MalzemeGlyph malzeme={{ tur, cap, cins }} size={40}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:TOKENS.mono, fontSize:10, color:TOKENS.inkMuted, letterSpacing:1, textTransform:'uppercase' }}>{cakisma?'Zaten var':'Önizleme'}</div>
                <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:15, color:TOKENS.ink, marginTop:2 }}>{cap} {cins} {tur}</div>
                <div style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkSoft, marginTop:2 }}>
                  {cakisma ? `Mevcut stok: ${cakisma.stok} ${cakisma.birim}` : `Birim: ${otoBirim}`}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <Field label="Kategori"><ChipPicker value={kategori} onChange={setKategori} options={['Elektrod','Boya','Bağlantı','Sarf','Diğer']}/></Field>
          <Field label="Malzeme Adı"><TextInput value={ad} onChange={setAd} placeholder="ör. Rutil Elektrod Ø4.0"/></Field>
          <Field label="Birim"><ChipPicker value={birim} onChange={setBirim} options={['adet','paket','litre','kg','m']}/></Field>
        </>
      )}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, paddingTop:4, borderTop:`1px solid ${TOKENS.lineSoft}`, marginTop:4 }}>
        <Field label="Açılış stoku" optional><NumInput value={baslangic} onChange={setBaslangic} suffix={otoBirim}/></Field>
        <Field label="Minimum stok"><NumInput value={minimum} onChange={setMinimum} suffix={otoBirim}/></Field>
      </div>
      <ErrorBanner message={error}/>
      <div style={{ position:'sticky', bottom:0, padding:'12px 0 0', background:`linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={submit} disabled={!valid || !!cakisma || loading} style={{ ...btnPrimaryStyle, width:'100%', padding:'14px', opacity:valid&&!cakisma&&!loading?1:0.4 }}>
          {loading ? 'Ekleniyor…' : cakisma ? 'Bu malzeme zaten kayıtlı' : 'Kataloga ekle'}
        </button>
      </div>
    </FormShell>
  );
}

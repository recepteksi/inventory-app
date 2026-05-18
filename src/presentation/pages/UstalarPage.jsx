import React, { useEffect, useState } from 'react';
import { TOKENS, Pill, Sub, MalzemeGlyph, UstaAvatar, btnPrimaryStyle, btnGhostStyle, btnDangerStyle } from '../components/ui/tokens.jsx';
import { useStore, fmtTarih } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

function SubHeader({ children }) {
  return <div style={{ padding:'12px 14px', borderBottom:`1px solid ${TOKENS.lineSoft}`, fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted, textTransform:'uppercase', letterSpacing:1.2, fontWeight:600, background:TOKENS.bg }}>{children}</div>;
}

function Th({ children, w, align='left' }) {
  return <th style={{ padding:'10px 14px', textAlign:align, width:w, fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted, textTransform:'uppercase', letterSpacing:0.8, fontWeight:600 }}>{children}</th>;
}
function Td({ children, align='left' }) {
  return <td style={{ padding:'10px 14px', textAlign:align, fontFamily:TOKENS.font, fontSize:13.5, color:TOKENS.ink, verticalAlign:'middle' }}>{children}</td>;
}

export function UstalarPage({ open }) {
  const { ustalar, hareketlerForUsta, getMalzeme, removeUsta } = useStore();
  const [selected, setSelected] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!selected && ustalar.length > 0) setSelected(ustalar[0].id);
  }, [ustalar]);

  if (!ustalar.length) return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingBottom:4 }}>
        <div>
          <h1 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:30, margin:0, letterSpacing:-0.6 }}>Ustalar</h1>
          <div style={{ fontFamily:TOKENS.font, fontSize:14, color:TOKENS.inkSoft, marginTop:4 }}>Ekip listesi ve yapılan işlerin tam izlenebilirliği</div>
        </div>
        <button onClick={() => open('yeni-usta')} style={btnPrimaryStyle}>+ Usta ekle</button>
      </div>
      <div style={{ marginTop:40, textAlign:'center', color:TOKENS.inkMuted, fontFamily:TOKENS.font, fontSize:14 }}>Henüz usta kaydı yok. Yeni usta ekleyin.</div>
    </div>
  );

  const u = ustalar.find((x) => x.id === selected) || ustalar[0];
  const hareketler = hareketlerForUsta(u.id);
  const malzemeIst = {};
  hareketler.forEach((h) => {
    const m = getMalzeme(h.malzemeId);
    if (!m) return;
    const key = getMalzemeAd(m);
    malzemeIst[key] = malzemeIst[key] || { miktar:0, birim:m.birim, m };
    malzemeIst[key].miktar += h.miktar;
  });
  const enCok = Object.entries(malzemeIst).sort((a,b) => b[1].miktar - a[1].miktar);

  const handleDelete = async (id) => {
    const usta = ustalar.find((u) => u.id === id);
    if (!window.confirm(`"${usta?.ad}" silinecek. Emin misiniz?`)) return;
    setDeleting(true); setDeleteError('');
    try {
      await removeUsta(id);
      setSelected(ustalar.find((u) => u.id !== id)?.id || null);
    } catch (e) {
      setDeleteError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', paddingBottom:4 }}>
        <div>
          <h1 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:30, margin:0, letterSpacing:-0.6 }}>Ustalar</h1>
          <div style={{ fontFamily:TOKENS.font, fontSize:14, color:TOKENS.inkSoft, marginTop:4 }}>Ekip listesi ve yapılan işlerin tam izlenebilirliği</div>
        </div>
        <button onClick={() => open('yeni-usta')} style={btnPrimaryStyle}>+ Usta ekle</button>
      </div>
      {deleteError && <div style={{ marginTop:10, padding:'10px 14px', background:'oklch(0.96 0.03 30)', border:'1px solid oklch(0.80 0.10 30)', borderRadius:10, fontFamily:TOKENS.font, fontSize:13, color:'oklch(0.45 0.18 30)' }}>{deleteError}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:20, marginTop:16, alignItems:'start' }}>
        <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, overflow:'hidden' }}>
          {ustalar.map((usta, i) => {
            const n = hareketlerForUsta(usta.id).length;
            return (
              <button key={usta.id} onClick={() => setSelected(usta.id)} style={{ appearance:'none', width:'100%', textAlign:'left', border:'none', borderBottom:i===ustalar.length-1?'none':`1px solid ${TOKENS.lineSoft}`, background:selected===usta.id?TOKENS.bg:'transparent', padding:'12px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, borderLeft:selected===usta.id?`3px solid ${TOKENS.ink}`:'3px solid transparent' }}>
                <UstaAvatar usta={usta}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:14, color:TOKENS.ink }}>{usta.ad}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:3 }}>
                    <Pill>{usta.uzmanlik.toUpperCase()}</Pill>
                    <span style={{ fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted }}>{n} işlem</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, padding:18, display:'flex', alignItems:'center', gap:16 }}>
            <UstaAvatar usta={u} size={64}/>
            <div style={{ flex:1 }}>
              <h3 style={{ fontFamily:TOKENS.font, fontSize:22, fontWeight:600, margin:0, letterSpacing:-0.3 }}>{u.ad}</h3>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
                <Pill>{u.uzmanlik.toUpperCase()}</Pill>
                <span style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted }}>Başlangıç: {fmtTarih(u.baslangic)}</span>
              </div>
            </div>
            <div style={{ textAlign:'right', fontFamily:TOKENS.mono, fontSize:28, fontWeight:600, color:TOKENS.ink, letterSpacing:-0.5 }}>
              {hareketler.length}
              <Sub>kayıtlı işlem</Sub>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <button onClick={() => open('duzenle-usta', u.id)} style={{ ...btnGhostStyle, fontSize:13 }}>✎ Düzenle</button>
              <button onClick={() => handleDelete(u.id)} disabled={deleting} style={{ ...btnDangerStyle, fontSize:13, opacity:deleting?0.5:1 }}>🗑 Sil</button>
            </div>
          </div>

          {enCok.length > 0 && (
            <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, overflow:'hidden' }}>
              <SubHeader>En Çok Kullandığı Malzemeler</SubHeader>
              {enCok.slice(0,5).map(([ad, info], i, arr) => (
                <div key={ad} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 14px', borderBottom:i===arr.length-1?'none':`1px solid ${TOKENS.lineSoft}` }}>
                  <MalzemeGlyph malzeme={info.m} size={30}/>
                  <div style={{ flex:1, fontFamily:TOKENS.font, fontSize:13.5, color:TOKENS.ink }}>{ad}</div>
                  <div style={{ fontFamily:TOKENS.mono, fontSize:14, fontWeight:600, color:TOKENS.ink }}>
                    {info.miktar} <span style={{ color:TOKENS.inkMuted, fontSize:10.5, fontWeight:500 }}>{info.birim}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, overflow:'hidden' }}>
            <SubHeader>Yaptığı İşler ({hareketler.length})</SubHeader>
            {hareketler.length === 0
              ? <div style={{ padding:30, textAlign:'center', color:TOKENS.inkMuted, fontFamily:TOKENS.font, fontSize:14 }}>Henüz iş kaydı yok.</div>
              : (
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr style={{ background:TOKENS.bg, borderBottom:`1px solid ${TOKENS.lineSoft}` }}>
                      <Th w={110}>Tarih</Th><Th>İş</Th><Th w={200}>Malzeme</Th><Th w={100} align="right">Miktar</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {hareketler.map((h) => {
                      const m = getMalzeme(h.malzemeId);
                      if (!m) return null;
                      return (
                        <tr key={h.id} style={{ borderBottom:`1px solid ${TOKENS.lineSoft}` }}>
                          <Td><span style={{ fontFamily:TOKENS.mono, fontSize:13, color:TOKENS.ink }}>{fmtTarih(h.tarih)}</span></Td>
                          <Td>{h.is}</Td>
                          <Td><div style={{ display:'flex', alignItems:'center', gap:8 }}><MalzemeGlyph malzeme={m} size={24}/><span style={{ fontSize:13 }}>{getMalzemeAd(m)}</span></div></Td>
                          <Td align="right"><span style={{ fontFamily:TOKENS.mono, fontSize:13, fontWeight:600, color:TOKENS.accent }}>−{h.miktar}</span> <span style={{ fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted }}>{m.birim}</span></Td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}

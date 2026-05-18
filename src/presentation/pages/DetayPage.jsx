import React, { useState } from 'react';
import { TOKENS, Pill, Sub, MalzemeGlyph, UstaAvatar, btnGhostStyle, btnDangerStyle, stokDurum } from '../components/ui/tokens.jsx';
import { useStore, fmtTarih } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

function Breadcrumb({ items }) {
  return (
    <div style={{ fontFamily:TOKENS.mono, fontSize:11.5, color:TOKENS.inkMuted, marginBottom:14, display:'flex', alignItems:'center', gap:6, letterSpacing:0.4 }}>
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {it.onClick ? <button onClick={it.onClick} style={{ appearance:'none', border:'none', background:'transparent', cursor:'pointer', fontFamily:'inherit', fontSize:'inherit', color:TOKENS.inkSoft, padding:0, textTransform:'uppercase', letterSpacing:'inherit' }}>{it.label}</button> : <span style={{ color:TOKENS.ink, textTransform:'uppercase' }}>{it.label}</span>}
          {i < items.length-1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function Row({ k, v, last }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between', padding:'11px 14px', borderBottom:last?'none':`1px solid ${TOKENS.lineSoft}`, fontFamily:TOKENS.font, fontSize:14 }}>
      <span style={{ color:TOKENS.inkSoft }}>{k}</span>
      <span style={{ color:TOKENS.ink, fontWeight:500 }}>{v}</span>
    </div>
  );
}

function SubHeader({ children }) {
  return <div style={{ padding:'12px 14px', borderBottom:`1px solid ${TOKENS.lineSoft}`, fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted, textTransform:'uppercase', letterSpacing:1.2, fontWeight:600, background:TOKENS.bg }}>{children}</div>;
}

function BigBar({ stok, min, renk }) {
  const ratio = Math.min(stok / (min*2||1), 1);
  return (
    <div style={{ width:'100%', height:8, background:TOKENS.lineSoft, borderRadius:4, position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${ratio*100}%`, background:renk, borderRadius:4 }}/>
      <div style={{ position:'absolute', left:'50%', top:-3, bottom:-3, width:1.5, background:TOKENS.ink, opacity:0.5 }}/>
    </div>
  );
}

function Timeline({ hareketler, m }) {
  const { getUsta } = useStore();
  return (
    <div style={{ position:'relative', paddingLeft:24 }}>
      <div style={{ position:'absolute', left:7, top:12, bottom:12, width:1, background:TOKENS.line }}/>
      {hareketler.map((h) => {
        const isGelis = h.tip==='gelis';
        const renk = isGelis?TOKENS.ok:TOKENS.accent;
        const soft = isGelis?TOKENS.okSoft:TOKENS.accentSoft;
        const usta = h.ustaId ? getUsta(h.ustaId) : null;
        return (
          <div key={h.id} style={{ position:'relative', padding:'12px 0' }}>
            <div style={{ position:'absolute', left:-23, top:16, width:15, height:15, borderRadius:99, background:soft, border:`2px solid ${renk}`, boxSizing:'border-box', display:'flex', alignItems:'center', justifyContent:'center', color:renk, fontWeight:700, fontSize:9 }}>{isGelis?'↓':'↑'}</div>
            <div style={{ display:'flex', alignItems:'baseline', gap:10, flexWrap:'wrap' }}>
              <span style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted, letterSpacing:0.5, textTransform:'uppercase' }}>{fmtTarih(h.tarih)}</span>
              <Pill color={renk} soft={soft}>{isGelis?'GELİŞ':'KULLANIM'}</Pill>
              <span style={{ fontFamily:TOKENS.mono, fontSize:13, fontWeight:600, color:renk }}>{isGelis?'+':'−'}{h.miktar} {m.birim}</span>
              {h.fis && <span style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted }}>· {h.fis}</span>}
            </div>
            <div style={{ marginTop:6, fontFamily:TOKENS.font, fontSize:14, color:TOKENS.ink, lineHeight:1.45 }}>{h.is||h.not}</div>
            {usta && (
              <div style={{ marginTop:6, display:'inline-flex', alignItems:'center', gap:8 }}>
                <UstaAvatar usta={usta} size={22}/>
                <span style={{ fontFamily:TOKENS.font, fontSize:12.5, color:TOKENS.inkSoft }}>
                  <span style={{ color:TOKENS.ink, fontWeight:600 }}>{usta.ad}</span> · {usta.uzmanlik}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DetayPage({ id, open, goBack }) {
  const { getMalzeme, hareketlerFor, getUsta, removeMalzeme } = useStore();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const m = getMalzeme(id);

  if (!m) return (
    <div style={{ padding:24 }}>
      <Breadcrumb items={[{ label:'Stok', onClick:goBack },{ label:'Bulunamadı' }]}/>
      <div style={{ fontFamily:TOKENS.font, color:TOKENS.inkSoft }}>Bu malzeme silinmiş ya da bulunamıyor.</div>
    </div>
  );

  const d = stokDurum(m);
  const hareketler = hareketlerFor(id);
  const toplamGelis = hareketler.filter((h)=>h.tip==='gelis').reduce((s,h)=>s+h.miktar,0);
  const toplamKullanim = hareketler.filter((h)=>h.tip==='kullanim').reduce((s,h)=>s+h.miktar,0);
  const kullananIds = [...new Set(hareketler.filter((h)=>h.ustaId).map((h)=>h.ustaId))];

  const handleDelete = async () => {
    if (!window.confirm(`"${getMalzemeAd(m)}" silinecek. Emin misiniz?`)) return;
    setDeleting(true); setDeleteError('');
    try {
      await removeMalzeme(id);
      goBack();
    } catch (e) {
      setDeleteError(e.message);
      setDeleting(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label:'Stok', onClick:goBack },{ label:getMalzemeAd(m) }]}/>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16, paddingBottom:4 }}>
        <div>
          <h1 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:30, margin:0, letterSpacing:-0.6 }}>{getMalzemeAd(m)}</h1>
          <div style={{ display:'inline-flex', alignItems:'center', gap:8, marginTop:4 }}>
            <span style={{ fontFamily:TOKENS.mono, color:TOKENS.inkMuted, fontSize:12, letterSpacing:0.5 }}>{m.id.toUpperCase()}</span>
            <Pill color={d.renk} soft={d.soft} size="md">{d.etiket}</Pill>
          </div>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => open('gelis', m.id)} style={btnGhostStyle}>↓ Geliş</button>
          <button onClick={() => open('kullanim', m.id)} style={btnGhostStyle}>↑ Kullanım</button>
          <button onClick={() => open('duzenle-malzeme', m.id)} style={btnGhostStyle}>✎ Düzenle</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...btnDangerStyle, opacity:deleting?0.5:1 }}>🗑 Sil</button>
        </div>
      </div>
      {deleteError && <div style={{ marginTop:10, padding:'10px 14px', background:'oklch(0.96 0.03 30)', border:'1px solid oklch(0.80 0.10 30)', borderRadius:10, fontFamily:TOKENS.font, fontSize:13, color:'oklch(0.45 0.18 30)' }}>{deleteError}</div>}

      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:20, marginTop:16, alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, padding:20, textAlign:'center' }}>
            <div style={{ display:'flex', justifyContent:'center' }}><MalzemeGlyph malzeme={m} size={80}/></div>
            <div style={{ marginTop:14, display:'flex', alignItems:'baseline', justifyContent:'center', gap:6 }}>
              <span style={{ fontFamily:TOKENS.mono, fontSize:44, fontWeight:600, letterSpacing:-1 }}>{m.stok}</span>
              <span style={{ fontFamily:TOKENS.mono, fontSize:14, color:TOKENS.inkMuted, textTransform:'uppercase' }}>{m.birim}</span>
            </div>
            <Sub style={{ marginTop:4 }}>mevcut stok</Sub>
            <div style={{ marginTop:16, paddingTop:14, borderTop:`1px solid ${TOKENS.lineSoft}` }}>
              <BigBar stok={m.stok} min={m.minimum} renk={d.renk}/>
              <div style={{ display:'flex', justifyContent:'space-between', marginTop:6, fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted }}>
                <span>0</span><span>min {m.minimum}</span><span>{m.minimum*2}</span>
              </div>
            </div>
          </div>

          <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, overflow:'hidden' }}>
            <SubHeader>Özellikler</SubHeader>
            {m.tur ? (<><Row k="Çap" v={m.cap}/><Row k="Tür" v={m.tur}/><Row k="Cins" v={m.cins}/><Row k="Birim" v={m.birim}/><Row k="Minimum stok" v={`${m.minimum} ${m.birim}`} last/></>) : (<><Row k="Kategori" v={m.kategori}/><Row k="Birim" v={m.birim}/><Row k="Minimum stok" v={`${m.minimum} ${m.birim}`} last/></>)}
          </div>

          <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, overflow:'hidden' }}>
            <SubHeader>İstatistik</SubHeader>
            <Row k="Toplam geliş" v={`${toplamGelis} ${m.birim}`}/>
            <Row k="Toplam kullanım" v={`${toplamKullanim} ${m.birim}`}/>
            <Row k="Kullanan usta sayısı" v={kullananIds.length}/>
            <Row k="Hareket sayısı" v={hareketler.length} last/>
          </div>
        </div>

        <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12 }}>
          <div style={{ padding:'14px 20px', borderBottom:`1px solid ${TOKENS.line}`, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
            <div>
              <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:15 }}>Hareket Geçmişi</div>
              <Sub style={{ marginTop:2 }}>kim, ne zaman, hangi iş için</Sub>
            </div>
            <span style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted }}>{hareketler.length} kayıt</span>
          </div>
          <div style={{ padding:'8px 20px 20px' }}>
            {hareketler.length === 0
              ? <div style={{ padding:30, textAlign:'center', color:TOKENS.inkMuted, fontFamily:TOKENS.font, fontSize:14 }}>Henüz hareket yok.</div>
              : <Timeline hareketler={hareketler} m={m}/>}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useMemo, useState } from 'react';
import { TOKENS, Chip, Pill, Sub, IconSearch, MalzemeGlyph, btnPrimaryStyle, stokDurum } from '../components/ui/tokens.jsx';
import { useStore } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

function Th({ children, sortKey, dir, k, onClick, w, align='left' }) {
  const sorted = sortKey === k;
  return (
    <th onClick={onClick} style={{ padding:'10px 14px', textAlign:align, width:w, fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted, textTransform:'uppercase', letterSpacing:0.8, fontWeight:600, cursor:onClick?'pointer':'default', userSelect:'none' }}>
      {children}{sorted && <span style={{ marginLeft:4, color:TOKENS.ink }}>{dir==='asc'?'↑':'↓'}</span>}
    </th>
  );
}

function Td({ children, align='left' }) {
  return <td style={{ padding:'10px 14px', textAlign:align, fontFamily:TOKENS.font, fontSize:13.5, color:TOKENS.ink, verticalAlign:'middle' }}>{children}</td>;
}

function StatTile({ k, v, sub, warn }) {
  return (
    <div style={{ background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, padding:14 }}>
      <Sub style={{ marginBottom:2 }}>{k}</Sub>
      <span style={{ fontFamily:TOKENS.mono, fontSize:28, fontWeight:600, color:warn?TOKENS.low:TOKENS.ink, letterSpacing:-0.5 }}>{v}</span>
      <div style={{ fontFamily:TOKENS.font, fontSize:12, color:TOKENS.inkMuted, marginTop:2 }}>{sub}</div>
    </div>
  );
}

function StokBar({ item }) {
  const ratio = Math.min(item.stok / (item.minimum * 2 || 1), 1);
  const d = stokDurum(item);
  return (
    <div style={{ width:90, height:4, background:TOKENS.lineSoft, borderRadius:2, marginTop:4, marginLeft:'auto', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', left:0, top:0, bottom:0, width:`${ratio*100}%`, background:d.renk, borderRadius:2 }}/>
      <div style={{ position:'absolute', left:'50%', top:-1, bottom:-1, width:1, background:TOKENS.inkMuted, opacity:0.4 }}/>
    </div>
  );
}

function FilterGroup({ label, value, onChange, options }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <Sub style={{ marginRight:2 }}>{label}</Sub>
      {options.map((o) => <Chip key={o} active={value===o} onClick={() => onChange(o)}>{o==='hepsi'?'Hepsi':o}</Chip>)}
    </div>
  );
}

export function StokPage({ open }) {
  const { boruFittings, digerMalzeme, hareketler, ustalar } = useStore();
  const [grup, setGrup] = useState('boru');
  const [cap, setCap] = useState('hepsi');
  const [cins, setCins] = useState('hepsi');
  const [tur, setTur] = useState('hepsi');
  const [kat, setKat] = useState('hepsi');
  const [q, setQ] = useState('');
  const [durum, setDurum] = useState('hepsi');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState('asc');

  const items = useMemo(() => {
    let list = grup === 'boru' ? boruFittings : digerMalzeme;
    list = list.filter((m) => {
      if (grup === 'boru') {
        if (cap !== 'hepsi' && m.cap !== cap) return false;
        if (cins !== 'hepsi' && m.cins !== cins) return false;
        if (tur !== 'hepsi' && m.tur !== tur) return false;
      } else {
        if (kat !== 'hepsi' && m.kategori !== kat) return false;
      }
      if (durum !== 'hepsi') {
        const d = stokDurum(m).etiket;
        if (durum === 'azaldi' && d !== 'AZALDI') return false;
        if (durum === 'takip' && d !== 'TAKİP') return false;
        if (durum === 'stokta' && d !== 'STOKTA') return false;
      }
      if (q && !getMalzemeAd(m).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      if (av === bv) return 0;
      return (av < bv ? -1 : 1) * (sortDir === 'asc' ? 1 : -1);
    });
  }, [boruFittings, digerMalzeme, grup, cap, cins, tur, kat, q, durum, sortKey, sortDir]);

  const counts = useMemo(() => ({
    total: boruFittings.length + digerMalzeme.length,
    azaldi: [...boruFittings, ...digerMalzeme].filter((m) => m.stok < m.minimum).length,
    boru: boruFittings.length,
    diger: digerMalzeme.length,
  }), [boruFittings, digerMalzeme]);

  const ayStats = useMemo(() => {
    const ay = new Date().toISOString().slice(0, 7);
    const buAy = hareketler.filter((h) => h.tarih.startsWith(ay));
    const gelisler = buAy.filter((h) => h.tip === 'gelis');
    const kullanimlar = buAy.filter((h) => h.tip === 'kullanim');
    return { gelisKayit:gelisler.length, gelisAdet:gelisler.reduce((s,h)=>s+h.miktar,0), kullanimKayit:kullanimlar.length, kullanimUsta:new Set(kullanimlar.map((h)=>h.ustaId)).size };
  }, [hareketler]);

  const toggleSort = (k) => {
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:16, paddingBottom:4 }}>
        <div>
          <h1 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:30, margin:0, letterSpacing:-0.6, color:TOKENS.ink }}>Stok</h1>
          <div style={{ fontFamily:TOKENS.font, fontSize:14, color:TOKENS.inkSoft, marginTop:4 }}>Malzeme envanteri ve gerçek zamanlı durum</div>
        </div>
        <button onClick={() => open('yeni-malzeme', { grup })} style={btnPrimaryStyle}>+ Yeni malzeme</button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:16 }}>
        <StatTile k="Toplam kalem" v={counts.total} sub={`${counts.boru} boru/fittings · ${counts.diger} diğer`}/>
        <StatTile k="Azalan" v={counts.azaldi} sub="minimumun altında" warn/>
        <StatTile k="Bu ay geliş" v={ayStats.gelisKayit} sub={`kayıt · ${ayStats.gelisAdet} kalem`}/>
        <StatTile k="Bu ay kullanım" v={ayStats.kullanimKayit} sub={`kayıt · ${ayStats.kullanimUsta} usta`}/>
      </div>

      <div style={{ marginTop:20, background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, padding:14 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex', background:TOKENS.lineSoft, padding:3, borderRadius:9 }}>
            {[{ id:'boru', label:'Boru & Fittings', n:counts.boru },{ id:'diger', label:'Diğer Malzeme', n:counts.diger }].map((t) => (
              <button key={t.id} onClick={() => setGrup(t.id)} style={{ appearance:'none', border:'none', cursor:'pointer', padding:'6px 12px', borderRadius:7, background:grup===t.id?TOKENS.paper:'transparent', color:grup===t.id?TOKENS.ink:TOKENS.inkSoft, fontFamily:TOKENS.font, fontWeight:600, fontSize:13, boxShadow:grup===t.id?'0 1px 2px rgba(0,0,0,0.05)':'none', display:'flex', alignItems:'center', gap:6 }}>
                {t.label}
                <span style={{ fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted, background:grup===t.id?TOKENS.lineSoft:'transparent', padding:'1px 6px', borderRadius:4 }}>{t.n}</span>
              </button>
            ))}
          </div>
          <div style={{ flex:1, minWidth:240 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, background:TOKENS.bg, border:`1px solid ${TOKENS.line}`, borderRadius:8, padding:'7px 10px' }}>
              <IconSearch/>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Malzeme ara…" style={{ flex:1, border:'none', outline:'none', background:'transparent', fontFamily:TOKENS.font, fontSize:14 }}/>
              {q && <button onClick={() => setQ('')} style={{ appearance:'none', border:'none', background:'transparent', cursor:'pointer', color:TOKENS.inkMuted, fontSize:14 }}>×</button>}
            </div>
          </div>
          <div style={{ display:'inline-flex', gap:4 }}>
            {[{ id:'hepsi', label:'Hepsi' },{ id:'azaldi', label:'Azalan', c:TOKENS.low },{ id:'takip', label:'Takip', c:TOKENS.accent },{ id:'stokta', label:'Stokta', c:TOKENS.ok }].map((d) => (
              <Chip key={d.id} active={durum===d.id} onClick={() => setDurum(d.id)}>
                {d.c && <span style={{ width:7, height:7, borderRadius:99, background:d.c, display:'inline-block', marginRight:6, verticalAlign:'middle' }}/>}
                {d.label}
              </Chip>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:14, marginTop:12, alignItems:'center', flexWrap:'wrap' }}>
          {grup === 'boru' ? (
            <>
              <FilterGroup label="Çap" value={cap} onChange={setCap} options={['hepsi','1"','2"','3"']}/>
              <FilterGroup label="Tür" value={tur} onChange={setTur} options={['hepsi','Boru','Dirsek','Tee','Manşon']}/>
              <FilterGroup label="Cins" value={cins} onChange={setCins} options={['hepsi','Siyah','Galvaniz','Paslanmaz']}/>
            </>
          ) : (
            <FilterGroup label="Kategori" value={kat} onChange={setKat} options={['hepsi','Elektrod','Boya','Bağlantı']}/>
          )}
        </div>
      </div>

      <div style={{ marginTop:16, background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:12, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:TOKENS.font }}>
          <thead>
            <tr style={{ background:TOKENS.bg, borderBottom:`1px solid ${TOKENS.line}` }}>
              <Th onClick={() => toggleSort('id')} sortKey={sortKey} dir={sortDir} k="id" w={120}>Kod</Th>
              <Th>Malzeme</Th>
              {grup==='boru' && <><Th w={70}>Çap</Th><Th w={100}>Tür</Th><Th w={110}>Cins</Th></>}
              {grup==='diger' && <Th w={130}>Kategori</Th>}
              <Th onClick={() => toggleSort('stok')} sortKey={sortKey} dir={sortDir} k="stok" w={120} align="right">Stok</Th>
              <Th onClick={() => toggleSort('minimum')} sortKey={sortKey} dir={sortDir} k="minimum" w={90} align="right">Min</Th>
              <Th w={110}>Durum</Th>
              <Th w={130} align="right"/>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => {
              const d = stokDurum(m);
              return (
                <tr key={m.id} onClick={() => open('detay', m.id)} style={{ borderBottom:`1px solid ${TOKENS.lineSoft}`, cursor:'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.background=TOKENS.bg)} onMouseLeave={(e) => (e.currentTarget.style.background='transparent')}>
                  <Td><span style={{ fontFamily:TOKENS.mono, fontSize:11.5, color:TOKENS.inkMuted, letterSpacing:0.5 }}>{m.id.toUpperCase()}</span></Td>
                  <Td><div style={{ display:'flex', alignItems:'center', gap:10 }}><MalzemeGlyph malzeme={m} size={32}/><span style={{ fontWeight:500, fontSize:14 }}>{getMalzemeAd(m)}</span></div></Td>
                  {grup==='boru' && <><Td><span style={{ fontFamily:TOKENS.mono, fontSize:13 }}>{m.cap}</span></Td><Td>{m.tur}</Td><Td>{m.cins}</Td></>}
                  {grup==='diger' && <Td>{m.kategori}</Td>}
                  <Td align="right">
                    <div style={{ display:'flex', alignItems:'baseline', gap:4, justifyContent:'flex-end' }}>
                      <span style={{ fontFamily:TOKENS.mono, fontSize:17, fontWeight:600, letterSpacing:-0.3 }}>{m.stok}</span>
                      <span style={{ fontFamily:TOKENS.mono, fontSize:10.5, color:TOKENS.inkMuted, textTransform:'uppercase', letterSpacing:0.4 }}>{m.birim}</span>
                    </div>
                    <StokBar item={m}/>
                  </Td>
                  <Td align="right"><span style={{ fontFamily:TOKENS.mono, fontSize:12, color:TOKENS.inkSoft }}>{m.minimum}</span></Td>
                  <Td><Pill color={d.renk} soft={d.soft}>{d.etiket}</Pill></Td>
                  <Td align="right">
                    <div style={{ display:'inline-flex', gap:4 }}>
                      <button onClick={(e) => { e.stopPropagation(); open('gelis', m.id); }} title="Geliş kaydet" style={{ appearance:'none', border:`1px solid ${TOKENS.line}`, background:TOKENS.paper, width:28, height:28, borderRadius:7, cursor:'pointer', fontFamily:TOKENS.font, fontSize:14, color:TOKENS.inkSoft, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>↓</button>
                      <button onClick={(e) => { e.stopPropagation(); open('kullanim', m.id); }} title="Kullanım kaydet" style={{ appearance:'none', border:`1px solid ${TOKENS.line}`, background:TOKENS.paper, width:28, height:28, borderRadius:7, cursor:'pointer', fontFamily:TOKENS.font, fontSize:14, color:TOKENS.inkSoft, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>↑</button>
                      <button onClick={(e) => { e.stopPropagation(); open('duzenle-malzeme', m.id); }} title="Düzenle" style={{ appearance:'none', border:`1px solid ${TOKENS.line}`, background:TOKENS.paper, width:28, height:28, borderRadius:7, cursor:'pointer', fontFamily:TOKENS.font, fontSize:12, color:TOKENS.inkSoft, display:'inline-flex', alignItems:'center', justifyContent:'center' }}>✎</button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && <div style={{ padding:'40px 20px', textAlign:'center', color:TOKENS.inkMuted, fontFamily:TOKENS.font, fontSize:14 }}>Sonuç yok.</div>}
      </div>
      <div style={{ marginTop:10, fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted, textAlign:'right' }}>{items.length} kalem gösteriliyor</div>
    </div>
  );
}

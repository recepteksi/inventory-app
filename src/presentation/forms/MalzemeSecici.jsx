import React, { useState } from 'react';
import { TOKENS, IconArrow, IconSearch, MalzemeGlyph } from '../components/ui/tokens.jsx';
import { useStore } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

export function MalzemeSecici({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const { getMalzeme } = useStore();
  const m = value ? getMalzeme(value) : null;

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ appearance:'none', width:'100%', textAlign:'left', border:`1px solid ${TOKENS.line}`, borderRadius:10, background:TOKENS.paper, padding:'12px 14px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, justifyContent:'space-between' }}>
        <span style={{ fontFamily:TOKENS.font, fontSize:15, color:m?TOKENS.ink:TOKENS.inkMuted }}>{m ? getMalzemeAd(m) : 'Malzeme seç…'}</span>
        <IconArrow dir="down"/>
      </button>
      {open && <SeciciSheet onClose={() => setOpen(false)} onPick={(id) => { onChange(id); setOpen(false); }}/>}
    </>
  );
}

function SeciciSheet({ onClose, onPick }) {
  const [q, setQ] = useState('');
  const { boruFittings, digerMalzeme } = useStore();
  const all = [...boruFittings, ...digerMalzeme];
  const filtered = q ? all.filter((m) => getMalzemeAd(m).toLowerCase().includes(q.toLowerCase())) : all;

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:200, background:'rgba(20,16,12,0.4)', display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background:TOKENS.bg, borderTopLeftRadius:20, borderTopRightRadius:20, maxHeight:'75%', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'10px 0 0', display:'flex', justifyContent:'center' }}>
          <div style={{ width:36, height:4, borderRadius:99, background:TOKENS.line }}/>
        </div>
        <div style={{ padding:'12px 20px 8px' }}>
          <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:17, color:TOKENS.ink, marginBottom:8 }}>Malzeme seç</div>
          <div style={{ display:'flex', alignItems:'center', gap:8, background:TOKENS.paper, border:`1px solid ${TOKENS.line}`, borderRadius:10, padding:'8px 12px' }}>
            <IconSearch/>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ara…" autoFocus style={{ flex:1, border:'none', outline:'none', background:'transparent', fontFamily:TOKENS.font, fontSize:15 }}/>
          </div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'4px 20px 24px' }}>
          {filtered.map((m) => (
            <button key={m.id} onClick={() => onPick(m.id)} style={{ appearance:'none', background:'transparent', border:'none', cursor:'pointer', width:'100%', display:'flex', alignItems:'center', gap:10, padding:'10px 4px', borderBottom:`1px solid ${TOKENS.lineSoft}`, textAlign:'left' }}>
              <MalzemeGlyph malzeme={m} size={34}/>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:TOKENS.font, fontSize:14.5, color:TOKENS.ink }}>{getMalzemeAd(m)}</div>
                <div style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted }}>{m.stok} {m.birim} stokta</div>
              </div>
              <IconArrow/>
            </button>
          ))}
          {filtered.length === 0 && <div style={{ padding:30, textAlign:'center', color:TOKENS.inkMuted, fontFamily:TOKENS.font, fontSize:14 }}>Sonuç yok</div>}
        </div>
      </div>
    </div>
  );
}

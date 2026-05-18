import React from 'react';
import { TOKENS, UstaAvatar, IconCheck } from '../components/ui/tokens.jsx';
import { useStore } from '../store/store.jsx';

export function UstaSecici({ value, onChange }) {
  const { ustalar } = useStore();

  if (ustalar.length === 0) {
    return (
      <div style={{ padding:'16px 14px', border:`1px solid ${TOKENS.line}`, borderRadius:10, fontFamily:TOKENS.font, fontSize:14, color:TOKENS.inkMuted, textAlign:'center' }}>
        Henüz usta kaydı yok. Önce usta ekleyin.
      </div>
    );
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {ustalar.map((u) => (
        <button key={u.id} onClick={() => onChange(u.id)} style={{ appearance:'none', background:value===u.id?TOKENS.ink:TOKENS.paper, border:`1px solid ${value===u.id?TOKENS.ink:TOKENS.line}`, borderRadius:10, padding:'10px 12px', cursor:'pointer', display:'flex', alignItems:'center', gap:10, textAlign:'left' }}>
          <UstaAvatar usta={u} size={32}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:14, color:value===u.id?'#fff':TOKENS.ink }}>{u.ad}</div>
            <div style={{ fontFamily:TOKENS.mono, fontSize:11, color:value===u.id?'rgba(255,255,255,0.7)':TOKENS.inkMuted, letterSpacing:0.5 }}>{u.uzmanlik}</div>
          </div>
          {value===u.id && <IconCheck/>}
        </button>
      ))}
    </div>
  );
}

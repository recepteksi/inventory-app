import React from 'react';
import { TOKENS } from '../components/ui/tokens.jsx';
import { Sub } from '../components/ui/tokens.jsx';

export function FormShell({ title, altTitle, children }) {
  return (
    <div style={{ paddingBottom: 60 }}>
      <div style={{ padding: '0 24px', paddingTop: 56 }}>
        <Sub>{altTitle}</Sub>
        <h1 style={{ fontFamily:TOKENS.font, fontWeight:600, fontSize:26, margin:'4px 0 18px', letterSpacing:-0.4 }}>
          {title}
        </h1>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, optional, hint, children }) {
  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6, gap:8 }}>
        <label style={{ fontFamily:TOKENS.font, fontSize:13, fontWeight:600, color:TOKENS.ink, whiteSpace:'nowrap' }}>
          {label}{' '}{optional && <span style={{ color:TOKENS.inkMuted, fontWeight:400 }}>(opsiyonel)</span>}
        </label>
        {hint && <span style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.low, fontWeight:600 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function TextInput({ value, onChange, placeholder, mono }) {
  return (
    <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{ width:'100%', boxSizing:'border-box', padding:'12px 14px', border:`1px solid ${TOKENS.line}`, borderRadius:10, background:TOKENS.paper, fontFamily:mono?TOKENS.mono:TOKENS.font, fontSize:15, color:TOKENS.ink, outline:'none' }}/>
  );
}

export function TextArea({ value, onChange, placeholder }) {
  return (
    <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ width:'100%', boxSizing:'border-box', padding:'12px 14px', border:`1px solid ${TOKENS.line}`, borderRadius:10, background:TOKENS.paper, fontFamily:TOKENS.font, fontSize:15, color:TOKENS.ink, outline:'none', resize:'none' }}/>
  );
}

export function NumInput({ value, onChange, suffix, warn }) {
  return (
    <div style={{ display:'flex', alignItems:'center', border:`1px solid ${warn?TOKENS.low:TOKENS.line}`, borderRadius:10, background:TOKENS.paper, padding:'0 14px' }}>
      <input value={value} onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g,''))} placeholder="0" inputMode="decimal" style={{ flex:1, padding:'12px 0', border:'none', outline:'none', background:'transparent', fontFamily:TOKENS.mono, fontSize:17, color:TOKENS.ink, fontWeight:600 }}/>
      {suffix && <span style={{ fontFamily:TOKENS.mono, fontSize:13, color:TOKENS.inkMuted }}>{suffix}</span>}
    </div>
  );
}

export function DateInput({ value, onChange }) {
  return (
    <input type="date" value={value} onChange={(e) => onChange(e.target.value)} style={{ width:'100%', boxSizing:'border-box', padding:'12px 14px', border:`1px solid ${TOKENS.line}`, borderRadius:10, background:TOKENS.paper, fontFamily:TOKENS.mono, fontSize:15, color:TOKENS.ink, outline:'none' }}/>
  );
}

export function ChipPicker({ value, onChange, options }) {
  return (
    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
      {options.map((o) => (
        <button key={o} onClick={() => onChange(o)} style={{ appearance:'none', border:`1px solid ${value===o?TOKENS.ink:TOKENS.line}`, background:value===o?TOKENS.ink:TOKENS.paper, color:value===o?'#fff':TOKENS.ink, padding:'7px 12px', borderRadius:999, fontFamily:TOKENS.font, fontWeight:500, fontSize:13, cursor:'pointer', whiteSpace:'nowrap' }}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function SegmentControl({ value, onChange, options }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:`repeat(${options.length},1fr)`, background:TOKENS.lineSoft, padding:3, borderRadius:10 }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} style={{ appearance:'none', border:'none', cursor:'pointer', padding:'9px 12px', borderRadius:8, background:value===o.value?TOKENS.paper:'transparent', color:value===o.value?TOKENS.ink:TOKENS.inkSoft, fontFamily:TOKENS.font, fontWeight:600, fontSize:14, boxShadow:value===o.value?'0 1px 2px rgba(0,0,0,0.05)':'none' }}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div style={{ background:'oklch(0.96 0.03 30)', border:'1px solid oklch(0.80 0.10 30)', borderRadius:10, padding:'10px 14px', fontFamily:TOKENS.font, fontSize:13, color:'oklch(0.45 0.18 30)' }}>
      {message}
    </div>
  );
}

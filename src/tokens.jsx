import React from 'react';

export const TOKENS = {
  bg:        '#F4F0E8',
  paper:     '#FFFFFF',
  ink:       '#161412',
  inkSoft:   '#5C544A',
  inkMuted:  '#8C8378',
  line:      '#E5DFD2',
  lineSoft:  '#EFEAE0',
  accent:    'oklch(0.62 0.18 45)',
  accentSoft:'oklch(0.95 0.04 60)',
  steel:     'oklch(0.42 0.05 240)',
  steelSoft: 'oklch(0.94 0.02 240)',
  ok:        'oklch(0.55 0.12 145)',
  okSoft:    'oklch(0.94 0.05 145)',
  low:       'oklch(0.60 0.18 30)',
  lowSoft:   'oklch(0.94 0.05 30)',
  font:      "'Space Grotesk', system-ui, sans-serif",
  mono:      "'JetBrains Mono', ui-monospace, monospace",
};

export function stokDurum(item) {
  if (item.stok < item.minimum) return { etiket: 'AZALDI', renk: TOKENS.low, soft: TOKENS.lowSoft };
  if (item.stok < item.minimum * 1.5) return { etiket: 'TAKİP', renk: TOKENS.accent, soft: TOKENS.accentSoft };
  return { etiket: 'STOKTA', renk: TOKENS.ok, soft: TOKENS.okSoft };
}

export function Chip({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        appearance: 'none',
        border: `1px solid ${active ? TOKENS.ink : TOKENS.line}`,
        background: active ? TOKENS.ink : TOKENS.paper,
        color: active ? '#fff' : TOKENS.ink,
        padding: '7px 12px',
        borderRadius: 999,
        fontFamily: TOKENS.font,
        fontWeight: 500,
        fontSize: 13,
        letterSpacing: 0.1,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

export function Pill({ children, color = TOKENS.steel, soft = TOKENS.steelSoft, size = 'sm' }) {
  return (
    <span
      style={{
        background: soft,
        color,
        padding: size === 'sm' ? '3px 8px' : '5px 10px',
        borderRadius: 6,
        fontFamily: TOKENS.mono,
        fontSize: size === 'sm' ? 10.5 : 12,
        fontWeight: 600,
        letterSpacing: 0.6,
      }}
    >
      {children}
    </span>
  );
}

export function Sub({ children, style }) {
  return (
    <div
      style={{
        fontFamily: TOKENS.mono,
        fontSize: 10.5,
        letterSpacing: 1.2,
        color: TOKENS.inkMuted,
        textTransform: 'uppercase',
        fontWeight: 500,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function IconArrow({ dir = 'right', size = 14, color = TOKENS.inkSoft }) {
  const rot = { right: 0, left: 180, up: -90, down: 90 }[dir];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" style={{ transform: `rotate(${rot}deg)` }}>
      <path d="M5 3 L10 8 L5 13" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlus({ size = 16, color = '#fff', weight = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M8 3 V13 M3 8 H13" stroke={color} strokeWidth={weight} strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ size = 14, color = '#fff' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <path d="M3 8 L7 12 L13 4" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSearch({ size = 16, color = TOKENS.inkSoft }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth="1.5" fill="none" />
      <path d="M10.5 10.5 L14 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBox({ active }) {
  const c = active ? TOKENS.ink : TOKENS.inkMuted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M3 7 L12 3 L21 7 L12 11 Z" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M3 7 V17 L12 21 L21 17 V7" stroke={c} strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 11 V21" stroke={c} strokeWidth="1.6" />
    </svg>
  );
}

export function IconPerson({ active }) {
  const c = active ? TOKENS.ink : TOKENS.inkMuted;
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="3.5" stroke={c} strokeWidth="1.6" />
      <path d="M4 20 C 5 15 8 13 12 13 C 16 13 19 15 20 20" stroke={c} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function MalzemeGlyph({ malzeme, size = 36 }) {
  const s = size;
  const bg = TOKENS.lineSoft;
  const stroke = TOKENS.inkSoft;
  let glyph = null;
  if (malzeme && malzeme.tur) {
    const { tur, cins } = malzeme;
    const fill = cins === 'Siyah' ? '#1F1A14' : cins === 'Galvaniz' ? '#A9B0B8' : '#D0D5DA';
    if (tur === 'Boru') {
      glyph = (
        <>
          <rect x="4" y="14" width="28" height="8" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.8" />
          <line x1="6" y1="18" x2="30" y2="18" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
        </>
      );
    } else if (tur === 'Dirsek') {
      glyph = (
        <>
          <path d="M6 8 H14 Q22 8 22 16 V26" stroke={fill} strokeWidth="6" fill="none" />
          <path d="M6 8 H14 Q22 8 22 16 V26" stroke={stroke} strokeWidth="0.8" fill="none" />
        </>
      );
    } else if (tur === 'Tee') {
      glyph = (
        <>
          <rect x="4" y="14" width="28" height="8" fill={fill} stroke={stroke} strokeWidth="0.8" />
          <rect x="14" y="14" width="8" height="14" fill={fill} stroke={stroke} strokeWidth="0.8" />
        </>
      );
    } else if (tur === 'Manşon') {
      glyph = (
        <>
          <rect x="4" y="14" width="28" height="8" fill={fill} stroke={stroke} strokeWidth="0.8" />
          <rect x="12" y="11" width="12" height="14" fill={fill} stroke={stroke} strokeWidth="0.8" />
        </>
      );
    }
  } else if (malzeme && malzeme.kategori === 'Elektrod') {
    const isBaz = malzeme.ad && malzeme.ad.includes('Bazik');
    glyph = (
      <>
        <line x1="10" y1="6" x2="18" y2="30" stroke={isBaz ? '#7A5A2E' : '#C44A2E'} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="14" y1="6" x2="22" y2="30" stroke={isBaz ? '#7A5A2E' : '#C44A2E'} strokeWidth="2.5" strokeLinecap="round" />
        <line x1="18" y1="6" x2="26" y2="30" stroke={isBaz ? '#7A5A2E' : '#C44A2E'} strokeWidth="2.5" strokeLinecap="round" />
      </>
    );
  } else if (malzeme && malzeme.kategori === 'Boya') {
    const c = malzeme.ad && malzeme.ad.includes('Kırmızı') ? '#C0392B' : '#7B7D7E';
    glyph = (
      <>
        <rect x="9" y="10" width="18" height="20" rx="1" fill={c} stroke={stroke} strokeWidth="0.8" />
        <rect x="11" y="6" width="14" height="4" rx="1" fill={c} stroke={stroke} strokeWidth="0.8" />
      </>
    );
  } else if (malzeme && malzeme.kategori === 'Bağlantı') {
    if (malzeme.ad && malzeme.ad.includes('Cıvata')) {
      glyph = (
        <>
          <polygon points="8,9 16,5 24,9 24,15 16,19 8,15" fill="#8C8C8C" stroke={stroke} strokeWidth="0.8" />
          <rect x="14" y="15" width="4" height="14" fill="#8C8C8C" stroke={stroke} strokeWidth="0.8" />
        </>
      );
    } else {
      glyph = (
        <>
          <rect x="14" y="4" width="4" height="28" fill="#A0A0A0" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="9" x2="18" y2="9" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="14" x2="18" y2="14" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="19" x2="18" y2="19" stroke={stroke} strokeWidth="0.8" />
          <line x1="14" y1="24" x2="18" y2="24" stroke={stroke} strokeWidth="0.8" />
        </>
      );
    }
  }
  return (
    <div
      style={{
        width: s,
        height: s,
        background: bg,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${TOKENS.line}`,
        flexShrink: 0,
      }}
    >
      <svg width={s * 0.78} height={s * 0.78} viewBox="0 0 36 36">{glyph}</svg>
    </div>
  );
}

export function UstaAvatar({ usta, size = 42 }) {
  const initials = usta.ad.split(' ').map((p) => p[0]).join('').slice(0, 2);
  let h = 0;
  for (let i = 0; i < usta.id.length; i++) h = (h * 31 + usta.id.charCodeAt(i)) % 360;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: `oklch(0.85 0.06 ${h})`,
        color: `oklch(0.32 0.08 ${h})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: TOKENS.font,
        fontWeight: 600,
        fontSize: size * 0.38,
        flexShrink: 0,
        border: `1px solid ${TOKENS.line}`,
      }}
    >
      {initials}
    </div>
  );
}

export const btnPrimaryStyle = {
  appearance: 'none',
  border: 'none',
  background: TOKENS.ink,
  color: '#fff',
  padding: '10px 14px',
  borderRadius: 10,
  fontFamily: TOKENS.font,
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
};

export const btnGhostStyle = {
  appearance: 'none',
  border: `1px solid ${TOKENS.line}`,
  background: TOKENS.paper,
  color: TOKENS.ink,
  padding: '10px 14px',
  borderRadius: 10,
  fontFamily: TOKENS.font,
  fontWeight: 600,
  fontSize: 14,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
};

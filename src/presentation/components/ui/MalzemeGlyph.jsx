import React from 'react';
import { TOKENS } from './tokens.jsx';

/**
 * Inline SVG icon box that adapts to the material type.
 * Pipe/fitting types select shape and colour automatically; other categories use dedicated glyphs.
 * @param {object} props
 * @param {object} props.malzeme - Material object from the store
 * @param {number} [props.size=36] - Box side length in pixels
 */
export function MalzemeGlyph({ malzeme, size = 36 }) {
  const s = size;
  const bg = TOKENS.lineSoft;
  const stroke = TOKENS.inkSoft;
  let glyph = null;

  if (malzeme?.tur) {
    const { tur, cins } = malzeme;
    const fill = cins === 'Siyah' ? '#1F1A14' : cins === 'Galvaniz' ? '#A9B0B8' : '#D0D5DA';
    if (tur === 'Boru')
      glyph = <><rect x="4" y="14" width="28" height="8" rx="1.5" fill={fill} stroke={stroke} strokeWidth="0.8" /><line x1="6" y1="18" x2="30" y2="18" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" /></>;
    else if (tur === 'Dirsek')
      glyph = <><path d="M6 8 H14 Q22 8 22 16 V26" stroke={fill} strokeWidth="6" fill="none" /><path d="M6 8 H14 Q22 8 22 16 V26" stroke={stroke} strokeWidth="0.8" fill="none" /></>;
    else if (tur === 'Tee')
      glyph = <><rect x="4" y="14" width="28" height="8" fill={fill} stroke={stroke} strokeWidth="0.8" /><rect x="14" y="14" width="8" height="14" fill={fill} stroke={stroke} strokeWidth="0.8" /></>;
    else if (tur === 'Manşon')
      glyph = <><rect x="4" y="14" width="28" height="8" fill={fill} stroke={stroke} strokeWidth="0.8" /><rect x="12" y="11" width="12" height="14" fill={fill} stroke={stroke} strokeWidth="0.8" /></>;
  } else if (malzeme?.kategori === 'Elektrod') {
    const isBaz = malzeme.ad?.includes('Bazik');
    glyph = <><line x1="10" y1="6" x2="18" y2="30" stroke={isBaz ? '#7A5A2E' : '#C44A2E'} strokeWidth="2.5" strokeLinecap="round" /><line x1="14" y1="6" x2="22" y2="30" stroke={isBaz ? '#7A5A2E' : '#C44A2E'} strokeWidth="2.5" strokeLinecap="round" /><line x1="18" y1="6" x2="26" y2="30" stroke={isBaz ? '#7A5A2E' : '#C44A2E'} strokeWidth="2.5" strokeLinecap="round" /></>;
  } else if (malzeme?.kategori === 'Boya') {
    const c = malzeme.ad?.includes('Kırmızı') ? '#C0392B' : '#7B7D7E';
    glyph = <><rect x="9" y="10" width="18" height="20" rx="1" fill={c} stroke={stroke} strokeWidth="0.8" /><rect x="11" y="6" width="14" height="4" rx="1" fill={c} stroke={stroke} strokeWidth="0.8" /></>;
  } else if (malzeme?.kategori === 'Bağlantı') {
    if (malzeme.ad?.includes('Cıvata'))
      glyph = <><polygon points="8,9 16,5 24,9 24,15 16,19 8,15" fill="#8C8C8C" stroke={stroke} strokeWidth="0.8" /><rect x="14" y="15" width="4" height="14" fill="#8C8C8C" stroke={stroke} strokeWidth="0.8" /></>;
    else
      glyph = <><rect x="14" y="4" width="4" height="28" fill="#A0A0A0" stroke={stroke} strokeWidth="0.8" /><line x1="14" y1="9" x2="18" y2="9" stroke={stroke} strokeWidth="0.8" /><line x1="14" y1="14" x2="18" y2="14" stroke={stroke} strokeWidth="0.8" /><line x1="14" y1="19" x2="18" y2="19" stroke={stroke} strokeWidth="0.8" /><line x1="14" y1="24" x2="18" y2="24" stroke={stroke} strokeWidth="0.8" /></>;
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

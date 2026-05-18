import React from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { IconCheck } from '../components/ui/Icons.jsx';

/**
 * New-material form success screen — shows a summary of the added material.
 * @param {object} props
 * @param {string} props.yeniAd - Display name of the created material
 * @param {'boru'|'diger'} props.grup - Material group
 * @param {string} props.birim - Unit label (e.g. 'm', 'adet')
 * @param {string|number} props.baslangic - Opening stock quantity
 * @param {string|number} props.minimum - Minimum stock threshold
 * @param {() => void} props.goBack - Called when the "OK" button is pressed
 */
export function YeniMalzemeBasarili({ yeniAd, grup, birim, baslangic, minimum, goBack }) {
  return (
    <div style={{ padding: '60px 24px 100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: TOKENS.okSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={36} color={TOKENS.ok} />
      </div>
      <h2 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 22, margin: 0, color: TOKENS.ink }}>Malzeme kataloga eklendi</h2>
      <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 14, padding: 16, width: '100%', textAlign: 'left' }}>
        <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 1, textTransform: 'uppercase' }}>
          {grup === 'boru' ? 'Boru & Fittings' : 'Diğer Malzeme'}
        </div>
        <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 17, color: TOKENS.ink, marginTop: 2 }}>{yeniAd}</div>
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${TOKENS.lineSoft}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 0.6 }}>AÇILIŞ</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 17, fontWeight: 600, color: TOKENS.ink }}>
              {baslangic || 0} <span style={{ fontSize: 11, color: TOKENS.inkMuted }}>{birim}</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 0.6 }}>MİNİMUM</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 17, fontWeight: 600, color: TOKENS.ink }}>
              {minimum} <span style={{ fontSize: 11, color: TOKENS.inkMuted }}>{birim}</span>
            </div>
          </div>
        </div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding: '12px 30px' }}>Tamam</button>
    </div>
  );
}

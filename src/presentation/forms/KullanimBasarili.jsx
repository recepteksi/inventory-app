import React from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.jsx';
import { IconCheck } from '../components/ui/Icons.jsx';
import { MalzemeGlyph } from '../components/ui/MalzemeGlyph.jsx';
import { UstaAvatar } from '../components/ui/UstaAvatar.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';
import { fmtTarih } from '../../utils/fmtTarih.js';

/**
 * Usage form success screen — shows a summary of the recorded usage.
 * @param {object} props
 * @param {object} props.m - Material snapshot before the update
 * @param {number|string} props.miktar - Recorded quantity
 * @param {object|null} props.usta - Worker who performed the job (not shown when null)
 * @param {string} props.is - Job description
 * @param {string} props.tarih - ISO date string (YYYY-MM-DD)
 * @param {() => void} props.goBack - Called when the "OK" button is pressed
 */
export function KullanimBasarili({ m, miktar, usta, is, tarih, goBack }) {
  return (
    <div style={{ padding: '60px 24px 100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: TOKENS.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={36} color={TOKENS.accent} />
      </div>
      <h2 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 22, margin: 0, color: TOKENS.ink }}>Kullanım kaydedildi</h2>
      <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 14, padding: 16, width: '100%', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MalzemeGlyph malzeme={m} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 15, color: TOKENS.ink }}>{getMalzemeAd(m)}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 14, fontWeight: 600, color: TOKENS.accent }}>−{miktar} {m.birim}</div>
          </div>
        </div>
        {usta && (
          <div style={{ marginTop: 10, padding: '10px 0 0', borderTop: `1px solid ${TOKENS.lineSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UstaAvatar usta={usta} size={24} />
              <span style={{ fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.ink, fontWeight: 600 }}>{usta.ad}</span>
              <span style={{ fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.inkSoft }}>· {usta.uzmanlik}</span>
            </div>
            <div style={{ fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.ink, marginTop: 4, lineHeight: 1.4 }}>{is}</div>
          </div>
        )}
        <div style={{ marginTop: 10, fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{fmtTarih(tarih)}</div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding: '12px 30px' }}>Tamam</button>
    </div>
  );
}

import React from 'react';
import { TOKENS } from '../ui/tokens.jsx';

/**
 * Full-screen error state shown when the API connection fails.
 * @param {object} props
 * @param {string} props.message - Error message displayed to the user
 */
export function ErrorScreen({ message }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12, fontFamily: TOKENS.font, color: TOKENS.low }}>
      <div style={{ fontSize: 18, fontWeight: 600 }}>Bağlantı hatası</div>
      <div style={{ fontSize: 14, color: TOKENS.inkSoft }}>{message}</div>
    </div>
  );
}

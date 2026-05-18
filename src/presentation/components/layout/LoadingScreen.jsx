import React from 'react';
import { TOKENS } from '../ui/tokens.jsx';

/** Full-screen loading state shown while initial data is being fetched. */
export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: TOKENS.font, color: TOKENS.inkMuted, fontSize: 14 }}>
      Veriler yükleniyor…
    </div>
  );
}

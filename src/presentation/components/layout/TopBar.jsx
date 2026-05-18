import React from 'react';
import { TOKENS } from '../ui/tokens.jsx';

/**
 * Sticky top bar showing the site name and today's date.
 * Stays fixed during scroll and applies a frosted-glass blur effect.
 */
export function TopBar() {
  const bugun = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 30, background: `${TOKENS.bg}f2`, backdropFilter: 'blur(8px)', borderBottom: `1px solid ${TOKENS.line}`, padding: '10px 32px' }}>
      <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5 }}>
        ŞANTİYE · MERKEZ ATÖLYE
        <span style={{ margin: '0 8px', color: TOKENS.line }}>|</span>
        {bugun}
      </div>
    </div>
  );
}

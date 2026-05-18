import React from 'react';
import { TOKENS } from './tokens.jsx';

/**
 * Selectable filter chip. Shows a dark background when active, an outline when inactive.
 * @param {object} props
 * @param {React.ReactNode} props.children - Chip content
 * @param {boolean} [props.active=false] - Selected state
 * @param {() => void} [props.onClick] - Click handler
 */
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

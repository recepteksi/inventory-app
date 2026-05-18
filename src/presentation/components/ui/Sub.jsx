import React from 'react';
import { TOKENS } from './tokens.jsx';

/**
 * Small uppercase label — used for section headings and form sub-labels.
 * @param {object} props
 * @param {React.ReactNode} props.children - Text content
 * @param {React.CSSProperties} [props.style] - Additional inline styles
 */
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

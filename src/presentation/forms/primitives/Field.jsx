import React from 'react';
import { TOKENS } from '../../components/ui/tokens.jsx';

/**
 * Form field wrapper — renders a label, an optional marker, and an inline hint.
 * @param {object} props
 * @param {string} props.label - Field label text
 * @param {boolean} [props.optional] - When true, appends "(optional)" to the label
 * @param {string} [props.hint] - Short warning or guidance shown to the right of the label
 * @param {React.ReactNode} props.children - Form control (input, select, etc.)
 */
export function Field({ label, optional, hint, children }) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6, gap: 8 }}>
        <label style={{ fontFamily: TOKENS.font, fontSize: 13, fontWeight: 600, color: TOKENS.ink, whiteSpace: 'nowrap' }}>
          {label}{' '}
          {optional && <span style={{ color: TOKENS.inkMuted, fontWeight: 400 }}>(opsiyonel)</span>}
        </label>
        {hint && <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.low, fontWeight: 600 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

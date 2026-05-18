import React from 'react';
import { TOKENS } from '../../components/ui/tokens.jsx';

/**
 * Date picker — uses the browser's native date input.
 * @param {object} props
 * @param {string} props.value - ISO date value (YYYY-MM-DD)
 * @param {(value: string) => void} props.onChange - Called with the new ISO date string
 */
export function DateInput({ value, onChange }) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: '100%', boxSizing: 'border-box', padding: '12px 14px',
        border: `1px solid ${TOKENS.line}`, borderRadius: 10,
        background: TOKENS.paper, fontFamily: TOKENS.mono,
        fontSize: 15, color: TOKENS.ink, outline: 'none',
      }}
    />
  );
}

import React from 'react';
import { TOKENS } from '../../components/ui/tokens.jsx';

/**
 * Horizontal chip group — single-select option list.
 * @param {object} props
 * @param {string} props.value - Currently selected option value
 * @param {(value: string) => void} props.onChange - Selection change handler
 * @param {string[]} props.options - Array of option values to render
 */
export function ChipPicker({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            appearance: 'none',
            border: `1px solid ${value === o ? TOKENS.ink : TOKENS.line}`,
            background: value === o ? TOKENS.ink : TOKENS.paper,
            color: value === o ? '#fff' : TOKENS.ink,
            padding: '7px 12px', borderRadius: 999,
            fontFamily: TOKENS.font, fontWeight: 500, fontSize: 13,
            cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

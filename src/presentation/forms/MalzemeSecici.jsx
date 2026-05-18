import React, { useState } from 'react';
import { TOKENS } from '../components/ui/tokens.jsx';
import { IconArrow } from '../components/ui/Icons.jsx';
import { SeciciSheet } from './SeciciSheet.jsx';
import { useStore } from '../store/store.jsx';
import { getMalzemeAd } from '../../domain/entities/material.js';

/**
 * Material selection control — opens the SeciciSheet bottom-sheet on click.
 * @param {object} props
 * @param {string} props.value - Selected material ID (placeholder shown when empty)
 * @param {(id: string) => void} props.onChange - Called with the new ID after selection
 */
export function MalzemeSecici({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const { getMalzeme } = useStore();
  const m = value ? getMalzeme(value) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ appearance: 'none', width: '100%', textAlign: 'left', border: `1px solid ${TOKENS.line}`, borderRadius: 10, background: TOKENS.paper, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}
      >
        <span style={{ fontFamily: TOKENS.font, fontSize: 15, color: m ? TOKENS.ink : TOKENS.inkMuted }}>
          {m ? getMalzemeAd(m) : 'Malzeme seç…'}
        </span>
        <IconArrow dir="down" />
      </button>
      {open && (
        <SeciciSheet
          onClose={() => setOpen(false)}
          onPick={(id) => { onChange(id); setOpen(false); }}
        />
      )}
    </>
  );
}

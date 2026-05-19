import { useState } from 'react';
import { TOKENS } from '../components/ui/tokens.tsx';
import { IconArrow } from '../components/ui/Icons.tsx';
import { PickerSheet } from './PickerSheet.tsx';
import { useStore } from '../store/store.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';

interface MaterialPickerProps {
  value: string;
  onChange: (id: string) => void;
}

export function MaterialPicker({ value, onChange }: MaterialPickerProps) {
  const [open, setOpen] = useState(false);
  const { getMaterial } = useStore();
  const m = value ? getMaterial(value) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{ appearance: 'none', width: '100%', textAlign: 'left', border: `1px solid ${TOKENS.line}`, borderRadius: 10, background: TOKENS.paper, padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}
      >
        <span style={{ fontFamily: TOKENS.font, fontSize: 15, color: m ? TOKENS.ink : TOKENS.inkMuted }}>
          {m ? getMaterialName(m) : t('materialPicker.placeholder')}
        </span>
        <IconArrow dir="down" />
      </button>
      {open && (
        <PickerSheet
          onClose={() => setOpen(false)}
          onPick={(id) => { onChange(id); setOpen(false); }}
        />
      )}
    </>
  );
}

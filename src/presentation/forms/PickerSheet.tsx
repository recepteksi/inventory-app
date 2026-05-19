import { useState } from 'react';
import { TOKENS } from '../components/ui/tokens.tsx';
import { IconArrow, IconSearch } from '../components/ui/Icons.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { useStore } from '../store/store.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t, tr } from '../../i18n/tr.ts';

interface PickerSheetProps {
  onClose: () => void;
  onPick: (id: string) => void;
}

export function PickerSheet({ onClose, onPick }: PickerSheetProps) {
  const [q, setQ] = useState('');
  const { pipeFittings, otherMaterials } = useStore();
  const all = [...pipeFittings, ...otherMaterials];
  const filtered = q
    ? all.filter((m) => getMaterialName(m).toLowerCase().includes(q.toLowerCase()))
    : all;

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(20,16,12,0.4)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: TOKENS.bg, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ padding: '10px 0 0', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 36, height: 4, borderRadius: 99, background: TOKENS.line }} />
        </div>
        <div style={{ padding: '12px 20px 8px' }}>
          <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 17, color: TOKENS.ink, marginBottom: 8 }}>{t('materialPicker.sheetTitle')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 10, padding: '8px 12px' }}>
            <IconSearch />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('materialPicker.searchPlaceholder')}
              autoFocus
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TOKENS.font, fontSize: 15 }}
            />
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '4px 20px 24px' }}>
          {filtered.map((m) => (
            <button
              key={m.id}
              onClick={() => onPick(m.id)}
              style={{ appearance: 'none', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', borderBottom: `1px solid ${TOKENS.lineSoft}`, textAlign: 'left' }}
            >
              <MaterialGlyph material={m} size={34} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: TOKENS.font, fontSize: 14.5, color: TOKENS.ink }}>{getMaterialName(m)}</div>
                <div style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>
                  {tr.materialPicker.stockLabel.replace('{stock}', String(m.stock)).replace('{unit}', m.unit)}
                </div>
              </div>
              <IconArrow />
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 30, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('materialPicker.noResults')}</div>
          )}
        </div>
      </div>
    </div>
  );
}

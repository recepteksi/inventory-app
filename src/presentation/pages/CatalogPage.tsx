import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { Sub } from '../components/ui/Sub.tsx';
import { useStore } from '../store/store.tsx';
import { t, tr } from '../../i18n/tr.ts';
import type { CatalogField, MaterialGroup } from '../../types/index.ts';

const SECTIONS: { id: MaterialGroup; label: string; fields: CatalogField[] }[] = [
  { id: 'pipe', label: 'Boru & Fittings', fields: ['diameter', 'kind', 'grade'] },
  { id: 'ventilation', label: 'Havalandırma', fields: ['diameter', 'kind', 'grade'] },
  { id: 'isolation', label: 'İzolasyon', fields: ['kind', 'grade', 'diameter', 'thickness'] },
  { id: 'other', label: 'Diğer Malzeme', fields: ['category', 'unit'] },
];

function FieldRow({ section, field }: { section: MaterialGroup; field: CatalogField }) {
  const { catalog, addCatalog, reorderCatalog, removeCatalog } = useStore();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const custom = catalog.filter((c) => c.section === section && c.field === field);

  const add = async () => {
    const v = value.trim();
    if (!v || busy) return;
    setBusy(true); setError('');
    try {
      await addCatalog({ section, field, value: v });
      setValue('');
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    setBusy(true); setError('');
    try {
      await removeCatalog(id);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const move = async (id: string, direction: 'up' | 'down') => {
    setBusy(true); setError('');
    try {
      await reorderCatalog(id, direction);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ padding: '12px 14px', borderTop: `1px solid ${TOKENS.lineSoft}` }}>
      <Sub style={{ marginBottom: 6 }}>{tr.catalogPage.fieldLabels[field]}</Sub>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
        {custom.map((c, i) => {
          const arrow = { appearance: 'none' as const, border: 'none', background: 'transparent', cursor: busy ? 'default' : 'pointer', color: TOKENS.inkMuted, fontSize: 12, lineHeight: 1, padding: 0 };
          return (
            <span key={c.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 8px 5px 10px', borderRadius: 999, border: `1px solid ${TOKENS.ink}`, background: TOKENS.paper, fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.ink }}>
              {c.value}
              <button onClick={() => void move(c.id, 'up')} disabled={busy || i === 0} title={tr.catalogPage.moveUp} style={{ ...arrow, opacity: i === 0 ? 0.25 : 1 }}>↑</button>
              <button onClick={() => void move(c.id, 'down')} disabled={busy || i === custom.length - 1} title={tr.catalogPage.moveDown} style={{ ...arrow, opacity: i === custom.length - 1 ? 0.25 : 1 }}>↓</button>
              <button onClick={() => void remove(c.id)} disabled={busy} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', color: TOKENS.inkMuted, fontSize: 15, lineHeight: 1, padding: 0 }}>×</button>
            </span>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') void add(); }}
          placeholder={tr.catalogPage.addPlaceholder}
          style={{ flex: 1, maxWidth: 220, boxSizing: 'border-box', padding: '8px 12px', border: `1px solid ${TOKENS.line}`, borderRadius: 8, background: TOKENS.paper, fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.ink, outline: 'none' }}
        />
        <button onClick={() => void add()} disabled={!value.trim() || busy} style={{ ...btnPrimaryStyle, padding: '8px 14px', fontSize: 13, opacity: value.trim() && !busy ? 1 : 0.4 }}>{tr.catalogPage.add}</button>
      </div>
      {error && <div style={{ marginTop: 6, fontFamily: TOKENS.font, fontSize: 12, color: TOKENS.low }}>{error}</div>}
    </div>
  );
}

export function CatalogPage() {
  return (
    <div>
      <div style={{ paddingBottom: 4 }}>
        <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6, color: TOKENS.ink }}>{t('catalogPage.title')}</h1>
        <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('catalogPage.subtitle')}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginTop: 16 }}>
        {SECTIONS.map((s) => (
          <div key={s.id} style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '12px 14px', fontFamily: TOKENS.font, fontWeight: 600, fontSize: 15, color: TOKENS.ink, background: TOKENS.bg }}>{s.label}</div>
            {s.fields.map((f) => <FieldRow key={f} section={s.id} field={f} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

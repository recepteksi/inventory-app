import React, { useMemo, useState } from 'react';
import { TOKENS, stockStatus, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { Chip } from '../components/ui/Chip.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import { Sub } from '../components/ui/Sub.tsx';
import { IconSearch } from '../components/ui/Icons.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { useStore } from '../store/store.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';
import type { Material } from '../../types/index.ts';

interface ThProps {
  children?: React.ReactNode;
  sortKey?: string;
  dir?: 'asc' | 'desc';
  k?: string;
  onClick?: () => void;
  w?: number;
  align?: 'left' | 'right' | 'center';
}

function Th({ children, sortKey, dir, k, onClick, w, align = 'left' }: ThProps) {
  const sorted = sortKey === k;
  return (
    <th onClick={onClick} style={{ padding: '10px 14px', textAlign: align, width: w, fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.inkMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontWeight: 600, cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}>
      {children}{sorted && <span style={{ marginLeft: 4, color: TOKENS.ink }}>{dir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );
}

interface TdProps {
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
}

function Td({ children, align = 'left' }: TdProps) {
  return <td style={{ padding: '10px 14px', textAlign: align, fontFamily: TOKENS.font, fontSize: 13.5, color: TOKENS.ink, verticalAlign: 'middle' }}>{children}</td>;
}

interface StatTileProps {
  k: string;
  v: string | number;
  sub: string;
  warn?: boolean;
}

function StatTile({ k, v, sub, warn }: StatTileProps) {
  return (
    <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, padding: 14 }}>
      <Sub style={{ marginBottom: 2 }}>{k}</Sub>
      <span style={{ fontFamily: TOKENS.mono, fontSize: 28, fontWeight: 600, color: warn ? TOKENS.low : TOKENS.ink, letterSpacing: -0.5 }}>{v}</span>
      <div style={{ fontFamily: TOKENS.font, fontSize: 12, color: TOKENS.inkMuted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

interface StockBarProps {
  item: Pick<Material, 'stock' | 'minimum'>;
}

function StockBar({ item }: StockBarProps) {
  const ratio = Math.min(item.stock / (item.minimum * 2 || 1), 1);
  const d = stockStatus(item);
  return (
    <div style={{ width: 90, height: 4, background: TOKENS.lineSoft, borderRadius: 2, marginTop: 4, marginLeft: 'auto', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${ratio * 100}%`, background: d.color, borderRadius: 2 }} />
      <div style={{ position: 'absolute', left: '50%', top: -1, bottom: -1, width: 1, background: TOKENS.inkMuted, opacity: 0.4 }} />
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

function FilterGroup({ label, value, onChange, options }: FilterGroupProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <Sub style={{ marginRight: 2 }}>{label}</Sub>
      {options.map((o) => (
        <Chip key={o} active={value === o} onClick={() => onChange(o)}>{o === 'all' ? t('stockPage.filterAll') : o}</Chip>
      ))}
    </div>
  );
}

interface StockPageProps {
  open: (kind: string, id?: string) => void;
}

export function StockPage({ open }: StockPageProps) {
  const { pipeFittings, otherMaterials, movements } = useStore();
  const [group, setGroup] = useState('pipe');
  const [diameter, setDiameter] = useState('all');
  const [grade, setGrade] = useState('all');
  const [kind, setKind] = useState('all');
  const [category, setCategory] = useState('all');
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const items = useMemo(() => {
    let list = group === 'pipe' ? pipeFittings : otherMaterials;
    list = list.filter((m) => {
      if (group === 'pipe') {
        if (diameter !== 'all' && m.diameter !== diameter) return false;
        if (grade !== 'all' && m.grade !== grade) return false;
        if (kind !== 'all' && m.kind !== kind) return false;
      } else {
        if (category !== 'all' && m.category !== category) return false;
      }
      if (statusFilter !== 'all') {
        const d = stockStatus(m);
        if (statusFilter === 'low' && d.label !== t('status.low')) return false;
        if (statusFilter === 'watch' && d.label !== t('status.watch')) return false;
        if (statusFilter === 'in-stock' && d.label !== t('status.inStock')) return false;
      }
      if (q && !getMaterialName(m).toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      const av = (a as unknown as Record<string, unknown>)[sortKey];
      const bv = (b as unknown as Record<string, unknown>)[sortKey];
      if (av === bv) return 0;
      return ((av ?? '') < (bv ?? '') ? -1 : 1) * (sortDir === 'asc' ? 1 : -1);
    });
  }, [pipeFittings, otherMaterials, group, diameter, grade, kind, category, q, statusFilter, sortKey, sortDir]);

  const counts = useMemo(() => ({
    total: pipeFittings.length + otherMaterials.length,
    low: [...pipeFittings, ...otherMaterials].filter((m) => m.stock < m.minimum).length,
    pipe: pipeFittings.length,
    other: otherMaterials.length,
  }), [pipeFittings, otherMaterials]);

  const monthStats = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    const thisMonth = movements.filter((h) => h.date.startsWith(month));
    const deliveries = thisMonth.filter((h) => h.type === 'delivery');
    const usages = thisMonth.filter((h) => h.type === 'usage');
    return {
      deliveryCount: deliveries.length,
      deliveryQty: deliveries.reduce((s, h) => s + h.quantity, 0),
      usageCount: usages.length,
      usageWorkerCount: new Set(usages.map((h) => h.workerId)).size,
    };
  }, [movements]);

  const toggleSort = (k: string) => {
    if (sortKey === k) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir('asc'); }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6, color: TOKENS.ink }}>{t('stockPage.title')}</h1>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('stockPage.subtitle')}</div>
        </div>
        <button onClick={() => open('new-material', group)} style={btnPrimaryStyle}>{t('stockPage.addMaterial')}</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 16 }}>
        <StatTile k={t('stockPage.statTotal')} v={counts.total} sub={`${counts.pipe} boru/fittings · ${counts.other} diğer`} />
        <StatTile k={t('stockPage.statLow')} v={counts.low} sub={t('stockPage.statLowSub')} warn />
        <StatTile k={t('stockPage.statDelivery')} v={monthStats.deliveryCount} sub={t('stockPage.statDeliverySub').replace('{qty}', String(monthStats.deliveryQty))} />
        <StatTile k={t('stockPage.statUsage')} v={monthStats.usageCount} sub={t('stockPage.statUsageSub').replace('{count}', String(monthStats.usageWorkerCount))} />
      </div>

      <div style={{ marginTop: 20, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', background: TOKENS.lineSoft, padding: 3, borderRadius: 9 }}>
            {[{ id: 'pipe', label: t('stockPage.tabPipe'), n: counts.pipe }, { id: 'other', label: t('stockPage.tabOther'), n: counts.other }].map((tab) => (
              <button key={tab.id} onClick={() => setGroup(tab.id)} style={{ appearance: 'none', border: 'none', cursor: 'pointer', padding: '6px 12px', borderRadius: 7, background: group === tab.id ? TOKENS.paper : 'transparent', color: group === tab.id ? TOKENS.ink : TOKENS.inkSoft, fontFamily: TOKENS.font, fontWeight: 600, fontSize: 13, boxShadow: group === tab.id ? '0 1px 2px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                {tab.label}
                <span style={{ fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.inkMuted, background: group === tab.id ? TOKENS.lineSoft : 'transparent', padding: '1px 6px', borderRadius: 4 }}>{tab.n}</span>
              </button>
            ))}
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: TOKENS.bg, border: `1px solid ${TOKENS.line}`, borderRadius: 8, padding: '7px 10px' }}>
              <IconSearch />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('stockPage.searchPlaceholder')} style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: TOKENS.font, fontSize: 14 }} />
              {q && <button onClick={() => setQ('')} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', color: TOKENS.inkMuted, fontSize: 14 }}>×</button>}
            </div>
          </div>
          <div style={{ display: 'inline-flex', gap: 4 }}>
            {[{ id: 'all', label: t('stockPage.filterAll') }, { id: 'low', label: t('stockPage.filterLow'), c: TOKENS.low }, { id: 'watch', label: t('stockPage.filterWatch'), c: TOKENS.accent }, { id: 'in-stock', label: t('stockPage.filterInStock'), c: TOKENS.ok }].map((sf) => (
              <Chip key={sf.id} active={statusFilter === sf.id} onClick={() => setStatusFilter(sf.id)}>
                {'c' in sf && sf.c && <span style={{ width: 7, height: 7, borderRadius: 99, background: sf.c, display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />}
                {sf.label}
              </Chip>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {group === 'pipe' ? (
            <>
              <FilterGroup label={t('stockPage.filterDiameter')} value={diameter} onChange={setDiameter} options={['all', '1"', '2"', '3"']} />
              <FilterGroup label={t('stockPage.filterKind')} value={kind} onChange={setKind} options={['all', 'Boru', 'Dirsek', 'Tee', 'Manşon']} />
              <FilterGroup label={t('stockPage.filterGrade')} value={grade} onChange={setGrade} options={['all', 'Siyah', 'Galvaniz', 'Paslanmaz']} />
            </>
          ) : (
            <FilterGroup label={t('stockPage.filterCategory')} value={category} onChange={setCategory} options={['all', 'Elektrod', 'Boya', 'Bağlantı']} />
          )}
        </div>
      </div>

      <div style={{ marginTop: 16, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: TOKENS.font }}>
          <thead>
            <tr style={{ background: TOKENS.bg, borderBottom: `1px solid ${TOKENS.line}` }}>
              <Th onClick={() => toggleSort('id')} sortKey={sortKey} dir={sortDir} k="id" w={120}>{t('stockPage.colCode')}</Th>
              <Th>{t('stockPage.colMaterial')}</Th>
              {group === 'pipe' && <><Th w={70}>{t('stockPage.colDiameter')}</Th><Th w={100}>{t('stockPage.colKind')}</Th><Th w={110}>{t('stockPage.colGrade')}</Th></>}
              {group === 'other' && <Th w={130}>{t('stockPage.filterCategory')}</Th>}
              <Th onClick={() => toggleSort('stock')} sortKey={sortKey} dir={sortDir} k="stock" w={120} align="right">{t('stockPage.colStock')}</Th>
              <Th onClick={() => toggleSort('minimum')} sortKey={sortKey} dir={sortDir} k="minimum" w={90} align="right">{t('stockPage.colMin')}</Th>
              <Th w={110}>{t('stockPage.colStatus')}</Th>
              <Th w={130} align="right" />
            </tr>
          </thead>
          <tbody>
            {items.map((m) => {
              const d = stockStatus(m);
              return (
                <tr key={m.id} onClick={() => open('detail', m.id)} style={{ borderBottom: `1px solid ${TOKENS.lineSoft}`, cursor: 'pointer' }} onMouseEnter={(e) => (e.currentTarget.style.background = TOKENS.bg)} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <Td><span style={{ fontFamily: TOKENS.mono, fontSize: 11.5, color: TOKENS.inkMuted, letterSpacing: 0.5 }}>{m.id.toUpperCase()}</span></Td>
                  <Td><div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><MaterialGlyph material={m} size={32} /><span style={{ fontWeight: 500, fontSize: 14 }}>{getMaterialName(m)}</span></div></Td>
                  {group === 'pipe' && <><Td><span style={{ fontFamily: TOKENS.mono, fontSize: 13 }}>{m.diameter}</span></Td><Td>{m.kind}</Td><Td>{m.grade}</Td></>}
                  {group === 'other' && <Td>{m.category}</Td>}
                  <Td align="right">
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: 'flex-end' }}>
                      <span style={{ fontFamily: TOKENS.mono, fontSize: 17, fontWeight: 600, letterSpacing: -0.3 }}>{m.stock}</span>
                      <span style={{ fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.inkMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>{m.unit}</span>
                    </div>
                    <StockBar item={m} />
                  </Td>
                  <Td align="right"><span style={{ fontFamily: TOKENS.mono, fontSize: 12, color: TOKENS.inkSoft }}>{m.minimum}</span></Td>
                  <Td><Pill color={d.color} soft={d.softColor}>{d.label}</Pill></Td>
                  <Td align="right">
                    <div style={{ display: 'inline-flex', gap: 4 }}>
                      <button onClick={(e) => { e.stopPropagation(); open('delivery', m.id); }} title={t('stockPage.recordDelivery')} style={{ appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, width: 28, height: 28, borderRadius: 7, cursor: 'pointer', fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>↓</button>
                      <button onClick={(e) => { e.stopPropagation(); open('usage', m.id); }} title={t('stockPage.recordUsage')} style={{ appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, width: 28, height: 28, borderRadius: 7, cursor: 'pointer', fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>↑</button>
                      <button onClick={(e) => { e.stopPropagation(); open('edit-material', m.id); }} title={t('stockPage.editMaterial')} style={{ appearance: 'none', border: `1px solid ${TOKENS.line}`, background: TOKENS.paper, width: 28, height: 28, borderRadius: 7, cursor: 'pointer', fontFamily: TOKENS.font, fontSize: 12, color: TOKENS.inkSoft, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>✎</button>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {items.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('common.noResults')}</div>}
      </div>
      <div style={{ marginTop: 10, fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, textAlign: 'right' }}>{t('stockPage.footer').replace('{count}', String(items.length))}</div>
    </div>
  );
}

import { useMemo } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { WorkerAvatar } from '../components/ui/WorkerAvatar.tsx';
import { useStore } from '../store/store.tsx';
import { formatDate } from '../../utils/formatDate.ts';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';
import type { Movement } from '../../types/index.ts';

interface UsageGroup {
  key: string;
  workerId?: string;
  jobDescription: string;
  date: string;
  items: Movement[];
}

interface UsagesPageProps {
  open: (kind: string, id?: string) => void;
}

export function UsagesPage({ open }: UsagesPageProps) {
  const { movements, getMaterial, getWorker } = useStore();

  const groups = useMemo<UsageGroup[]>(() => {
    const usages = movements.filter((m) => m.type === 'usage');
    const map = new Map<string, UsageGroup>();
    for (const u of usages) {
      const key = u.batchId ?? u.id;
      const existing = map.get(key);
      if (existing) existing.items.push(u);
      else map.set(key, { key, workerId: u.workerId, jobDescription: u.jobDescription ?? '', date: u.date, items: [u] });
    }
    return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
  }, [movements]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6 }}>{t('usagesPage.title')}</h1>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('usagesPage.subtitle')}</div>
        </div>
        <button onClick={() => open('batch-usage')} style={btnPrimaryStyle}>{t('usagesPage.addBatch')}</button>
      </div>

      {groups.length === 0 ? (
        <div style={{ marginTop: 40, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('usagesPage.empty')}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
          {groups.map((g) => {
            const worker = g.workerId ? getWorker(g.workerId) : null;
            return (
              <div key={g.key} style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: `1px solid ${TOKENS.lineSoft}`, background: TOKENS.bg }}>
                  {worker ? <WorkerAvatar worker={worker} size={36} /> : <div style={{ width: 36 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14.5, color: TOKENS.ink }}>{g.jobDescription || '—'}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 3 }}>
                      <span style={{ fontFamily: TOKENS.font, fontSize: 12.5, color: TOKENS.inkSoft }}>{worker?.name ?? '—'}</span>
                      <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>{formatDate(g.date)}</span>
                    </div>
                  </div>
                  <Pill>{t('usagesPage.itemCount').replace('{n}', String(g.items.length))}</Pill>
                </div>
                <div>
                  {g.items.map((it) => {
                    const m = getMaterial(it.materialId);
                    return (
                      <div key={it.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px', borderBottom: `1px solid ${TOKENS.lineSoft}` }}>
                        {m && <MaterialGlyph material={m} size={28} />}
                        <div style={{ flex: 1, fontFamily: TOKENS.font, fontSize: 13.5, color: TOKENS.ink }}>{getMaterialName(m)}</div>
                        <div style={{ fontFamily: TOKENS.mono, fontSize: 13, fontWeight: 600, color: TOKENS.accent }}>−{it.quantity} <span style={{ color: TOKENS.inkMuted, fontSize: 10.5 }}>{m?.unit}</span></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

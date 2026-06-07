import React, { useState } from 'react';
import { TOKENS, btnPrimaryStyle, btnGhostStyle, btnDangerStyle } from '../components/ui/tokens.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import { Sub } from '../components/ui/Sub.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { WorkerAvatar } from '../components/ui/WorkerAvatar.tsx';
import { useStore } from '../store/store.tsx';
import { useAuth } from '../auth/AuthProvider.tsx';
import { formatDate } from '../../utils/formatDate.ts';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';
import type { Material, Movement } from '../../types/index.ts';

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${TOKENS.lineSoft}`, fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, background: TOKENS.bg }}>
      {children}
    </div>
  );
}

interface JobGroup {
  key: string;
  jobDescription: string;
  date: string;
  items: Movement[];
}

/** Groups a worker's usage movements by job (one job = one batch), so the same
 * job + date is shown once with its materials listed beneath it. */
function groupJobs(movements: Movement[]): JobGroup[] {
  const map = new Map<string, JobGroup>();
  for (const h of movements) {
    const key = h.batchId ?? h.id;
    const existing = map.get(key);
    if (existing) existing.items.push(h);
    else map.set(key, { key, jobDescription: h.jobDescription ?? '', date: h.date, items: [h] });
  }
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
}

interface WorkersPageProps {
  open: (kind: string, id?: string) => void;
}

export function WorkersPage({ open }: WorkersPageProps) {
  const { workers, movementsForWorker, getMaterial, removeWorker } = useStore();
  const { isAdmin } = useAuth();
  const [activeWorkerId, setActiveWorkerId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [deleting, setDeleting] = useState(false);

  const effectiveSelected = activeWorkerId || workers[0]?.id || null;

  if (!workers.length) return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6 }}>{t('workersPage.title')}</h1>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('workersPage.subtitle')}</div>
        </div>
        {isAdmin && <button onClick={() => open('new-worker')} style={btnPrimaryStyle}>{t('workersPage.addWorker')}</button>}
      </div>
      <div style={{ marginTop: 40, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('workersPage.empty')}</div>
    </div>
  );

  const worker = workers.find((x) => x.id === effectiveSelected) || workers[0];
  const movements = movementsForWorker(worker.id);
  const jobGroups = groupJobs(movements);

  const materialUsage: Record<string, { quantity: number; unit: string; m: Material }> = {};
  movements.forEach((h) => {
    const m = getMaterial(h.materialId);
    if (!m) return;
    const key = getMaterialName(m);
    materialUsage[key] = materialUsage[key] || { quantity: 0, unit: m.unit, m };
    materialUsage[key].quantity += h.quantity;
  });
  const topMaterials = Object.entries(materialUsage).sort((a, b) => b[1].quantity - a[1].quantity);

  const handleDelete = async (id: string) => {
    const w = workers.find((x) => x.id === id);
    if (!window.confirm(t('workersPage.deleteConfirm').replace('{name}', w?.name ?? ''))) return;
    setDeleting(true); setDeleteError('');
    try {
      await removeWorker(id);
      setActiveWorkerId(workers.find((x) => x.id !== id)?.id || null);
    } catch (e) {
      setDeleteError((e as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6 }}>{t('workersPage.title')}</h1>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('workersPage.subtitle')}</div>
        </div>
        {isAdmin && <button onClick={() => open('new-worker')} style={btnPrimaryStyle}>{t('workersPage.addWorker')}</button>}
      </div>
      {deleteError && <div style={{ marginTop: 10, padding: '10px 14px', background: 'oklch(0.96 0.03 30)', border: '1px solid oklch(0.80 0.10 30)', borderRadius: 10, fontFamily: TOKENS.font, fontSize: 13, color: 'oklch(0.45 0.18 30)' }}>{deleteError}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, marginTop: 16, alignItems: 'start' }}>
        <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
          {workers.map((w, i) => {
            const n = movementsForWorker(w.id).length;
            return (
              <button key={w.id} onClick={() => setActiveWorkerId(w.id)} style={{ appearance: 'none', width: '100%', textAlign: 'left', border: 'none', borderBottom: i === workers.length - 1 ? 'none' : `1px solid ${TOKENS.lineSoft}`, background: effectiveSelected === w.id ? TOKENS.bg : 'transparent', padding: '12px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, borderLeft: effectiveSelected === w.id ? `3px solid ${TOKENS.ink}` : '3px solid transparent' }}>
                <WorkerAvatar worker={w} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, color: TOKENS.ink }}>{w.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3 }}>
                    <Pill>{w.specialty.toUpperCase()}</Pill>
                    <span style={{ fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.inkMuted }}>{t('workersPage.workerJobs').replace('{n}', String(n))}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, padding: 18, display: 'flex', alignItems: 'center', gap: 16 }}>
            <WorkerAvatar worker={worker} size={64} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontFamily: TOKENS.font, fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: -0.3 }}>{worker.name}</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                <Pill>{worker.specialty.toUpperCase()}</Pill>
                <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>{t('workersPage.startDate').replace('{date}', formatDate(worker.startDate))}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontFamily: TOKENS.mono, fontSize: 28, fontWeight: 600, color: TOKENS.ink, letterSpacing: -0.5 }}>
              {movements.length}
              <Sub>{t('workersPage.registeredJobs')}</Sub>
            </div>
            {isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button onClick={() => open('edit-worker', worker.id)} style={{ ...btnGhostStyle, fontSize: 13 }}>{t('workersPage.btnEdit')}</button>
                <button onClick={() => handleDelete(worker.id)} disabled={deleting} style={{ ...btnDangerStyle, fontSize: 13, opacity: deleting ? 0.5 : 1 }}>{t('workersPage.btnDelete')}</button>
              </div>
            )}
          </div>

          {topMaterials.length > 0 && (
            <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
              <SubHeader>{t('workersPage.topMaterials')}</SubHeader>
              {topMaterials.slice(0, 5).map(([matName, info], i, arr) => (
                <div key={matName} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderBottom: i === arr.length - 1 ? 'none' : `1px solid ${TOKENS.lineSoft}` }}>
                  <MaterialGlyph material={info.m} size={30} />
                  <div style={{ flex: 1, fontFamily: TOKENS.font, fontSize: 13.5, color: TOKENS.ink }}>{matName}</div>
                  <div style={{ fontFamily: TOKENS.mono, fontSize: 14, fontWeight: 600, color: TOKENS.ink }}>
                    {info.quantity} <span style={{ color: TOKENS.inkMuted, fontSize: 10.5, fontWeight: 500 }}>{info.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
            <SubHeader>{t('workersPage.jobsHeading').replace('{count}', String(jobGroups.length))}</SubHeader>
            {jobGroups.length === 0
              ? <div style={{ padding: 30, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('workersPage.jobsEmpty')}</div>
              : jobGroups.map((g, gi) => (
                  <div key={g.key} style={{ borderTop: gi === 0 ? 'none' : `1px solid ${TOKENS.line}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: TOKENS.bg }}>
                      <div style={{ flex: 1, minWidth: 0, fontFamily: TOKENS.font, fontWeight: 600, fontSize: 13.5, color: TOKENS.ink }}>{g.jobDescription || '—'}</div>
                      <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>{formatDate(g.date)}</span>
                    </div>
                    {g.items.map((h) => {
                      const m = getMaterial(h.materialId);
                      if (!m) return null;
                      return (
                        <div key={h.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px 8px 22px', borderTop: `1px solid ${TOKENS.lineSoft}` }}>
                          <MaterialGlyph material={m} size={24} />
                          <span style={{ flex: 1, fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.ink }}>{getMaterialName(m)}</span>
                          <span style={{ fontFamily: TOKENS.mono, fontSize: 13, fontWeight: 600, color: TOKENS.accent }}>−{h.quantity} <span style={{ color: TOKENS.inkMuted, fontSize: 10.5 }}>{m.unit}</span></span>
                        </div>
                      );
                    })}
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
}

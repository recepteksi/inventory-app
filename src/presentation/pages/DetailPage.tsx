import React, { useState } from 'react';
import { TOKENS, stockStatus, btnGhostStyle, btnDangerStyle } from '../components/ui/tokens.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import { Sub } from '../components/ui/Sub.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { WorkerAvatar } from '../components/ui/WorkerAvatar.tsx';
import { useStore } from '../store/store.tsx';
import { formatDate } from '../../utils/formatDate.ts';
import { getMaterialName } from '../../domain/entities/material.ts';
import { t } from '../../i18n/tr.ts';
import type { Material, Movement } from '../../types/index.ts';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <div style={{ fontFamily: TOKENS.mono, fontSize: 11.5, color: TOKENS.inkMuted, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6, letterSpacing: 0.4 }}>
      {items.map((it, i) => (
        <React.Fragment key={it.label}>
          {it.onClick
            ? <button onClick={it.onClick} style={{ appearance: 'none', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit', color: TOKENS.inkSoft, padding: 0, textTransform: 'uppercase', letterSpacing: 'inherit' }}>{it.label}</button>
            : <span style={{ color: TOKENS.ink, textTransform: 'uppercase' }}>{it.label}</span>}
          {i < items.length - 1 && <span>/</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

interface RowProps {
  k: string;
  v: React.ReactNode;
  last?: boolean;
}

function Row({ k, v, last }: RowProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 14px', borderBottom: last ? 'none' : `1px solid ${TOKENS.lineSoft}`, fontFamily: TOKENS.font, fontSize: 14 }}>
      <span style={{ color: TOKENS.inkSoft }}>{k}</span>
      <span style={{ color: TOKENS.ink, fontWeight: 500 }}>{v}</span>
    </div>
  );
}

function SubHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: '12px 14px', borderBottom: `1px solid ${TOKENS.lineSoft}`, fontFamily: TOKENS.mono, fontSize: 10.5, color: TOKENS.inkMuted, textTransform: 'uppercase', letterSpacing: 1.2, fontWeight: 600, background: TOKENS.bg }}>
      {children}
    </div>
  );
}

interface BigBarProps {
  stock: number;
  min: number;
  color: string;
}

function BigBar({ stock, min, color }: BigBarProps) {
  const ratio = Math.min(stock / (min * 2 || 1), 1);
  return (
    <div style={{ width: '100%', height: 8, background: TOKENS.lineSoft, borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${ratio * 100}%`, background: color, borderRadius: 4 }} />
      <div style={{ position: 'absolute', left: '50%', top: -3, bottom: -3, width: 1.5, background: TOKENS.ink, opacity: 0.5 }} />
    </div>
  );
}

interface TimelineProps {
  movements: Movement[];
  m: Material;
}

function Timeline({ movements, m }: TimelineProps) {
  const { getWorker } = useStore();
  return (
    <div style={{ position: 'relative', paddingLeft: 24 }}>
      <div style={{ position: 'absolute', left: 7, top: 12, bottom: 12, width: 1, background: TOKENS.line }} />
      {movements.map((h) => {
        const isDelivery = h.type === 'delivery';
        const color = isDelivery ? TOKENS.ok : TOKENS.accent;
        const softColor = isDelivery ? TOKENS.okSoft : TOKENS.accentSoft;
        const worker = h.workerId ? getWorker(h.workerId) : null;
        return (
          <div key={h.id} style={{ position: 'relative', padding: '12px 0' }}>
            <div style={{ position: 'absolute', left: -23, top: 16, width: 15, height: 15, borderRadius: 99, background: softColor, border: `2px solid ${color}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontWeight: 700, fontSize: 9 }}>{isDelivery ? '↓' : '↑'}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{formatDate(h.date)}</span>
              <Pill color={color} soft={softColor}>{isDelivery ? t('detailPage.pillDelivery') : t('detailPage.pillUsage')}</Pill>
              <span style={{ fontFamily: TOKENS.mono, fontSize: 13, fontWeight: 600, color }}>{isDelivery ? '+' : '−'}{h.quantity} {m.unit}</span>
              {h.receiptNo && <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>· {h.receiptNo}</span>}
            </div>
            <div style={{ marginTop: 6, fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.ink, lineHeight: 1.45 }}>{h.jobDescription || h.note}</div>
            {worker && (
              <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <WorkerAvatar worker={worker} size={22} />
                <span style={{ fontFamily: TOKENS.font, fontSize: 12.5, color: TOKENS.inkSoft }}>
                  <span style={{ color: TOKENS.ink, fontWeight: 600 }}>{worker.name}</span> · {worker.specialty}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

interface DetailPageProps {
  id: string;
  open: (kind: string, id?: string) => void;
  goBack: () => void;
}

export function DetailPage({ id, open, goBack }: DetailPageProps) {
  const { getMaterial, movementsFor, removeMaterial } = useStore();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const m = getMaterial(id);

  if (!m) return (
    <div style={{ padding: 24 }}>
      <Breadcrumb items={[{ label: t('detailPage.breadcrumb'), onClick: goBack }, { label: t('detailPage.notFound') }]} />
      <div style={{ fontFamily: TOKENS.font, color: TOKENS.inkSoft }}>{t('detailPage.notFoundMsg')}</div>
    </div>
  );

  const d = stockStatus(m);
  const movements = movementsFor(id);
  const totalDelivered = movements.filter((h) => h.type === 'delivery').reduce((s, h) => s + h.quantity, 0);
  const totalUsed = movements.filter((h) => h.type === 'usage').reduce((s, h) => s + h.quantity, 0);
  const workerIds = [...new Set(movements.filter((h) => h.workerId).map((h) => h.workerId))];

  const handleDelete = async () => {
    if (!window.confirm(t('detailPage.deleteConfirm').replace('{name}', getMaterialName(m)))) return;
    setDeleting(true); setDeleteError('');
    try {
      await removeMaterial(id);
      goBack();
    } catch (e) {
      setDeleteError((e as Error).message);
      setDeleting(false);
    }
  };

  return (
    <div>
      <Breadcrumb items={[{ label: t('detailPage.breadcrumb'), onClick: goBack }, { label: getMaterialName(m) }]} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6 }}>{getMaterialName(m)}</h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <span style={{ fontFamily: TOKENS.mono, color: TOKENS.inkMuted, fontSize: 12, letterSpacing: 0.5 }}>{m.id.toUpperCase()}</span>
            <Pill color={d.color} soft={d.softColor} size="md">{d.label}</Pill>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => open('delivery', m.id)} style={btnGhostStyle}>{t('detailPage.btnDelivery')}</button>
          <button onClick={() => open('usage', m.id)} style={btnGhostStyle}>{t('detailPage.btnUsage')}</button>
          <button onClick={() => open('edit-material', m.id)} style={btnGhostStyle}>{t('detailPage.btnEdit')}</button>
          <button onClick={handleDelete} disabled={deleting} style={{ ...btnDangerStyle, opacity: deleting ? 0.5 : 1 }}>{t('detailPage.btnDelete')}</button>
        </div>
      </div>
      {deleteError && <div style={{ marginTop: 10, padding: '10px 14px', background: 'oklch(0.96 0.03 30)', border: '1px solid oklch(0.80 0.10 30)', borderRadius: 10, fontFamily: TOKENS.font, fontSize: 13, color: 'oklch(0.45 0.18 30)' }}>{deleteError}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, marginTop: 16, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}><MaterialGlyph material={m} size={80} /></div>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 6 }}>
              <span style={{ fontFamily: TOKENS.mono, fontSize: 44, fontWeight: 600, letterSpacing: -1 }}>{m.stock}</span>
              <span style={{ fontFamily: TOKENS.mono, fontSize: 14, color: TOKENS.inkMuted, textTransform: 'uppercase' }}>{m.unit}</span>
            </div>
            <Sub style={{ marginTop: 4 }}>{t('detailPage.currentStock')}</Sub>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${TOKENS.lineSoft}` }}>
              <BigBar stock={m.stock} min={m.minimum} color={d.color} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>
                <span>0</span><span>min {m.minimum}</span><span>{m.minimum * 2}</span>
              </div>
            </div>
          </div>

          <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
            <SubHeader>{t('detailPage.sectionProps')}</SubHeader>
            {m.kind ? (
              <><Row k={t('detailPage.propDiameter')} v={m.diameter} /><Row k={t('detailPage.propKind')} v={m.kind} /><Row k={t('detailPage.propGrade')} v={m.grade} /><Row k={t('detailPage.propUnit')} v={m.unit} /><Row k={t('detailPage.propMinStock')} v={`${m.minimum} ${m.unit}`} last /></>
            ) : (
              <><Row k={t('detailPage.propCategory')} v={m.category} /><Row k={t('detailPage.propUnit')} v={m.unit} /><Row k={t('detailPage.propMinStock')} v={`${m.minimum} ${m.unit}`} last /></>
            )}
          </div>

          <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
            <SubHeader>{t('detailPage.sectionStats')}</SubHeader>
            <Row k={t('detailPage.statDelivered')} v={`${totalDelivered} ${m.unit}`} />
            <Row k={t('detailPage.statUsed')} v={`${totalUsed} ${m.unit}`} />
            <Row k={t('detailPage.statWorkers')} v={workerIds.length} />
            <Row k={t('detailPage.statMovements')} v={movements.length} last />
          </div>
        </div>

        <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12 }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${TOKENS.line}`, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <div>
              <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 15 }}>{t('detailPage.sectionHistory')}</div>
              <Sub style={{ marginTop: 2 }}>{t('detailPage.historySubtitle')}</Sub>
            </div>
            <span style={{ fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted }}>{t('detailPage.historyRecords').replace('{count}', String(movements.length))}</span>
          </div>
          <div style={{ padding: '8px 20px 20px' }}>
            {movements.length === 0
              ? <div style={{ padding: 30, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('detailPage.historyEmpty')}</div>
              : <Timeline movements={movements} m={m} />}
          </div>
        </div>
      </div>
    </div>
  );
}

import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { IconCheck } from '../components/ui/Icons.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { WorkerAvatar } from '../components/ui/WorkerAvatar.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { formatDate } from '../../utils/formatDate.ts';
import { t } from '../../i18n/tr.ts';
import type { Material, Worker } from '../../types/index.ts';

interface UsageSuccessProps {
  material: Material;
  quantity: number | string;
  worker: Worker | null | undefined;
  jobDescription: string;
  date: string;
  goBack: () => void;
}

export function UsageSuccess({ material, quantity, worker, jobDescription, date, goBack }: UsageSuccessProps) {
  return (
    <div style={{ padding: '60px 24px 100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: TOKENS.accentSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={36} color={TOKENS.accent} />
      </div>
      <h2 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 22, margin: 0, color: TOKENS.ink }}>{t('usageSuccess.heading')}</h2>
      <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 14, padding: 16, width: '100%', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MaterialGlyph material={material} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 15, color: TOKENS.ink }}>{getMaterialName(material)}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 14, fontWeight: 600, color: TOKENS.accent }}>−{quantity} {material.unit}</div>
          </div>
        </div>
        {worker && (
          <div style={{ marginTop: 10, padding: '10px 0 0', borderTop: `1px solid ${TOKENS.lineSoft}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <WorkerAvatar worker={worker} size={24} />
              <span style={{ fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.ink, fontWeight: 600 }}>{worker.name}</span>
              <span style={{ fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.inkSoft }}>· {worker.specialty}</span>
            </div>
            <div style={{ fontFamily: TOKENS.font, fontSize: 13, color: TOKENS.ink, marginTop: 4, lineHeight: 1.4 }}>{jobDescription}</div>
          </div>
        )}
        <div style={{ marginTop: 10, fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{formatDate(date)}</div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding: '12px 30px' }}>{t('common.ok')}</button>
    </div>
  );
}

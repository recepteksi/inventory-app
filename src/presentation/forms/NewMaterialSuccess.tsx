import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { IconCheck } from '../components/ui/Icons.tsx';
import { t } from '../../i18n/tr.ts';

interface NewMaterialSuccessProps {
  name: string;
  group: 'pipe' | 'other';
  unit: string;
  openingStock: string | number;
  minimum: string | number;
  goBack: () => void;
}

export function NewMaterialSuccess({ name, group, unit, openingStock, minimum, goBack }: NewMaterialSuccessProps) {
  return (
    <div style={{ padding: '60px 24px 100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: TOKENS.okSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={36} color={TOKENS.ok} />
      </div>
      <h2 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 22, margin: 0, color: TOKENS.ink }}>{t('newMaterialSuccess.heading')}</h2>
      <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 14, padding: 16, width: '100%', textAlign: 'left' }}>
        <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 1, textTransform: 'uppercase' }}>
          {group === 'pipe' ? t('newMaterialSuccess.groupPipe') : t('newMaterialSuccess.groupOther')}
        </div>
        <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 17, color: TOKENS.ink, marginTop: 2 }}>{name}</div>
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${TOKENS.lineSoft}`, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 0.6 }}>{t('newMaterialSuccess.colOpening')}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 17, fontWeight: 600, color: TOKENS.ink }}>
              {openingStock || 0} <span style={{ fontSize: 11, color: TOKENS.inkMuted }}>{unit}</span>
            </div>
          </div>
          <div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 0.6 }}>{t('newMaterialSuccess.colMinimum')}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 17, fontWeight: 600, color: TOKENS.ink }}>
              {minimum} <span style={{ fontSize: 11, color: TOKENS.inkMuted }}>{unit}</span>
            </div>
          </div>
        </div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding: '12px 30px' }}>{t('common.ok')}</button>
    </div>
  );
}

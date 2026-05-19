import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { IconCheck } from '../components/ui/Icons.tsx';
import { MaterialGlyph } from '../components/ui/MaterialGlyph.tsx';
import { getMaterialName } from '../../domain/entities/material.ts';
import { formatDate } from '../../utils/formatDate.ts';
import { t } from '../../i18n/tr.ts';
import type { Material } from '../../types/index.ts';

interface DeliverySuccessProps {
  material: Material;
  quantity: number | string;
  date: string;
  goBack: () => void;
}

export function DeliverySuccess({ material, quantity, date, goBack }: DeliverySuccessProps) {
  return (
    <div style={{ padding: '60px 24px 100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 72, height: 72, borderRadius: 999, background: TOKENS.okSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <IconCheck size={36} color={TOKENS.ok} />
      </div>
      <h2 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 22, margin: 0, color: TOKENS.ink }}>{t('deliverySuccess.heading')}</h2>
      <div style={{ background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 14, padding: 16, width: '100%', textAlign: 'left' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <MaterialGlyph material={material} size={40} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 15, color: TOKENS.ink }}>{getMaterialName(material)}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 14, fontWeight: 600, color: TOKENS.ok }}>+{quantity} {material.unit}</div>
          </div>
        </div>
        <div style={{ marginTop: 10, fontFamily: TOKENS.mono, fontSize: 11, color: TOKENS.inkMuted, letterSpacing: 0.5, textTransform: 'uppercase' }}>{formatDate(date)}</div>
      </div>
      <button onClick={goBack} style={{ ...btnPrimaryStyle, padding: '12px 30px' }}>{t('common.ok')}</button>
    </div>
  );
}

import { TOKENS } from '../ui/tokens.tsx';
import { t } from '../../../i18n/tr.ts';

export function LoadingScreen() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: TOKENS.font, color: TOKENS.inkMuted, fontSize: 14 }}>
      {t('common.loading')}
    </div>
  );
}

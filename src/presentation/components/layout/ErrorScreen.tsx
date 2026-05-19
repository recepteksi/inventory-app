import { TOKENS } from '../ui/tokens.tsx';
import { t } from '../../../i18n/tr.ts';

interface ErrorScreenProps {
  message: string;
}

export function ErrorScreen({ message }: ErrorScreenProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12, fontFamily: TOKENS.font, color: TOKENS.low }}>
      <div style={{ fontSize: 18, fontWeight: 600 }}>{t('common.connectionError')}</div>
      <div style={{ fontSize: 14, color: TOKENS.inkSoft }}>{message}</div>
    </div>
  );
}

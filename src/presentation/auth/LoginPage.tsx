import { useState } from 'react';
import { TOKENS, btnPrimaryStyle } from '../components/ui/tokens.tsx';
import { Field } from '../forms/primitives/Field.tsx';
import { TextInput } from '../forms/primitives/TextInput.tsx';
import { ErrorBanner } from '../forms/primitives/ErrorBanner.tsx';
import { useAuth } from './AuthProvider.tsx';
import { tr } from '../../i18n/tr.ts';

export function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!username || !password || loading) return;
    setLoading(true); setError('');
    try {
      await login(username, password);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: TOKENS.bg, fontFamily: TOKENS.font, padding: 20 }}>
      <div style={{ width: 360, maxWidth: '100%', background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 16, padding: 28, boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, background: TOKENS.ink, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 8 L12 4 L20 8 L12 12 Z" fill="#fff" />
              <path d="M4 8 V16 L12 20 L20 16 V8" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: TOKENS.ink }}>{tr.nav.brand}</div>
            <div style={{ fontFamily: TOKENS.mono, fontSize: 10, color: TOKENS.inkMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{tr.nav.brandSub}</div>
          </div>
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: TOKENS.ink, letterSpacing: -0.3 }}>{tr.login.title}</h1>
        <div style={{ fontSize: 13, color: TOKENS.inkSoft, marginBottom: 18 }}>{tr.login.subtitle}</div>
        <form onSubmit={(e) => { e.preventDefault(); void submit(); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Field label={tr.login.username}><TextInput value={username} onChange={setUsername} placeholder={tr.login.usernamePlaceholder} /></Field>
          <Field label={tr.login.password}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: `1px solid ${TOKENS.line}`, borderRadius: 10, background: TOKENS.paper, fontFamily: TOKENS.font, fontSize: 15, color: TOKENS.ink, outline: 'none' }}
            />
          </Field>
          <ErrorBanner message={error} />
          <button type="submit" disabled={!username || !password || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '13px', opacity: username && password && !loading ? 1 : 0.4 }}>
            {loading ? tr.login.loading : tr.login.submit}
          </button>
        </form>
      </div>
    </div>
  );
}

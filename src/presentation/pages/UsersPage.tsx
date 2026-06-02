import { useEffect, useState } from 'react';
import { TOKENS, btnPrimaryStyle, btnGhostStyle, btnDangerStyle } from '../components/ui/tokens.tsx';
import { Pill } from '../components/ui/Pill.tsx';
import { FormModal } from '../components/layout/FormModal.tsx';
import { FormShell } from '../forms/FormShell.tsx';
import { Field } from '../forms/primitives/Field.tsx';
import { TextInput } from '../forms/primitives/TextInput.tsx';
import { SegmentControl } from '../forms/primitives/SegmentControl.tsx';
import { ErrorBanner } from '../forms/primitives/ErrorBanner.tsx';
import { usersApi } from '../../infrastructure/api/usersApi.ts';
import { useAuth } from '../auth/AuthProvider.tsx';
import { t } from '../../i18n/tr.ts';
import type { PublicUser, Role } from '../../types/index.ts';

function PasswordInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', boxSizing: 'border-box', padding: '12px 14px', border: `1px solid ${TOKENS.line}`, borderRadius: 10, background: TOKENS.paper, fontFamily: TOKENS.font, fontSize: 15, color: TOKENS.ink, outline: 'none' }}
    />
  );
}

function UserForm({ editing, onDone }: { editing: PublicUser | null; onDone: () => void }) {
  const [username, setUsername] = useState(editing?.username ?? '');
  const [name, setName] = useState(editing?.name ?? '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(editing?.role ?? 'normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!editing;
  const valid = isEdit
    ? name.trim().length > 1
    : username.trim().length > 1 && name.trim().length > 1 && password.length >= 4;

  const submit = async () => {
    if (!valid || loading) return;
    setLoading(true); setError('');
    try {
      if (isEdit) await usersApi.update(editing.id, { name, role, ...(password ? { password } : {}) });
      else await usersApi.create({ username, name, password, role });
      onDone();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormShell title={isEdit ? t('userForm.editTitle') : t('userForm.newTitle')} altTitle={t('userForm.subtitle')}>
      {!isEdit && <Field label={t('userForm.username')}><TextInput value={username} onChange={setUsername} placeholder={t('login.usernamePlaceholder')} /></Field>}
      <Field label={t('userForm.name')}><TextInput value={name} onChange={setName} placeholder={t('newWorkerForm.namePlaceholder')} /></Field>
      <Field label={isEdit ? t('userForm.newPassword') : t('userForm.password')} optional={isEdit}>
        <PasswordInput value={password} onChange={setPassword} placeholder={isEdit ? t('userForm.keepPassword') : '••••••'} />
      </Field>
      <Field label={t('userForm.role')}>
        <SegmentControl value={role} onChange={(v) => setRole(v as Role)} options={[{ value: 'normal', label: t('nav.roleNormal') }, { value: 'admin', label: t('nav.roleAdmin') }]} />
      </Field>
      <ErrorBanner message={error} />
      <div style={{ position: 'sticky', bottom: 0, padding: '12px 0 0', background: `linear-gradient(transparent, ${TOKENS.bg} 30%)` }}>
        <button onClick={() => void submit()} disabled={!valid || loading} style={{ ...btnPrimaryStyle, width: '100%', padding: '14px', opacity: valid && !loading ? 1 : 0.4 }}>
          {loading ? t('common.saving') : t('common.save')}
        </button>
      </div>
    </FormShell>
  );
}

export function UsersPage() {
  const { user: current } = useAuth();
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<{ kind: 'new' | 'edit'; user: PublicUser | null } | null>(null);

  const load = () => {
    usersApi.getAll()
      .then((u) => { setUsers(u); setError(''); })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (u: PublicUser) => {
    if (!window.confirm(t('usersPage.deleteConfirm').replace('{name}', u.name))) return;
    try {
      await usersApi.remove(u.id);
      load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: 4 }}>
        <div>
          <h1 style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 30, margin: 0, letterSpacing: -0.6 }}>{t('usersPage.title')}</h1>
          <div style={{ fontFamily: TOKENS.font, fontSize: 14, color: TOKENS.inkSoft, marginTop: 4 }}>{t('usersPage.subtitle')}</div>
        </div>
        <button onClick={() => setModal({ kind: 'new', user: null })} style={btnPrimaryStyle}>{t('usersPage.addUser')}</button>
      </div>

      {error && <div style={{ marginTop: 10, padding: '10px 14px', background: 'oklch(0.96 0.03 30)', border: '1px solid oklch(0.80 0.10 30)', borderRadius: 10, fontFamily: TOKENS.font, fontSize: 13, color: 'oklch(0.45 0.18 30)' }}>{error}</div>}

      <div style={{ marginTop: 16, background: TOKENS.paper, border: `1px solid ${TOKENS.line}`, borderRadius: 12, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 30, textAlign: 'center', color: TOKENS.inkMuted, fontFamily: TOKENS.font, fontSize: 14 }}>{t('common.loading')}</div>
        ) : users.map((u, i) => (
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderBottom: i === users.length - 1 ? 'none' : `1px solid ${TOKENS.lineSoft}` }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: TOKENS.font, fontWeight: 600, fontSize: 14, color: TOKENS.ink }}>{u.name} {current?.id === u.id && <span style={{ color: TOKENS.inkMuted, fontWeight: 400 }}>({t('usersPage.you')})</span>}</div>
              <div style={{ fontFamily: TOKENS.mono, fontSize: 11.5, color: TOKENS.inkMuted }}>@{u.username}</div>
            </div>
            <Pill color={u.role === 'admin' ? TOKENS.accent : TOKENS.steel} soft={u.role === 'admin' ? TOKENS.accentSoft : TOKENS.steelSoft}>
              {u.role === 'admin' ? t('nav.roleAdmin') : t('nav.roleNormal')}
            </Pill>
            <button onClick={() => setModal({ kind: 'edit', user: u })} style={{ ...btnGhostStyle, fontSize: 13 }}>{t('common.edit')}</button>
            <button onClick={() => void remove(u)} disabled={current?.id === u.id} style={{ ...btnDangerStyle, fontSize: 13, opacity: current?.id === u.id ? 0.4 : 1 }}>{t('common.delete')}</button>
          </div>
        ))}
      </div>

      {modal && (
        <FormModal onClose={() => setModal(null)}>
          <UserForm editing={modal.user} onDone={() => { setModal(null); load(); }} />
        </FormModal>
      )}
    </div>
  );
}

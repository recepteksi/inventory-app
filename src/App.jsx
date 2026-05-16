import React, { useState } from 'react';
import { TOKENS, Sub, IconBox, IconPerson, IconPlus } from './tokens.jsx';
import { StokPage, DetayPage, UstalarPage, FormModal, PageHeader } from './pages.jsx';
import { GelisScreen, KullanimScreen, YeniMalzemeScreen } from './forms.jsx';
import { useStore } from './store.jsx';

const NAV = [
  { id: 'stok', label: 'Stok', icon: 'box' },
  { id: 'ustalar', label: 'Ustalar', icon: 'person' },
];

const QUICK = [
  { id: 'yeni-malzeme', label: 'Yeni Malzeme', icon: 'plus' },
  { id: 'gelis', label: 'Yeni Geliş', icon: 'down' },
  { id: 'kullanim', label: 'Kullanım Kaydet', icon: 'up' },
];

function NavIcon({ kind, active }) {
  const c = active ? TOKENS.ink : TOKENS.inkSoft;
  const w = 18;
  if (kind === 'box') return <IconBox active={active} />;
  if (kind === 'person') return <IconPerson active={active} />;
  if (kind === 'plus')
    return (
      <svg width={w} height={w} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" stroke={c} strokeWidth="1.7" />
        <path d="M12 8 V16 M8 12 H16" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  if (kind === 'down')
    return (
      <svg width={w} height={w} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 4 V18 M6 13 L12 19 L18 13"
          stroke={c}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M5 21 H19" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  if (kind === 'up')
    return (
      <svg width={w} height={w} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 20 V6 M6 11 L12 5 L18 11"
          stroke={c}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M5 3 H19" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  return null;
}

function Sidebar({ active, onNav, onQuick, onReset }) {
  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        background: TOKENS.paper,
        borderRight: `1px solid ${TOKENS.line}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      <div
        style={{
          padding: '20px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            background: TOKENS.ink,
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 8 L12 4 L20 8 L12 12 Z" fill="#fff" />
            <path
              d="M4 8 V16 L12 20 L20 16 V8"
              stroke="#fff"
              strokeWidth="1.5"
              fill="none"
              strokeLinejoin="round"
            />
            <path d="M12 12 V20" stroke="#fff" strokeWidth="1.5" />
          </svg>
        </div>
        <div>
          <div
            style={{
              fontFamily: TOKENS.font,
              fontWeight: 700,
              fontSize: 14,
              color: TOKENS.ink,
              letterSpacing: -0.1,
            }}
          >
            Atölye
          </div>
          <div
            style={{
              fontFamily: TOKENS.mono,
              fontSize: 9.5,
              color: TOKENS.inkMuted,
              letterSpacing: 1,
              textTransform: 'uppercase',
            }}
          >
            Envanter
          </div>
        </div>
      </div>

      <div style={{ padding: '4px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onNav(n.id)}
            style={{
              appearance: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 10px',
              background: active === n.id ? TOKENS.bg : 'transparent',
              color: active === n.id ? TOKENS.ink : TOKENS.inkSoft,
              fontFamily: TOKENS.font,
              fontWeight: active === n.id ? 600 : 500,
              fontSize: 14,
              borderRadius: 8,
            }}
          >
            <NavIcon kind={n.icon} active={active === n.id} />
            {n.label}
          </button>
        ))}
      </div>

      <div style={{ padding: '20px 16px 8px' }}>
        <Sub>Hızlı Eylem</Sub>
      </div>
      <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {QUICK.map((q) => (
          <button
            key={q.id}
            onClick={() => onQuick(q.id)}
            style={{
              appearance: 'none',
              border: `1px dashed ${TOKENS.line}`,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 10px',
              background: 'transparent',
              color: TOKENS.ink,
              fontFamily: TOKENS.font,
              fontWeight: 500,
              fontSize: 13.5,
              borderRadius: 8,
            }}
          >
            <NavIcon kind={q.icon} /> {q.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: '0 12px 10px' }}>
        <button
          onClick={onReset}
          style={{
            appearance: 'none',
            border: `1px solid ${TOKENS.line}`,
            background: 'transparent',
            cursor: 'pointer',
            textAlign: 'left',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 10px',
            color: TOKENS.inkSoft,
            fontFamily: TOKENS.mono,
            fontSize: 11,
            letterSpacing: 0.5,
            borderRadius: 8,
            width: '100%',
            textTransform: 'uppercase',
          }}
          title="LocalStorage'i sıfırla, demo verilerine dön"
        >
          ↺ Demo verisine sıfırla
        </button>
      </div>

      <div
        style={{
          padding: '14px 16px',
          borderTop: `1px solid ${TOKENS.line}`,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 7,
            background: 'oklch(0.88 0.05 60)',
            color: 'oklch(0.32 0.08 60)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: TOKENS.font,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          EK
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: TOKENS.font,
              fontSize: 13,
              fontWeight: 600,
              color: TOKENS.ink,
            }}
          >
            Eren Karatay
          </div>
          <div
            style={{
              fontFamily: TOKENS.mono,
              fontSize: 10,
              color: TOKENS.inkMuted,
              letterSpacing: 0.5,
            }}
          >
            Şantiye Şefi
          </div>
        </div>
      </div>
    </aside>
  );
}

function TopBar({ onQuick }) {
  const bugun = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: `${TOKENS.bg}f2`,
        backdropFilter: 'blur(8px)',
        borderBottom: `1px solid ${TOKENS.line}`,
        padding: '10px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <div
        style={{
          flex: 1,
          fontFamily: TOKENS.mono,
          fontSize: 11,
          color: TOKENS.inkMuted,
          letterSpacing: 0.5,
        }}
      >
        ŞANTİYE · MERKEZ ATÖLYE
        <span style={{ margin: '0 8px', color: TOKENS.line }}>|</span>
        {bugun}
      </div>
      <button
        onClick={() => onQuick('kullanim')}
        style={{
          appearance: 'none',
          border: 'none',
          background: TOKENS.ink,
          color: '#fff',
          cursor: 'pointer',
          padding: '7px 14px',
          borderRadius: 8,
          fontFamily: TOKENS.font,
          fontSize: 13,
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          whiteSpace: 'nowrap',
        }}
      >
        <IconPlus size={14} /> Yeni Kayıt
      </button>
    </div>
  );
}

export default function App() {
  const { resetAll } = useStore();
  const [page, setPage] = useState('stok');
  const [route, setRoute] = useState(null);
  const [modal, setModal] = useState(null);

  const open = (kind, id) => {
    if (kind === 'gelis' || kind === 'kullanim' || kind === 'yeni-malzeme') {
      setModal({ kind, id });
    } else if (kind === 'detay') {
      setRoute({ kind: 'detay', id });
    } else if (kind === 'usta') {
      setRoute({ kind: 'usta', id });
    }
  };
  const closeModal = () => setModal(null);
  const onNav = (id) => {
    setRoute(null);
    setPage(id);
  };
  const onQuick = (id) => setModal({ kind: id });

  let main;
  if (route?.kind === 'detay') {
    main = (
      <DetayPage
        id={route.id}
        open={open}
        goBack={() => {
          setRoute(null);
          setPage('stok');
        }}
      />
    );
  } else if (page === 'stok') {
    main = <StokPage open={open} />;
  } else if (page === 'ustalar') {
    main = <UstalarPage />;
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: TOKENS.bg,
        fontFamily: TOKENS.font,
        color: TOKENS.ink,
      }}
    >
      <Sidebar active={page} onNav={onNav} onQuick={onQuick} onReset={resetAll} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar onQuick={onQuick} />
        <main
          style={{
            padding: '24px 32px 60px',
            maxWidth: 1400,
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {main}
        </main>
      </div>

      {modal && (
        <FormModal onClose={closeModal}>
          {modal.kind === 'gelis' && <GelisScreen presetId={modal.id} goBack={closeModal} />}
          {modal.kind === 'kullanim' && <KullanimScreen presetId={modal.id} goBack={closeModal} />}
          {modal.kind === 'yeni-malzeme' && (
            <YeniMalzemeScreen preset={modal.id} goBack={closeModal} />
          )}
        </FormModal>
      )}
    </div>
  );
}

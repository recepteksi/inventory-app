import React, { useEffect, useState } from 'react';
import { TOKENS, IconBox, IconPerson } from './presentation/components/ui/tokens.jsx';
import { StokPage } from './presentation/pages/StokPage.jsx';
import { DetayPage } from './presentation/pages/DetayPage.jsx';
import { UstalarPage } from './presentation/pages/UstalarPage.jsx';
import { GelisForm } from './presentation/forms/GelisForm.jsx';
import { KullanimForm } from './presentation/forms/KullanimForm.jsx';
import { YeniMalzemeForm } from './presentation/forms/YeniMalzemeForm.jsx';
import { DuzenleMalzemeForm } from './presentation/forms/DuzenleMalzemeForm.jsx';
import { YeniUstaForm } from './presentation/forms/YeniUstaForm.jsx';
import { DuzenleUstaForm } from './presentation/forms/DuzenleUstaForm.jsx';
import { useStore } from './presentation/store/store.jsx';

const NAV = [
  { id: 'stok', label: 'Stok', icon: 'box' },
  { id: 'ustalar', label: 'Ustalar', icon: 'person' },
];

function NavIcon({ kind, active }) {
  if (kind === 'box') return <IconBox active={active}/>;
  if (kind === 'person') return <IconPerson active={active}/>;
  return null;
}

function Sidebar({ active, onNav }) {
  return (
    <aside style={{ width:220, flexShrink:0, background:TOKENS.paper, borderRight:`1px solid ${TOKENS.line}`, display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh' }}>
      <div style={{ padding:'20px 20px 16px', display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, background:TOKENS.ink, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 8 L12 4 L20 8 L12 12 Z" fill="#fff"/><path d="M4 8 V16 L12 20 L20 16 V8" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinejoin="round"/><path d="M12 12 V20" stroke="#fff" strokeWidth="1.5"/></svg>
        </div>
        <div>
          <div style={{ fontFamily:TOKENS.font, fontWeight:700, fontSize:14, color:TOKENS.ink, letterSpacing:-0.1 }}>Atölye</div>
          <div style={{ fontFamily:TOKENS.mono, fontSize:9.5, color:TOKENS.inkMuted, letterSpacing:1, textTransform:'uppercase' }}>Envanter</div>
        </div>
      </div>

      <div style={{ padding:'4px 12px', display:'flex', flexDirection:'column', gap:2 }}>
        {NAV.map((n) => (
          <button key={n.id} onClick={() => onNav(n.id)} style={{ appearance:'none', border:'none', cursor:'pointer', textAlign:'left', display:'flex', alignItems:'center', gap:10, padding:'9px 10px', background:active===n.id?TOKENS.bg:'transparent', color:active===n.id?TOKENS.ink:TOKENS.inkSoft, fontFamily:TOKENS.font, fontWeight:active===n.id?600:500, fontSize:14, borderRadius:8 }}>
            <NavIcon kind={n.icon} active={active===n.id}/>{n.label}
          </button>
        ))}
      </div>

      <div style={{ flex:1 }}/>
      <div style={{ padding:'14px 16px', borderTop:`1px solid ${TOKENS.line}`, display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ width:32, height:32, borderRadius:7, background:'oklch(0.88 0.05 60)', color:'oklch(0.32 0.08 60)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:TOKENS.font, fontSize:12, fontWeight:700 }}>EK</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontFamily:TOKENS.font, fontSize:13, fontWeight:600, color:TOKENS.ink }}>Eren Karatay</div>
          <div style={{ fontFamily:TOKENS.mono, fontSize:10, color:TOKENS.inkMuted, letterSpacing:0.5 }}>Şantiye Şefi</div>
        </div>
      </div>
    </aside>
  );
}

function TopBar() {
  const bugun = new Date().toLocaleDateString('tr-TR', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  return (
    <div style={{ position:'sticky', top:0, zIndex:30, background:`${TOKENS.bg}f2`, backdropFilter:'blur(8px)', borderBottom:`1px solid ${TOKENS.line}`, padding:'10px 32px' }}>
      <div style={{ fontFamily:TOKENS.mono, fontSize:11, color:TOKENS.inkMuted, letterSpacing:0.5 }}>
        ŞANTİYE · MERKEZ ATÖLYE<span style={{ margin:'0 8px', color:TOKENS.line }}>|</span>{bugun}
      </div>
    </div>
  );
}

function FormModal({ children, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(20,16,12,0.45)', zIndex:100, display:'flex', justifyContent:'flex-end' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ width:460, maxWidth:'100%', height:'100%', background:TOKENS.bg, boxShadow:'-20px 0 40px rgba(0,0,0,0.1)', overflowY:'auto', position:'relative' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, zIndex:10, appearance:'none', border:`1px solid ${TOKENS.line}`, background:TOKENS.paper, width:32, height:32, borderRadius:8, cursor:'pointer', fontFamily:TOKENS.font, fontSize:18, color:TOKENS.inkSoft, display:'flex', alignItems:'center', justifyContent:'center' }}>×</button>
        {children}
      </div>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:TOKENS.font, color:TOKENS.inkMuted, fontSize:14 }}>
      Veriler yükleniyor…
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:12, fontFamily:TOKENS.font, color:TOKENS.low }}>
      <div style={{ fontSize:18, fontWeight:600 }}>Bağlantı hatası</div>
      <div style={{ fontSize:14, color:TOKENS.inkSoft }}>{message}</div>
      <div style={{ fontSize:13, color:TOKENS.inkMuted }}>Sunucu çalışıyor mu? <code style={{ fontFamily:TOKENS.mono, background:TOKENS.lineSoft, padding:'2px 6px', borderRadius:4 }}>node server/index.js</code></div>
    </div>
  );
}

export default function App() {
  const { loading, error } = useStore();
  const [page, setPage] = useState('stok');
  const [route, setRoute] = useState(null);
  const [modal, setModal] = useState(null);

  if (loading) return <LoadingScreen/>;
  if (error) return <ErrorScreen message={error}/>;

  const open = (kind, id) => {
    const modals = ['gelis','kullanim','yeni-malzeme','duzenle-malzeme','yeni-usta','duzenle-usta'];
    if (modals.includes(kind)) {
      setModal({ kind, id });
    } else if (kind === 'detay') {
      setRoute({ kind:'detay', id });
    }
  };

  const closeModal = () => setModal(null);
  const onNav = (id) => { setRoute(null); setPage(id); };

  let main;
  if (route?.kind === 'detay') {
    main = <DetayPage id={route.id} open={open} goBack={() => { setRoute(null); setPage('stok'); }}/>;
  } else if (page === 'stok') {
    main = <StokPage open={open}/>;
  } else if (page === 'ustalar') {
    main = <UstalarPage open={open}/>;
  }

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:TOKENS.bg, fontFamily:TOKENS.font, color:TOKENS.ink }}>
      <Sidebar active={page} onNav={onNav}/>
      <div style={{ flex:1, minWidth:0, display:'flex', flexDirection:'column' }}>
        <TopBar/>
        <main style={{ padding:'24px 32px 60px', maxWidth:1400, width:'100%', boxSizing:'border-box' }}>{main}</main>
      </div>

      {modal && (
        <FormModal onClose={closeModal}>
          {modal.kind === 'gelis' && <GelisForm presetId={modal.id} goBack={closeModal}/>}
          {modal.kind === 'kullanim' && <KullanimForm presetId={modal.id} goBack={closeModal}/>}
          {modal.kind === 'yeni-malzeme' && <YeniMalzemeForm preset={modal.id} goBack={closeModal}/>}
          {modal.kind === 'duzenle-malzeme' && <DuzenleMalzemeForm id={modal.id} goBack={closeModal}/>}
          {modal.kind === 'yeni-usta' && <YeniUstaForm goBack={closeModal}/>}
          {modal.kind === 'duzenle-usta' && <DuzenleUstaForm id={modal.id} goBack={closeModal}/>}
        </FormModal>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { TOKENS } from './presentation/components/ui/tokens.jsx';
import { Sidebar } from './presentation/components/layout/Sidebar.jsx';
import { TopBar } from './presentation/components/layout/TopBar.jsx';
import { FormModal } from './presentation/components/layout/FormModal.jsx';
import { LoadingScreen } from './presentation/components/layout/LoadingScreen.jsx';
import { ErrorScreen } from './presentation/components/layout/ErrorScreen.jsx';
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

/**
 * Application root component.
 * All navigation is driven by three state vars: `page`, `route`, and `modal`.
 *
 * - `page`: active top-level page ('stok' | 'ustalar')
 * - `route`: detail sub-page ({ kind:'detay', id }) or null
 * - `modal`: open form drawer ({ kind, id? }) or null
 *
 * Modal kinds: 'gelis' · 'kullanim' · 'yeni-malzeme' · 'duzenle-malzeme' · 'yeni-usta' · 'duzenle-usta'
 */
export default function App() {
  const { loading, error } = useStore();
  const [page, setPage] = useState('stok');
  const [route, setRoute] = useState(null);
  const [modal, setModal] = useState(null);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorScreen message={error} />;

  /** Opens a modal form drawer or navigates to a detail sub-page. */
  const open = (kind, id) => {
    const modals = ['gelis', 'kullanim', 'yeni-malzeme', 'duzenle-malzeme', 'yeni-usta', 'duzenle-usta'];
    if (modals.includes(kind)) {
      setModal({ kind, id });
    } else if (kind === 'detay') {
      setRoute({ kind: 'detay', id });
    }
  };

  const closeModal = () => setModal(null);
  const onNav = (id) => { setRoute(null); setPage(id); };

  let main;
  if (route?.kind === 'detay') {
    main = <DetayPage id={route.id} open={open} goBack={() => { setRoute(null); setPage('stok'); }} />;
  } else if (page === 'stok') {
    main = <StokPage open={open} />;
  } else if (page === 'ustalar') {
    main = <UstalarPage open={open} />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: TOKENS.bg, fontFamily: TOKENS.font, color: TOKENS.ink }}>
      <Sidebar active={page} onNav={onNav} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <TopBar />
        <main style={{ padding: '24px 32px 60px', maxWidth: 1400, width: '100%', boxSizing: 'border-box' }}>
          {main}
        </main>
      </div>

      {modal && (
        <FormModal onClose={closeModal}>
          {modal.kind === 'gelis'            && <GelisForm presetId={modal.id} goBack={closeModal} />}
          {modal.kind === 'kullanim'         && <KullanimForm presetId={modal.id} goBack={closeModal} />}
          {modal.kind === 'yeni-malzeme'     && <YeniMalzemeForm preset={modal.id} goBack={closeModal} />}
          {modal.kind === 'duzenle-malzeme'  && <DuzenleMalzemeForm id={modal.id} goBack={closeModal} />}
          {modal.kind === 'yeni-usta'        && <YeniUstaForm goBack={closeModal} />}
          {modal.kind === 'duzenle-usta'     && <DuzenleUstaForm id={modal.id} goBack={closeModal} />}
        </FormModal>
      )}
    </div>
  );
}

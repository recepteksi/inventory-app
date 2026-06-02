import { createRoot } from 'react-dom/client';
import { Root } from './Root.tsx';
import { AuthProvider } from './presentation/auth/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <Root />
  </AuthProvider>
);

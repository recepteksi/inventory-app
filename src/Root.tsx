import App from './App.tsx';
import { StoreProvider } from './presentation/store/store.tsx';
import { useAuth } from './presentation/auth/AuthProvider.tsx';
import { LoginPage } from './presentation/auth/LoginPage.tsx';
import { LoadingScreen } from './presentation/components/layout/LoadingScreen.tsx';

/** Gates the application behind authentication. */
export function Root() {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <LoginPage />;
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}

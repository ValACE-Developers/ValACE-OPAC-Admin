import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { AuthProvider } from "./contexts/AuthContext";
import LayoutWrapper from "./components/layout/LayoutWrapper";
import AppRoute from "./routes/AppRoute";
import { useKeyRedirect } from "./hooks/useKeyRedirect";

const queryClient = new QueryClient();

function App() {
  useKeyRedirect("`", "/admin/login", { ctrl: true });

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LayoutWrapper>
          <AppRoute />
        </LayoutWrapper>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
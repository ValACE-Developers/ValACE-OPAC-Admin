import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./contexts/AuthContext";
import AppRoute from "./routes/AppRoute"; 

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoute />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
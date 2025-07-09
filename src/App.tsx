import { AppRouting } from '@/routing/app-routing';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { LoadingBarContainer } from 'react-top-loading-bar';
import { Toaster } from '@/components/ui/sonner';
import { ApiAuthProvider } from './auth/providers/api-provider';
import { I18nProvider } from './providers/i18n-provider';
import { QueryProvider } from './providers/query-provider';
import { SettingsProvider } from './providers/settings-provider';
import { ThemeProvider } from './providers/theme-provider';
import { TooltipsProvider } from './providers/tooltips-provider';

const { BASE_URL } = import.meta.env;

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ApiAuthProvider>
        <SettingsProvider>
          <ThemeProvider>
            <I18nProvider>
              <TooltipsProvider>
                <QueryProvider>
                  <LoadingBarContainer>
                    <BrowserRouter basename={BASE_URL}>
                      <Toaster />
                      <AppRouting />
                    </BrowserRouter>
                  </LoadingBarContainer>
                </QueryProvider>
              </TooltipsProvider>
            </I18nProvider>
          </ThemeProvider>
        </SettingsProvider>
      </ApiAuthProvider>
    </QueryClientProvider>
  );
}

import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileTabBar } from '@/components/dashboard/MobileTabBar';
import { ComposeProvider } from '@/components/dashboard/ComposeContext';
import { ComposeModal } from '@/components/dashboard/ComposeModal';
import { UserPostsProvider } from '@/lib/UserPostsContext';
import { ToastProvider } from '@/components/Toast';
import { CommandPaletteProvider } from '@/components/dashboard/CommandPalette';
import { PreferencesProvider } from '@/lib/PreferencesContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <PreferencesProvider>
      <ToastProvider>
        <UserPostsProvider>
          <ComposeProvider>
            <CommandPaletteProvider>
              <a
                href="#main-content"
                className="sr-only z-[100] rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
              >
                Skip to content
              </a>
              <div className="relative min-h-screen">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-aurora opacity-50" />
                <div className="relative z-10 mx-auto flex w-full max-w-[1400px] gap-0 px-0 sm:px-4">
                  <Sidebar />
                  <main
                    id="main-content"
                    tabIndex={-1}
                    className="min-w-0 flex-1 pb-24 focus:outline-none lg:pb-10"
                  >
                    {children}
                  </main>
                </div>
                <MobileTabBar />
                <ComposeModal />
              </div>
            </CommandPaletteProvider>
          </ComposeProvider>
        </UserPostsProvider>
      </ToastProvider>
    </PreferencesProvider>
  );
}

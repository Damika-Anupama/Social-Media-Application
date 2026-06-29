import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileTabBar } from '@/components/dashboard/MobileTabBar';
import { ComposeProvider } from '@/components/dashboard/ComposeContext';
import { ComposeModal } from '@/components/dashboard/ComposeModal';
import { UserPostsProvider } from '@/lib/UserPostsContext';
import { ToastProvider } from '@/components/Toast';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <UserPostsProvider>
        <ComposeProvider>
          <div className="relative min-h-screen">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-aurora opacity-50" />
            <div className="relative z-10 mx-auto flex w-full max-w-[1400px] gap-0 px-0 sm:px-4">
              <Sidebar />
              <main className="min-w-0 flex-1 pb-24 lg:pb-10">{children}</main>
            </div>
            <MobileTabBar />
            <ComposeModal />
          </div>
        </ComposeProvider>
      </UserPostsProvider>
    </ToastProvider>
  );
}

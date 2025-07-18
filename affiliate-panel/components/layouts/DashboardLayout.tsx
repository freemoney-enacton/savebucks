import Header from "../Header";
import { Sidebar } from "../Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-[100dvh] bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="w-full flex flex-col">
        <Header />
        <main className="main-content px-4 py-6 sm:p-10 bg-gray-50 h-full max-h-full overflow-y-auto">
          <div className="max-w-[1800px] mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

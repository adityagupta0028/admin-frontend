import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Sidebar />
      <Header />
      <main className="ml-64 mt-16 p-6">
        {children}
      </main>
    </div>
  );
}

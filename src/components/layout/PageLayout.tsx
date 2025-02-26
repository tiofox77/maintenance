import { Sidebar } from "@/components/dashboard/Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar className="w-64 border-r bg-white" />
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

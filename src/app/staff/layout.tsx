import { StaffSidebar } from "@/components/layout/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto p-8 propel-scroll">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

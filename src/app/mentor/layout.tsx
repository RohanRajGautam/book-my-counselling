import { MentorSidebar } from "@/components/layout/MentorNav";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

export default function MentorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={{ "--sidebar-width": "180px" } as React.CSSProperties}
    >
      {/* Sidebar */}
      <MentorSidebar />

      {/* Main content area */}
      <SidebarInset className="bg-[#F5F6FA]">
        <main className="p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

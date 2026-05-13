import { MentorMobileHeader, MentorSidebar } from '@/components/layout/MentorNav'
import { Navbar } from '@/components/layout/Navbar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider style={{ '--sidebar-width': '260px' } as React.CSSProperties}>
      <MentorSidebar />

      <SidebarInset className="bg-[#f8f9ff]">
        <MentorMobileHeader />

        <main> {children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}

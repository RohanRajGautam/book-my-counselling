import { MentorMobileHeader, MentorSidebar } from '@/components/layout/MentorNav'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { MentorAuthGate } from '@/features/auth/components/MentorAuthGate'

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return (
    <MentorAuthGate>
      <SidebarProvider style={{ '--sidebar-width': '260px' } as React.CSSProperties}>
        <MentorSidebar />

        <SidebarInset className="bg-[#f8f9ff]">
          <MentorMobileHeader />

          <main className='p-1 sm:p-4'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </MentorAuthGate>
  )
}

import { AdminAuthGate } from '@/features/admin/auth/AdminAuthGate'
import { AdminMobileHeader, AdminSidebar } from '@/features/admin/layout/AdminNav'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export const metadata = {
  title: 'Admin Panel | Book Your Counselling',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGate>
      <SidebarProvider style={{ '--sidebar-width': '272px' } as React.CSSProperties}>
        <AdminSidebar />
        <SidebarInset className="overflow-x-hidden bg-[#f8f9ff]">
          <AdminMobileHeader />
          <main className="min-w-0 overflow-x-hidden p-1 sm:p-4">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AdminAuthGate>
  )
}

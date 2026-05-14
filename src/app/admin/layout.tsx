import { AdminAuthGate } from '@/features/admin/components/AdminAuthGate'

export const metadata = { title: 'Admin Panel | Book Your Counselling' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminAuthGate>{children}</AdminAuthGate>
}

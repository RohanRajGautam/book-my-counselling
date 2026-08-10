'use client'

import { useEffect, useState } from 'react'
import { ShieldAlert } from 'lucide-react'
import { AdminDashboardSkeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AuthModal } from '@/features/auth/components/AuthModal'

export function AdminAuthGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <FullScreenSpinner />
  return <AdminGateInner>{children}</AdminGateInner>
}

function AdminGateInner({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading && !user) return <FullScreenSpinner />
  if (!isAuthenticated) return <AuthModal />
  if (user && user.role !== 'admin') return <AccessDenied />

  return <>{children}</>
}

function FullScreenSpinner() {
  return <AdminDashboardSkeleton />
}

function AccessDenied() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4">
      <div className="text-center">
        <ShieldAlert className="mx-auto size-12 text-red-400" />
        <h1 className="mt-4 font-headline text-xl font-extrabold text-slate-950">
          Access Denied
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          This area is restricted to administrators.
        </p>
      </div>
    </div>
  )
}

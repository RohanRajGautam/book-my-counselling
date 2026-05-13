'use client'

import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './AuthModal'


export function MentorAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (isLoading && !user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 animate-spin text-blue-600" />
          <p className="text-sm font-semibold text-slate-500">Loading your dashboard…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthModal />
  }

  return <>{children}</>
}

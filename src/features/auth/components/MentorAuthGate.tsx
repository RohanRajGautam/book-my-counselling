'use client'

import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './AuthModal'
import { MentorProfileSetup } from './MentorProfileSetup'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

export function MentorAuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  if (authLoading && !user) {
    return <FullScreenSpinner label="Loading your dashboard…" />
  }

  if (!isAuthenticated) {
    return <AuthModal />
  }

  return <ProfileGate>{children}</ProfileGate>
}

function ProfileGate({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading: profileLoading, isProfileMissing } = useMentorProfile()

  if (profileLoading && !profile && !isProfileMissing) {
    return <FullScreenSpinner label="Loading your profile…" />
  }

  if (isProfileMissing) {
    return <MentorProfileSetup />
  }

  return <>{children}</>
}

function FullScreenSpinner({ label }: { label: string }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-blue-600" />
        <p className="text-sm font-semibold text-slate-500">{label}</p>
      </div>
    </div>
  )
}

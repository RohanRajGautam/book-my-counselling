'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './AuthModal'
import { MentorProfileSetup } from './MentorProfileSetup'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

export function MentorAuthGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <FullScreenSpinner />
  }

  return <AuthenticatedGate>{children}</AuthenticatedGate>
}

function AuthenticatedGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()

  if (authLoading && !user) {
    return <FullScreenSpinner />
  }

  if (!isAuthenticated) {
    return <AuthModal />
  }

  return <ProfileGate>{children}</ProfileGate>
}

function ProfileGate({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading: profileLoading, isProfileMissing } = useMentorProfile()

  if (profileLoading && !profile && !isProfileMissing) {
    return <FullScreenSpinner />
  }

  if (isProfileMissing) {
    return <MentorProfileSetup />
  }

  return <>{children}</>
}

function FullScreenSpinner() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff]">
      <Loader2 className="size-8 animate-spin text-blue-600" />
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Clock, Loader2, LogOut, XCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { AuthModal } from './AuthModal'
import { MentorProfileSetup } from './MentorProfileSetup'
import { useMentorProfile } from '@/features/mentor-dashboard/hooks/useMentorProfile'

export function MentorAuthGate({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <FullScreenSpinner />
  return <AuthenticatedGate>{children}</AuthenticatedGate>
}

function AuthenticatedGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth()
  const router = useRouter()

  if (authLoading && !user) return <FullScreenSpinner />
  if (!isAuthenticated) return <AuthModal />

  // Admins don't have mentor profiles — send them to the admin panel
  if (user?.role === 'admin') {
    router.replace('/admin')
    return <FullScreenSpinner />
  }

  return <ProfileGate>{children}</ProfileGate>
}

function ProfileGate({ children }: { children: React.ReactNode }) {
  const { data: profile, isLoading: profileLoading, isProfileMissing, isWrongRole } = useMentorProfile()
  const { logout } = useAuth()

  // Still loading first fetch
  if (profileLoading && !profile && !isProfileMissing && !isWrongRole) {
    return <FullScreenSpinner />
  }

  // No profile yet — show the setup wizard
  if (isProfileMissing) return <MentorProfileSetup />

  // Profile exists but was explicitly rejected by admin
  if (profile && (profile as unknown as { is_rejected: boolean }).is_rejected) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-red-100">
            <XCircle className="size-8 text-red-500" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Application Rejected
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            Your mentor application was not approved. If you believe this is a mistake,
            please contact support.
          </p>
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-left">
            <p className="text-xs font-extrabold uppercase tracking-wide text-red-600">
              Submitted profile
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">{profile.title}</p>
            {profile.company && (
              <p className="text-sm text-slate-500">{profile.company}</p>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-600"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </div>
    )
  }

  // Profile exists but not yet approved
  if (profile && !profile.is_verified) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-amber-100">
            <Clock className="size-8 text-amber-600" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Pending Approval
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-slate-500">
            Your mentor profile has been submitted and is under review. An admin will
            approve your account shortly.
          </p>
          <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-left">
            <p className="text-xs font-extrabold uppercase tracking-wide text-amber-700">
              Profile submitted
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">{profile.title}</p>
            {profile.company && (
              <p className="text-sm text-slate-500">{profile.company}</p>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-600"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </div>
    )
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

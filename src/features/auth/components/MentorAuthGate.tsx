'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, Loader2, LogOut, Mail, ShieldCheck, XCircle } from 'lucide-react'
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
  const { logout, user } = useAuth()

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
      <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Card */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
            {/* Hero */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 px-8 py-10 text-center">
              <div className="relative mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-amber-500 shadow-lg shadow-amber-200">
                <Clock className="size-7 text-white" />
                <span className="absolute inset-0 animate-ping rounded-2xl bg-amber-400 opacity-30" />
              </div>
              <h1 className="font-headline text-2xl font-extrabold text-slate-950">
                Application under review
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-slate-500">
                Thanks for signing up! An admin is reviewing your mentor profile.
                You&apos;ll get full access as soon as it&apos;s approved.
              </p>
            </div>

            {/* Body */}
            <div className="space-y-6 p-8">
              {/* Email notice */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/10">
                  <Mail className="size-4 text-blue-600" />
                </span>
                <div className="text-left">
                  <p className="text-sm font-extrabold text-slate-900">
                    We&apos;ll email you when approved
                  </p>
                  <p className="mt-0.5 text-xs font-medium leading-5 text-slate-500">
                    A confirmation will be sent to{' '}
                    <span className="font-bold text-slate-700">
                      {user?.email ?? 'your registered email'}
                    </span>
                    {' '}as soon as an admin approves your account. No need to keep
                    this page open.
                  </p>
                </div>
              </div>

              {/* Progress checklist */}
              <ol className="space-y-3">
                <ChecklistRow done label="Account created" />
                <ChecklistRow done label="Mentor profile submitted" />
                <ChecklistRow
                  current
                  label="Admin review in progress"
                  hint="Usually within 1–2 business days"
                />
                <ChecklistRow label="Dashboard unlocked" />
              </ol>

              {/* Submitted profile summary */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-5">
                <p className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.12em] text-slate-500">
                  <ShieldCheck className="size-3.5" />
                  Submitted profile
                </p>
                <p className="mt-2 text-sm font-extrabold text-slate-900">
                  {profile.title}
                </p>
                {profile.company && (
                  <p className="text-sm font-medium text-slate-500">{profile.company}</p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex items-center justify-center">
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold text-slate-400 transition hover:bg-white hover:text-slate-700"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
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

function ChecklistRow({
  label,
  hint,
  done = false,
  current = false,
}: {
  label: string
  hint?: string
  done?: boolean
  current?: boolean
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full ${
          done
            ? 'bg-emerald-500 text-white'
            : current
              ? 'bg-amber-100 text-amber-600 ring-2 ring-amber-300'
              : 'bg-slate-100 text-slate-300'
        }`}
      >
        {done ? (
          <CheckCircle2 className="size-3.5" />
        ) : current ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          <span className="size-1.5 rounded-full bg-current" />
        )}
      </span>
      <div className="text-left">
        <p
          className={`text-sm font-bold ${
            done ? 'text-slate-700' : current ? 'text-slate-900' : 'text-slate-400'
          }`}
        >
          {label}
        </p>
        {hint && (
          <p className="text-xs font-medium text-slate-400">{hint}</p>
        )}
      </div>
    </li>
  )
}

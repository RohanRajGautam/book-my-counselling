'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  Link2,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { completeOAuthLogin } from '@/features/auth/lib/completeOAuthLogin'
import {
  getOAuthAuthorizeUrl,
  isOAuthLinkMessage,
} from '@/features/auth/lib/oauth'
import type { OAuthProvider } from '@/features/auth/types/auth.types'

type CallbackState =
  | { kind: 'processing' }
  | { kind: 'completing'; access: string; refresh: string }
  | { kind: 'success' }
  | { kind: 'account_exists'; provider: OAuthProvider; email: string }
  | { kind: 'error'; message: string }

const POPUP_WIDTH = 520
const POPUP_HEIGHT = 620

export function AuthCallbackClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  // Derive the initial state synchronously from the URL — searchParams is
  // available on the server, and the URL fragment is read on the client when
  // window is defined. This avoids the cascade-render pattern of setState
  // inside useEffect.
  const [state, setState] = useState<CallbackState>(() => readCallbackState(searchParams))
  const completingRef = useRef(false)

  useEffect(() => {
    if (state.kind !== 'completing') return
    if (completingRef.current) return
    completingRef.current = true

    let cancelled = false
    completeOAuthLogin(state.access, state.refresh, queryClient)
      .then((user) => {
        if (cancelled) return
        window.history.replaceState(null, '', '/auth/callback')
        setState({ kind: 'success' })
        const target = user.role === 'admin' ? '/admin' : '/mentor'
        router.replace(target)
      })
      .catch((err: unknown) => {
        if (cancelled) return
        setState({
          kind: 'error',
          message: extractErrorMessage(err) ?? 'Sign-in failed. Please try again.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [state, queryClient, router])

  if (state.kind === 'success') {
    return (
      <CallbackShell>
        <StatusCard
          icon={<ShieldCheck className="size-7 text-emerald-600" />}
          title="You're signed in"
          subtitle="Redirecting you to your dashboard…"
        />
      </CallbackShell>
    )
  }

  if (state.kind === 'error') {
    return (
      <CallbackShell>
        <StatusCard
          icon={<AlertTriangle className="size-7 text-rose-600" />}
          title="Sign-in didn't complete"
          subtitle={state.message}
          action={
            <button
              type="button"
              onClick={() => router.replace('/mentor')}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700"
            >
              <ArrowLeft className="size-4" />
              Back to sign in
            </button>
          }
        />
      </CallbackShell>
    )
  }

  if (state.kind === 'account_exists') {
    return (
      <CallbackShell>
        <AccountExistsFlow
          provider={state.provider}
          email={state.email}
          onCancel={() => router.replace('/mentor')}
        />
      </CallbackShell>
    )
  }

  return (
    <CallbackShell>
      <StatusCard
        icon={<Loader2 className="size-7 animate-spin text-blue-600" />}
        title="Completing sign-in…"
        subtitle="Hang tight while we set things up."
      />
    </CallbackShell>
  )
}

// ---------------------------------------------------------------------------
// account_exists password-first flow
// ---------------------------------------------------------------------------

function AccountExistsFlow({
  provider,
  email,
  onCancel,
}: {
  provider: OAuthProvider
  email: string
  onCancel: () => void
}) {
  const queryClient = useQueryClient()
  const { loginMutation } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [linkInProgress, setLinkInProgress] = useState(false)
  const pendingLinkRef = useRef<Window | null>(null)

  const providerName = provider === 'google' ? 'Google' : 'LinkedIn'

  const triggerLinkPopup = (providerId: OAuthProvider) => {
    const authorizeUrl = getOAuthAuthorizeUrl(providerId)
    if (!authorizeUrl) {
      toast.error(
        `Linking with ${providerName} is not configured on this environment. Please contact your administrator.`,
      )
      return
    }
    const left = Math.round((window.screen.width - POPUP_WIDTH) / 2)
    const top = Math.round((window.screen.height - POPUP_HEIGHT) / 2)
    const popup = window.open(
      authorizeUrl,
      `oauth-link-${providerId}`,
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},popup=yes`,
    )
    pendingLinkRef.current = popup
  }

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      const data = event.data
      if (!isOAuthLinkMessage(data)) return
      pendingLinkRef.current = null
      setLinkInProgress(false)
      if (data.status === 'success') {
        toast.success(`${providerName} linked to your account.`)
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
      } else if (data.status === 'error') {
        toast.error(data.message || `Couldn't link ${providerName}.`)
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [providerName, queryClient])

  useEffect(() => {
    const id = window.setInterval(() => {
      const popup = pendingLinkRef.current
      if (popup && popup.closed) {
        pendingLinkRef.current = null
        setLinkInProgress(false)
      }
    }, 500)
    return () => window.clearInterval(id)
  }, [])

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 px-8 py-8">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-amber-500 shadow-lg shadow-amber-200">
            <Link2 className="size-6 text-white" />
          </span>
          <div>
            <h1 className="font-headline text-2xl font-extrabold text-slate-950">
              Link your {providerName} account
            </h1>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
              An account already exists for{' '}
              <span className="font-extrabold text-slate-800">{email}</span>. Sign in
              with your password to link your {providerName} account so you can use
              it next time.
            </p>
          </div>
        </div>
      </div>

      <form
        className="space-y-5 p-8"
        noValidate
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.currentTarget
          const formData = new FormData(form)
          const emailValue = String(formData.get('email') ?? '').trim()
          const passwordValue = String(formData.get('password') ?? '')
          if (!emailValue || !passwordValue) return

          if (linkInProgress) return
          loginMutation.mutate(
            { email: emailValue, password: passwordValue },
            {
              onSuccess: () => {
                setLinkInProgress(true)
                triggerLinkPopup(provider)
              },
              onError: (err: unknown) => {
                toast.error(
                  extractErrorMessage(err) ?? 'Invalid email or password.',
                )
              },
            },
          )
        }}
      >
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
            Email address
          </span>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Mail className="size-4 text-slate-400" />
            </span>
            <input
              name="email"
              type="email"
              defaultValue={email}
              autoComplete="email"
              required
              className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-4 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-slate-500">
            Password
          </span>
          <div className="relative mt-2">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2">
              <Lock className="size-4 text-slate-400" />
            </span>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="h-12 w-full rounded-2xl bg-[#f0f4ff] pl-11 pr-11 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loginMutation.isPending || linkInProgress}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 text-sm font-extrabold text-white shadow-md shadow-blue-200 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loginMutation.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in…
            </>
          ) : linkInProgress ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Waiting for {providerName}…
            </>
          ) : (
            <>
              <KeyRound className="size-4" />
              Sign in &amp; link {providerName}
            </>
          )}
        </button>

        <p className="text-center text-xs font-medium text-slate-500">
          You&apos;ll get a short pop-up asking for your {providerName} consent.{' '}
          <button
            type="button"
            onClick={onCancel}
            className="font-extrabold text-blue-600 hover:underline"
          >
            Cancel
          </button>{' '}
          and sign in with your password only.
        </p>
      </form>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readCallbackState(searchParams: ReturnType<typeof useSearchParams>): CallbackState {
  const err = searchParams.get('error')
  if (err === 'account_exists') {
    const provider = searchParams.get('provider') as OAuthProvider | null
    const email = searchParams.get('email') ?? ''
    if (provider === 'google' || provider === 'linkedin') {
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        // fall through to the token-extraction branch below
      } else {
        return { kind: 'account_exists', provider, email }
      }
    } else {
      return {
        kind: 'error',
        message: 'Sign-in failed. Please try again.',
      }
    }
  } else if (err) {
    const detail = searchParams.get('message')
    return {
      kind: 'error',
      message: detail ?? 'Sign-in failed. Please try again.',
    }
  }

  if (typeof window === 'undefined') {
    return { kind: 'processing' }
  }

  const hash = window.location.hash
  if (!hash) {
    return { kind: 'processing' }
  }
  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  const access = params.get('access_token')
  const refresh = params.get('refresh_token')
  if (!access || !refresh) {
    return {
      kind: 'error',
      message:
        "We couldn't complete sign-in. The sign-in link is missing required tokens. Please try again.",
    }
  }
  return { kind: 'completing', access, refresh }
}

function extractErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}

function CallbackShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200">
            <ShieldCheck className="size-6 text-white" />
          </div>
          <h1 className="font-headline text-2xl font-extrabold text-slate-950">
            Book Your Counselling
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">
            Sign in to access your dashboard
          </p>
        </div>
        {children}
        <p className="mt-6 text-center text-xs font-medium text-slate-400">
          Book Your Counselling — Mentor Portal
        </p>
      </div>
    </div>
  )
}

function StatusCard({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <div className="rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
        {icon}
      </div>
      <h2 className="font-headline text-xl font-extrabold text-slate-950">
        {title}
      </h2>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
        {subtitle}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

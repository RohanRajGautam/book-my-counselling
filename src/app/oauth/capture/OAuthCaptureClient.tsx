'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { AlertTriangle, Loader2, ShieldCheck } from 'lucide-react'
import { linkOAuthProvider } from '@/features/auth/api/auth.api'
import {
  getOAuthCaptureUrl,
  parseOAuthLinkState,
  postOAuthLinkResult,
} from '@/features/auth/lib/oauth'
import type { OAuthProvider } from '@/features/auth/types/auth.types'

type CaptureState =
  | { kind: 'verifying' }
  | { kind: 'linking'; provider: OAuthProvider }
  | { kind: 'success'; provider: OAuthProvider }
  | { kind: 'cancelled'; provider: OAuthProvider | null }
  | { kind: 'error'; provider: OAuthProvider | null; message: string }

export function OAuthCaptureClient() {
  const searchParams = useSearchParams()
  const [state, setState] = useState<CaptureState>(() => readCaptureState(searchParams))
  const linkingRef = useRef(false)

  // Drive the popup-side accounting: tell the opener we're closing, then
  // close ourselves. Only runs after we transition out of the initial state.
  useEffect(() => {
    if (
      state.kind === 'success' ||
      state.kind === 'cancelled' ||
      state.kind === 'error'
    ) {
      const id = window.setTimeout(() => window.close(), 600)
      return () => window.clearTimeout(id)
    }
    return undefined
  }, [state.kind])

  // Fire the link OAuth call exactly once when state is `linking`.
  useEffect(() => {
    if (state.kind !== 'linking') return
    if (linkingRef.current) return
    linkingRef.current = true

    let cancelled = false
    const provider = state.provider

    const params = searchParams ?? new URLSearchParams(window.location.search)
    const code = params.get('code') ?? ''

    linkOAuthProvider({
      provider,
      code,
      redirect_uri: getOAuthCaptureUrl(),
    })
      .then(() => {
        if (cancelled) return
        setState({ kind: 'success', provider })
        postOAuthLinkResult(
          {
            type: 'byc:oauth-link',
            status: 'success',
            provider,
          },
          window.opener,
        )
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = extractErrorMessage(err) ?? 'Could not link account.'
        setState({ kind: 'error', provider, message })
        postOAuthLinkResult(
          {
            type: 'byc:oauth-link',
            status: 'error',
            provider,
            message,
          },
          window.opener,
        )
      })

    return () => {
      cancelled = true
    }
  }, [state, searchParams])

  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f0f4ff] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <CaptureBody state={state} />
      </div>
    </div>
  )
}

function readCaptureState(
  searchParams: ReturnType<typeof useSearchParams>,
): CaptureState {
  if (typeof window === 'undefined') return { kind: 'verifying' }

  const params = searchParams ?? new URLSearchParams(window.location.search)
  const code = params.get('code')
  const stateParam = params.get('state')
  const provider = parseOAuthLinkState(stateParam)
  const error = params.get('error')
  const errorDescription = params.get('error_description')

  if (error) {
    postOAuthLinkResult(
      {
        type: 'byc:oauth-link',
        status: 'cancelled',
        provider: provider ?? 'google',
      },
      window.opener,
    )
    return { kind: 'cancelled', provider }
  }

  if (!provider) {
    const message =
      'The sign-in link is missing or unrecognized. Please try again from the settings page.'
    postOAuthLinkResult(
      {
        type: 'byc:oauth-link',
        status: 'error',
        provider: 'google',
        message,
      },
      window.opener,
    )
    return { kind: 'error', provider: null, message }
  }

  if (!code) {
    const message =
      errorDescription ?? 'The provider did not return an authorization code.'
    postOAuthLinkResult(
      {
        type: 'byc:oauth-link',
        status: 'error',
        provider,
        message,
      },
      window.opener,
    )
    return { kind: 'error', provider, message }
  }

  return { kind: 'linking', provider }
}

function CaptureBody({ state }: { state: CaptureState }) {
  if (state.kind === 'linking' || state.kind === 'verifying') {
    const label =
      state.kind === 'linking'
        ? `Linking ${labelFor(state.provider)}…`
        : 'Verifying your sign-in…'
    return (
      <>
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-blue-50">
          <Loader2 className="size-7 animate-spin text-blue-600" />
        </span>
        <h1 className="font-headline text-xl font-extrabold text-slate-950">
          {label}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          This window will close automatically when the link is complete.
        </p>
      </>
    )
  }
  if (state.kind === 'success') {
    return (
      <>
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-emerald-50">
          <ShieldCheck className="size-7 text-emerald-600" />
        </span>
        <h1 className="font-headline text-xl font-extrabold text-slate-950">
          {labelFor(state.provider)} linked
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          You can now sign in with {labelFor(state.provider)} next time. This window
          is closing.
        </p>
      </>
    )
  }
  if (state.kind === 'cancelled') {
    return (
      <>
        <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-slate-50">
          <AlertTriangle className="size-7 text-slate-400" />
        </span>
        <h1 className="font-headline text-xl font-extrabold text-slate-950">
          Link cancelled
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          You can close this window and try again.
        </p>
      </>
    )
  }
  return (
    <>
      <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-rose-50">
        <AlertTriangle className="size-7 text-rose-600" />
      </span>
      <h1 className="font-headline text-xl font-extrabold text-slate-950">
        We couldn&apos;t link your account
      </h1>
      <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
        {state.message}
      </p>
      <p className="mt-4 text-xs font-medium text-slate-400">
        You can close this window and try again.
      </p>
    </>
  )
}

function labelFor(provider: OAuthProvider | null): string {
  if (provider === 'google') return 'Google'
  if (provider === 'linkedin') return 'LinkedIn'
  return 'your provider'
}

function extractErrorMessage(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}

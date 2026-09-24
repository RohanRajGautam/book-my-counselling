'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Link2, Unlink } from 'lucide-react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useOAuthLink, useOAuthUnlink } from '@/features/auth/hooks/useOAuthLink'
import {
  getOAuthAuthorizeUrl,
  isOAuthLinkMessage,
} from '@/features/auth/lib/oauth'
import type { OAuthProvider } from '@/features/auth/types/auth.types'
import { GoogleMark, LinkedInMark } from '@/components/brand/OAuthBrandMarks'

const POPUP_WIDTH = 520
const POPUP_HEIGHT = 620

type ProviderId = OAuthProvider

const PROVIDERS: Array<{
  id: ProviderId
  label: string
  description: string
}> = [
  {
    id: 'google',
    label: 'Google',
    description: 'Sign in with your Google account next time.',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Sign in with your LinkedIn account next time.',
  },
]

export function ProfileConnectedAccountsCard() {
  const { data: user } = useCurrentUser()
  const linkMutation = useOAuthLink()
  const unlinkMutation = useOAuthUnlink()
  const [linkingProvider, setLinkingProvider] = useState<ProviderId | null>(null)
  const [pendingPopup, setPendingPopup] = useState<Window | null>(null)

  const linkedProviders = new Set(user?.oauth_providers ?? [])

  // Listen for the popup's postMessage handshake. Cleanup on unmount.
  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (!isOAuthLinkMessage(event.data)) return
      const provider = event.data.provider
      setLinkingProvider(null)
      setPendingPopup(null)
      if (event.data.status === 'success') {
        toast.success(
          `${labelFor(provider)} linked to your account.`,
        )
      } else if (event.data.status === 'error') {
        toast.error(
          event.data.message || `Couldn't link ${labelFor(provider)}.`,
        )
      }
      // cancelled → no toast
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Detect when the popup is closed without sending a message (browser
  // permissions, popup blocker, user closed mid-flight). Reset pending state.
  useEffect(() => {
    if (!pendingPopup) return
    const id = window.setInterval(() => {
      if (pendingPopup.closed) {
        setPendingPopup(null)
        setLinkingProvider(null)
      }
    }, 500)
    return () => window.clearInterval(id)
  }, [pendingPopup])

  function startLink(provider: ProviderId) {
    const authorizeUrl = getOAuthAuthorizeUrl(provider)
    if (!authorizeUrl) {
      toast.error(
        `Linking with ${labelFor(provider)} is not configured on this environment.`,
      )
      return
    }
    const left = Math.round((window.screen.width - POPUP_WIDTH) / 2)
    const top = Math.round((window.screen.height - POPUP_HEIGHT) / 2)
    const popup = window.open(
      authorizeUrl,
      `oauth-link-${provider}`,
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},popup=yes`,
    )
    if (!popup) {
      toast.error('Pop-up blocked. Please allow pop-ups and try again.')
      return
    }
    setPendingPopup(popup)
    setLinkingProvider(provider)
  }

  function handleUnlink(provider: ProviderId) {
    unlinkMutation.mutate(provider, {
      onSuccess: () => toast.success(`${labelFor(provider)} unlinked.`),
      onError: (err: unknown) => {
        const message = extractApiError(err) ?? `Couldn't unlink ${labelFor(provider)}.`
        toast.error(message)
      },
    })
  }

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Link2 className="size-5" />
        </div>
        <div>
          <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
            Connected Accounts
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Link a third-party account so you can sign in without a password.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {PROVIDERS.map((provider) => {
          const isLinked = linkedProviders.has(provider.id)
          const isLinkingThis =
            linkingProvider === provider.id && Boolean(pendingPopup) && !pendingPopup?.closed
          const isMutating =
            (linkMutation.isPending && linkMutation.variables?.provider === provider.id) ||
            unlinkMutation.isPending
          return (
            <ConnectedAccountRow
              key={provider.id}
              label={provider.label}
              description={provider.description}
              icon={provider.id === 'google' ? <GoogleMark className="size-6" /> : <LinkedInMark className="size-6" />}
              isLinked={isLinked}
              isLinking={isLinkingThis}
              isMutating={isMutating}
              onLink={() => startLink(provider.id)}
              onUnlink={() => handleUnlink(provider.id)}
            />
          )
        })}
      </div>

      <p className="mt-6 text-xs font-medium text-slate-500">
        Unlinking a provider keeps your password sign-in active. We won&apos;t
        remove the last sign-in method — your account must always have at least one.
      </p>
    </section>
  )
}

function ConnectedAccountRow({
  label,
  description,
  icon,
  isLinked,
  isLinking,
  isMutating,
  onLink,
  onUnlink,
}: {
  label: string
  description: string
  icon: React.ReactNode
  isLinked: boolean
  isLinking: boolean
  isMutating: boolean
  onLink: () => void
  onUnlink: () => void
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-[#f8f9ff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white shadow-[0_2px_6px_rgba(15,23,42,0.06)]">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-slate-900">{label}</p>
          <p className="mt-0.5 text-xs font-medium text-slate-500">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-auto">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide ${
            isLinked
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}
          aria-label={isLinked ? `${label} linked` : `${label} not linked`}
        >
          <span
            className={`size-1.5 rounded-full ${
              isLinked ? 'bg-emerald-500' : 'bg-slate-400'
            }`}
          />
          {isLinked ? 'Linked' : 'Not linked'}
        </span>

        {isLinked ? (
          <button
            type="button"
            onClick={onUnlink}
            disabled={isMutating}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-rose-600 transition hover:bg-rose-50 hover:border-rose-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Unlink className="size-4" />
            Unlink
          </button>
        ) : (
          <button
            type="button"
            onClick={onLink}
            disabled={isLinking || isMutating}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Link2 className="size-4" />
            {isLinking ? 'Opening…' : 'Link'}
          </button>
        )}
      </div>
    </div>
  )
}

function labelFor(provider: ProviderId): string {
  return provider === 'google' ? 'Google' : 'LinkedIn'
}

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}

'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Link2, X } from 'lucide-react'
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser'
import { useOAuthLink, useOAuthUnlink } from '@/features/auth/hooks/useOAuthLink'
import { getOAuthAuthorizeUrl, isOAuthLinkMessage } from '@/features/auth/lib/oauth'
import { GoogleMark } from '@/components/brand/OAuthBrandMarks'

const POPUP_WIDTH = 520
const POPUP_HEIGHT = 620

export function ProfileConnectedAccountsCard() {
  const { data: user } = useCurrentUser()
  const linkMutation = useOAuthLink()
  const unlinkMutation = useOAuthUnlink()
  const [pendingPopup, setPendingPopup] = useState<Window | null>(null)
  const [linking, setLinking] = useState(false)

  const isLinked = user?.oauth_providers?.includes('google') ?? false
  const isLinking = linking && !!pendingPopup && !pendingPopup.closed
  const isMutating =
    (linkMutation.isPending && linkMutation.variables?.provider === 'google') ||
    unlinkMutation.isPending

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin) return
      if (!isOAuthLinkMessage(event.data)) return
      setLinking(false)
      setPendingPopup(null)
      if (event.data.status === 'success') {
        toast.success('Google linked to your account.')
      } else if (event.data.status === 'error') {
        toast.error(event.data.message || "Couldn't link Google.")
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!pendingPopup) return
    const id = window.setInterval(() => {
      if (pendingPopup.closed) {
        setPendingPopup(null)
        setLinking(false)
      }
    }, 500)
    return () => window.clearInterval(id)
  }, [pendingPopup])

  function startLink() {
    const authorizeUrl = getOAuthAuthorizeUrl('google')
    if (!authorizeUrl) {
      toast.error('Linking with Google is not configured on this environment.')
      return
    }
    const left = Math.round((window.screen.width - POPUP_WIDTH) / 2)
    const top = Math.round((window.screen.height - POPUP_HEIGHT) / 2)
    const popup = window.open(
      authorizeUrl,
      'oauth-link-google',
      `width=${POPUP_WIDTH},height=${POPUP_HEIGHT},left=${left},top=${top},popup=yes`,
    )
    if (!popup) {
      toast.error('Pop-up blocked. Please allow pop-ups and try again.')
      return
    }
    setPendingPopup(popup)
    setLinking(true)
  }

  function handleUnlink() {
    unlinkMutation.mutate('google', {
      onSuccess: () => toast.success('Google unlinked.'),
      onError: (err: unknown) => {
        const message = extractApiError(err) ?? "Couldn't unlink Google."
        toast.error(message)
      },
    })
  }

  return (
    <section className="rounded-[28px] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.04)] sm:p-8">
      <div className="flex items-center gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
          <Link2 className="size-5" />
        </div>
        <div className="min-w-0">
          <h2 className="font-headline text-xl font-extrabold text-slate-950 sm:text-2xl">
            Connected Accounts
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500">
            Link a third-party account so you can sign in without a password.
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-slate-100 px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#eef4ff]">
            <GoogleMark className="size-6" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">Google</p>
            <p className="mt-0.5 truncate text-xs text-slate-500">
              Sign in with your Google account next time.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {isLinked ? (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Connected
              </span>
              <button
                type="button"
                onClick={handleUnlink}
                disabled={isMutating}
                aria-label="Unlink Google"
                className="flex size-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X className="size-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={startLink}
              disabled={isLinking || isMutating}
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-full bg-blue-600 px-3.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Link2 className="size-3.5" />
              {isLinking ? 'Opening…' : 'Link'}
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs font-medium text-slate-500">
        Unlinking keeps your password sign-in active. We won&apos;t remove the
        last sign-in method — your account must always have at least one.
      </p>
    </section>
  )
}

function extractApiError(err: unknown): string | null {
  if (!err || typeof err !== 'object') return null
  const e = err as Record<string, unknown>
  const response = e['response'] as Record<string, unknown> | undefined
  const data = response?.['data'] as Record<string, unknown> | undefined
  if (typeof data?.['detail'] === 'string') return data['detail']
  return null
}

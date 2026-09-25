'use client'

import { GoogleMark, LinkedInMark } from '@/components/brand/OAuthBrandMarks'
import { getOAuthLoginUrl } from '../lib/oauth'
import type { OAuthProvider } from '../types/auth.types'

type Variant = 'login' | 'register'

/**
 * Which audience is viewing these buttons. OAuth sign-in only provisions
 * mentor accounts today (mentees sign in with email + password), so the
 * buttons are hidden on mentee-facing auth screens to avoid the dead-end
 * where a mentee completes the consent screen and lands in the mentor
 * product. Defaults to `mentor`; pass `'mentee'` to suppress rendering.
 */
type Audience = 'mentor' | 'mentee'

type OAuthButtonsProps = {
  /** Controls the intro label between the divider and the buttons. */
  variant?: Variant
  /** Render the buttons stacked full-width (default) or inline. */
  layout?: 'stack' | 'row'
  /**
   * Which audience the surrounding auth screen is for. The buttons render
   * only for `mentor`; passing `mentee` returns `null`.
   */
  audience?: Audience
}

const PROVIDERS: Array<{ id: OAuthProvider; label: string }> = []

/**
 * OAuth entrypoint buttons for the password auth screen. Each button is a
 * plain `<a href>` so the browser handles the 302 → provider → 302 → callback
 * chain natively (no fetch/XHR needed; the SPA would otherwise mishandle
 * external redirects).
 */
export function OAuthButtons({
  variant = 'login',
  layout = 'stack',
  audience = 'mentor',
}: OAuthButtonsProps) {
  if (audience === 'mentee') return null
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 text-[11px] font-extrabold tracking-[0.16em] text-slate-400 uppercase">
        <span className="h-px flex-1 bg-slate-100" />
        <span>{variant === 'register' ? 'or sign up with' : 'or continue with'}</span>
        <span className="h-px flex-1 bg-slate-100" />
      </div>

      <div className={layout === 'row' ? 'grid grid-cols-2 gap-3' : 'space-y-3'}>
        {PROVIDERS.map((provider) => (
          <OAuthButton key={provider.id} provider={provider.id} label={provider.label} />
        ))}
      </div>
    </div>
  )
}

function OAuthButton({
  provider,
  label,
}: {
  provider: OAuthProvider
  label: string
}) {
  let href = ''
  try {
    href = getOAuthLoginUrl(provider)
  } catch {
    // NEXT_PUBLIC_API_URL is not configured at build time — this is a
    // deploy-time concern, not a runtime UX state. Returning null keeps the
    // divider clean; production deploys with the env set will never hit this
    // branch and users will see both buttons.
    return null
  }

  return (
    <a
      href={href}
      className="group flex h-12 w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-[0_1px_0_rgba(15,23,42,0.04)] transition hover:border-blue-200 hover:bg-blue-50/60 hover:text-slate-900 hover:shadow-[0_6px_18px_rgba(0,74,198,0.08)] active:translate-y-px"
    >
      <span className="size-5 shrink-0">
        {provider === 'google' ? (
          <GoogleMark className="size-5" />
        ) : (
          <LinkedInMark className="size-5" />
        )}
      </span>
      <span>
        Continue with <span className="font-extrabold">{label}</span>
      </span>
    </a>
  )
}

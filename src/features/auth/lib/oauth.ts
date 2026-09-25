import type { OAuthProvider } from '../types/auth.types'

/**
 * Frontend route that the OAuth provider is configured to redirect to during
 * the LINK flow. The popup lands here, reads the `code`/`state` from the URL,
 * forwards them to the backend, then posts the result back to the opener.
 *
 * The LOGIN flow uses `/auth/callback` instead because the backend redirects
 * there directly with tokens in the URL fragment.
 */
export const OAUTH_CAPTURE_PATH = '/oauth/capture'

export function getOAuthCaptureUrl(): string {
  if (typeof window === 'undefined') return OAUTH_CAPTURE_PATH
  return `${window.location.origin}${OAUTH_CAPTURE_PATH}`
}

/**
 * The backend's OAuth login entrypoints. The backend handles the provider
 * dance and 302-redirects back to `${FRONTEND_BASE_URL}/auth/callback`. We
 * use absolute URLs so they work from any page in the SPA — the backend is
 * configured to redirect back to the configured frontend base, not to the
 * current path. Plain `<a href>` would also work but `<Link>` integrates with
 * Next.js's prefetch and we don't prefetch OAuth entrypoints, so a window
 * navigation is the safest choice.
 */
export function getOAuthLoginUrl(provider: OAuthProvider): string {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) throw new Error('NEXT_PUBLIC_API_URL is not configured')
  return `${base.replace(/\/$/, '')}/auth/oauth/${provider}/login`
}

export function getOAuthAuthorizeUrl(provider: OAuthProvider): string | null {
  // The frontend builds the popup-to-provider URL using these env vars. Both
  // are public client_ids and safe to ship to the browser. Return null when
  // missing so callers can render a disabled / hidden state instead of a
  // broken link.
  const captureUrl = getOAuthCaptureUrl()
  // The provider echoes `state` back to /oauth/capture, so we encode the
  // provider into the value. The capture page parses it to know which
  // provider to forward to the backend.
  const state = `oauth_link:${provider}`
  if (provider === 'google') {
    const clientId = process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID
    if (!clientId) return null
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: captureUrl,
      response_type: 'code',
      scope: 'openid email profile',
      state,
      prompt: 'select_account',
    })
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }
  if (provider === 'linkedin') {
    const clientId = process.env.NEXT_PUBLIC_OAUTH_LINKEDIN_CLIENT_ID
    if (!clientId) return null
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      redirect_uri: captureUrl,
      scope: 'openid email profile',
      state,
    })
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`
  }
  return null
}

/**
 * Parses the `state` value emitted by getOAuthAuthorizeUrl. Returns the
 * provider id if the value matches our format, otherwise null. Used by
 * /oauth/capture to know which provider's link endpoint to call.
 */
export function parseOAuthLinkState(stateValue: string | null): OAuthProvider | null {
  if (!stateValue) return null
  const match = stateValue.match(/^oauth_link:(google|linkedin)$/)
  if (!match) return null
  const provider = match[1]
  return provider === 'google' || provider === 'linkedin' ? provider : null
}

// ---------------------------------------------------------------------------
// Popup → opener handshake
// ---------------------------------------------------------------------------

/**
 * postMessage envelope used by /oauth/capture to talk to its opener. The
 * payload is intentionally small and JSON-safe; the provider's `code` never
 * leaves the popup (the backend reads it from the popup window, not from the
 * parent).
 */
export type OAuthLinkMessage =
  | { type: 'byc:oauth-link'; status: 'success'; provider: OAuthProvider }
  | { type: 'byc:oauth-link'; status: 'error'; provider: OAuthProvider; message: string }
  | { type: 'byc:oauth-link'; status: 'cancelled'; provider: OAuthProvider }

export function postOAuthLinkResult(message: OAuthLinkMessage, target: Window | null) {
  if (!target) return
  target.postMessage(message, window.location.origin)
}

export function isOAuthLinkMessage(value: unknown): value is OAuthLinkMessage {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  if (v['type'] !== 'byc:oauth-link') return false
  return ['success', 'error', 'cancelled'].includes(String(v['status']))
}

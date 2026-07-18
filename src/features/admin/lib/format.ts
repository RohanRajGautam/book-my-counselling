// ── Money ─────────────────────────────────────────────────────────────────

/**
 * Format a number as NPR currency. Backend returns plain floats (no decimals
 * assumptions); we render with thousands separators and the NPR suffix.
 */
export function formatNPR(amount: number, options?: { cents?: boolean }): string {
  const fractionDigits = options?.cents ? 2 : 0
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
  return amount < 0 ? `-NPR ${formatted.replace('-', '')}` : `NPR ${formatted}`
}

/** Compact form for trend deltas and small labels (e.g. "NPR 4.5K"). */
export function formatNPRCompact(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `NPR ${(amount / 1_000_000).toFixed(1)}M`
  }
  if (Math.abs(amount) >= 1_000) {
    return `NPR ${(amount / 1_000).toFixed(1)}K`
  }
  return `NPR ${Math.round(amount)}`
}

// ── Dates ─────────────────────────────────────────────────────────────────

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

// ── Initials ──────────────────────────────────────────────────────────────

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((p) => p[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

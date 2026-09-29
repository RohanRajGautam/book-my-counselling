'use client'

import { useState } from 'react'
import { AlertTriangle, Check, ChevronDown, ChevronRight } from 'lucide-react'

/**
 * Page-level info callout for `/admin/outside-sessions`. Always visible by
 * default; collapsible on the chevron. Carries the load-bearing "what this
 * does / does NOT do" copy so admins understand that these rows are kept
 * out of revenue / payout / Bookings-list dashboards.
 *
 * Styling mirrors `AdminRecordSessionModal`'s inline InfoCallout so the
 * two pages visually rhyme.
 */
export function OutsideSessionsInfoCallout() {
  const [open, setOpen] = useState(true)
  return (
    <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-4 text-blue-950 sm:p-5">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 text-[11px] font-extrabold tracking-wide text-blue-700 uppercase"
        aria-expanded={open}
      >
        {open ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
        What this does
      </button>
      {open ? (
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
              Does
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" strokeWidth={2.6} />
                <span>
                  Records the session so it appears in the mentor&apos;s total_sessions count.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" strokeWidth={2.6} />
                <span>
                  For sessions that already happened, sends the mentee a link to leave a review.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 size-3.5 shrink-0 text-emerald-600" strokeWidth={2.6} />
                <span>
                  Auto-creates a mentee account if the email is new. The mentee gets the review
                  email; they cannot log in unless they later reset their password.
                </span>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
              Does not
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 size-3.5 shrink-0 text-slate-400"
                  strokeWidth={2.6}
                />
                <span>Charge the mentee — the numbers you enter are for the record only.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 size-3.5 shrink-0 text-slate-400"
                  strokeWidth={2.6}
                />
                <span>
                  Trigger a payout. Pay the mentor manually using whatever offline method was
                  agreed.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 size-3.5 shrink-0 text-slate-400"
                  strokeWidth={2.6}
                />
                <span>Show up on the platform revenue dashboard or in the payout queue.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle
                  className="mt-0.5 size-3.5 shrink-0 text-slate-400"
                  strokeWidth={2.6}
                />
                <span>Show up in the Bookings list — it&apos;s a separate table.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
      {open ? <p className="mt-4 border-t border-blue-100 pt-3 text-xs text-blue-950"></p> : null}
    </div>
  )
}

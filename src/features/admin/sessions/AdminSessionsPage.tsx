'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, CalendarClock, Check, ExternalLink, Plus, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AdminPageHeader } from '../layout/AdminPageHeader'
import { AdminRecordSessionModal } from '../bookings/components/AdminRecordSessionModal'

export function AdminSessionsPage() {
  const [recordOpen, setRecordOpen] = useState(false)

  return (
    <div className="min-h-svh overflow-x-hidden bg-[#f8f9ff] text-slate-950">
      <div className="mx-auto w-full max-w-[1080px] space-y-6 px-3 py-5 sm:space-y-8 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <AdminPageHeader
          title="Offline Sessions"
          subtitle="Record mentor sessions that happened (or will happen) outside the platform's normal booking flow — payment crashed, WhatsApp booking, or any session that needs to be backfilled so the mentor gets paid and the mentee gets a review link."
          action={
            <Button
              size="sm"
              className="gap-1.5 rounded-lg bg-[#0755d8] px-4 py-6 font-bold text-white shadow-sm hover:bg-blue-700"
              onClick={() => setRecordOpen(true)}
            >
              <Plus className="size-4" strokeWidth={2.6} />
              Record session
            </Button>
          }
        />

        {/* Single primary-action surface — the whole page is built around this
            one button. Recent offline-only sessions aren't filterable yet (no
            `created_by_admin_id` in the booking response), so we link out to
            Bookings for "view what you've recorded". */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <section
            aria-label="What recording a session does"
            className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="flex items-center gap-2">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0755d8] ring-1 ring-blue-100">
                <CalendarClock className="size-4" strokeWidth={2.4} />
              </span>
              <h2 className="font-headline text-base font-extrabold text-slate-950 sm:text-lg">
                What recording a session does
              </h2>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                  Does
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-emerald-600"
                      strokeWidth={2.6}
                    />
                    <span>
                      Writes a real booking so the mentor is paid their share and
                      the session shows up in payout reports.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-emerald-600"
                      strokeWidth={2.6}
                    />
                    <span>
                      For sessions that already happened, sends the mentee a
                      review link by email.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-emerald-600"
                      strokeWidth={2.6}
                    />
                    <span>
                      Auto-creates a mentee account if the email is new (the
                      mentee receives emails but cannot log in until they reset
                      their password).
                    </span>
                  </li>
                </ul>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                  Does not
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <X
                      className="mt-0.5 size-4 shrink-0 text-slate-400"
                      strokeWidth={2.6}
                    />
                    <span>Charge the mentee — the price you enter is for the record only.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X
                      className="mt-0.5 size-4 shrink-0 text-slate-400"
                      strokeWidth={2.6}
                    />
                    <span>Refund anything — there is no Fonepay transaction to reverse.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <X
                      className="mt-0.5 size-4 shrink-0 text-slate-400"
                      strokeWidth={2.6}
                    />
                    <span>Change the mentor&apos;s availability — past sessions have no slot to free up.</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">
                <p>
                  <span className="font-extrabold text-amber-900">Heads up:</span>{' '}
                  for accounting purposes, sessions recorded here don&apos;t
                  show up on the platform revenue dashboard (only Fonepay-collected
                  payments do). They DO show up in the bookings count and in the
                  mentor&apos;s payout queue.
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-100 pt-5">
              <Button
                size="sm"
                className="gap-1.5 rounded-xl px-4 py-5 font-bold"
                onClick={() => setRecordOpen(true)}
              >
                <Plus className="size-4" strokeWidth={2.6} />
                Record a session
              </Button>
            </div>
          </section>

          <aside className="space-y-4 lg:space-y-5">
            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                Quick tip
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                When a mentee&apos;s payment crashes but the session still went
                ahead, open the mentor&apos;s edit page and use{' '}
                <span className="font-bold text-slate-900">
                  Record session for this mentor
                </span>{' '}
                — the mentor is pre-filled so you only need to type the mentee
                email, date, time, and price.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 gap-1.5 rounded-xl border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                nativeButton={false}
                render={<Link href="/admin/mentors" />}
              >
                <ExternalLink className="size-3.5" strokeWidth={2.6} />
                Open mentors
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm">
              <p className="text-[11px] font-extrabold tracking-wide text-slate-500 uppercase">
                After recording
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                The new session appears in{' '}
                <span className="font-bold text-slate-900">Bookings</span>{' '}
                immediately. Future sessions land as{' '}
                <span className="font-extrabold text-blue-700">CONFIRMED</span>{' '}
                and flip to{' '}
                <span className="font-extrabold text-emerald-700">COMPLETED</span>{' '}
                when the mentor marks them done.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3 gap-1.5 rounded-xl border-slate-200 bg-white text-slate-900 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                nativeButton={false}
                render={<Link href="/admin/bookings" />}
              >
                View Bookings
                <ArrowRight className="size-3.5" strokeWidth={2.6} />
              </Button>
            </div>
          </aside>
        </div>
      </div>

      <AdminRecordSessionModal
        open={recordOpen}
        onClose={() => setRecordOpen(false)}
      />
    </div>
  )
}